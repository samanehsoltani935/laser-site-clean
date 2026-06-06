import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { listRequests } from "@/lib/services/request.service";
import { redirect } from "next/navigation";
import { StatusBadge, PriorityBadge } from "@/components/shared/Badges";
import { EmptyState } from "@/components/shared/EmptyState";
import { calculateSla } from "@/lib/domain/sla";

export default async function TechnicianRequestsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const requests = await listRequests({ technicianId: session.userId });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">درخواست‌های محول‌شده</h1>
        <p className="text-sm text-gray-500 mt-1">
          مدیریت و پیگیری درخواست‌های اختصاص‌یافته به شما
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          title="درخواستی محول نشده"
          description="هنوز درخواستی به شما اختصاص داده نشده است."
        />
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-right px-4 py-3 font-medium">کد</th>
                <th className="text-right px-4 py-3 font-medium">عنوان</th>
                <th className="text-right px-4 py-3 font-medium">کلینیک</th>
                <th className="text-right px-4 py-3 font-medium">اولویت</th>
                <th className="text-right px-4 py-3 font-medium">وضعیت</th>
                <th className="text-right px-4 py-3 font-medium">SLA</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const sla = calculateSla(r.slaDueAt);
                return (
                  <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/technician/requests/${r.id}`}
                        className="font-mono text-primary font-medium hover:underline"
                        dir="ltr"
                      >
                        {r.trackingCode}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{r.title}</td>
                    <td className="px-4 py-3">{r.customer.clinicName}</td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={r.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td
                      className={`px-4 py-3 text-xs ${sla.isOverdue ? "text-red-600 font-medium" : sla.isWarning ? "text-amber-600" : "text-gray-500"}`}
                    >
                      {sla.label}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
