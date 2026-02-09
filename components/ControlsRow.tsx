"use client";

import { useState } from "react";

type ViewOption = "menu" | "top";
type SortOption = "highest-protein" | "best-ratio" | "lowest-calories";
type Filters = {
  proteinMin?: number;
  caloriesMax?: number;
};

const PROTEIN_OPTIONS = [20, 30, 40];
const CALORIE_OPTIONS = [500, 700, 900];

export default function ControlsRow({
  view,
  onChange,
  sort,
  onSortChange,
  filters,
  onFiltersChange,
}: {
  view: ViewOption;
  onChange: (view: ViewOption) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Filters>(filters);
  const options: Array<{ label: string; value: ViewOption }> = [
    { label: "Menu", value: "menu" },
    { label: "Top Picks", value: "top" },
  ];
  const sortOptions: Array<{ label: string; value: SortOption }> = [
    { label: "Highest Protein", value: "highest-protein" },
    { label: "Best Ratio (protein / calories)", value: "best-ratio" },
    { label: "Lowest Calories", value: "lowest-calories" },
  ];
  const activeSortLabel =
    sortOptions.find((option) => option.value === sort)?.label ??
    "Highest Protein";
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

  const controlStyle = {
    height: 36,
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "white",
    fontWeight: 600,
    fontSize: 14,
  } as const;

  const chipStyle = {
    padding: "3px 8px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.2)",
    background: "rgba(0,0,0,0.05)",
    fontWeight: 600,
    fontSize: 12,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  } as const;

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 4,
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.18)",
          background: "rgba(0,0,0,0.04)",
          width: "fit-content",
          height: 36,
          alignItems: "center",
        }}
      >
        {options.map((option) => {
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
                fontSize: 14,
                cursor: "pointer",
                transition: "all 160ms ease",
                height: 28,
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <select
        value={sort}
        aria-label={`Sort: ${activeSortLabel}`}
        onChange={(event) => onSortChange(event.target.value as SortOption)}
        style={{
          ...controlStyle,
          padding: "0 12px",
          cursor: "pointer",
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={openFilters}
        style={{
          ...controlStyle,
          padding: "0 16px",
          color: "rgba(0,0,0,0.8)",
          cursor: "pointer",
        }}
      >
        Filters
      </button>
      {isFiltersOpen ? (
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
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  Protein minimum
                </div>
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
                          background: isActive
                            ? "rgba(0,0,0,0.85)"
                            : "white",
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
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  Calories max
                </div>
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
                          background: isActive
                            ? "rgba(0,0,0,0.85)"
                            : "white",
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
      ) : null}
      {hasActiveFilters ? (
        <div style={{ width: "100%" }}>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {filters.proteinMin ? (
              <span style={chipStyle}>
                Protein {filters.proteinMin}g+
                <button
                  type="button"
                  onClick={clearProteinFilter}
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
              <span style={chipStyle}>
                Under {filters.caloriesMax} cal
                <button
                  type="button"
                  onClick={clearCaloriesFilter}
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
            <button
              type="button"
              onClick={resetFilters}
              style={{
                padding: "3px 8px",
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.2)",
                background: "white",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
