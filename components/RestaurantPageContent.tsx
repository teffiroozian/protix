import Link from "next/link";
import type { ReactNode } from "react";
import restaurants from "@/app/data/index.json";
import RestaurantHeader from "@/components/RestaurantHeader";
import RestaurantView from "@/components/RestaurantView";
import RecentRestaurantTracker from "@/components/RecentRestaurantTracker";
import ScrollToTopOnMount from "@/components/ScrollToTopOnMount";
import { RestaurantSearchProvider } from "@/components/RestaurantSearchContext";
import { RestaurantUiProvider } from "@/components/RestaurantUiContext";
import CartPreviewDrawer from "@/components/CartPreviewDrawer";
import type { CommonChange, IngredientItem, MenuItem, RestaurantAddons } from "@/types/menu";

export async function loadRestaurantData(id: string) {
  const restaurant = restaurants.find((r) => r.id === id);
  if (!restaurant) return null;

  const menu = await import(`@/app/data/${restaurant.menuFile}`);
  const items = menu.default.items as MenuItem[];
  const ingredients = (menu.default.ingredients ?? []) as IngredientItem[];
  const addons = (menu.default.addons ?? {}) as RestaurantAddons;
  const commonChanges = (menu.default.commonChanges ?? []) as CommonChange[];

  return { restaurant, items, ingredients, addons, commonChanges };
}

export default function RestaurantPageContent({
  restaurantId,
  restaurantName,
  restaurantLogo,
  items,
  ingredients,
  addons,
  commonChanges,
  overlay,
}: {
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  items: MenuItem[];
  ingredients: IngredientItem[];
  addons: RestaurantAddons;
  commonChanges: CommonChange[];
  overlay?: ReactNode;
}) {
  return (
    <RestaurantSearchProvider>
      <RestaurantUiProvider>
        <div className="w-full pt-14">
          <div id="restaurant-hero" className="mt-6">
            <RestaurantHeader name={restaurantName} logo={restaurantLogo} restaurantSlug={restaurantId} />
          </div>

          <RecentRestaurantTracker restaurantId={restaurantId} />
          <ScrollToTopOnMount />

          <main className="mx-auto mt-6 w-full max-w-6xl px-6 pb-12">
            <RestaurantView
              restaurantId={restaurantId}
              restaurantName={restaurantName}
              restaurantLogo={restaurantLogo}
              items={items}
              ingredients={ingredients}
              addons={addons}
              commonChanges={commonChanges}
              autoScrollOnViewChange
            />
          </main>
        </div>
        <CartPreviewDrawer />
        {overlay}
      </RestaurantUiProvider>
    </RestaurantSearchProvider>
  );
}

export function NotFoundRestaurant() {
  return (
    <main style={{ maxWidth: 900, margin: "48px auto", padding: 16 }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        ← Back
      </Link>
      <h1 style={{ marginTop: 16 }}>Restaurant not found</h1>
    </main>
  );
}
