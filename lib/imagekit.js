import ImageKit from "imagekit";

let imagekit;

function getImageKit() {
  if (imagekit) return imagekit;

  if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    throw new Error("ImageKit credentials are required");
  }

  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  return imagekit;
}

export async function uploadToImageKit(file, folder = "/ecommerce-store") {
  const arrayBuffer = await file.arrayBuffer();
  const base64Str = Buffer.from(arrayBuffer).toString("base64");

  if (!base64Str) {
    throw new Error(`Empty file: ${file.name}`);
  }

  const result = await getImageKit().upload({
    file: base64Str,
    fileName: file.name || `upload-${Date.now()}`,
    folder,
    useUniqueFileName: true,
  });

  if (!result.url) {
    throw new Error(`ImageKit returned no URL for ${file.name}`);
  }

  return {
    url: result.url,
    publicId: result.fileId,
    fileId: result.fileId,
    type: file.type?.startsWith("video/") ? "video" : "image",
    alt: file.name,
  };
}
