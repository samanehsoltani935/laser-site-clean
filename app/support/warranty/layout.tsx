export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "استعلام گارانتی | کابوک طب",
  description: "استعلام وضعیت گارانتی دستگاه لیزر با شماره سریال",
};

export default function WarrantyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
