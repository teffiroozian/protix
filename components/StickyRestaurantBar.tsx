"use client";

import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FilterChips,
  type Filters,
  type SortOption,
  type ViewOption,
} from "./ControlsRow";
import { getMenuSections } from "./MenuSections";

type StickyRestaurantBarProps = {
  restaurantName: string;
  restaurantLogo: string;
  menuItems: Array<{ category: string }>;
  view: ViewOption;
  onChange: (view: ViewOption) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

const RANKING_TABS: Array<{ id: string; label: string; sort: SortOption; href: string }> = [
  {
    id: "high-protein",
    label: "High Protein",
    sort: "highest-protein",
    href: "#high-protein",
  },
  {
    id: "best-ratio",
    label: "Best Ratio",
    sort: "best-ratio",
    href: "#best-protein-ratio",
  },
  {
    id: "lowest-calorie",
    label: "Lowest Cal",
    sort: "lowest-calories",
    href: "#lowest-calorie",
  },
];

const PROTEIN_OPTIONS = [20, 30, 40];
const CALORIE_OPTIONS = [500, 700, 900];


export default function StickyRestaurantBar({
  restaurantName,
  restaurantLogo,
  menuItems,
  view,
  onChange,
  sort,
  onSortChange,
  filters,
  onFiltersChange,
}: StickyRestaurantBarProps) {
  const [activeSection, setActiveSection] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Filters>(filters);
  const scrollRef = useRef<HTMLDivElement>(null);

  const menuTabs = useMemo(
    () => getMenuSections(menuItems as Array<{ category?: string }>),
    [menuItems]
  );

  const currentTabs = view === "menu" ? menuTabs : RANKING_TABS;

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (!currentTabs.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-120px 0px -60% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    const elements = currentTabs
      .map((tab) => document.getElementById(tab.id))
      .filter((node): node is HTMLElement => Boolean(node));

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [currentTabs, view]);

  const hasActiveFilters = Boolean(filters.proteinMin || filters.caloriesMax);

  const clearProteinFilter = () => {
    onFiltersChange({ ...filters, proteinMin: undefined });
  };

  const clearCaloriesFilter = () => {
    onFiltersChange({ ...filters, caloriesMax: undefined });
  };

  const resetFilters = () => {
    setDraftFilters({});
    onFiltersChange({});
  };

  const applyFilters = () => {
    onFiltersChange(draftFilters);
    setIsFiltersOpen(false);
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const distance = 180;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  const openFilters = () => {
    setDraftFilters(filters);
    setIsFiltersOpen(true);
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
        zIndex: 100,
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
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Filters</h3>
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Protein min</div>
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
      <div className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-4 py-2 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
              aria-label="Back to home"
            >
              ←
            </Link>

            <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <Image
                src={restaurantLogo}
                alt={`${restaurantName} logo`}
                fill
                className="object-contain"
              />
            </div>

            <div className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900 sm:text-base">
              {restaurantName}
            </div>

            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
              {[
                { label: "Menu View", value: "menu" as const },
                { label: "Item Ranking", value: "top" as const },
              ].map((option) => {
                const isActive = view === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                      isActive
                        ? "border border-slate-900 bg-slate-900 text-white"
                        : "border border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTabs("left")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700"
              aria-label="Scroll left"
            >
              ‹
            </button>

            <div ref={scrollRef} className="flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              <div className="flex min-w-max items-center gap-2 pr-2">
                {currentTabs.map((tab) => {
                  const rankingTab = RANKING_TABS.find((item) => item.id === tab.id);
                  const isActive =
                    activeSection === tab.id ||
                    (view === "top" && !activeSection && rankingTab?.sort === sort);
                  return (
                    <a
                      key={tab.id}
                      href={tab.href}
                      onClick={() => {
                        if (view === "top" && rankingTab) {
                          onSortChange(rankingTab.sort);
                        }
                        setActiveSection(tab.id);
                      }}
                      className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      {tab.label}
                      {isActive ? " ●" : ""}
                    </a>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollTabs("right")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700"
              aria-label="Scroll right"
            >
              ›
            </button>

            <button
              type="button"
              onClick={openFilters}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 sm:text-sm"
            >
              Filters ⚙️
            </button>
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="border-t border-slate-200/70 px-4 py-2 sm:px-6">
            <div className="mx-auto w-full max-w-5xl">
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

      {filtersDialog
        ? typeof document === "undefined"
          ? filtersDialog
          : createPortal(filtersDialog, document.body)
        : null}
    </>
  );
}
