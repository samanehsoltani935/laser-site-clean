export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { apiError, apiSuccess, requireRole, zodFirstError } from "@/lib/api/helpers";
import { getApiSession } from "@/lib/auth/api-session";
import { statusChangeSchema } from "@/lib/validations/schemas";
import { changeRequestStatus } from "@/lib/services/request.service";
import { RequestStatus } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getApiSession(request);
  const denied = requireRole(session, ["TECHNICIAN", "MANAGER", "SUPPORT"]);
  if (denied) return denied;

  const body = await request.json();
  const parsed = statusChangeSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(zodFirstError(parsed.error));
  }

  try {
    const updated = await changeRequestStatus(
      params.id,
      session!.userId,
      parsed.data.status as RequestStatus,
      parsed.data.note
    );
    return apiSuccess(updated);
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "خطا", 400);
  }
}
