import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ data: null });
    }
    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
