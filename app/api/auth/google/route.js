import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "@/lib/db";
import { handleError, fail } from "@/lib/response";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import User from "@/models/User";
import { z } from "zod";

const googleLoginSchema = z.object({
  credential: z.string().min(20),
});

export async function POST(request) {
  try {
    const { credential } = googleLoginSchema.parse(await request.json());
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      return fail("Google login is not configured", 500);
    }

    console.log("[Google Auth] Verifying token for audience:", clientId);
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return fail("Google email is not verified", 401);
    }

    console.log("[Google Auth] User verified:", payload.email);
    const isAdminEmail = payload.email.toLowerCase() === "tony.elsas@gmail.com";
    
    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: payload.email.toLowerCase() },
      {
        $setOnInsert: {
          name: payload.name || payload.email.split("@")[0],
          email: payload.email.toLowerCase(),
          password: await hashPassword(`google:${payload.sub}:${process.env.JWT_SECRET}`),
          role: isAdminEmail ? "admin" : "customer",
        },
      },
      { upsert: true, new: true }
    );

    if (!user) {
      console.error("[Google Auth] Failed to find or create user record");
      return fail("Could not establish user session", 500);
    }

    // If already exists but role is wrong (e.g. was customer), update it for the admin email
    if (isAdminEmail && user.role !== "admin") {
      console.log("[Google Auth] Upgrading user to admin");
      await User.findOneAndUpdate({ email: user.email }, { role: "admin" });
      user.role = "admin";
    }

    console.log("[Google Auth] Signing token for user:", user.email);
    const token = signToken(user);
    const response = NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
