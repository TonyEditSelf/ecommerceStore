import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Lead from "@/models/Lead";
import { requireUser } from "@/lib/auth";

export async function GET(request) {
  try {
    await requireUser("admin");
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const leads = await Lead.find(status ? { status } : {});
    return NextResponse.json({ data: leads });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}

export async function PATCH(request) {
  try {
    await requireUser("admin");
    await connectDB();
    
    const { id, status } = await request.json();
    const result = await Lead.upsert(id, { status });
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
