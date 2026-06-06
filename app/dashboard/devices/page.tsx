import Link from "next/link";

type Device = {
  id: string;
  model: string;
  serial: string;
  branch?: string;
  installDate?: string;
  status?: "active" | "inactive";
};

const mockDevices: Device[] = [
  {
    id: "1",
    model: "آلکساندرایت نابلکس (Noblex)",
    serial: "KB-2025-1022",
    branch: "شعبه مرکزی",
    installDate: "1403/02/15",
    status: "active",
  },
  {
    id: "2",
    model: "دایود لومینس (Lumenis)",
    serial: "KB-2024-8891",
    branch: "شعبه غرب",
    installDate: "1402/10/02",
    status: "active",
  },
];

export default function DevicesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">دستگاه‌های من</h1>
          <p className="text-sm text-gray-500 mt-1">
            مدیریت سریال‌ها و مشخصات دستگاه‌های ثبت‌شده
          </p>
        </div>

        <Link
          href="/dashboard/devices/new"
          className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
        >
          افزودن دستگاه
        </Link>
      </div>

      {mockDevices.length === 0 ? (
        <EmptyState
          title="هنوز دستگاهی ثبت نشده"
          desc="برای شروع، اولین دستگاه کلینیک را اضافه کن."
          ctaHref="/dashboard/devices/new"
          ctaLabel="افزودن دستگاه"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockDevices.map((d) => (
            <DeviceCard key={d.id} device={d} />
          ))}
        </div>
      )}
    </div>
  );
}

function DeviceCard({ device }: { device: Device }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-gray-900">{device.model}</div>
          <div className="text-xs text-gray-500 mt-1">
            سریال:{" "}
            <span className="font-mono" dir="ltr">
              {device.serial}
            </span>
          </div>
        </div>

        <span className="text-[11px] px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
          فعال
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="rounded-xl bg-gray-50 px-3 py-2">
          <div className="text-[11px] text-gray-500">شعبه</div>
          <div className="font-medium text-gray-800">{device.branch || "—"}</div>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2">
          <div className="text-[11px] text-gray-500">تاریخ نصب</div>
          <div className="font-medium text-gray-800">{device.installDate || "—"}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link
          href={`/support/new-request?serial=${encodeURIComponent(device.serial)}`}
          className="text-sm font-semibold text-primary hover:text-primary/80 transition"
        >
          ثبت درخواست برای این دستگاه
        </Link>

        <Link
          href={`/dashboard/devices/${device.id}`}
          className="text-xs text-gray-600 hover:text-gray-900 transition"
        >
          جزئیات
        </Link>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  desc,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  desc: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
      <div className="text-base font-bold text-gray-900">{title}</div>
      <div className="text-sm text-gray-500 mt-1">{desc}</div>
      <Link
        href={ctaHref}
        className="inline-flex mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
