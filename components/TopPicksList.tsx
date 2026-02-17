"use client";

import type { CommonChange, MenuItem, RestaurantAddons } from "@/types/menu";
import RankingList from "./RankingList";

type SortOption = "highest-protein" | "best-ratio" | "lowest-calories";

export default function TopPicksList({
  restaurantId,
  highestProtein,
  bestCalorieProteinRatio,
  lowestCalorieItems,
  addons,
  commonChanges,
  includeSidesDrinks = false,
  includeLargeShareables = false,
}: {
  restaurantId: string;
  highestProtein: MenuItem[];
  bestCalorieProteinRatio: MenuItem[];
  lowestCalorieItems: MenuItem[];
  sort: SortOption;
  addons?: RestaurantAddons;
  commonChanges?: CommonChange[];
  includeSidesDrinks?: boolean;
  includeLargeShareables?: boolean;
}) {
  const sections = [
    {
      key: "highest-protein",
      content: (
        <section id="high-protein" style={{ marginTop: 48, scrollMarginTop: 200 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>
            Highest Protein Items
          </h2>

          <p style={{ marginTop: 8, opacity: 0.8, marginBottom: 20 }}>
            Items with the most protein per serving size.
          </p>

          <RankingList
            restaurantId={restaurantId}
            items={highestProtein}
            highlightTop={3}
            addons={addons}
            commonChanges={commonChanges}
            includeSidesDrinks={includeSidesDrinks}
            includeLargeShareables={includeLargeShareables}
          />
        </section>
      ),
    },
    {
      key: "best-ratio",
      content: (
        <section
          id="best-protein-ratio"
          style={{ marginTop: 80, scrollMarginTop: 200 }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Best Protein Ratio</h2>

          <p style={{ marginTop: 6, opacity: 0.75 }}>
            Ranked by protein efficiency (more protein per calorie).
          </p>

          <RankingList
            restaurantId={restaurantId}
            items={bestCalorieProteinRatio}
            highlightTop={3}
            showRatio
            addons={addons}
            commonChanges={commonChanges}
            includeSidesDrinks={includeSidesDrinks}
            includeLargeShareables={includeLargeShareables}
          />
        </section>
      ),
    },
    {
      key: "lowest-calories",
      content: (
        <section
          id="lowest-calorie"
          style={{ marginTop: 80, scrollMarginTop: 200 }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Lowest Calorie Items</h2>

          <p style={{ marginTop: 6, opacity: 0.75 }}>
            Lowest calorie foods on the menu.
          </p>

          <RankingList
            restaurantId={restaurantId}
            items={lowestCalorieItems}
            highlightTop={3}
            addons={addons}
            commonChanges={commonChanges}
            includeSidesDrinks={includeSidesDrinks}
            includeLargeShareables={includeLargeShareables}
          />
        </section>
      ),
    },
  ];
  return (
    <div>
      {sections.map((section) => (
        <div key={section.key}>{section.content}</div>
      ))}
    </div>
  );
}
