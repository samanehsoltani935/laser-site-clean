import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { WarrantyBadge, StatusBadge } from "@/components/shared/Badges";
import { calculateWarrantyStatus } from "@/lib/domain/warranty";

export default async function DeviceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const device = await prisma.device.findUnique({
    where: { id: params.id },
    include: {
      requests: { orderBy: { createdAt: "desc" } },
      customer: true,
    },
  });

  if (!device) notFound();
  if (
    session.role === "CUSTOMER" &&
    device.customer.userId !== session.userId
  ) {
    redirect("/customer/devices");
  }

  const warranty = calculateWarrantyStatus(device.warrantyEndDate);

  return (
    <div className="space-y-5">
      <div>
        <Link href="/customer/devices" className="text-sm text-primary hover:underline">
          ← بازگشت به لیست
        </Link>
        <h1 className="text-lg font-bold text-gray-900 mt-2">{device.model}</h1>
        <p className="text-sm text-gray-500 font-mono" dir="ltr">
          {device.serialNumber}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="مشخصات دستگاه" />
          <CardContent className="space-y-3 text-sm">
            <Row label="مدل" value={device.model} />
            <Row label="شماره سریال" value={device.serialNumber} ltr />
            <Row label="شعبه" value={device.branch || "—"} />
            <Row
              label="تاریخ خرید"
              value={
                device.purchaseDate
                  ? device.purchaseDate.toLocaleDateString("fa-IR")
                  : "—"
              }
            />
            <div className="flex items-center gap-2">
              <span className="text-gray-500">وضعیت گارانتی:</span>
              <WarrantyBadge status={warranty.status} />
              {!warranty.isExpired && (
                <span className="text-gray-700">
                  ({warranty.remainingDays} روز باقی‌مانده)
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="تاریخچه سرویس" />
          <CardContent>
            {device.requests.length === 0 ? (
              <p className="text-sm text-gray-500">هنوز درخواستی ثبت نشده</p>
            ) : (
              <ul className="space-y-3">
                {device.requests.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between text-sm border-b border-gray-50 pb-2"
                  >
                    <div>
                      <Link
                        href={`/customer/requests/${r.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {r.trackingCode}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">{r.title}</p>
                    </div>
                    <StatusBadge status={r.status} />
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
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800" dir={ltr ? "ltr" : undefined}>
        {value}
      </span>
    </div>
  );
}
