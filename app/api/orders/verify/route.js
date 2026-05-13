import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { handleError, ok } from "@/lib/response";
import { requireUser } from "@/lib/auth";
import Order from "@/models/Order";
import { verifyPaymentSchema } from "@/validators/schemas";

export async function POST(request) {
  try {
    const user = await requireUser();
    const input = verifyPaymentSchema.parse(await request.json());
    await connectDB();

    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay secret is required");
    }

    const body = `${input.razorpayOrderId}|${input.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const paymentStatus = expectedSignature === input.razorpaySignature ? "paid" : "failed";

    const order = await Order.findOneAndUpdate(
      { id: input.orderId, userId: user.id, razorpayOrderId: input.razorpayOrderId },
      {
        paymentStatus,
        razorpayPaymentId: input.razorpayPaymentId,
        razorpaySignature: input.razorpaySignature,
      },
      { new: true }
    );

    return ok({ order, verified: paymentStatus === "paid" });
  } catch (error) {
    return handleError(error);
  }
}
