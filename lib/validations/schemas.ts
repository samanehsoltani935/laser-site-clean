import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر باشد"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "نام کامل الزامی است"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  phone: z.string().min(10, "شماره تماس معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر باشد"),
  clinicName: z.string().min(2, "نام کلینیک الزامی است"),
  clinicAddress: z.string().optional(),
  nationalCodeOrCompanyId: z.string().optional(),
});

export const deviceSchema = z.object({
  model: z.string().min(1, "مدل دستگاه الزامی است"),
  serialNumber: z.string().min(1, "شماره سریال الزامی است"),
  branch: z.string().optional(),
  purchaseDate: z.string().optional(),
  installationDate: z.string().optional(),
  warrantyStartDate: z.string().optional(),
  warrantyEndDate: z.string().optional(),
});

export const serviceRequestSchema = z.object({
  deviceId: z.string().min(1, "دستگاه را انتخاب کنید"),
  title: z.string().min(3, "عنوان درخواست الزامی است"),
  customerName: z.string().min(2, "نام مشتری الزامی است"),
  phoneNumber: z.string().min(10, "شماره تماس معتبر وارد کنید"),
  clinicAddress: z.string().min(5, "آدرس کلینیک الزامی است"),
  problemDescription: z.string().min(10, "شرح مشکل حداقل ۱۰ کاراکتر باشد"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

export const statusChangeSchema = z.object({
  status: z.enum([
    "NEW",
    "IN_REVIEW",
    "NEED_MORE_INFO",
    "WAITING_FOR_PART",
    "TECHNICIAN_ASSIGNED",
    "IN_PROGRESS",
    "COMPLETED",
    "CLOSED",
    "REJECTED",
  ]),
  note: z.string().optional(),
});

export const assignTechnicianSchema = z.object({
  technicianId: z.string().min(1, "تکنسین را انتخاب کنید"),
});

export const serviceReportSchema = z.object({
  requestId: z.string().min(1),
  actionsDone: z.string().min(5, "اقدامات انجام‌شده الزامی است"),
  technicalNotes: z.string().optional(),
  finalStatus: z.enum(["COMPLETED", "CLOSED", "IN_PROGRESS"]).default("COMPLETED"),
  spareParts: z
    .array(
      z.object({
        sparePartId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .optional(),
});

export const messageSchema = z.object({
  requestId: z.string().min(1),
  body: z.string().min(1, "متن پیام الزامی است"),
});

export const sparePartSchema = z.object({
  name: z.string().min(1, "نام قطعه الزامی است"),
  code: z.string().min(1, "کد قطعه الزامی است"),
  description: z.string().optional(),
  stockQuantity: z.number().int().nonnegative(),
  minimumStock: z.number().int().nonnegative(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type DeviceInput = z.infer<typeof deviceSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
