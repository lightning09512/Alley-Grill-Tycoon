export type MenuCategory = "hotpot" | "grill" | "snack" | "meal";

export type MenuDishVisual =
  | { type: "sheet"; sheet: "hotpot-grill" | "snacks-rice"; cell: number }
  | { type: "icon"; icon: "egg-grill" }
  | { type: "image"; asset: "mixed-grill" };

export type MenuDish = {
  id: string;
  name: string;
  category: MenuCategory;
  visual: MenuDishVisual;
  suggestedPrice: number;
  estimatedCost: number;
  portion: string;
  currentRecipe?: boolean;
};

export const MENU_CATEGORIES: { id: MenuCategory; name: string }[] = [
  { id: "hotpot", name: "Lẩu" },
  { id: "grill", name: "Món nướng" },
  { id: "snack", name: "Món nhắm" },
  { id: "meal", name: "Món no" },
];

const sheetVisual = (sheet: "hotpot-grill" | "snacks-rice", cell: number): MenuDishVisual => ({ type: "sheet", sheet, cell });

export const MENU_DISHES: MenuDish[] = [
  { id: "thai-seafood-hotpot", name: "Lẩu Thái hải sản", category: "hotpot", visual: sheetVisual("hotpot-grill", 0), suggestedPrice: 169, estimatedCost: 84, portion: "2–3 người" },
  { id: "chicken-la-e-hotpot", name: "Lẩu gà lá é", category: "hotpot", visual: sheetVisual("hotpot-grill", 1), suggestedPrice: 159, estimatedCost: 78, portion: "2–3 người" },
  { id: "beef-vinegar-hotpot", name: "Lẩu bò nhúng giấm", category: "hotpot", visual: sheetVisual("hotpot-grill", 2), suggestedPrice: 169, estimatedCost: 80, portion: "2–3 người" },
  { id: "crab-beef-hotpot", name: "Lẩu riêu cua bắp bò", category: "hotpot", visual: sheetVisual("hotpot-grill", 3), suggestedPrice: 179, estimatedCost: 88, portion: "2–3 người" },
  { id: "goby-sour-leaf-hotpot", name: "Lẩu cá kèo lá giang", category: "hotpot", visual: sheetVisual("hotpot-grill", 4), suggestedPrice: 159, estimatedCost: 80, portion: "2–3 người" },
  { id: "mushroom-vegetable-hotpot", name: "Lẩu nấm rau củ", category: "hotpot", visual: sheetVisual("hotpot-grill", 5), suggestedPrice: 139, estimatedCost: 68, portion: "2–3 người" },

  { id: "pork-belly-skewers", name: "Xiên thịt ba chỉ nướng", category: "grill", visual: sheetVisual("hotpot-grill", 6), suggestedPrice: 30, estimatedCost: 12, portion: "1–2 người", currentRecipe: true },
  { id: "beef-betel-leaves", name: "Bò lá lốt", category: "grill", visual: sheetVisual("hotpot-grill", 7), suggestedPrice: 55, estimatedCost: 26, portion: "1–2 người" },
  { id: "chili-chicken-wings", name: "Cánh gà nướng muối ớt", category: "grill", visual: sheetVisual("hotpot-grill", 8), suggestedPrice: 69, estimatedCost: 33, portion: "1–2 người" },
  { id: "satay-chicken-feet", name: "Chân gà nướng sa tế", category: "grill", visual: sheetVisual("hotpot-grill", 9), suggestedPrice: 59, estimatedCost: 28, portion: "1–2 người" },
  { id: "satay-squid", name: "Mực nướng sa tế", category: "grill", visual: sheetVisual("hotpot-grill", 10), suggestedPrice: 79, estimatedCost: 39, portion: "1–2 người" },
  { id: "grilled-octopus", name: "Bạch tuộc nướng", category: "grill", visual: sheetVisual("hotpot-grill", 11), suggestedPrice: 89, estimatedCost: 45, portion: "1–2 người" },
  { id: "honey-pork-ribs", name: "Sườn non nướng mật ong", category: "grill", visual: sheetVisual("hotpot-grill", 12), suggestedPrice: 85, estimatedCost: 42, portion: "1–2 người" },
  { id: "scallion-okra", name: "Đậu bắp nướng mỡ hành", category: "grill", visual: sheetVisual("hotpot-grill", 13), suggestedPrice: 39, estimatedCost: 17, portion: "1–2 người" },
  { id: "scallion-grilled-eggs", name: "Trứng nướng mỡ hành", category: "grill", visual: { type: "icon", icon: "egg-grill" }, suggestedPrice: 32, estimatedCost: 11, portion: "1–2 người", currentRecipe: true },
  { id: "special-grill-platter", name: "Mẹt nướng đặc biệt", category: "grill", visual: { type: "image", asset: "mixed-grill" }, suggestedPrice: 42, estimatedCost: 15, portion: "2–3 người", currentRecipe: true },

  { id: "lemongrass-fried-tofu", name: "Đậu hũ chiên sả", category: "snack", visual: sheetVisual("snacks-rice", 0), suggestedPrice: 35, estimatedCost: 16, portion: "2 người" },
  { id: "salt-chicken-cartilage", name: "Sụn gà rang muối", category: "snack", visual: sheetVisual("snacks-rice", 1), suggestedPrice: 49, estimatedCost: 23, portion: "2 người" },
  { id: "french-fries", name: "Khoai tây chiên", category: "snack", visual: sheetVisual("snacks-rice", 2), suggestedPrice: 29, estimatedCost: 12, portion: "2 người" },
  { id: "spring-rolls", name: "Chả giò", category: "snack", visual: sheetVisual("snacks-rice", 3), suggestedPrice: 39, estimatedCost: 18, portion: "2 người" },
  { id: "butter-garlic-snails", name: "Ốc hương xào bơ tỏi", category: "snack", visual: sheetVisual("snacks-rice", 4), suggestedPrice: 59, estimatedCost: 29, portion: "2 người" },
  { id: "lemongrass-clams", name: "Nghêu hấp sả", category: "snack", visual: sheetVisual("snacks-rice", 5), suggestedPrice: 49, estimatedCost: 23, portion: "2 người" },
  { id: "garlic-water-spinach", name: "Rau muống xào tỏi", category: "snack", visual: sheetVisual("snacks-rice", 6), suggestedPrice: 29, estimatedCost: 13, portion: "2 người" },
  { id: "mango-dried-beef-salad", name: "Gỏi xoài khô bò", category: "snack", visual: sheetVisual("snacks-rice", 7), suggestedPrice: 45, estimatedCost: 21, portion: "2 người" },
  { id: "boneless-chicken-feet-salad", name: "Gỏi chân gà rút xương", category: "snack", visual: sheetVisual("snacks-rice", 8), suggestedPrice: 49, estimatedCost: 24, portion: "2 người" },
  { id: "butter-corn", name: "Bắp xào bơ", category: "snack", visual: sheetVisual("snacks-rice", 9), suggestedPrice: 25, estimatedCost: 11, portion: "2 người" },
  { id: "tamarind-quail-eggs", name: "Trứng cút lộn xào me", category: "snack", visual: sheetVisual("snacks-rice", 10), suggestedPrice: 39, estimatedCost: 18, portion: "2 người" },
  { id: "roasted-peanuts", name: "Đậu phộng rang", category: "snack", visual: sheetVisual("snacks-rice", 11), suggestedPrice: 19, estimatedCost: 8, portion: "2 người" },

  { id: "seafood-fried-rice", name: "Cơm chiên hải sản", category: "meal", visual: sheetVisual("snacks-rice", 12), suggestedPrice: 65, estimatedCost: 31, portion: "1–2 người" },
  { id: "beef-stir-fried-noodles", name: "Mì xào bò", category: "meal", visual: sheetVisual("snacks-rice", 13), suggestedPrice: 69, estimatedCost: 33, portion: "1–2 người" },
];
