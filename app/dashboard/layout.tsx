import Link from "next/link";

const menu = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/dashboard/profile", label: "پروفایل کلینیک" },
  { href: "/dashboard/devices", label: "دستگاه‌های من" },
  { href: "/dashboard/requests", label: "درخواست‌های من" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[#f8fafc] min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3 xl:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 sticky top-24">
              <div className="pb-4 border-b border-gray-100">
                <div className="text-sm text-gray-500">پنل مشتریان</div>
                <div className="text-base font-bold text-gray-900 mt-1">
                  کابوک طب
                </div>
              </div>

              <nav className="mt-4 space-y-2">
                {menu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href="/"
                  className="block text-center rounded-xl px-3 py-2 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  بازگشت به سایت
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-9 xl:col-span-10">{children}</main>
        </div>
      </div>
    </section>
  );
}
