"use client";

import { useId, useMemo, useState } from "react";
import type { AddonOption, AddonRef, MenuItem, RestaurantAddons } from "@/types/menu";
import styles from "./MenuItemCard.module.css";
import ItemDetailsPanel from "./ItemDetailsPanel";
import VariantSelector from "./VariantSelector";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function caloriesPerProtein(item: { calories: number; protein: number }) {
  if (!item.protein) return Number.POSITIVE_INFINITY;
  return item.calories / item.protein;
}

const emptyAddon: AddonOption = {
  name: "None",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  image: "none",
};

export default function MenuItemCard({
  item,
  rankIndex,
  showRatio = false,
  isTopRanked,
  addons,
}: {
  item: MenuItem;
  rankIndex?: number;
  showRatio?: boolean;
  isTopRanked?: boolean;
  addons?: RestaurantAddons;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const variants = item.variants?.length ? item.variants : null;
  const defaultVariantId = useMemo(() => {
    if (!variants) return "";
    if (item.defaultVariantId && variants.some((variant) => variant.id === item.defaultVariantId)) {
      return item.defaultVariantId;
    }
    const flaggedDefault = variants.find((variant) => variant.isDefault);
    return flaggedDefault?.id ?? variants[0]?.id ?? "";
  }, [item.defaultVariantId, variants]);
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  const [selectedAddons, setSelectedAddons] = useState<Partial<Record<AddonRef, AddonOption>>>({});
  const selectedVariant = variants?.find((variant) => variant.id === selectedVariantId);
  const baseNutrition = selectedVariant?.nutrition ?? item.nutrition;

  const addonTotals = useMemo(
    () =>
      Object.values(selectedAddons).reduce(
        (sum, addon) => ({
          calories: sum.calories + (addon?.calories ?? 0),
          protein: sum.protein + (addon?.protein ?? 0),
          carbs: sum.carbs + (addon?.carbs ?? 0),
          fat: sum.fat + (addon?.fat ?? 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [selectedAddons]
  );

  const hasActiveAddon = useMemo(
    () => Object.values(selectedAddons).some((addon) => addon && addon.name !== "None"),
    [selectedAddons]
  );

  const nutrition = {
    ...baseNutrition,
    calories: baseNutrition.calories + addonTotals.calories,
    protein: baseNutrition.protein + addonTotals.protein,
    carbs: baseNutrition.carbs + addonTotals.carbs,
    totalFat: baseNutrition.totalFat + addonTotals.fat,
  };

  const calories = nutrition.calories;
  const protein = nutrition.protein;
  const carbs = nutrition.carbs;
  const fat = nutrition.totalFat;

  const rankText = typeof rankIndex === "number" ? pad2(rankIndex + 1) : null;

  const ratio = useMemo(() => {
    return Math.round(caloriesPerProtein({ calories, protein }));
  }, [calories, protein]);

  return (
    <li
      className={styles.card}
      style={{
        border: isTopRanked ? "1.5px solid rgba(0,0,0,0.8)" : "1px solid rgba(0,0,0,0.12)",
      }}
    >
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`${id}-details`}
      >
        <div className={styles.leftMedia}>
          {item.image ? (
            <img className={styles.image} src={item.image} alt={item.name} />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.topBlock}>
            {rankText && (
              <div className={styles.rankWrap}>
                <div className={styles.rank}>{rankText}</div>
              </div>
            )}
            <div className={styles.title}>{item.name}</div>
            <div className={styles.caloriesRow}>
              <div className={styles.caloriesWrap}>
                <div className={styles.calories}>{calories} calories</div>
                {hasActiveAddon ? (
                  <span className={styles.macroDelta}>+{addonTotals.calories}</span>
                ) : null}
              </div>
              {variants ? (
                <div
                  className={styles.variantSelect}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <div className={styles.divider} />
                  <VariantSelector
                    variants={variants}
                    selectedId={selectedVariantId}
                    onChange={setSelectedVariantId}
                    ariaLabel={`${item.name} portion size`}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.macros}>
            {showRatio && Number.isFinite(ratio) && (
              <div className={styles.macro}>
                <div className={`${styles.macroValue}`}>{ratio}:1</div>
                <div className={styles.macroLabel}>RATIO</div>
              </div>
            )}
            <div className={styles.macro}>
              <div className={styles.macroValueWrap}>
                <div className={`${styles.macroValue} ${styles.protein}`}>{protein}g</div>
                {hasActiveAddon ? <span className={styles.macroDelta}>+{addonTotals.protein}</span> : null}
              </div>
              <div className={styles.macroLabel}>PROTEIN</div>
            </div>
            <div className={styles.macro}>
              <div className={styles.macroValueWrap}>
                <div className={`${styles.macroValue} ${styles.carbs}`}>{carbs}g</div>
                {hasActiveAddon ? <span className={styles.macroDelta}>+{addonTotals.carbs}</span> : null}
              </div>
              <div className={styles.macroLabel}>CARBS</div>
            </div>
            <div className={styles.macro}>
              <div className={styles.macroValueWrap}>
                <div className={`${styles.macroValue} ${styles.fat}`}>{fat}g</div>
                {hasActiveAddon ? <span className={styles.macroDelta}>+{addonTotals.fat}</span> : null}
              </div>
              <div className={styles.macroLabel}>FAT</div>
            </div>
          </div>
        </div>

        <div className={styles.expandIcon}>{open ? "−" : "+"}</div>
      </button>

      <div className={`${styles.details} ${open ? styles.detailsOpen : ""}`}>
        <div className={styles.detailsInner}>
          <ItemDetailsPanel
            item={item}
            nutrition={nutrition}
            variants={variants}
            selectedVariantId={selectedVariantId}
            onSelectVariant={setSelectedVariantId}
            addons={addons}
            selectedAddons={selectedAddons}
            onSelectAddon={(ref, addon) => setSelectedAddons((prev) => ({ ...prev, [ref]: addon ?? emptyAddon }))}
            addonTotals={addonTotals}
            showAddonDeltas={hasActiveAddon}
          />
        </div>
      </div>
    </li>
  );
}
