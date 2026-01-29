import type { Nutrition } from "@/types/menu";

function Row({ label, value }: { label: string; value?: number }) {
  if (value == null) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
      <span style={{ opacity: 0.9 }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function NutritionLabel({ nutrition }: { nutrition: Nutrition }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 12,
        padding: 14,
        background: "rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>
        Nutrition Facts
      </div>

      <div style={{ borderTop: "2px solid rgba(255,255,255,0.25)", paddingTop: 10 }}>
        <Row label="Calories" value={nutrition.calories} />
        <Row label="Protein (g)" value={nutrition.protein} />
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.16)", marginTop: 10, paddingTop: 10 }}>
        <Row label="Total Fat (g)" value={nutrition.totalFat} />
        <Row label="Saturated Fat (g)" value={nutrition.satFat} />
        <Row label="Trans Fat (g)" value={nutrition.transFat} />
        <Row label="Carbohydrates (g)" value={nutrition.carbs} />
        <Row label="Fiber (g)" value={nutrition.fiber} />
        <Row label="Sugars (g)" value={nutrition.sugars} />
      </div>

      <div style={{ marginTop: 10, opacity: 0.7, fontSize: 12 }}>
        Values may vary by location and serving size.
      </div>
    </div>
  );
}
