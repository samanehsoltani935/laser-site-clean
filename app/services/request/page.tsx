"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Wrench, User, Building, Cpu, FileText, Send, CheckCircle2, Paperclip } from "lucide-react";

interface IFormInput {
  customerName: string;
  clinicName: string;
  deviceModel: string;
  serialNumber: string;
  description: string;
  attachment?: FileList; // اضافه شد
}

export default function ServiceRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState(""); // برای ذخیره شماره پیگیری

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setIsSubmitting(true);
    // تولید شماره پیگیری
    const newCode = `KB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTrackingCode(newCode);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 8000); // زمان بیشتر برای یادداشت کردن کد
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white text-center">
          <div className="inline-flex p-3 bg-white/10 rounded-full mb-3">
            <Wrench className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">سامانه خدمات پس از فروش کابوک طب</h1>
          <p className="text-teal-100 text-sm mt-1">فرم ثبت درخواست تعمیر و سرویس دستگاه‌های لیزر</p>
        </div>

        <div className="p-8">
          {isSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">ثبت موفقیت‌آمیز!</span>
                <p className="text-sm mt-1">درخواست شما با کد رهگیری <span className="font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded">{trackingCode}</span> در سیستم ثبت شد.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* نام مشتری */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                نام و نام خانوادگی /
              </label>
              <input
                type="text"
                {...register("customerName", { required: "وارد کردن نام الزامی است" })}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${errors.customerName ? "border-red-300" : "border-slate-200 focus:ring-teal-100"}`}
              />
            </div>

            {/* نام کلینیک */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                نام کلینیک /
              </label>
              <input
                type="text"
                {...register("clinicName", { required: "وارد کردن نام کلینیک الزامی است" })}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${errors.customerName ? "border-red-300" : "border-slate-200 focus:ring-teal-100"}`}
              />
            </div>

            {/* مدل دستگاه */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-400" />
                مدل دستگاه لیزر
              </label>
              <select
                {...register("deviceModel", { required: "انتخاب مدل دستگاه الزامی است" })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white"
              >
                <option value="">-- انتخاب کنید --</option>
                <option value="Clara"> کلارا </option>
                <option value="Clara pro"> کلارا پرو </option>              
              </select>
            </div>

            {/* شماره سریال */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                شماره سریال دستگاه (S/N)
              </label>
              <input
                type="text"
                dir="ltr"
                {...register("serialNumber", { required: "شماره سریال الزامی است" })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-left"
                placeholder="KB-2026-X9"
              />
            </div>

            {/* پیوست فایل */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-slate-400" />
                پیوست مستندات یا تصویر خرابی
              </label>
              <input
                type="file"
                {...register("attachment")}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm file:ml-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-teal-50 file:text-teal-700"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-4 rounded-xl text-white font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? "در حال ثبت..." : <><Send className="w-4 h-4" /> ارسال درخواست سرویس</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
