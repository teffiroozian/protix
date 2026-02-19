"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type RestaurantUiContextValue = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const RestaurantUiContext = createContext<RestaurantUiContextValue | null>(null);

export function RestaurantUiProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const value = useMemo(
    () => ({
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
    }),
    [isCartOpen]
  );

  return <RestaurantUiContext.Provider value={value}>{children}</RestaurantUiContext.Provider>;
}

export function useRestaurantUi() {
  const context = useContext(RestaurantUiContext);

  if (!context) {
    throw new Error("useRestaurantUi must be used within RestaurantUiProvider");
  }

  return context;
}
