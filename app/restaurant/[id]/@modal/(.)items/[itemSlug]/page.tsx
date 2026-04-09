import { notFound } from "next/navigation";
import ItemRouteModal from "@/components/ItemRouteModal";
import { buildAddonMenuItems, getItemBySlug, getRestaurantData } from "@/lib/restaurants";
import type { MenuItem } from "@/types/menu";

const chipotleBuildShellItem: MenuItem = {
  id: "chipotle-build",
  name: "Build Your Own",
  image: "",
  categories: ["Entrees"],
  portionType: "single",
  nutrition: {
    calories: 0,
    protein: 0,
    carbs: 0,
    totalFat: 0,
  },
};

export default async function ItemModalPage({
  params,
}: {
  params: Promise<{ id: string; itemSlug: string }>;
}) {
  const { id, itemSlug } = await params;
  const restaurant = await getRestaurantData(id);

  if (!restaurant) notFound();

  const routeItems = [...restaurant.items, ...buildAddonMenuItems(restaurant.id, restaurant.addons)];
  const item =
    getItemBySlug(routeItems, itemSlug) ??
    (restaurant.id === "chipotle" && itemSlug === "chipotle-build"
      ? chipotleBuildShellItem
      : null);
  if (!item) notFound();

  return (
    <ItemRouteModal
      restaurantId={restaurant.id}
      restaurantPath={`/restaurant/${restaurant.id}`}
      item={item}
      menuItems={routeItems}
      addons={restaurant.addons}
      commonChanges={restaurant.commonChanges}
      ingredients={restaurant.ingredients}
      customizationRules={restaurant.customizationRules}
    />
  );
}
