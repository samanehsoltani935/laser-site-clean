import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { PanelSidebar } from "@/components/panel/PanelSidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <ToastProvider>
      <section className="bg-[#f8fafc] min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <PanelSidebar role={session.role} userName={session.fullName} />
            <main className="lg:col-span-9 xl:col-span-10">{children}</main>
          </div>
        </div>
      </section>
    </ToastProvider>
  );
}
