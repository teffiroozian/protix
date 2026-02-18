"use client";

import { useEffect } from "react";

const RECENT_RESTAURANTS_KEY = "recentlySearchedRestaurants";

export default function RecentRestaurantTracker({
  restaurantId,
}: {
  restaurantId: string;
}) {
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(RECENT_RESTAURANTS_KEY);
      const parsed = stored ? (JSON.parse(stored) as string[]) : [];
      const current = Array.isArray(parsed) ? parsed.filter(Boolean) : [];

      const next = [restaurantId, ...current.filter((id) => id !== restaurantId)].slice(
        0,
        3
      );

      window.localStorage.setItem(RECENT_RESTAURANTS_KEY, JSON.stringify(next));
    } catch {
      // Ignore localStorage parse/write errors.
    }
  }, [restaurantId]);

  return null;
}
