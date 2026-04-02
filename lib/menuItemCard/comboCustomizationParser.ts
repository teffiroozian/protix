export type ParsedComboCustomization = {
  comboType: "just-item" | "combo-meal";
  sideName?: string;
  sideVariantLabel?: string;
  drinkName?: string;
  drinkVariantLabel?: string;
};

export function parseComboCustomization(customizations?: string[]): ParsedComboCustomization {
  const parsed: ParsedComboCustomization = {
    comboType: "just-item",
    sideName: undefined,
    sideVariantLabel: undefined,
    drinkName: undefined,
    drinkVariantLabel: undefined,
  };

  if (!customizations || customizations.length === 0) return parsed;

  customizations.forEach((entry) => {
    if (entry === "Combo Meal") {
      parsed.comboType = "combo-meal";
      return;
    }
    const sideMatch = entry.match(/^Side:\s*(.+?)(?:\s+\((.+)\))?$/i);
    if (sideMatch) {
      parsed.sideName = sideMatch[1]?.trim();
      parsed.sideVariantLabel = sideMatch[2]?.trim();
      return;
    }
    const drinkMatch = entry.match(/^Drink:\s*(.+?)(?:\s+\((.+)\))?$/i);
    if (drinkMatch) {
      parsed.drinkName = drinkMatch[1]?.trim();
      parsed.drinkVariantLabel = drinkMatch[2]?.trim();
    }
  });

  return parsed;
}
