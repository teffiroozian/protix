import ItemRouteModal from "@/components/ItemRouteModal";
import RestaurantPageContent, { loadRestaurantData, NotFoundRestaurant } from "@/components/RestaurantPageContent";
import { toItemSlug } from "@/utils/itemRoute";

export default async function RestaurantItemModalPage({
  params,
}: {
  params: Promise<{ id: string; itemSlug: string }>;
}) {
  const { id, itemSlug } = await params;
  const data = await loadRestaurantData(id);

  if (!data) {
    return <NotFoundRestaurant />;
  }

  const item = data.items.find((candidate) => toItemSlug(candidate.id ?? candidate.name) === itemSlug);

  return (
    <RestaurantPageContent
      restaurantId={data.restaurant.id}
      restaurantName={data.restaurant.name}
      restaurantLogo={data.restaurant.logo}
      items={data.items}
      ingredients={data.ingredients}
      addons={data.addons}
      commonChanges={data.commonChanges}
      overlay={
        item ? (
          <ItemRouteModal
            restaurantId={data.restaurant.id}
            item={item}
            addons={data.addons}
            commonChanges={data.commonChanges}
          />
        ) : null
      }
    />
  );
}
