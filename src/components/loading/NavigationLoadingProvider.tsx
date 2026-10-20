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
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === pathname) return;

      startNavigation("Loading page");
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [pathname, startNavigation]);

  useEffect(() => {
    if (!isNavigating) return;
    const timeout = window.setTimeout(stopNavigation, 10000);
    return () => window.clearTimeout(timeout);
  }, [isNavigating, stopNavigation]);

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
          subMessage="Please wait a moment"
        />
      )}
    </NavigationLoadingContext.Provider>
  );
}
