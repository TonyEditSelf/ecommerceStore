import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError, ok } from "@/lib/response";
import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/validators/schemas";

export async function PUT(request, { params }) {
  try {
    await requireUser("admin");
    const input = testimonialSchema.parse(await request.json());
    await connectDB();
    const item = await Testimonial.findByIdAndUpdate(params.id, input, { new: true, runValidators: true });
    return ok(item);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireUser("admin");
    await connectDB();
    const item = await Testimonial.findByIdAndDelete(params.id);
    return ok({ deleted: Boolean(item) });
  } catch (error) {
    return handleError(error);
  }
}
