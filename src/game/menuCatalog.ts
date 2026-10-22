export type MenuCategory = "hotpot" | "grill" | "snack" | "meal";

export type MenuDishVisual =
  | { type: "sheet"; sheet: "hotpot-grill" | "snacks-rice"; cell: number }
  | { type: "icon"; icon: "egg-grill" }
  | { type: "image"; asset: "mixed-grill" };

export const MENU_INGREDIENTS = {
  porkBelly: { name: "Ba chỉ heo", assetFile: "pork-belly.png" },
  beefSlices: { name: "Thịt bò", assetFile: "beef-slices.png" },
  beefShank: { name: "Bắp bò", assetFile: "beef-shank.png" },
  chicken: { name: "Thịt gà", assetFile: "chicken.png" },
  chickenWings: { name: "Cánh gà", assetFile: "chicken-wings.png" },
  chickenFeet: { name: "Chân gà", assetFile: "chicken-feet.png" },
  chickenCartilage: { name: "Sụn gà", assetFile: "chicken-cartilage.png" },
  porkRibs: { name: "Sườn non", assetFile: "pork-ribs.png" },
  groundPork: { name: "Thịt heo xay", assetFile: "ground-pork.png" },
  driedBeef: { name: "Khô bò", assetFile: "dried-beef.png" },
  shrimp: { name: "Tôm", assetFile: "shrimp.png" },
  squid: { name: "Mực", assetFile: "squid.png" },
  clams: { name: "Nghêu", assetFile: "clams.png" },
  fieldCrab: { name: "Cua đồng", assetFile: "field-crab.png" },
  goby: { name: "Cá kèo", assetFile: "goby.png" },
  octopus: { name: "Bạch tuộc", assetFile: "octopus.png" },
  seaSnail: { name: "Ốc hương", assetFile: "sea-snail.png" },
  corn: { name: "Bắp", assetFile: "corn.png" },
  mixedMushrooms: { name: "Nấm", assetFile: "mixed-mushrooms.png" },
  hotpotGreens: { name: "Rau lẩu", assetFile: "hotpot-greens.png" },
  sideVegetables: { name: "Rau ăn kèm", assetFile: "side-vegetables.png" },
  laE: { name: "Lá é", assetFile: "la-e.png" },
  bambooShoots: { name: "Măng", assetFile: "bamboo-shoots.png" },
  onion: { name: "Hành tây", assetFile: "onion.png" },
  pineapple: { name: "Dứa", assetFile: "pineapple.png" },
  tomato: { name: "Cà chua", assetFile: "tomato.png" },
  laGiang: { name: "Lá giang", assetFile: "la-giang.png" },
  laLot: { name: "Lá lốt", assetFile: "la-lot.png" },
  okra: { name: "Đậu bắp", assetFile: "okra.png" },
  lemongrass: { name: "Sả", assetFile: "lemongrass.png" },
  garlic: { name: "Tỏi", assetFile: "garlic.png" },
  waterSpinach: { name: "Rau muống", assetFile: "water-spinach.png" },
  leafyGreens: { name: "Rau cải", assetFile: "leafy-greens.png" },
  greenMango: { name: "Xoài xanh", assetFile: "green-mango.png" },
  aromaticHerbs: { name: "Rau thơm", assetFile: "aromatic-herbs.png" },
  scallions: { name: "Hành lá", assetFile: "scallions.png" },
  potatoes: { name: "Khoai tây", assetFile: "potatoes.png" },
  rauRam: { name: "Rau răm", assetFile: "rau-ram.png" },
  mixedRoots: { name: "Rau củ", assetFile: "mixed-roots.png" },
  chickenEggs: { name: "Trứng gà", assetFile: "chicken-eggs.png" },
  quailEggs: { name: "Trứng cút lộn", assetFile: "quail-eggs.png" },
  tofu: { name: "Đậu hũ", assetFile: "tofu.png" },
  rice: { name: "Gạo", assetFile: "rice.png" },
  bun: { name: "Bún", assetFile: "bun.png" },
  noodles: { name: "Mì", assetFile: "noodles.png" },
  glassNoodles: { name: "Miến", assetFile: "glass-noodles.png" },
  ricePaper: { name: "Bánh tráng", assetFile: "rice-paper.png" },
  peanuts: { name: "Đậu phộng", assetFile: "peanuts.png" },
  avocado: { name: "Bơ trái", assetFile: "avocado.png" },
  butter: { name: "Bơ lạt", assetFile: "butter.svg" },
  honey: { name: "Mật ong", assetFile: "honey.png" },
  vinegar: { name: "Giấm", assetFile: "vinegar.png" },
  tamarind: { name: "Me", assetFile: "tamarind.png" },
  cookingOil: { name: "Dầu ăn", assetFile: "cooking-oil.png" },
  marinade: { name: "Sốt ướp", assetFile: "marinade.png" },
  thaiHotpotSpice: { name: "Gia vị lẩu Thái", assetFile: "thai-hotpot-spice.png" },
  satay: { name: "Sa tế", assetFile: "satay.png" },
  chiliSalt: { name: "Muối ớt", assetFile: "chili-salt.png" },
  roastedSalt: { name: "Muối rang", assetFile: "roasted-salt.png" },
  saladDressing: { name: "Nước trộn gỏi", assetFile: "salad-dressing.png" },
  stirFrySauce: { name: "Sốt xào", assetFile: "stir-fry-sauce.png" },
} as const;

