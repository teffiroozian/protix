"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const listTopRef = useRef<HTMLDivElement>(null);
  const previousSearchQueryRef = useRef("");

  const calorieBounds = useMemo(() => {
    if (!items.length) {
      return { min: 0, max: 0 };
    }

    const calories = items.map((item) => item.nutrition.calories);
    const minCal = Math.min(...calories);
    const maxCal = Math.max(...calories);

    return {
      min: Math.floor(minCal / 50) * 50,
      max: Math.ceil(maxCal / 50) * 50,
    };
  }, [items]);

  const searchTerms = searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.proteinMin && item.nutrition.protein < filters.proteinMin) {
        return false;
      }
      if (
        filters.caloriesMax &&
        item.nutrition.calories > filters.caloriesMax
      ) {
        return false;
      }
      if (!searchTerms.length) {
        return true;
      }

      const category = (item.category || "Other").toLowerCase();
      const categoryLabel = getCategoryLabel(
        item.category || "Other",
      ).toLowerCase();

      const categoryVariants = [category, categoryLabel].flatMap((value) => {
        const trimmed = value.trim();
        if (!trimmed) return [];
        if (trimmed.endsWith("s")) {
          return [trimmed, trimmed.slice(0, -1)];
        }
        return [trimmed, `${trimmed}s`];
      });

      const searchableText = [
        item.name.toLowerCase(),
        ...categoryVariants,
      ].join(" ");
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [items, filters, searchTerms]);

  const orderedSections = useMemo(
    () => getOrderedMenuSections(filteredItems),
    [filteredItems],
  );
  const [activeCategory, setActiveCategory] = useState<string>(
    () => orderedSections[0] ?? "",
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
    [orderedSections],
  );

  useEffect(() => {
    const previousQuery = previousSearchQueryRef.current.trim();
    const nextQuery = searchQuery.trim();

    if (nextQuery && nextQuery !== previousQuery) {
      listTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    previousSearchQueryRef.current = searchQuery;
  }, [searchQuery]);

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
        calorieBounds={calorieBounds}
      />

      <div className="mt-6">
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
          entireMenu={entireMenu}
          onEntireMenuChange={setEntireMenu}
          calorieBounds={calorieBounds}
        />
      </div>

      <div ref={listTopRef} className="h-1" aria-hidden="true" />

      <div className="mt-10">
        <MenuSections
          restaurantId={restaurantId}
          items={filteredItems}
          sort={sort}
          addons={addons}
          commonChanges={commonChanges}
          groupByCategory={!entireMenu}
        />
      </div>
    </div>
  );
}
