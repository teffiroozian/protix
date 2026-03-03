"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import ItemDetailsPanel from "@/components/ItemDetailsPanel";
import type { AddonOption, AddonRef, CommonChange, MacroDelta, MenuItem, RestaurantAddons } from "@/types/menu";
import { useCart } from "@/stores/cartStore";
import styles from "./ItemRouteModal.module.css";

const emptyAddon: AddonOption = { name: "None", calories: 0, protein: 0, carbs: 0, fat: 0, image: "none" };

function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}

function getApplicableCommonChanges(item: MenuItem, commonChanges?: CommonChange[]) {
  if (!commonChanges || commonChanges.length === 0) return [];
  const itemCategories = new Set((item.categories ?? []).map((category) => normalizeCategory(category)));
  return commonChanges.filter((change) => {
    const categories = change.appliesTo?.categories;
    if (!categories || categories.length === 0) return false;
    return categories.some((category) => itemCategories.has(normalizeCategory(category)));
  });
}

export default function ItemRouteModal({
  restaurantId,
  item,
  addons,
  commonChanges,
}: {
  restaurantId: string;
  item: MenuItem;
  addons?: RestaurantAddons;
  commonChanges?: CommonChange[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { addItem } = useCart();
  const variants = item.variants?.length ? item.variants : null;
  const defaultVariantId = useMemo(() => {
    if (!variants) return "";
    if (item.defaultVariantId && variants.some((variant) => variant.id === item.defaultVariantId)) return item.defaultVariantId;
    return variants.find((variant) => variant.isDefault)?.id ?? variants[0]?.id ?? "";
  }, [item.defaultVariantId, variants]);
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  const [selectedAddons, setSelectedAddons] = useState<Partial<Record<AddonRef, AddonOption>>>({});
  const [selectedCommonChangeIds, setSelectedCommonChangeIds] = useState<string[]>([]);

  const selectedVariant = variants?.find((variant) => variant.id === selectedVariantId);
  const baseNutrition = selectedVariant?.nutrition ?? item.nutrition;
  const applicableCommonChanges = useMemo(() => getApplicableCommonChanges(item, commonChanges), [item, commonChanges]);

  const addonNutritionTotals = useMemo(
    () =>
      Object.values(selectedAddons).reduce(
        (sum, addon) => ({
          calories: sum.calories + (addon?.calories ?? 0),
          protein: sum.protein + (addon?.protein ?? 0),
          carbs: sum.carbs + (addon?.carbs ?? 0),
          totalFat: sum.totalFat + (addon?.fat ?? 0),
          satFat: sum.satFat + (addon?.satFat ?? 0),
          transFat: sum.transFat + (addon?.transFat ?? 0),
          cholesterol: sum.cholesterol + (addon?.cholesterol ?? 0),
          sodium: sum.sodium + (addon?.sodium ?? 0),
          fiber: sum.fiber + (addon?.fiber ?? 0),
          sugars: sum.sugars + (addon?.sugars ?? 0),
        }),
        { calories: 0, protein: 0, carbs: 0, totalFat: 0, satFat: 0, transFat: 0, cholesterol: 0, sodium: 0, fiber: 0, sugars: 0 }
      ),
    [selectedAddons]
  );

  const commonChangeTotals = useMemo(
    () =>
      applicableCommonChanges.reduce<MacroDelta>(
        (sum, change) => {
          if (!selectedCommonChangeIds.includes(change.id)) return sum;
          return {
            calories: sum.calories + change.delta.calories,
            protein: sum.protein + change.delta.protein,
            carbs: sum.carbs + change.delta.carbs,
            fat: sum.fat + change.delta.fat,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [applicableCommonChanges, selectedCommonChangeIds]
  );

  const nutrition = {
    ...baseNutrition,
    calories: baseNutrition.calories + addonNutritionTotals.calories + commonChangeTotals.calories,
    protein: baseNutrition.protein + addonNutritionTotals.protein + commonChangeTotals.protein,
    carbs: baseNutrition.carbs + addonNutritionTotals.carbs + commonChangeTotals.carbs,
    totalFat: baseNutrition.totalFat + addonNutritionTotals.totalFat + commonChangeTotals.fat,
    satFat: (baseNutrition.satFat ?? 0) + addonNutritionTotals.satFat,
    transFat: (baseNutrition.transFat ?? 0) + addonNutritionTotals.transFat,
    cholesterol: (baseNutrition.cholesterol ?? 0) + addonNutritionTotals.cholesterol,
    sodium: (baseNutrition.sodium ?? 0) + addonNutritionTotals.sodium,
    fiber: (baseNutrition.fiber ?? 0) + addonNutritionTotals.fiber,
    sugars: (baseNutrition.sugars ?? 0) + addonNutritionTotals.sugars,
  };

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    const basePath = pathname.split("/items/")[0] ?? `/restaurant/${restaurantId}`;
    router.push(basePath, { scroll: false });
  };

  return (
    <div className={styles.overlay}>
      <button type="button" className={styles.closeButton} onClick={handleClose} aria-label="Close item details">
        ✕
      </button>

      <div className={styles.container}>
        <h1 className={styles.title}>{item.name}</h1>
        {item.image ? <img className={styles.image} src={item.image} alt={item.name} /> : null}
        <div className={styles.macroSummary}>{nutrition.calories} cal - {nutrition.protein}g protein - {nutrition.carbs}g carbs - {nutrition.totalFat}g fats</div>

        <ItemDetailsPanel
          item={item}
          nutrition={nutrition}
          variants={variants}
          selectedVariantId={selectedVariantId}
          onSelectVariant={setSelectedVariantId}
          addons={addons}
          selectedAddons={selectedAddons}
          onSelectAddon={(ref, addon) => {
            setSelectedAddons((prev) => ({ ...prev, [ref]: addon ?? emptyAddon }));
          }}
          commonChanges={applicableCommonChanges}
          selectedCommonChangeIds={selectedCommonChangeIds}
          onToggleCommonChange={(changeId) =>
            setSelectedCommonChangeIds((prev) =>
              prev.includes(changeId) ? prev.filter((id) => id !== changeId) : [...prev, changeId]
            )
          }
          customizationTotals={commonChangeTotals}
          showCustomizationDeltas={selectedCommonChangeIds.length > 0}
          displayMode="full"
        />
      </div>

      <div className={styles.stickyBar}>
        <button
          type="button"
          className={styles.addButton}
          onClick={() =>
            addItem({
              id: crypto.randomUUID(),
              restaurantId,
              itemId: item.id ?? item.name,
              name: item.name,
              variantId: selectedVariant?.id,
              variantLabel: selectedVariant?.label,
              quantity: 1,
              macrosPerItem: {
                calories: nutrition.calories,
                protein: nutrition.protein,
                carbs: nutrition.carbs,
                fat: nutrition.totalFat,
              },
            })
          }
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
