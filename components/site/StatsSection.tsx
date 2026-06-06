import Container from "@/components/Container";
import { Clock, Headset, Smile, Ticket } from "lucide-react";

const stats = [
  {
    label: "تعداد درخواست‌ها",
    value: "+۲,۴۵۰",
    icon: Ticket,
  },
  {
    label: "میانگین زمان پاسخگویی",
    value: "۴ ساعت",
    icon: Clock,
  },
  {
    label: "تکنسین‌های فعال",
    value: "۱۸",
    icon: Headset,
  },
  {
    label: "رضایت مشتریان",
    value: "۹۶٪",
    icon: Smile,
  },
];

export default function StatsSection() {
  return (
    <section className="py-14 lg:py-20" aria-label="آمار خدمات">
      <Container>
        <div className="rounded-3xl bg-gradient-to-br from-primary to-sky-800 px-6 py-10 shadow-xl sm:px-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              اعتماد کلینیک‌ها به کابوک طب
            </h2>
            <p className="mt-2 text-sm text-white/75">
              اعداد نمونه — پس از اتصال API، داده‌های واقعی نمایش داده می‌شود
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-sm"
                >
                  <Icon className="mx-auto mb-3 text-sky-200" size={28} />
                  <p className="text-2xl font-extrabold text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-white/75 sm:text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
