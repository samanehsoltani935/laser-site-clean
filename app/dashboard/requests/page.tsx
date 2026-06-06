import Link from "next/link";

type RequestStatus =
  | "در حال بررسی"
  | "نیازمند اطلاعات"
  | "در حال اقدام"
  | "تکمیل شده"
  | "لغو شده";

type RequestRow = {
  id: string;
  createdAt: string;
  deviceModel: string;
  serial: string;
  status: RequestStatus;
};

const mockRequests: RequestRow[] = [
  {
    id: "KB-2026-1023",
    createdAt: "1403/02/20",
    deviceModel: "آلکساندرایت نابلکس (Noblex)",
    serial: "KB-2025-1022",
    status: "در حال بررسی",
  },
  {
    id: "KB-2026-0988",
    createdAt: "1403/02/12",
    deviceModel: "دایود لومینس (Lumenis)",
    serial: "KB-2024-8891",
    status: "نیازمند اطلاعات",
  },
  {
    id: "KB-2026-0741",
    createdAt: "1403/01/30",
    deviceModel: "اندیاگ (Nd:YAG)",
    serial: "KB-2023-1100",
    status: "تکمیل شده",
  },
];

export default function RequestsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">درخواست‌های من</h1>
          <p className="text-sm text-gray-500 mt-1">پیگیری وضعیت، تاریخچه و جزئیات</p>
        </div>

        <Link
          href="/support/new-request"
          className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
        >
          ثبت درخواست جدید
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
          <div className="col-span-3">کد پیگیری</div>
          <div className="col-span-2">تاریخ</div>
          <div className="col-span-3">مدل</div>
          <div className="col-span-2">سریال</div>
          <div className="col-span-2">وضعیت</div>
        </div>

        {mockRequests.map((r) => (
          <Link
            key={r.id}
            href={`/dashboard/requests/${r.id}`}
            className="grid grid-cols-12 px-4 py-3 text-sm border-b border-gray-50 hover:bg-gray-50/60 transition"
          >
            <div className="col-span-3 font-mono" dir="ltr">
              {r.id}
            </div>
            <div className="col-span-2 text-gray-700">{r.createdAt}</div>
            <div className="col-span-3 text-gray-800 font-medium">{r.deviceModel}</div>
            <div className="col-span-2 font-mono text-gray-700" dir="ltr">
              {r.serial}
            </div>
            <div className="col-span-2">{StatusPill(r.status)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatusPill(status: RequestStatus) {
  const map: Record<RequestStatus, string> = {
    "در حال بررسی": "bg-blue-50 text-blue-700 border-blue-100",
    "نیازمند اطلاعات": "bg-amber-50 text-amber-800 border-amber-100",
    "در حال اقدام": "bg-purple-50 text-purple-700 border-purple-100",
    "تکمیل شده": "bg-green-50 text-green-700 border-green-100",
    "لغو شده": "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span className={`inline-flex text-[11px] px-2 py-1 rounded-full border ${map[status]}`}>
      {status}
    </span>
  );
}
