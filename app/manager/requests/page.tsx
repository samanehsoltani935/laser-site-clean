export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { StatusBadge, PriorityBadge } from "@/components/shared/Badges";
import { AssignTechnicianForm } from "@/components/manager/AssignTechnicianForm";

export default async function ManagerRequestsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "MANAGER" && session.role !== "SUPPORT") {
    redirect("/login");
  }

  const [requests, technicians, totalRequests, newRequests, activeRequests] =
    await Promise.all([
      prisma.serviceRequest.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          customer: {
            include: {
              user: true,
            },
          },
          device: true,
          assignedTechnician: true,
        },
      }),

      prisma.user.findMany({
        where: {
          role: "TECHNICIAN",
          isActive: true,
        },
        select: {
          id: true,
          fullName: true,
        },
        orderBy: {
          fullName: "asc",
        },
      }),

      prisma.serviceRequest.count(),

      prisma.serviceRequest.count({
        where: {
          status: "NEW",
        },
      }),

      prisma.serviceRequest.count({
        where: {
          status: {
            notIn: ["COMPLETED", "CLOSED", "REJECTED"],
          },
        },
      }),
    ]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">
          مدیریت درخواست‌ها
        </h1>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          مشاهده، بررسی و ارجاع درخواست‌های خدمات پس از فروش به کارشناسان فنی
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="کل درخواست‌ها"
          value={totalRequests}
          desc="تمام درخواست‌های ثبت‌شده"
        />

        <SummaryCard
          title="درخواست‌های جدید"
          value={newRequests}
          desc="نیازمند بررسی اولیه"
        />

        <SummaryCard
          title="درخواست‌های فعال"
          value={activeRequests}
          desc="در حال بررسی یا انجام"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-bold text-gray-900">
            فهرست درخواست‌های خدمات
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            از این بخش می‌توان درخواست‌ها را مشاهده و به کارشناس فنی ارجاع داد.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            هنوز درخواستی ثبت نشده است.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">
                    کد پیگیری
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    عنوان درخواست
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    مشتری / کلینیک
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    دستگاه
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    اولویت
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    وضعیت
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    کارشناس فنی
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    تاریخ ثبت
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    عملیات
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
                        href={`/manager/requests/${request.id}`}
                        className="font-mono font-semibold text-primary hover:underline"
                        dir="ltr"
                      >
                        {request.trackingCode}
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-gray-800">
                      <Link
                        href={`/manager/requests/${request.id}`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {request.title}
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      <div className="font-medium">
                        {request.customer.clinicName}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {request.customer.user.fullName}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      <div>{request.device.model}</div>

                      <div className="mt-1 font-mono text-xs text-gray-400" dir="ltr">
                        {request.device.serialNumber}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <PriorityBadge priority={request.priority} />
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {request.assignedTechnician?.fullName || "ارجاع نشده"}
                    </td>

                    <td className="px-4 py-3 text-gray-500">
                      {request.createdAt.toLocaleDateString("fa-IR")}
                    </td>

                    <td className="px-4 py-3">
                      <AssignTechnicianForm
                        requestId={request.id}
                        technicians={technicians}
                        currentTechnicianId={request.assignedTechnicianId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  desc,
}: {
  title: string;
  value: number;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>

      <div className="mt-2 text-3xl font-bold text-primary">{value}</div>

      <div className="mt-2 text-xs text-gray-500">{desc}</div>
    </div>
  );
}