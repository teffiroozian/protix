"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/stores/cartStore";
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
  const gradientClass =
    HERO_GRADIENTS[restaurantSlug] ?? "from-slate-200 via-slate-100 to-white";
  const { items } = useCart();

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <header
        className={`rounded-3xl border-2 border-slate-800/20 bg-gradient-to-r ${gradientClass} shadow-sm`}
      >
        <div className="flex w-full max-w-5xl flex-col gap-6 px-6 pb-10 pt-8 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
            >
              <span className="text-base">←</span>
              Back to home
            </Link>

            <Link
              href="/cart"
              className="inline-flex items-center rounded-full border border-slate-700/20 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-800 transition hover:bg-white"
            >
              {cartCount > 0 ? `Cart (${cartCount})` : "Cart"}
            </Link>
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
