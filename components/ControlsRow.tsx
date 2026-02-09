"use client";

import { useMemo, useState } from "react";

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
  const activeFilterChips = useMemo(() => {
    const chips: string[] = [];
    if (filters.proteinMin) {
      chips.push(`Protein ${filters.proteinMin}g+`);
    }
    if (filters.caloriesMax) {
      chips.push(`Under ${filters.caloriesMax} cal`);
    }
    return chips;
  }, [filters]);

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

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
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
        {options.map((option) => {
          const isActive = view === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              style={{
                padding: "6px 16px",
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
    <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 600,
          color: "rgba(0,0,0,0.8)",
        }}
      >
        Sort: {activeSortLabel}
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.2)",
            background: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={openFilters}
        style={{
          padding: "6px 16px",
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.2)",
          background: "white",
          color: "rgba(0,0,0,0.8)",
          fontWeight: 600,
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
      {activeFilterChips.length ? (
        <div style={{ width: "100%" }}>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {activeFilterChips.map((chip) => (
              <span
                key={chip}
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.2)",
                  background: "rgba(0,0,0,0.05)",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {chip}
              </span>
            ))}
            <button
              type="button"
              onClick={resetFilters}
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
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
