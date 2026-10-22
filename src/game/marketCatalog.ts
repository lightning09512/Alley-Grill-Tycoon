import type { MenuIngredientId } from "./menuCatalog";

export type MarketSectionId = "grocery" | "grocery-clothing" | "meat-fish" | "seafood-vegetables";
export type MarketStallId = "produce" | "seasonings" | "dry-goods" | "meat" | "fish" | "seafood" | "greens";

export interface MarketProductDetails {
  priceThousands: number;
  unit: string;
  description: string;
}

export interface MarketStall {
  id: MarketStallId;
  section: MarketSectionId;
  boardLabel: string;
  title: string;
  subtitle: string;
  products: readonly MenuIngredientId[];
  position: { left?: string; right?: string; top: string };
}

export const MARKET_PRODUCT_DETAILS = {
  porkBelly: { priceThousands: 18, unit: "phần", description: "Ba chỉ heo tươi, hợp món nướng và mẹt nướng." },
  beefSlices: { priceThousands: 24, unit: "phần", description: "Thịt bò thái lát mỏng, dùng nhúng lẩu hoặc xào." },
  beefShank: { priceThousands: 22, unit: "phần", description: "Bắp bò chắc thịt, hợp lẩu riêu và món hầm." },
  chicken: { priceThousands: 16, unit: "phần", description: "Thịt gà tươi, phù hợp nấu lẩu và món ăn gia đình." },
  chickenWings: { priceThousands: 14, unit: "phần", description: "Cánh gà tươi, dùng nướng muối ớt hoặc sa tế." },
  chickenFeet: { priceThousands: 10, unit: "phần", description: "Chân gà tươi, hợp món nướng và gỏi xoài." },
  chickenCartilage: { priceThousands: 12, unit: "phần", description: "Sụn gà giòn, nguyên liệu cho món rang muối." },
  porkRibs: { priceThousands: 20, unit: "phần", description: "Sườn non nhiều thịt, ngon khi nướng mật ong." },
  groundPork: { priceThousands: 13, unit: "phần", description: "Thịt heo xay, dùng làm nhân chả giò." },
  driedBeef: { priceThousands: 17, unit: "phần", description: "Khô bò ăn liền, hợp món gỏi xoài." },
  shrimp: { priceThousands: 20, unit: "phần", description: "Tôm tươi, dùng cho lẩu Thái và cơm chiên." },
  squid: { priceThousands: 19, unit: "phần", description: "Mực tươi, hợp món nướng sa tế và cơm chiên." },
  clams: { priceThousands: 12, unit: "phần", description: "Nghêu tươi, dùng hấp sả hoặc nấu lẩu." },
  fieldCrab: { priceThousands: 16, unit: "phần", description: "Cua đồng, tạo vị ngọt cho món lẩu riêu." },
  goby: { priceThousands: 15, unit: "phần", description: "Cá kèo tươi, hợp nấu cùng lá giang." },
  octopus: { priceThousands: 22, unit: "phần", description: "Bạch tuộc tươi, dùng nướng hoặc nhúng lẩu." },
  seaSnail: { priceThousands: 18, unit: "phần", description: "Ốc hương tươi, hợp món xào bơ tỏi." },
  corn: { priceThousands: 5, unit: "trái", description: "Bắp ngọt dùng cho lẩu, món xào và món nướng." },
  mixedMushrooms: { priceThousands: 9, unit: "phần", description: "Nấm hỗn hợp tươi, dùng nấu lẩu rau củ." },
  hotpotGreens: { priceThousands: 8, unit: "bó", description: "Rau lẩu tươi, ăn kèm các món lẩu." },
  sideVegetables: { priceThousands: 6, unit: "bó", description: "Rau ăn kèm tươi cho mẹt nướng và món chính." },
  laE: { priceThousands: 7, unit: "bó", description: "Lá é tươi, nguyên liệu chính của lẩu gà lá é." },
  bambooShoots: { priceThousands: 6, unit: "phần", description: "Măng tươi, thêm vị giòn cho nồi lẩu." },
  onion: { priceThousands: 5, unit: "củ", description: "Hành tây tươi, dùng cho lẩu và món xào." },
  pineapple: { priceThousands: 7, unit: "trái", description: "Dứa chua ngọt, tạo vị thanh cho nước lẩu." },
  tomato: { priceThousands: 5, unit: "phần", description: "Cà chua chín, dùng nấu lẩu và tạo màu tự nhiên." },
  laGiang: { priceThousands: 7, unit: "bó", description: "Lá giang chua dịu, hợp nấu lẩu cá kèo." },
  laLot: { priceThousands: 5, unit: "bó", description: "Lá lốt tươi, cuốn thịt bò làm món nướng." },
  okra: { priceThousands: 5, unit: "phần", description: "Đậu bắp tươi, dùng nướng mỡ hành." },
  lemongrass: { priceThousands: 4, unit: "bó", description: "Sả tươi tạo mùi thơm cho lẩu, món hấp và nướng." },
  garlic: { priceThousands: 4, unit: "củ", description: "Tỏi tươi dùng ướp, phi thơm và làm sốt." },
  waterSpinach: { priceThousands: 6, unit: "bó", description: "Rau muống tươi, hợp món xào tỏi." },
  greenMango: { priceThousands: 7, unit: "trái", description: "Xoài xanh giòn chua, dùng làm gỏi." },
  aromaticHerbs: { priceThousands: 5, unit: "bó", description: "Rau thơm ăn kèm và làm gỏi." },
  scallions: { priceThousands: 4, unit: "bó", description: "Hành lá tươi, dùng rắc món và làm mỡ hành." },
  potatoes: { priceThousands: 7, unit: "phần", description: "Khoai tây tươi, dùng chiên ăn vặt." },
  rauRam: { priceThousands: 5, unit: "bó", description: "Rau răm thơm, ăn kèm gỏi chân gà." },
  mixedRoots: { priceThousands: 8, unit: "phần", description: "Rau củ hỗn hợp, dùng cho lẩu và cơm chiên." },
  leafyGreens: { priceThousands: 6, unit: "bó", description: "Rau cải tươi, dùng nấu lẩu và ăn kèm." },
  avocado: { priceThousands: 12, unit: "trái", description: "Bơ trái chín, nông sản bán theo trái." },
  chickenEggs: { priceThousands: 4, unit: "trứng", description: "Trứng gà tươi, dùng làm món trứng nướng." },
  quailEggs: { priceThousands: 6, unit: "phần", description: "Trứng cút lộn, hợp món xào me." },
  tofu: { priceThousands: 5, unit: "miếng", description: "Đậu hũ mềm, dùng cho lẩu và món chiên sả." },
  rice: { priceThousands: 8, unit: "phần", description: "Gạo thơm, nguyên liệu cho cơm chiên hải sản." },
  bun: { priceThousands: 7, unit: "phần", description: "Bún tươi, ăn cùng lẩu và món nước." },
  noodles: { priceThousands: 6, unit: "gói", description: "Mì sợi, dùng cho món mì xào bò." },
  glassNoodles: { priceThousands: 6, unit: "gói", description: "Miến khô, dùng trong các món xào và lẩu." },
  ricePaper: { priceThousands: 5, unit: "xấp", description: "Bánh tráng, dùng cuốn chả giò." },
  peanuts: { priceThousands: 6, unit: "phần", description: "Đậu phộng rang hoặc rắc lên món gỏi." },
  butter: { priceThousands: 8, unit: "hũ", description: "Bơ lạt béo thơm, dùng xào ốc hoặc bắp." },
  honey: { priceThousands: 9, unit: "chai", description: "Mật ong nguyên chất, dùng ướp sườn nướng." },
  vinegar: { priceThousands: 7, unit: "chai", description: "Giấm chua nhẹ, dùng cho lẩu bò nhúng giấm." },
  tamarind: { priceThousands: 5, unit: "gói", description: "Me chua, nấu sốt cho món trứng cút lộn." },
  cookingOil: { priceThousands: 8, unit: "chai", description: "Dầu ăn dùng chiên, xào và làm mỡ hành." },
  marinade: { priceThousands: 7, unit: "hũ", description: "Sốt ướp đậm vị cho thịt nướng." },
  thaiHotpotSpice: { priceThousands: 9, unit: "gói", description: "Gia vị lẩu Thái chua cay." },
  satay: { priceThousands: 7, unit: "hũ", description: "Sa tế cay thơm cho món nướng và lẩu." },
  chiliSalt: { priceThousands: 5, unit: "gói", description: "Muối ớt dùng ướp cánh gà và nêm món." },
  roastedSalt: { priceThousands: 5, unit: "gói", description: "Muối rang cho món sụn gà rang muối." },
  saladDressing: { priceThousands: 7, unit: "chai", description: "Nước trộn gỏi chua ngọt." },
  stirFrySauce: { priceThousands: 7, unit: "hũ", description: "Sốt xào nêm rau muống và mì xào." },
} satisfies Record<MenuIngredientId, MarketProductDetails>;

