import { getAdminData } from "@/lib/admin/data";

export async function getAdminDashboardData() {
  return getAdminData("dashboard");
}
