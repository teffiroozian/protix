"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ControlsRow, {
  FilterChips,
  type Filters,
  type SortOption,
  type ViewOption,
} from "./ControlsRow";

type StickyRestaurantBarProps = {
  restaurantName: string;
  view: ViewOption;
  onChange: (view: ViewOption) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

export default function StickyRestaurantBar({
  restaurantName,
  view,
  onChange,
  sort,
  onSortChange,
  filters,
  onFiltersChange,
}: StickyRestaurantBarProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === "undefined") return false;
    return !document.getElementById("restaurant-hero");
  });

  useEffect(() => {
    const hero = document.getElementById("restaurant-hero");

    if (!hero) {
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
  const hasActiveFilters = Boolean(filters.proteinMin || filters.caloriesMax);

  const clearProteinFilter = () => {
    onFiltersChange({ ...filters, proteinMin: undefined });
  };

  const clearCaloriesFilter = () => {
    onFiltersChange({ ...filters, caloriesMax: undefined });
  };

  const resetFilters = () => {
    onFiltersChange({});
  };

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

          <div className="min-w-[280px] flex-1">
            <ControlsRow
              view={view}
              onChange={onChange}
              sort={sort}
              onSortChange={onSortChange}
              filters={filters}
              onFiltersChange={onFiltersChange}
              showChips={false}
            />
          </div>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="w-full border-b border-slate-200/70 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-2 px-4 py-2 text-sm sm:flex-nowrap sm:px-6">
            <FilterChips
              filters={filters}
              onClearProtein={clearProteinFilter}
              onClearCalories={clearCaloriesFilter}
              onClearAll={resetFilters}
              withMargin={false}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