export const MARKET_STALLS: readonly MarketStall[] = [
  {
    id: "produce",
    section: "grocery",
    boardLabel: "Rau củ",
    title: "Rau củ · trái cây",
    subtitle: "Sạp nông sản tươi",
    position: { left: "25%", top: "44%" },
    products: ["corn", "mixedMushrooms", "hotpotGreens", "sideVegetables", "laE", "bambooShoots", "onion", "pineapple", "tomato", "laGiang", "laLot", "okra", "lemongrass", "waterSpinach", "greenMango", "aromaticHerbs", "scallions", "potatoes", "rauRam", "mixedRoots", "leafyGreens", "avocado"],
  },
  {
    id: "seasonings",
    section: "grocery",
    boardLabel: "Gia vị",
    title: "Gia vị · nước sốt",
    subtitle: "Chọn loại cần dùng",
    position: { right: "25%", top: "44%" },
    products: ["garlic", "vinegar", "tamarind", "cookingOil", "marinade", "thaiHotpotSpice", "satay", "chiliSalt", "roastedSalt", "saladDressing", "stirFrySauce"],
  },
  {
    id: "dry-goods",
    section: "grocery-clothing",
    boardLabel: "Tạp hóa",
    title: "Tạp hóa khô",
    subtitle: "Gạo · mì · trứng · đậu hũ",
    position: { left: "25%", top: "44%" },
    products: ["chickenEggs", "quailEggs", "tofu", "rice", "bun", "noodles", "glassNoodles", "ricePaper", "peanuts", "butter", "honey"],
  },
  {
    id: "meat",
    section: "meat-fish",
    boardLabel: "Thịt",
    title: "Thịt tươi",
    subtitle: "Thịt heo · bò · gà",
    position: { left: "25%", top: "44%" },
    products: ["porkBelly", "beefSlices", "beefShank", "chicken", "chickenWings", "chickenFeet", "chickenCartilage", "porkRibs", "groundPork", "driedBeef"],
  },
  {
    id: "fish",
    section: "meat-fish",
    boardLabel: "Cá",
    title: "Cá · hải sản",
    subtitle: "Hàng tươi trong ngày",
    position: { right: "25%", top: "44%" },
    products: ["shrimp", "squid", "clams", "fieldCrab", "goby", "octopus", "seaSnail"],
  },
  {
    id: "seafood",
    section: "seafood-vegetables",
    boardLabel: "Hải sản",
    title: "Hải sản tươi",
    subtitle: "Tôm · cá · mực · nghêu",
    position: { left: "25%", top: "44%" },
    products: ["shrimp", "squid", "clams", "fieldCrab", "goby", "octopus", "seaSnail"],
  },
  {
    id: "greens",
    section: "seafood-vegetables",
    boardLabel: "Rau xanh",
    title: "Rau xanh",
    subtitle: "Rau · nấm · củ",
    position: { right: "25%", top: "44%" },
    products: ["hotpotGreens", "sideVegetables", "mixedMushrooms", "bambooShoots", "onion", "tomato", "laGiang", "laLot", "okra", "lemongrass", "garlic", "waterSpinach", "aromaticHerbs", "scallions", "potatoes", "rauRam", "mixedRoots", "leafyGreens"],
  },
];

export function getMarketStall(id: string | undefined): MarketStall | undefined {
  return MARKET_STALLS.find((stall) => stall.id === id);
}


