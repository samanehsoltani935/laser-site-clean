import Link from "next/link";

type RequestStatus =
  | "در حال بررسی"
  | "نیازمند اطلاعات"
  | "در حال اقدام"
  | "تکمیل شده"
  | "لغو شده";

type RequestDetails = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: RequestStatus;
  deviceModel: string;
  serial: string;
  subject: string;
  description: string;
  timeline: Array<{ at: string; title: string; note?: string }>;
};

const mockRequests: RequestDetails[] = [
  {
    id: "KB-2026-1023",
    createdAt: "1403/02/20",
    updatedAt: "1403/02/21",
    status: "در حال بررسی",
    deviceModel: "آلکساندرایت نابلکس (Noblex)",
    serial: "KB-2025-1022",
    subject: "افت توان خروجی دستگاه",
    description: "کارکرد دستگاه کاهش پیدا کرده و خروجی مثل قبل نیست. نیاز به بررسی دارد.",
    timeline: [
      { at: "1403/02/20 10:12", title: "ثبت درخواست توسط کلینیک" },
      { at: "1403/02/20 12:05", title: "ارجاع به واحد فنی", note: "در انتظار بررسی اولیه" },
    ],
  },
  {
    id: "KB-2026-0988",
    createdAt: "1403/02/12",
    updatedAt: "1403/02/14",
    status: "نیازمند اطلاعات",
    deviceModel: "دایود لومینس (Lumenis)",
    serial: "KB-2024-8891",
    subject: "خطای سیستم هنگام شات",
    description: "در حین کار ارور ظاهر می‌شود. نیازمند راهنمایی/بررسی.",
    timeline: [
      { at: "1403/02/12 09:20", title: "ثبت درخواست توسط کلینیک" },
      { at: "1403/02/12 11:00", title: "بررسی اولیه", note: "لطفاً عکس از صفحه خطا ارسال شود" },
      { at: "1403/02/14 15:30", title: "در انتظار اطلاعات مشتری" },
    ],
  },
];

// Helper components for clean code
function StatusPill(status: RequestStatus) {
  const colors: Record<RequestStatus, string> = {
    "در حال بررسی": "bg-blue-50 text-blue-600",
    "نیازمند اطلاعات": "bg-amber-50 text-amber-600",
    "در حال اقدام": "bg-purple-50 text-purple-600",
    "تکمیل شده": "bg-green-50 text-green-600",
    "لغو شده": "bg-gray-50 text-gray-600",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[status]}`}>
      {status}
    </span>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-gray-800 mt-0.5">{value}</div>
    </div>
  );
}

export default async function RequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const req = mockRequests.find((r) => r.id === id);

  if (!req) {
    return (
      <div className="space-y-3 p-6">
        <h1 className="text-lg font-bold text-gray-900">جزئیات درخواست</h1>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-600">
          درخواستی با این کد پیدا نشد.
        </div>
        <Link className="text-sm font-semibold text-primary" href="/dashboard/requests">
          بازگشت به لیست درخواست‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">جزئیات درخواست</h1>
          <p className="text-sm text-gray-500 mt-1">
            کد پیگیری: <span className="font-mono" dir="ltr">{req.id}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/requests"
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            لیست درخواست‌ها
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-bold text-gray-900">{req.subject}</div>
            {StatusPill(req.status)}
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Info label="تاریخ ثبت" value={req.createdAt} />
            <Info label="آخرین بروزرسانی" value={req.updatedAt} />
            <Info label="مدل دستگاه" value={req.deviceModel} />
            <Info
              label="سریال دستگاه"
              value={<span className="font-mono" dir="ltr">{req.serial}</span>}
            />
          </div>

          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <div className="text-xs font-semibold text-gray-600">شرح مشکل/درخواست</div>
            <div className="text-sm text-gray-700 mt-1 leading-7">{req.description}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-4">
          <div className="text-sm font-bold text-gray-900">تایم‌لاین وضعیت</div>
          <ol className="space-y-3">
            {req.timeline.map((t, idx) => (
              <li key={idx} className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary/70" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">{t.at}</div>
                  <div className="text-sm font-semibold text-gray-900">{t.title}</div>
                  {t.note ? <div className="text-xs text-gray-600 mt-1">{t.note}</div> : null}
                </div>
              </li>
            ))}
          </ol>

          {req.status === "نیازمند اطلاعات" && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <div className="text-sm font-bold text-amber-900">نیازمند اطلاعات</div>
              <div className="text-xs text-amber-800 mt-1 leading-6">
                لطفاً عکس/ویدیو از خطا یا توضیحات تکمیلی ارسال کنید.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
