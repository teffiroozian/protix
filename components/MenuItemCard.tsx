"use client";

import { useId, useState } from "react";
import type { MenuItem } from "@/types/menu";
import NutritionLabel from "@/components/NutritionLabel";
import styles from "./MenuItemCard.module.css";



function caloriesPerProtein(item: { calories: number; protein: number }) {
  if (!item.protein) return Number.POSITIVE_INFINITY;
  return item.calories / item.protein;
}

export default function MenuItemCard({
  item,
  showRatio = false,
  rankIndex,
  highlightTop = 0,
}: {
  item: MenuItem;
  showRatio?: boolean;
  rankIndex?: number;
  highlightTop?: number;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const protein = item.nutrition?.protein ?? 0;
  const carbs = item.nutrition?.carbs ?? 0;
  const fat = item.nutrition?.totalFat ?? 0;

  const isTop = typeof rankIndex === "number" && rankIndex < highlightTop;
  const badgeText =
    typeof rankIndex === "number" ? `${rankIndex + 1}` : null;

  const ratio = Math.round(caloriesPerProtein(item.nutrition));

  return (
    <li
      style={{
        listStyle: "none",
        border: isTop
          ? "1px solid rgba(255,255,255,0.35)"
          : "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        overflow: "hidden",
        background: isTop ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
        boxShadow: isTop ? "0 10px 30px rgba(0,0,0,0.35)" : "none",
      }}
    >
      {/* Clickable header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`${id}-details`}
        style={{
          width: "100%",
          textAlign: "left",
          padding: 14,
          background: "#ffffff",
          border: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 14,
          }}
        >
          {/* Image */}
          {item.image && (
            <div
              style={{
                position: "relative",
                width: 200,
                height: 200,
                borderRadius: 12,
                overflow: "hidden",
                background: "#efefef",
                border: "1px solid rgba(255,255,255,0.1)",
                flex: "0 0 auto",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          {/* Info content */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: 6,
            paddingBottom: 6
          }}>
            {/* Text content */}
            <div>
              {/* Ranking number */}
              {badgeText && (
                <div className="rankWrap">
                  <div className="rankNumber">{badgeText}</div>
                </div>
              )}


              {/* Item name */}
              <div style={{ fontWeight: 800, fontSize: 24 }}>{item.name}</div>

              {/* Calories */}
              <div style={{ fontSize: 14, fontWeight: 800, opacity: 0.6, }} >
                {item.nutrition.calories} calories
              </div>


              {/* Calorie to protein ratio */}
              {showRatio && Number.isFinite(ratio) && (
                <div style={{ marginTop: 6, opacity: 0.7, fontSize: 14 }}>
                  Ratio: {ratio}:1 (1g protein per {ratio} cals)
                </div>

              )}
            </div>
            {/* Macros */}
            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 32,
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              {/* Protein */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <img src="/icons/protein.png" alt="Protein" width={32} height={32} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
                    {protein}g
                  </div>
                  <div style={{ opacity: 0.85, fontSize: 14, fontWeight: 600 }}>protein</div>
                </div>
              </div>

              {/* Carbs */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <img src="/icons/carbs.png" alt="Carbs" width={32} height={32} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
                    {carbs}g
                  </div>
                  <div style={{ opacity: 0.85, fontSize: 14, fontWeight: 600 }}>carbs</div>
                </div>
              </div>

              {/* Fat */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <img src="/icons/fat.png" alt="Fat" width={32} height={32} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
                    {fat}g
                  </div>
                  <div style={{ opacity: 0.85, fontSize: 14, fontWeight: 600 }}>fat</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ opacity: 0.75, fontSize: 18, lineHeight: 1 }}>
          {open ? "−" : "+"}
        </div>
      </button>

      {/* Expandable details */}
      <div
        id={`${id}-details`}
        onClick={() => setOpen(false)}
        style={{
          maxHeight: open ? 700 : 0,
          transition: "max-height 400ms ease",
          overflow: "hidden",
          background: "rgba(0,0,0,0.02)",
          cursor: "pointer",
        }}
      >
        <div style={{ padding: "12px 14px", borderTop: "1px solid #eee" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              alignItems: "start",
            }}
          >
            {/* LEFT: Nutrition label */}
            <NutritionLabel nutrition={item.nutrition} />

            {/* RIGHT: extra info */}
            <div
              style={{
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 12,
                padding: 14,
                background: "#171717",
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Details</div>

              {/* Category row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ opacity: 0.75 }}>Category</div>
                <div
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "rgba(255, 255, 255, 0.03)",
                    fontWeight: 700,
                  }}
                >
                  {item.category ?? "—"}
                </div>
              </div>

              {/* Divider */}
              <div style={{ margin: "14px 0", height: 1, background: "rgba(255, 255, 255, 0.08)" }} />

              <div style={{ marginTop: 12 }} />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ opacity: 0.75 }}>Cal to protein ratio</div>

                <div style={{ fontWeight: 700 }}>
                  {ratio ? `${ratio}:1` : "—"}
                </div>
              </div>


              {/* Add more rows later */}
              {/* e.g. Allergens, Notes, Tips, etc. */}
            </div>
          </div>
        </div>

      </div>
    </li>
  );
}
