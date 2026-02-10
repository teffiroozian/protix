"use client";

import type { MenuItem } from "@/types/menu";
import type { SortOption } from "./ControlsRow";
import MenuItemCard from "./MenuItemCard";

function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}

function titleCase(text: string) {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function caloriesPerProtein(item: MenuItem) {
  if (!item.nutrition.protein) return Number.POSITIVE_INFINITY;
  return item.nutrition.calories / item.nutrition.protein;
}

export function sortItems(items: MenuItem[], sort: SortOption) {
  const sorted = [...items];
  if (sort === "highest-protein") {
    sorted.sort((a, b) => b.nutrition.protein - a.nutrition.protein);
  } else if (sort === "best-ratio") {
    sorted.sort((a, b) => caloriesPerProtein(a) - caloriesPerProtein(b));
  } else {
    sorted.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
  }
  return sorted;
}

export default function MenuSections({
  items,
  sort,
}: {
  items: MenuItem[];
  sort: SortOption;
}) {
  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = normalizeCategory(item.category || "Other");
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  const sortedGrouped = Object.fromEntries(
    Object.entries(grouped).map(([key, value]) => [key, sortItems(value, sort)])
  );

  const sections = Object.keys(sortedGrouped).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <div style={{ marginTop: 32, display: "grid", gap: 48 }}>
      {sections.map((section) => (
        <section key={section} style={{ scrollMarginTop: 200 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>
            {titleCase(section)}
          </h2>
          <ul style={{ marginTop: 12, padding: 0, display: "grid", gap: 12 }}>
            {sortedGrouped[section].map((item, index) => (
              <MenuItemCard key={`${item.name}-${index}`} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
