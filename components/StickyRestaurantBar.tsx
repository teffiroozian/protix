"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type StickyRestaurantBarProps = {
  restaurantName: string;
  restaurantLogo: string;
  activeFilters?: string[];
};

export default function StickyRestaurantBar({
  restaurantName,
  restaurantLogo,
  activeFilters = [],
}: StickyRestaurantBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("restaurant-hero");

    if (!hero) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-50 transition duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="w-full border-b border-slate-200/70 bg-white/95 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-3 px-4 py-2 sm:flex-nowrap sm:px-6">
          <Link
            href="/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Back to home"
          >
            ←
          </Link>

          <div className="text-sm font-bold text-slate-900 sm:text-base">
            {restaurantName}
          </div>

          <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600 sm:ml-auto">
            <button
              type="button"
              className="rounded-full bg-white px-3 py-1.5 text-slate-900 shadow-sm"
            >
              Menu
            </button>
            <button
              type="button"
              className="rounded-full px-3 py-1.5 text-slate-500 transition hover:text-slate-900"
            >
              Top Picks
            </button>
          </div>

          <select
            aria-label="Sort menu"
            defaultValue="recommended"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="protein">Sort: Protein</option>
            <option value="calories">Sort: Calories</option>
          </select>

          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
          >
            Filters
          </button>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="w-full border-b border-slate-200/70 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-2 px-4 py-2 text-sm sm:flex-nowrap sm:px-6">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700"
                >
                  {filter}
                  <button
                    type="button"
                    aria-label={`Remove ${filter}`}
                    className="text-slate-500 transition hover:text-slate-900"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              className="ml-auto font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Clear All
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
