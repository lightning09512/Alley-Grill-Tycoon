import homeStage01Url from "../../assets/backgrounds/home-upgrades-v1/house-level-01.png";
import homeStage02Url from "../../assets/backgrounds/home-upgrades-v1/house-level-02.png";
import homeStage03Url from "../../assets/backgrounds/home-upgrades-v1/house-level-03.png";
import homeStage04Url from "../../assets/backgrounds/home-upgrades-v1/house-level-04.png";
import homeStage05Url from "../../assets/backgrounds/home-upgrades-v1/house-level-05.png";
import homeStage06Url from "../../assets/backgrounds/home-upgrades-v1/house-level-06.png";
import homeStage07Url from "../../assets/backgrounds/home-upgrades-v1/house-level-07.png";
import homeStage08Url from "../../assets/backgrounds/home-upgrades-v1/house-level-08.png";
import homeStage09Url from "../../assets/backgrounds/home-upgrades-v1/house-level-09.png";
import homeStage10Url from "../../assets/backgrounds/home-upgrades-v1/house-level-10.png";
import homeStage11Url from "../../assets/backgrounds/home-upgrades-v1/house-level-11.png";
import homeStage12Url from "../../assets/backgrounds/home-upgrades-v1/house-level-12.png";

export const HOME_MAP_SIZE = { width: 2_793, height: 1_689 } as const;

type HomeStage = {
  id: number;
  name: string;
  image: string;
  canvasWidth: number;
  canvasHeight: number;
  offsetX: number;
  offsetY: number;
  entryX: number;
  displayScale: number;
};

const earlyStageNames = [
  "Lều bạt tạm",
  "Chòi gỗ vá",
  "Nhà tôn cũ",
  "Nhà cấp bốn nhỏ",
  "Nhà cấp bốn gọn",
  "Nhà phố hai tầng, xe máy",
  "Nhà ống nâng cấp",
  "Nhà hai tầng, mô tô",
  "Nhà phố cải tạo",
  "Nhà phố hiện đại, chỗ xe",
  "Biệt thự, ô tô thể thao",
] as const;

const earlyStageImages = [
  homeStage01Url, homeStage02Url, homeStage03Url, homeStage04Url,
  homeStage05Url, homeStage06Url, homeStage07Url, homeStage08Url,
  homeStage09Url, homeStage10Url, homeStage11Url,
] as const;
const earlyStageEntryX = [560, 535, 490, 520, 510, 510, 515, 585, 420, 350, 560] as const;

// Placement values match assets/backgrounds/home-upgrades-v1/asset_manifest.json.
export const HOME_STAGES: readonly HomeStage[] = [
  ...earlyStageNames.map((name, index) => ({
    id: index + 1,
    name,
    image: earlyStageImages[index],
    canvasWidth: 1_120,
    canvasHeight: 620,
    offsetX: 836,
    offsetY: 490,
    entryX: earlyStageEntryX[index],
    displayScale: index >= 6 ? 1.12 : 1.5,
  })),
  {
    id: 12,
    name: "Biệt thự hiện đại, siêu xe",
    image: homeStage12Url,
    canvasWidth: 1_240,
    canvasHeight: 680,
    offsetX: 776,
    offsetY: 430,
    entryX: 575,
    displayScale: 1,
  },
];

export function getHomeStageImageKey(stage: number): string {
  return `home-house-stage-${String(stage).padStart(2, "0")}`;
}
