export const categories = [
  { name: "Projectors", slug: "projectors", note: "Cinema-grade displays for composed spaces." },
  { name: "Portable Projectors", slug: "portable-projectors", note: "Small projection systems for flexible rooms." },
  { name: "Projector Screens", slug: "projector-screens", note: "Refined surfaces with precision tensioning." },
  { name: "Projector Accessories", slug: "projector-accessories", note: "Mounts, remotes, cables, and clean setup pieces." },
  { name: "AR Glasses", slug: "ar-glasses", note: "Lightweight spatial displays with polished finishes." },
  { name: "Robotic Vacuum Cleaners", slug: "robotic-vacuum-cleaners", note: "Quiet cleaning systems for modern homes." },
  { name: "Smart Watches", slug: "smart-watches", note: "Wellness, calls, and time in a refined wearable." },
  { name: "E-Scooters", slug: "e-scooters", note: "Elegant urban mobility with considered details." },
  { name: "Mobile Phones", slug: "mobile-phones", note: "Premium handheld devices for daily work and life." },
];

export function getCategory(slug) {
  return categories.find((category) => category.slug === slug);
}
