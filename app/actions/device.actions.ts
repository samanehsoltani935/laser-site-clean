"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { deviceSchema } from "@/lib/validations/schemas";
import { zodFirstError } from "@/lib/api/helpers";
import { createDevice } from "@/lib/services/device.service";

export async function addDeviceAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "CUSTOMER") {
    return { success: false, error: "دسترسی غیرمجاز" };
  }

  const profile = await prisma.customerProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!profile) {
    return { success: false, error: "پروفایل مشتری یافت نشد" };
  }

  const parsed = deviceSchema.safeParse({
    model: formData.get("model"),
    serialNumber: formData.get("serialNumber"),
    branch: formData.get("branch") || undefined,
    purchaseDate: formData.get("purchaseDate") || undefined,
    installationDate: formData.get("installationDate") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: zodFirstError(parsed.error),
    };
  }

  try {
    await createDevice(profile.id, parsed.data);
    revalidatePath("/customer/devices");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "خطا در ثبت دستگاه",
    };
  }
}
