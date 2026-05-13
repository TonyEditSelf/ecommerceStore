import { connectDB } from "@/lib/db";
import { handleError, ok } from "@/lib/response";
import Product from "@/models/Product";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = String(searchParams.get("q") || "").trim();
    const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit") || 8)));

    if (!q) {
      const items = await Product.find({}, { sort: { createdAt: -1 }, limit });
      return ok({ items });
    }

    const regex = new RegExp(escapeRegex(q), "i");
    const items = await Product.find({
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
      ],
    }, { sort: { createdAt: -1 }, limit });

    return ok({ items });
  } catch (error) {
    return handleError(error);
  }
}
