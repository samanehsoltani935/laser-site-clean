export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { apiSuccess, requireRole } from "@/lib/api/helpers";
import { getApiSession } from "@/lib/auth/api-session";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, ["MANAGER", "SUPPORT"]);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  const users = await prisma.user.findMany({
    where: role ? { role: role as never } : undefined,
    include: { customerProfile: true, technicianProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(users);
}

export async function PUT(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, ["MANAGER"]);
  if (denied) return denied;

  const body = await request.json();
  const { id, isActive, role } = body;

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(isActive !== undefined && { isActive }),
      ...(role && { role }),
    },
  });

  return apiSuccess(user);
}

