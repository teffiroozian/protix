"use client";

import { useEffect, useState } from "react";
import ControlsRow, {
  FilterChips,
  type Filters,
  type SortOption,
  type ViewOption,
} from "./ControlsRow";

type StickyRestaurantBarProps = {
  restaurantName: string;
  restaurantLogo: string;
  view: ViewOption;
  onChange: (view: ViewOption) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  categoryOptions: Array<{ id: string; label: string }>;
  activeCategory?: string;
  onCategorySelect?: (id: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export default function StickyRestaurantBar({
  restaurantName,
  restaurantLogo,
  view,
  onChange,
  sort,
  onSortChange,
  filters,
  onFiltersChange,
  categoryOptions,
  activeCategory,
  onCategorySelect,
  searchQuery,
  onSearchChange,
}: StickyRestaurantBarProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === "undefined") return false;
    return !document.getElementById("controls-row");
  });

  useEffect(() => {
    const controlsRow = document.getElementById("controls-row");

    if (!controlsRow) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(controlsRow);

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
      <div className="w-full border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-4 py-2 sm:px-6">
          <ControlsRow
            view={view}
            onChange={onChange}
            sort={sort}
            onSortChange={onSortChange}
            filters={filters}
            onFiltersChange={onFiltersChange}
            restaurantName={restaurantName}
            restaurantLogo={restaurantLogo}
            categoryOptions={categoryOptions}
            activeCategory={activeCategory}
            onCategorySelect={onCategorySelect}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            showChips={false}
          />
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
