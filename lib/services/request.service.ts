import {
  NotificationType,
  RequestStatus,
  UserRole,
} from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { generateTrackingCode } from "@/lib/domain/tracking-code";
import { defaultSlaDue } from "@/lib/domain/sla";
import { ServiceRequestInput } from "@/lib/validations/schemas";
import {
  createNotification,
  notifyManagers,
} from "@/lib/services/notification.service";

export async function createServiceRequest(
  customerProfileId: string,
  userId: string,
  input: ServiceRequestInput
) {
  const trackingCode = generateTrackingCode();
  const slaDueAt = defaultSlaDue(input.priority);

  const request = await prisma.serviceRequest.create({
    data: {
      trackingCode,
      customerId: customerProfileId,
      deviceId: input.deviceId,
      title: input.title,
      customerName: input.customerName,
      phoneNumber: input.phoneNumber,
      clinicAddress: input.clinicAddress,
      problemDescription: input.problemDescription,
      priority: input.priority,
      status: RequestStatus.NEW,
      slaDueAt,
      statusHistory: {
        create: {
          changedById: userId,
          newStatus: RequestStatus.NEW,
          note: "درخواست جدید ثبت شد",
        },
      },
    },
    include: { device: true },
  });

  await notifyManagers(
    "درخواست خدمات جدید",
    `درخواست ${trackingCode} ثبت شد`,
    request.id
  );

  return request;
}

export async function changeRequestStatus(
  requestId: string,
  changedById: string,
  newStatus: RequestStatus,
  note?: string
) {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { customer: true },
  });
  if (!request) throw new Error("درخواست یافت نشد");

  const oldStatus = request.status;

  const updated = await prisma.$transaction(async (tx) => {
    const req = await tx.serviceRequest.update({
      where: { id: requestId },
      data: { status: newStatus },
    });

    await tx.requestStatusHistory.create({
      data: {
        requestId,
        changedById,
        oldStatus,
        newStatus,
        note,
      },
    });

    return req;
  });

  const customerUser = await prisma.user.findUnique({
    where: { id: request.customer.userId },
  });

  if (customerUser) {
    await createNotification({
      userId: customerUser.id,
      requestId,
      title: "تغییر وضعیت درخواست",
      body: `وضعیت درخواست ${request.trackingCode} به «${newStatus}» تغییر کرد`,
      type: NotificationType.STATUS_CHANGE,
      sendSms: true,
      sendPush: true,
    });
  }

  await notifyManagers(
    "تغییر وضعیت درخواست",
    `${request.trackingCode}: ${oldStatus} → ${newStatus}`,
    requestId
  );

  return updated;
}

export async function assignTechnician(
  requestId: string,
  technicianId: string,
  managerId: string
) {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { customer: true },
  });
  if (!request) throw new Error("درخواست یافت نشد");

  const updated = await prisma.$transaction(async (tx) => {
    const req = await tx.serviceRequest.update({
      where: { id: requestId },
      data: {
        assignedTechnicianId: technicianId,
        status: RequestStatus.TECHNICIAN_ASSIGNED,
      },
    });

    await tx.requestStatusHistory.create({
      data: {
        requestId,
        changedById: managerId,
        oldStatus: request.status,
        newStatus: RequestStatus.TECHNICIAN_ASSIGNED,
        note: "تکنسین اختصاص یافت",
      },
    });

    return req;
  });

  const customerUser = await prisma.user.findUnique({
    where: { id: request.customer.userId },
  });

  await createNotification({
    userId: technicianId,
    requestId,
    title: "درخواست جدید اختصاص یافت",
    body: `درخواست ${request.trackingCode} به شما اختصاص یافت`,
    type: NotificationType.ASSIGNMENT,
    sendPush: true,
  });

  if (customerUser) {
    await createNotification({
      userId: customerUser.id,
      requestId,
      title: "تکنسین اختصاص یافت",
      body: `برای درخواست ${request.trackingCode} تکنسین تعیین شد`,
      type: NotificationType.ASSIGNMENT,
      sendSms: true,
    });
  }

  return updated;
}

export async function getRequestById(id: string) {
  return prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      device: true,
      customer: { include: { user: true } },
      assignedTechnician: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
        include: { changedBy: { select: { fullName: true, role: true } } },
      },
      serviceReports: {
        include: {
          technician: { select: { fullName: true } },
          usedSpareParts: { include: { sparePart: true } },
          attachments: true,
        },
      },
      attachments: true,
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, fullName: true, role: true } } },
      },
    },
  });
}

