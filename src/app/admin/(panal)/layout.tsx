import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s | BloodDonor Admin",
  },
};

export default function PanalLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}