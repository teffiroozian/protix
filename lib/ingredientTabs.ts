import type {
  IngredientItem,
  IngredientSelectionMode,
  IngredientTabConfig,
  MenuItem,
  RestaurantCustomizationRules,
} from "@/types/menu";

export const INCLUDED_INGREDIENT_TAB = "Included";

function normalizeTabName(value: string) {
  return value.trim().toLowerCase();
}

export type ResolvedIngredientTabConfig = {
  id: string;
  label: string;
  selectionMode?: IngredientSelectionMode;
};

function resolveIngredientTabConfig(tab: IngredientTabConfig): ResolvedIngredientTabConfig | null {
  const label = typeof tab === "string" ? tab : tab.name;
  const normalizedLabel = normalizeTabName(label);

  if (!normalizedLabel || normalizedLabel === normalizeTabName(INCLUDED_INGREDIENT_TAB)) {
    return null;
  }

  return {
    id: normalizedLabel,
    label,
    selectionMode: typeof tab === "string" ? undefined : tab.selectionMode,
  };
}

export function resolveIngredientTabs(
  item: MenuItem,
  customizationRules?: RestaurantCustomizationRules
) {
  const itemLevelTabs = item.customization?.ingredientTabs ?? [];
  const primaryCategory = item.categories?.[0];
  const restaurantLevelTabs =
    primaryCategory
      ? customizationRules?.ingredientTabsByItemCategory?.[primaryCategory] ?? []
      : [];

  const configuredTabs = itemLevelTabs.length > 0 ? itemLevelTabs : restaurantLevelTabs;
  const dedupedConfiguredTabs = configuredTabs.reduce<ResolvedIngredientTabConfig[]>((acc, tab) => {
    const resolvedTab = resolveIngredientTabConfig(tab);
    if (!resolvedTab) {
      return acc;
    }

    if (acc.some((candidate) => candidate.id === resolvedTab.id)) {
      return acc;
    }

    acc.push(resolvedTab);
    return acc;
  }, []);

  return [
    {
      id: normalizeTabName(INCLUDED_INGREDIENT_TAB),
      label: INCLUDED_INGREDIENT_TAB,
    },
    ...dedupedConfiguredTabs,
  ];
}

export function ingredientMatchesTab(ingredient: IngredientItem, tabName: string) {
  const ingredientCategories = ingredient.categories?.length
    ? ingredient.categories
    : ingredient.category
      ? [ingredient.category]
      : [];

  return ingredientCategories.some((category) => normalizeTabName(category) === normalizeTabName(tabName));
}
