import Container from "@/components/Container";
import {
  CheckCircle2,
  ClipboardPen,
  Headphones,
  Search,
  Wrench,
} from "lucide-react";

const steps = [
  { title: "ثبت درخواست", icon: ClipboardPen },
  { title: "بررسی اولیه", icon: Search },
  { title: "ارجاع به کارشناس فنی", icon: Headphones },
  { title: "انجام سرویس", icon: Wrench },
  { title: "ثبت گزارش و اطلاع‌رسانی", icon: CheckCircle2 },
];

export default function ServiceSteps() {
  return (
    <section className="bg-brand-gray-light py-14 lg:py-20" aria-label="مراحل خدمات">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            فرآیند رسیدگی به درخواست
          </h2>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            از ثبت درخواست تا تکمیل سرویس، هر مرحله شفاف و قابل پیگیری است
          </p>
        </div>

        <div className="relative">
          <div className="absolute right-[10%] left-[10%] top-8 hidden h-0.5 bg-primary/20 lg:block" />
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-primary/20 bg-white shadow-sm">
                    <Icon className="text-primary" size={26} />
                  </div>
                  <span className="mb-1 block text-xs font-bold text-primary/60">
                    مرحله {index + 1}
                  </span>
                  <p className="text-sm font-bold text-gray-800">{step.title}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
