import { connectDB } from "@/lib/db";
import HeroContent from "@/models/HeroContent";
import Product from "@/models/Product";
import Testimonial from "@/models/Testimonial";
import { unstable_noStore as noStore } from "next/cache";

export function serializeDocument(document) {
  if (!document) return document;
  
  const serialize = (doc) => {
    if (Array.isArray(doc)) return doc.map(serialize);
    if (doc !== null && typeof doc === "object") {
      // Check if it's a date or other special object that shouldn't be spread
      if (doc instanceof Date) return doc.toISOString();
      
      const newDoc = { ...doc };
      // Map id to _id for frontend compatibility
      if (newDoc.id !== undefined && newDoc._id === undefined) {
        newDoc._id = String(newDoc.id);
      }
      // Recursively handle nested objects/arrays
      for (const key in newDoc) {
        newDoc[key] = serialize(newDoc[key]);
      }
      return newDoc;
    }
    return doc;
  };

  // Use a cleaner serialization than double JSON
  try {
    return serialize(document);
  } catch (e) {
    return serialize(JSON.parse(JSON.stringify(document)));
  }
}

export async function getProducts({ category, flag, page = 1, limit = 12 } = {}) {
  noStore();
  await connectDB();
  const query = {};
  if (category) query.category = category;
  if (flag) query[`flags.${flag}`] = true;

  const skip = (Math.max(1, page) - 1) * limit;
  const db = await connectDB();
  
  // Get filtered products
  let q = db.from("products").select("*");
  if (category) q = q.eq("category", category);
  if (flag) q = q.eq("flags->"+flag, true);
  
  q = q.order("created_at", { ascending: false });
  q = q.range(skip, skip + limit - 1);
  
  const { data: items, error: itemsError } = await q;
  if (itemsError) throw itemsError;

  // Get count
  let countQ = db.from("products").select("*", { count: "exact" });
  if (category) countQ = countQ.eq("category", category);
  if (flag) countQ = countQ.eq("flags->"+flag, true);
  
  const { count: total, error: countError } = await countQ;
  if (countError) throw countError;

  return serializeDocument({ items, total: total || 0, page, limit, pages: Math.ceil((total || 0) / limit) });
}

export async function getProductByIdOrSlug(id) {
  noStore();
  await connectDB();
  const db = await connectDB();
  
  // Try by ID first
  const cleanId = String(id).trim();
  if (/^\d+$/.test(cleanId) || /^[0-9a-fA-F]{24}$/.test(cleanId)) {
    const { data, error } = await db
      .from("products")
      .select("*")
      .eq("id", cleanId)
      .single();
    if (data) return serializeDocument(data);
    if (error && error.code !== "PGRST116") throw error;
  }
  
  // Try by slug
  const { data: slugData, error: slugError } = await db
    .from("products")
    .select("*")
    .eq("slug", id)
    .single();
  
  if (slugError && slugError.code !== "PGRST116") throw slugError;
  return slugData ? serializeDocument(slugData) : null;
}

export async function getHeroContent() {
  noStore();
  await connectDB();
  const db = await connectDB();
  
  const { data: items, error } = await db
    .from("hero_content")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .limit(6);
  
  if (error) throw error;
  return serializeDocument(items || []);
}

export async function getTestimonials() {
  noStore();
  await connectDB();
  const db = await connectDB();
  
  const { data: items, error } = await db
    .from("testimonials")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(6);
  
  if (error) throw error;
  return serializeDocument(items || []);
}
