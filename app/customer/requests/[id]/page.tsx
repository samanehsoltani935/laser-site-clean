export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const dynamicParams = true;

import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { WarrantyBadge, StatusBadge } from "@/components/shared/Badges";
import { calculateWarrantyStatus } from "@/lib/domain/warranty";

export default async function DeviceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "CUSTOMER") {
    redirect("/login");
  }

  const device = await prisma.device.findUnique({
    where: {
      id: params.id,
    },
    include: {
      customer: true,
      requests: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!device) {
    notFound();
  }

  if (device.customer.userId !== session.userId) {
    redirect("/customer/devices");
  }

  const warranty = calculateWarrantyStatus(device.warrantyEndDate);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/customer/devices"
            className="text-sm font-semibold text-primary hover:underline"
          >
            بازگشت به لیست دستگاه‌ها
          </Link>

          <h1 className="mt-2 text-lg font-bold text-gray-900">
            {device.model}
          </h1>

          <p className="mt-1 font-mono text-sm text-gray-500" dir="ltr">
            {device.serialNumber}
          </p>
        </div>

        <Link
          href={`/customer/requests/new?deviceId=${device.id}`}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          ثبت درخواست خدمات
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent>
            <div className="mb-4 text-sm font-bold text-gray-900">
              مشخصات دستگاه
            </div>

            <div className="space-y-3 text-sm">
              <Row label="مدل دستگاه" value={device.model} />

              <Row
                label="شماره سریال"
                value={device.serialNumber}
                ltr
              />

              <Row
                label="شعبه / واحد"
                value={device.branch || "—"}
              />

              <Row
                label="تاریخ خرید"
                value={
                  device.purchaseDate
                    ? device.purchaseDate.toLocaleDateString("fa-IR")
                    : "—"
                }
              />

              <Row
                label="تاریخ نصب"
                value={
                  device.installationDate
                    ? device.installationDate.toLocaleDateString("fa-IR")
                    : "—"
                }
              />

              <Row
                label="شروع گارانتی"
                value={
                  device.warrantyStartDate
                    ? device.warrantyStartDate.toLocaleDateString("fa-IR")
                    : "—"
                }
              />

              <Row
                label="پایان گارانتی"
                value={
                  device.warrantyEndDate
                    ? device.warrantyEndDate.toLocaleDateString("fa-IR")
                    : "—"
                }
              />

              <div className="flex items-center gap-2 pt-2">
                <span className="text-gray-500">وضعیت گارانتی:</span>

                <WarrantyBadge status={warranty.status} />

                {!warranty.isExpired && (
                  <span className="text-gray-700">
                    ({warranty.remainingDays} روز باقی‌مانده)
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="mb-4 text-sm font-bold text-gray-900">
              تاریخچه درخواست‌ها و سرویس‌ها
            </div>

            {device.requests.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                هنوز درخواستی برای این دستگاه ثبت نشده است.
              </div>
            ) : (
              <ul className="space-y-3">
                {device.requests.map((request) => (
                  <li
                    key={request.id}
                    className="flex items-center justify-between gap-3 border-b border-gray-50 pb-3 text-sm last:border-b-0 last:pb-0"
                  >
                    <div>
                      <Link
                        href={`/customer/requests/${request.id}`}
                        className="font-mono font-medium text-primary hover:underline"
                        dir="ltr"
                      >
                        {request.trackingCode}
                      </Link>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {request.title}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {request.createdAt.toLocaleDateString("fa-IR")}
                      </p>
                    </div>

                    <StatusBadge status={request.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-50 pb-2 last:border-b-0 last:pb-0">
      <span className="text-gray-500">{label}</span>

      <span
        className="font-medium text-gray-800"
        dir={ltr ? "ltr" : undefined}
      >
        {value}
      </span>
    </div>
  );
}