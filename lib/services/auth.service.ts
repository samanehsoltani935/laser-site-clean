import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { RegisterInput } from "@/lib/validations/schemas";
import { UserRole } from "@prisma/client";

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { customerProfile: true, technicianProfile: true },
  });

  if (!user || !user.isActive) {
    throw new Error("ایمیل یا رمز عبور اشتباه است");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new Error("ایمیل یا رمز عبور اشتباه است");

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  });

  return user;
}

export async function registerCustomer(input: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) throw new Error("این ایمیل قبلاً ثبت شده است");

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: UserRole.CUSTOMER,
      customerProfile: {
        create: {
          clinicName: input.clinicName,
          clinicAddress: input.clinicAddress,
          nationalCodeOrCompanyId: input.nationalCodeOrCompanyId,
        },
      },
    },
    include: { customerProfile: true },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  });

  return user;
}

export async function getCurrentUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { customerProfile: true, technicianProfile: true },
  });
}
