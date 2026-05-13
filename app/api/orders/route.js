import { connectDB, getSupabaseAdmin } from "@/lib/db";
import { getRazorpay } from "@/lib/razorpay";
import { handleError, ok } from "@/lib/response";
import { requireUser } from "@/lib/auth";
import Order from "@/models/Order";
import { createOrderSchema } from "@/validators/schemas";

export async function GET() {
  try {
    const user = await requireUser();
    await connectDB();
    const orders = await Order.find({ userId: user.id }, { sort: { createdAt: -1 } });
    return ok({ items: orders });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    const user = await requireUser();
    const input = createOrderSchema.parse(await request.json());
    const db = await connectDB();

    // Query Supabase directly — the Product model's .in() has type coercion issues
    const ids = input.products.map((item) => Number(item.productId));
    const { data: products, error: prodError } = await db
      .from("products")
      .select("*")
      .in("id", ids);

    if (prodError) throw prodError;

    // Build lookup map keyed by string ID
    const productMap = new Map();
    for (const p of (products || [])) {
      productMap.set(String(p.id), p);
    }

    const orderProducts = input.products.map((item) => {
      const product = productMap.get(String(item.productId));
      if (!product) throw new Error(`Product not found (id: ${item.productId})`);
      return {
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const total = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `ags_${Date.now()}`,
      notes: { userId: user.id.toString() },
    });

    const order = await Order.create({
      userId: user.id,
      products: orderProducts,
      total,
      paymentStatus: "created",
      razorpayOrderId: razorpayOrder.id,
    });

    return ok({
      order,
      razorpayOrder,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    }, 201);
  } catch (error) {
    return handleError(error);
  }
}
