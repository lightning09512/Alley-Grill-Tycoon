import { GAME_NAME_VI } from "./game";
import shopStage01Url from "../../assets/business-upgrades/redesign/shop_01.png";
import shopStage02Url from "../../assets/business-upgrades/redesign/shop_02.png";
import shopStage03Url from "../../assets/business-upgrades/redesign/shop_03.png";
import shopStage04Url from "../../assets/business-upgrades/redesign/shop_04.png";
import shopStage05Url from "../../assets/business-upgrades/redesign/shop_05.png";
import shopStage06Url from "../../assets/business-upgrades/redesign/shop_06.png";
import shopStage07Url from "../../assets/business-upgrades/redesign/shop_07_full.png";
import shopStage08Url from "../../assets/business-upgrades/redesign/shop_08.png";
import shopStage09Url from "../../assets/business-upgrades/redesign/shop_09.png";
import shopStage10Url from "../../assets/business-upgrades/redesign/shop_10.png";
import shopStage11Url from "../../assets/business-upgrades/redesign/shop_11.png";
import shopStage12Url from "../../assets/business-upgrades/redesign/shop_12.png";

export const SHOP_BASE_SIZE = { width: 2_172, height: 1_280 } as const;

// The lot spans the gap between the two neighboring building walls.
// Every stage shares its center and the neighboring storefront line, slightly
// in front of the sidewalk's rear edge so the facade covers the vacant lot.
export const SHOP_OVERLAY_BOX = { x: 740, y: 170, w: 700, h: 685 } as const;
export const SHOP_STAGE_FADE_MS = 500;
export const SHOP_STAGE_ASSET_DIRECTORY = "assets/business-upgrades";

export type ShopStage = {
  id: number;
  image: string | null;
  filename: string;
  name: string;
  price?: number;
  income?: number;
  seats?: number;
};

const stageNames = [
  "Quán nhậu mái tôn",
  "Bếp nướng nhỏ",
  "Quán ngói bình dân",
  "Quán phố nhỏ",
  "Quán nướng khang trang",
  "Quán có gác",
  "Quán hai tầng",
  "Quán ban công",
  "Quán mái cong",
  "Nhà hàng ba gian",
  "Nhà hàng sân thượng",
  `Thương hiệu ${GAME_NAME_VI}`,
] as const;

const stageImages = [
  shopStage01Url, shopStage02Url, shopStage03Url, shopStage04Url,
  shopStage05Url, shopStage06Url, shopStage07Url, shopStage08Url,
  shopStage09Url, shopStage10Url, shopStage11Url, shopStage12Url,
] as const;

// All stages use full-facade replacement artwork.
export const SHOP_STAGES: readonly ShopStage[] = stageNames.map((name, index) => {
  const id = index + 1;
  const filename = id === 7
    ? "redesign/shop_07_full.png"
    : `redesign/shop_${String(id).padStart(2, "0")}.png`;
  return {
    id,
    image: stageImages[index],
    filename,
    name,
    price: undefined,
    income: undefined,
    seats: undefined,
  };
});

export function getShopStageImageKey(stage: number): string {
  return `shop-stage-${stage}`;
}