export async function listRequests(filters: {
  customerId?: string;
  technicianId?: string;
  status?: RequestStatus;
  priority?: string;
  from?: Date;
  to?: Date;
}) {
  return prisma.serviceRequest.findMany({
    where: {
      customerId: filters.customerId,
      assignedTechnicianId: filters.technicianId,
      status: filters.status,
      priority: filters.priority as never,
      createdAt: {
        gte: filters.from,
        lte: filters.to,
      },
    },
    include: {
      device: true,
      customer: true,
      assignedTechnician: { select: { fullName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createServiceReport(
  technicianId: string,
  data: {
    requestId: string;
    actionsDone: string;
    technicalNotes?: string;
    finalStatus: RequestStatus;
    spareParts?: { sparePartId: string; quantity: number }[];
  }
) {
  return prisma.$transaction(async (tx) => {
    const report = await tx.serviceReport.create({
      data: {
        requestId: data.requestId,
        technicianId,
        actionsDone: data.actionsDone,
        technicalNotes: data.technicalNotes,
        finalStatus: data.finalStatus,
      },
    });

    if (data.spareParts?.length) {
      for (const part of data.spareParts) {
        await tx.usedSparePart.create({
          data: {
            serviceReportId: report.id,
            sparePartId: part.sparePartId,
            quantity: part.quantity,
          },
        });

        await tx.sparePart.update({
          where: { id: part.sparePartId },
          data: { stockQuantity: { decrement: part.quantity } },
        });
      }
    }

    const request = await tx.serviceRequest.findUnique({
      where: { id: data.requestId },
      include: { customer: true },
    });

    await tx.serviceRequest.update({
      where: { id: data.requestId },
      data: { status: RequestStatus.COMPLETED },
    });

    await tx.requestStatusHistory.create({
      data: {
        requestId: data.requestId,
        changedById: technicianId,
        oldStatus: request?.status,
        newStatus: RequestStatus.COMPLETED,
        note: "گزارش سرویس ثبت شد",
      },
    });

    if (request) {
      const customerUser = await tx.user.findUnique({
        where: { id: request.customer.userId },
      });
      if (customerUser) {
        await tx.notification.create({
          data: {
            userId: customerUser.id,
            requestId: data.requestId,
            title: "سرویس تکمیل شد",
            body: `درخواست ${request.trackingCode} تکمیل شد`,
            type: NotificationType.STATUS_CHANGE,
          },
        });
      }

      const managers = await tx.user.findMany({
        where: { role: { in: [UserRole.MANAGER, UserRole.SUPPORT] } },
      });
      for (const m of managers) {
        await tx.notification.create({
          data: {
            userId: m.id,
            requestId: data.requestId,
            title: "گزارش سرویس ثبت شد",
            body: `درخواست ${request.trackingCode} تکمیل شد`,
            type: NotificationType.STATUS_CHANGE,
          },
        });
      }
    }

    return report;
  });
}

export async function getManagerKpis() {
  const [
    total,
    newCount,
    active,
    completed,
    requests,
    reports,
    warrantyRequests,
    technicians,
  ] = await Promise.all([
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: RequestStatus.NEW } }),
    prisma.serviceRequest.count({
      where: {
        status: {
          in: [
            RequestStatus.IN_REVIEW,
            RequestStatus.IN_PROGRESS,
            RequestStatus.TECHNICIAN_ASSIGNED,
            RequestStatus.WAITING_FOR_PART,
          ],
        },
      },
    }),
    prisma.serviceRequest.count({
      where: { status: { in: [RequestStatus.COMPLETED, RequestStatus.CLOSED] } },
    }),
    prisma.serviceRequest.findMany({
      include: { statusHistory: { orderBy: { createdAt: "asc" } } },
    }),
    prisma.serviceReport.findMany({ include: { usedSpareParts: true } }),
    prisma.serviceRequest.count({
      where: { device: { warrantyStatus: "EXPIRED" } },
    }),
    prisma.user.findMany({
      where: { role: UserRole.TECHNICIAN },
      include: {
        assignedRequests: {
          where: { status: RequestStatus.COMPLETED },
        },
      },
    }),
  ]);

  let totalResponseHours = 0;
  let responseCount = 0;
  let totalRepairHours = 0;
  let repairCount = 0;

  for (const req of requests) {
    const firstChange = req.statusHistory.find(
      (h) => h.newStatus !== RequestStatus.NEW
    );
    if (firstChange) {
      totalResponseHours +=
        (firstChange.createdAt.getTime() - req.createdAt.getTime()) /
        (1000 * 60 * 60);
      responseCount++;
    }
    const completedHistory = req.statusHistory.find(
      (h) => h.newStatus === RequestStatus.COMPLETED
    );
    if (completedHistory) {
      totalRepairHours +=
        (completedHistory.createdAt.getTime() - req.createdAt.getTime()) /
        (1000 * 60 * 60);
      repairCount++;
    }
  }

  const consumedParts = reports.reduce(
    (sum, r) =>
      sum + r.usedSpareParts.reduce((s, p) => s + p.quantity, 0),
    0
  );

  return {
    totalRequests: total,
    newRequests: newCount,
    activeRequests: active,
    completedRequests: completed,
    averageResponseTimeHours: responseCount
      ? Math.round(totalResponseHours / responseCount)
      : 0,
    mttrHours: repairCount ? Math.round(totalRepairHours / repairCount) : 0,
    warrantyRequests,
    consumedSpareParts: consumedParts,
    technicianPerformance: technicians.map((t) => ({
      id: t.id,
      name: t.fullName,
      completed: t.assignedRequests.length,
    })),
  };
}
