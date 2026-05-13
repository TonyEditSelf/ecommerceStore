export const PLACEHOLDER_IMAGE = "/placeholder.jpg";

export const IMAGE_WIDTHS = {
  thumbnail: 500,
  card: 700,
  detail: 1200,
  hero: 1800,
};

const FALLBACK_QUERIES = {
  projectors: "projector",
  "portable-projectors": "mini projector",
  "projector-screens": "home theater screen",
  "projector-accessories": "hdmi cable projector mount",
  "ar-glasses": "smart glasses",
  "robotic-vacuum-cleaners": "robot vacuum",
  "smart-watches": "smartwatch",
  "e-scooters": "electric scooter",
  "mobile-phones": "smartphone",
};

const FALLBACK_SIZES = {
  thumbnail: "500x375",
  card: "700x400",
  detail: "1200x900",
  hero: "1800x1000",
};

export function getOptimizedImageUrl(url, usage = "card") {
  if (!url) return PLACEHOLDER_IMAGE;

  // If it's already an ImageKit or other non-Unsplash URL, return as is
  if (!url.includes("images.unsplash.com")) return url;

  const width = IMAGE_WIDTHS[usage] || IMAGE_WIDTHS.card;

  try {
    const parsed = new URL(url);
    const base = `${parsed.origin}${parsed.pathname}`;
    return `${base}?auto=format&fit=crop&w=${width}&q=80`;
  } catch {
    return url;
  }
}

export function getCategoryFallbackImageUrl(category, usage = "card") {
  const size = FALLBACK_SIZES[usage] || FALLBACK_SIZES.card;
  const query = encodeURIComponent(FALLBACK_QUERIES[category] || "electronics product");
  return `https://source.unsplash.com/${size}/?${query}`;
}
