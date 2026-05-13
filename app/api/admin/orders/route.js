import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError, ok } from "@/lib/response";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    await requireUser("admin");
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(60, Math.max(1, Number(searchParams.get("limit") || 20)));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Order.find({}, { sort: { createdAt: -1 }, skip, limit, populate: "userId" }),
      Order.countDocuments({}),
    ]);

    return ok({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    return handleError(error);
  }
}
