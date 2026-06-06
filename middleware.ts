import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE } from "@/lib/auth/session";

const publicPaths = ["/", "/login", "/register", "/contact", "/services"];
const authPaths = ["/login", "/register"];

const roleRoutes: Record<string, string[]> = {
  CUSTOMER: ["/customer", "/dashboard"],
  TECHNICIAN: ["/technician"],
  MANAGER: ["/manager"],
  SUPPORT: ["/manager"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/images");

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  if (authPaths.some((p) => pathname.startsWith(p)) && session) {
    const dest =
      session.role === "MANAGER" || session.role === "SUPPORT"
        ? "/manager/dashboard"
        : session.role === "TECHNICIAN"
          ? "/technician/requests"
          : "/customer/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  const protectedPrefixes = ["/customer", "/technician", "/manager", "/dashboard"];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isProtected) {
    const allowedPrefixes = roleRoutes[session.role] || [];
    const hasAccess = allowedPrefixes.some((p) => pathname.startsWith(p));
    if (!hasAccess && !pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/dashboard" && session) {
    const dest =
      session.role === "MANAGER" || session.role === "SUPPORT"
        ? "/manager/dashboard"
        : session.role === "TECHNICIAN"
          ? "/technician/requests"
          : "/customer/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
