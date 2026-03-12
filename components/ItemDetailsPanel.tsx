import { useState } from "react";
import Image from "next/image";
import ingredientsCatalog from "@/data/ingredientsCatalog.json";
import type {
  AddonOption,
  AddonRef,
  CommonChange,
  ItemVariant,
  MacroDelta,
  MenuItem,
  Nutrition,
  RestaurantAddons,
} from "@/types/menu";


function format(n?: number, suffix = "") {
  return n === undefined || n === null || Number.isNaN(n) ? `—${suffix}` : `${n}${suffix}`;
}

function calToProteinRatio(calories: number, protein: number) {
  if (!protein) return "—";
  return `${Math.round(calories / protein)}:1`;
}

function formatDelta(value: number, suffix = "") {
  return `${value >= 0 ? "+" : ""}${value}${suffix}`;
}

const addonSectionTitles: Record<AddonRef, string> = {
  sauces: "Sauces",
  dressings: "Dressings",
  condiments: "Condiments",
};

type IngredientEntry = {
  label: string;
  icon: string;
};

function resolveIngredients(ingredientIds?: string[]) {
  if (!ingredientIds || ingredientIds.length === 0) return [];

  return ingredientIds
    .map((ingredientId) => {
      const ingredient = (ingredientsCatalog as Record<string, IngredientEntry>)[ingredientId];
      if (!ingredient) return null;
      return {
        id: ingredientId,
        label: ingredient.label,
        icon: ingredient.icon,
      };
    })
    .filter((ingredient): ingredient is { id: string; label: string; icon: string } => ingredient !== null);
}

function sortByCalories(addons: AddonOption[]) {
  return [...addons].sort((a, b) => a.calories - b.calories);
}

function formatSummaryDetail(name: string, calories: number) {
  return `• ${name} (${calories >= 0 ? "+" : ""}${calories}cal)`;
}


function isIconImage(icon: string) {
  return icon.startsWith("/") || icon.startsWith("http://") || icon.startsWith("https://");
}

