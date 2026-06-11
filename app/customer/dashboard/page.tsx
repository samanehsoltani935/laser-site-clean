export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export default async function CustomerDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "CUSTOMER") {
    redirect("/login");
  }

  const profile = await prisma.customerProfile.findUnique({
    where: { userId: session.userId },
  });

  const [deviceCount, requestCount, activeRequests] = await Promise.all([
    profile
      ? prisma.device.count({
          where: { customerId: profile.id },
        })
      : 0,

    profile
      ? prisma.serviceRequest.count({
          where: { customerId: profile.id },
        })
      : 0,

    profile
      ? prisma.serviceRequest.count({
          where: {
            customerId: profile.id,
            status: {
              notIn: ["COMPLETED", "CLOSED", "REJECTED"],
            },
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
      <div className="rounded-2xl bg-gradient-to-l from-primary to-sky-500 p-6 text-white shadow-sm">
        <h1 className="text-xl font-bold">سلام، {session.fullName} 👋</h1>

        <p className="mt-2 text-sm leading-7 text-white/90">
          {profile?.clinicName
            ? `کلینیک ${profile.clinicName} — مدیریت دستگاه‌ها و درخواست‌های خدمات`
            : "از اینجا دستگاه‌ها و درخواست‌های خدماتت را مدیریت کن"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-base font-bold text-gray-900">
              {item.title}
            </div>

            <div className="mt-2 text-sm text-gray-500">
              {item.desc}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}