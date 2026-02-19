"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { useCart } from "@/stores/cartStore";
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
  entireMenu?: boolean;
  onEntireMenuChange?: (checked: boolean) => void;
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
  entireMenu,
  onEntireMenuChange,
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

  const handleBrandClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearProteinFilter = () => {
    onFiltersChange({ ...filters, proteinMin: undefined });
  };

  const clearCaloriesFilter = () => {
    onFiltersChange({ ...filters, caloriesMax: undefined });
  };

  const resetFilters = () => {
    onFiltersChange({});
  };

  const { items } = useCart();
  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const handleSearchClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-50 shadow-[0_14px_35px_rgba(15,23,42,0.25)] transition duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2 sm:px-6">
          <Link
            href="/"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300/80 bg-white text-base font-semibold text-slate-700 transition hover:text-slate-900"
            aria-label="Back to home"
          >
            ←
          </Link>

          <button
            type="button"
            onClick={handleBrandClick}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-300/80 bg-white"
            aria-label={`Scroll to top of ${restaurantName} page`}
          >
            <span className="relative h-7 w-7">
              <Image src={restaurantLogo} alt={`${restaurantName} logo`} fill className="object-contain" />
            </span>
          </button>

          <button
            type="button"
            onClick={handleBrandClick}
            className="min-w-0 flex-1 truncate text-left text-base font-semibold text-slate-900"
            aria-label={`Scroll to top of ${restaurantName} page`}
          >
            {restaurantName}
          </button>

          <button
            type="button"
            onClick={handleSearchClick}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300/80 bg-white text-base text-slate-800 transition hover:bg-slate-50"
            aria-label="Go to search"
          >
            🔍
          </button>

          <Link
            href="/cart"
            className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border border-slate-300/80 bg-white px-2.5 text-base text-slate-800 transition hover:bg-slate-50"
            aria-label={cartCount > 0 ? `Cart (${cartCount})` : "Cart"}
          >
            {cartCount > 0 ? `🛒 ${cartCount}` : "🛒"}
          </Link>
        </div>
      </div>

      <div className="w-full border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2 sm:px-6">
          <div className="min-w-0 flex-1">
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
              onBrandClick={handleBrandClick}
              showChips={false}
              entireMenu={entireMenu}
              onEntireMenuChange={onEntireMenuChange}
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
