"use client";

import { useMemo, useState } from "react";
import type { MenuItem } from "@/types/menu";
import ControlsRow from "./ControlsRow";
import MenuSections from "./MenuSections";
import TopPicksList from "./TopPicksList";

type ViewOption = "menu" | "top";
type SortOption = "highest-protein" | "best-ratio" | "lowest-calories";
type Filters = {
  proteinMin?: number;
  caloriesMax?: number;
};

export default function RestaurantView({
  items,
  highestProtein,
  bestCalorieProteinRatio,
  lowestCalorieItems,
}: {
  items: MenuItem[];
  highestProtein: MenuItem[];
  bestCalorieProteinRatio: MenuItem[];
  lowestCalorieItems: MenuItem[];
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

  return (
    <div>
      <ControlsRow
        view={view}
        onChange={setView}
        sort={sort}
        onSortChange={setSort}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {view === "menu" ? (
        <MenuSections items={filteredItems} sort={sort} />
      ) : (
        <TopPicksList
          highestProtein={filteredHighestProtein}
          bestCalorieProteinRatio={filteredBestRatio}
          lowestCalorieItems={filteredLowestCalories}
          sort={sort}
        />
      )}
    </div>
  );
}
