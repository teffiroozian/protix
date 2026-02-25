import type { ItemVariant, MenuItem } from "@/types/menu";

const KIDS_TAG = "kids";

function normalize(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

export function isKidsSection(section?: string) {
  const normalized = normalize(section);
  return normalized === "kids" || normalized === "kid";
}

export function getVariantsForSection(item: MenuItem, section?: string): ItemVariant[] | null {
  const variants = item.variants?.length ? item.variants : null;
  if (!variants) return null;
  if (!isKidsSection(section)) return variants;

  return variants.filter((variant) =>
    variant.tags?.some((tag) => normalize(tag) === KIDS_TAG)
  );
}

export function getDefaultVariantIdForSection(item: MenuItem, section?: string): string {
  const variants = getVariantsForSection(item, section);
  if (!variants || variants.length === 0) return "";

  if (
    item.defaultVariantId &&
    variants.some((variant) => variant.id === item.defaultVariantId)
  ) {
    return item.defaultVariantId;
  }

  const flaggedDefault = variants.find((variant) => variant.isDefault);
  return flaggedDefault?.id ?? variants[0]?.id ?? "";
}
