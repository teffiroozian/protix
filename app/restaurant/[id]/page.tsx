import Link from "next/link";
import restaurants from "../../data/index.json";
import RestaurantHeader from "@/components/RestaurantHeader";
import RestaurantView from "@/components/RestaurantView";
import RecentRestaurantTracker from "@/components/RecentRestaurantTracker";
import ScrollToTopOnMount from "@/components/ScrollToTopOnMount";
import { RestaurantSearchProvider } from "@/components/RestaurantSearchContext";
import { RestaurantUiProvider } from "@/components/RestaurantUiContext";
import CartPreviewDrawer from "@/components/CartPreviewDrawer";
import type { CommonChange, IngredientItem, MenuItem, RestaurantAddons } from "@/types/menu";

export default async function RestaurantPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { id } = await params;
  const { view } = await searchParams;

  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <main style={{ maxWidth: 900, margin: "48px auto", padding: 16 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          ← Back
        </Link>
        <h1 style={{ marginTop: 16 }}>Restaurant not found</h1>
      </main>
    );
  }

  const menu = await import(`../../data/${restaurant.menuFile}`);
  const items = menu.default.items as MenuItem[];
  const ingredients = (menu.default.ingredients ?? []) as IngredientItem[];
  const addons = (menu.default.addons ?? {}) as RestaurantAddons;
  const commonChanges = (menu.default.commonChanges ?? []) as CommonChange[];

  const initialViewMode: "menu" | "ingredients" =
    view === "ingredients" ? "ingredients" : "menu";

  return (
    <RestaurantSearchProvider>
      <RestaurantUiProvider>
        <div className="w-full pt-14">
          <div id="restaurant-hero" className="mt-6">
            <RestaurantHeader
              name={restaurant.name}
              logo={restaurant.logo}
              restaurantSlug={restaurant.id}
            />
          </div>

          <RecentRestaurantTracker restaurantId={restaurant.id} />
          <ScrollToTopOnMount />

          <main className="mx-auto mt-6 w-full max-w-6xl px-6 pb-12">
            <RestaurantView
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              restaurantLogo={restaurant.logo}
              items={items}
              ingredients={ingredients}
              addons={addons}
              commonChanges={commonChanges}
              initialViewMode={initialViewMode}
              autoScrollOnViewChange
            />
          </main>
        </div>
        <CartPreviewDrawer />
      </RestaurantUiProvider>
    </RestaurantSearchProvider>
  );
}
