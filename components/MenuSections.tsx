"use client";

import type { CommonChange, MenuItem, RestaurantAddons } from "@/types/menu";
import type { SortOption } from "./ControlsRow";
import MenuItemCard from "./MenuItemCard";
import { getEffectiveNutrition } from "./menuItemVariants";

function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}

export function categorySectionId(category: string) {
  return `menu-section-${normalizeCategory(category).replace(/[^a-z0-9]+/g, "-")}`;
}

const CATEGORY_PRIORITY_GROUPS = [
  { label: "Entrees", aliases: ["entree", "entrees"] },
  { label: "Burgers", aliases: ["burger", "burgers"] },
  { label: "Sandwiches", aliases: ["sandwich", "sandwiches"] },
  {
    label: "Chicken",
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
  const nutrition = getEffectiveNutrition(item);
  if (!nutrition.protein) return Number.POSITIVE_INFINITY;
  return nutrition.calories / nutrition.protein;
}

export function sortItems(items: MenuItem[], sort: SortOption) {
  const sorted = [...items];
  if (sort === "highest-protein") {
    sorted.sort((a, b) => getEffectiveNutrition(b).protein - getEffectiveNutrition(a).protein);
  } else if (sort === "best-ratio") {
    sorted.sort((a, b) => caloriesPerProtein(a) - caloriesPerProtein(b));
  } else {
    sorted.sort((a, b) => getEffectiveNutrition(a).calories - getEffectiveNutrition(b).calories);
  }
  return sorted;
}

export function getOrderedMenuSections(items: MenuItem[]) {
  const sectionSet = new Set(
    items.map((item) => normalizeCategory(item.category || "Other"))
  );

  return [...sectionSet].sort((a, b) => {
    const priorityDiff = categoryPriority(a) - categoryPriority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return a.localeCompare(b);
  });
}

export function getCategoryLabel(category: string) {
  return categoryHeading(category);
}

export default function MenuSections({
  restaurantId,
  items,
  sort,
  addons,
  commonChanges,
  groupByCategory = true,
}: {
  restaurantId: string;
  items: MenuItem[];
  sort: SortOption;
  addons?: RestaurantAddons;
  commonChanges?: CommonChange[];
  groupByCategory?: boolean;
}) {

  if (!groupByCategory) {
    const sortedItems = sortItems(items, sort);

    return (
      <div style={{ marginTop: 32, display: "grid", gap: 12 }}>
        <ul style={{ marginTop: 0, padding: 0, display: "grid", gap: 12 }}>
          {sortedItems.map((item, index) => (
            <MenuItemCard
              key={`${item.name}-${index}`}
              restaurantId={restaurantId}
              item={item}
              addons={addons}
              commonChanges={commonChanges}
              rankingMode={!groupByCategory}
            />
          ))}
        </ul>
      </div>
    );
  }

  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = normalizeCategory(item.category || "Other");
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  const sortedGrouped = Object.fromEntries(
    Object.entries(grouped).map(([key, value]) => [key, sortItems(value, sort)])
  );

  const sections = getOrderedMenuSections(items);

  return (
    <div style={{ marginTop: 32, display: "grid", gap: 48 }}>
      {sections.map((section) => (
        <section
          key={section}
          id={categorySectionId(section)}
          style={{ scrollMarginTop: 200 }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>
            {categoryHeading(section)}
          </h2>
          <ul style={{ marginTop: 12, padding: 0, display: "grid", gap: 12 }}>
            {sortedGrouped[section].map((item, index) => (
              <MenuItemCard
                key={`${item.name}-${index}`}
                restaurantId={restaurantId}
                item={item}
                addons={addons}
                commonChanges={commonChanges}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
