import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readSimpleToken(token: string) {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return JSON.parse(decoded) as {
      userId?: string;
      createdAt?: number;
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
          message: "DATABASE_URL در سرور تنظیم نشده است.",
        },
        { status: 500 }
      );
    }

    const token = cookies().get("cabok_session")?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    const payload = readSimpleToken(token);

    if (!payload?.userId) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
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

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("ME_API_ERROR:", error);

    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        message: "خطا در دریافت اطلاعات کاربر.",
      },
      { status: 500 }
    );
  }
}
