import RestaurantPageContent, { loadRestaurantData, NotFoundRestaurant } from "@/components/RestaurantPageContent";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadRestaurantData(id);

  if (!data) {
    return <NotFoundRestaurant />;
  }

  return (
    <RestaurantPageContent
      restaurantId={data.restaurant.id}
      restaurantName={data.restaurant.name}
      restaurantLogo={data.restaurant.logo}
      items={data.items}
      ingredients={data.ingredients}
      addons={data.addons}
      commonChanges={data.commonChanges}
    />
  );
}
