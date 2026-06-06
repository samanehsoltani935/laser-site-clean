import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { AddDeviceButton } from "@/components/customer/AddDeviceModal";
import { WarrantyBadge } from "@/components/shared/Badges";
import { calculateWarrantyStatus } from "@/lib/domain/warranty";
import { DevicesEmptyState } from "@/components/customer/DevicesEmptyState";

export default async function CustomerDevicesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profile = await prisma.customerProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!profile) redirect("/register");

  const devices = await prisma.device.findMany({
    where: { customerId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">دستگاه‌های من</h1>
          <p className="text-sm text-gray-500 mt-1">
            مدیریت سریال‌ها و مشخصات دستگاه‌های ثبت‌شده
          </p>
        </div>
        <AddDeviceButton />
      </div>

      {devices.length === 0 ? (
        <DevicesEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {devices.map((d) => {
            const warranty = calculateWarrantyStatus(d.warrantyEndDate);
            return (
              <div
                key={d.id}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{d.model}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      سریال:{" "}
                      <span className="font-mono" dir="ltr">
                        {d.serialNumber}
                      </span>
                    </div>
                  </div>
                  <WarrantyBadge status={warranty.status} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="rounded-xl bg-gray-50 px-3 py-2">
                    <div className="text-[11px] text-gray-500">شعبه</div>
                    <div className="font-medium text-gray-800">{d.branch || "—"}</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 px-3 py-2">
                    <div className="text-[11px] text-gray-500">گارانتی</div>
                    <div className="font-medium text-gray-800">
                      {warranty.isExpired
                        ? "منقضی"
                        : `${warranty.remainingDays} روز باقی‌مانده`}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/customer/requests/new?deviceId=${d.id}`}
                    className="text-sm font-semibold text-primary hover:text-primary/80 transition"
                  >
                    ثبت درخواست
                  </Link>
                  <Link
                    href={`/customer/devices/${d.id}`}
                    className="text-xs text-gray-600 hover:text-gray-900 transition"
                  >
                    جزئیات
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
