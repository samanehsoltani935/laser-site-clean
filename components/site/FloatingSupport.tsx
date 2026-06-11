"use client";

import Link from "next/link";
import { Headphones, Phone } from "lucide-react";

const PHONE_TEL = "02172153000";

export default function FloatingSupport() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <a
        href={`tel:${PHONE_TEL}`}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-primary shadow-lg transition hover:scale-105 hover:shadow-xl"
        aria-label="تماس با پشتیبانی"
      >
        <Phone size={20} />
      </a>
      <Link
        href="/customer/requests/new"
        className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
      >
        <Headphones size={18} />
        <span className="hidden sm:inline">پشتیبانی فنی</span>
      </Link>
    </div>
  );
}
