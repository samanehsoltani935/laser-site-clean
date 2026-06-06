export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";

const quickLinks = [
  {
    title: "ویرایش پروفایل",
    desc: "اطلاعات کلینیک و راه‌های تماس را به‌روزرسانی کن",
    href: "/dashboard/profile",
  },
  {
    title: "دستگاه‌های من",
    desc: "لیست دستگاه‌های ثبت‌شده و سریال‌ها را ببین",
    href: "/dashboard/devices",
  },
  {
    title: "درخواست‌های من",
    desc: "وضعیت درخواست‌های خدمات و پشتیبانی را پیگیری کن",
    href: "/dashboard/requests",
  },
  {
    title: "ثبت درخواست جدید",
    desc: "ثبت خرابی، سرویس یا تعویض قطعه",
    href: "/support/new-request",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-l from-primary to-sky-500 text-white p-6 shadow-sm">
        <h1 className="text-xl font-bold">سلام، خوش اومدی 👋</h1>
        <p className="text-sm text-white/90 mt-2 leading-7">
          از اینجا می‌تونی پروفایل کلینیک، دستگاه‌ها و درخواست‌های خدماتت رو مدیریت کنی.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 hover:shadow-md transition"
          >
            <div className="text-base font-bold text-gray-900">{item.title}</div>
            <div className="text-sm text-gray-500 mt-2 leading-6">{item.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
