import { connectDB } from "@/lib/db";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { fail, handleError, ok } from "@/lib/response";
import { requireUser } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import Product from "@/models/Product";
import { productSchema } from "@/validators/schemas";
import { serializeDocument } from "@/lib/catalog";

function productQuery(id) {
  if (/^[0-9a-fA-F]{24}$/.test(id)) return { _id: id }; // Legacy MongoDB
  if (/^\d+$/.test(id)) return { _id: id }; // Supabase BIGINT
  return { slug: id };
}

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const product = await Product.findOne(productQuery(params.id));
    if (!product) return fail("Product not found", 404);
    return ok(serializeDocument(product));
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requireUser("admin");
    const input = productSchema.parse(await request.json());
    await connectDB();

    const product = await Product.findOneAndUpdate(
      productQuery(params.id),
      { ...input, slug: slugify(input.title) },
      { new: true, runValidators: true }
    );

    return ok(serializeDocument(product));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireUser("admin");
    await connectDB();
    const product = await Product.findOneAndDelete(productQuery(params.id));
    return ok({ deleted: Boolean(product) });
  } catch (error) {
    return handleError(error);
  }
}
