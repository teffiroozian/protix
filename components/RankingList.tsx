"use client";

import { useMemo, useState } from "react";
import type { CommonChange, MenuItem, RestaurantAddons } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";
import { expandItemsForRanking } from "./menuItemVariants";

export default function RankingList({
  restaurantId,
  items,
  step = 5,
  highlightTop = 3,
  showRatio = false,
  addons,
  commonChanges,
  includeSidesDrinks = false,
  includeLargeShareables = false,
}: {
  restaurantId: string;
  items: MenuItem[];
  step?: number;
  highlightTop?: number;
  showRatio?: boolean;
  addons?: RestaurantAddons;
  commonChanges?: CommonChange[];
  includeSidesDrinks?: boolean;
  includeLargeShareables?: boolean;
}) {
  const [count, setCount] = useState(step);

  const rankableItems = useMemo(() => {
    return expandItemsForRanking(items).filter((item) => {
      if (item.portionType === "single") return true;
      if (includeLargeShareables && item.portionType === "shareable") return true;
      if (includeSidesDrinks && (item.portionType === "side" || item.portionType === "drink")) return true;
      return false;
    });
  }, [items, includeSidesDrinks, includeLargeShareables]);

  const visibleItems = useMemo(
    () => rankableItems.slice(0, count),
    [rankableItems, count]
  );

  const remaining = Math.max(0, rankableItems.length - count);
  const isFullyExpanded = count >= rankableItems.length;
  const canCollapse = rankableItems.length > step && isFullyExpanded;

  return (
    <div>
      <ul style={{ marginTop: 12, padding: 0, display: "grid", gap: 12 }}>
        {visibleItems.map((item, index) => (
          <MenuItemCard
            key={`${item.name}-${index}`}
            restaurantId={restaurantId}
            item={item}
            showRatio={showRatio}
            rankIndex={index}
            isTopRanked={index < highlightTop}
            addons={addons}
            commonChanges={commonChanges}
            rankingMode
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
              setCount((c) => Math.min(rankableItems.length, c + step))
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