export default function ItemDetailsPanel({
  item,
  nutrition,
  variants,
  selectedVariantId,
  onSelectVariant,
  addons,
  selectedAddons,
  onSelectAddon,
  sauceSelectionCounts,
  onIncrementSauce,
  onDecrementSauce,
  onToggleSauce,
  commonChanges,
  selectedCommonChangeIds,
  onToggleCommonChange,
  customizationTotals,
  showCustomizationDeltas,
  displayMode = "full",
}: {
  item: MenuItem;
  nutrition: Nutrition;
  variants?: ItemVariant[] | null;
  selectedVariantId?: string;
  onSelectVariant?: (id: string) => void;
  addons?: RestaurantAddons;
  selectedAddons?: Partial<Record<AddonRef, AddonOption>>;
  onSelectAddon?: (ref: AddonRef, addon?: AddonOption) => void;
  sauceSelectionCounts?: Partial<Record<string, number>>;
  onIncrementSauce?: (addon: AddonOption) => void;
  onDecrementSauce?: (addon: AddonOption) => void;
  onToggleSauce?: (addon: AddonOption) => void;
  commonChanges?: CommonChange[];
  selectedCommonChangeIds?: string[];
  onToggleCommonChange?: (id: string) => void;
  customizationTotals?: MacroDelta;
  showCustomizationDeltas?: boolean;
  displayMode?: "full" | "addonsOnly";
}) {
  const n = nutrition;
  const addonRefs = item.addonRefs ?? [];
  const [sectionOpenState, setSectionOpenState] = useState<Record<string, boolean>>({});

  const availableAddonSections = addonRefs
    .map((ref) => {
      const list = addons?.[ref];
      if (!list || list.length === 0) return null;
      return {
        ref,
        title: addonSectionTitles[ref],
        addons: sortByCalories(list),
      };
    })
    .filter((section): section is { ref: AddonRef; title: string; addons: AddonOption[] } =>
      section !== null
    );

  const activeCustomizationTotals = customizationTotals ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const ingredients = resolveIngredients(item.ingredients);

  return (
    <div className="grid grid-cols-2 gap-3 rounded-[18px] bg-[#e0e0e0] px-3 py-2">
      {availableAddonSections.length > 0 ? (
        <section className="col-span-2 rounded-[18px] border border-[rgba(0,0,0,0.15)] bg-white px-[18px] py-[14px]">
          <div className="grid gap-[14px]">
            {availableAddonSections.map((section) => {
              const sectionStateKey = `addon-${section.ref}`;
              const isSectionOpen = sectionOpenState[sectionStateKey] ?? true;
              const selectedAddon = selectedAddons?.[section.ref];
              const sauceSelections =
                section.ref === "sauces"
                  ? section.addons.filter((addon) => addon.name !== "None" && (sauceSelectionCounts?.[addon.name] ?? 0) > 0)
                  : [];
              const sauceSummaryCalories = sauceSelections.reduce(
                (sum, addon) => sum + addon.calories * (sauceSelectionCounts?.[addon.name] ?? 0),
                0
              );
              const summaryDetail =
                section.ref === "sauces"
                  ? formatSummaryDetail(sauceSelections[0]?.name ?? "None", sauceSummaryCalories)
                  : formatSummaryDetail(selectedAddon?.name ?? "None", selectedAddon?.calories ?? 0);
              return (
                <div key={section.ref} className="min-w-0">
                  <div
                    className="flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-[10px] rounded-[10px] border-0 bg-transparent p-3 text-left"
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setSectionOpenState((prev) => ({
                        ...prev,
                        [sectionStateKey]: !(prev[sectionStateKey] ?? true),
                      }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSectionOpenState((prev) => ({
                          ...prev,
                          [sectionStateKey]: !(prev[sectionStateKey] ?? true),
                        }));
                      }
                    }}
                  >
                    <h3 className="m-0 text-2xl font-bold">
                      {section.title}
                      {!isSectionOpen ? <span className="text-[18px] font-semibold text-[rgba(0,0,0,0.5)]"> {summaryDetail}</span> : null}
                    </h3>
                    <div className="inline-flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 cursor-inherit items-center justify-center rounded-md border border-[rgba(0,0,0,0.4)] bg-white text-base leading-none" aria-hidden="true">
                        {isSectionOpen ? "˄" : "˅"}
                      </span>
                    </div>
                  </div>
                  {isSectionOpen ? (
                    <ul className="mt-2 grid list-none grid-cols-2 items-stretch gap-[10px] pl-0">
                      {section.addons.map((addon) => {
                        const sauceCount = section.ref === "sauces" ? (sauceSelectionCounts?.[addon.name] ?? 0) : 0;
                        const isSelected =
                          section.ref === "sauces"
                            ? sauceCount > 0
                            : selectedAddons?.[section.ref]?.name === addon.name;

                        return (
                        <li key={`${section.ref}-${addon.name}`} className="flex">
                          <button
                            type="button"
                            className={`box-border flex h-full w-full cursor-pointer flex-row items-center gap-3 rounded-[10px] border border-[rgba(0,0,0,0.15)] bg-[#f9f9f9] px-3 py-2 ${isSelected ? "shadow-[inset_0_0_0_3px_#16a34a]" : ""}`}
                            onClick={() => {
                              if (section.ref === "sauces") {
                                onToggleSauce?.(addon);
                                return;
                              }
                              onSelectAddon?.(section.ref, isSelected ? undefined : addon);
                            }}
                          >
                            {addon.image === "none" ? (
                              <div className={`grid h-[72px] w-[72px] min-w-[72px] place-items-center rounded-lg bg-cover bg-center text-[32px] font-bold text-black `}>✕</div>
                            ) : addon.image ? (
                              <div
                                className="grid h-[72px] w-[72px] min-w-[72px] place-items-center rounded-lg bg-cover bg-center text-[32px] font-bold text-black"
                                style={{ backgroundImage: `url(${addon.image})` }}
                              />
                            ) : (
                              <div className="grid h-[72px] w-[72px] min-w-[72px] place-items-center rounded-lg bg-cover bg-center text-[32px] font-bold text-black" />
                            )}
                            <div className="flex min-w-0 flex-col items-start justify-center gap-[6px]">
                              <div className="line-clamp-2 break-words text-left text-base font-bold leading-[1.2]">{addon.name}</div>
                              <div className="text-base font-bold text-[rgba(0,0,0,0.5)]">+{addon.calories} Cal</div>
                            </div>
                            {section.ref === "sauces" && addon.name !== "None" ? (
                              <div
                                className="ml-auto inline-flex items-center gap-[6px]"
                                onClick={(event) => event.stopPropagation()}
                                onMouseDown={(event) => event.stopPropagation()}
                              >
                                {sauceCount > 0 ? (
                                  <>
                                    <span
                                      role="button"
                                      tabIndex={0}
                                      className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[rgba(0,0,0,0.35)] bg-white text-[18px] font-bold leading-none"
                                      aria-label={`Remove one ${addon.name}`}
                                      onClick={() => onDecrementSauce?.(addon)}
                                      onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                          event.preventDefault();
                                          onDecrementSauce?.(addon);
                                        }
                                      }}
                                    >
                                      -
                                    </span>
                                    <span className="min-w-4 text-center text-base font-bold">{sauceCount}</span>
                                    <span
                                      role="button"
                                      tabIndex={0}
                                      className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[rgba(0,0,0,0.35)] bg-white text-[18px] font-bold leading-none"
                                      aria-label={`Add one more ${addon.name}`}
                                      onClick={() => onIncrementSauce?.(addon)}
                                      onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                          event.preventDefault();
                                          onIncrementSauce?.(addon);
                                        }
                                      }}
                                    >
                                      +
                                    </span>
                                  </>
                                ) : (
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[rgba(0,0,0,0.35)] bg-white text-[18px] font-bold leading-none"
                                    aria-label={`Add ${addon.name}`}
                                    onClick={() => onIncrementSauce?.(addon)}
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        onIncrementSauce?.(addon);
                                      }
                                    }}
                                  >
                                    +
                                  </span>
                                )}
                              </div>
                            ) : null}
                          </button>
                        </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {displayMode === "full" && commonChanges && commonChanges.length > 0 ? (
        <section className="col-span-2 rounded-[18px] border border-[rgba(0,0,0,0.15)] bg-white px-[18px] py-[14px]">
          <div className="grid gap-[14px]">
            <div className="min-w-0">
              {(() => {
                const commonKey = "common-changes";
                const isCommonOpen = sectionOpenState[commonKey] ?? true;
                const selectedCommonChanges = commonChanges.filter((change) =>
                  selectedCommonChangeIds?.includes(change.id)
                );
                const firstSelectedCommon = selectedCommonChanges[0] ?? null;
                const totalCommonCalories = selectedCommonChanges.reduce(
                  (sum, change) => sum + change.delta.calories,
                  0
                );
                const commonSummaryDetail = formatSummaryDetail(
                  firstSelectedCommon?.label ?? "None",
                  firstSelectedCommon ? totalCommonCalories : 0
                );

                return (
                  <>
                    <div
                      className="flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-[10px] rounded-[10px] border-0 bg-transparent p-3 text-left"
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setSectionOpenState((prev) => ({
                          ...prev,
                          [commonKey]: !(prev[commonKey] ?? true),
                        }))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSectionOpenState((prev) => ({
                            ...prev,
                            [commonKey]: !(prev[commonKey] ?? true),
                          }));
                        }
                      }}
                    >
                      <h3 className="m-0 text-2xl font-bold">
                        Common Changes
                        {!isCommonOpen ? <span className="text-[18px] font-semibold text-[rgba(0,0,0,0.5)]"> {commonSummaryDetail}</span> : null}
                      </h3>
                      <div className="inline-flex items-center gap-2">
                        <span className="inline-flex h-7 w-7 cursor-inherit items-center justify-center rounded-md border border-[rgba(0,0,0,0.4)] bg-white text-base leading-none" aria-hidden="true">
                          {isCommonOpen ? "˄" : "˅"}
                        </span>
                      </div>
                    </div>
                    {isCommonOpen ? (
                      <ul className="mt-2 grid list-none grid-cols-2 items-stretch gap-[10px] pl-0">
                        {commonChanges.map((change) => {
                          const isActive = selectedCommonChangeIds?.includes(change.id) ?? false;
                          const calorieDeltaLabel = `${change.delta.calories >= 0 ? "+" : ""}${change.delta.calories}cal`;
                          const proteinDeltaLabel = `${change.delta.protein >= 0 ? "+" : ""}${change.delta.protein}g protein`;
                          return (
                            <li key={change.id} className="flex">
                              <button
                                type="button"
                                className={`box-border flex h-full w-full cursor-pointer flex-row items-center gap-3 rounded-[10px] border border-[rgba(0,0,0,0.15)] bg-[#f9f9f9] px-3 py-2 ${isActive ? "shadow-[inset_0_0_0_3px_#16a34a]" : ""}`}
                                onClick={() => onToggleCommonChange?.(change.id)}
                              >
                                <div className={`grid h-[72px] w-[72px] min-w-[72px] place-items-center rounded-lg bg-cover bg-center text-[32px] font-bold text-black `}>↺</div>
                                <div className="flex min-w-0 flex-col items-start justify-center gap-[6px]">
                                  <div className="line-clamp-2 break-words text-left text-base font-bold leading-[1.2]">{change.label}</div>
                                  <div className="text-base font-bold text-[rgba(0,0,0,0.5)]">{`${calorieDeltaLabel} • ${proteinDeltaLabel}`}</div>
                                </div>
                                <span
                                  className={`ml-auto inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border-2 border-[rgba(0,0,0,0.45)] bg-white text-sm font-extrabold text-white ${isActive ? "border-[#16a34a] bg-[#16a34a] text-white" : ""}`}
                                  aria-hidden="true"
                                >
                                  {isActive ? "✓" : ""}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      ) : null}

      {displayMode === "full" ? <section className="rounded-[18px] border border-[rgba(0,0,0,0.15)] bg-white p-[18px]">
        <div className="text-xs font-medium text-[rgba(0,0,0,0.55)]">Amount per serving</div>

        <div className="mt-1 flex items-end justify-between">
          <div className="text-2xl font-bold">Calories</div>
          <div className="inline-flex items-baseline gap-[6px]">
            <div className="text-2xl font-bold">{n.calories === undefined || Number.isNaN(n.calories) ? "—" : n.calories}</div>
            {showCustomizationDeltas ? (
              <span className="text-sm font-bold text-[#16a34a]">{formatDelta(activeCustomizationTotals.calories)}</span>
            ) : null}
          </div>
        </div>

        <div className="my-[12px] mb-2 h-[5px] rounded-[999px] bg-[rgba(0,0,0,0.75)]" />

        <div className="flex items-baseline justify-between border-b border-[rgba(0,0,0,0.2)] py-[10px]">
          <div className="text-[18px] font-semibold">Total Fat</div>
          <div className="inline-flex items-baseline gap-[6px]">
            <div className="text-[18px] font-semibold">{format(n.totalFat, "g")}</div>
            {showCustomizationDeltas ? <span className="text-sm font-bold text-[#16a34a]">{formatDelta(activeCustomizationTotals.fat, "g")}</span> : null}
          </div>
        </div>

        <div className="flex items-baseline justify-between border-b border-[rgba(0,0,0,0.2)] py-[10px] pl-5">
          <div className="text-base font-medium text-[rgba(0,0,0,0.8)]">Sat Fat</div>
          <div className="text-base font-medium text-[rgba(0,0,0,0.8)]">{format(n.satFat, "g")}</div>
        </div>

        <div className="flex items-baseline justify-between border-b border-[rgba(0,0,0,0.2)] py-[10px] pl-5">
          <div className="text-base font-medium text-[rgba(0,0,0,0.8)]">Trans Fat</div>
          <div className="text-base font-medium text-[rgba(0,0,0,0.8)]">{format(n.transFat, "g")}</div>
        </div>

        <div className="flex items-baseline justify-between border-b border-[rgba(0,0,0,0.2)] py-[10px]">
          <div className="text-[18px] font-semibold">Cholesterol</div>
          <div className="text-[18px] font-semibold">{format(n.cholesterol, "mg")}</div>
        </div>

        <div className="flex items-baseline justify-between border-b border-[rgba(0,0,0,0.2)] py-[10px]">
          <div className="text-[18px] font-semibold">Sodium</div>
          <div className="text-[18px] font-semibold">{format(n.sodium, "mg")}</div>
        </div>

        <div className="flex items-baseline justify-between border-b border-[rgba(0,0,0,0.2)] py-[10px]">
          <div className="text-[18px] font-semibold">Carbohydrates</div>
          <div className="inline-flex items-baseline gap-[6px]">
            <div className="text-[18px] font-semibold">{format(n.carbs, "g")}</div>
            {showCustomizationDeltas ? <span className="text-sm font-bold text-[#16a34a]">{formatDelta(activeCustomizationTotals.carbs, "g")}</span> : null}
          </div>
        </div>

        <div className="flex items-baseline justify-between border-b border-[rgba(0,0,0,0.2)] py-[10px] pl-5">
          <div className="text-base font-medium text-[rgba(0,0,0,0.8)]">Fiber</div>
          <div className="text-base font-medium text-[rgba(0,0,0,0.8)]">{format(n.fiber, "g")}</div>
        </div>

        <div className="flex items-baseline justify-between border-b border-[rgba(0,0,0,0.2)] py-[10px] pl-5">
          <div className="text-base font-medium text-[rgba(0,0,0,0.8)]">Sugars</div>
          <div className="text-base font-medium text-[rgba(0,0,0,0.8)]">{format(n.sugars, "g")}</div>
        </div>

        <div className="flex items-baseline justify-between border-b border-[rgba(0,0,0,0.2)] py-[10px]">
          <div className="text-[18px] font-semibold">Protein</div>
          <div className="inline-flex items-baseline gap-[6px]">
            <div className="text-[18px] font-semibold">{format(n.protein, "g")}</div>
            {showCustomizationDeltas ? <span className="text-sm font-bold text-[#16a34a]">{formatDelta(activeCustomizationTotals.protein, "g")}</span> : null}
          </div>
        </div>

        <div className="mt-3 text-xs font-medium leading-[1.05] text-[rgba(0,0,0,0.55)]">
          2,000 calories a day is used for general nutrition advice, but calorie needs
          vary. Values may vary by location, serving size, and customizations.
        </div>
      </section> : null}

      {displayMode === "full" ? <section className="rounded-[18px] border border-[rgba(0,0,0,0.15)] bg-white p-[18px]">
        <div className="text-2xl font-bold">Details</div>

        <div className="mt-[18px] flex items-center justify-between gap-[14px]">
          <div className="text-[18px] font-semibold text-[rgba(0,0,0,0.8)]">Category</div>
          <div className="rounded-[999px] border-2 border-[rgba(0,0,0,0.8)] px-3 py-1 text-[18px] font-extrabold">{item.categories?.join(", ") ?? "—"}</div>
        </div>

        <div className="mt-[14px] h-px bg-[rgba(0,0,0,0.2)]" />

        <div className="mt-[18px] flex items-center justify-between gap-[14px]">
          <div className="text-[18px] font-semibold text-[rgba(0,0,0,0.8)]">Cal to Protein Ratio</div>
          <div className="text-[18px] font-semibold">
            {calToProteinRatio(n.calories, n.protein)}
          </div>
        </div>

        {variants && variants.length > 0 ? (
          <>
            <div className="mt-[14px] h-px bg-[rgba(0,0,0,0.2)]" />
            <div className={`mt-[18px] flex items-center justify-between gap-[14px] flex-col items-start`}>
              <div className="text-[18px] font-semibold text-[rgba(0,0,0,0.8)]">Portion</div>
              <div className="grid w-full grid-cols-3 gap-2">
                {variants.map((variant) => {
                  const isActive = variant.id === selectedVariantId;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      className={`w-full cursor-inherit rounded-lg border-2 border-[rgba(0,0,0,0.6)] bg-transparent px-3 py-1.5 text-center text-[18px] font-bold text-[rgba(0,0,0,0.6)] ${isActive ? "bg-black text-white" : ""}`}
                      onClick={() => onSelectVariant?.(variant.id)}
                    >
                      {variant.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}

        <div className="mt-[14px] h-px bg-[rgba(0,0,0,0.2)]" />

        {item.restaurant ? (
          <>
            <div className="mt-[14px] h-px bg-[rgba(0,0,0,0.2)]" />
            <div className="mt-[18px] flex items-center justify-between gap-[14px]">
              <div className="text-[18px] font-semibold text-[rgba(0,0,0,0.8)]">Restaurant</div>
              <div className="text-[18px] font-semibold">{item.restaurant}</div>
            </div>
          </>
        ) : null}

        {ingredients.length > 0 ? (
          <>
            <div className="mt-[14px] h-px bg-[rgba(0,0,0,0.2)]" />
            <div className={`mt-[18px] flex items-center justify-between gap-[14px] flex-col items-start`}>
              <div className="text-[18px] font-semibold text-[rgba(0,0,0,0.8)]">Ingredients</div>
              <div className="grid w-full grid-cols-3 gap-2">
                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="inline-flex items-center gap-[6px] whitespace-nowrap rounded-[999px] border border-[rgba(0,0,0,0.2)] bg-[#f8f8f8] px-[10px] py-1.5 text-sm font-semibold">
                    <span aria-hidden="true">{isIconImage(ingredient.icon) ? <Image src={ingredient.icon} alt="" width={24} height={24} /> : ingredient.icon}</span>
                    <span>{ingredient.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section> : null}
    </div>
  );
}
