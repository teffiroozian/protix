import styles from "./ItemDetails.module.css";
import type {
  AddonOption,
  AddonRef,
  ItemVariant,
  MenuItem,
  Nutrition,
  RestaurantAddons,
} from "@/types/menu";

function format(n?: number, suffix = "") {
  return n === undefined || n === null ? "—" : `${n}${suffix}`;
}

function calToProteinRatio(calories: number, protein: number) {
  if (!protein) return "—";
  return `${Math.round(calories / protein)}:1`;
}

const addonSectionTitles: Record<AddonRef, string> = {
  sauces: "Sauces",
  dressings: "Dressings",
};

const rowScrollPx = 240;

function sortByCalories(addons: AddonOption[]) {
  return [...addons].sort((a, b) => a.calories - b.calories);
}

function withNoneOption(addons: AddonOption[]) {
  return [{ name: "None", calories: 0, image: "none" }, ...addons];
}

function scrollAddonRow(ref: AddonRef, direction: "left" | "right") {
  const row = document.getElementById(`addon-row-${ref}`);
  if (!row) return;
  row.scrollBy({
    left: direction === "left" ? -rowScrollPx : rowScrollPx,
    behavior: "smooth",
  });
}

export default function ItemDetailsPanel({
  item,
  nutrition,
  variants,
  selectedVariantId,
  onSelectVariant,
  addons,
}: {
  item: MenuItem;
  nutrition: Nutrition;
  variants?: ItemVariant[] | null;
  selectedVariantId?: string;
  onSelectVariant?: (id: string) => void;
  addons?: RestaurantAddons;
}) {
  const n = nutrition;
  const addonRefs = item.addonRefs ?? [];
  const availableAddonSections = addonRefs
    .map((ref) => {
      const list = addons?.[ref];
      if (!list || list.length === 0) return null;
      return {
        ref,
        title: addonSectionTitles[ref],
        addons: withNoneOption(sortByCalories(list)),
      };
    })
    .filter((section): section is { ref: AddonRef; title: string; addons: AddonOption[] } =>
      section !== null
    );

  return (
    <div className={styles.wrapper}>
      {availableAddonSections.length > 0 ? (
        <section className={styles.addonsCard}>
          {/* addOn Card */}
          <div className={styles.addonsContent}>
            {availableAddonSections.map((section) => (
              <div key={section.ref} className={styles.addonGroup}>
                {/* addOn Title Group */}
                <div className={styles.addonGroupHeader}>
                  <h3 className={styles.addonGroupTitle}>{section.title}</h3>
                  <div className={styles.addonScrollButtons}>
                    <button
                      type="button"
                      className={styles.addonArrowButton}
                      aria-label={`Scroll ${section.title} left`}
                      onClick={() => scrollAddonRow(section.ref, "left")}
                    >
                      &lt;
                    </button>
                    <button
                      type="button"
                      className={styles.addonArrowButton}
                      aria-label={`Scroll ${section.title} right`}
                      onClick={() => scrollAddonRow(section.ref, "right")}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
                <ul id={`addon-row-${section.ref}`} className={styles.addonList}>
                  {section.addons.map((addon) => (
                    <li key={`${section.ref}-${addon.name}`} className={styles.addonItem}>
                      {addon.image === "none" ? (
                        <div className={`${styles.addonImage} ${styles.addonImageNone}`}>✕</div>
                      ) : addon.image ? (
                        <div
                          className={styles.addonImage}
                          style={{ backgroundImage: `url(${addon.image})` }}
                        />
                      ) : (
                        <div className={styles.addonImage} />
                      )}
                      <div className={styles.addonName}>{addon.name}</div>
                      <div className={styles.addonCalories}>+{addon.calories} Cal</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Left: Nutrition label */}
      <section className={styles.labelCard}>
        <div className={styles.amountPerServing}>Amount per serving</div>

        <div className={styles.caloriesRow}>
          <div className={styles.caloriesText}>Calories</div>
          <div className={styles.caloriesValue}>{n.calories}</div>
        </div>

        <div className={styles.thickRule} />

        <div className={styles.row}>
          <div className={styles.rowTitle}>Total Fat</div>
          <div className={styles.rowValue}>{format(n.totalFat, "g")}</div>
        </div>

        <div className={styles.subRow}>
          <div className={styles.subTitle}>Sat Fat</div>
          <div className={styles.subValue}>{format(n.satFat, "g")}</div>
        </div>

        <div className={styles.subRow}>
          <div className={styles.subTitle}>Trans Fat</div>
          <div className={styles.subValue}>{format(n.transFat, "g")}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.rowTitle}>Cholesterol</div>
          <div className={styles.rowValue}>{format(n.cholesterol, "mg")}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.rowTitle}>Sodium</div>
          <div className={styles.rowValue}>{format(n.sodium, "mg")}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.rowTitle}>Carbohydrates</div>
          <div className={styles.rowValue}>{format(n.carbs, "g")}</div>
        </div>

        <div className={styles.subRow}>
          <div className={styles.subTitle}>Fiber</div>
          <div className={styles.subValue}>{format(n.fiber, "g")}</div>
        </div>

        <div className={styles.subRow}>
          <div className={styles.subTitle}>Sugars</div>
          <div className={styles.subValue}>{format(n.sugars, "g")}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.rowTitle}>Protein</div>
          <div className={styles.rowValue}>{format(n.protein, "g")}</div>
        </div>

        <div className={styles.footerText}>
          2,000 calories a day is used for general nutrition advice, but calorie needs
          vary. Values may vary by location, serving size, and customizations.
        </div>
      </section>

      {/* Right: Details */}
      <section className={styles.detailsCard}>
        <div className={styles.detailsTitle}>Details</div>

        <div className={styles.detailsRow}>
          <div className={styles.detailsLabel}>Category</div>
          <div className={styles.pill}>{item.category ?? "—"}</div>
        </div>

        <div className={styles.detailsDivider} />

        <div className={styles.detailsRow}>
          <div className={styles.detailsLabel}>Cal to Protein Ratio</div>
          <div className={styles.detailsValue}>
            {calToProteinRatio(n.calories, n.protein)}
          </div>
        </div>

        {variants && variants.length > 0 ? (
          <>
            <div className={styles.detailsDivider} />
            <div className={`${styles.detailsRow} ${styles.portionRow}`}>
              <div className={styles.detailsLabel}>Portion</div>
              <div className={styles.portionOptions}>
                {variants.map((variant) => {
                  const isActive = variant.id === selectedVariantId;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      className={`${styles.portionButton} ${isActive ? styles.portionButtonActive : ""}`}
                      onClick={() => onSelectVariant?.(variant.id)}
                    >
                      {variant.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}

        <div className={styles.detailsDivider} />

        {/* Optional extra line if you want */}
        {item.restaurant ? (
          <>
            <div className={styles.detailsDivider} />
            <div className={styles.detailsRow}>
              <div className={styles.detailsLabel}>Restaurant</div>
              <div className={styles.detailsValue}>{item.restaurant}</div>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
