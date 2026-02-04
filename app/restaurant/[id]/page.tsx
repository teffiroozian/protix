import Link from "next/link";
import Image from "next/image";
import restaurants from "../../data/index.json";
import RankingList from "@/components/RankingList";
import GuidedStickyNav from "@/components/GuidedStickyNav";
import type { MenuItem } from "@/types/menu";

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
  const items = menu.default.items;

  const highestProtein = topByProtein(items);
  const bestCalorieProteinRatio = topByCalorieProteinRatio(items);
  const lowestCalorieItems = lowestCalories(items);

  return (
    // ✅ Full width wrapper (this is the single parent React needs)
    <div style={{ width: "100%" }}>
      {/* ✅ Full-width sticky nav */}
      <GuidedStickyNav
        restaurantName={restaurant.name}
        restaurantLogo={restaurant.logo}
        containerMaxWidth={900}
      />

      {/* ✅ Centered page content container */}
      <main style={{ maxWidth: 900, margin: "48px auto", padding: 16 }}>
        {/* Non-sticky page header content */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              position: "relative",
              width: 60,
              height: 60,
              marginTop: 24,
              marginBottom: 6,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Image
              src={restaurant.logo}
              alt={`${restaurant.name} logo`}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 800, marginTop: 8 }}>
            {restaurant.name}
          </h1>

          <p style={{ marginTop: 8, opacity: 0.8 }}>
            Find the best & smartest high-protein items on the menu.
          </p>
        </div>

        {/* Featured section goes here */}
        <section id="featured" style={{ marginTop: 80, scrollMarginTop: 140 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>
            Featured Items
          </h2>

          <p style={{ marginTop: 8, opacity: 0.8, marginBottom: 20 }}>
            Fast picks based on protein, calories, and efficiency.
          </p>

        </section>

        {/* Highest Protein */}
        <section id="high-protein" style={{ marginTop: 80, scrollMarginTop: 140 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>
            Highest Protein Items
          </h2>

          <p style={{ marginTop: 8, opacity: 0.8, marginBottom: 20 }}>
            Items with the most protein per serving size.
          </p>

          <RankingList items={highestProtein} highlightTop={3} />
        </section>

        {/* Best Protein Ratio */}
        <section
          id="best-protein-ratio"
          style={{ marginTop: 80, scrollMarginTop: 140 }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Best Protein Ratio</h2>

          <p style={{ marginTop: 6, opacity: 0.75 }}>
            Ranked by protein efficiency (more protein per calorie).
          </p>

          <RankingList items={bestCalorieProteinRatio} highlightTop={3} showRatio />
        </section>

        {/* Lowest Calories */}
        <section
          id="lowest-calorie"
          style={{ marginTop: 80, scrollMarginTop: 140 }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Lowest Calorie Items</h2>

          <p style={{ marginTop: 6, opacity: 0.75 }}>
            Lowest calorie foods on the menu.
          </p>

          <RankingList items={lowestCalorieItems} highlightTop={3} />
        </section>
      </main>
    </div>
  );
}
