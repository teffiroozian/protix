"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import restaurants from "./data/index.json";

export default function Home() {
  const [query, setQuery] = useState("");

  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return restaurants;
    }

    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-4 py-14 sm:px-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          High Protein Fast Food Finder
        </h1>
        <p className="text-base text-neutral-600 sm:text-lg">
          Pick a restaurant to see the best high-protein options.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <div className="relative">
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Start typing a restaurant name"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 pr-12 text-base text-neutral-900 shadow-inner outline-none transition focus:border-black/30 focus:ring-4 focus:ring-black/5"
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-400">
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        {filteredRestaurants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/15 bg-white/70 px-6 py-10 text-center text-sm text-neutral-500">
            No results. Try a different search.
          </div>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurant/${restaurant.id}`}
                className="group"
              >
                <article className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={restaurant.cover}
                      alt={`${restaurant.name} cover`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-3 border-t border-black/5 bg-white/80 px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl">
                      <Image
                        src={restaurant.logo}
                        alt={`${restaurant.name} logo`}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-base font-semibold text-neutral-900">
                      {restaurant.name}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
