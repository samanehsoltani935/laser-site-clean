import {
  RequestPriority,
  RequestStatus,
  UserRole,
  WarrantyStatus,
  NotificationType,
} from "@prisma/client";

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  NEW: "جدید",
  IN_REVIEW: "در حال بررسی",
  NEED_MORE_INFO: "نیاز به اطلاعات بیشتر",
  WAITING_FOR_PART: "در انتظار قطعه",
  TECHNICIAN_ASSIGNED: "تکنسین اختصاص یافته",
  IN_PROGRESS: "در حال انجام",
  COMPLETED: "تکمیل شده",
  CLOSED: "بسته شده",
  REJECTED: "رد شده",
};

export const REQUEST_PRIORITY_LABELS: Record<RequestPriority, string> = {
  LOW: "کم",
  MEDIUM: "متوسط",
  HIGH: "بالا",
  URGENT: "فوری",
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: "مشتری / کلینیک",
  TECHNICIAN: "تکنسین",
  MANAGER: "مدیر",
  SUPPORT: "پشتیبانی",
};

export const WARRANTY_STATUS_LABELS: Record<WarrantyStatus, string> = {
  ACTIVE: "فعال",
  EXPIRED: "منقضی",
  EXPIRING_SOON: "رو به اتمام",
};

export const DEVICE_MODELS = [
  "آلکساندرایت نابلکس (Noblex)",
  "دایود لومینس (Lumenis)",
  "IPL Candela",
  "Nd:YAG Quanta",
  "CO2 Fraxel",
];

export const STATUS_COLORS: Record<RequestStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 border-blue-100",
  IN_REVIEW: "bg-indigo-50 text-indigo-700 border-indigo-100",
  NEED_MORE_INFO: "bg-amber-50 text-amber-700 border-amber-100",
  WAITING_FOR_PART: "bg-orange-50 text-orange-700 border-orange-100",
  TECHNICIAN_ASSIGNED: "bg-purple-50 text-purple-700 border-purple-100",
  IN_PROGRESS: "bg-cyan-50 text-cyan-700 border-cyan-100",
  COMPLETED: "bg-green-50 text-green-700 border-green-100",
  CLOSED: "bg-gray-50 text-gray-600 border-gray-100",
  REJECTED: "bg-red-50 text-red-700 border-red-100",
};

export const PRIORITY_COLORS: Record<RequestPriority, string> = {
  LOW: "bg-gray-50 text-gray-600 border-gray-100",
  MEDIUM: "bg-blue-50 text-blue-700 border-blue-100",
  HIGH: "bg-orange-50 text-orange-700 border-orange-100",
  URGENT: "bg-red-50 text-red-700 border-red-100",
};

export { NotificationType };
