import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
  if (path === "/admin") {
    return NextResponse.redirect(new URL("/admin/product", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin"] };
