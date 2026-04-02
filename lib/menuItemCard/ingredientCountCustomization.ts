import { getDefaultIngredientCounts } from "@/lib/menuItemCalculations";
import type { ResolvedPanelIngredient } from "@/components/ItemDetailsPanel";

export function formatIngredientCountCustomizationLabel(ingredientName: string, count: number) {
  return count === 0 ? `${ingredientName}: Removed` : `${ingredientName}: ${count}x`;
}

export function getSelectedIngredientCountsFromCustomizations(
  resolvedIngredients: ResolvedPanelIngredient[],
  customizations: string[] | undefined
) {
  const baseCounts = getDefaultIngredientCounts(resolvedIngredients);

  if (!customizations || customizations.length === 0) {
    return baseCounts;
  }

  const ingredientLookup = new Map<string, string>();
  resolvedIngredients.forEach((ingredient) => {
    ingredientLookup.set(ingredient.id.trim().toLowerCase(), ingredient.id);
    ingredientLookup.set(ingredient.label.trim().toLowerCase(), ingredient.id);
  });

  return customizations.reduce<Record<string, number>>((acc, label) => {
    const match = label.match(/^(.*?):\s*(Removed|(\d+)x|Remove|Extra)$/i);
    if (!match) return acc;

    const ingredientKey = match[1].trim().toLowerCase();
    const ingredientId = ingredientLookup.get(ingredientKey);
    if (!ingredientId || !(ingredientId in baseCounts)) return acc;

    const rawValue = match[2].trim().toLowerCase();
    const nextCount =
      rawValue === "removed" || rawValue === "remove"
        ? 0
        : rawValue === "extra"
          ? 2
          : Number.parseInt(match[3] ?? "", 10);

    if (!Number.isFinite(nextCount)) return acc;

    acc[ingredientId] = nextCount;
    return acc;
  }, { ...baseCounts });
}
