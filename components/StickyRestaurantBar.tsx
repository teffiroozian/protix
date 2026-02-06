"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";

type TabOption = {
  id: string;
  label: string;
  href: string;
};

type StickyRestaurantBarProps = {
  restaurantName: string;
  restaurantLogo: string;
  tabs?: TabOption[];
};

const DEFAULT_TABS: TabOption[] = [
  { id: "high-protein", label: "High Protein", href: "#high-protein" },
  {
    id: "best-ratio",
    label: "Best Protein Ratio",
    href: "#best-protein-ratio",
  },
  { id: "lowest-cal", label: "Lowest Calorie", href: "#lowest-calorie" },
];

const SCROLL_AMOUNT = 220;

export default function StickyRestaurantBar({
  restaurantName,
  restaurantLogo,
  tabs,
}: StickyRestaurantBarProps) {
  const resolvedTabs = useMemo(() => tabs ?? DEFAULT_TABS, [tabs]);
  const [activeTab, setActiveTab] = useState(resolvedTabs[0]?.id ?? "");
  const [isVisible, setIsVisible] = useState(false);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  const getScrollOffset = () => (barRef.current?.offsetHeight ?? 0) + 24;

  const smoothScrollTo = (targetY: number, duration = 1000) => {
    const startY = window.scrollY;
    const difference = targetY - startY;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      window.scrollTo(0, startY + difference * easedProgress);

      if (elapsed < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  useEffect(() => {
    const hero = document.getElementById("restaurant-hero");

    if (!hero) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const tabSections = resolvedTabs
      .map((tab) => {
        const id = tab.href.replace("#", "");
        return document.getElementById(id);
      })
      .filter((section): section is HTMLElement => Boolean(section));

    if (!tabSections.length) return;

    const handleScroll = () => {
      const offset = getScrollOffset() + 8;
      const scrollPosition = window.scrollY + offset;

      let currentTabId = resolvedTabs[0]?.id ?? "";
      tabSections.forEach((section, index) => {
        if (section.offsetTop <= scrollPosition) {
          currentTabId = resolvedTabs[index]?.id ?? currentTabId;
        }
      });

      setActiveTab(currentTabId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [resolvedTabs]);

  const handleScroll = (direction: "left" | "right") => {
    if (!tabsRef.current) return;
    const delta = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
    tabsRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  const handleTabClick = (
    event: MouseEvent<HTMLAnchorElement>,
    tab: TabOption
  ) => {
    event.preventDefault();
    const id = tab.href.replace("#", "");
    const section = document.getElementById(id);
    if (!section) return;

    const offset = getScrollOffset();
    const targetY = section.getBoundingClientRect().top + window.scrollY - offset;

    setActiveTab(tab.id);
    smoothScrollTo(targetY, 1000);
  };

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-50 transition duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={barRef}
        className="w-full border-b border-slate-200/70 bg-white/95 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2 sm:px-6">
          <Link
            href="/"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Back to home"
          >
            ←
          </Link>

          <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <Image
              src={restaurantLogo}
              alt={`${restaurantName} logo`}
              fill
              className="object-contain"
            />
          </div>

          <div className="text-sm font-bold text-slate-900 sm:text-base">
            {restaurantName}
          </div>

          <span className="text-slate-300">|</span>

          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Scroll tabs left"
          >
            ‹
          </button>

          <div
            ref={tabsRef}
            className="flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth py-1"
          >
            {resolvedTabs.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  onClick={(event) => handleTabClick(event, tab)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-900 hover:border-slate-400"
                  }`}
                >
                  {tab.label}
                </a>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Scroll tabs right"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
