import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message, status = 400, details = null) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

export function handleError(error) {
  // Always log error to console for server debugging
  console.error("[API Error]:", error);

  if (error instanceof ZodError) {
    return fail("Validation failed", 422, error.flatten());
  }

  // Handle Supabase/Postgres errors
  if (error?.code === "23505") {
    return fail("Duplicate record", 409, error.details);
  }

  // Handle Razorpay errors (often nested in error.error)
  if (error?.error?.description) {
    return fail(error.error.description, 400);
  }

  if (error?.status) {
    return fail(error.message, error.status);
  }

  // Fallback to error message or generic string
  const message = error?.message || (typeof error === "string" ? error : "Server error");
  return fail(message, 500);
}
