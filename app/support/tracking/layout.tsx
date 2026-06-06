import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پیگیری درخواست | کابوک طب",
  description: "پیگیری وضعیت درخواست سرویس دستگاه لیزر",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
