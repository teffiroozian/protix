"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/stores/cartStore";
import { useRestaurantSearch } from "@/components/RestaurantSearchContext";
const HERO_GRADIENTS: Record<string, string> = {
  chickfila: "from-red-200 to-orange-200",
  chipotle: "from-red-200 via-amber-100 to-orange-100",
  panera: "from-amber-200 via-orange-100 to-rose-100",
  mcdonalds: "from-amber-200 via-yellow-100 to-orange-100",
  starbucks: "from-emerald-200 via-green-100 to-lime-100",
  habit: "from-orange-200 via-amber-100 to-rose-100",
  panda: "from-rose-200 via-red-100 to-orange-100",
  mod: "from-slate-200 via-zinc-100 to-stone-100",
  subway: "from-emerald-200 via-lime-100 to-amber-100",
};

const DEFAULT_TAGS = [
  { id: "high-protein", label: "High Protein", href: "#high-protein" },
  { id: "best-ratio", label: "Best Ratio", href: "#best-protein-ratio" },
  { id: "lowest-cal", label: "Lowest Cal", href: "#lowest-calorie" },
];

type TagOption = {
  id: string;
  label: string;
  href: string;
};

type RestaurantHeaderProps = {
  name: string;
  logo: string;
  subtitle?: string;
  restaurantSlug: string;
  tags?: TagOption[];
};

export default function RestaurantHeader({
  name,
  logo,
  subtitle = "Find the best & smartest high-protein items on the menu.",
  restaurantSlug,
  tags = DEFAULT_TAGS,
}: RestaurantHeaderProps) {
  void tags;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { items } = useCart();
  const { searchQuery, setSearchQuery } = useRestaurantSearch();

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  const gradientClass =
    HERO_GRADIENTS[restaurantSlug] ?? "from-slate-200 via-slate-100 to-white";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <header
        className={`rounded-3xl border-2 border-slate-800/20 bg-gradient-to-r ${gradientClass} shadow-sm`}
      >
        <div className="flex w-full max-w-5xl flex-col gap-6 px-6 pb-10 pt-8 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
            >
              <span className="text-base">←</span>
              Back to home
            </Link>

            <div className="ml-auto flex items-center gap-2">
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isSearchOpen ? "w-[16rem] opacity-100" : "w-0 opacity-0"
                }`}
              >
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search menu items"
                  aria-label="Search menu items"
                  className="h-10 w-full rounded-full border border-slate-900/15 bg-white/95 px-4 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-500 focus:border-slate-900/30"
                />
              </div>

              {isSearchOpen ? (
                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-900/15 bg-white text-base text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  ✕
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openSearch}
                  aria-label="Search menu items"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-base text-white shadow-sm transition hover:bg-slate-800"
                >
                  🔍
                </button>
              )}

              <Link
                href="/cart"
                className="inline-flex h-10 items-center rounded-full border border-slate-900/15 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
                aria-label={cartCount > 0 ? `Cart (${cartCount})` : "Cart"}
              >
                {cartCount > 0 ? `🛒 (${cartCount})` : "🛒"}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/70 bg-white shadow-sm">
              <Image
                src={logo}
                alt={`${name} logo`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              {name}
            </h1>
            <p className="mt-2 text-sm text-slate-700 sm:text-base">
              {subtitle}
            </p>
          </div>

        </div>
      </header>
    </div>
  );
}
