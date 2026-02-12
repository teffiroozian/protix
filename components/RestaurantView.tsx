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
  const [activeTab, setActiveTab] = useState<string>(
    () => orderedSections[0] ?? ""
  );
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  const isAutoScrollingRef = useRef(isAutoScrolling);
  const scrollTargetRef = useRef(scrollTarget);

  useEffect(() => {
    isAutoScrollingRef.current = isAutoScrolling;
  }, [isAutoScrolling]);

  useEffect(() => {
    scrollTargetRef.current = scrollTarget;
  }, [scrollTarget]);

  const resolvedActiveCategory = orderedSections.includes(activeTab)
    ? activeTab
    : (orderedSections[0] ?? "");

  const getHeaderOffset = () => {
    const stickyHeader = document.querySelector('[data-sticky-restaurant-bar="true"]');
    if (!(stickyHeader instanceof HTMLElement)) return 0;
    return stickyHeader.getBoundingClientRect().height;
  };

  useEffect(() => {
    if (view !== "menu" || !orderedSections.length) return;

    const sections = orderedSections
      .map((sectionId) => document.getElementById(categorySectionId(sectionId)))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    if (!sections.length) return;

    const updateActiveSection = () => {
      const headerOffset = getHeaderOffset();
      const currentTarget = scrollTargetRef.current;

      if (currentTarget) {
        const targetSection = document.getElementById(categorySectionId(currentTarget));
        if (targetSection) {
          const targetTop = targetSection.getBoundingClientRect().top;
          if (targetTop <= headerOffset + 1) {
            setIsAutoScrolling(false);
            setScrollTarget(null);
          }
        }
      }

      if (isAutoScrollingRef.current) return;

      const sectionInView = sections
        .map((section) => {
          const rect = section.getBoundingClientRect();
          return {
            id: section.id.replace("menu-section-", ""),
            topDistance: Math.abs(rect.top - headerOffset),
            visible: rect.bottom > headerOffset + 1,
          };
        })
        .filter((section) => section.visible)
        .sort((a, b) => a.topDistance - b.topDistance)[0];

      if (!sectionInView) return;
      if (sectionInView.id !== resolvedActiveCategory) {
        setActiveTab(sectionInView.id);
      }
    };

    const observer = new IntersectionObserver(updateActiveSection, {
      threshold: [0.1, 0.6, 0.9],
    });

    sections.forEach((section) => observer.observe(section));
    updateActiveSection();

    return () => observer.disconnect();
  }, [orderedSections, resolvedActiveCategory, view]);

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
    setActiveTab(categoryId);
    setIsAutoScrolling(true);
    setScrollTarget(categoryId);

    const section = document.getElementById(categorySectionId(categoryId));
    if (!section) return;

    const headerOffset = getHeaderOffset();
    const targetTop = section.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  };

  const handleSortChange = (nextSort: SortOption) => {
    setSort(nextSort);

    const sectionId = rankingSectionIdBySort[nextSort];
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
