import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError, ok } from "@/lib/response";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET() {
  try {
    await requireUser("admin");
    await connectDB();

    const [totalProducts, totalOrders, totalCustomers, paidOrders] = await Promise.all([
      Product.countDocuments({}),
      Order.countDocuments({}),
      User.countDocuments({ role: "customer" }),
      Order.find({ paymentStatus: "paid" }, { select: "total" }),
    ]);

    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    return ok({ totalProducts, totalOrders, totalCustomers, totalRevenue });
  } catch (error) {
    return handleError(error);
  }
}
