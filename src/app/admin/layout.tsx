import type { Metadata } from "next";
export const metadata: Metadata = {
  title: { default: "Admin Dashboard", template: "%s | BloodDonor Admin" },
};
export default function AdminRouteLayout({ children }: { children: React.ReactNode }) { return children; }
