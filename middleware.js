import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("ags_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/googauth", request.url));
  }

  try {
    if (!process.env.JWT_SECRET) {
      return NextResponse.redirect(new URL("/googauth", request.url));
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/googauth", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
