"use client";

import { useMemo, useSyncExternalStore } from "react";

export type CartMacros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type CartItem = {
  id: string;
  restaurantId: string;
  itemId: string;
  name: string;
  variantId?: string;
  variantLabel?: string;
  optionsLabel?: string;
  quantity: number;
  macrosPerItem: CartMacros;
};

type CartState = {
  items: CartItem[];
};

const emptyTotals: CartMacros = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

let cartState: CartState = {
  items: [],
};

const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const setCartState = (updater: (prev: CartState) => CartState) => {
  cartState = updater(cartState);
  notify();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => cartState;

const computeTotals = (items: CartItem[]): CartMacros => {
  return items.reduce(
    (acc, item) => {
      acc.calories += item.macrosPerItem.calories * item.quantity;
      acc.protein += item.macrosPerItem.protein * item.quantity;
      acc.carbs += item.macrosPerItem.carbs * item.quantity;
      acc.fat += item.macrosPerItem.fat * item.quantity;

      return acc;
    },
    { ...emptyTotals },
  );
};

export const cartSelectors = {
  totals: (state: CartState) => computeTotals(state.items),
};

const addItem = (item: CartItem) => {
  setCartState((prev) => {
    const existingIndex = prev.items.findIndex((cartItem) => cartItem.id === item.id);

    if (existingIndex === -1) {
      return {
        ...prev,
        items: [...prev.items, item],
      };
    }

    const updatedItems = [...prev.items];
    const existingItem = updatedItems[existingIndex];

    updatedItems[existingIndex] = {
      ...existingItem,
      quantity: existingItem.quantity + item.quantity,
    };

    return {
      ...prev,
      items: updatedItems,
    };
  });
};

const removeItem = (id: string) => {
  setCartState((prev) => ({
    ...prev,
    items: prev.items.filter((item) => item.id !== id),
  }));
};

const updateQuantity = (id: string, quantity: number) => {
  if (quantity <= 0) {
    removeItem(id);
    return;
  }

  setCartState((prev) => ({
    ...prev,
    items: prev.items.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity,
          }
        : item,
    ),
  }));
};

const clearCart = () => {
  setCartState((prev) => ({
    ...prev,
    items: [],
  }));
};

export const useCart = () => {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const totals = useMemo(() => cartSelectors.totals(state), [state]);

  return {
    items: state.items,
    totals,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};
