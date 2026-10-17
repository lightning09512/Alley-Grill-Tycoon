import { SHOP_STAGES } from "../config/shopStages";

export const INGREDIENTS = [
  { id: "bread", name: "Bắp nướng", icon: "corn", unitCost: 4 },
  { id: "pate", name: "Sốt ướp", icon: "sauce-jar", unitCost: 2 },
  { id: "cha", name: "Ba chỉ nướng", icon: "pork-skewer", unitCost: 4 },
  { id: "egg", name: "Trứng nướng", icon: "egg-grill", unitCost: 3 },
  { id: "greens", name: "Rau ăn kèm", icon: "greens", unitCost: 2 },
] as const;

export type IngredientId = (typeof INGREDIENTS)[number]["id"];
export type Inventory = Record<IngredientId, number>;

export const RECIPES = {
  cha: {
    id: "cha",
    name: "Xiên ba chỉ nướng",
    salePrice: 30,
    ingredients: ["bread", "pate", "cha", "greens"],
    unlockLevel: 1,
  },
  egg: {
    id: "egg",
    name: "Trứng nướng mỡ hành",
    salePrice: 32,
    ingredients: ["bread", "pate", "egg", "greens"],
    unlockLevel: 1,
  },
  special: {
    id: "special",
    name: "Mẹt nướng đặc biệt",
    salePrice: 42,
    ingredients: ["bread", "pate", "cha", "egg", "greens"],
    unlockLevel: 2,
  },
} as const satisfies Record<string, {
  id: string;
  name: string;
  salePrice: number;
  ingredients: readonly IngredientId[];
  unlockLevel: number;
}>;

export type RecipeId = keyof typeof RECIPES;
export type CustomerType = "student" | "office" | "shopper" | "tourist";

export const CUSTOMER_TYPES: Record<CustomerType, { name: string; shortName: string; tip: number }> = {
  student: { name: "Học sinh", shortName: "Bạn học sinh", tip: 0 },
  office: { name: "Dân văn phòng", shortName: "Anh văn phòng", tip: 1 },
  shopper: { name: "Khách đi chợ", shortName: "Cô khách chợ", tip: 2 },
  tourist: { name: "Khách du lịch", shortName: "Khách du lịch", tip: 4 },
};

export const RESTOCK_PACK_SIZE = 5;
export const RESTOCK_PACK_COST = INGREDIENTS.reduce((sum, item) => sum + item.unitCost * RESTOCK_PACK_SIZE, 0);
export const SHIFT_SECONDS = 120;
export const CUSTOMER_ARRIVAL_SECONDS = 10;
export const CUSTOMER_PATIENCE_SECONDS = 45;
export const STAFF_HIRE_COST = 1_200;
export const STAFF_WAGE_PER_SHIFT = 30;
export const OFFLINE_CAP_MINUTES = 4 * 60;
export const OFFLINE_COINS_PER_MINUTE = 8;

export const MAX_CART_LEVEL = SHOP_STAGES.length;
export const BUSINESS_STAGE_NAMES = SHOP_STAGES.map((stage) => stage.name);

export const CART_UPGRADE_COST: Record<number, number> = {
  1: 300,
  2: 750,
  3: 1_800,
  4: 4_200,
  5: 9_000,
  6: 18_000,
  7: 35_000,
  8: 65_000,
  9: 120_000,
  10: 220_000,
  11: 400_000,
};

export function createStartingInventory(): Inventory {
  return { bread: 12, pate: 12, cha: 8, egg: 8, greens: 16 };
}

export function getRecipeCost(recipeId: RecipeId): number {
  const recipe = RECIPES[recipeId];
  return recipe.ingredients.reduce((total, ingredientId) => {
    const ingredient = INGREDIENTS.find((item) => item.id === ingredientId);
    return total + (ingredient?.unitCost ?? 0);
  }, 0);
}

