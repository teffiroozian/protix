"use client";

import { useState } from "react";
import type { MenuItem } from "@/types/menu";
import ControlsRow from "./ControlsRow";
import MenuSections from "./MenuSections";
import TopPicksList from "./TopPicksList";

type ViewOption = "menu" | "top";

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

  return (
    <div>
      <ControlsRow view={view} onChange={setView} />

      {view === "menu" ? (
        <MenuSections items={items} />
      ) : (
        <TopPicksList
          highestProtein={highestProtein}
          bestCalorieProteinRatio={bestCalorieProteinRatio}
          lowestCalorieItems={lowestCalorieItems}
        />
      )}
    </div>
  );
}
