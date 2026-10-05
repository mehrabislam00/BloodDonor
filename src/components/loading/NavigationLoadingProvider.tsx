"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import PageLoader from "./PageLoader";

interface NavigationLoadingContextType {
  isNavigating: boolean;
  startNavigation: (msg?: string) => void;
  stopNavigation: () => void;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType>({
  isNavigating:    false,
  startNavigation: () => {},
  stopNavigation:  () => {},
});

export const useNavigationLoading = () => useContext(NavigationLoadingContext);

export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname                      = usePathname();
  const [isNavigating,  setNavigating] = useState(false);
  const [loadingMessage, setMessage]   = useState("Loading page");
  const timerRef                       = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── helpers ───────────────────────────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setNavigating(false);
  }, [clearTimer]);

  // public API
  const startNavigation = useCallback((msg = "Loading page") => {
    setMessage(msg);
    setNavigating(true);
  }, []);

  const stopNavigation = stop;

  // ── Dismiss when pathname changes (cross-page navigation) ─────────────────
  // usePathname() does NOT suspend — safe to use without Suspense.
  useEffect(() => {
    stop();
  }, [pathname, stop]);

  // ── Main effect: click interception + pushState hook ─────────────────────
  useEffect(() => {
    // ── intercept history.pushState ───────────────────────────────────────
    // Next.js calls pushState once the RSC payload is received and the new
    // URL is ready to display — for BOTH pathname changes AND search-param-
    // only changes (e.g. /find-a-donor?bloodGroup=A → ?bloodGroup=B).
    // Hooking here gives us an accurate "navigation complete" signal without
    // needing useSearchParams() (which suspends its subtree and causes the
    // children-unmount/remount problem).
    const origPush    = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);

    history.pushState = (...args) => {
      origPush(...args);
      stop();
    };
    history.replaceState = (...args) => {
      origReplace(...args);
      stop();
    };

    // ── link click interception ───────────────────────────────────────────
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip non-navigating links
      if (
        href.startsWith("http://")  ||
        href.startsWith("https://") ||
        href.startsWith("mailto:")  ||
        href.startsWith("tel:")     ||
        href.startsWith("#")        ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.hasAttribute("download")
      ) return;

      // Skip modified clicks (open in new tab etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      try {
        const target  = new URL(href, window.location.origin);
        const current = new URL(window.location.href);

        // Already on this exact page — no navigation needed
        if (
          target.pathname === current.pathname &&
          target.search   === current.search
        ) return;

        // Wait 150 ms before showing the loader so that cached/instant
        // transitions (< 150 ms) never flash a loader at all.
        clearTimer();
        timerRef.current = setTimeout(() => setNavigating(true), 150);
      } catch {
        // Malformed href — ignore
      }
    };

    // ── back / forward navigation ─────────────────────────────────────────
    const handlePopState = () => {
      // popstate fires when the URL has already changed (instant from cache,
      // or slow from the server). Show a loader only if it takes time.
      clearTimer();
      timerRef.current = setTimeout(() => setNavigating(true), 150);
    };

    document.addEventListener("click",    handleClick,    true);
    window.addEventListener("popstate",   handlePopState);

    return () => {
      clearTimer();
      history.pushState    = origPush;
      history.replaceState = origReplace;
      document.removeEventListener("click",  handleClick,    true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [clearTimer, stop]);

  return (
    <NavigationLoadingContext.Provider
      value={{ isNavigating, startNavigation, stopNavigation }}
    >
      {/* children are NEVER unmounted by this component */}
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