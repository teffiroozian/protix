export type PortionType =
  | "single"
  | "combo"
  | "shareable"
  | "addon"
  | "drink"
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
};

export type MenuItem = {
  id?: string;          // optional but recommended later
  name: string;
  nutrition: Nutrition; // make this required so label is consistent
  image?: string;
  category: string;
  portionType: PortionType;
  restaurant?: string;

};
