"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import CartIconDropdown from "@/components/CartIconDropdown";

export default function DesktopNav({
  showCart = true,
}: {
  showCart?: boolean;
}) {
  return (
    <div className="mx-auto hidden w-full max-w-6xl items-center rounded-2xl border border-slate-200/70 bg-white px-6 py-3 shadow-[0_-3px_12px_rgba(15,23,42,0.08)] lg:flex">
      <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300/80 bg-white" aria-label="Go to homepage">
        <span className="relative h-7 w-7 overflow-hidden rounded-md">
          <Image src="/favicon.ico" alt="Macro Maxxer logo" fill className="object-contain" />
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/#restaurant-search" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/80 bg-white text-slate-800" aria-label="Search restaurants">
          <Search className="h-4 w-4" strokeWidth={2.5} />
        </Link>
        {showCart ? (
          <CartIconDropdown buttonClassName="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-slate-300/80 bg-white px-2.5 text-slate-800" />
        ) : null}
      </div>
    </div>
  );
}
