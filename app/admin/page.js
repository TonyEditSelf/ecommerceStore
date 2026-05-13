import AdminWorkspace from "@/components/AdminWorkspace";
import { connectDB } from "@/lib/db";
import { serializeDocument } from "@/lib/catalog";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AdminPage() {
  await connectDB();
  const [products, totalProducts, totalOrders, totalCustomers, paidOrders] = await Promise.all([
    Product.find({}, { sort: { createdAt: -1 } }),
    Product.countDocuments({}),
    Order.countDocuments({}),
    User.countDocuments({ role: "customer" }),
    Order.find({ paymentStatus: "paid" }, { select: "total" }),
  ]);
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <AdminWorkspace
      initialProducts={serializeDocument(products)}
      stats={{ totalProducts, totalOrders, totalCustomers, totalRevenue }}
    />
  );
}
