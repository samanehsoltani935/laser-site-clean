import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { StatusBadge, PriorityBadge } from "@/components/shared/Badges";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";

export default async function CustomerRequestsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profile = await prisma.customerProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!profile) redirect("/register");

  const requests = await prisma.serviceRequest.findMany({
    where: { customerId: profile.id },
    include: { device: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">درخواست‌های من</h1>
          <p className="text-sm text-gray-500 mt-1">پیگیری وضعیت درخواست‌های خدمات</p>
        </div>
        <Link href="/customer/requests/new">
          <Button>ثبت درخواست جدید</Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          title="درخواستی ثبت نشده"
          description="اولین درخواست خدمات خود را ثبت کنید."
          actionLabel="ثبت درخواست"
          actionHref="/customer/requests/new"
        />
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-right px-4 py-3 font-medium">کد پیگیری</th>
                <th className="text-right px-4 py-3 font-medium">عنوان</th>
                <th className="text-right px-4 py-3 font-medium">دستگاه</th>
                <th className="text-right px-4 py-3 font-medium">اولویت</th>
                <th className="text-right px-4 py-3 font-medium">وضعیت</th>
                <th className="text-right px-4 py-3 font-medium">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/customer/requests/${r.id}`}
                      className="font-mono text-primary font-medium hover:underline"
                      dir="ltr"
                    >
                      {r.trackingCode}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3 text-gray-600">{r.device.model}</td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={r.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {r.createdAt.toLocaleDateString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
