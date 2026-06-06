import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE } from "@/lib/auth/session";

export async function getApiSession(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
