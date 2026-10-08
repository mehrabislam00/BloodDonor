"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import PageLoader from "./PageLoader";

interface NavigationLoadingContextType {
  isNavigating: boolean;
  startNavigation: (msg?: string) => void;
  stopNavigation: () => void;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType>({
  isNavigating: false,
  startNavigation: () => {},
  stopNavigation: () => {},
});

export const useNavigationLoading = () => useContext(NavigationLoadingContext);

export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [isNavigating, setNavigating] = useState(false);
  const [loadingMessage, setMessage] = useState("Loading page");

  const stopNavigation = useCallback(() => {
    setNavigating(false);
  }, []);

  const startNavigation = useCallback((message = "Loading page") => {
    setMessage(message);
    setNavigating(true);
  }, []);

  useEffect(() => {
    const pathnameChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;
    if (!pathnameChanged || !isNavigating) return;
    const frame = window.requestAnimationFrame(stopNavigation);
    return () => window.cancelAnimationFrame(frame);
  }, [isNavigating, pathname, stopNavigation]);

  return (
    <NavigationLoadingContext.Provider
      value={{ isNavigating, startNavigation, stopNavigation }}
    >
      {children}
      {isNavigating && (
        <PageLoader
          fullPage
          message={loadingMessage}
          subMessage="Connecting to Dhaka's donor network"
        />
      )}
    </NavigationLoadingContext.Provider>
  );
}
