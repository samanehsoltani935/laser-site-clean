import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    totalRequests: 24,
    newRequests: 6,
    activeRequests: 11,
    completedRequests: 7,
    averageResponseTime: "۲ ساعت و ۳۰ دقیقه",
    mttr: "۱۸ ساعت",
    activeTechnicians: 4,
    customerSatisfaction: "۹۲٪",
    consumedSpareParts: 13,
    warrantyRequests: 8,
    info: "آمار داشبورد مدیریتی فعلاً به صورت نمایشی نمایش داده می‌شود.",
  });
}
