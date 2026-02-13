"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CommonChange, MenuItem, RestaurantAddons } from "@/types/menu";
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
import TopPicksList from "./TopPicksList";
import StickyRestaurantBar from "./StickyRestaurantBar";

const rankingSectionIdBySort: Record<SortOption, string> = {
  "highest-protein": "high-protein",
  "best-ratio": "best-protein-ratio",
  "lowest-calories": "lowest-calorie",
};

export default function RestaurantView({
  restaurantName,
  restaurantLogo,
  items,
  highestProtein,
  bestCalorieProteinRatio,
  lowestCalorieItems,
  addons,
  commonChanges,
}: {
  restaurantName: string;
  restaurantLogo: string;
  items: MenuItem[];
  highestProtein: MenuItem[];
  bestCalorieProteinRatio: MenuItem[];
  lowestCalorieItems: MenuItem[];
  addons?: RestaurantAddons;
  commonChanges?: CommonChange[];
}) {
  const [view, setView] = useState<ViewOption>("menu");
  const [sort, setSort] = useState<SortOption>("highest-protein");
  const [filters, setFilters] = useState<Filters>({});
  const [searchQuery, setSearchQuery] = useState("");

  const searchTerms = searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (view === "top" && !filters.includeSidesDrinks) {
        if (item.portionType === "drink" || item.portionType === "side") {
          return false;
        }
      }

      if (view === "top" && !filters.includeLargeShareables && item.portionType === "shareable") {
        return false;
      }

      if (filters.proteinMin && item.nutrition.protein < filters.proteinMin) {
        return false;
      }
      if (filters.caloriesMax && item.nutrition.calories > filters.caloriesMax) {
        return false;
      }
      if (!searchTerms.length) {
        return true;
      }

      const category = (item.category || "Other").toLowerCase();
      const categoryLabel = getCategoryLabel(item.category || "Other").toLowerCase();

      const categoryVariants = [category, categoryLabel].flatMap((value) => {
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
  }, [items, filters, searchTerms, view]);

  const orderedSections = useMemo(
    () => getOrderedMenuSections(filteredItems),
    [filteredItems]
  );
  const [activeCategory, setActiveCategory] = useState<string>(
    () => orderedSections[0] ?? ""
  );
  const sectionVisibilityRef = useRef(new Map<string, number>());
  const rankingVisibilityRef = useRef(new Map<SortOption, number>());

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

  const filteredItemKeys = useMemo(
    () =>
      new Set(
        filteredItems.map((item) =>
          item.id
            ? `id:${item.id}`
            : `name:${item.name.toLowerCase()}|category:${(item.category || "").toLowerCase()}`
        )
      ),
    [filteredItems]
  );

  const filteredHighestProtein = useMemo(
    () =>
      highestProtein.filter((item) => {
        const key = item.id
          ? `id:${item.id}`
          : `name:${item.name.toLowerCase()}|category:${(item.category || "").toLowerCase()}`;
        return filteredItemKeys.has(key);
      }),
    [highestProtein, filteredItemKeys]
  );
  const filteredBestRatio = useMemo(
    () =>
      bestCalorieProteinRatio.filter((item) => {
        const key = item.id
          ? `id:${item.id}`
          : `name:${item.name.toLowerCase()}|category:${(item.category || "").toLowerCase()}`;
        return filteredItemKeys.has(key);
      }),
    [bestCalorieProteinRatio, filteredItemKeys]
  );
  const filteredLowestCalories = useMemo(
    () =>
      lowestCalorieItems.filter((item) => {
        const key = item.id
          ? `id:${item.id}`
          : `name:${item.name.toLowerCase()}|category:${(item.category || "").toLowerCase()}`;
        return filteredItemKeys.has(key);
      }),
    [lowestCalorieItems, filteredItemKeys]
  );

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    const section = document.getElementById(categorySectionId(categoryId));
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSortChange = (nextSort: SortOption) => {
    setSort(nextSort);

    const sectionId = rankingSectionIdBySort[nextSort];
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (view !== "menu") return;
    if (!orderedSections.length) return;

    const visibilityBySection = sectionVisibilityRef.current;
    visibilityBySection.clear();

    const updateActiveSection = () => {
      let nextActive: string | null = null;
      let maxRatio = 0;

      for (const section of orderedSections) {
        const ratio = visibilityBySection.get(section) ?? 0;
        if (ratio >= 0.6 && ratio >= maxRatio) {
          maxRatio = ratio;
          nextActive = section;
        }
      }

      if (nextActive && nextActive !== activeCategory) {
        setActiveCategory(nextActive);
      }
    };

    const sectionIdLookup = new Map<string, string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sectionId = sectionIdLookup.get(entry.target.id);
          if (!sectionId) continue;

          visibilityBySection.set(
            sectionId,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        }

        updateActiveSection();
      },
      { threshold: 0.6 }
    );

    orderedSections.forEach((section) => {
      const elementId = categorySectionId(section);
      const element = document.getElementById(elementId);
      if (!element) return;

      visibilityBySection.set(section, 0);
      sectionIdLookup.set(elementId, section);
      observer.observe(element);
    });

    updateActiveSection();

    return () => observer.disconnect();
  }, [activeCategory, orderedSections, view]);


  useEffect(() => {
    if (view !== "top") return;

    const rankingEntries = Object.entries(rankingSectionIdBySort) as Array<
      [SortOption, string]
    >;

    const visibilityBySection = rankingVisibilityRef.current;
    visibilityBySection.clear();

    const sectionIdLookup = new Map<string, SortOption>();

    const updateActiveSort = () => {
      let nextSort: SortOption | null = null;
      let maxRatio = 0;

      for (const [sortOption] of rankingEntries) {
        const ratio = visibilityBySection.get(sortOption) ?? 0;
        if (ratio >= 0.6 && ratio >= maxRatio) {
          maxRatio = ratio;
          nextSort = sortOption;
        }
      }

      if (nextSort && nextSort !== sort) {
        setSort(nextSort);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sortOption = sectionIdLookup.get(entry.target.id);
          if (!sortOption) continue;

          visibilityBySection.set(
            sortOption,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        }

        updateActiveSort();
      },
      { threshold: 0.6 }
    );

    rankingEntries.forEach(([sortOption, sectionId]) => {
      const element = document.getElementById(sectionId);
      if (!element) return;

      visibilityBySection.set(sortOption, 0);
      sectionIdLookup.set(sectionId, sortOption);
      observer.observe(element);
    });

    updateActiveSort();

    return () => observer.disconnect();
  }, [sort, view]);

  return (
    <div>
      <StickyRestaurantBar
        restaurantName={restaurantName}
        restaurantLogo={restaurantLogo}
        view={view}
        onChange={setView}
        sort={sort}
        onSortChange={handleSortChange}
        filters={filters}
        onFiltersChange={setFilters}
        categoryOptions={categoryOptions}
        activeCategory={resolvedActiveCategory}
        onCategorySelect={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ControlsRow
        view={view}
        onChange={setView}
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
      />

      {view === "menu" ? (
        <MenuSections items={filteredItems} sort={sort} addons={addons} commonChanges={commonChanges} />
      ) : (
        <TopPicksList
          highestProtein={filteredHighestProtein}
          bestCalorieProteinRatio={filteredBestRatio}
          lowestCalorieItems={filteredLowestCalories}
          sort={sort}
          addons={addons}
          commonChanges={commonChanges}
          includeSidesDrinks={Boolean(filters.includeSidesDrinks)}
          includeLargeShareables={Boolean(filters.includeLargeShareables)}
        />
      )}
    </div>
  );
}
