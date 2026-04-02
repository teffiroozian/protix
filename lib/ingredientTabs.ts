import type { IngredientItem, MenuItem, RestaurantCustomizationRules } from "@/types/menu";

export const INCLUDED_INGREDIENT_TAB = "Included";
export type IngredientSelectionMode = "quantity" | "single";

export function normalizeTabName(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeRuleLookupKey(value: string) {
  return value.trim().toLowerCase();
}

export function resolvePrimaryCategory(categories?: string[]) {
  return categories?.map((category) => category.trim()).find(Boolean);
}

function resolveRuleValueByCategoryKey<T>(
  rules: Partial<Record<string, T>> | undefined,
  categoryKey: string | undefined
) {
  if (!categoryKey) {
    return undefined;
  }

  const normalizedCategoryKey = normalizeRuleLookupKey(categoryKey);
  return Object.entries(rules ?? {}).find(
    ([candidateKey]) => normalizeRuleLookupKey(candidateKey) === normalizedCategoryKey
  )?.[1];
}

export function getIngredientTabDisplayLabel(tabName: string) {
  const normalized = normalizeTabName(tabName);
    if (normalized.endsWith(" toppings") || normalized === "toppings") {
    return "Toppings";
  }

  if (normalized.endsWith(" condiments") || normalized === "condiments") {
    return "Condiments";
  }

  return tabName;
}

export function resolveIngredientTabs(
  item: MenuItem,
  customizationRules?: RestaurantCustomizationRules
) {
  const itemLevelTabs = item.customization?.ingredientTabs?.filter(Boolean) ?? [];
  const primaryCategory = resolvePrimaryCategory(item.categories);
  const restaurantLevelTabs = (resolveRuleValueByCategoryKey(
    customizationRules?.ingredientTabsByItemCategory,
    primaryCategory
  ) ?? []).filter(Boolean);

  const configuredTabs = itemLevelTabs.length > 0 ? itemLevelTabs : restaurantLevelTabs;
  const dedupedConfiguredTabs = configuredTabs.filter((tab, index) => {
    const normalizedTab = normalizeTabName(tab);
    if (!normalizedTab || normalizedTab === normalizeTabName(INCLUDED_INGREDIENT_TAB)) {
      return false;
    }

    return configuredTabs.findIndex((candidate) => normalizeTabName(candidate) === normalizedTab) === index;
  });

  return [
    INCLUDED_INGREDIENT_TAB,
    ...dedupedConfiguredTabs.filter((tab) => typeof resolveIngredientTabMaxQuantity(item, tab, customizationRules) === "number"),
  ];
}

export function resolveIngredientTabMaxQuantity(
  item: MenuItem,
  tabName: string,
  customizationRules?: RestaurantCustomizationRules
) {
  const normalizedTabName = normalizeTabName(tabName);
  if (!normalizedTabName || normalizedTabName === normalizeTabName(INCLUDED_INGREDIENT_TAB)) {
    return undefined;
  }

  const itemLevelMaxQuantities = item.customization?.ingredientTabMaxQuantities;
  const itemLevelMax = Object.entries(itemLevelMaxQuantities ?? {}).find(
    ([candidateTab]) => normalizeTabName(candidateTab) === normalizedTabName
  )?.[1];

  if (typeof itemLevelMax === "number") {
    return itemLevelMax;
  }

  const restaurantLevelMax = Object.entries(customizationRules?.ingredientTabMaxQuantities ?? {}).find(
    ([candidateTab]) => normalizeTabName(candidateTab) === normalizedTabName
  )?.[1];

  if (typeof restaurantLevelMax === "number") {
    return restaurantLevelMax;
  }

  const primaryCategory = resolvePrimaryCategory(item.categories);
  const restaurantLevelMaxQuantitiesByCategory =
    resolveRuleValueByCategoryKey(customizationRules?.ingredientTabMaxQuantitiesByItemCategory, primaryCategory);

  return Object.entries(restaurantLevelMaxQuantitiesByCategory ?? {}).find(
    ([candidateTab]) => normalizeTabName(candidateTab) === normalizedTabName
  )?.[1];
}

export function resolveSingleSelectIngredientTabs(
  item: MenuItem,
  customizationRules?: RestaurantCustomizationRules
) {
  const itemLevelSingleSelectTabs = item.customization?.singleSelectIngredientTabs?.filter(Boolean) ?? [];
  const primaryCategory = resolvePrimaryCategory(item.categories);
  const restaurantLevelSingleSelectTabs = (resolveRuleValueByCategoryKey(
    customizationRules?.singleSelectIngredientTabsByItemCategory,
    primaryCategory
  ) ?? []).filter(Boolean);

  const configuredTabs = itemLevelSingleSelectTabs.length > 0 ? itemLevelSingleSelectTabs : restaurantLevelSingleSelectTabs;

  return new Set(
    configuredTabs
      .map((tab) => normalizeTabName(tab))
      .filter((tab) => tab && tab !== normalizeTabName(INCLUDED_INGREDIENT_TAB))
  );
}

export function ingredientMatchesTab(ingredient: IngredientItem, tabName: string) {
  const ingredientCategories = ingredient.categories?.length ? ingredient.categories : [];

  return ingredientCategories.some((category) => normalizeTabName(category) === normalizeTabName(tabName));
}

export function isSingleSelectIngredientTab(
  item: MenuItem,
  tabName: string,
  customizationRules?: RestaurantCustomizationRules
) {
  return resolveIngredientTabMaxQuantity(item, tabName, customizationRules) === 1;
}
