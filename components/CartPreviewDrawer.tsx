"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import restaurants from "@/app/data/index.json";
import { useRestaurantUi } from "@/components/RestaurantUiContext";
import { useCart } from "@/stores/cartStore";

const formatMacro = (label: string, value: number) => `${value}${label}`;

const joinLabels = (labels: string[]) => labels.filter(Boolean).join(" • ");

const getModifiersLine = (modifiers: unknown): string[] => {
  if (!modifiers) {
    return [];
  }

  if (Array.isArray(modifiers)) {
    return modifiers
      .map((modifier) => {
        if (!modifier) return null;

        if (typeof modifier === "string") {
          return modifier.trim();
        }

        if (
          typeof modifier === "object" &&
          "label" in modifier &&
          typeof modifier.label === "string"
        ) {
          return modifier.label.trim();
        }

        if (
          typeof modifier === "object" &&
          "name" in modifier &&
          typeof modifier.name === "string"
        ) {
          return modifier.name.trim();
        }

        return null;
      })
      .filter((modifier): modifier is string => Boolean(modifier));
  }

  if (typeof modifiers === "string") {
    return modifiers
      .split("•")
      .map((modifier) => modifier.trim())
      .filter(Boolean);
  }

  return [];
};

export default function CartPreviewDrawer() {
  const { isCartOpen, closeCart } = useRestaurantUi();
  const { items, totals, updateQuantity, clearCart } = useCart();

  const activeRestaurant = useMemo(() => {
    const activeRestaurantId = items[0]?.restaurantId;

    if (!activeRestaurantId) {
      return null;
    }

    return (
      restaurants.find((restaurant) => restaurant.id === activeRestaurantId) ??
      null
    );
  }, [items]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isCartOpen, closeCart]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[120] bg-slate-900/30 transition ${
          isCartOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />

      <aside
        className={`fixed right-0 top-0 z-[125] h-full w-full max-w-md border-l border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        <div className="flex h-full flex-col">
          <header className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  {activeRestaurant?.logo ? (
                    <Image
                      src={activeRestaurant.logo}
                      alt={activeRestaurant.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-600">
                      {activeRestaurant?.name?.[0] ?? "C"}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-900">
                    {activeRestaurant?.name ?? "Your cart"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Items: {items.length}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-sm text-slate-700 transition hover:bg-slate-100"
                aria-label="Close cart panel"
              >
                ✕
              </button>
            </div>
          </header>

          <section className="flex-1 overflow-y-auto px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Items
            </p>
            <div className="mt-2 border-t border-slate-200" />

            {items.length === 0 ? (
              <p className="py-6 text-sm text-slate-600">Your cart is empty.</p>
            ) : (
              <ul className="mt-3 space-y-3 pb-2">
                {items.map((item) => {
                  const itemTitle = item.variantLabel
                    ? `${item.name} • ${item.variantLabel}`
                    : item.name;
                  const modifierLabels = getModifiersLine(
                    (item as { modifiers?: unknown }).modifiers,
                  );
                  const addOnLabels = item.optionsLabel
                    ? item.optionsLabel
                        .split("+")
                        .map((option) => option.trim())
                        .filter(Boolean)
                    : [];
                  const addOnsLine = joinLabels([
                    ...addOnLabels,
                    ...modifierLabels,
                  ]);

                  return (
                    <li
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 gap-3">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600">
                            {item.name[0]}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900">
                              {itemTitle}
                            </p>

                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                              <span>{item.macrosPerItem.calories} cal</span>
                              <span>
                                {formatMacro(
                                  "g protein",
                                  item.macrosPerItem.protein,
                                )}
                              </span>
                              <span>
                                {formatMacro(
                                  "g carbs",
                                  item.macrosPerItem.carbs,
                                )}
                              </span>
                              <span>
                                {formatMacro("g fat", item.macrosPerItem.fat)}
                              </span>
                            </div>

                            {addOnsLine ? (
                              <p className="mt-1 text-[11px] font-medium text-slate-500/80">
                                + {addOnsLine}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="inline-flex size-7 items-center justify-center rounded-full text-sm font-semibold text-slate-700 transition hover:bg-white"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </button>
                          <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="inline-flex size-7 items-center justify-center rounded-full text-sm font-semibold text-slate-700 transition hover:bg-white"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="shrink-0 border-t border-slate-200 px-5 py-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Total Macros
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                <div className="rounded-xl border border-slate-200 bg-white px-2 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Calories
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {totals.calories}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-2 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Protein
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {totals.protein}g
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-2 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Carbs
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {totals.carbs}g
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-2 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Fat
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {totals.fat}g
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={clearCart}
                disabled={items.length === 0}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear Cart
              </button>
              <Link
                href="/cart"
                onClick={closeCart}
                className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Open Full Cart
              </Link>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
