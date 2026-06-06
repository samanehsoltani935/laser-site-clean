import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    devices: [],
    info: "لیست دستگاه‌ها فعلاً به صورت نمایشی بارگذاری شده است.",
  });
}

export async function POST(req: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: "DATABASE_URL در سرور تنظیم نشده است." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const customerId = body.customerId;
    const model = body.model;
    const serialNumber = body.serialNumber;
    const purchaseDate = body.purchaseDate;
    const warrantyStartDate = body.warrantyStartDate;
    const warrantyEndDate = body.warrantyEndDate;

    if (!customerId || !model || !serialNumber) {
      return NextResponse.json(
        { message: "شناسه مشتری، مدل دستگاه و شماره سریال الزامی است." },
        { status: 400 }
      );
    }

    const existingDevice = await prisma.device.findUnique({
      where: {
        serialNumber,
      },
    });

    if (existingDevice) {
      return NextResponse.json(
        { message: "دستگاهی با این شماره سریال قبلاً ثبت شده است." },
        { status: 409 }
      );
    }

    const device = await prisma.device.create({
      data: {
        customerId,
        model,
        serialNumber,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        warrantyStartDate: warrantyStartDate
          ? new Date(warrantyStartDate)
          : new Date(),
        warrantyEndDate: warrantyEndDate
          ? new Date(warrantyEndDate)
          : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        warrantyStatus: "ACTIVE" as any,
      },
    });

    return NextResponse.json(
      {
        message: "دستگاه با موفقیت ثبت شد.",
        device,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("DEVICES_POST_ERROR:", error);

    return NextResponse.json(
      { message: "خطا در ثبت دستگاه." },
      { status: 500 }
    );
  }
}
