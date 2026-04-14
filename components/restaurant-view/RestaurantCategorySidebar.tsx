import { Circle, type LucideIcon, UtensilsCrossed, Soup, SquareStack, CupSoda, Check } from "lucide-react";

type RankedAllFilterKey = "main-entrees" | "breakfast" | "shareables" | "sides" | "drinks";

type CategoryOption = { id: string; label: string };

type Props = {
  effectiveViewMode: "menu" | "ingredients" | "ranking";
  rankedAllFilters: Record<RankedAllFilterKey, boolean>;
  toggleRankedAllFilter: (key: RankedAllFilterKey) => void;
  categoryOptions: CategoryOption[];
  resolvedActiveCategory: string;
  onCategorySelect: (categoryId: string) => void;
  categoryIcons: Record<string, LucideIcon>;
};

export default function RestaurantCategorySidebar({
  effectiveViewMode,
  rankedAllFilters,
  toggleRankedAllFilter,
  categoryOptions,
  resolvedActiveCategory,
  onCategorySelect,
  categoryIcons,
}: Props) {
  const rankingOptions: Array<{ key: RankedAllFilterKey; label: string; iconKey: string }> = [
    { key: "main-entrees", label: "Main Entrees", iconKey: "entrees" },
    { key: "breakfast", label: "Breakfast", iconKey: "breakfast" },
    { key: "shareables", label: "Shareables", iconKey: "shareables" },
    { key: "sides", label: "Sides", iconKey: "sides" },
    { key: "drinks", label: "Drinks", iconKey: "drinks" },
  ];
  const rankingFallbackIcons: Record<RankedAllFilterKey, LucideIcon> = {
    "main-entrees": UtensilsCrossed,
    breakfast: UtensilsCrossed,
    shareables: Soup,
    sides: SquareStack,
    drinks: CupSoda,
  };

  return (
    <aside className="flex flex-col py-2 lg:sticky lg:top-[160px] lg:max-h-[calc(100vh-160px)] lg:py-6">
      <h3 className="mb-3 shrink-0 text-lg font-bold text-slate-900 lg:mb-8 lg:text-2xl">
        {effectiveViewMode === "ranking" ? "Show" : effectiveViewMode === "ingredients" ? "Ingredients" : "Categories"}
      </h3>

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-visible px-0 py-1 lg:overflow-y-auto lg:px-2 lg:py-2">
        {effectiveViewMode === "ranking" ? (
          <div className="flex gap-2 pb-1 lg:grid lg:gap-4" role="group" aria-label="Ranking categories">
            {rankingOptions.map((option) => {
              const isChecked = rankedAllFilters[option.key];
              const Icon = categoryIcons[option.iconKey] ?? rankingFallbackIcons[option.key];

              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={isChecked}
                  onClick={() => toggleRankedAllFilter(option.key)}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-left text-sm font-semibold transition-colors duration-100 lg:w-full lg:gap-3 lg:px-4 lg:text-base ${
                    isChecked
                      ? "bg-white text-slate-800 shadow-[0px_0_8px_rgba(0,0,0,0.25)]"
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isChecked ? "bg-slate-100 text-slate-900" : "bg-slate-200/80 text-slate-700"
                    }`}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.4} />
                  </span>
                  <span>{option.label}</span>
                  <span
                    className={`ml-auto inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      isChecked
                        ? "border-black bg-black text-white"
                        : "border-slate-400 bg-transparent text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <nav
            aria-label={effectiveViewMode === "ingredients" ? "Ingredient categories" : "Menu categories"}
            className="flex gap-2 pb-1 lg:grid lg:gap-4"
          >
            {categoryOptions.map((option) => {
              const isActive = option.id === resolvedActiveCategory;
              const Icon = categoryIcons[option.label.toLowerCase()] ?? Circle;

              return (
                <div key={option.id} className="relative shrink-0 pl-0 lg:pl-3">
                  {isActive ? (
                    <span
                      className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full shadow-[0px_0_8px_rgba(0,0,0,0.25)] bg-white"
                      aria-hidden="true"
                    />
                  ) : null}

                  <button
                    type="button"
                    onClick={() => onCategorySelect(option.id)}
                    className={`cursor-pointer inline-flex items-center gap-2 rounded-full px-3 py-2 text-left text-sm font-semibold transition-colors duration-50 ease-in lg:gap-3 lg:px-4 lg:text-base ${
                      isActive
                        ? "shadow-[0px_0_8px_rgba(0,0,0,0.25)] bg-white text-slate-800"
                        : "text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                    <span>{option.label}</span>
                  </button>
                </div>
              );
            })}
          </nav>
        )}
      </div>
    </aside>
  );
}
