export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const dynamicParams = true;

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

  const devices = await prisma.device.findMany({
    where: { customerId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">دستگاه‌های من</h1>
          <p className="mt-1 text-sm text-gray-500">
            مدیریت سریال‌ها و مشخصات دستگاه‌های ثبت‌شده
          </p>
        </div>

        <AddDeviceButton />
      </div>

      {devices.length === 0 ? (
        <DevicesEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {devices.map((device) => {
            const warranty = calculateWarrantyStatus(device.warrantyEndDate);

            return (
              <div
                key={device.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {device.model}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      سریال:{" "}
                      <span className="font-mono" dir="ltr">
                        {device.serialNumber}
                      </span>
                    </div>
                  </div>

                  <WarrantyBadge status={warranty.status} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="rounded-xl bg-gray-50 px-3 py-2">
                    <div className="text-[11px] text-gray-500">شعبه</div>
                    <div className="font-medium text-gray-800">
                      {device.branch || "—"}
                    </div>
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
                    href={`/customer/requests/new?deviceId=${device.id}`}
                    className="text-sm font-semibold text-primary transition hover:text-primary/80"
                  >
                    ثبت درخواست
                  </Link>

                  <Link
                    href={`/customer/devices/${device.id}`}
                    className="text-xs text-gray-600 transition hover:text-gray-900"
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