import Link from "next/link";
import Image from "next/image";
import restaurants from "../../data/index.json";
import RankingList from "@/components/RankingList";
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
        <main style={{ maxWidth: 900, margin: "48px auto", padding: 16 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
                ← Back
            </Link>

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
                High-protein menu breakdown
            </p>

            {/* Highest Protein */}
            <section style={{ marginTop: 80 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                    Highest Protein Items
                </h2>
                <h3 style={{ marginTop: 6, fontSize: 20, fontWeight: 700 }}>
                    Hello
                </h3>
                <p style={{ marginTop: 6, opacity: 0.75 }}>
                    Sorted by protein grams (highest first).
                </p>

                <RankingList items={highestProtein} highlightTop={3} />

            </section>

            {/* Best Calorie : Protein Ratio */}
            <section style={{ marginTop: 80 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                    Best Calorie:Protein Ratio
                </h2>
                <h3 style={{ marginTop: 6, fontSize: 20, fontWeight: 700 }}>
                    Hello
                </h3>
                <p style={{ marginTop: 6, opacity: 0.75 }}>
                    Sorted by calories per 1g protein (lowest first).
                </p>

                <RankingList items={bestCalorieProteinRatio} highlightTop={3} showRatio />

            </section>

            {/* Lowest Calories */}
            <section style={{ marginTop: 80 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                    Lowest Calorie Items
                </h2>
                <h3 style={{ marginTop: 6, fontSize: 20, fontWeight: 700 }}>
                    Hello
                </h3>
                <p style={{ marginTop: 6, opacity: 0.75 }}>
                    Sorted by calories (lowest first).
                </p>

                <RankingList items={lowestCalorieItems} highlightTop={3} />

            </section>
        </main>
    );
}
