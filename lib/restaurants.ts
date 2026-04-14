import restaurants from "@/app/data/index.json";
import { normalizeAddons } from "@/lib/addons";
import { resolveMenuDataset } from "@/lib/menuResolver";
import type {
  AddonRef,
  CommonChange,
  IngredientItem,
  IngredientModifier,
  MenuItem,
  RestaurantAddons,
  RestaurantBuilderConfig,
  RestaurantCustomizationRules,
} from "@/types/menu";

export type RestaurantData = {
  id: string;
  name: string;
  logo: string;
  menuFile: string;
  isBuildYourOwn: boolean;
  items: MenuItem[];
  ingredients: IngredientItem[];
  addons: RestaurantAddons;
  commonChanges: CommonChange[];
  ingredientModifiers: IngredientModifier[];
  customizationRules?: RestaurantCustomizationRules;
  builderConfig?: RestaurantBuilderConfig;
};

const RESTAURANT_ID_ALIASES: Record<string, string> = {
  "chick-fil-a": "chickfila",
  chickfilaa: "chickfila",
  chickfilet: "chickfila",
  pandaexpress: "panda",
  "panda-express": "panda",
  habitburger: "habit",
  "habit-burger": "habit",
  "the-habit": "habit",
  modpizza: "mod",
  "mod-pizza": "mod",
};

function normalizeRestaurantId(value: string) {
  return value.trim().toLowerCase();
}

function collapseRestaurantId(value: string) {
  return normalizeRestaurantId(value).replace(/[^a-z0-9]/g, "");
}

export function resolveRestaurantId(id: string) {
  const normalizedId = normalizeRestaurantId(id);
  const collapsedId = collapseRestaurantId(id);
  const directAlias = RESTAURANT_ID_ALIASES[normalizedId] ?? RESTAURANT_ID_ALIASES[collapsedId];
  if (directAlias) return directAlias;

  const directMatch = restaurants.find((entry) => entry.id === normalizedId);
  if (directMatch) return directMatch.id;

  const collapsedMatch = restaurants.find((entry) => collapseRestaurantId(entry.id) === collapsedId);
  return collapsedMatch?.id ?? normalizedId;
}

export function toItemSlug(item: MenuItem) {
  const raw = item.id ?? item.name;
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getRestaurantData(id: string): Promise<RestaurantData | null> {
  const resolvedId = resolveRestaurantId(id);
  const restaurant = restaurants.find((entry) => entry.id === resolvedId);
  if (!restaurant) return null;

  const menuModule = await import(`@/app/data/${restaurant.menuFile}`);
  const menu = resolveMenuDataset(menuModule.default);
  const ingredients = menu.ingredients;
  const items = menu.items;
  return {
    id: restaurant.id,
    name: restaurant.name,
    logo: restaurant.logo,
    menuFile: restaurant.menuFile,
    isBuildYourOwn: menu.isBuildYourOwn ?? false,
    items,
    ingredients,
    addons: normalizeAddons(menu.addons),
    commonChanges: (menu.commonChanges ?? []) as CommonChange[],
    ingredientModifiers: (menu.ingredientModifiers ?? []) as IngredientModifier[],
    customizationRules: menu.customizationRules,
    builderConfig: menu.builderConfig,
  };
}

export function getItemBySlug(items: MenuItem[], slug: string) {
  return items.find((item) => toItemSlug(item) === slug);
}

export function buildAddonMenuItems(restaurantId: string, addons?: RestaurantAddons): MenuItem[] {
  if (!addons) return [];

  const categoryByAddonRef: Record<AddonRef, string> = {
    sauces: "Dipping Sauces",
    dressings: "Dressings",
    condiments: "Condiments",
  };

  return (Object.entries(addons) as [AddonRef, NonNullable<RestaurantAddons[AddonRef]>][])
    .flatMap(([addonRef, options]) =>
      options.map((option) => ({
        id: `${restaurantId}-${addonRef}-${option.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: option.name,
        nutrition: {
          calories: option.calories,
          protein: option.protein,
          carbs: option.carbs,
          totalFat: option.totalFat ?? 0,
          satFat: option.satFat,
          transFat: option.transFat,
          cholesterol: option.cholesterol,
          sodium: option.sodium,
          fiber: option.fiber,
          sugars: option.sugars,
        },
        categories: [categoryByAddonRef[addonRef]],
        portionType: "addon",
        image: option.image,
      }))
    );
}
