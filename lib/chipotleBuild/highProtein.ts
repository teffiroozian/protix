import type { CartItem } from "@/stores/cartStore";
import type { MenuItem } from "@/types/menu";
import { parseIncludedIngredientEntry } from "@/lib/itemIngredients";

function resolveHighProteinEntree(item: MenuItem) {
  const id = (item.id ?? "").toLowerCase();
  if (id.includes("burrito")) return "burrito";
  if (id.includes("taco")) return "tacos";
  return "bowl";
}

function resolveHighProteinTacoShell(item: MenuItem) {
  const ingredients = item.ingredients ?? [];
  return ingredients.some((entry) => entry.toLowerCase().startsWith("soft-flour-tortilla"))
    ? "soft"
    : "crispy";
}

export function isChipotleHighProteinMenuItem(item: MenuItem, restaurantId: string) {
  return restaurantId === "chipotle" && item.entreeGroup === "high-protein-menu";
}

export function buildHighProteinBuildConfiguration(item: MenuItem): CartItem["buildConfiguration"] {
  const selectedIngredientItems = (item.ingredients ?? []).reduce<Record<string, { quantity: number }>>(
    (acc, entry) => {
      const parsed = parseIncludedIngredientEntry(entry);
      if (!parsed || parsed.defaultCount <= 0) return acc;
      acc[parsed.ingredientId] = { quantity: parsed.defaultCount };
      return acc;
    },
    {}
  );

  return {
    selectedEntree: resolveHighProteinEntree(item),
    selectedIngredientItems,
    selectedIngredientVariantIds: {},
    proteinPortionMode: "normal",
    splitPortionModeById: {},
    selectedTacoShell: resolveHighProteinTacoShell(item),
    selectedTacoCount: 1,
    selectedKidsMeal: "build-your-own",
  };
}
