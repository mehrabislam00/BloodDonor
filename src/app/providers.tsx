"use client";

import type { ReactNode } from "react";
import { AppToastProvider } from "@/components/toast/ui/AppToast";
import { NavigationLoadingProvider } from "@/components/loading/NavigationLoadingProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <AppToastProvider />
      <NavigationLoadingProvider>
        {children}
      </NavigationLoadingProvider>
    </>
  );
}