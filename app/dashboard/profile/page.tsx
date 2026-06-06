"use client";

import { useForm } from "react-hook-form";

type ProfileForm = {
  clinicName: string;
  managerName: string;
  mobile: string;
  phone?: string;
  address?: string;
};

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      clinicName: "کلینیک نمونه",
      managerName: "دکتر رضایی",
      mobile: "09123456789",
      phone: "02112345678",
      address: "تهران، خیابان نمونه، پلاک ۱۲",
    },
  });

  const onSubmit = (data: ProfileForm) => {
    console.log("Profile Submit:", data);
    alert("اطلاعات پروفایل با موفقیت ذخیره شد.");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">پروفایل کلینیک</h1>
        <p className="text-sm text-gray-500 mt-1">
          اطلاعات کلینیک و راه‌های تماس را ویرایش کن
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="نام کلینیک" error={errors.clinicName?.message}>
            <input
              {...register("clinicName", { required: "نام کلینیک الزامی است" })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field label="نام مدیر/مسئول" error={errors.managerName?.message}>
            <input
              {...register("managerName", { required: "نام مسئول الزامی است" })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field label="موبایل" error={errors.mobile?.message}>
            <input
              dir="ltr"
              {...register("mobile", {
                required: "موبایل الزامی است",
                pattern: {
                  value: /^09\d{9}$/,
                  message: "فرمت موبایل صحیح نیست",
                },
              })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field label="تلفن ثابت">
            <input
              dir="ltr"
              {...register("phone")}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Field>
        </div>

        <Field label="آدرس">
          <textarea
            rows={4}
            {...register("address")}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </Field>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
          >
            ذخیره تغییرات
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      {children}
      <div className="mt-1 min-h-[20px] text-xs text-rose-600">{error || ""}</div>
    </div>
  );
}
