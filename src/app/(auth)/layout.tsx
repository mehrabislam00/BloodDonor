import type { ReactNode } from "react";
import type { Metadata } from "next";
import PublicAppFrame from "@/components/layout/PublicAppFrame";

export const metadata: Metadata = {
  title: {
    default: "Account",
    template: "%s | BloodDonor",
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <PublicAppFrame>{children}</PublicAppFrame>;
}
