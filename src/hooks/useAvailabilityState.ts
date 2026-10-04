"use client";

import { useEffect, useState } from "react";
import { getAvailabilityState } from "@/lib/availability";

export function useAvailabilityState(
  availability: string,
  availableFrom?: string | null,
) {
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: number;
    const refresh = () => {
      const now = Date.now();
      setCurrentTime(now);
      const state = getAvailabilityState(availability, availableFrom, new Date(now));
      if (state.available || !state.availableFrom) return;

      const remaining = Date.parse(`${state.availableFrom}T00:00:00.000Z`) - now;
      if (remaining <= 0) return;
      const today = new Date(now);
      const nextDay = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1);
      timer = window.setTimeout(refresh, Math.min(remaining + 1, nextDay - now));
    };

    timer = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(timer);
  }, [availability, availableFrom]);

  return getAvailabilityState(
    availability,
    availableFrom,
    currentTime === null ? new Date() : new Date(currentTime),
  );
}
