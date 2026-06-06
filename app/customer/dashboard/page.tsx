export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";

export default async function CustomerDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profile = await prisma.customerProfile.findUnique({
    where: { userId: session.userId },
  });

  const [deviceCount, requestCount, activeRequests] = await Promise.all([
    profile
      ? prisma.device.count({ where: { customerId: profile.id } })
      : 0,
    profile
      ? prisma.serviceRequest.count({ where: { customerId: profile.id } })
      : 0,
    profile
      ? prisma.serviceRequest.count({
          where: {
            customerId: profile.id,
            status: { notIn: ["COMPLETED", "CLOSED", "REJECTED"] },
          },
        })
      : 0,
  ]);

  const quickLinks = [
    {
      title: "دستگاه‌های من",
      desc: `${deviceCount} دستگاه ثبت‌شده`,
      href: "/customer/devices",
    },
    {
      title: "درخواست‌های من",
      desc: `${requestCount} درخواست — ${activeRequests} فعال`,
      href: "/customer/requests",
    },
    {
      title: "ثبت درخواست جدید",
      desc: "ثبت خرابی، سرویس یا تعویض قطعه",
      href: "/customer/requests/new",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-l from-primary to-sky-500 text-white p-6 shadow-sm">
        <h1 className="text-xl font-bold">سلام، {session.fullName} 👋</h1>
        <p className="text-sm text-white/90 mt-2 leading-7">
          {profile?.clinicName
            ? `کلینیک ${profile.clinicName} — مدیریت دستگاه‌ها و درخواست‌های خدمات`
            : "از اینجا دستگاه‌ها و درخواست‌های خدماتت را مدیریت کن"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full hover:shadow-md transition">
              <CardContent>
                <div className="text-base font-bold text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-500 mt-2">{item.desc}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

