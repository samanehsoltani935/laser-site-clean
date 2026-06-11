"use client";

import type { ReactNode } from "react";
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
  icon: ReactNode;
};

const menus: Record<string, { title: string; items: MenuItem[] }> = {
  CUSTOMER: {
    title: "پنل مشتری",
    items: [
      {
        href: "/customer/dashboard",
        label: "داشبورد",
        icon: <LayoutDashboard size={16} />,
      },
      {
        href: "/customer/devices",
        label: "دستگاه‌های من",
        icon: <Monitor size={16} />,
      },
      {
        href: "/customer/requests",
        label: "درخواست‌های من",
        icon: <FileText size={16} />,
      },
    ],
  },

  TECHNICIAN: {
    title: "پنل کارشناس فنی",
    items: [
      {
        href: "/technician/requests",
        label: "درخواست‌های ارجاع‌شده",
        icon: <Wrench size={16} />,
      },
    ],
  },

  MANAGER: {
    title: "پنل مدیریت",
    items: [
      {
        href: "/manager/dashboard",
        label: "داشبورد",
        icon: <BarChart3 size={16} />,
      },
      {
        href: "/manager/requests",
        label: "درخواست‌ها",
        icon: <FileText size={16} />,
      },
      {
        href: "/manager/users",
        label: "کاربران",
        icon: <Users size={16} />,
      },
      {
        href: "/manager/devices",
        label: "دستگاه‌ها",
        icon: <Monitor size={16} />,
      },
      {
        href: "/manager/spare-parts",
        label: "قطعات یدکی",
        icon: <Package size={16} />,
      },
      {
        href: "/manager/reports",
        label: "گزارش‌ها",
        icon: <FileText size={16} />,
      },
      {
        href: "/manager/notifications",
        label: "اعلان‌ها",
        icon: <Bell size={16} />,
      },
    ],
  },

  SUPPORT: {
    title: "پنل پشتیبانی",
    items: [
      {
        href: "/manager/dashboard",
        label: "داشبورد",
        icon: <BarChart3 size={16} />,
      },
      {
        href: "/manager/requests",
        label: "درخواست‌ها",
        icon: <FileText size={16} />,
      },
      {
        href: "/manager/notifications",
        label: "اعلان‌ها",
        icon: <Bell size={16} />,
      },
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
      <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="border-b border-gray-100 pb-4">
          <div className="text-sm text-gray-500">{menu.title}</div>

          <div className="mt-1 text-base font-bold text-gray-900">
            کابوک طب
          </div>

          <div className="mt-1 text-xs text-gray-500">{userName}</div>

          <div className="mt-1 text-xs font-medium text-primary">
            {getRoleLabel(role)}
          </div>
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

        <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
          <Link
            href="/"
            className="block rounded-xl border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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

function getRoleLabel(role: string) {
  switch (role) {
    case "CUSTOMER":
      return "مشتری";
    case "MANAGER":
      return "مدیر سیستم";
    case "SUPPORT":
      return "پشتیبان";
    case "TECHNICIAN":
      return "کارشناس فنی";
    default:
      return "عضو سامانه";
  }
}