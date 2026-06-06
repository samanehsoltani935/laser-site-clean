import { differenceInHours, isBefore } from "date-fns";

export type SlaInfo = {
  remainingHours: number;
  isOverdue: boolean;
  isWarning: boolean;
  label: string;
};

export function calculateSla(slaDueAt: Date | null | undefined): SlaInfo {
  if (!slaDueAt) {
    return {
      remainingHours: 0,
      isOverdue: false,
      isWarning: false,
      label: "تعیین نشده",
    };
  }

  const now = new Date();
  const remainingHours = differenceInHours(slaDueAt, now);
  const isOverdue = isBefore(slaDueAt, now);
  const isWarning = !isOverdue && remainingHours <= 24;

  let label: string;
  if (isOverdue) {
    label = "گذشته از مهلت";
  } else if (remainingHours < 24) {
    label = `${remainingHours} ساعت باقی‌مانده`;
  } else {
    const days = Math.floor(remainingHours / 24);
    label = `${days} روز باقی‌مانده`;
  }

  return { remainingHours, isOverdue, isWarning, label };
}

export function defaultSlaDue(priority: string): Date {
  const now = new Date();
  const hours: Record<string, number> = {
    URGENT: 8,
    HIGH: 24,
    MEDIUM: 48,
    LOW: 72,
  };
  return new Date(now.getTime() + (hours[priority] || 48) * 60 * 60 * 1000);
}
