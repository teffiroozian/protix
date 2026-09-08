import type { MenuItem } from '@/types/menu';
import type { RestaurantData } from '@/types/restaurant';
import { getDefaultMenuItemNutrition, getProteinPer100Calories } from '@/lib/nutrition';

export function selectOgItem(items: MenuItem[]) {
  const candidates = items.filter(item => !item.sourceOnly).map(item => {
    const variant = item.variants?.find(v => v.id === item.defaultVariantId) ?? item.variants?.[0];
    const raw = variant?.nutrition ?? item.nutrition;
    const resolved = getDefaultMenuItemNutrition(item);
    const nutrition = Object.fromEntries(Object.entries(resolved).filter(([key]) =>
      Number.isFinite(raw?.[key as keyof typeof raw]) || Number.isFinite(variant?.nutritionMultiplier)
    ));
    return { item, variant, nutrition, servingType: variant?.servingType ?? item.servingType,
      image: variant?.image || item.image };
  }).filter(candidate => candidate.servingType !== 'shareable');
  const mains = candidates.filter(c => ['entree', 'single'].includes(c.servingType));
  const pool = mains.length ? mains : candidates;
  // A substantial protein portion, real photo and regular menu placement are
  // more representative than maximizing protein grams across the entire menu.
  const highProtein = pool.filter(c => (c.nutrition.protein ?? 0) >= 25);
  return (highProtein.length ? highProtein : pool).sort((a, b) =>
    Number(Boolean(b.image)) - Number(Boolean(a.image)) ||
    Number(Boolean(a.item.status)) - Number(Boolean(b.item.status)) ||
    (a.item.defaultOrder ?? Infinity) - (b.item.defaultOrder ?? Infinity) ||
    (b.nutrition.protein ?? -1) - (a.nutrition.protein ?? -1) ||
    a.item.id.localeCompare(b.item.id)
  )[0];
}

export function selectOgFeatured(restaurant: RestaurantData) {
  if (!restaurant.hasBuildYourOwn) return selectOgItem(restaurant.items);
  const labels = restaurant.builderConfig?.selectedIngredientCategoryLabels ?? {};
  const explicitCategory = restaurant.builderConfig?.primaryProteinCategory;
  const isProteinCategory = (category: string) => explicitCategory
    ? category.toLowerCase() === explicitCategory.toLowerCase()
    : /\b(proteins?|meats?)\b/i.test(`${category} ${labels[category] ?? ''}`);
  // Core ingredient categories, never the menu's promotional/prebuilt meals.
  return restaurant.ingredients.filter(i => !i.hideFromIngredientView && i.categories.some(isProteinCategory))
    .map(item => {
      const variant = item.variants?.find(v => v.id === item.defaultVariantId) ?? item.variants?.[0];
      const raw = variant?.nutrition ?? item.nutrition ?? {};
      const nutrition = Object.fromEntries(Object.entries(raw).filter((entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1])));
      return { item, variant, nutrition, image: variant?.image || item.image };
    })
    .filter(c => Number.isFinite(c.nutrition.protein))
    .sort((a, b) => b.nutrition.protein - a.nutrition.protein ||
      (a.item.defaultOrder ?? Infinity) - (b.item.defaultOrder ?? Infinity) || a.item.id.localeCompare(b.item.id))[0];
}

export function ogHeadline(restaurant: RestaurantData) {
  const name = fitOgText(restaurant.name, 60);
  return `Find high-protein ${name} meals`;
}

export function ogProteinScore(nutrition: Record<string, number>) {
  return Number.isFinite(nutrition.protein) && nutrition.protein >= 0 && Number.isFinite(nutrition.calories)
    ? getProteinPer100Calories(nutrition.protein, nutrition.calories) : undefined;
}

export function fitOgText(text: string, limit: number) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > limit ? `${clean.slice(0, limit - 1).trimEnd()}…` : clean;
}
