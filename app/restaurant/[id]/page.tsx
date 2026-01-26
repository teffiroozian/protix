import Link from "next/link";
import Image from "next/image";
import restaurants from "../../data/index.json";

type MenuItem = {
    name: string;
    calories: number;
    protein: number;
};

// calories per 1g protein (bigger number = more calories for each gram of protein)
function caloriesPerProtein(item: MenuItem) {
    if (!item.protein) return Number.POSITIVE_INFINITY;
    return item.calories / item.protein;
}

function topByProtein(items: MenuItem[], n = 5) {
    return [...items].sort((a, b) => b.protein - a.protein).slice(0, n);
}

function topByCalorieProteinRatio(items: MenuItem[], n = 5) {
    return [...items]
        .sort((a, b) => caloriesPerProtein(b) - caloriesPerProtein(a))
        .slice(0, n);
}

function lowestCalories(items: MenuItem[], n = 5) {
    return [...items].sort((a, b) => a.calories - b.calories).slice(0, n);
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

    const highestProtein = topByProtein(items, 5);
    const highestCalorieProteinRatio = topByCalorieProteinRatio(items, 5);
    const lowestCalorieItems = lowestCalories(items, 5);

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

            <h1 style={{ fontSize: 40, fontWeight: 800, marginTop: 16 }}>
                {restaurant.name}
            </h1>

            <p style={{ marginTop: 8, opacity: 0.8 }}>
                MVP page — later we’ll add goal filters and “top picks.”
            </p>

            {/* Highest Protein */}
            <section style={{ marginTop: 80 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                    Highest Protein Items
                </h2>
                <p style={{ marginTop: 6, opacity: 0.75 }}>
                    Sorted by protein grams (highest first).
                </p>

                <ul
                    style={{
                        marginTop: 12,
                        padding: 0,
                        display: "grid",
                        gap: 10,
                    }}
                >
                    {highestProtein.map((item) => (
                        <li
                            key={`protein-${item.name}`}
                            style={{
                                listStyle: "none",
                                border: "1px solid #eee",
                                borderRadius: 12,
                                padding: 14,
                            }}
                        >
                            <div style={{ fontWeight: 700 }}>{item.name}</div>
                            <div style={{ marginTop: 6, opacity: 0.8 }}>
                                {item.protein}g protein • {item.calories}{" "}
                                calories
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Highest Calorie : Protein Ratio */}
            <section style={{ marginTop: 80 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                    Highest Calorie:Protein Ratio
                </h2>
                <p style={{ marginTop: 6, opacity: 0.75 }}>
                    Sorted by calories per 1g protein (highest first).
                </p>

                <ul
                    style={{
                        marginTop: 12,
                        padding: 0,
                        display: "grid",
                        gap: 10,
                    }}
                >
                    {highestCalorieProteinRatio.map((item) => (
                        <li
                            key={`ratio-${item.name}`}
                            style={{
                                listStyle: "none",
                                border: "1px solid #eee",
                                borderRadius: 12,
                                padding: 14,
                            }}
                        >
                            <div style={{ fontWeight: 700 }}>{item.name}</div>
                            <div style={{ marginTop: 6, opacity: 0.8 }}>
                                {item.protein}g protein • {item.calories}{" "}
                                calories
                            </div>
                            <div
                                style={{
                                    marginTop: 6,
                                    opacity: 0.7,
                                    fontSize: 14,
                                }}
                            >
                                Ratio: {caloriesPerProtein(item).toFixed(1)}{" "}
                                cals / 1g protein
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Lowest Calories */}
            <section style={{ marginTop: 80 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800 }}>
                    Lowest Calorie Items
                </h2>
                <p style={{ marginTop: 6, opacity: 0.75 }}>
                    Sorted by calories (lowest first).
                </p>

                <ul
                    style={{
                        marginTop: 12,
                        padding: 0,
                        display: "grid",
                        gap: 10,
                    }}
                >
                    {lowestCalorieItems.map((item) => (
                        <li
                            key={`lowcal-${item.name}`}
                            style={{
                                listStyle: "none",
                                border: "1px solid #eee",
                                borderRadius: 12,
                                padding: 14,
                            }}
                        >
                            <div style={{ fontWeight: 700 }}>{item.name}</div>
                            <div style={{ marginTop: 6, opacity: 0.8 }}>
                                {item.protein}g protein • {item.calories}{" "}
                                calories
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
