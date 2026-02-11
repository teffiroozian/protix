"use client";

import type { MenuItem, RestaurantAddons } from "@/types/menu";
import type { SortOption } from "./ControlsRow";
import MenuItemCard from "./MenuItemCard";

function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}

const CATEGORY_PRIORITY_GROUPS = [
  { label: "Entrees", aliases: ["entree", "entrees"] },
  { label: "Burgers", aliases: ["burger", "burgers"] },
  { label: "Sandwiches", aliases: ["sandwich", "sandwiches"] },
  {
    label: "Wings, Tenders, Nuggets",
    aliases: ["wings", "wing", "tenders", "tender", "nuggets", "nugget"],
  },
  {
    label: "Bowls & Plates",
    aliases: ["bowl", "bowls", "plate", "plates", "bowls & plates"],
  },
  { label: "Salads", aliases: ["salad", "salads"] },
  { label: "Wraps", aliases: ["wrap", "wraps"] },
  { label: "Breakfast", aliases: ["breakfast"] },
  { label: "Kids", aliases: ["kid", "kids"] },
  { label: "Sides", aliases: ["side", "sides"] },
  {
    label: "Sauce & Dressings",
    aliases: ["sauce", "sauces", "dressing", "dressings", "sauce & dressings"],
  },
  { label: "Desserts", aliases: ["dessert", "desserts"] },
  { label: "Drinks", aliases: ["drink", "drinks", "beverage", "beverages"] },
] as const;

const categoryPriorityLookup = new Map(
  CATEGORY_PRIORITY_GROUPS.flatMap((group, index) =>
    group.aliases.map((alias) => [normalizeCategory(alias), index] as const)
  )
);

const categoryLabelLookup = new Map(
  CATEGORY_PRIORITY_GROUPS.flatMap((group) =>
    group.aliases.map((alias) => [normalizeCategory(alias), group.label] as const)
  )
);

function categoryPriority(category: string) {
  return categoryPriorityLookup.get(category) ?? Number.POSITIVE_INFINITY;
}

function categoryHeading(category: string) {
  return categoryLabelLookup.get(category) ?? titleCase(category);
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
  addons,
}: {
  items: MenuItem[];
  sort: SortOption;
  addons?: RestaurantAddons;
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

  const sections = Object.keys(sortedGrouped).sort((a, b) => {
    const priorityDiff = categoryPriority(a) - categoryPriority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return a.localeCompare(b);
  });

  return (
    <div style={{ marginTop: 32, display: "grid", gap: 48 }}>
      {sections.map((section) => (
        <section key={section} style={{ scrollMarginTop: 200 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>
            {categoryHeading(section)}
          </h2>
          <ul style={{ marginTop: 12, padding: 0, display: "grid", gap: 12 }}>
            {sortedGrouped[section].map((item, index) => (
              <MenuItemCard key={`${item.name}-${index}`} item={item} addons={addons} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
