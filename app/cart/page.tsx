export default function CartPage() {
  const placeholderTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  const placeholderItems: unknown[] = [];

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
            <dd className="font-semibold">{placeholderTotals.calories}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-black/5 px-3 py-2">
            <dt className="text-neutral-600">Protein</dt>
            <dd className="font-semibold">{placeholderTotals.protein}g</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-black/5 px-3 py-2">
            <dt className="text-neutral-600">Carbs</dt>
            <dd className="font-semibold">{placeholderTotals.carbs}g</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-black/5 px-3 py-2">
            <dt className="text-neutral-600">Fat</dt>
            <dd className="font-semibold">{placeholderTotals.fat}g</dd>
          </div>
        </dl>
      </section>

      <hr className="border-black/10" />

      <section className="rounded-2xl border border-black/10 bg-white px-5 py-8 text-center shadow-sm">
        {placeholderItems.length === 0 ? (
          <>
            <p className="text-lg font-medium text-neutral-900">Your cart is empty.</p>
            <p className="mt-2 text-sm text-neutral-600">
              Add items from a restaurant to see combined macros.
            </p>
          </>
        ) : null}
      </section>

      <div>
        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center rounded-xl border border-black/15 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-500"
        >
          Clear Cart
        </button>
      </div>
    </main>
  );
}
