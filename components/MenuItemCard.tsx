"use client";

import { useId, useState } from "react";
import type { MenuItem } from "@/types/menu";
import NutritionLabel from "@/components/NutritionLabel";

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

  const isTop = typeof rankIndex === "number" && rankIndex < highlightTop;
  const badgeText =
    typeof rankIndex === "number" ? `#${rankIndex + 1}` : null;

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
          background: "#171717",
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
            alignItems: "flex-start",
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
                background: "rgb(255,255,255)",
                border: "1px solid rgba(255,255,255,0.12)",
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

          {/* Text content */}
          <div>
            {/* Ranking number */}
            {badgeText && (
              <div
                style={{
                  display: "inline-block",
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 999,
                  marginBottom: 8,
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  opacity: 0.95,
                }}
              >
                {badgeText}
              </div>
            )}
            {/* Item name */}
            <div style={{ fontWeight: 700, fontSize: 22 }}>{item.name}</div>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >

              {/* Protein tag */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "rgba(34,197,94,0.15)", // green tint
                  border: "1px solid rgba(34,197,94,0.35)",
                  color: "rgb(187,247,208)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {item.nutrition.protein}g protein
              </div>

              {/* Calories tag */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "rgba(59,130,246,0.15)", // blue tint
                  border: "1px solid rgba(59,130,246,0.35)",
                  color: "rgb(191,219,254)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {item.nutrition.calories} calories
              </div>
            </div>

            {showRatio && Number.isFinite(ratio) && (
              <div style={{ marginTop: 6, opacity: 0.7, fontSize: 14 }}>
                Ratio: {ratio}:1 (1g protein per {ratio} cals)
              </div>
            )}
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
          maxHeight: open ? 500 : 0,
          transition: "max-height 180ms ease",
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
