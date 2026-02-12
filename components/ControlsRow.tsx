"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ViewOption = "menu" | "top";
export type SortOption = "highest-protein" | "best-ratio" | "lowest-calories";
export type Filters = {
  proteinMin?: number;
  caloriesMax?: number;
  includeSidesDrinks?: boolean;
  includeLargeShareables?: boolean;
};

const PROTEIN_OPTIONS = [20, 30, 40];
const CALORIE_OPTIONS = [500, 700, 900];

const VIEW_OPTIONS: Array<{ label: string; value: ViewOption }> = [
  { label: "Menu View", value: "menu" },
  { label: "Macro Ranking", value: "top" },
];

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: "High Protein", value: "highest-protein" },
  { label: "Best Ratio", value: "best-ratio" },
  { label: "Lowest Cal", value: "lowest-calories" },
];

type NavOption = {
  id: string;
  label: string;
  onSelect: () => void;
};

export function FilterChips({
  filters,
  onClearProtein,
  onClearCalories,
  onClearAll,
  withMargin = true,
}: {
  filters: Filters;
  onClearProtein: () => void;
  onClearCalories: () => void;
  onClearAll: () => void;
  withMargin?: boolean;
}) {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          marginTop: withMargin ? 10 : 0,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {filters.proteinMin ? (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.2)",
                background: "rgba(0,0,0,0.05)",
                fontWeight: 600,
                fontSize: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Protein {filters.proteinMin}g+
              <button
                type="button"
                onClick={onClearProtein}
                aria-label="Clear protein filter"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                ✕
              </button>
            </span>
          ) : null}
          {filters.caloriesMax ? (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.2)",
                background: "rgba(0,0,0,0.05)",
                fontWeight: 600,
                fontSize: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Under {filters.caloriesMax} cal
              <button
                type="button"
                onClick={onClearCalories}
                aria-label="Clear calories filter"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                ✕
              </button>
            </span>
          ) : null}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClearAll}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.2)",
              background: "white",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ControlsRow({
  view,
  onChange,
  sort,
  onSortChange,
  filters,
  onFiltersChange,
  restaurantName,
  restaurantLogo,
  categoryOptions = [],
  activeCategory,
  onCategorySelect,
  showChips = true,
  wrapperId,
  searchQuery,
  onSearchChange,
}: {
  view: ViewOption;
  onChange: (view: ViewOption) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  restaurantName: string;
  restaurantLogo: string;
  categoryOptions?: Array<{ id: string; label: string }>;
  activeCategory?: string;
  onCategorySelect?: (id: string) => void;
  showChips?: boolean;
  wrapperId?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Filters>(filters);
  const hasActiveFilters = Boolean(filters.proteinMin || filters.caloriesMax);
  const navScrollRef = useRef<HTMLDivElement>(null);

  const navOptions = useMemo<NavOption[]>(() => {
    if (view === "menu") {
      return categoryOptions.map((category) => ({
        id: category.id,
        label: category.label,
        onSelect: () => onCategorySelect?.(category.id),
      }));
    }

    return SORT_OPTIONS.map((option) => ({
      id: option.value,
      label: option.label,
      onSelect: () => onSortChange(option.value),
    }));
  }, [view, categoryOptions, onCategorySelect, onSortChange]);

  const activeNavId = view === "menu" ? activeCategory : sort;

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

  const scrollNav = (direction: "left" | "right") => {
    const nav = navScrollRef.current;
    if (!nav) return;
    nav.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  const filtersDialog = isFiltersOpen ? (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        padding: 16,
        zIndex: 50,
      }}
      onClick={() => setIsFiltersOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "white",
          borderRadius: 20,
          padding: 20,
          boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
          Filters
        </h3>
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Protein minimum</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.2)",
                      background: isActive ? "rgba(0,0,0,0.85)" : "white",
                      color: isActive ? "white" : "rgba(0,0,0,0.8)",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {value}g+
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Calories max</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.2)",
                      background: isActive ? "rgba(0,0,0,0.85)" : "white",
                      color: isActive ? "white" : "rgba(0,0,0,0.8)",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Under {value}
                  </button>
                );
              })}
            </div>
          </div>

          {view === "top" ? (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Include in rankings</div>
              <div style={{ display: "grid", gap: 8 }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={Boolean(draftFilters.includeSidesDrinks)}
                    onChange={(event) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        includeSidesDrinks: event.target.checked,
                      }))
                    }
                  />
                  Sides & drinks
                </label>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={Boolean(draftFilters.includeLargeShareables)}
                    onChange={(event) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        includeLargeShareables: event.target.checked,
                      }))
                    }
                  />
                  Large sizes / shareables
                </label>
              </div>
            </div>
          ) : null}
        </div>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={resetFilters}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.2)",
              background: "white",
              color: "rgba(0,0,0,0.8)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={applyFilters}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.8)",
              background: "rgba(0,0,0,0.85)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div id={wrapperId} style={{ display: "grid", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
              aria-label="Back to home"
            >
              ←
            </Link>
            <div
              style={{
                position: "relative",
                width: 32,
                height: 32,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.15)",
                background: "white",
                flexShrink: 0,
              }}
            >
              <Image src={restaurantLogo} alt={`${restaurantName} logo`} fill className="object-contain" />
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {restaurantName}
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flex: 1,
              minWidth: 220,
              maxWidth: 380,
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.25)",
              background: "white",
            }}
          >
            <span className="pointer-events-none flex items-center text-neutral-400">
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search menu items..."
              aria-label="Search menu items"
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: 14,
                background: "transparent",
              }}
            />
          </label>

          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 6,
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(0,0,0,0.03)",
              width: "fit-content",
            }}
          >
            {VIEW_OPTIONS.map((option) => {
              const isActive = view === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(0,0,0,0.2)",
                    background: isActive ? "rgba(0,0,0,0.85)" : "white",
                    color: isActive ? "white" : "rgba(0,0,0,0.8)",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 160ms ease",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            paddingTop: 10,
          }}
        >
          <button
            type="button"
            onClick={() => scrollNav("left")}
            aria-label="Scroll tabs left"
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.2)",
              background: "white",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ‹
          </button>

          <div
            ref={navScrollRef}
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              flex: 1,
              minWidth: 0,
            }}
          >
            {navOptions.map((option) => {
              const isActive = option.id === activeNavId;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={option.onSelect}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: "1px solid rgba(0,0,0,0.2)",
                    background: isActive ? "rgba(0,0,0,0.85)" : "white",
                    color: isActive ? "white" : "rgba(0,0,0,0.8)",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollNav("right")}
            aria-label="Scroll tabs right"
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.2)",
              background: "white",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ›
          </button>

          <button
            type="button"
            onClick={openFilters}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.2)",
              background: "white",
              color: "rgba(0,0,0,0.8)",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Filters ⚙️
          </button>
        </div>

        {hasActiveFilters && showChips ? (
          <FilterChips
            filters={filters}
            onClearProtein={clearProteinFilter}
            onClearCalories={clearCaloriesFilter}
            onClearAll={resetFilters}
          />
        ) : null}
      </div>

      {filtersDialog
        ? typeof document === "undefined"
          ? filtersDialog
          : createPortal(filtersDialog, document.body)
        : null}
    </>
  );
}
