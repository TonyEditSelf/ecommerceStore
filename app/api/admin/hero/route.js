import { connectDB } from "@/lib/db";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { requireUser } from "@/lib/auth";
import { fail, handleError, ok } from "@/lib/response";
import HeroContent from "@/models/HeroContent";
import { heroSchema } from "@/validators/schemas";

export async function GET() {
  try {
    await connectDB();
    const items = await HeroContent.find({}, { sort: { sortOrder: 1, createdAt: -1 } });
    return ok({ items });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    await requireUser("admin");
    const input = heroSchema.parse(await request.json());
    await connectDB();
    
    const activeSlides = await HeroContent.find({ active: true }, { sort: { sortOrder: 1 } });
    const count = activeSlides.length;

    // 1. Validate position (max 10)
    if (input.sortOrder > 10) {
      return fail(`Invalid position. You can choose a position up to 10.`, 422);
    }

    // 2. Shifting Logic: Increment all slides from the new position onwards
    if (input.active) {
      // Find all slides that need to be shifted
      const toShift = activeSlides.filter(s => s.sort_order >= input.sortOrder);
      
      // Use Promise.all to shift them in parallel
      await Promise.all(toShift.map(slide => 
        HeroContent.findByIdAndUpdate(slide._id, { sortOrder: slide.sort_order + 1 })
      ));

      // After shifting, check if we exceed 10. If so, deactivate the last ones.
      const updatedCount = count + 1;
      if (updatedCount > 10) {
        // Find the slides that are now beyond 10 (including potentially the one we just shifted)
        const allNewActive = await HeroContent.find({ active: true }, { sort: { sortOrder: 1 } });
        const toDeactivate = allNewActive.slice(10);
        await Promise.all(toDeactivate.map(s => HeroContent.findByIdAndUpdate(s._id, { active: false })));
      }
    }

    const item = await HeroContent.create(input);
    return ok(item, 201);
  } catch (error) {
    return handleError(error);
  }
}
