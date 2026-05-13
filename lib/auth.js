import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB, getSupabaseAdmin } from "@/lib/db";
import User from "@/models/User";

const COOKIE_NAME = "ags_token";

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  return jwt.sign(
    {
      sub: user.id || user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
}

export function setAuthCookie(response, token) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(response) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    await connectDB();
    
    // Get user without password field
    const db = getSupabaseAdmin();
    const { data: user, error } = await db
      .from("users")
      .select("id, name, email, role, created_at")
      .eq("id", payload.sub)
      .single();
    
    if (error && error.code !== "PGRST116") throw error;
    return user || null;
  } catch {
    return null;
  }
}

export async function requireUser(role = null) {
  const user = await getCurrentUser();
  if (!user) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }

  if (role && user.role !== role) {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  return user;
}
