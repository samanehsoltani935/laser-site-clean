import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { createSession, getDashboardPath } from "@/lib/auth/session";

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

    const identifier = body.identifier || body.email || body.phone;
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "ایمیل/شماره تماس و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "کاربری با این مشخصات پیدا نشد." },
        { status: 401 }
      );
    }

    const inputPasswordHash = hashPassword(password);

    if (user.passwordHash !== inputPasswordHash) {
      return NextResponse.json(
        { message: "رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    if (user.isActive === false) {
      return NextResponse.json(
        { message: "حساب کاربری شما غیرفعال است." },
        { status: 403 }
      );
    }

    await createSession({
      userId: user.id,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
    });

    const redirectTo = getDashboardPath(user.role);

    return NextResponse.json({
      message: "ورود با موفقیت انجام شد.",
      redirectTo,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      { message: "خطا در ورود به سامانه." },
      { status: 500 }
    );
  }
}
