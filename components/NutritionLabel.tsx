import type { Nutrition } from "@/types/menu";

type RowProps = {
  label: string;
  value?: number;
  unit?: "g" | "mg";
  indent?: boolean;
  boldLabel?: boolean;
};

function Row({ label, value, unit, indent, boldLabel }: RowProps) {
  if (value == null) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "8px 0",
        borderTop: "1px solid rgba(0,0,0,0.15)",
      }}
    >
      <span
        style={{
          paddingLeft: indent ? 18 : 0,
          fontWeight: boldLabel ? 700 : 500,
          opacity: 0.92,
        }}
      >
        {label}
      </span>

      <span style={{ fontWeight: 700, opacity: 0.95 }}>
        {value}
        {unit ?? ""}
      </span>
    </div>
  );
}

export default function NutritionLabel({ nutrition }: { nutrition: Nutrition }) {
  // These two may not exist in your Nutrition type yet.
  // If they don’t exist, TypeScript will complain until you add them to your type.
  const cholesterol = (nutrition as any).cholesterol as number | undefined; // mg
  const sodium = (nutrition as any).sodium as number | undefined; // mg

  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.15)",
        borderRadius: 18,
        padding: 18,
        background: "rgba(255,255,255,0.85)",
        color: "rgba(0,0,0,0.9)",
        maxWidth: 520,
      }}
    >
      {/* Header */}
      <div style={{ fontSize: 13, opacity: 0.75 }}>Amount per serving</div>

      {/* Calories row (big) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: 6,
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.4 }}>
          Calories
        </div>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.4 }}>
          {nutrition.calories ?? 0}
        </div>
      </div>

      {/* Thick divider */}
      <div
        style={{
          height: 6,
          background: "rgba(0,0,0,0.7)",
          marginTop: 10,
          borderRadius: 4,
        }}
      />

      {/* Rows */}
      <div style={{ marginTop: 10 }}>
        <Row label="Total Fat" value={nutrition.totalFat} unit="g" boldLabel />
        <Row label="Saturated Fat" value={nutrition.satFat} unit="g" indent />
        <Row label="Trans Fat" value={nutrition.transFat} unit="g" indent />

        <Row label="Cholesterol" value={cholesterol} unit="mg" boldLabel />
        <Row label="Sodium" value={sodium} unit="mg" boldLabel />

        <Row
          label="Total Carbohydrates"
          value={nutrition.carbs}
          unit="g"
          boldLabel
        />
        <Row label="Dietary Fiber" value={nutrition.fiber} unit="g" indent />
        <Row label="Sugars" value={nutrition.sugars} unit="g" indent />

        {/* Protein is typically bold but not indented */}
        <div
          style={{
            borderTop: "1px solid rgba(0,0,0,0.15)",
            marginTop: 6,
            paddingTop: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontWeight: 800, opacity: 0.92 }}>Protein</span>
            <span style={{ fontWeight: 800, opacity: 0.95 }}>
              {nutrition.protein ?? 0}g
            </span>
          </div>
        </div>

        {/* Thick bottom divider like the label */}
        <div
          style={{
            height: 5,
            background: "rgba(0,0,0,0.65)",
            marginTop: 12,
            borderRadius: 4,
          }}
        />
      </div>

      {/* Footnote */}
      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7, lineHeight: 1.35 }}>
        Values may vary by location, serving size, and customizations.
      </div>
    </div>
  );
}
