import Link from "next/link";

type Device = {
  id: string;
  model: string;
  serial: string;
  branch?: string;
  installDate?: string;
  warrantyUntil?: string;
  notes?: string;
};

const mockDevices: Device[] = [
  {
    id: "1",
    model: "آلکساندرایت نابلکس (Noblex)",
    serial: "KB-2025-1022",
    branch: "شعبه مرکزی",
    installDate: "1403/02/15",
    warrantyUntil: "1404/02/15",
    notes: "سرویس دوره‌ای هر ۶ ماه توصیه می‌شود.",
  },
  {
    id: "2",
    model: "دایود لومینس (Lumenis)",
    serial: "KB-2024-8891",
    branch: "شعبه غرب",
    installDate: "1402/10/02",
    warrantyUntil: "1403/10/02",
    notes: "آخرین سرویس: 1403/01/20",
  },
];

export default async function DeviceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const device = mockDevices.find((d) => d.id === id);

  if (!device) {
    return (
      <div className="space-y-3">
        <h1 className="text-lg font-bold text-gray-900">جزئیات دستگاه</h1>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-600">
          دستگاهی با این شناسه پیدا نشد.
        </div>
        <Link className="text-sm font-semibold text-primary" href="/dashboard/devices">
          بازگشت به لیست دستگاه‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">جزئیات دستگاه</h1>
          <p className="text-sm text-gray-500 mt-1">
            {device.model} —{" "}
            <span className="font-mono" dir="ltr">
              {device.serial}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/devices"
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            لیست دستگاه‌ها
          </Link>

          <Link
            href={`/support/new-request?serial=${encodeURIComponent(device.serial)}`}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
          >
            ثبت درخواست برای این دستگاه
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
          <div className="text-sm font-bold text-gray-900">مشخصات</div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Info label="مدل دستگاه" value={device.model} />
            <Info
              label="شماره سریال"
              value={
                <span className="font-mono" dir="ltr">
                  {device.serial}
                </span>
              }
            />
            <Info label="شعبه/واحد" value={device.branch || "—"} />
            <Info label="تاریخ نصب" value={device.installDate || "—"} />
            <Info label="اعتبار گارانتی تا" value={device.warrantyUntil || "—"} />
          </div>

          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <div className="text-xs font-semibold text-gray-600">یادداشت</div>
            <div className="text-sm text-gray-700 mt-1">{device.notes || "—"}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-3">
          <div className="text-sm font-bold text-gray-900">اقدامات سریع</div>

          <Link
            href={`/support/new-request?serial=${encodeURIComponent(device.serial)}`}
            className="block text-center px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
          >
            ثبت درخواست خدمات
          </Link>

          <Link
            href={`/support/tracking?serial=${encodeURIComponent(device.serial)}`}
            className="block text-center px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            پیگیری درخواست‌ها
          </Link>

          <div className="text-xs text-gray-500 pt-2">
            فعلاً دیتای این صفحه Mock است.
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3">
      <div className="text-[11px] text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-gray-900 mt-1">{value}</div>
    </div>
  );
}
