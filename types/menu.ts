export type Nutrition = {
  calories: number;
  protein: number;
  totalFat: number;
  carbs: number;

  satFat?: number;
  transFat?: number;
  fiber?: number;
  sugars?: number;
};

export type MenuItem = {
  id?: string;          // optional but recommended later
  name: string;
  nutrition: Nutrition; // make this required so label is consistent
  image?: string;
  category: string;
  restaurant?: string;
};
