"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useEffect, useRef, useState } from "react";
import { useCart } from "@/stores/cartStore";
import { useRestaurantUi } from "@/components/RestaurantUiContext";
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
  searchOpen: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  entireMenu?: boolean;
  onEntireMenuChange?: (checked: boolean) => void;
  calorieBounds: {
    min: number;
    max: number;
  };
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
  searchOpen,
  searchQuery,
  setSearchQuery,
  onOpenSearch,
  onCloseSearch,
  entireMenu,
  onEntireMenuChange,
  calorieBounds,
}: StickyRestaurantBarProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === "undefined") return false;
    return !document.getElementById("controls-row");
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { openCart } = useRestaurantUi();
  const isSearchMode = searchOpen || searchQuery.trim().length > 0;

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

  useEffect(() => {
    if (searchOpen && isVisible) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen, isVisible]);

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

  const closeSearch = () => {
    onCloseSearch();
  };

  const resetFilters = () => {
    onFiltersChange({});
  };

  const { items } = useCart();
  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

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

          <div className="ml-auto flex items-center gap-2">
            <div className={`overflow-hidden transition-all duration-300 ${isSearchMode ? "w-[16rem] opacity-100" : "w-0 opacity-0"}`}>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search menu items"
                  aria-label="Search menu items"
                  className="h-9 w-full rounded-full border border-slate-300/80 bg-white px-3 pr-9 text-sm text-slate-900 outline-none"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={onCloseSearch}
                    className="absolute inset-y-0 right-2 my-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            </div>

            {isSearchMode ? (
              <button
                type="button"
                onClick={closeSearch}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300/80 bg-white text-base text-slate-800"
                aria-label="Close search"
              >
                ✕
              </button>
            ) : (
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300/80 bg-white text-base text-slate-800 transition hover:bg-slate-50"
                  aria-label="Search menu items"
                >
                🔍
              </button>
            )}

            <button
              type="button"
              onClick={openCart}
              className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border border-slate-300/80 bg-white px-2.5 text-base text-slate-800 transition hover:bg-slate-50"
              aria-label={cartCount > 0 ? `Cart (${cartCount})` : "Cart"}
            >
              {cartCount > 0 ? `🛒 ${cartCount}` : "🛒"}
            </button>
          </div>
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
              onSearchChange={setSearchQuery}
              onBrandClick={handleBrandClick}
              showChips={false}
              entireMenu={entireMenu}
              onEntireMenuChange={onEntireMenuChange}
              calorieBounds={calorieBounds}
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
