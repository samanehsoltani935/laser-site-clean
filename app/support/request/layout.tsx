import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ثبت درخواست خدمات | کابوک طب",
  description: "ثبت آنلاین درخواست تعمیر و سرویس دستگاه لیزر پوست",
};

export default function ServiceRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
