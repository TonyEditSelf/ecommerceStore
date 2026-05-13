import { requireUser } from "@/lib/auth";
import { uploadToImageKit } from "@/lib/imagekit";
import { handleError, ok } from "@/lib/response";

export async function POST(request) {
  try {
    await requireUser("admin");
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files.length) {
      throw new Error("At least one file is required");
    }

    // Upload sequentially to avoid race conditions
    const uploads = [];
    for (const file of files) {
      try {
        console.log("[upload] file:", file.name, file.size, file.type);
        const result = await uploadToImageKit(file);
        console.log("[upload] result url:", result.url);
        uploads.push({
          url: result.url,
          publicId: result.fileId,
          type: result.type,
          alt: file.name,
        });
      } catch (err) {
        console.error("[upload] single file failed:", file.name, err.message);
      }
    }

    if (!uploads.length) {
      throw new Error("All file uploads failed");
    }

    return ok({ uploads }, 201);
  } catch (error) {
    console.error("[upload] error:", error);
    return handleError(error);
  }
}
