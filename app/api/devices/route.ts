import { NextRequest, NextResponse } from "next/server";
import { WarrantyStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getApiSession } from "@/lib/auth/api-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDate(value: unknown): Date | undefined {
  if (!value || typeof value !== "string") return undefined;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return undefined;

  return date;
}

function oneYearFromNow() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getApiSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "ابتدا وارد حساب کاربری شوید." },
        { status: 401 }
      );
    }

    if (session.role !== "CUSTOMER") {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز است." },
        { status: 403 }
      );
    }

    const profile = await prisma.customerProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "پروفایل مشتری یافت نشد." },
        { status: 404 }
      );
    }

    const devices = await prisma.device.findMany({
      where: { customerId: profile.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        model: true,
        serialNumber: true,
        branch: true,
        purchaseDate: true,
        installationDate: true,
        warrantyStartDate: true,
        warrantyEndDate: true,
        warrantyStatus: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: devices,
      devices,
    });
  } catch (error) {
    console.error("DEVICES_GET_ERROR:", error);

    return NextResponse.json(
      { success: false, error: "خطا در دریافت دستگاه‌ها." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getApiSession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "ابتدا وارد حساب کاربری شوید." },
        { status: 401 }
      );
    }

    if (session.role !== "CUSTOMER") {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز است." },
        { status: 403 }
      );
    }

    const profile = await prisma.customerProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "پروفایل مشتری یافت نشد." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const model = String(body.model || "").trim();
    const serialNumber = String(body.serialNumber || "").trim();
    const branch = body.branch ? String(body.branch).trim() : undefined;

    const purchaseDate = parseDate(body.purchaseDate);
    const installationDate = parseDate(body.installationDate);
    const warrantyStartDate = parseDate(body.warrantyStartDate) || new Date();
    const warrantyEndDate = parseDate(body.warrantyEndDate) || oneYearFromNow();

    if (!model || !serialNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "مدل دستگاه و شماره سریال الزامی است.",
        },
        { status: 400 }
      );
    }

    const existingDevice = await prisma.device.findUnique({
      where: { serialNumber },
    });

    if (existingDevice) {
      return NextResponse.json(
        {
          success: false,
          error: "دستگاهی با این شماره سریال قبلاً ثبت شده است.",
        },
        { status: 409 }
      );
    }

    const device = await prisma.device.create({
      data: {
        customerId: profile.id,
        model,
        serialNumber,
        branch,
        purchaseDate,
        installationDate,
        warrantyStartDate,
        warrantyEndDate,
        warrantyStatus: WarrantyStatus.ACTIVE,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "دستگاه با موفقیت ثبت شد.",
        data: device,
        device,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("DEVICES_POST_ERROR:", error);

    return NextResponse.json(
      { success: false, error: "خطا در ثبت دستگاه." },
      { status: 500 }
    );
  }
}