export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { apiError, apiSuccess, requireRole, zodFirstError } from "@/lib/api/helpers";
import { getApiSession } from "@/lib/auth/api-session";
import { serviceReportSchema } from "@/lib/validations/schemas";
import { createServiceReport } from "@/lib/services/request.service";
import { prisma } from "@/lib/db/prisma";
import { RequestStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, ["TECHNICIAN", "MANAGER", "SUPPORT"]);
  if (denied) return denied;

  const reports = await prisma.serviceReport.findMany({
    include: {
      request: { include: { device: true, customer: true } },
      technician: { select: { fullName: true } },
      usedSpareParts: { include: { sparePart: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(reports);
}

export async function POST(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, ["TECHNICIAN"]);
  if (denied) return denied;

  const body = await request.json();
  const parsed = serviceReportSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(zodFirstError(parsed.error));
  }

  try {
    const report = await createServiceReport(session!.userId, {
      requestId: parsed.data.requestId,
      actionsDone: parsed.data.actionsDone,
      technicalNotes: parsed.data.technicalNotes,
      finalStatus: parsed.data.finalStatus as RequestStatus,
      spareParts: parsed.data.spareParts,
    });
    return apiSuccess(report, 201);
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "خطا", 400);
  }
}

