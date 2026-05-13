export function placeholderMedia(title = "Product") {
  const text = encodeURIComponent(title);
  return {
    url: `https://placehold.co/1200x900/F5F1EA/2C2C2C.png?text=${text}`,
    publicId: `placeholder-${String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    type: "image",
    alt: title,
  };
}
