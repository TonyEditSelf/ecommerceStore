import { connectDB } from "@/lib/db";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { requireUser } from "@/lib/auth";
import { fail, handleError, ok } from "@/lib/response";
import HeroContent from "@/models/HeroContent";
import { heroSchema } from "@/validators/schemas";

export async function PUT(request, { params }) {
  try {
    await requireUser("admin");
    const input = heroSchema.parse(await request.json());
    await connectDB();
    
    const activeSlides = await HeroContent.find({ active: true }, { sort: { sortOrder: 1 } });

    // Shifting Logic for Update
    if (input.active) {
      const existingAtPosition = activeSlides.find(s => s.sort_order === input.sortOrder && s._id !== params.id);
      if (existingAtPosition) {
        // Shift this and all subsequent ones up
        const toShift = activeSlides.filter(s => s.sort_order >= input.sortOrder && s._id !== params.id);
        await Promise.all(toShift.map(slide => 
          HeroContent.findByIdAndUpdate(slide._id, { sortOrder: slide.sort_order + 1 })
        ));
      }
    }

    const item = await HeroContent.findByIdAndUpdate(params.id, input, { new: true, runValidators: true });
    return ok(item);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireUser("admin");
    await connectDB();
    const item = await HeroContent.findByIdAndDelete(params.id);
    return ok({ deleted: Boolean(item) });
  } catch (error) {
    return handleError(error);
  }
}
