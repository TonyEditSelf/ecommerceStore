import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import Lead from "@/models/Lead";
import Customer from "@/models/Customer";

export async function POST(request) {
  try {
    await connectDB();
    const { eventType, metadata } = await request.json();
    const user = await getCurrentUser();

    // If not logged in, just acknowledge — no CRM tracking for anonymous users
    if (!user) {
      return NextResponse.json({ success: true, tracked: false });
    }

    // Ensure customer record exists
    let customerId = null;
    try {
      const existing = await Customer.findOne({ email: user.email });
      if (!existing) {
        const newCustomer = await Customer.create({
          name: user.name,
          email: user.email,
        });
        customerId = newCustomer.id;
      } else {
        customerId = existing.id;
      }
    } catch (err) {
      console.error("[track-event] Customer upsert failed (table may not exist):", err.message);
      return NextResponse.json({ success: true, tracked: false });
    }

    // Log event
    try {
      await Event.create({
        customer_id: customerId,
        event_type: eventType,
        metadata,
      });
    } catch (err) {
      console.error("[track-event] Event insert failed:", err.message);
    }

    // Lead automation
    try {
      if (eventType === "add_to_cart") {
        await Lead.upsert(customerId, { status: "engaged" });
      } else if (eventType === "checkout_started") {
        await Lead.upsert(customerId, { status: "high intent" });
      } else if (eventType === "purchase_completed") {
        await Lead.upsert(customerId, { status: "converted" });
      } else if (eventType === "product_view") {
        await Lead.upsert(customerId, { status: "new" });
      }
    } catch (err) {
      console.error("[track-event] Lead upsert failed:", err.message);
    }

    return NextResponse.json({ success: true, tracked: true });
  } catch (error) {
    console.error("[track-event] Error:", error.message);
    // Don't fail the user's page load over a tracking error
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
