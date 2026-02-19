export type PortionType =
  | "single"
  | "combo"
  | "shareable"
  | "addon"
  | "drink"
  | "side"
  | "dessert";

export type Nutrition = {
  calories: number;
  protein: number;
  totalFat: number;
  carbs: number;

  satFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  fiber?: number;
  sugars?: number;
};

export type ItemVariant = {
  id: string;          // e.g. "8pc", "12pc", "30pc"
  label: string;       // e.g. "8 piece"
  nutrition: Nutrition;
  portionType?: PortionType;   // Optional override: variant can differ from base item
  isDefault?: boolean;
};

export type AddonRef = "sauces" | "dressings";

export type AddonOption = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
};

export type RestaurantAddons = Partial<Record<AddonRef, AddonOption[]>>;

export type MacroDelta = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type CommonChange = {
  id: string;
  label: string;
  appliesTo?: {
    categories?: string[];
  };
  delta: MacroDelta;
};

export type MenuItem = {
  id?: string;          // optional but recommended later
  name: string;
  nutrition: Nutrition; // make this required so label is consistent
  image?: string;
  category: string;
  portionType: PortionType;
  restaurant?: string;
  variants?: ItemVariant[];
  defaultVariantId?: string;
  addonRefs?: AddonRef[];
  displayVariantId?: string; // UI-only: pin a nested variant for ranking/filtering views
  displayVariantLabel?: string; // UI-only: static variant label in ranking/filtering views

};
