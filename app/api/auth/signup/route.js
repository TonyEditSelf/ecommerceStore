import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { handleError, ok } from "@/lib/response";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import User from "@/models/User";
import { signupSchema } from "@/validators/schemas";

export async function POST(request) {
  try {
    const input = signupSchema.parse(await request.json());
    await connectDB();

    const user = await User.create({
      name: input.name,
      email: input.email,
      password: await hashPassword(input.password),
      role: "customer",
    });

    const token = signToken(user);
    const response = NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, { status: 201 });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
