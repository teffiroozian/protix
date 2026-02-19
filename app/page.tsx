"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import restaurants from "./data/index.json";

const RECENT_RESTAURANTS_KEY = "recentlySearchedRestaurants";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [recentRestaurantIds, setRecentRestaurantIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored = window.localStorage.getItem(RECENT_RESTAURANTS_KEY);
      const parsed = stored ? (JSON.parse(stored) as string[]) : [];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(Boolean).slice(0, 3);
    } catch {
      return [];
    }
  });

  const recentRestaurants = useMemo(
    () =>
      recentRestaurantIds
        .map((id) => restaurants.find((restaurant) => restaurant.id === id))
        .filter((restaurant): restaurant is (typeof restaurants)[number] =>
          Boolean(restaurant)
        )
        .slice(0, 3),
    [recentRestaurantIds]
  );

  const popularRestaurants = useMemo(() => {
    const recentIdSet = new Set(recentRestaurants.map((restaurant) => restaurant.id));

    return restaurants
      .filter((restaurant) => !recentIdSet.has(restaurant.id))
      .slice(0, 10);
  }, [recentRestaurants]);

  const filteredSuggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return restaurants
      .filter((restaurant) =>
        restaurant.name.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 10);
  }, [query]);

  const groupedRestaurants = useMemo(() => {
    const sorted = [...restaurants].sort((a, b) => a.name.localeCompare(b.name));
    const grouped = new Map<string, (typeof restaurants)[number][]>();

    sorted.forEach((restaurant) => {
      const firstLetter = restaurant.name.charAt(0).toUpperCase();
      const existing = grouped.get(firstLetter) ?? [];
      existing.push(restaurant);
      grouped.set(firstLetter, existing);
    });

    return Array.from(grouped.entries());
  }, []);

  const isEmptyFocusedState = isFocused && !query.trim();
  const suggestions = isEmptyFocusedState
    ? [...recentRestaurants, ...popularRestaurants]
    : filteredSuggestions;

  const showSuggestions = isFocused && suggestions.length > 0;

  const handleSelect = (restaurant: (typeof restaurants)[number]) => {
    setQuery(restaurant.name);
    setActiveIndex(-1);
    setIsFocused(false);
    router.push(`/restaurant/${restaurant.id}`, { scroll: true });
  };

  const handleClear = () => {
    setQuery("");
    setActiveIndex(-1);
  };

  const handleRemoveRecent = (restaurantId: string) => {
    setRecentRestaurantIds((prev) => {
      const next = prev.filter((id) => id !== restaurantId);

      try {
        window.localStorage.setItem(RECENT_RESTAURANTS_KEY, JSON.stringify(next));
      } catch {
        // Ignore localStorage write errors.
      }

      return next;
    });
    setActiveIndex(-1);
  };

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
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setActiveIndex(-1);
            }}
            onKeyDown={(event) => {
              if (!showSuggestions) {
                return;
              }

              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((prev) =>
                  Math.min(prev + 1, suggestions.length - 1)
                );
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, 0));
              }

              if (event.key === "Enter" && activeIndex >= 0) {
                event.preventDefault();
                handleSelect(suggestions[activeIndex]);
              }
            }}
            placeholder="Start typing a restaurant name"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 pr-16 text-base text-neutral-900 shadow-inner outline-none transition focus:border-black/30 focus:ring-4 focus:ring-black/5"
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
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-11 flex items-center rounded-full px-1 text-neutral-400 transition hover:text-neutral-600"
              aria-label="Clear search"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m7 7 10 10M17 7 7 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
              <ul role="listbox" className="max-h-60 overflow-y-auto py-2">
                {isEmptyFocusedState ? (
                  <>
                    {recentRestaurants.length > 0 && (
                      <li className="px-4 py-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                        Recently Searched
                      </li>
                    )}
                    {recentRestaurants.map((restaurant, index) => (
                      <li
                        key={restaurant.id}
                        role="option"
                        aria-selected={activeIndex === index}
                        className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 ${
                          activeIndex === index ? "bg-neutral-100" : ""
                        }`}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSelect(restaurant)}
                      >
                        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                          <Image
                            src={restaurant.logo}
                            alt=""
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </span>
                        <span className="font-semibold text-neutral-900">
                          {restaurant.name}
                        </span>
                        <button
                          type="button"
                          className="ml-auto rounded-full p-1 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRemoveRecent(restaurant.id);
                          }}
                          aria-label={`Remove ${restaurant.name} from recent searches`}
                        >
                          <svg
                            aria-hidden="true"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="m7 7 10 10M17 7 7 17"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}

                    <li className="px-4 py-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Popular Restaurant
                    </li>
                    {popularRestaurants.map((restaurant, index) => {
                      const absoluteIndex = recentRestaurants.length + index;
                      return (
                        <li
                          key={restaurant.id}
                          role="option"
                          aria-selected={activeIndex === absoluteIndex}
                          className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 ${
                            activeIndex === absoluteIndex ? "bg-neutral-100" : ""
                          }`}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSelect(restaurant)}
                        >
                          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                            <Image
                              src={restaurant.logo}
                              alt=""
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </span>
                          <span className="font-semibold text-neutral-900">
                            {restaurant.name}
                          </span>
                        </li>
                      );
                    })}
                  </>
                ) : (
                  filteredSuggestions.map((restaurant, index) => (
                    <li
                      key={restaurant.id}
                      role="option"
                      aria-selected={activeIndex === index}
                      className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 ${
                        activeIndex === index ? "bg-neutral-100" : ""
                      }`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(restaurant)}
                    >
                      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                        <Image
                          src={restaurant.logo}
                          alt=""
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </span>
                      <span className="font-semibold text-neutral-900">
                        {restaurant.name}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="mt-32 flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-900">
            Macro Friendly Restaurants
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Explore the full list while using search suggestions above.
          </p>
        </div>
        <section className="grid gap-4 sm:grid-cols-2">
          {restaurants
            .filter((restaurant) => restaurant.isMacroFriendly)
            .map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurant/${restaurant.id}`}
                scroll
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
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-900">All Restaurants</h2>
        </div>

        <div className="space-y-6">
          {groupedRestaurants.map(([letter, items]) => (
            <section key={letter} className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                {letter}
              </h3>
              <div className="space-y-2">
                {items.map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    href={`/restaurant/${restaurant.id}`}
                    scroll
                    className="flex w-full items-center gap-3 rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm transition hover:bg-neutral-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                      <Image
                        src={restaurant.logo}
                        alt={`${restaurant.name} logo`}
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </span>
                    <span className="text-sm font-semibold text-neutral-900">
                      {restaurant.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
