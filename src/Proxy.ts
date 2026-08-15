import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-token";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  try {
    await verifyToken(token);

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );

    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};