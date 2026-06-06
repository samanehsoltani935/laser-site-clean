export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextRequest } from "next/server";
import {
  apiError,
  apiSuccess,
  requireRole,
  zodFirstError,
} from "@/lib/api/helpers";
import { getApiSession } from "@/lib/auth/api-session";
import { prisma } from "@/lib/db/prisma";
import { serviceRequestSchema } from "@/lib/validations/schemas";
import {
  createServiceRequest,
  getRequestById,
  listRequests,
} from "@/lib/services/request.service";
import { RequestStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, [
    "CUSTOMER",
    "TECHNICIAN",
    "MANAGER",
    "SUPPORT",
  ]);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const req = await getRequestById(id);
    if (!req) return apiError("درخواست یافت نشد", 404);
    return apiSuccess(req);
  }

  const filters: Parameters<typeof listRequests>[0] = {};

  if (session!.role === "CUSTOMER") {
    const profile = await prisma.customerProfile.findUnique({
      where: { userId: session!.userId },
    });
    if (profile) filters.customerId = profile.id;
  } else if (session!.role === "TECHNICIAN") {
    filters.technicianId = session!.userId;
  }

  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  if (status) filters.status = status as RequestStatus;
  if (priority) filters.priority = priority;

  const requests = await listRequests(filters);
  return apiSuccess(requests);
}

export async function POST(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, ["CUSTOMER"]);
  if (denied) return denied;

  const body = await request.json();
  const parsed = serviceRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(zodFirstError(parsed.error));
  }

  const profile = await prisma.customerProfile.findUnique({
    where: { userId: session!.userId },
  });
  if (!profile) return apiError("پروفایل مشتری یافت نشد", 404);

  try {
    const req = await createServiceRequest(
      profile.id,
      session!.userId,
      parsed.data
    );
    return apiSuccess(req, 201);
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "خطا در ثبت درخواست", 400);
  }
}

