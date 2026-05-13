import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleError, ok } from "@/lib/response";
import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/validators/schemas";

export async function GET() {
  try {
    await connectDB();
    const items = await Testimonial.find({}, { sort: { createdAt: -1 } });
    return ok({ items });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    await requireUser("admin");
    const input = testimonialSchema.parse(await request.json());
    await connectDB();
    const item = await Testimonial.create(input);
    return ok(item, 201);
  } catch (error) {
    return handleError(error);
  }
}
