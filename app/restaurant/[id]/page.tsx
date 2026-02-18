import Link from "next/link";
import restaurants from "../../data/index.json";
import RestaurantHeader from "@/components/RestaurantHeader";
import RestaurantView from "@/components/RestaurantView";
import RecentRestaurantTracker from "@/components/RecentRestaurantTracker";
import ScrollToTopOnMount from "@/components/ScrollToTopOnMount";
import type { CommonChange, MenuItem, RestaurantAddons } from "@/types/menu";

// calories per 1g protein (bigger number = more calories for each gram of protein)
function caloriesPerProtein(item: MenuItem) {
  if (!item.nutrition.protein) return Number.POSITIVE_INFINITY;
  return item.nutrition.calories / item.nutrition.protein;
}

function topByProtein(items: MenuItem[]) {
  return [...items].sort((a, b) => b.nutrition.protein - a.nutrition.protein);
}

function topByCalorieProteinRatio(items: MenuItem[]) {
  return [...items].sort((a, b) => caloriesPerProtein(a) - caloriesPerProtein(b));
}

function lowestCalories(items: MenuItem[]) {
  return [...items].sort((a, b) => a.nutrition.calories - b.nutrition.calories);
}

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
        <Link href="/" style={{ textDecoration: "none" }}>
          ← Back
        </Link>
        <h1 style={{ marginTop: 16 }}>Restaurant not found</h1>
      </main>
    );
  }

  const menu = await import(`../../data/${restaurant.menuFile}`);
  const items = menu.default.items as MenuItem[];
  const addons = (menu.default.addons ?? {}) as RestaurantAddons;
  const commonChanges = (menu.default.commonChanges ?? []) as CommonChange[];

  const highestProtein = topByProtein(items);
  const bestCalorieProteinRatio = topByCalorieProteinRatio(items);
  const lowestCalorieItems = lowestCalories(items);

  return (
    <div style={{ width: "100%" }}>
      <div id="restaurant-hero" className="mt-6">
        <RestaurantHeader
          name={restaurant.name}
          logo={restaurant.logo}
          restaurantSlug={restaurant.id}
        />
      </div>

      <RecentRestaurantTracker restaurantId={restaurant.id} />
      <ScrollToTopOnMount />

      <main style={{ maxWidth: 900, margin: "24px auto 48px", padding: 16 }}>
        <RestaurantView
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          restaurantLogo={restaurant.logo}
          items={items}
          highestProtein={highestProtein}
          bestCalorieProteinRatio={bestCalorieProteinRatio}
          lowestCalorieItems={lowestCalorieItems}
          addons={addons}
          commonChanges={commonChanges}
          autoScrollOnViewChange
        />
      </main>
    </div>
  );
}
