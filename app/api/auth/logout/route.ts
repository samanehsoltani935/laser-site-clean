import { clearAuthCookie } from "@/lib/auth/session";
import { apiSuccess } from "@/lib/api/helpers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  await clearAuthCookie();
  return apiSuccess({ message: "خروج موفق" });
}
