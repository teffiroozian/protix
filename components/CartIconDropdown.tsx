"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/stores/cartStore";
import { useRestaurantUi } from "@/components/RestaurantUiContext";

type CartIconDropdownProps = {
  buttonClassName: string;
  countFormat?: "compact" | "parenthesized";
};

const SCROLL_CLOSE_THRESHOLD = 30;

export default function CartIconDropdown({
  buttonClassName,
  countFormat = "compact",
}: CartIconDropdownProps) {
  const { openCart } = useRestaurantUi();
  const { items, totals, lastAddedItem, lastAddedAt } = useCart();
  const [manualOpen, setManualOpen] = useState(false);
  const [dismissedAddedAt, setDismissedAddedAt] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const openScrollYRef = useRef<number | null>(null);
  const isOpen = manualOpen || (lastAddedAt !== null && lastAddedAt !== dismissedAddedAt);

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setManualOpen(false);
        if (lastAddedAt !== null) {
          setDismissedAddedAt(lastAddedAt);
        }
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen, lastAddedAt]);

  useEffect(() => {
    if (!isOpen) {
      openScrollYRef.current = null;
      return;
    }

    openScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      if (openScrollYRef.current === null) {
        openScrollYRef.current = window.scrollY;
        return;
      }

      if (Math.abs(window.scrollY - openScrollYRef.current) > SCROLL_CLOSE_THRESHOLD) {
        setManualOpen(false);
        if (lastAddedAt !== null) {
          setDismissedAddedAt(lastAddedAt);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, lastAddedAt]);

  const countLabel =
    cartCount > 0
      ? countFormat === "parenthesized"
        ? `🛒 (${cartCount})`
        : `🛒 ${cartCount}`
      : "🛒";

  const itemMeta = [lastAddedItem?.variantLabel, lastAddedItem?.optionsLabel]
    .filter(Boolean)
    .join(" • ");

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (isOpen) {
            setManualOpen(false);
            if (lastAddedAt !== null) {
              setDismissedAddedAt(lastAddedAt);
            }
            return;
          }

          setManualOpen(true);
        }}
        className={buttonClassName}
        aria-label={cartCount > 0 ? `Cart (${cartCount})` : "Cart"}
        aria-expanded={isOpen}
      >
        {countLabel}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.30)]">
          <div className="space-y-1 border-b border-slate-200 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Just added</p>
            {lastAddedItem ? (
              <>
                <p className="text-sm font-semibold text-slate-900">{lastAddedItem.name}</p>
                {itemMeta ? <p className="text-xs text-slate-600">{itemMeta}</p> : null}
                <p className="text-xs text-slate-600">
                  {lastAddedItem.macrosPerItem.calories} cal • {lastAddedItem.macrosPerItem.protein}g protein
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-600">Your cart is empty.</p>
            )}
          </div>

          <div className="space-y-1 border-b border-slate-200 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Totals</p>
            <p className="text-sm text-slate-800">{totals.calories} calories</p>
            <p className="text-xs text-slate-600">
              {totals.protein}g protein • {totals.carbs}g carbs • {totals.fat}g fat
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                openCart();
                setManualOpen(false);
                if (lastAddedAt !== null) {
                  setDismissedAddedAt(lastAddedAt);
                }
              }}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Open Cart
            </button>
            <Link
              href="/cart"
              onClick={() => {
                setManualOpen(false);
                if (lastAddedAt !== null) {
                  setDismissedAddedAt(lastAddedAt);
                }
              }}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              View Full Page
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
