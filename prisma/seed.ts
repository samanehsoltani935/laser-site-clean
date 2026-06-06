import { PrismaClient, RequestStatus, RequestPriority, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.usedSparePart.deleteMany();
  await prisma.serviceReport.deleteMany();
  await prisma.requestStatusHistory.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.device.deleteMany();
  await prisma.sparePart.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.technicianProfile.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("Admin123!", 12);

  const manager = await prisma.user.create({
    data: {
      fullName: "مدیر سیستم",
      email: "manager@cabokteb.ir",
      phone: "09121234567",
      passwordHash: hash,
      role: UserRole.MANAGER,
    },
  });

  const tech1 = await prisma.user.create({
    data: {
      fullName: "علی رضایی",
      email: "tech1@cabokteb.ir",
      phone: "09122222222",
      passwordHash: await bcrypt.hash("Tech123!", 12),
      role: UserRole.TECHNICIAN,
      technicianProfile: {
        create: {
          specialty: "لیزر پوست",
          serviceArea: "تهران",
          isAvailable: true,
        },
      },
    },
  });

  const tech2 = await prisma.user.create({
    data: {
      fullName: "محمد کریمی",
      email: "tech2@cabokteb.ir",
      phone: "09123333333",
      passwordHash: await bcrypt.hash("Tech123!", 12),
      role: UserRole.TECHNICIAN,
      technicianProfile: {
        create: {
          specialty: "الکترونیک",
          serviceArea: "اصفهان",
          isAvailable: true,
        },
      },
    },
  });

  const customerHash = await bcrypt.hash("Customer123!", 12);

  const customers = await Promise.all(
    [
      { name: "کلینیک زیبایی سما", email: "customer1@cabokteb.ir" },
      { name: "کلینیک دکتر احمدی", email: "customer2@cabokteb.ir" },
      { name: "مرکز لیزر پارس", email: "customer3@cabokteb.ir" },
    ].map((c, i) =>
      prisma.user.create({
        data: {
          fullName: `مسئول ${c.name}`,
          email: c.email,
          phone: `0912400000${i + 1}`,
          passwordHash: customerHash,
          role: UserRole.CUSTOMER,
          customerProfile: {
            create: {
              clinicName: c.name,
              clinicAddress: `تهران، خیابان نمونه ${i + 1}`,
              nationalCodeOrCompanyId: `123456789${i}`,
            },
          },
        },
        include: { customerProfile: true },
      })
    )
  );

  const devices = [];
  const models = [
    "آلکساندرایت نابلکس (Noblex)",
    "دایود لومینس (Lumenis)",
    "IPL Candela",
    "Nd:YAG Quanta",
    "CO2 Fraxel",
  ];

  for (let i = 0; i < 5; i++) {
    const customer = customers[i % 3];
    const purchaseDate = subDays(new Date(), 365 + i * 30);
    const warrantyEnd = addDays(purchaseDate, 730);

    devices.push(
      await prisma.device.create({
        data: {
          customerId: customer.customerProfile!.id,
          model: models[i],
          serialNumber: `KB-2024-${1000 + i}`,
          branch: i % 2 === 0 ? "شعبه مرکزی" : "شعبه غرب",
          purchaseDate,
          installationDate: purchaseDate,
          warrantyStartDate: purchaseDate,
          warrantyEndDate: warrantyEnd,
          warrantyStatus: warrantyEnd > new Date() ? "ACTIVE" : "EXPIRED",
        },
      })
    );
  }

  const statuses: RequestStatus[] = [
    RequestStatus.NEW,
    RequestStatus.IN_REVIEW,
    RequestStatus.TECHNICIAN_ASSIGNED,
    RequestStatus.IN_PROGRESS,
    RequestStatus.COMPLETED,
    RequestStatus.WAITING_FOR_PART,
    RequestStatus.NEED_MORE_INFO,
    RequestStatus.CLOSED,
    RequestStatus.REJECTED,
    RequestStatus.IN_PROGRESS,
  ];

  const priorities: RequestPriority[] = [
    RequestPriority.LOW,
    RequestPriority.MEDIUM,
    RequestPriority.HIGH,
    RequestPriority.URGENT,
    RequestPriority.MEDIUM,
    RequestPriority.HIGH,
    RequestPriority.LOW,
    RequestPriority.MEDIUM,
    RequestPriority.URGENT,
    RequestPriority.HIGH,
  ];

  const requests = [];
  for (let i = 0; i < 10; i++) {
    const customer = customers[i % 3];
    const device = devices[i % 5];
    const status = statuses[i];
    const techId =
      status === RequestStatus.TECHNICIAN_ASSIGNED ||
      status === RequestStatus.IN_PROGRESS ||
      status === RequestStatus.COMPLETED
        ? i % 2 === 0
          ? tech1.id
          : tech2.id
        : null;

    const req = await prisma.serviceRequest.create({
      data: {
        trackingCode: `KB-2025-${100000 + i}`,
        customerId: customer.customerProfile!.id,
        deviceId: device.id,
        assignedTechnicianId: techId,
        title: `درخواست سرویس ${i + 1}`,
        customerName: customer.fullName,
        phoneNumber: customer.phone,
        clinicAddress: customer.customerProfile!.clinicAddress,
        problemDescription: `شرح مشکل دستگاه ${device.model}: نیاز به بررسی و سرویس`,
        priority: priorities[i],
        status,
        slaDueAt: addDays(new Date(), priorities[i] === RequestPriority.URGENT ? 0 : 2),
        statusHistory: {
          create: {
            changedById: customer.id,
            newStatus: RequestStatus.NEW,
            note: "ثبت درخواست",
          },
        },
      },
    });
    requests.push(req);
  }

  const spareParts = await Promise.all(
    [
      { name: "لامپ دایود", code: "SP-001", qty: 20 },
      { name: "فیلتر آب", code: "SP-002", qty: 50 },
      { name: "هد هندپیس", code: "SP-003", qty: 8 },
      { name: "پاور ساپلای", code: "SP-004", qty: 5 },
      { name: "سنسور دما", code: "SP-005", qty: 15 },
    ].map((p) =>
      prisma.sparePart.create({
        data: {
          name: p.name,
          code: p.code,
          stockQuantity: p.qty,
          minimumStock: 5,
          description: `قطعه یدکی ${p.name}`,
        },
      })
    )
  );

  const completedReq = requests.find((r) => r.status === RequestStatus.COMPLETED);
  if (completedReq) {
    const report = await prisma.serviceReport.create({
      data: {
        requestId: completedReq.id,
        technicianId: tech1.id,
        actionsDone: "تعویض لامپ دایود و کالیبراسیون دستگاه",
        technicalNotes: "دستگاه پس از سرویس در وضعیت مطلوب قرار دارد",
        finalStatus: RequestStatus.COMPLETED,
      },
    });

    await prisma.usedSparePart.create({
      data: {
        serviceReportId: report.id,
        sparePartId: spareParts[0].id,
        quantity: 1,
      },
    });

    await prisma.sparePart.update({
      where: { id: spareParts[0].id },
      data: { stockQuantity: { decrement: 1 } },
    });
  }

  await prisma.message.createMany({
    data: [
      {
        requestId: requests[0].id,
        senderId: customers[0].id,
        body: "سلام، دستگاه از دیروز خطا می‌دهد.",
      },
      {
        requestId: requests[0].id,
        senderId: manager.id,
        body: "درخواست شما دریافت شد. به‌زودی تکنسین اختصاص می‌یابد.",
      },
      {
        requestId: requests[2].id,
        senderId: tech1.id,
        body: "فردا برای بازدید حضوری مراجعه می‌کنم.",
      },
    ],
  });

  await prisma.notification.create({
    data: {
      userId: manager.id,
      requestId: requests[0].id,
      title: "درخواست جدید",
      body: "یک درخواست خدمات جدید ثبت شد",
      type: "STATUS_CHANGE",
    },
  });

  console.log("✅ Seed completed!");
  console.log("\nDemo users:");
  console.log("  Manager:   manager@cabokteb.ir / Admin123!");
  console.log("  Tech 1:    tech1@cabokteb.ir / Tech123!");
  console.log("  Tech 2:    tech2@cabokteb.ir / Tech123!");
  console.log("  Customer:  customer1@cabokteb.ir / Customer123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
