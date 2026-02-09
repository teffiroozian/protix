"use client";

type ViewOption = "menu" | "top";
type SortOption = "highest-protein" | "best-ratio" | "lowest-calories";

export default function ControlsRow({
  view,
  onChange,
  sort,
  onSortChange,
}: {
  view: ViewOption;
  onChange: (view: ViewOption) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}) {
  const options: Array<{ label: string; value: ViewOption }> = [
    { label: "Menu", value: "menu" },
    { label: "Top Picks", value: "top" },
  ];
  const sortOptions: Array<{ label: string; value: SortOption }> = [
    { label: "Highest Protein", value: "highest-protein" },
    { label: "Best Ratio (protein / calories)", value: "best-ratio" },
    { label: "Lowest Calories", value: "lowest-calories" },
  ];
  const activeSortLabel =
    sortOptions.find((option) => option.value === sort)?.label ??
    "Highest Protein";

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
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
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 600,
          color: "rgba(0,0,0,0.8)",
        }}
      >
        Sort: {activeSortLabel}
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.2)",
            background: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
