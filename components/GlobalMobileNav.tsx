"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, House, PanelTopOpen, ShoppingCart, X } from "lucide-react";
import restaurants from "@/app/data/index.json";

export default function GlobalMobileNav({
  title = "Macro Maxxer",
  logoSrc = "/favicon.ico",
}: {
  title?: string;
  logoSrc?: string;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(false);
  const featuredRestaurants = restaurants.filter((restaurant) => restaurant.isMacroFriendly).slice(0, 5);

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[95] lg:hidden" data-global-nav="true">
        <div className="relative z-[110] mx-auto mt-1 flex w-[calc(100%-0.5rem)] max-w-6xl items-center rounded-2xl border border-slate-200/70 bg-white shadow-[0_-3px_12px_rgba(15,23,42,0.12)] backdrop-blur sm:w-[calc(100%-1rem)]">
          <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
            <button
              type="button"
              onClick={() => {
                setIsFeaturedOpen(false);
                setIsDrawerOpen(true);
              }}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300/80 bg-white text-slate-800"
              aria-label="Open restaurant menu"
            >
              <PanelTopOpen className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <Link href="/" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300/80 bg-white text-slate-800" aria-label="Go to homepage">
              <House className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-slate-300/80 bg-white">
                <Image src={logoSrc} alt={`${title} logo`} fill className="object-contain rounded-md" />
              </span>
              <span className="truncate text-base font-semibold text-slate-900">{title}</span>
            </div>
            <div className="ml-auto">
              <Link href="/cart" className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-slate-300/80 bg-white px-2.5 text-slate-800" aria-label="Open cart">
                <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-[210] lg:hidden" aria-modal="true" role="dialog">
          <button type="button" className="absolute inset-0 bg-black/35" onClick={() => setIsDrawerOpen(false)} aria-label="Close drawer" />
          <div className="absolute inset-y-0 left-0 flex w-[min(90vw,360px)] flex-col bg-white shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
              <h3 className="text-lg font-bold text-black/90">Restaurants</h3>
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="rounded-full border border-black/15 p-2 text-black/70">
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
            <div className="space-y-2.5 p-4">
              <button type="button" onClick={() => setIsFeaturedOpen((prev) => !prev)} className="flex w-full items-center justify-between text-left">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-black/50">Featured Restaurants</h4>
                <ChevronDown className={`h-4 w-4 text-black/60 transition-transform ${isFeaturedOpen ? "rotate-180" : ""}`} strokeWidth={2.5} />
              </button>
              {isFeaturedOpen ? (
                <div className="grid gap-1.5">
                  {featuredRestaurants.map((restaurant) => (
                    <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`} onClick={() => setIsDrawerOpen(false)} className="inline-flex items-center justify-between rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm font-semibold text-black/85">
                      <span className="inline-flex min-w-0 items-center gap-2.5">
                        <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md border border-black/10 bg-white">
                          <Image src={restaurant.logo} alt={`${restaurant.name} logo`} fill className="object-cover" />
                        </span>
                        <span className="truncate">{restaurant.name}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-black/50" strokeWidth={2.5} />
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
