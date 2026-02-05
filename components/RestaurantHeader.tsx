"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo } from "react";

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
  brandColor: string;
  tags?: TagOption[];
};

function hexToRgb(color: string) {
  const normalized = color.replace("#", "").trim();
  if (normalized.length === 3) {
    const [r, g, b] = normalized.split("");
    return `${parseInt(`${r}${r}`, 16)} ${parseInt(`${g}${g}`, 16)} ${parseInt(
      `${b}${b}`,
      16,
    )}`;
  }
  if (normalized.length === 6) {
    const r = normalized.slice(0, 2);
    const g = normalized.slice(2, 4);
    const b = normalized.slice(4, 6);
    return `${parseInt(r, 16)} ${parseInt(g, 16)} ${parseInt(b, 16)}`;
  }
  return null;
}

export default function RestaurantHeader({
  name,
  logo,
  subtitle = "Find the best & smartest high-protein items on the menu.",
  brandColor,
  tags = DEFAULT_TAGS,
}: RestaurantHeaderProps) {
  const resolvedRgb = useMemo(
    () => hexToRgb(brandColor) ?? "59 130 246",
    [brandColor],
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <header
        className="rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-200/70 via-rose-100/80 to-amber-100/70 shadow-sm"
        style={{ "--brand-rgb": resolvedRgb } as CSSProperties}
      >
        <div className="flex w-full max-w-5xl flex-col gap-8 px-6 pb-10 pt-8 sm:px-8">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <span className="text-base">←</span>
            Back to home
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={logo}
                alt={`${name} logo`}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                {name}
              </h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={tag.href}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60"
            >
              {tag.label}
            </Link>
          ))}
        </div>
      </div>
      </header>
    </div>
  );
}
