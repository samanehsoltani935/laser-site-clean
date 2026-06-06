import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما | کابوک طب",
  description: "تماس با کابوک طب — خدمات پس از فروش لیزر پوست",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
