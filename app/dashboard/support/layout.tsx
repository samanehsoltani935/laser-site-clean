import type { ReactNode } from "react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const dynamicParams = true;

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
