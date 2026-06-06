export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import type { Metadata } from "next";
import { Roboto, Vazirmatn } from "next/font/google";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import FloatingSupport from "@/components/site/FloatingSupport";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "سیستم خدمات پس از فروش | کابوک طب",
  description:
    "سیستم خدمات پس از فروش دستگاه لیزر پوست — ثبت، پیگیری و مدیریت درخواست‌های سرویس",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${roboto.variable} ${vazirmatn.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-white font-persian text-gray-800 antialiased">
        <ToastProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <FloatingSupport />
          <SiteFooter />
        </ToastProvider>
      </body>
    </html>
  );
}