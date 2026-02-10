"use client";

import type { MenuItem } from "@/types/menu";
import RankingList from "./RankingList";

type SortOption = "highest-protein" | "best-ratio" | "lowest-calories";

export default function TopPicksList({
  highestProtein,
  bestCalorieProteinRatio,
  lowestCalorieItems,
  sort,
}: {
  highestProtein: MenuItem[];
  bestCalorieProteinRatio: MenuItem[];
  lowestCalorieItems: MenuItem[];
  sort: SortOption;
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

          <RankingList items={highestProtein} highlightTop={3} />
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
            items={bestCalorieProteinRatio}
            highlightTop={3}
            showRatio
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

          <RankingList items={lowestCalorieItems} highlightTop={3} />
        </section>
      ),
    },
  ];
  const orderedSections = [
    sections.find((section) => section.key === sort),
    ...sections.filter((section) => section.key !== sort),
  ].filter(Boolean) as typeof sections;

  return (
    <div>
      {orderedSections.map((section) => (
        <div key={section.key}>{section.content}</div>
      ))}
    </div>
  );
}