export type MenuIngredientId = keyof typeof MENU_INGREDIENTS;

export type MenuDish = {
  id: string;
  name: string;
  category: MenuCategory;
  visual: MenuDishVisual;
  ingredients: readonly MenuIngredientId[];
  suggestedPrice: number;
  estimatedCost: number;
  portion: string;
  currentRecipe?: boolean;
  /** Exact units consumed by the playable recipe for one portion. */
  ingredientAmounts?: Partial<Record<MenuIngredientId, number>>;
};

export const MENU_CATEGORIES: { id: MenuCategory; name: string }[] = [
  { id: "hotpot", name: "Lẩu" },
  { id: "grill", name: "Món nướng" },
  { id: "snack", name: "Món nhắm" },
  { id: "meal", name: "Món no" },
];

const sheetVisual = (sheet: "hotpot-grill" | "snacks-rice", cell: number): MenuDishVisual => ({ type: "sheet", sheet, cell });

const MENU_DISH_LIST = [
  { id: "thai-seafood-hotpot", name: "Lẩu Thái hải sản", category: "hotpot", visual: sheetVisual("hotpot-grill", 0), ingredients: ["shrimp", "squid", "clams", "thaiHotpotSpice", "lemongrass", "pineapple", "hotpotGreens"], suggestedPrice: 169, estimatedCost: 84, portion: "2–3 người" },
  { id: "chicken-la-e-hotpot", name: "Lẩu gà lá é", category: "hotpot", visual: sheetVisual("hotpot-grill", 1), ingredients: ["chicken", "laE", "mixedMushrooms", "lemongrass", "onion", "hotpotGreens"], suggestedPrice: 159, estimatedCost: 78, portion: "2–3 người" },
  { id: "beef-vinegar-hotpot", name: "Lẩu bò nhúng giấm", category: "hotpot", visual: sheetVisual("hotpot-grill", 2), ingredients: ["beefSlices", "vinegar", "onion", "lemongrass", "pineapple", "hotpotGreens"], suggestedPrice: 169, estimatedCost: 80, portion: "2–3 người" },
  { id: "crab-beef-hotpot", name: "Lẩu riêu cua bắp bò", category: "hotpot", visual: sheetVisual("hotpot-grill", 3), ingredients: ["fieldCrab", "beefShank", "tomato", "tofu", "onion", "hotpotGreens"], suggestedPrice: 179, estimatedCost: 88, portion: "2–3 người" },
  { id: "goby-sour-leaf-hotpot", name: "Lẩu cá kèo lá giang", category: "hotpot", visual: sheetVisual("hotpot-grill", 4), ingredients: ["goby", "laGiang", "tomato", "lemongrass", "pineapple", "hotpotGreens"], suggestedPrice: 159, estimatedCost: 80, portion: "2–3 người" },
  { id: "mushroom-vegetable-hotpot", name: "Lẩu nấm rau củ", category: "hotpot", visual: sheetVisual("hotpot-grill", 5), ingredients: ["mixedMushrooms", "mixedRoots", "corn", "tofu", "bambooShoots", "hotpotGreens"], suggestedPrice: 139, estimatedCost: 68, portion: "2–3 người" },

  { id: "pork-belly-skewers", name: "Xiên thịt ba chỉ nướng", category: "grill", visual: sheetVisual("hotpot-grill", 6), ingredients: ["porkBelly", "marinade", "lemongrass", "scallions"], ingredientAmounts: { porkBelly: 1, marinade: 1, lemongrass: 1, scallions: 1 }, suggestedPrice: 79, estimatedCost: 33, portion: "1–2 người", currentRecipe: true },
  { id: "beef-betel-leaves", name: "Bò lá lốt", category: "grill", visual: sheetVisual("hotpot-grill", 7), ingredients: ["beefSlices", "laLot", "garlic", "onion", "cookingOil"], suggestedPrice: 55, estimatedCost: 26, portion: "1–2 người" },
  { id: "chili-chicken-wings", name: "Cánh gà nướng muối ớt", category: "grill", visual: sheetVisual("hotpot-grill", 8), ingredients: ["chickenWings", "chiliSalt", "satay", "cookingOil"], suggestedPrice: 69, estimatedCost: 33, portion: "1–2 người" },
  { id: "satay-chicken-feet", name: "Chân gà nướng sa tế", category: "grill", visual: sheetVisual("hotpot-grill", 9), ingredients: ["chickenFeet", "satay", "chiliSalt", "lemongrass", "garlic"], suggestedPrice: 59, estimatedCost: 28, portion: "1–2 người" },
  { id: "satay-squid", name: "Mực nướng sa tế", category: "grill", visual: sheetVisual("hotpot-grill", 10), ingredients: ["squid", "satay", "chiliSalt", "cookingOil"], suggestedPrice: 79, estimatedCost: 39, portion: "1–2 người" },
  { id: "grilled-octopus", name: "Bạch tuộc nướng", category: "grill", visual: sheetVisual("hotpot-grill", 11), ingredients: ["octopus", "satay", "lemongrass", "garlic", "cookingOil"], suggestedPrice: 89, estimatedCost: 45, portion: "1–2 người" },
  { id: "honey-pork-ribs", name: "Sườn non nướng mật ong", category: "grill", visual: sheetVisual("hotpot-grill", 12), ingredients: ["porkRibs", "honey", "marinade", "garlic"], suggestedPrice: 85, estimatedCost: 42, portion: "1–2 người" },
  { id: "scallion-okra", name: "Đậu bắp nướng mỡ hành", category: "grill", visual: sheetVisual("hotpot-grill", 13), ingredients: ["okra", "scallions", "cookingOil", "peanuts"], suggestedPrice: 39, estimatedCost: 17, portion: "1–2 người" },
  { id: "scallion-grilled-eggs", name: "Trứng nướng mỡ hành", category: "grill", visual: { type: "icon", icon: "egg-grill" }, ingredients: ["chickenEggs", "scallions", "cookingOil", "chiliSalt"], ingredientAmounts: { chickenEggs: 1, scallions: 1, cookingOil: 1, chiliSalt: 1 }, suggestedPrice: 59, estimatedCost: 21, portion: "1–2 người", currentRecipe: true },
  { id: "special-grill-platter", name: "Mẹt nướng đặc biệt", category: "grill", visual: { type: "image", asset: "mixed-grill" }, ingredients: ["porkBelly", "chickenWings", "squid", "okra", "satay", "sideVegetables"], ingredientAmounts: { porkBelly: 1, chickenWings: 1, squid: 1, okra: 1, satay: 1, sideVegetables: 1 }, suggestedPrice: 159, estimatedCost: 69, portion: "2–3 người", currentRecipe: true },

  { id: "lemongrass-fried-tofu", name: "Đậu hũ chiên sả", category: "snack", visual: sheetVisual("snacks-rice", 0), ingredients: ["tofu", "lemongrass", "garlic", "cookingOil", "chiliSalt"], suggestedPrice: 35, estimatedCost: 16, portion: "2 người" },
  { id: "salt-chicken-cartilage", name: "Sụn gà rang muối", category: "snack", visual: sheetVisual("snacks-rice", 1), ingredients: ["chickenCartilage", "roastedSalt", "lemongrass", "garlic", "chiliSalt"], suggestedPrice: 49, estimatedCost: 23, portion: "2 người" },
  { id: "french-fries", name: "Khoai tây chiên", category: "snack", visual: sheetVisual("snacks-rice", 2), ingredients: ["potatoes", "cookingOil", "chiliSalt"], suggestedPrice: 29, estimatedCost: 12, portion: "2 người" },
  { id: "spring-rolls", name: "Chả giò", category: "snack", visual: sheetVisual("snacks-rice", 3), ingredients: ["groundPork", "ricePaper", "mixedMushrooms", "scallions", "cookingOil"], suggestedPrice: 39, estimatedCost: 18, portion: "2 người" },
  { id: "butter-garlic-snails", name: "Ốc hương xào bơ tỏi", category: "snack", visual: sheetVisual("snacks-rice", 4), ingredients: ["seaSnail", "butter", "garlic", "scallions"], suggestedPrice: 59, estimatedCost: 29, portion: "2 người" },
  { id: "lemongrass-clams", name: "Nghêu hấp sả", category: "snack", visual: sheetVisual("snacks-rice", 5), ingredients: ["clams", "lemongrass", "garlic", "chiliSalt"], suggestedPrice: 49, estimatedCost: 23, portion: "2 người" },
  { id: "garlic-water-spinach", name: "Rau muống xào tỏi", category: "snack", visual: sheetVisual("snacks-rice", 6), ingredients: ["waterSpinach", "garlic", "cookingOil", "stirFrySauce"], suggestedPrice: 29, estimatedCost: 13, portion: "2 người" },
  { id: "mango-dried-beef-salad", name: "Gỏi xoài khô bò", category: "snack", visual: sheetVisual("snacks-rice", 7), ingredients: ["greenMango", "driedBeef", "aromaticHerbs", "peanuts", "saladDressing", "chiliSalt"], suggestedPrice: 45, estimatedCost: 21, portion: "2 người" },
  { id: "boneless-chicken-feet-salad", name: "Gỏi chân gà rút xương", category: "snack", visual: sheetVisual("snacks-rice", 8), ingredients: ["chickenFeet", "greenMango", "rauRam", "onion", "saladDressing", "chiliSalt"], suggestedPrice: 49, estimatedCost: 24, portion: "2 người" },
  { id: "butter-corn", name: "Bắp xào bơ", category: "snack", visual: sheetVisual("snacks-rice", 9), ingredients: ["corn", "butter", "scallions", "cookingOil"], suggestedPrice: 25, estimatedCost: 11, portion: "2 người" },
  { id: "tamarind-quail-eggs", name: "Trứng cút lộn xào me", category: "snack", visual: sheetVisual("snacks-rice", 10), ingredients: ["quailEggs", "tamarind", "satay", "scallions"], suggestedPrice: 39, estimatedCost: 18, portion: "2 người" },
  { id: "roasted-peanuts", name: "Đậu phộng rang", category: "snack", visual: sheetVisual("snacks-rice", 11), ingredients: ["peanuts", "roastedSalt", "cookingOil"], suggestedPrice: 19, estimatedCost: 8, portion: "2 người" },

  { id: "seafood-fried-rice", name: "Cơm chiên hải sản", category: "meal", visual: sheetVisual("snacks-rice", 12), ingredients: ["rice", "shrimp", "squid", "clams", "mixedRoots", "scallions"], suggestedPrice: 65, estimatedCost: 31, portion: "1–2 người" },
  { id: "beef-stir-fried-noodles", name: "Mì xào bò", category: "meal", visual: sheetVisual("snacks-rice", 13), ingredients: ["beefSlices", "noodles", "scallions", "garlic", "stirFrySauce", "onion"], suggestedPrice: 69, estimatedCost: 33, portion: "1–2 người" },
] as const satisfies readonly MenuDish[];

export const MENU_DISHES: readonly MenuDish[] = MENU_DISH_LIST;
export type MenuDishId = (typeof MENU_DISH_LIST)[number]["id"];
