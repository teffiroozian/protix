"use client";

import { useMemo, useState } from "react";
import StickyRestaurantBar from "./StickyRestaurantBar";
import RestaurantHeader from "./RestaurantHeader";
import RestaurantView from "./RestaurantView";
import type { MenuItem } from "@/types/menu";
import type {
  Filters,
  SortOption,
  ViewOption,
} from "@/types/restaurant-controls";

type RestaurantPageShellProps = {
  restaurantName: string;
  restaurantLogo: string;
  restaurantSlug: string;
  items: MenuItem[];
  highestProtein: MenuItem[];
  bestCalorieProteinRatio: MenuItem[];
  lowestCalorieItems: MenuItem[];
};

export default function RestaurantPageShell({
  restaurantName,
  restaurantLogo,
  restaurantSlug,
  items,
  highestProtein,
  bestCalorieProteinRatio,
  lowestCalorieItems,
}: RestaurantPageShellProps) {
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
    <div style={{ width: "100%" }}>
      <StickyRestaurantBar
        restaurantName={restaurantName}
        view={view}
        onViewChange={setView}
        sort={sort}
        onSortChange={setSort}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div id="restaurant-hero" className="mt-6">
        <RestaurantHeader
          name={restaurantName}
          logo={restaurantLogo}
          restaurantSlug={restaurantSlug}
        />
      </div>

      <main style={{ maxWidth: 900, margin: "24px auto 48px", padding: 16 }}>
        <RestaurantView
          view={view}
          sort={sort}
          filteredItems={filteredItems}
          filteredHighestProtein={filteredHighestProtein}
          filteredBestRatio={filteredBestRatio}
          filteredLowestCalories={filteredLowestCalories}
        />
      </main>
    </div>
  );
}
