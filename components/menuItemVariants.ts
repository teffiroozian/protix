import type { ItemVariant, MenuItem } from "@/types/menu";

export function getDefaultVariant(item: MenuItem): ItemVariant | undefined {
  const variants = item.variants;
  if (!variants || variants.length === 0) return undefined;

  if (item.displayVariantId) {
    const displayVariant = variants.find((variant) => variant.id === item.displayVariantId);
    if (displayVariant) return displayVariant;
  }

  if (item.defaultVariantId) {
    const defaultVariant = variants.find((variant) => variant.id === item.defaultVariantId);
    if (defaultVariant) return defaultVariant;
  }

  const flaggedDefault = variants.find((variant) => variant.isDefault);
  return flaggedDefault ?? variants[0];
}

export function getEffectiveNutrition(item: MenuItem) {
  return getDefaultVariant(item)?.nutrition ?? item.nutrition;
}

export function expandItemsForRanking(items: MenuItem[]): MenuItem[] {
  return items.flatMap((item) => {
    if (!item.variants || item.variants.length === 0) {
      return [item];
    }

    return item.variants.map((variant) => ({
      ...item,
      id: `${item.id ?? item.name}::${variant.id}`,
      portionType: variant.portionType ?? item.portionType,
      displayVariantId: variant.id,
      displayVariantLabel: variant.label,
    }));
  });
}
