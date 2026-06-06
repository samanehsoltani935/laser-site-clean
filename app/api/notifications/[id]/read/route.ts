import { NextRequest } from "next/server";
import { apiError, apiSuccess, requireRole } from "@/lib/api/helpers";
import { getApiSession } from "@/lib/auth/api-session";
import { prisma } from "@/lib/db/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getApiSession(request);
  const denied = requireRole(session, [
    "CUSTOMER",
    "TECHNICIAN",
    "MANAGER",
    "SUPPORT",
  ]);
  if (denied) return denied;

  const notification = await prisma.notification.findFirst({
    where: { id: params.id, userId: session!.userId },
  });
  if (!notification) return apiError("اعلان یافت نشد", 404);

  const updated = await prisma.notification.update({
    where: { id: params.id },
    data: { isRead: true },
  });

  return apiSuccess(updated);
}
