"use client";

import { useId, useMemo, useState } from "react";
import type { AddonOption, AddonRef, CommonChange, MacroDelta, MenuItem, RestaurantAddons } from "@/types/menu";
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

function formatDelta(value: number) {
  return `${value >= 0 ? "+" : ""}${value}`;
}


function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}

function getApplicableCommonChanges(item: MenuItem, commonChanges?: CommonChange[]) {
  if (!commonChanges || commonChanges.length === 0) return [];
  const itemCategory = normalizeCategory(item.category || "");
  return commonChanges.filter((change) => {
    const categories = change.appliesTo?.categories;
    if (!categories || categories.length === 0) return false;
    return categories.some((category) => normalizeCategory(category) === itemCategory);
  });
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
  commonChanges,
}: {
  item: MenuItem;
  rankIndex?: number;
  showRatio?: boolean;
  isTopRanked?: boolean;
  addons?: RestaurantAddons;
  commonChanges?: CommonChange[];
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
  const [selectedCommonChangeIds, setSelectedCommonChangeIds] = useState<string[]>([]);
  const selectedVariant = variants?.find((variant) => variant.id === selectedVariantId);
  const baseNutrition = selectedVariant?.nutrition ?? item.nutrition;
  const applicableCommonChanges = useMemo(
    () => getApplicableCommonChanges(item, commonChanges),
    [item, commonChanges]
  );

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

  const commonChangeTotals = useMemo(
    () =>
      applicableCommonChanges.reduce<MacroDelta>(
        (sum, change) => {
          if (!selectedCommonChangeIds.includes(change.id)) return sum;
          return {
            calories: sum.calories + change.delta.calories,
            protein: sum.protein + change.delta.protein,
            carbs: sum.carbs + change.delta.carbs,
            fat: sum.fat + change.delta.fat,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [applicableCommonChanges, selectedCommonChangeIds]
  );

  const customizationTotals = useMemo(
    () => ({
      calories: addonTotals.calories + commonChangeTotals.calories,
      protein: addonTotals.protein + commonChangeTotals.protein,
      carbs: addonTotals.carbs + commonChangeTotals.carbs,
      fat: addonTotals.fat + commonChangeTotals.fat,
    }),
    [addonTotals, commonChangeTotals]
  );

  const hasActiveCustomization = useMemo(
    () =>
      Object.values(selectedAddons).some((addon) => addon && addon.name !== "None") ||
      selectedCommonChangeIds.length > 0,
    [selectedAddons, selectedCommonChangeIds]
  );

  const nutrition = {
    ...baseNutrition,
    calories: baseNutrition.calories + customizationTotals.calories,
    protein: baseNutrition.protein + customizationTotals.protein,
    carbs: baseNutrition.carbs + customizationTotals.carbs,
    totalFat: baseNutrition.totalFat + customizationTotals.fat,
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
                {hasActiveCustomization ? (
                  <span className={styles.macroDelta}>{formatDelta(customizationTotals.calories)}</span>
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
                {hasActiveCustomization ? <span className={styles.macroDelta}>{formatDelta(customizationTotals.protein)}</span> : null}
              </div>
              <div className={styles.macroLabel}>PROTEIN</div>
            </div>
            <div className={styles.macro}>
              <div className={styles.macroValueWrap}>
                <div className={`${styles.macroValue} ${styles.carbs}`}>{carbs}g</div>
                {hasActiveCustomization ? <span className={styles.macroDelta}>{formatDelta(customizationTotals.carbs)}</span> : null}
              </div>
              <div className={styles.macroLabel}>CARBS</div>
            </div>
            <div className={styles.macro}>
              <div className={styles.macroValueWrap}>
                <div className={`${styles.macroValue} ${styles.fat}`}>{fat}g</div>
                {hasActiveCustomization ? <span className={styles.macroDelta}>{formatDelta(customizationTotals.fat)}</span> : null}
              </div>
              <div className={styles.macroLabel}>FAT</div>
            </div>
          </div>
        </div>

        <div className={`${styles.expandIcon} ${open ? styles.expandIconOpen : ""}`}>+</div>
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
            commonChanges={applicableCommonChanges}
            selectedCommonChangeIds={selectedCommonChangeIds}
            onToggleCommonChange={(changeId) =>
              setSelectedCommonChangeIds((prev) =>
                prev.includes(changeId)
                  ? prev.filter((id) => id !== changeId)
                  : [...prev, changeId]
              )
            }
            customizationTotals={customizationTotals}
            showCustomizationDeltas={hasActiveCustomization}
          />
        </div>
      </div>
    </li>
  );
}
