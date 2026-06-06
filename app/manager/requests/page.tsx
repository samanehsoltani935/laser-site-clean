import Link from "next/link";
import { listRequests } from "@/lib/services/request.service";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { StatusBadge, PriorityBadge } from "@/components/shared/Badges";
import { prisma } from "@/lib/db/prisma";
import { AssignTechnicianForm } from "@/components/manager/AssignTechnicianForm";

export default async function ManagerRequestsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [requests, technicians] = await Promise.all([
    listRequests({}),
    prisma.user.findMany({
      where: { role: "TECHNICIAN", isActive: true },
      select: { id: true, fullName: true },
    }),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">مدیریت درخواست‌ها</h1>
        <p className="text-sm text-gray-500 mt-1">مشاهده و اختصاص درخواست‌ها به تکنسین</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-right px-4 py-3 font-medium">کد</th>
              <th className="text-right px-4 py-3 font-medium">کلینیک</th>
              <th className="text-right px-4 py-3 font-medium">اولویت</th>
              <th className="text-right px-4 py-3 font-medium">وضعیت</th>
              <th className="text-right px-4 py-3 font-medium">تکنسین</th>
              <th className="text-right px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t border-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/manager/requests/${r.id}`}
                    className="font-mono text-primary hover:underline"
                    dir="ltr"
                  >
                    {r.trackingCode}
                  </Link>
                </td>
                <td className="px-4 py-3">{r.customer.clinicName}</td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={r.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {r.assignedTechnician?.fullName || "—"}
                </td>
                <td className="px-4 py-3">
                  <AssignTechnicianForm
                    requestId={r.id}
                    technicians={technicians}
                    currentTechnicianId={r.assignedTechnicianId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
