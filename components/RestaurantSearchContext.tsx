"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type RestaurantSearchContextValue = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

const RestaurantSearchContext = createContext<RestaurantSearchContextValue | null>(null);

export function RestaurantSearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");

  const value = useMemo(
    () => ({ searchQuery, setSearchQuery }),
    [searchQuery]
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
