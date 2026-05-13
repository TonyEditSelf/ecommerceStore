import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { comparePassword, setAuthCookie, signToken } from "@/lib/auth";
import { fail, handleError } from "@/lib/response";
import User from "@/models/User";
import { loginSchema } from "@/validators/schemas";

export async function POST(request) {
  try {
    const input = loginSchema.parse(await request.json());
    await connectDB();

    const user = await User.findOne({ email: input.email });
    if (!user || !(await comparePassword(input.password, user.password))) {
      return fail("Invalid email or password", 401);
    }

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
