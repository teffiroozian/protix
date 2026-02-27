"use client";

import { useEffect, useMemo, useState } from "react";
import { useRestaurantSearch } from "@/components/RestaurantSearchContext";
import type { AddonRef, CommonChange, MenuItem, RestaurantAddons } from "@/types/menu";
import ControlsRow, {
  type Filters,
  type SortOption,
  type ViewOption,
} from "./ControlsRow";
import {
  categorySectionId,
  getCategoryLabel,
  getOrderedMenuSections,
} from "./MenuSections";
import MenuSections from "./MenuSections";
import StickyRestaurantBar from "./StickyRestaurantBar";

export default function RestaurantView({
  restaurantId,
  restaurantName,
  restaurantLogo,
  items,
  addons,
  commonChanges,
}: {
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  items: MenuItem[];
  addons?: RestaurantAddons;
  commonChanges?: CommonChange[];
  autoScrollOnViewChange?: boolean;
}) {
  const view: ViewOption = "menu";
  const [entireMenu, setEntireMenu] = useState(false);
  const [sort, setSort] = useState<SortOption>("highest-protein");
  const [filters, setFilters] = useState<Filters>({});
  const { searchOpen, searchQuery, setSearchQuery, openSearch, closeSearch } =
    useRestaurantSearch();

  const addonItems = useMemo<MenuItem[]>(() => {
    if (!addons) return [];

    const categoryByAddonRef: Record<AddonRef, string> = {
      sauces: "Dipping Sauces",
      dressings: "Dressings",
    };

    return (Object.entries(addons) as [AddonRef, NonNullable<RestaurantAddons[AddonRef]>][])
      .flatMap(([addonRef, options]) =>
        options.map((option) => ({
          id: `${restaurantId}-${addonRef}-${option.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: option.name,
          nutrition: {
            calories: option.calories,
            protein: option.protein,
            carbs: option.carbs,
            totalFat: option.fat,
            satFat: option.satFat,
            transFat: option.transFat,
            cholesterol: option.cholesterol,
            sodium: option.sodium,
            fiber: option.fiber,
            sugars: option.sugars,
          },
          categories: [categoryByAddonRef[addonRef]],
          portionType: "addon",
          image: option.image,
        }))
      );
  }, [addons, restaurantId]);

  const allItems = useMemo(() => [...items, ...addonItems], [items, addonItems]);

  const calorieBounds = useMemo(() => {
    if (!allItems.length) {
      return { min: 0, max: 0 };
    }

    const calories = allItems.map((item) => item.nutrition.calories);
    const minCal = Math.min(...calories);
    const maxCal = Math.max(...calories);

    return {
      min: Math.floor(minCal / 50) * 50,
      max: Math.ceil(maxCal / 50) * 50,
    };
  }, [allItems]);

  const searchTerms = searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (filters.proteinMin && item.nutrition.protein < filters.proteinMin) {
        return false;
      }
      if (filters.caloriesMax && item.nutrition.calories > filters.caloriesMax) {
        return false;
      }
      if (!searchTerms.length) {
        return true;
      }

      const itemCategories = item.categories?.length ? item.categories : ["Other"];

      const categoryVariants = itemCategories.flatMap((rawCategory) => {
        const category = rawCategory.toLowerCase();
        const categoryLabel = getCategoryLabel(rawCategory).toLowerCase();
        return [category, categoryLabel];
      }).flatMap((value) => {
        const trimmed = value.trim();
        if (!trimmed) return [];
        if (trimmed.endsWith("s")) {
          return [trimmed, trimmed.slice(0, -1)];
        }
        return [trimmed, `${trimmed}s`];
      });

      const searchableText = [item.name.toLowerCase(), ...categoryVariants].join(" ");
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [allItems, filters, searchTerms]);

  const orderedSections = useMemo(
    () => getOrderedMenuSections(filteredItems),
    [filteredItems]
  );
  const [activeCategory, setActiveCategory] = useState<string>(
    () => orderedSections[0] ?? ""
  );

  const resolvedActiveCategory = orderedSections.includes(activeCategory)
    ? activeCategory
    : (orderedSections[0] ?? "");

  const categoryOptions = useMemo(
    () =>
      orderedSections.map((section) => ({
        id: section,
        label: getCategoryLabel(section),
      })),
    [orderedSections]
  );

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    const section = document.getElementById(categorySectionId(categoryId));
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  useEffect(() => {
    if (entireMenu || orderedSections.length === 0) {
      return;
    }

    const sectionElements = orderedSections
      .map((sectionId) => document.getElementById(categorySectionId(sectionId)))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      () => {
        const viewportHeight = window.innerHeight;
        const candidates = sectionElements
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const visibleHeight = Math.max(
              0,
              Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
            );
            const ratio = rect.height > 0 ? visibleHeight / rect.height : 0;

            return {
              id: element.id.replace("menu-section-", ""),
              ratio,
              topDistance: Math.abs(rect.top),
            };
          })
          .filter((candidate) => candidate.ratio > 0);

        if (candidates.length === 0) {
          return;
        }

        candidates.sort((a, b) => {
          if (b.ratio !== a.ratio) {
            return b.ratio - a.ratio;
          }

          return a.topDistance - b.topDistance;
        });

        const nextActive = candidates[0]?.id;
        if (nextActive && nextActive !== activeCategory) {
          setActiveCategory(nextActive);
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: "-120px 0px -35% 0px",
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [activeCategory, entireMenu, orderedSections]);

  const handleSortChange = (nextSort: SortOption) => {
    setSort(nextSort);
  };

  const noopChangeView = () => {};

  return (
    <div>
      <StickyRestaurantBar
        restaurantName={restaurantName}
        restaurantLogo={restaurantLogo}
        view={view}
        onChange={noopChangeView}
        sort={sort}
        onSortChange={handleSortChange}
        filters={filters}
        onFiltersChange={setFilters}
        categoryOptions={categoryOptions}
        activeCategory={resolvedActiveCategory}
        onCategorySelect={handleCategorySelect}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSearch={openSearch}
        onCloseSearch={closeSearch}
        entireMenu={entireMenu}
        onEntireMenuChange={setEntireMenu}
        calorieBounds={calorieBounds}
      />

      <ControlsRow
        view={view}
        onChange={noopChangeView}
        sort={sort}
        onSortChange={handleSortChange}
        filters={filters}
        onFiltersChange={setFilters}
        restaurantName={restaurantName}
        restaurantLogo={restaurantLogo}
        categoryOptions={categoryOptions}
        activeCategory={resolvedActiveCategory}
        onCategorySelect={handleCategorySelect}
        wrapperId="controls-row"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showBranding={false}
        entireMenu={entireMenu}
        onEntireMenuChange={setEntireMenu}
        calorieBounds={calorieBounds}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px minmax(0, 1fr)",
          gap: 24,
          alignItems: "start",
          marginTop: 16,
        }}
      >
        <aside style={{ position: "sticky", top: 90, paddingTop: 32 }}>
          <nav aria-label="Menu categories" style={{ display: "grid", gap: 8 }}>
            {categoryOptions.map((option) => {
              const isActive = option.id === resolvedActiveCategory;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleCategorySelect(option.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,0.16)",
                    background: isActive ? "rgba(0,0,0,0.85)" : "white",
                    color: isActive ? "white" : "rgba(0,0,0,0.85)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div style={{ minWidth: 0 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <MenuSections
              restaurantId={restaurantId}
              items={filteredItems}
              sort={sort}
              addons={addons}
              commonChanges={commonChanges}
              groupByCategory={!entireMenu}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
