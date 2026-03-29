import type { IngredientItem, MenuItem, RestaurantMenu } from "@/types/menu";

function resolveIngredientBackedItems(items: MenuItem[], ingredients: IngredientItem[]): MenuItem[] {
  const ingredientById = new Map(
    ingredients
      .filter((ingredient): ingredient is IngredientItem & { id: string } => Boolean(ingredient.id))
      .map((ingredient) => [ingredient.id, ingredient]),
  );

  return items.map((item) => {
    if (!item.ingredientRef) return item;

    const ingredient = ingredientById.get(item.ingredientRef);
    if (!ingredient) return item;

    return {
      ...item,
      nutrition: item.nutrition ?? ingredient.nutrition,
      image: item.image ?? ingredient.image,
    };
  });
}

export function resolveMenuDataset(menu: RestaurantMenu): RestaurantMenu {
  const ingredients = (menu.ingredients ?? []) as IngredientItem[];
  return {
    ...menu,
    items: resolveIngredientBackedItems(menu.items as MenuItem[], ingredients),
    ingredients,
  };
}
