export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { apiError, apiSuccess, requireRole, zodFirstError } from "@/lib/api/helpers";
import { getApiSession } from "@/lib/auth/api-session";
import { sparePartSchema } from "@/lib/validations/schemas";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, ["MANAGER", "SUPPORT", "TECHNICIAN"]);
  if (denied) return denied;

  const parts = await prisma.sparePart.findMany({
    orderBy: { name: "asc" },
  });
  return apiSuccess(parts);
}

export async function POST(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, ["MANAGER", "SUPPORT"]);
  if (denied) return denied;

  const body = await request.json();
  const parsed = sparePartSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(zodFirstError(parsed.error));
  }

  const part = await prisma.sparePart.create({ data: parsed.data });
  return apiSuccess(part, 201);
}

export async function PUT(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, ["MANAGER", "SUPPORT"]);
  if (denied) return denied;

  const body = await request.json();
  const { id, adjustment } = body;
  if (!id) return apiError("شناسه الزامی است");

  if (adjustment !== undefined) {
    const part = await prisma.sparePart.update({
      where: { id },
      data: { stockQuantity: { increment: Number(adjustment) } },
    });
    return apiSuccess(part);
  }

  const parsed = sparePartSchema.partial().safeParse(body);
  if (!parsed.success) return apiError("داده نامعتبر");

  const part = await prisma.sparePart.update({
    where: { id },
    data: parsed.data,
  });
  return apiSuccess(part);
}

export async function DELETE(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, ["MANAGER"]);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return apiError("شناسه الزامی است");

  await prisma.sparePart.delete({ where: { id } });
  return apiSuccess({ deleted: true });
}

