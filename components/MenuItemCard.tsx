"use client";

import { useId, useMemo, useState } from "react";
import type { MenuItem } from "@/types/menu";
import styles from "./MenuItemCard.module.css";
import ItemDetailsPanel from "./ItemDetailsPanel";


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
}: {
  item: MenuItem;
  rankIndex?: number;
  showRatio?: boolean;
  isTopRanked?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const calories = item.nutrition?.calories ?? 0;
  const protein = item.nutrition?.protein ?? 0;
  const carbs = item.nutrition?.carbs ?? 0;
  const fat = item.nutrition?.totalFat ?? 0;

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
            <div className={styles.calories}>{calories} calories</div>
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
          <ItemDetailsPanel item={item} />
        </div>
      </div>

    </li>
  );
}
