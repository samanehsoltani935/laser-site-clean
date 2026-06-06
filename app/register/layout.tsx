import { ToastProvider } from "@/components/ui/Toast";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
