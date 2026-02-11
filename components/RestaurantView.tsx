"use client";

import { useMemo, useState } from "react";
import type { MenuItem, RestaurantAddons } from "@/types/menu";
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
import TopPicksList from "./TopPicksList";
import StickyRestaurantBar from "./StickyRestaurantBar";

const rankingSectionIdBySort: Record<SortOption, string> = {
  "highest-protein": "high-protein",
  "best-ratio": "best-protein-ratio",
  "lowest-calories": "lowest-calorie",
};

export default function RestaurantView({
  restaurantName,
  restaurantLogo,
  items,
  highestProtein,
  bestCalorieProteinRatio,
  lowestCalorieItems,
  addons,
}: {
  restaurantName: string;
  restaurantLogo: string;
  items: MenuItem[];
  highestProtein: MenuItem[];
  bestCalorieProteinRatio: MenuItem[];
  lowestCalorieItems: MenuItem[];
  addons?: RestaurantAddons;
}) {
  const [view, setView] = useState<ViewOption>("menu");
  const [sort, setSort] = useState<SortOption>("highest-protein");
  const [filters, setFilters] = useState<Filters>({});

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.proteinMin && item.nutrition.protein < filters.proteinMin) {
        return false;
      }
      if (filters.caloriesMax && item.nutrition.calories > filters.caloriesMax) {
        return false;
      }
      return true;
    });
  }, [items, filters]);

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

  const filteredHighestProtein = useMemo(
    () => highestProtein.filter((item) => filteredItems.includes(item)),
    [highestProtein, filteredItems]
  );
  const filteredBestRatio = useMemo(
    () => bestCalorieProteinRatio.filter((item) => filteredItems.includes(item)),
    [bestCalorieProteinRatio, filteredItems]
  );
  const filteredLowestCalories = useMemo(
    () => lowestCalorieItems.filter((item) => filteredItems.includes(item)),
    [lowestCalorieItems, filteredItems]
  );

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    const section = document.getElementById(categorySectionId(categoryId));
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSortChange = (nextSort: SortOption) => {
    setSort(nextSort);

    const sectionId = rankingSectionIdBySort[nextSort];
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <StickyRestaurantBar
        restaurantName={restaurantName}
        restaurantLogo={restaurantLogo}
        view={view}
        onChange={setView}
        sort={sort}
        onSortChange={handleSortChange}
        filters={filters}
        onFiltersChange={setFilters}
        categoryOptions={categoryOptions}
        activeCategory={resolvedActiveCategory}
        onCategorySelect={handleCategorySelect}
      />

      <ControlsRow
        view={view}
        onChange={setView}
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
      />

      {view === "menu" ? (
        <MenuSections items={filteredItems} sort={sort} addons={addons} />
      ) : (
        <TopPicksList
          highestProtein={filteredHighestProtein}
          bestCalorieProteinRatio={filteredBestRatio}
          lowestCalorieItems={filteredLowestCalories}
          sort={sort}
          addons={addons}
        />
      )}
    </div>
  );
}
