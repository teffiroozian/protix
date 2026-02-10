"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  Filters,
  SortOption,
  ViewOption,
} from "@/types/restaurant-controls";

const PROTEIN_OPTIONS = [20, 30, 40];
const CALORIE_OPTIONS = [500, 700, 900];

type StickyRestaurantBarProps = {
  restaurantName: string;
  view: ViewOption;
  onViewChange: (view: ViewOption) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: "Highest Protein", value: "highest-protein" },
  { label: "Best Ratio", value: "best-ratio" },
  { label: "Lowest Calories", value: "lowest-calories" },
];

export default function StickyRestaurantBar({
  restaurantName,
  view,
  onViewChange,
  sort,
  onSortChange,
  filters,
  onFiltersChange,
}: StickyRestaurantBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Filters>(filters);
  const hasActiveFilters = Boolean(filters.proteinMin || filters.caloriesMax);

  const openFilters = () => {
    setDraftFilters(filters);
    setIsFiltersOpen(true);
  };

  const applyFilters = () => {
    onFiltersChange(draftFilters);
    setIsFiltersOpen(false);
  };

  const resetFilters = () => {
    setDraftFilters({});
    onFiltersChange({});
  };

  const clearProteinFilter = () => {
    onFiltersChange({ ...filters, proteinMin: undefined });
  };

  const clearCaloriesFilter = () => {
    onFiltersChange({ ...filters, caloriesMax: undefined });
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col">
          <div className="flex w-full items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
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

            <div className="ml-2 flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1">
              {(["menu", "top"] as ViewOption[]).map((option) => {
                const isActive = view === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onViewChange(option)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition sm:text-sm ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    {option === "menu" ? "Menu" : "Top Picks"}
                  </button>
                );
              })}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600 sm:text-sm">
                <span className="sr-only">Sort</span>
                <select
                  value={sort}
                  onChange={(event) =>
                    onSortChange(event.target.value as SortOption)
                  }
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-400/60 sm:text-sm"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort: {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={openFilters}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 sm:text-sm"
              >
                <span aria-hidden="true">⚙️</span>
                Filters
              </button>
            </div>
          </div>

          {hasActiveFilters ? (
            <div className="flex w-full items-center gap-3 border-t border-slate-200/70 bg-white/95 px-4 py-2 sm:px-6 lg:px-8">
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {filters.proteinMin ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                    Protein {filters.proteinMin}g+
                    <button
                      type="button"
                      onClick={clearProteinFilter}
                      aria-label="Clear protein filter"
                      className="text-xs font-bold text-slate-600"
                    >
                      ✕
                    </button>
                  </span>
                ) : null}
                {filters.caloriesMax ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                    Under {filters.caloriesMax} cal
                    <button
                      type="button"
                      onClick={clearCaloriesFilter}
                      aria-label="Clear calories filter"
                      className="text-xs font-bold text-slate-600"
                    >
                      ✕
                    </button>
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-slate-600 transition hover:text-slate-900"
              >
                Clear All
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {isFiltersOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4"
          onClick={() => setIsFiltersOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900">Filters</h3>
            <div className="mt-4 grid gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-700">
                  Protein minimum
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PROTEIN_OPTIONS.map((value) => {
                    const isActive = draftFilters.proteinMin === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setDraftFilters((prev) => ({
                            ...prev,
                            proteinMin: value,
                          }))
                        }
                        className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {value}g+
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-700">
                  Calories max
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CALORIE_OPTIONS.map((value) => {
                    const isActive = draftFilters.caloriesMax === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setDraftFilters((prev) => ({
                            ...prev,
                            caloriesMax: value,
                          }))
                        }
                        className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        Under {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={applyFilters}
                className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
