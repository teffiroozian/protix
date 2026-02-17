"use client";

import { useCart } from "@/stores/cartStore";

export default function CartPage() {
  const { items, totals, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Calorie Cart
        </h1>
      </header>

      <section className="rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-sm">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500">
          Totals
        </h2>
        <dl className="grid gap-2 text-base text-neutral-800 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-black/5 px-3 py-2">
            <dt className="text-neutral-600">Calories</dt>
            <dd className="font-semibold">{totals.calories}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-black/5 px-3 py-2">
            <dt className="text-neutral-600">Protein</dt>
            <dd className="font-semibold">{totals.protein}g</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-black/5 px-3 py-2">
            <dt className="text-neutral-600">Carbs</dt>
            <dd className="font-semibold">{totals.carbs}g</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-black/5 px-3 py-2">
            <dt className="text-neutral-600">Fat</dt>
            <dd className="font-semibold">{totals.fat}g</dd>
          </div>
        </dl>
      </section>

      <hr className="border-black/10" />

      <section className="rounded-2xl border border-black/10 bg-white px-5 py-6 shadow-sm">
        {items.length === 0 ? (
          <div className="py-2 text-center">
            <p className="text-lg font-medium text-neutral-900">Your cart is empty.</p>
            <p className="mt-2 text-sm text-neutral-600">
              Add items from a restaurant to see combined macros.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {items.map((item, index) => (
              <li key={item.id} className="rounded-xl border border-black/10 px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900">
                      [{index + 1}] {item.name}
                      {item.variantLabel ? ` (${item.variantLabel})` : ""}
                      {item.optionsLabel ? ` + ${item.optionsLabel}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {item.macrosPerItem.calories} cal | {item.macrosPerItem.protein}P | {item.macrosPerItem.carbs}C | {item.macrosPerItem.fat}F
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="rounded-md border border-black/15 px-2 py-1 text-sm text-neutral-700"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>
                    <span className="min-w-5 text-center text-sm font-medium text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded-md border border-black/15 px-2 py-1 text-sm text-neutral-700"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-sm font-medium text-neutral-600 underline underline-offset-2"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div>
        <button
          type="button"
          onClick={clearCart}
          disabled={items.length === 0}
          className="inline-flex items-center rounded-xl border border-black/15 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 disabled:cursor-not-allowed disabled:text-neutral-500"
        >
          Clear Cart
        </button>
      </div>
    </main>
  );
}
