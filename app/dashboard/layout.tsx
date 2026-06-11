import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/dashboard/profile", label: "پروفایل" },
  { href: "/dashboard/devices", label: "دستگاه‌ها" },
  { href: "/dashboard/requests", label: "درخواست‌ها" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="border-b border-gray-100 pb-4">
              <div className="text-sm text-gray-500">پنل کاربری</div>

              <div className="mt-1 text-base font-bold text-gray-900">
                کابوک طب
              </div>

              <div className="mt-1 text-xs text-gray-500">
                {session.fullName || "عضو سامانه"}
              </div>
            </div>

            <nav className="mt-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <Link
                href="/"
                className="block rounded-xl border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                بازگشت به سایت
              </Link>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}