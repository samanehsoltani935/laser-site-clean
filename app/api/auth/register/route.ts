import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
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

    const fullName = body.fullName || body.name;
    const email = body.email;
    const phone = body.phone;
    const password = body.password;

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { message: "نام، ایمیل، شماره تماس و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "کاربری با این ایمیل یا شماره تماس قبلاً ثبت شده است." },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        role: "CUSTOMER",
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "ثبت‌نام با موفقیت انجام شد.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      { message: "خطا در ثبت‌نام کاربر." },
      { status: 500 }
    );
  }
}
