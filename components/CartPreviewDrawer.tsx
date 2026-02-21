"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/stores/cartStore";
import { useRestaurantUi } from "@/components/RestaurantUiContext";

export default function CartPreviewDrawer() {
  const { isCartOpen, closeCart } = useRestaurantUi();
  const { items, totals, removeItem } = useCart();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener("keydown", onKeyDown);
    }

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen, closeCart]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[120] bg-slate-900/30 transition ${
          isCartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />
      <aside
        className={`fixed right-0 top-0 z-[125] h-full w-full max-w-md border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-slate-900">Cart preview</h2>
            <button type="button" onClick={closeCart} className="rounded-full border border-slate-200 px-2 py-1 text-sm">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {items.length === 0 ? (
              <p className="text-sm text-slate-600">Your cart is empty.</p>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="rounded-xl border border-slate-200 p-3">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-600">Qty {item.quantity} • {item.macrosPerItem.calories} cal each</p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-2 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-slate-200 px-4 py-4">
            <p className="text-sm font-semibold text-slate-900">Total macros</p>
            <p className="mt-1 text-sm text-slate-700">{totals.calories} cal • {totals.protein}P • {totals.carbs}C • {totals.fat}F</p>
            <Link href="/cart" onClick={closeCart} className="mt-3 inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800">
              Open full cart
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
