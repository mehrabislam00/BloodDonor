"use client";

import type { ReactNode } from "react";
import { AppToastProvider } from "@/components/toast/ui/AppToast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <AppToastProvider />
      {children}
    </>
  );
}
