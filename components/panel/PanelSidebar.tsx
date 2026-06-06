"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Monitor,
  FileText,
  Users,
  Package,
  Bell,
  BarChart3,
  LogOut,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const menus: Record<string, { title: string; items: MenuItem[] }> = {
  CUSTOMER: {
    title: "پنل مشتریان",
    items: [
      { href: "/customer/dashboard", label: "داشبورد", icon: <LayoutDashboard size={16} /> },
      { href: "/customer/devices", label: "دستگاه‌های من", icon: <Monitor size={16} /> },
      { href: "/customer/requests", label: "درخواست‌های من", icon: <FileText size={16} /> },
    ],
  },
  TECHNICIAN: {
    title: "پنل تکنسین",
    items: [
      { href: "/technician/requests", label: "درخواست‌های محول‌شده", icon: <Wrench size={16} /> },
    ],
  },
  MANAGER: {
    title: "پنل مدیریت",
    items: [
      { href: "/manager/dashboard", label: "داشبورد", icon: <BarChart3 size={16} /> },
      { href: "/manager/requests", label: "درخواست‌ها", icon: <FileText size={16} /> },
      { href: "/manager/users", label: "کاربران", icon: <Users size={16} /> },
      { href: "/manager/devices", label: "دستگاه‌ها", icon: <Monitor size={16} /> },
      { href: "/manager/spare-parts", label: "قطعات یدکی", icon: <Package size={16} /> },
      { href: "/manager/reports", label: "گزارش‌ها", icon: <FileText size={16} /> },
      { href: "/manager/notifications", label: "اعلان‌ها", icon: <Bell size={16} /> },
    ],
  },
  SUPPORT: {
    title: "پنل پشتیبانی",
    items: [
      { href: "/manager/dashboard", label: "داشبورد", icon: <BarChart3 size={16} /> },
      { href: "/manager/requests", label: "درخواست‌ها", icon: <FileText size={16} /> },
      { href: "/manager/notifications", label: "اعلان‌ها", icon: <Bell size={16} /> },
    ],
  },
};

export function PanelSidebar({
  role,
  userName,
}: {
  role: string;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const menu = menus[role] || menus.CUSTOMER;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="lg:col-span-3 xl:col-span-2">
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 sticky top-24">
        <div className="pb-4 border-b border-gray-100">
          <div className="text-sm text-gray-500">{menu.title}</div>
          <div className="text-base font-bold text-gray-900 mt-1">کابوک طب</div>
          <div className="text-xs text-gray-500 mt-1">{userName}</div>
        </div>

        <nav className="mt-4 space-y-1">
          {menu.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
          <Link
            href="/"
            className="block text-center rounded-xl px-3 py-2 text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            بازگشت به سایت
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-red-500 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            خروج
          </Button>
        </div>
      </div>
    </aside>
  );
}
