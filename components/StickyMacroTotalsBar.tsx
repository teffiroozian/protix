"use client";

import type { CartMacros } from "@/stores/cartStore";

type StickyMacroTotalsBarProps = {
  totals: CartMacros;
  visible: boolean;
  onSaveMeal?: () => void;
  onGenerateSnapshot?: () => void;
};

const macroRows: Array<{ key: keyof CartMacros; label: string; unit?: string }> = [
  { key: "calories", label: "Calories" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbs", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
];

export default function StickyMacroTotalsBar({
  totals,
  visible,
  onSaveMeal,
  onGenerateSnapshot,
}: StickyMacroTotalsBarProps) {
  return (
    <div className={`fixed inset-x-0 bottom-4 z-40 px-4 transition-all duration-300 ease-out sm:px-6 ${visible ? "pointer-events-none translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
      <div className={`mx-auto w-full max-w-6xl rounded-3xl border border-black/10 bg-white/95 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.2)] backdrop-blur transition-all duration-300 ${visible ? "pointer-events-auto" : "pointer-events-none"}`}>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
          Total Macros
        </p>

        <div className="mt-3 grid grid-cols-4 gap-3 text-center">
          {macroRows.map((macro) => (
            <div key={macro.key} className="rounded-xl border border-black/10 bg-neutral-50 px-3 py-2">
              <p className="text-xl font-semibold text-neutral-900 sm:text-2xl">
                {totals[macro.key]}
                {macro.unit ?? ""}
              </p>
              <p className="text-xs uppercase tracking-wide text-neutral-500">{macro.label}</p>
            </div>
          ))}
        </div>

        <div className="my-4 h-px w-full bg-black/10" />

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onSaveMeal}
            className="rounded-xl border border-black/15 bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-200"
          >
            Save Meal
          </button>
          <button
            type="button"
            onClick={onGenerateSnapshot}
            className="rounded-xl border border-black/90 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
          >
            Generate Snapshot
          </button>
        </div>
      </div>
    </div>
  );
}
