"use client";

import type { MenuItem } from "@/types/menu";
import MenuSections from "./MenuSections";
import TopPicksList from "./TopPicksList";
import type { SortOption, ViewOption } from "@/types/restaurant-controls";

export default function RestaurantView({
  view,
  sort,
  filteredItems,
  filteredHighestProtein,
  filteredBestRatio,
  filteredLowestCalories,
}: {
  view: ViewOption;
  sort: SortOption;
  filteredItems: MenuItem[];
  filteredHighestProtein: MenuItem[];
  filteredBestRatio: MenuItem[];
  filteredLowestCalories: MenuItem[];
}) {
  return (
    <div>
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
