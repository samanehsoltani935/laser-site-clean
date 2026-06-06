export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { apiSuccess, requireRole } from "@/lib/api/helpers";
import { getApiSession } from "@/lib/auth/api-session";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, [
    "CUSTOMER",
    "TECHNICIAN",
    "MANAGER",
    "SUPPORT",
  ]);
  if (denied) return denied;

  const notifications = await prisma.notification.findMany({
    where: { userId: session!.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return apiSuccess(notifications);
}

