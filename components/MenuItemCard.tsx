"use client";

import { useId, useMemo, useState } from "react";
import type { MenuItem, RestaurantAddons } from "@/types/menu";
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
  const selectedVariant = variants?.find((variant) => variant.id === selectedVariantId);
  const nutrition = selectedVariant?.nutrition ?? item.nutrition;

  const calories = nutrition?.calories ?? 0;
  const protein = nutrition?.protein ?? 0;
  const carbs = nutrition?.carbs ?? 0;
  const fat = nutrition?.totalFat ?? 0;

  const rankText = typeof rankIndex === "number" ? pad2(rankIndex + 1) : null;

  const ratio = useMemo(() => {
    // only used when showRatio is enabled
    return Math.round(caloriesPerProtein({ calories, protein }));
  }, [calories, protein]);

  return (
    <li className={styles.card} 
        style={{
          border: isTopRanked
            ? "1.5px solid rgba(0,0,0,0.8)"
            : "1px solid rgba(0,0,0,0.12)",
        }}>
      {/* Whole header is clickable (tap to expand) */}
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`${id}-details`}
      >
        {/* Left image */}
        <div className={styles.leftMedia}>
          {item.image ? (
            <img className={styles.image} src={item.image} alt={item.name} />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
        </div>

        {/* Main content */}
        <div className={styles.content}>
          {/* Top block */}
          <div className={styles.topBlock}>
            {/* Rank + underline */}
            {rankText && (
              <div className={styles.rankWrap}>
                <div className={styles.rank}>{rankText}</div>
              </div>
            )}
            {/* Name */}
            <div className={styles.title}>{item.name}</div>
            {/* Calories */}
            <div className={styles.caloriesRow}>
              <div className={styles.calories}>{calories} calories</div>
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

          {/* Macros */}
          <div className={styles.macros}>
            {/* Optional ratio */}
            {showRatio && Number.isFinite(ratio) && (
              <div className={styles.macro}>
                <div className={`${styles.macroValue}`}>
                  {ratio}:1
                </div>
                <div className={styles.macroLabel}>RATIO</div>
              </div>
            )}
            {/* Protein */}
            <div className={styles.macro}>
              <div className={`${styles.macroValue} ${styles.protein}`}>
                {protein}g
              </div>
              <div className={styles.macroLabel}>PROTEIN</div>
            </div>
            {/* Carbs */}
            <div className={styles.macro}>
              <div className={`${styles.macroValue} ${styles.carbs}`}>
                {carbs}g
              </div>
              <div className={styles.macroLabel}>CARBS</div>
            </div>
            {/* Fat */}
            <div className={styles.macro}>
              <div className={`${styles.macroValue} ${styles.fat}`}>
                {fat}g
              </div>
              <div className={styles.macroLabel}>FAT</div>
            </div>
          </div>

        </div>

        {/* Plus/minus */}
        <div className={styles.expandIcon}>{open ? "−" : "+"}</div>
      </button>

      {/* Expand details */}
      <div className={`${styles.details} ${open ? styles.detailsOpen : ""}`}>
        <div className={styles.detailsInner}>
          <ItemDetailsPanel
            item={item}
            nutrition={nutrition}
            variants={variants}
            selectedVariantId={selectedVariantId}
            onSelectVariant={setSelectedVariantId}
            addons={addons}
          />
        </div>
      </div>

    </li>
  );
}
