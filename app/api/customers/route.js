import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import Order from "@/models/Order";
import Event from "@/models/Event";
import Lead from "@/models/Lead";
import { requireUser } from "@/lib/auth";

export async function GET(request) {
  try {
    await requireUser("admin");
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Get single customer details
      const [customer, orders, events, lead] = await Promise.all([
        Customer.findOne({ id }),
        Order.find({ userId: id }),
        Event.find({ customer_id: id }),
        Lead.find({ customer_id: id }).then(l => l[0] || null),
      ]);
      return NextResponse.json({ data: { customer, orders, events, lead } });
    }

    const email = searchParams.get("email");
    const customers = await Customer.find(email ? { email } : {});
    return NextResponse.json({ data: customers });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
