"use client";

type ViewOption = "menu" | "top";

export default function ControlsRow({
  view,
  onChange,
}: {
  view: ViewOption;
  onChange: (view: ViewOption) => void;
}) {
  const options: Array<{ label: string; value: ViewOption }> = [
    { label: "Menu", value: "menu" },
    { label: "Top Picks", value: "top" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: 6,
        borderRadius: 999,
        border: "1px solid rgba(0,0,0,0.12)",
        background: "rgba(0,0,0,0.03)",
        width: "fit-content",
      }}
    >
      {options.map((option) => {
        const isActive = view === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.2)",
              background: isActive ? "rgba(0,0,0,0.85)" : "white",
              color: isActive ? "white" : "rgba(0,0,0,0.8)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 160ms ease",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
