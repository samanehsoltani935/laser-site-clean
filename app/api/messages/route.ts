import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    messages: [],
    info: "پیام‌ها فعلاً به صورت نمایشی بارگذاری می‌شوند.",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const requestId = body.requestId;
    const senderId = body.senderId;
    const content = body.content || body.body || body.message;

    if (!requestId || !senderId || !content) {
      return NextResponse.json(
        { message: "شناسه درخواست، فرستنده و متن پیام الزامی است." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "پیام با موفقیت ثبت شد.",
        data: {
          id: `msg-${Date.now()}`,
          requestId,
          senderId,
          body: content,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MESSAGES_POST_ERROR:", error);

    return NextResponse.json(
      { message: "خطا در ثبت پیام." },
      { status: 500 }
    );
  }
}
