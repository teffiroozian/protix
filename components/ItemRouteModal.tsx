"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ItemDetailsPanel from "@/components/ItemDetailsPanel";
import type {
  AddonOption,
  AddonRef,
  CommonChange,
  MacroDelta,
  MenuItem,
  RestaurantAddons,
} from "@/types/menu";
import { useCart } from "@/stores/cartStore";
import styles from "./ItemRouteModal.module.css";

const emptyAddon: AddonOption = {
  name: "None",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  image: "none",
};

const sauceRef: AddonRef = "sauces";
const maxSauceSelections = 5;

function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}

function getApplicableCommonChanges(item: MenuItem, commonChanges?: CommonChange[]) {
  if (!commonChanges || commonChanges.length === 0) return [];
  const itemCategories = new Set(
    (item.categories ?? []).map((category) => normalizeCategory(category))
  );

  return commonChanges.filter((change) => {
    const categories = change.appliesTo?.categories;
    if (!categories || categories.length === 0) return false;
    return categories.some((category) => itemCategories.has(normalizeCategory(category)));
  });
}

export default function ItemRouteModal({
  restaurantId,
  restaurantPath,
  item,
  addons,
  commonChanges,
}: {
  restaurantId: string;
  restaurantPath: string;
  item: MenuItem;
  addons?: RestaurantAddons;
  commonChanges?: CommonChange[];
}) {
  const router = useRouter();
  const variants = item.variants?.length ? item.variants : null;
  const defaultVariantId = useMemo(() => {
    if (!variants) return "";
    if (item.defaultVariantId && variants.some((variant) => variant.id === item.defaultVariantId)) {
      return item.defaultVariantId;
    }
    const flaggedDefault = variants.find((variant) => variant.isDefault);
    return flaggedDefault?.id ?? variants[0]?.id ?? "";
  }, [item.defaultVariantId, variants]);
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  const [selectedAddons, setSelectedAddons] = useState<Partial<Record<AddonRef, AddonOption>>>({});
  const [selectedSauceCounts, setSelectedSauceCounts] = useState<Record<string, number>>({});
  const [selectedCommonChangeIds, setSelectedCommonChangeIds] = useState<string[]>([]);
  const [isAddFeedbackVisible, setIsAddFeedbackVisible] = useState(false);
  const { addItem } = useCart();

  const selectedVariant = variants?.find((variant) => variant.id === selectedVariantId);
  const baseNutrition = selectedVariant?.nutrition ?? item.nutrition;
  const applicableCommonChanges = useMemo(
    () => getApplicableCommonChanges(item, commonChanges),
    [item, commonChanges]
  );

  const selectedSauceOptions = useMemo(() => {
    const sauceOptions = addons?.[sauceRef] ?? [];
    return sauceOptions.flatMap((addon) =>
      Array.from({ length: selectedSauceCounts[addon.name] ?? 0 }, () => addon)
    );
  }, [addons, selectedSauceCounts]);

  const addonTotals = useMemo(
    () =>
      [...Object.values(selectedAddons), ...selectedSauceOptions].reduce(
        (sum, addon) => ({
          calories: sum.calories + (addon?.calories ?? 0),
          protein: sum.protein + (addon?.protein ?? 0),
          carbs: sum.carbs + (addon?.carbs ?? 0),
          fat: sum.fat + (addon?.fat ?? 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [selectedAddons, selectedSauceOptions]
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
    calories: baseNutrition.calories + addonTotals.calories + commonChangeTotals.calories,
    protein: baseNutrition.protein + addonTotals.protein + commonChangeTotals.protein,
    carbs: baseNutrition.carbs + addonTotals.carbs + commonChangeTotals.carbs,
    totalFat: baseNutrition.totalFat + addonTotals.fat + commonChangeTotals.fat,
  };

  const optionsLabel = useMemo(() => {
    const dressingSegments = Object.values(selectedAddons)
      .filter((addon): addon is AddonOption => Boolean(addon && addon.name !== "None"))
      .map((addon) => addon.name);
    const sauceSegments = Object.entries(selectedSauceCounts)
      .filter(([, count]) => count > 0)
      .map(([name, count]) => (count === 1 ? name : `${name} x${count}`));

    const segments = [...dressingSegments, ...sauceSegments];
    return segments.length > 0 ? segments.join(" + ") : undefined;
  }, [selectedAddons, selectedSauceCounts]);

  const selectedCommonChanges = useMemo(
    () => applicableCommonChanges.filter((change) => selectedCommonChangeIds.includes(change.id)).map((change) => change.label),
    [applicableCommonChanges, selectedCommonChangeIds]
  );

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.replace(restaurantPath, { scroll: false });
  };

  const handleAddToCart = () => {
    if (isAddFeedbackVisible) return;

    addItem({
      id: crypto.randomUUID(),
      restaurantId,
      itemId: item.id ?? item.name,
      name: item.name,
      variantId: selectedVariant?.id,
      variantLabel: selectedVariant?.label,
      optionsLabel,
      customizations: selectedCommonChanges.length ? selectedCommonChanges : undefined,
      quantity: 1,
      macrosPerItem: {
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.totalFat,
      },
    });

    setIsAddFeedbackVisible(true);
    window.setTimeout(() => setIsAddFeedbackVisible(false), 1000);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={item.name}>
      <button type="button" className={styles.backdrop} onClick={handleClose} aria-label="Close item modal" />
      <div className={styles.modal}>
        <button type="button" className={styles.close} onClick={handleClose} aria-label="Close item modal">
          ×
        </button>

        <div className={styles.hero}>
          <h1 className={styles.title}>{item.name}</h1>
          {item.image ? <img className={styles.image} src={item.image} alt={item.name} /> : null}
          <div className={styles.macroSummary}>
            <span>{nutrition.calories} cal</span>
            <span>{nutrition.protein}g protein</span>
            <span>{nutrition.carbs}g carbs</span>
            <span>{nutrition.totalFat}g fats</span>
          </div>
        </div>

        <div className={styles.body}>
          <ItemDetailsPanel
            item={item}
            nutrition={nutrition}
            variants={variants}
            selectedVariantId={selectedVariantId}
            onSelectVariant={setSelectedVariantId}
            addons={addons}
            selectedAddons={selectedAddons}
            onSelectAddon={(ref, addon) => setSelectedAddons((prev) => ({ ...prev, [ref]: addon ?? emptyAddon }))}
            sauceSelectionCounts={selectedSauceCounts}
            onIncrementSauce={(addon) => {
              setSelectedSauceCounts((prev) => {
                const currentTotal = Object.values(prev).reduce((sum, count) => sum + count, 0);
                if (currentTotal >= maxSauceSelections) return prev;
                return { ...prev, [addon.name]: (prev[addon.name] ?? 0) + 1 };
              });
            }}
            onDecrementSauce={(addon) => {
              setSelectedSauceCounts((prev) => {
                const current = prev[addon.name] ?? 0;
                if (current <= 0) return prev;
                const next = { ...prev };
                if (current === 1) delete next[addon.name];
                else next[addon.name] = current - 1;
                return next;
              });
            }}
            onToggleSauce={(addon) => {
              setSelectedSauceCounts((prev) => {
                if (addon.name === "None") return {};
                const current = prev[addon.name] ?? 0;
                if (current > 0) {
                  const next = { ...prev };
                  delete next[addon.name];
                  return next;
                }
                const currentTotal = Object.values(prev).reduce((sum, count) => sum + count, 0);
                if (currentTotal >= maxSauceSelections) return prev;
                return { ...prev, [addon.name]: 1 };
              });
            }}
            commonChanges={applicableCommonChanges}
            selectedCommonChangeIds={selectedCommonChangeIds}
            onToggleCommonChange={(changeId) =>
              setSelectedCommonChangeIds((prev) =>
                prev.includes(changeId) ? prev.filter((id) => id !== changeId) : [...prev, changeId]
              )
            }
            customizationTotals={commonChangeTotals}
            showCustomizationDeltas
          />
        </div>

        <div className={styles.stickyBar}>
          <button type="button" className={styles.addButton} onClick={handleAddToCart}>
            {isAddFeedbackVisible ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
