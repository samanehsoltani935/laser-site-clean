import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { USER_ROLE_LABELS } from "@/lib/constants/labels";
import { UserRoleToggle } from "@/components/manager/UserRoleToggle";

export default async function ManagerUsersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const users = await prisma.user.findMany({
    include: { customerProfile: true, technicianProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">مدیریت کاربران</h1>
        <p className="text-sm text-gray-500 mt-1">فعال/غیرفعال کردن و تغییر نقش کاربران</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-right px-4 py-3 font-medium">نام</th>
              <th className="text-right px-4 py-3 font-medium">ایمیل</th>
              <th className="text-right px-4 py-3 font-medium">نقش</th>
              <th className="text-right px-4 py-3 font-medium">وضعیت</th>
              <th className="text-right px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-50">
                <td className="px-4 py-3 font-medium">{u.fullName}</td>
                <td className="px-4 py-3 text-gray-600" dir="ltr">
                  {u.email}
                </td>
                <td className="px-4 py-3">{USER_ROLE_LABELS[u.role]}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${u.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {u.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <UserRoleToggle userId={u.id} isActive={u.isActive} role={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
