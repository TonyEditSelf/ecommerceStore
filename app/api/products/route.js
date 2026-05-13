import { connectDB } from "@/lib/db";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { handleError, ok } from "@/lib/response";
import { requireUser } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import Product from "@/models/Product";
import { productSchema } from "@/validators/schemas";
import { serializeDocument } from "@/lib/catalog";

const FLAG_KEYS = ["featured", "latest", "bestSelling", "fastSelling"];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(60, Math.max(1, Number(searchParams.get("limit") || 12)));
    const skip = (page - 1) * limit;
    const category = searchParams.get("category");
    const flag = searchParams.get("flag");
    const q = String(searchParams.get("q") || "").trim();
    const query = {};

    if (category) query.category = category;
    if (flag && FLAG_KEYS.includes(flag)) query[`flags.${flag}`] = true;
    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      query.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
      ];
    }

    const [items, total] = await Promise.all([
      Product.find(query, { sort: { createdAt: -1 }, skip, limit }),
      Product.countDocuments(query),
    ]);

    return ok({ items: serializeDocument(items), page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    await requireUser("admin");
    const input = productSchema.parse(await request.json());
    await connectDB();

    const product = await Product.create({
      ...input,
      slug: slugify(input.title),
    });

    return ok(serializeDocument(product), 201);
  } catch (error) {
    return handleError(error);
  }
}
