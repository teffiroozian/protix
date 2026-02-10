"use client";

import { useMemo, useState } from "react";
import type { MenuItem, RestaurantAddons } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";

export default function RankingList({
  items,
  step = 5,
  highlightTop = 3,
  showRatio = false,
  addons,
}: {
  items: MenuItem[];
  step?: number;
  highlightTop?: number;
  showRatio?: boolean;
  addons?: RestaurantAddons;
}) {
  const [count, setCount] = useState(step);

    const singlePortionItems = useMemo(() => {
    return items.filter((item) => item.portionType === "single");
  }, [items]);

  const visibleItems = useMemo(
    () => singlePortionItems.slice(0, count),
    [singlePortionItems, count]
  );

  const remaining = Math.max(0, singlePortionItems.length - count);
  const isFullyExpanded = count >= singlePortionItems.length;
  const canCollapse = singlePortionItems.length > step && isFullyExpanded;

  return (
    <div>
      <ul style={{ marginTop: 12, padding: 0, display: "grid", gap: 12 }}>
        {visibleItems.map((item, index) => (
          <MenuItemCard
            key={`${item.name}-${index}`}
            item={item}
            showRatio={showRatio}
            rankIndex={index}
            isTopRanked={index < highlightTop}
            addons={addons}
          />
        ))}
      </ul>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
        {/* VIEW MORE */}
        {!isFullyExpanded && (
          <button
            type="button"
            onClick={() =>
              setCount((c) => Math.min(singlePortionItems.length, c + step))
            }
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.8)",
              background: "rgba(0,0,0,0.8)",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            View more (+{Math.min(step, remaining)})
          </button>
        )}

        {/* VIEW LESS */}
        {canCollapse && (
          <button
            type="button"
            onClick={() => setCount(step)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "2px solid rgba(0,0,0,0.8)",
              background: "transparent",
              color: "rgba(0,0,0,0.8)",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            View less
          </button>
        )}
      </div>
    </div>
  );
}
