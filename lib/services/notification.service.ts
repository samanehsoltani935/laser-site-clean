import { NotificationType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

/** Mock notification channels — replace with SMS/Firebase later */
export interface NotificationChannel {
  sendSms(phone: string, message: string): Promise<void>;
  sendPush(userId: string, title: string, body: string): Promise<void>;
}

class MockNotificationChannel implements NotificationChannel {
  async sendSms(phone: string, message: string) {
    console.log(`[SMS Mock] to ${phone}: ${message}`);
  }

  async sendPush(userId: string, title: string, body: string) {
    console.log(`[Push Mock] to ${userId}: ${title} — ${body}`);
  }
}

const channel = new MockNotificationChannel();

export type CreateNotificationInput = {
  userId: string;
  requestId?: string;
  title: string;
  body: string;
  type?: NotificationType;
  sendSms?: boolean;
  sendPush?: boolean;
};

export async function createNotification(input: CreateNotificationInput) {
  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      requestId: input.requestId,
      title: input.title,
      body: input.body,
      type: input.type ?? NotificationType.SYSTEM,
    },
  });

  const user = await prisma.user.findUnique({ where: { id: input.userId } });

  if (input.sendSms && user?.phone) {
    await channel.sendSms(user.phone, `${input.title}: ${input.body}`);
  }
  if (input.sendPush) {
    await channel.sendPush(input.userId, input.title, input.body);
  }

  return notification;
}

export async function notifyManagers(
  title: string,
  body: string,
  requestId?: string
) {
  const managers = await prisma.user.findMany({
    where: { role: { in: ["MANAGER", "SUPPORT"] }, isActive: true },
  });

  await Promise.all(
    managers.map((m) =>
      createNotification({
        userId: m.id,
        requestId,
        title,
        body,
        type: NotificationType.STATUS_CHANGE,
        sendPush: true,
      })
    )
  );
}

export { channel as notificationChannel };
