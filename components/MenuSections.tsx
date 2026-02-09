"use client";

import type { MenuItem } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";

function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}

function titleCase(text: string) {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function MenuSections({ items }: { items: MenuItem[] }) {
  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = normalizeCategory(item.category || "Other");
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const sections = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <div style={{ marginTop: 32, display: "grid", gap: 48 }}>
      {sections.map((section) => (
        <section key={section} style={{ scrollMarginTop: 200 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>
            {titleCase(section)}
          </h2>
          <ul style={{ marginTop: 12, padding: 0, display: "grid", gap: 12 }}>
            {grouped[section].map((item, index) => (
              <MenuItemCard key={`${item.name}-${index}`} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
