import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { JwtPayload } from "@/lib/auth/jwt";

export function zodFirstError(error: ZodError): string {
  return error.issues[0]?.message || "داده نامعتبر";
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function unauthorized(message = "دسترسی غیرمجاز") {
  return apiError(message, 401);
}

export function forbidden(message = "شما مجوز انجام این عملیات را ندارید") {
  return apiError(message, 403);
}

export function requireRole(user: JwtPayload | null, roles: string[]) {
  if (!user) return unauthorized();
  if (!roles.includes(user.role)) return forbidden();
  return null;
}

export function parseDate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}
