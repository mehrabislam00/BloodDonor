import { DonorDashboard } from "@/components/dashboard/DonorDashboard";
import type { UserData } from "@/components/dashboard/types";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile";
import { getDonorProfile } from "@/lib/donor";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const [profile, donor] = await Promise.all([
    getUserProfile(session.user.id),
    getDonorProfile(session.user.id),
  ]);

  if (profile.isDonor !== true) redirect("/become-a-donor");

  const user: UserData = {
    fullName: session.user.name || "",
    email: session.user.email || "",
    phone: typeof profile.phone === "string" ? profile.phone : "",
    whatsapp: typeof profile.whatsapp === "string" ? profile.whatsapp : "",
    bloodGroup: typeof profile.bloodGroup === "string" ? profile.bloodGroup : "",
    area: typeof profile.area === "string" ? profile.area : "",
    lastDonationDate: donor?.lastDonationDate || (typeof profile.lastDonationDate === "string" ? profile.lastDonationDate : ""),
    availability: typeof profile.availability === "string" ? profile.availability : "Unavailable",
    contactEnabled: profile.availability !== "Unavailable",
    photoUrl: typeof profile.avatarUrl === "string" ? profile.avatarUrl : null,
  };

  return <DonorDashboard initialUser={user} />;
}