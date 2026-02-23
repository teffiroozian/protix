"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuItem } from "@/types/menu";
import MenuItemCard from "@/components/MenuItemCard";
import StickyMacroTotalsBar from "@/components/StickyMacroTotalsBar";
import restaurants from "@/app/data/index.json";
import chickfilaMenu from "@/app/data/chickfila.json";
import chipotleMenu from "@/app/data/chipotle.json";
import habitMenu from "@/app/data/habit.json";
import mcdonaldsMenu from "@/app/data/mcdonalds.json";
import modMenu from "@/app/data/mod.json";
import pandaMenu from "@/app/data/panda.json";
import paneraMenu from "@/app/data/panera.json";
import starbucksMenu from "@/app/data/starbucks.json";
import subwayMenu from "@/app/data/subway.json";
import { useCart } from "@/stores/cartStore";

const menuLookupByRestaurant: Record<string, MenuItem[]> = {
  chickfila: chickfilaMenu.items,
  chipotle: chipotleMenu.items,
  habit: habitMenu.items,
  mcdonalds: mcdonaldsMenu.items,
  mod: modMenu.items,
  panda: pandaMenu.items,
  panera: paneraMenu.items,
  starbucks: starbucksMenu.items,
  subway: subwayMenu.items,
};

function summarizeItem(item: { variantLabel?: string; optionsLabel?: string; customizations?: string[] }) {
  const segments = [item.variantLabel, item.optionsLabel, ...(item.customizations ?? [])]
    .filter(Boolean)
    .join(" • ");
  return segments || "No customizations";
}

export default function CartPage() {
  const { items, totals, updateQuantity } = useCart();
  const expandedTotalsRef = useRef<HTMLElement | null>(null);
  const [expandedTotalsInView, setExpandedTotalsInView] = useState(false);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const cartRestaurantIds = useMemo(
    () => [...new Set(items.map((item) => item.restaurantId))],
    [items]
  );

  const headerRestaurant = restaurants.find((restaurant) => restaurant.id === cartRestaurantIds[0]);

  const headerTitle = cartRestaurantIds.length > 1 ? "Mixed Restaurants" : (headerRestaurant?.name ?? "Meal Finalization");
  const headerLogo = cartRestaurantIds.length > 1 ? undefined : headerRestaurant?.logo;

  useEffect(() => {
    const node = expandedTotalsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setExpandedTotalsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const showStickyBar = items.length > 0 && !expandedTotalsInView;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 pb-72 pt-8 sm:px-6 sm:pt-10">
      <header className="rounded-3xl border border-black/10 bg-white px-5 py-5 shadow-sm sm:px-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-xl border border-black/10 bg-neutral-50 shadow-sm">
            {headerLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={headerLogo} alt={`${headerTitle} logo`} className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-medium text-neutral-500">LOGO</div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">{headerTitle}</h1>
            <p className="mt-1 text-sm text-neutral-600">[{itemCount}] Items</p>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white px-5 py-8 text-center shadow-sm">
            <p className="text-lg font-medium text-neutral-900">Your cart is empty.</p>
            <p className="mt-2 text-sm text-neutral-600">Add items from a restaurant to start meal finalization.</p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {items.map((cartItem) => {
              const sourceItem =
                menuLookupByRestaurant[cartItem.restaurantId]?.find((item) => (item.id ?? item.name) === cartItem.itemId) ?? null;

              const menuItem: MenuItem = sourceItem ?? {
                id: cartItem.itemId,
                name: cartItem.name,
                category: "Cart",
                portionType: "single",
                nutrition: {
                  calories: cartItem.macrosPerItem.calories,
                  protein: cartItem.macrosPerItem.protein,
                  carbs: cartItem.macrosPerItem.carbs,
                  totalFat: cartItem.macrosPerItem.fat,
                },
              };

              return (
                <MenuItemCard
                  key={cartItem.id}
                  restaurantId={cartItem.restaurantId}
                  item={menuItem}
                  mode="cart"
                  cartQuantity={cartItem.quantity}
                  cartSummaryLine={summarizeItem(cartItem)}
                  onCartDecrement={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                  onCartIncrement={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                />
              );
            })}
          </ul>
        )}
      </section>

      <section ref={expandedTotalsRef} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Meal Breakdown</h2>
          {items.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-600">No meal items yet.</p>
          ) : (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
              {items.map((item) => (
                <li key={`${item.id}-breakdown`}>
                  {item.quantity}x {item.name}
                  {summarizeItem(item) !== "No customizations" ? ` — ${summarizeItem(item)}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-neutral-900">Nutrition Summary</h2>
          <div className="mt-3 rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-black/10 pb-2 text-sm">
                <span>Calories</span>
                <span className="font-semibold">{totals.calories}</span>
              </div>
              <div className="flex items-center justify-between border-b border-black/10 pb-2 text-sm">
                <span>Protein</span>
                <span className="font-semibold">{totals.protein}g</span>
              </div>
              <div className="flex items-center justify-between border-b border-black/10 pb-2 text-sm">
                <span>Carbs</span>
                <span className="font-semibold">{totals.carbs}g</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Fat</span>
                <span className="font-semibold">{totals.fat}g</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white px-4 py-4">
          <h2 className="text-xl font-semibold text-neutral-900">Total Macros</h2>
          <p className="mt-2 text-sm text-neutral-600">Confirming your final totals before saving this meal.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-black/10 px-3 py-2 text-center">
              <p className="text-lg font-semibold">{totals.calories}</p>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Calories</p>
            </div>
            <div className="rounded-xl border border-black/10 px-3 py-2 text-center">
              <p className="text-lg font-semibold">{totals.protein}g</p>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Protein</p>
            </div>
            <div className="rounded-xl border border-black/10 px-3 py-2 text-center">
              <p className="text-lg font-semibold">{totals.carbs}g</p>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Carbs</p>
            </div>
            <div className="rounded-xl border border-black/10 px-3 py-2 text-center">
              <p className="text-lg font-semibold">{totals.fat}g</p>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Fat</p>
            </div>
          </div>
        </div>
      </section>

      <StickyMacroTotalsBar
        totals={totals}
        visible={showStickyBar}
        onSaveMeal={() => window.alert("Save Meal coming soon")}
        onGenerateSnapshot={() => window.alert("Generate Snapshot coming soon")}
      />
    </main>
  );
}
