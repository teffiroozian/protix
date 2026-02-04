import styles from "./MenuItemCard.module.css";
import type { MenuItem } from "@/types/menu";

interface FeaturedGridProps {
    items: MenuItem[];
}

/**
 * Helper to calculate the efficiency ratio.
 * Lower number = more protein per calorie.
 */
function caloriesPerProtein(item: MenuItem) {
    if (!item.nutrition.protein) return Number.POSITIVE_INFINITY;
    return item.nutrition.calories / item.nutrition.protein;
}

export default function FeaturedGrid({ items }: FeaturedGridProps) {
    // 1. Highest Protein: Sort descending by protein gram count
    const highestProteinItem = [...items].sort(
        (a, b) => b.nutrition.protein - a.nutrition.protein
    )[0];

    // 2. Best Protein Ratio: Sort ascending by calories-per-gram-of-protein
    const bestRatioItem = [...items].sort(
        (a, b) => caloriesPerProtein(a) - caloriesPerProtein(b)
    )[0];

    // 3. Best Overall: Using the best ratio as the logical "Best Overall" choice
    const bestOverallItem = bestRatioItem;

    const cards = [
        { label: "Best overall", item: bestOverallItem },
        { label: "Best protein ratio", item: bestRatioItem },
        { label: "Highest protein", item: highestProteinItem },
    ];

    return (
        /* featuredContainer handles the 3-column layout */
        <div className={styles.featuredContainer}>
            {cards.map((card, index) => (
                /* featuredCard handles the vertical stacking */
                <div key={index} className={`${styles.card} ${styles.featuredCard}`}>

                    {/* Image Section */}
                    <div className={styles.leftMedia}>
                        <img
                            src={card.item.image}
                            alt={card.item.name}
                            className={`${styles.image} ${styles.featuredImage}`}
                        />
                    </div>

                    {/* Content Section - now with flex: 1 to fill space */}
                    <div className={styles.featuredContent}>
                        <div className={styles.topBlock}>
                            <div>
                                <span className={styles.rank}>{card.label}</span>
                            </div>
                            <h3 className={styles.title} style={{ fontSize: 28, marginTop: '12px' }}>
                                {card.item.name} 
                            </h3>
                            <div className={styles.calories} style={{ marginTop: '4px' }}>
                                {card.item.nutrition.calories} calories
                            </div>
                        </div>

                        {/* Macros Section - now with margin-top: auto */}
                        <div className={`${styles.macros} ${styles.featuredMacros}`}>
                            <div className={styles.macro}>
                                <div className={`${styles.macroValue} ${styles.protein}`}>
                                    {card.item.nutrition.protein}g
                                </div>
                                <div className={styles.macroLabel}>PROTEIN</div>
                            </div>

                            <div className={styles.macro}>
                                <div className={`${styles.macroValue} ${styles.carbs}`}>
                                    {card.item.nutrition.carbs}g
                                </div>
                                <div className={styles.macroLabel}>CARBS</div>
                            </div>

                            <div className={styles.macro}>
                                <div className={`${styles.macroValue} ${styles.fat}`}>
                                    {card.item.nutrition.totalFat}g
                                </div>
                                <div className={styles.macroLabel}>FAT</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}