import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128),
});

export const mediaSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  type: z.enum(["image", "video"]),
  alt: z.string().optional().default(""),
});

export const flagsSchema = z.object({
  featured: z.boolean().optional().default(false),
  bestSelling: z.boolean().optional().default(false),
  latest: z.boolean().optional().default(false),
  fastSelling: z.boolean().optional().default(false),
});

export const productSchema = z.object({
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().min(10),
  price: z.coerce.number().min(0),
  category: z.string().trim().min(2),
  media: z.array(mediaSchema).optional().default([]),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  stock: z.coerce.number().int().min(0).optional().default(25),
  flags: flagsSchema.optional().default({}),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
});

export const createOrderSchema = z.object({
  products: z.array(orderItemSchema).min(1),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export const heroSchema = z.object({
  title: z.string().trim().min(2),
  subtitle: z.string().trim().min(2),
  images: z.array(z.object({
    url: z.string().url(),
    publicId: z.string().min(1),
    alt: z.string().optional().default(""),
  })).min(1),
  active: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(1).optional().default(1),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  text: z.string().trim().min(5).max(1000),
  rating: z.coerce.number().min(1).max(5),
  active: z.boolean().optional().default(true),
});
