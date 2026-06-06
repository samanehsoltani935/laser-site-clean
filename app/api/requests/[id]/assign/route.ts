import { NextRequest } from "next/server";
import { apiError, apiSuccess, requireRole, zodFirstError } from "@/lib/api/helpers";
import { getApiSession } from "@/lib/auth/api-session";
import { assignTechnicianSchema } from "@/lib/validations/schemas";
import { assignTechnician } from "@/lib/services/request.service";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getApiSession(request);
  const denied = requireRole(session, ["MANAGER", "SUPPORT"]);
  if (denied) return denied;

  const body = await request.json();
  const parsed = assignTechnicianSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(zodFirstError(parsed.error));
  }

  try {
    const updated = await assignTechnician(
      params.id,
      parsed.data.technicianId,
      session!.userId
    );
    return apiSuccess(updated);
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "خطا", 400);
  }
}
