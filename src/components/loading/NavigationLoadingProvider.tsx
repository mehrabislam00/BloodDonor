"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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

function NavigationLoadingConsumer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading page");
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // When pathname or searchParams change, the destination page is mounted and ready!
  useEffect(() => {
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
    setIsNavigating(false);
  }, [pathname, searchParams]);

  const startNavigation = (msg = "Loading page") => {
    setLoadingMessage(msg);
    setIsNavigating(true);
  };

  const stopNavigation = () => {
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
    setIsNavigating(false);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, mailto, tel, downloads, or anchor hash jumps
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        target.getAttribute("target") === "_blank" ||
        target.hasAttribute("download")
      ) {
        return;
      }

      // Ignore modified clicks (cmd, ctrl, shift, alt)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      // Check whether target is the current page
      try {
        const targetUrl = new URL(href, window.location.origin);
        const currentUrl = new URL(window.location.href);

        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search
        ) {
          // Already on this page
          return;
        }

        // Delay showing the loader by a slight threshold (80ms) so instantaneous
        // client cache hits render directly without flashing a loader.
        // If navigation takes longer (fetching server data/RSC), show full-page loader.
        if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = setTimeout(() => {
          setIsNavigating(true);
        }, 80);
      } catch {
        // invalid URL format, ignore
      }
    };

    const handlePopState = () => {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = setTimeout(() => {
        setIsNavigating(true);
      }, 80);
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <NavigationLoadingContext.Provider value={{ isNavigating, startNavigation, stopNavigation }}>
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

export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={null}>
      <NavigationLoadingConsumer>{children}</NavigationLoadingConsumer>
    </React.Suspense>
  );
}

