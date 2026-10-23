import { SHOP_STAGES } from "../config/shopStages";
import { MARKET_PRODUCT_DETAILS } from "./marketCatalog";
import { MENU_DISHES, MENU_INGREDIENTS, type MenuDishId, type MenuIngredientId, type MenuCategory } from "./menuCatalog";

export type IngredientId = MenuIngredientId;
export type Inventory = Record<IngredientId, number>;

export interface Ingredient {
  id: IngredientId;
  name: string;
  assetFile: string;
  icon: string;
  unitCost: number;
}

const INGREDIENT_ICONS: Partial<Record<IngredientId, string>> = {
  porkBelly: "pork-skewer",
  chickenEggs: "egg-grill",
  scallions: "greens",
  chiliSalt: "sauce-jar",
  corn: "corn",
  sideVegetables: "greens",
};

export const INGREDIENTS: readonly Ingredient[] = (Object.keys(MENU_INGREDIENTS) as IngredientId[]).map((id) => ({
  id,
  name: MENU_INGREDIENTS[id].name,
  assetFile: MENU_INGREDIENTS[id].assetFile,
  icon: INGREDIENT_ICONS[id] ?? "greens",
  unitCost: MARKET_PRODUCT_DETAILS[id].priceThousands,
}));

export type RecipeId = MenuDishId;
export const PLAYABLE_RECIPE_IDS: readonly RecipeId[] = MENU_DISHES.map((dish) => dish.id as RecipeId);

export interface RecipeIngredient {
  id: IngredientId;
  quantity: number;
}

export interface Recipe {
  id: RecipeId;
  name: string;
  salePrice: number;
  ingredients: readonly RecipeIngredient[];
  unlockLevel: number;
}

const PLAYABLE_RECIPE_UNLOCK_LEVELS: Record<RecipeId, number> = {
  "thai-seafood-hotpot": 3,
  "chicken-la-e-hotpot": 3,
  "beef-vinegar-hotpot": 3,
  "crab-beef-hotpot": 4,
  "goby-sour-leaf-hotpot": 4,
  "mushroom-vegetable-hotpot": 3,
  "pork-belly-skewers": 1,
  "beef-betel-leaves": 2,
  "chili-chicken-wings": 1,
  "satay-chicken-feet": 2,
  "satay-squid": 3,
  "grilled-octopus": 3,
  "honey-pork-ribs": 2,
  "scallion-okra": 1,
  "scallion-grilled-eggs": 1,
  "special-grill-platter": 2,
  "lemongrass-fried-tofu": 1,
  "salt-chicken-cartilage": 2,
  "french-fries": 1,
  "spring-rolls": 2,
  "butter-garlic-snails": 2,
  "lemongrass-clams": 2,
  "garlic-water-spinach": 2,
  "mango-dried-beef-salad": 3,
  "boneless-chicken-feet-salad": 3,
  "butter-corn": 1,
  "tamarind-quail-eggs": 2,
  "roasted-peanuts": 1,
  "seafood-fried-rice": 3,
  "beef-stir-fried-noodles": 3,
};

const menuDishById = new Map<string, (typeof MENU_DISHES)[number]>(MENU_DISHES.map((dish) => [dish.id, dish]));
export const RECIPES = PLAYABLE_RECIPE_IDS.reduce((recipes, id) => {
  const dish = menuDishById.get(id);
  if (!dish) throw new Error(`Playable dish ${id} is missing from MENU_DISHES.`);
  recipes[id] = {
    id,
    name: dish.name,
    salePrice: dish.suggestedPrice,
    ingredients: dish.ingredients.map((ingredientId) => ({
      id: ingredientId,
      quantity: Math.max(1, Math.trunc(dish.ingredientAmounts?.[ingredientId] ?? 1)),
    })),
    unlockLevel: PLAYABLE_RECIPE_UNLOCK_LEVELS[id],
  };
  return recipes;
}, {} as Record<RecipeId, Recipe>);

export type CustomerType = "student" | "office" | "shopper" | "tourist";

export const CUSTOMER_TYPES: Record<CustomerType, { name: string; shortName: string; tip: number }> = {
  student: { name: "Học sinh", shortName: "Bạn học sinh", tip: 0 },
  office: { name: "Dân văn phòng", shortName: "Anh văn phòng", tip: 1 },
  shopper: { name: "Khách đi chợ", shortName: "Cô khách chợ", tip: 2 },
  tourist: { name: "Khách du lịch", shortName: "Khách du lịch", tip: 4 },
};

export const STARTER_INGREDIENTS: readonly IngredientId[] = [
  "porkBelly", "marinade", "lemongrass", "scallions",
  "chickenEggs", "cookingOil", "chiliSalt",
];
const STARTER_RECIPE_IDS: readonly RecipeId[] = [
  "pork-belly-skewers",
  "scallion-grilled-eggs",
  "lemongrass-fried-tofu",
];
const STARTER_RECIPE_INGREDIENTS = new Set<IngredientId>(
  STARTER_RECIPE_IDS.flatMap((id) => RECIPES[id].ingredients.map((ingredient) => ingredient.id)),
);
export const RESTOCK_PACK_SIZE = 2;
export const RESTOCK_PACK_COST = STARTER_INGREDIENTS.reduce((sum, id) => {
  return sum + MARKET_PRODUCT_DETAILS[id].priceThousands * RESTOCK_PACK_SIZE;
}, 0);
// A bookkeeping interval; reaching it never closes the restaurant.
export const ACCOUNTING_PERIOD_SECONDS = 120;
export const CUSTOMER_ARRIVAL_SECONDS = 10;
export const CUSTOMER_PATIENCE_SECONDS = 75;
export const STAFF_HIRE_COST = 1_200;
export const STAFF_WAGE_PER_SHIFT = 30;
export const OFFLINE_CAP_MINUTES = 4 * 60;
export const OFFLINE_COINS_PER_MINUTE = 8;

export const MAX_CART_LEVEL = SHOP_STAGES.length;
export const BUSINESS_STAGE_NAMES = SHOP_STAGES.map((stage) => stage.name);

export const CART_UPGRADE_COST: Record<number, number> = {
  1: 100_000,
  2: 200_000,
  3: 350_000,
  4: 550_000,
  5: 800_000,
  6: 1_200_000,
  7: 1_800_000,
  8: 2_600_000,
  9: 3_800_000,
  10: 5_500_000,
  11: 8_000_000,
};

export function createStartingInventory(): Inventory {
  const inventory = Object.fromEntries((Object.keys(MENU_INGREDIENTS) as IngredientId[]).map((id) => [id, 0])) as Inventory;
  for (const id of STARTER_INGREDIENTS) inventory[id] = 8;
  for (const id of STARTER_RECIPE_INGREDIENTS) {
    if (!STARTER_INGREDIENTS.includes(id)) inventory[id] = 4;
  }
  return inventory;
}

export function createStartingMenu(): RecipeId[] {
  return [...STARTER_RECIPE_IDS];
}

export function getRecipeLearningCost(recipeId: RecipeId): number {
  const recipe = RECIPES[recipeId];
  if (!recipe) return Number.POSITIVE_INFINITY;
  const costByLevel = [0, 25, 45, 70, 100];
  return costByLevel[recipe.unlockLevel] ?? 100 + (recipe.unlockLevel - 4) * 30;
}

export function getRecipeCost(recipeId: RecipeId): number {
  return RECIPES[recipeId].ingredients.reduce((total, ingredient) => {
    return total + MARKET_PRODUCT_DETAILS[ingredient.id].priceThousands * ingredient.quantity;
  }, 0);
}
