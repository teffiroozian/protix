import Link from "next/link";
import restaurants from "../../data/index.json";
import RestaurantView from "@/components/RestaurantView";
import RecentRestaurantTracker from "@/components/RecentRestaurantTracker";
import ScrollToTopOnMount from "@/components/ScrollToTopOnMount";
import { RestaurantSearchProvider } from "@/components/RestaurantSearchContext";
import { RestaurantUiProvider } from "@/components/RestaurantUiContext";
import CartPreviewDrawer from "@/components/CartPreviewDrawer";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <main style={{ maxWidth: 900, margin: "48px auto", padding: 16 }}>
        <Link href="/" style={{ textDecoration: "none", cursor: "pointer" }}>
          ← Back
        </Link>
        <h1 style={{ marginTop: 16 }}>Restaurant not found</h1>
      </main>
    );
  }

  return (
    <RestaurantSearchProvider>
      <RestaurantUiProvider>
        <div className="w-full pt-40">
          <RecentRestaurantTracker restaurantId={restaurant.id} />
          <ScrollToTopOnMount />

          <main className="mx-auto w-full max-w-6xl px-6 pb-12">
            <RestaurantView
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              restaurantLogo={restaurant.logo}
              // TODO: Replace this temporary fallback with shared loader data from `@/lib/restaurant-data-loader`.
              items={[]}
              // TODO: Replace this temporary fallback with shared loader data from `@/lib/restaurant-data-loader`.
              ingredients={[]}
              // TODO: Replace this temporary fallback with shared loader data from `@/lib/restaurant-data-loader`.
              addons={[]}
              // TODO: Replace this temporary fallback with shared loader data from `@/lib/restaurant-data-loader`.
              commonChanges={[]}
            />
          </main>
        </div>
        <CartPreviewDrawer />
      </RestaurantUiProvider>
    </RestaurantSearchProvider>
  );
}
