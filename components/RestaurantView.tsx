"use client";

import { useMemo, useState } from "react";
import { useRestaurantSearch } from "@/components/RestaurantSearchContext";
import type { CommonChange, MenuItem, RestaurantAddons } from "@/types/menu";
import ControlsRow, {
  type Filters,
  type SortOption,
  type ViewOption,
} from "./ControlsRow";
import {
  categorySectionId,
  getCategoryLabel,
  getOrderedMenuSections,
} from "./MenuSections";
import MenuSections from "./MenuSections";
import StickyRestaurantBar from "./StickyRestaurantBar";

export default function RestaurantView({
  restaurantId,
  restaurantName,
  restaurantLogo,
  items,
  addons,
  commonChanges,
}: {
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  items: MenuItem[];
  addons?: RestaurantAddons;
  commonChanges?: CommonChange[];
  autoScrollOnViewChange?: boolean;
}) {
  const view: ViewOption = "menu";
  const [entireMenu, setEntireMenu] = useState(false);
  const [sort, setSort] = useState<SortOption>("highest-protein");
  const [filters, setFilters] = useState<Filters>({});
  const { searchQuery, setSearchQuery } = useRestaurantSearch();

  const searchTerms = searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const calorieRange = useMemo(() => {
    const calories = items
      .map((item) => item.nutrition?.calories)
      .filter((value): value is number => Number.isFinite(value));

    if (!calories.length) {
      return { min: 0, max: 700 };
    }

    const min = Math.min(...calories);
    const max = Math.max(...calories);
    return { min, max };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.proteinMin && (item.nutrition?.protein ?? 0) < filters.proteinMin) {
        return false;
      }
      if (filters.caloriesMax && (item.nutrition?.calories ?? Number.POSITIVE_INFINITY) > filters.caloriesMax) {
        return false;
      }
      if (!searchTerms.length) {
        return true;
      }

      const category = (item.category || "Other").toLowerCase();
      const categoryLabel = getCategoryLabel(item.category || "Other").toLowerCase();

      const categoryVariants = [category, categoryLabel].flatMap((value) => {
        const trimmed = value.trim();
        if (!trimmed) return [];
        if (trimmed.endsWith("s")) {
          return [trimmed, trimmed.slice(0, -1)];
        }
        return [trimmed, `${trimmed}s`];
      });

      const searchableText = [item.name.toLowerCase(), ...categoryVariants].join(" ");
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [items, filters, searchTerms]);

  const orderedSections = useMemo(
    () => getOrderedMenuSections(filteredItems),
    [filteredItems]
  );
  const [activeCategory, setActiveCategory] = useState<string>(
    () => orderedSections[0] ?? ""
  );

  const resolvedActiveCategory = orderedSections.includes(activeCategory)
    ? activeCategory
    : (orderedSections[0] ?? "");

  const categoryOptions = useMemo(
    () =>
      orderedSections.map((section) => ({
        id: section,
        label: getCategoryLabel(section),
      })),
    [orderedSections]
  );

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    const section = document.getElementById(categorySectionId(categoryId));
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSortChange = (nextSort: SortOption) => {
    setSort(nextSort);
  };

  const noopChangeView = () => {};

  return (
    <div>
      <StickyRestaurantBar
        restaurantName={restaurantName}
        restaurantLogo={restaurantLogo}
        view={view}
        onChange={noopChangeView}
        sort={sort}
        onSortChange={handleSortChange}
        filters={filters}
        onFiltersChange={setFilters}
        categoryOptions={categoryOptions}
        activeCategory={resolvedActiveCategory}
        onCategorySelect={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        entireMenu={entireMenu}
        onEntireMenuChange={setEntireMenu}
        calorieRange={calorieRange}
      />

      <ControlsRow
        view={view}
        onChange={noopChangeView}
        sort={sort}
        onSortChange={handleSortChange}
        filters={filters}
        onFiltersChange={setFilters}
        restaurantName={restaurantName}
        restaurantLogo={restaurantLogo}
        categoryOptions={categoryOptions}
        activeCategory={resolvedActiveCategory}
        onCategorySelect={handleCategorySelect}
        wrapperId="controls-row"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showBranding={false}
        showChips={false}
        entireMenu={entireMenu}
        onEntireMenuChange={setEntireMenu}
        calorieRange={calorieRange}
      />

      {filteredItems.length === 0 && (filters.proteinMin || filters.caloriesMax) ? (
        <div style={{ marginTop: 32, padding: "20px 16px", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 16, color: "rgba(0,0,0,0.72)", background: "white" }}>
          No items match these filters. Try lowering protein minimum or increasing calories.
        </div>
      ) : (
        <MenuSections
          restaurantId={restaurantId}
          items={filteredItems}
          sort={sort}
          addons={addons}
          commonChanges={commonChanges}
          groupByCategory={!entireMenu}
        />
      )}
    </div>
  );
}
