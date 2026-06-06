"use client";

import type { FormEvent } from "react";
import PageHeader from "@/components/site/PageHeader";
import Container from "@/components/Container";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

const contactCards = [
  {
    title: "تلفن تماس",
    value: "021-72153000",
    href: "tel:02172153000",
    icon: Phone,
  },
  {
    title: "ایمیل",
    value: "info@kabookteb.ir",
    href: "mailto:info@kabookteb.ir",
    icon: Mail,
  },
  {
    title: "ساعات پشتیبانی",
    value: "شنبه تا چهارشنبه ۸–۱۷ | پنج‌شنبه ۸–۱۳",
    icon: Clock,
  },
  {
    title: "آدرس",
    value: "پارک فناوری پردیس – فاز ۳ – خیابان کارآفرندی ۱۱ – شرکت کابوک طب",
    icon: MapPin,
  },
];

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: اتصال به API تماس — POST /api/messages
    toast("پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.", "success");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <PageHeader
        title="تماس با ما"
        subtitle="برای پشتیبانی فنی، سفارش قطعات یا هماهنگی سرویس دوره‌ای با کارشناسان کابوک طب در ارتباط باشید."
      />

      <section className="py-10 lg:py-14">
        <Container>
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => {
              const Icon = card.icon;
              const content = (
                <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
                  <div className="mb-3 inline-flex rounded-lg bg-sky-50 p-2.5 text-primary">
                    <Icon size={20} />
                  </div>
                  <h2 className="mb-1 text-sm font-bold text-gray-900">{card.title}</h2>
                  <p className="text-sm leading-relaxed text-gray-600">{card.value}</p>
                </article>
              );

              if (card.href) {
                return (
                  <a key={card.title} href={card.href} className="transition hover:opacity-90">
                    {content}
                  </a>
                );
              }
              return <div key={card.title}>{content}</div>;
            })}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card sm:p-8"
              aria-label="فرم تماس"
            >
              <h3 className="mb-6 text-lg font-bold text-gray-900">ارسال پیام</h3>
              <div className="space-y-4">
                <Input id="name" name="name" label="نام و نام خانوادگی" required />
                <Input
                  id="phone"
                  name="phone"
                  label="شماره تماس"
                  type="tel"
                  dir="ltr"
                  required
                />
                <Input id="email" name="email" label="ایمیل" type="email" dir="ltr" />
                <Textarea
                  id="message"
                  name="message"
                  label="پیام"
                  placeholder="موضوع و متن پیام خود را بنویسید..."
                  required
                />
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full">
                ارسال پیام
              </Button>
            </form>

            <div
              className="flex min-h-[320px] items-center justify-center rounded-2xl border border-gray-100 bg-gradient-to-br from-sky-50 to-gray-100 p-8 text-center shadow-card"
              role="img"
              aria-label="موقعیت شرکت کابوک طب"
            >
              <div>
                <MapPin className="mx-auto mb-4 text-primary" size={40} />
                <p className="text-sm font-medium text-gray-700">
                  پارک فناوری پردیس – فاز ۳
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  خیابان کارآفرندی ۱۱ — شرکت کابوک طب
                </p>
                <p className="mt-4 text-xs text-gray-400">نقشه به‌زودی اضافه می‌شود</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
