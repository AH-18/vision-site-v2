import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check for Supabase session cookie directly — no network call needed in Edge
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL!.split("//")[1].split(".")[0];
  const sessionCookie =
    req.cookies.get(`sb-${projectRef}-auth-token`) ||
    req.cookies.get(`sb-${projectRef}-auth-token.0`);
  const hasSession = !!sessionCookie?.value;

  if (pathname === "/login") {
    if (hasSession) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
