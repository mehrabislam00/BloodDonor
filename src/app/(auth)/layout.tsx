import type { ReactNode } from "react";
import PublicAppFrame from "@/components/layout/PublicAppFrame";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <PublicAppFrame>{children}</PublicAppFrame>;
}
