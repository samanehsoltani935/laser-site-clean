import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { WarrantyBadge } from "@/components/shared/Badges";
import { calculateWarrantyStatus } from "@/lib/domain/warranty";

export default async function ManagerDevicesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const devices = await prisma.device.findMany({
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">مدیریت دستگاه‌ها</h1>
        <p className="text-sm text-gray-500 mt-1">لیست تمام دستگاه‌های ثبت‌شده</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-right px-4 py-3 font-medium">مدل</th>
              <th className="text-right px-4 py-3 font-medium">سریال</th>
              <th className="text-right px-4 py-3 font-medium">کلینیک</th>
              <th className="text-right px-4 py-3 font-medium">گارانتی</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => {
              const w = calculateWarrantyStatus(d.warrantyEndDate);
              return (
                <tr key={d.id} className="border-t border-gray-50">
                  <td className="px-4 py-3">{d.model}</td>
                  <td className="px-4 py-3 font-mono" dir="ltr">
                    {d.serialNumber}
                  </td>
                  <td className="px-4 py-3">{d.customer.clinicName}</td>
                  <td className="px-4 py-3">
                    <WarrantyBadge status={w.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
