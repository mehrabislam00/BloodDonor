import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAdminSession } from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/admin-dashboard";
import BrandLogo from "@/components/layout/BrandLogo";
import AdminManagementControls from "@/components/admin/AdminManagementControls";
import AdminReportDeleteButton from "@/components/admin/AdminReportDeleteButton";
import AdminLoginSuccessToast from "@/components/admin/AdminLoginSuccessToast";
import { AdminLayout } from "@/components/admin/AdminLayout";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession(new Request("http://admin.internal", {
    headers: await headers(),
  }));

  if (!session) redirect("/admin/login");

  const { users, reports, stats } = await getAdminDashboardData();

  return (
    <AdminLayout>
      <AdminLoginSuccessToast />
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div>
          <BrandLogo size="small" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#E2484D]">
            Administration
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden text-[#68625E] sm:inline">{session.user.email}</span>
          <Link href="/" className="font-semibold text-[#E2484D] hover:text-[#C73E43]">
            Return to website
          </Link>
        </div>
      </header>

      <section className="mx-auto mt-8 max-w-7xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1B1615]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#68625E]">
          Review registered accounts, donor profiles, availability, and reports.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total users" value={stats.totalUsers} />
          <StatCard label="Donor profiles" value={stats.totalDonors} />
          <StatCard label="Available donors" value={stats.availableDonors} />
          <StatCard label="Reports" value={stats.totalReports} />
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#EDE7E2] bg-white shadow-sm">
          <div className="border-b border-[#EDE7E2] px-5 py-4">
            <h2 className="font-bold text-[#1B1615]">Users and donor details</h2>
            <p className="mt-1 text-xs text-[#9E8E85]">Showing the latest 100 accounts.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-[#FAF7F4] text-xs uppercase tracking-wide text-[#9E8E85]">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Blood / area</th>
                  <th className="px-5 py-3">Donor status</th>
                  <th className="px-5 py-3">Availability</th>
                  <th className="px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE7]">
                {users.map((user, index) => (
                  <tr key={user.id || user.email || `user-${index}`} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#1B1615]">{user.name}</p>
                      <p className="mt-1 text-xs text-[#68625E]">{user.email}</p>
                      {user.role === "admin" && (
                        <span className="mt-2 inline-flex rounded-full bg-[#FFE4E4] px-2 py-0.5 text-[10px] font-bold uppercase text-[#B92F35]">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[#68625E]">
                      <p>{user.phone || "No phone"}</p>
                      <p className="mt-1 text-xs">{user.area || "No area"}</p>
                    </td>
                    <td className="px-5 py-4 text-[#68625E]">
                      <p className="font-semibold text-[#1B1615]">{user.bloodGroup || "—"}</p>
                      <p className="mt-1 text-xs">{user.address || "No address"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.isDonor ? "bg-[#EAF8EF] text-[#166534]" : "bg-[#F4F1EF] text-[#68625E]"
                      }`}>
                        {user.isDonor ? "Donor" : "Regular user"}
                      </span>
                      <p className="mt-2 text-xs text-[#9E8E85]">
                        Last donation: {user.lastDonationDate || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-[#68625E]">
                      {user.availability}
                      {user.availableFrom && <p className="mt-1 text-xs">From {user.availableFrom}</p>}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#68625E]">
                      <p>{formatDate(user.createdAt)}</p>
                      <AdminManagementControls
                        userId={user.id}
                        isDonor={user.isDonor}
                        isBanned={user.isBanned}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#EDE7E2] bg-white shadow-sm">
          <div className="border-b border-[#EDE7E2] px-5 py-4">
            <h2 className="font-bold text-[#1B1615]">Donor reports</h2>
          </div>
          {reports.length === 0 ? (
            <p className="px-5 py-8 text-sm text-[#68625E]">No donor reports have been submitted.</p>
          ) : (
            <div className="divide-y divide-[#F0EBE7]">
              {reports.map((report, index) => (
                <div key={`${report.id}-${index}`} className="px-5 py-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-semibold text-[#1B1615]">{report.reason}</p>
                    <p className="text-xs text-[#9E8E85]">{formatDate(report.createdAt)}</p>
                  </div>
                  <p className="mt-1 text-xs text-[#68625E]">
                    Reporter: {report.reporterEmail} · Donor: {report.donorEmail}
                  </p>
                  {report.description && <p className="mt-2 text-sm text-[#403A37]">{report.description}</p>}
                  {report.id && <AdminReportDeleteButton reportId={report.id} />}
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </AdminLayout>
  );
}


function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#EDE7E2] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#9E8E85]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-[#1B1615]">{value}</p>
    </div>
  );
}
