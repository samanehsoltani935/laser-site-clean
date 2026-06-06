import { NextRequest } from "next/server";
import { apiError, apiSuccess, requireRole } from "@/lib/api/helpers";
import { getApiSession } from "@/lib/auth/api-session";
import { saveUploadedFile } from "@/lib/services/upload.service";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getApiSession(request);
  const denied = requireRole(session, [
    "CUSTOMER",
    "TECHNICIAN",
    "MANAGER",
    "SUPPORT",
  ]);
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const requestId = formData.get("requestId") as string | null;
  const serviceReportId = formData.get("serviceReportId") as string | null;

  if (!file) return apiError("فایل الزامی است");

  try {
    const saved = await saveUploadedFile(file, "attachments");
    const attachment = await prisma.attachment.create({
      data: {
        requestId: requestId || undefined,
        serviceReportId: serviceReportId || undefined,
        uploadedById: session!.userId,
        fileName: saved.fileName,
        fileUrl: saved.fileUrl,
        fileType: saved.fileType,
      },
    });
    return apiSuccess(attachment, 201);
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "خطا در آپلود", 500);
  }
}
