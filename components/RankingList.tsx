"use client";

import { useMemo, useState } from "react";
import type { MenuItem } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";

export default function RankingList({
  items,
  step = 5,
  highlightTop = 3,
  showRatio = false,
}: {
  items: MenuItem[];
  step?: number;
  highlightTop?: number;
  showRatio?: boolean;
}) {
  const [count, setCount] = useState(step);
  const visibleItems = useMemo(() => items.slice(0, count), [items, count]);
  const remaining = Math.max(0, items.length - count);
  const isFullyExpanded = count >= items.length;
  const canCollapse = items.length > step && isFullyExpanded;

  return (
    <div>
      <ul style={{ marginTop: 12, padding: 0, display: "grid", gap: 12 }}>
        {visibleItems.map((item, index) => (
          <MenuItemCard
            key={`${item.name}-${index}`}
            item={item}
            showRatio={showRatio}
            rankIndex={index}
            highlightTop={highlightTop}
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
            onClick={() => setCount((c) => Math.min(items.length, c + step))}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.08)",
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
              border: "1px solid rgba(255,255,255,0.18)",
              background: "transparent",
              color: "rgba(255,255,255,0.9)",
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
