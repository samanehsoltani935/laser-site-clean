export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { StatusBadge, PriorityBadge } from "@/components/shared/Badges";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";

export default async function CustomerRequestsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "CUSTOMER") {
    redirect("/login");
  }

  const profile = await prisma.customerProfile.findUnique({
    where: { userId: session.userId },
  });

  if (!profile) {
    redirect("/register");
  }

  const requests = await prisma.serviceRequest.findMany({
    where: { customerId: profile.id },
    include: {
      device: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            درخواست‌های خدمات من
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            پیگیری وضعیت درخواست‌های ثبت‌شده برای دستگاه‌های شما
          </p>
        </div>

        <Link href="/customer/requests/new">
          <Button>ثبت درخواست جدید</Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          title="درخواستی ثبت نشده است"
          description="هنوز هیچ درخواست خدماتی برای دستگاه‌های شما ثبت نشده است."
          actionLabel="ثبت درخواست خدمات"
          actionHref="/customer/requests/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">
                    کد پیگیری
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    عنوان درخواست
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    دستگاه
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    شماره سریال
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    اولویت
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    وضعیت
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    تاریخ ثبت
                  </th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-t border-gray-50 transition hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/customer/requests/${request.id}`}
                        className="font-mono font-medium text-primary hover:underline"
                        dir="ltr"
                      >
                        {request.trackingCode}
                      </Link>
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900">
                      {request.title}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {request.device.model}
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-600" dir="ltr">
                        {request.device.serialNumber}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <PriorityBadge priority={request.priority} />
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </td>

                    <td className="px-4 py-3 text-gray-500">
                      {request.createdAt.toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}