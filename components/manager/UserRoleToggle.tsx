"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function UserRoleToggle({
  userId,
  isActive,
  role,
}: {
  userId: string;
  isActive: boolean;
  role: string;
}) {
  const { toast } = useToast();
  const router = useRouter();

  async function toggleActive() {
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, isActive: !isActive }),
    });
    const json = await res.json();
    if (json.success) {
      toast(isActive ? "کاربر غیرفعال شد" : "کاربر فعال شد", "success");
      router.refresh();
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={toggleActive}>
      {isActive ? "غیرفعال" : "فعال"}
    </Button>
  );
}
