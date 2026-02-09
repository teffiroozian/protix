"use client";

import { useState } from "react";
import type { MenuItem } from "@/types/menu";
import ControlsRow from "./ControlsRow";
import MenuSections from "./MenuSections";
import TopPicksList from "./TopPicksList";

type ViewOption = "menu" | "top";
type SortOption = "highest-protein" | "best-ratio" | "lowest-calories";

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

  return (
    <div>
      <ControlsRow
        view={view}
        onChange={setView}
        sort={sort}
        onSortChange={setSort}
      />

      {view === "menu" ? (
        <MenuSections items={items} sort={sort} />
      ) : (
        <TopPicksList
          highestProtein={highestProtein}
          bestCalorieProteinRatio={bestCalorieProteinRatio}
          lowestCalorieItems={lowestCalorieItems}
          sort={sort}
        />
      )}
    </div>
  );
}
