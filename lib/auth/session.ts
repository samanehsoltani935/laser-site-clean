import { cookies } from "next/headers";
import { JwtPayload, signToken, verifyToken } from "./jwt";

export const AUTH_COOKIE = "cabok_teb_token";

export async function setAuthCookie(token: string) {
  cookies().set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  cookies().delete(AUTH_COOKIE);
}

export async function getSession(): Promise<JwtPayload | null> {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function createSession(payload: JwtPayload) {
  const token = await signToken(payload);
  await setAuthCookie(token);
  return token;
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case "MANAGER":
    case "SUPPORT":
      return "/manager/dashboard";
    case "TECHNICIAN":
      return "/technician/requests";
    case "CUSTOMER":
    default:
      return "/customer/dashboard";
  }
}

export function roleGuard(
  userRole: string,
  allowed: string[]
): boolean {
  return allowed.includes(userRole);
}
