"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type RestaurantSearchContextValue = {
  searchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (value: string) => void;
};

const RestaurantSearchContext = createContext<RestaurantSearchContextValue | null>(null);

export function RestaurantSearchProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openSearch = () => {
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleSetSearchQuery = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchOpen(false);
    }
  };

  const value = useMemo(
    () => ({
      searchOpen,
      searchQuery,
      openSearch,
      closeSearch,
      setSearchQuery: handleSetSearchQuery,
    }),
    [searchOpen, searchQuery]
  );

  return (
    <RestaurantSearchContext.Provider value={value}>
      {children}
    </RestaurantSearchContext.Provider>
  );
}

export function useRestaurantSearch() {
  const context = useContext(RestaurantSearchContext);

  if (!context) {
    throw new Error("useRestaurantSearch must be used within RestaurantSearchProvider");
  }

  return context;
}
