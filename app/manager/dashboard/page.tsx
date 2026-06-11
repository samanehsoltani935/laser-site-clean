export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { StatusBadge, PriorityBadge } from "@/components/shared/Badges";

export default async function ManagerDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "MANAGER" && session.role !== "SUPPORT") {
    redirect("/login");
  }

  const [
    totalRequests,
    newRequests,
    activeRequests,
    completedRequests,
    customerCount,
    technicianCount,
    deviceCount,
    latestRequests,
  ] = await Promise.all([
    prisma.serviceRequest.count(),

    prisma.serviceRequest.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.serviceRequest.count({
      where: {
        status: {
          notIn: ["COMPLETED", "CLOSED", "REJECTED"],
        },
      },
    }),

    prisma.serviceRequest.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    prisma.user.count({
      where: {
        role: "TECHNICIAN",
      },
    }),

    prisma.device.count(),

    prisma.serviceRequest.findMany({
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        device: true,
      },
    }),
  ]);

  const cards = [
    {
      title: "کل درخواست‌ها",
      value: totalRequests,
      desc: "تمام درخواست‌های ثبت‌شده",
      href: "/manager/requests",
    },
    {
      title: "درخواست‌های جدید",
      value: newRequests,
      desc: "در انتظار بررسی اولیه",
      href: "/manager/requests",
    },
    {
      title: "درخواست‌های فعال",
      value: activeRequests,
      desc: "در حال بررسی یا انجام",
      href: "/manager/requests",
    },
    {
      title: "درخواست‌های تکمیل‌شده",
      value: completedRequests,
      desc: "سرویس‌های پایان‌یافته",
      href: "/manager/reports",
    },
    {
      title: "مشتریان",
      value: customerCount,
      desc: "کاربران با نقش مشتری",
      href: "/manager/users",
    },
    {
      title: "کارشناسان فنی",
      value: technicianCount,
      desc: "کاربران با نقش کارشناس",
      href: "/manager/users",
    },
    {
      title: "دستگاه‌ها",
      value: deviceCount,
      desc: "دستگاه‌های ثبت‌شده",
      href: "/manager/devices",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-l from-primary to-sky-500 p-6 text-white shadow-sm">
        <h1 className="text-xl font-bold">داشبورد مدیریت</h1>

        <p className="mt-2 text-sm leading-7 text-white/90">
          نمای کلی از وضعیت درخواست‌ها، مشتریان، دستگاه‌ها و عملکرد خدمات پس از
          فروش
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm text-gray-500">{card.title}</div>

            <div className="mt-2 text-3xl font-bold text-primary">
              {card.value}
            </div>

            <div className="mt-2 text-xs text-gray-500">{card.desc}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                آخرین درخواست‌های ثبت‌شده
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                جدیدترین درخواست‌های خدمات مشتریان
              </p>
            </div>

            <Link
              href="/manager/requests"
              className="text-sm font-semibold text-primary hover:underline"
            >
              مشاهده همه
            </Link>
          </div>

          {latestRequests.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
              هنوز درخواستی ثبت نشده است.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-right font-medium">
                        کد پیگیری
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        مشتری
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        دستگاه
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        اولویت
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        وضعیت
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        تاریخ ثبت
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {latestRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-t border-gray-50 transition hover:bg-gray-50/50"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/manager/requests/${request.id}`}
                            className="font-mono font-medium text-primary hover:underline"
                            dir="ltr"
                          >
                            {request.trackingCode}
                          </Link>
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {request.customer.user.fullName}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {request.device.model}
                        </td>

                        <td className="px-4 py-3">
                          <PriorityBadge priority={request.priority} />
                        </td>

                        <td className="px-4 py-3">
                          <StatusBadge status={request.status} />
                        </td>

                        <td className="px-4 py-3 text-gray-500">
                          {request.createdAt.toLocaleDateString("fa-IR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900">
            دسترسی سریع مدیریتی
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            مسیرهای اصلی برای مدیریت سیستم
          </p>

          <div className="mt-4 space-y-2">
            <QuickLink href="/manager/requests" label="مدیریت درخواست‌ها" />
            <QuickLink href="/manager/users" label="مدیریت کاربران" />
            <QuickLink href="/manager/devices" label="مدیریت دستگاه‌ها" />
            <QuickLink href="/manager/spare-parts" label="قطعات یدکی" />
            <QuickLink href="/manager/reports" label="گزارش‌ها" />
            <QuickLink href="/manager/notifications" label="اعلان‌ها" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
    >
      {label}
    </Link>
  );
}