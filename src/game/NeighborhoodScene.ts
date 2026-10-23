import Phaser from "phaser";
import morningStreetMapUrl from "../../assets/backgrounds/time-of-day/saigon-street-four-shops-morning.png";
import afternoonStreetMapUrl from "../../assets/backgrounds/time-of-day/saigon-street-four-shops-afternoon.png";
import rainStreetMapUrl from "../../assets/backgrounds/time-of-day/saigon-street-four-shops-rain.png";
import sunsetStreetMapUrl from "../../assets/backgrounds/time-of-day/saigon-street-four-shops-sunset.png";
import nightStreetMapUrl from "../../assets/backgrounds/time-of-day/saigon-street-four-shops-night.png";
import homeStreetDawnMapUrl from "../../assets/backgrounds/time-of-day/home/street-map-home-dawn.png";
import homeStreetDayMapUrl from "../../assets/backgrounds/time-of-day/home/street-map-home-day.png";
import homeStreetSunsetMapUrl from "../../assets/backgrounds/time-of-day/home/street-map-home-sunset.png";
import homeStreetNightMapUrl from "../../assets/backgrounds/time-of-day/home/street-map-home-night.png";
import homeStreetRainMapUrl from "../../assets/backgrounds/time-of-day/home/street-map-home-rain.png";
import treeCanopyLayerUrl from "../../assets/effects/saigon-tree-canopy-depth-layer-v1.png";
import dayNightEffectsUrl from "../../assets/effects/saigon-day-night-transition-atlas.png";
import weatherEffectsUrl from "../../assets/effects/saigon-weather-effects-atlas.png";
import schoolgirlIdleUrl from "../../assets/characters/saigon-schoolgirl-front-idle-v1-concept.png";
import backpackerTouristFrontUrl from "../../assets/characters/saigon-backpacker-tourist-front-customer.png";
import constructionWorkerFrontUrl from "../../assets/characters/saigon-construction-worker-front-customer.png";
import deliveryRiderFrontUrl from "../../assets/characters/saigon-delivery-rider-front-customer.png";
import foodReviewerFrontUrl from "../../assets/characters/saigon-food-reviewer-front-customer.png";
import genzNightowlFrontUrl from "../../assets/characters/saigon-genz-nightowl-front-customer.png";
import ingredientSupplierFrontUrl from "../../assets/characters/saigon-ingredient-supplier-front-customer.png";
import lotteryVendorFrontUrl from "../../assets/characters/saigon-lottery-vendor-front-customer.png";
import marketShopperFrontUrl from "../../assets/characters/saigon-market-shopper-front-customer.png";
import morningJoggerFrontUrl from "../../assets/characters/saigon-morning-jogger-front-customer.png";
import officeManFrontUrl from "../../assets/characters/saigon-office-man-front-customer.png";
import officeWomanFrontUrl from "../../assets/characters/saigon-office-woman-front-customer.png";
import olderRegularFrontUrl from "../../assets/characters/saigon-older-regular-front-customer.png";
import schoolboyFrontUrl from "../../assets/characters/saigon-schoolboy-front-customer.png";
import streetSweeperFrontUrl from "../../assets/characters/saigon-street-sweeper-front-customer.png";
import wardInspectorFrontUrl from "../../assets/characters/saigon-ward-inspector-front-customer.png";
import wardPoliceFrontUrl from "../../assets/characters/saigon-ward-police-officer-front-customer.png";
import youngMotherFrontUrl from "../../assets/characters/saigon-young-mother-front-customer.png";
import youngFatherFrontUrl from "../../assets/characters/sprite-gen-dining/saigon-young-father/front-customer.png";
import grandmotherFrontUrl from "../../assets/characters/sprite-gen-dining/saigon-grandmother/front-customer.png";
import preschoolerFrontUrl from "../../assets/characters/sprite-gen-dining/saigon-preschooler/front-customer.png";
import primaryTeacherFrontUrl from "../../assets/characters/sprite-gen-dining/saigon-primary-teacher/front-customer.png";
import motorbikeMechanicFrontUrl from "../../assets/characters/sprite-gen-dining/saigon-motorbike-mechanic/front-customer.png";
import traditionalTaxiDriverFrontUrl from "../../assets/characters/sprite-gen-dining/saigon-traditional-motorbike-taxi-driver/front-customer.png";
import nightShiftNurseFrontUrl from "../../assets/characters/sprite-gen-dining/saigon-night-shift-nurse/front-customer.png";
import taxiDriverFrontUrl from "../../assets/characters/sprite-gen-dining/saigon-taxi-driver/front-customer.png";
import cajonPlayerFrontUrl from "../../assets/characters/sprite-gen-dining/saigon-cajon-player/front-customer.png";
import schoolgirlWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-schoolgirl-walk-16f.png";
import officeManWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-office-man-walk-16f.png";
import marketShopperWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-market-shopper-walk-16f.png";
import touristWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-backpacker-tourist-walk-16f.png";
import constructionWorkerWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-construction-worker-walk-16f.png";
import deliveryRiderWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-delivery-rider-walk-16f.png";
import foodReviewerWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-food-reviewer-walk-16f.png";
import genzNightowlWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-genz-nightowl-walk-16f.png";
import ingredientSupplierWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-ingredient-supplier-walk-16f.png";
import lotteryVendorWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-lottery-vendor-walk-16f.png";
import morningJoggerWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-morning-jogger-walk-16f.png";
import officeWomanWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-office-woman-walk-16f.png";
import olderRegularWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-older-regular-walk-16f.png";
import schoolboyWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-schoolboy-walk-16f.png";
import streetSweeperWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-street-sweeper-walk-16f.png";
import wardPoliceWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-ward-police-officer-walk-16f.png";
import wardInspectorWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-ward-inspector-walk-16f.png";
import youngMotherWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-young-mother-walk-16f.png";
import youngFatherWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-young-father-walk-16f.png";
import grandmotherWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-grandmother-walk-16f-v2.png";
import preschoolerWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-preschooler-walk-16f.png";
import primaryTeacherWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-primary-teacher-walk-16f.png";
import motorbikeMechanicWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-motorbike-mechanic-walk-16f.png";
import traditionalTaxiDriverWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-traditional-motorbike-taxi-driver-walk-16f.png";
import nightShiftNurseWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-night-shift-nurse-walk-16f.png";
import taxiDriverWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-taxi-driver-walk-16f.png";
import cajonPlayerWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-cajon-player-walk-16f.png";
import streetCatActionsUrl from "../../assets/characters/saigon-street-cat-actions.png";
import deliveryGreenBikeUrl from "../../assets/vehicles/saigon-delivery-green-scooter.png";
import deliveryOrangeBikeUrl from "../../assets/vehicles/saigon-delivery-orange-scooter.png";
import waveBikeUrl from "../../assets/vehicles/saigon-motorbike-wave-style.png";
import visionBikeUrl from "../../assets/vehicles/saigon-scooter-vision-style.png";
import shBikeUrl from "../../assets/vehicles/saigon-scooter-sh-style.png";
import airbladeBikeUrl from "../../assets/vehicles/saigon-scooter-airblade-style.png";
import pigeonEatUrl from "../../assets/characters/pigeon_eat-Sheet.png";
import pigeonFlyUrl from "../../assets/characters/pigeon_fiy-Sheet.png";
import pigeonWalkUrl from "../../assets/characters/pigeon_walking-Sheet.png";
import taphoaStudentBoyWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-taphoa-student-boy-walk-16f.png";
import taphoaCollegeGirlWalkUrl from "../../assets/characters/sprite-gen-walk/saigon-taphoa-college-girl-walk-16f.png";
import taphoaStudentBoyBrowseUrl from "../../assets/characters/saigon-taphoa-student-boy-shop-idle-v1.png";
import taphoaCollegeGirlBrowseUrl from "../../assets/characters/saigon-taphoa-college-girl-shop-idle-v1.png";
import officeManPhoSeatUrl from "../../assets/characters/saigon-office-man-seated-pho-idle.png";
import officeWomanCoffeeSeatUrl from "../../assets/characters/saigon-office-woman-seated-coffee-idle.png";
import constructionWorkerComTamSeatUrl from "../../assets/characters/saigon-construction-worker-seated-com-tam-idle.png";
import backpackerCoffeeSeatUrl from "../../assets/characters/saigon-backpacker-tourist-seated-coffee-idle.png";
import olderRegularComTamSeatUrl from "../../assets/characters/saigon-older-regular-seated-com-tam-idle.png";
import ownerFemaleIdleUrl from "../../assets/characters/player-owner/owner_female_idle_8f.png";
import ownerFemaleWalkUrl from "../../assets/characters/player-owner/owner_female_walk_24f.png";
import ownerGroundShadowUrl from "../../assets/characters/player-owner/owner_ground_shadow.png";
import ownerMaleIdleBase8DirUrl from "../../assets/characters/player-owner/generated-8dir-v1-final/runtime/idle-base-8dir.png";
import ownerMaleIdleGlance8DirUrl from "../../assets/characters/player-owner/generated-8dir-v1-final/runtime/idle-glance-8dir.png";
import ownerMaleIdleApron8DirUrl from "../../assets/characters/player-owner/generated-8dir-v1-final/runtime/idle-apron-8dir.png";
import ownerMaleWalk8DirUrl from "../../assets/characters/player-owner/generated-8dir-v1-final/runtime/walk-8dir.png";
import {
  getHomeStageImageKey,
  HOME_MAP_SIZE,
  HOME_STAGES,
} from "../config/homeStages";
import {
  getShopStageImageKey,
  SHOP_BASE_SIZE,
  SHOP_OVERLAY_BOX,
  SHOP_STAGE_ASSET_DIRECTORY,
  SHOP_STAGE_FADE_MS,
  SHOP_STAGES,
} from "../config/shopStages";
import { formatStoreNameForDisplay, GAME_NAME_VI } from "../config/game";
import {
  WHOLESALE_MARKET_EXTERIOR_ASSETS,
  WHOLESALE_MARKET_EXTERIOR_SIZE,
  WHOLESALE_MARKET_EXTERIOR_TEXTURE_KEYS,
  type WholesaleMarketBackgroundMood,
  type WholesaleMarketLightingState,
} from "../config/wholesaleMarket";
import { SHOP_COOKING_STEAM_POINTS, STREET_COOKING_STEAM_POINTS } from "../config/cookingSteam";
import { setIcon, type UiIconName } from "../ui/icons";
import { RECIPES, type CustomerType } from "./data";
import { DINING_OUTDOOR_WALK_SECONDS, GameStore, type DiningGuest, type GameSnapshot, type WaitingCustomer } from "./GameStore";
import {
  streetWalkerDialogues,
  TRAFFIC_DRIVER_DIALOGUES,
  TRAFFIC_JAM_ARGUMENTS,
  TRAFFIC_JAM_REPLIES,
  TRAFFIC_JAM_START_LINES,
} from "./streetDialogues";

type CustomerAppearance = {
  key: string;
  frontUrl: string;
  walkKey: string;
  shortName: string;
  idleAnimation?: string;
};

type ShopArtworkAlphaBounds = { left: number; top: number; right: number; bottom: number };
type ShopArtworkTransform = { offsetX: number; offsetY: number; scaleX: number; scaleY: number };
type MapZone = "home" | "shop" | "market";
type MapTransitionSign = {
  from: MapZone;
  kind: "edge" | "door";
  to?: MapZone;
  action?: "enter-home" | "enter-market";
  title: string;
  container: Phaser.GameObjects.Container;
  hitZone: Phaser.GameObjects.Zone;
  frame: Phaser.GameObjects.Graphics;
  titleText: Phaser.GameObjects.Text;
  width: number;
  height: number;
};

const CUSTOMER_APPEARANCES: Record<CustomerType, readonly CustomerAppearance[]> = {
  student: [
    { key: "customer-schoolgirl-idle", frontUrl: schoolgirlIdleUrl, walkKey: "walk-student", shortName: "Bạn học sinh", idleAnimation: "customer-schoolgirl-idle-loop" },
    { key: "customer-schoolboy", frontUrl: schoolboyFrontUrl, walkKey: "walk-schoolboy", shortName: "Bạn nam sinh" },
    { key: "customer-preschooler", frontUrl: preschoolerFrontUrl, walkKey: "walk-preschooler", shortName: "Bé đi cùng gia đình" },
    { key: "customer-night-shift-nurse", frontUrl: nightShiftNurseFrontUrl, walkKey: "walk-night-shift-nurse", shortName: "Cô y tá tan ca" },
  ],
  office: [
    { key: "customer-office-man", frontUrl: officeManFrontUrl, walkKey: "walk-office", shortName: "Anh văn phòng" },
    { key: "customer-office-woman", frontUrl: officeWomanFrontUrl, walkKey: "walk-office-woman", shortName: "Cô văn phòng" },
    { key: "customer-young-father", frontUrl: youngFatherFrontUrl, walkKey: "walk-young-father", shortName: "Anh tan làm" },
    { key: "customer-primary-teacher", frontUrl: primaryTeacherFrontUrl, walkKey: "walk-primary-teacher", shortName: "Cô giáo" },
    { key: "customer-taxi-driver", frontUrl: taxiDriverFrontUrl, walkKey: "walk-taxi-driver", shortName: "Chú tài xế taxi" },
  ],
  shopper: [
    { key: "customer-market-shopper", frontUrl: marketShopperFrontUrl, walkKey: "walk-shopper", shortName: "Cô đi chợ" },
    { key: "customer-grandmother", frontUrl: grandmotherFrontUrl, walkKey: "walk-grandmother", shortName: "Bà đi dạo" },
    { key: "customer-older-regular", frontUrl: olderRegularFrontUrl, walkKey: "walk-older-regular", shortName: "Khách quen" },
    { key: "customer-young-mother", frontUrl: youngMotherFrontUrl, walkKey: "walk-young-mother", shortName: "Mẹ trẻ" },
    { key: "customer-construction-worker", frontUrl: constructionWorkerFrontUrl, walkKey: "walk-construction-worker", shortName: "Chú công nhân" },
    { key: "customer-delivery-rider", frontUrl: deliveryRiderFrontUrl, walkKey: "walk-delivery-rider", shortName: "Anh giao hàng" },
    { key: "customer-ingredient-supplier", frontUrl: ingredientSupplierFrontUrl, walkKey: "walk-ingredient-supplier", shortName: "Người giao hàng" },
    { key: "customer-lottery-vendor", frontUrl: lotteryVendorFrontUrl, walkKey: "walk-lottery-vendor", shortName: "Cô bán vé số" },
    { key: "customer-morning-jogger", frontUrl: morningJoggerFrontUrl, walkKey: "walk-morning-jogger", shortName: "Người chạy bộ" },
    { key: "customer-street-sweeper", frontUrl: streetSweeperFrontUrl, walkKey: "walk-street-sweeper", shortName: "Chú quét đường" },
    { key: "customer-ward-inspector", frontUrl: wardInspectorFrontUrl, walkKey: "walk-ward-inspector", shortName: "Cán bộ phường" },
    { key: "customer-ward-police", frontUrl: wardPoliceFrontUrl, walkKey: "walk-ward-police-officer", shortName: "Công an phường" },
    { key: "customer-motorbike-mechanic", frontUrl: motorbikeMechanicFrontUrl, walkKey: "walk-motorbike-mechanic", shortName: "Chú thợ sửa xe" },
    { key: "customer-traditional-taxi-driver", frontUrl: traditionalTaxiDriverFrontUrl, walkKey: "walk-traditional-taxi-driver", shortName: "Chú xe ôm" },
  ],
  tourist: [
    { key: "customer-backpacker-tourist", frontUrl: backpackerTouristFrontUrl, walkKey: "walk-tourist", shortName: "Du khách" },
    { key: "customer-food-reviewer", frontUrl: foodReviewerFrontUrl, walkKey: "walk-food-reviewer", shortName: "Food blogger" },
    { key: "customer-genz-nightowl", frontUrl: genzNightowlFrontUrl, walkKey: "walk-genz-nightowl", shortName: "Bạn trẻ" },
    { key: "customer-cajon-player", frontUrl: cajonPlayerFrontUrl, walkKey: "walk-cajon-player", shortName: "Bạn chơi cajon" },
  ],
};

const ALL_CUSTOMER_APPEARANCES: readonly CustomerAppearance[] = [
  ...CUSTOMER_APPEARANCES.student,
  ...CUSTOMER_APPEARANCES.office,
  ...CUSTOMER_APPEARANCES.shopper,
  ...CUSTOMER_APPEARANCES.tourist,
];

const WALKER_TEXTURES = [
  "walk-student",
  "walk-office",
  "walk-shopper",
  "walk-tourist",
  "walk-street-cat",
  "walk-construction-worker",
  "walk-delivery-rider",
  "walk-food-reviewer",
  "walk-genz-nightowl",
  "walk-ingredient-supplier",
  "walk-lottery-vendor",
  "walk-morning-jogger",
  "walk-office-woman",
  "walk-young-father",
  "walk-older-regular",
  "walk-grandmother",
  "walk-preschooler",
  "walk-schoolboy",
  "walk-street-sweeper",
  "walk-ward-police-officer",
  "walk-ward-inspector",
  "walk-young-mother",
  "walk-primary-teacher",
  "walk-motorbike-mechanic",
  "walk-traditional-taxi-driver",
  "walk-night-shift-nurse",
  "walk-taxi-driver",
  "walk-cajon-player",
] as const;

const WALKER_FOOTPRINTS: Partial<Record<(typeof WALKER_TEXTURES)[number], {
  width: number;
  height: number;
  shadowWidth: number;
  shadowHeight: number;
}>> = {
  // The cat atlas uses square frames; its transparent padding keeps poses
  // aligned to the sidewalk baseline.
  "walk-street-cat": { width: 72, height: 72, shadowWidth: 38, shadowHeight: 9 },
};

const PET_SPRITE_GRIDS = {
  "walk-street-cat": { url: streetCatActionsUrl, frameWidth: 160, frameHeight: 160 },
} as const;

const AMBIENT_WALKER_ASSETS = [
  { key: "walk-student", url: schoolgirlWalkUrl },
  { key: "walk-office", url: officeManWalkUrl },
  { key: "walk-shopper", url: marketShopperWalkUrl },
  { key: "walk-tourist", url: touristWalkUrl },
  { key: "walk-street-cat", url: streetCatActionsUrl },
  { key: "walk-construction-worker", url: constructionWorkerWalkUrl },
  { key: "walk-delivery-rider", url: deliveryRiderWalkUrl },
  { key: "walk-food-reviewer", url: foodReviewerWalkUrl },
  { key: "walk-genz-nightowl", url: genzNightowlWalkUrl },
  { key: "walk-ingredient-supplier", url: ingredientSupplierWalkUrl },
  { key: "walk-lottery-vendor", url: lotteryVendorWalkUrl },
  { key: "walk-morning-jogger", url: morningJoggerWalkUrl },
  { key: "walk-office-woman", url: officeWomanWalkUrl },
  { key: "walk-older-regular", url: olderRegularWalkUrl },
  { key: "walk-schoolboy", url: schoolboyWalkUrl },
  { key: "walk-street-sweeper", url: streetSweeperWalkUrl },
  { key: "walk-ward-police-officer", url: wardPoliceWalkUrl },
  { key: "walk-ward-inspector", url: wardInspectorWalkUrl },
  { key: "walk-young-mother", url: youngMotherWalkUrl },
  { key: "walk-young-father", url: youngFatherWalkUrl },
  { key: "walk-grandmother", url: grandmotherWalkUrl },
  { key: "walk-preschooler", url: preschoolerWalkUrl },
  { key: "walk-primary-teacher", url: primaryTeacherWalkUrl },
  { key: "walk-motorbike-mechanic", url: motorbikeMechanicWalkUrl },
  { key: "walk-traditional-taxi-driver", url: traditionalTaxiDriverWalkUrl },
  { key: "walk-night-shift-nurse", url: nightShiftNurseWalkUrl },
  { key: "walk-taxi-driver", url: taxiDriverWalkUrl },
  { key: "walk-cajon-player", url: cajonPlayerWalkUrl },
] as const;

const TRAFFIC_BIKE_PROFILES = [
  { key: "traffic-delivery-green", url: deliveryGreenBikeUrl, scale: 0.98, speed: 96 },
  { key: "traffic-delivery-orange", url: deliveryOrangeBikeUrl, scale: 0.97, speed: 102 },
  { key: "traffic-wave-style", url: waveBikeUrl, scale: 0.92, speed: 92 },
  { key: "traffic-vision-style", url: visionBikeUrl, scale: 0.94, speed: 96 },
  { key: "traffic-sh-style", url: shBikeUrl, scale: 1.04, speed: 104 },
  { key: "traffic-airblade-style", url: airbladeBikeUrl, scale: 1.0, speed: 101 },
] as const;
// The source sheets have generous transparent margins. Use a larger game-space
// frame so the visible bike and rider read at the same scale as street walkers.
const TRAFFIC_BIKE_DISPLAY_WIDTH = 228;
const TRAFFIC_BIKE_DISPLAY_HEIGHT = 152;
const TRAFFIC_BIKE_SHADOW_WIDTH = 190;
type TrafficLaneIndex = 0 | 1 | 2 | 3;
type WalkerLaneIndex = 0 | 1 | 2 | 3;

// Two parallel tracks per direction keep scooters spread across the road.
const TRAFFIC_BIKE_LANES = [
  { yRatio: 0.835, direction: -1 },
  { yRatio: 0.852, direction: -1 },
  { yRatio: 0.876, direction: 1 },
  { yRatio: 0.893, direction: 1 },
] as const;
// The wholesale-market backdrop places its road below a much lower curb and
// dashed divider than the main street, so its four tracks sit lower as well.
const MARKET_TRAFFIC_BIKE_LANES = [
  { yRatio: 0.866, direction: -1 },
  { yRatio: 0.889, direction: -1 },
  { yRatio: 0.946, direction: 1 },
  { yRatio: 0.969, direction: 1 },
] as const;
const MAX_ACTIVE_TRAFFIC_BIKES = 8;
const MAX_TRAFFIC_BIKES_PER_LANE = 2;
const TRAFFIC_BIKE_FOLLOWING_GAP = 205;
const TRAFFIC_BIKE_SPAWN_GAP = 205;
const CUSTOMER_FRAME_WIDTH = 247;
const CUSTOMER_FRAME_HEIGHT = 396;
const OWNER_FRAME_WIDTH = 247;
const OWNER_FRAME_HEIGHT = 396;
const OWNER_FRAME_BASELINE = 390;
const OWNER_ART_HEIGHT = 375;
const OWNER_ATLAS_COLUMNS = 8;
const OWNER_DIRECTIONS = ["n", "ne", "e", "se", "s", "sw", "w", "nw"] as const;
type OwnerDirection = (typeof OWNER_DIRECTIONS)[number];
type OwnerIdleVariant = "base" | "glance" | "apron";
const OWNER_MOVEMENT_DIRECTION_SECTORS = ["e", "se", "s", "sw", "w", "nw", "n", "ne"] as const satisfies readonly OwnerDirection[];
const OWNER_MAP_Y_RATIO = 0.74;
const OWNER_MAP_Y_BOUNDS = {
  home: { minRatio: 0.72, maxRatio: 0.9 },
  shop: { minRatio: 0.69, maxRatio: 0.9 },
  market: { minRatio: 0.72, maxRatio: 0.89 },
} as const;
const OWNER_DISPLAY_WIDTH = 54;
const OWNER_DISPLAY_HEIGHT = 86;
const OWNER_TARGET_VISIBLE_HEIGHT = 78;
const OWNER_IDLE_FRAME_SEQUENCE = [
  0, 1, 2, 1, 0, 4, 5, 7,
  0, 1, 2, 1, 0, 4, 5, 7,
  0, 1, 2, 1, 0, 4, 5, 7,
  0, 1, 2, 1, 0, 4, 5, 7,
  0, 1, 2, 1, 0, 4, 5, 3,
];

function getOwnerDirectionFromVector(x: number, y: number, currentDirection?: OwnerDirection): OwnerDirection {
  const angle = Math.atan2(y, x);
  const sector = Math.round(angle / (Math.PI / 4));
  const nextDirection = OWNER_MOVEMENT_DIRECTION_SECTORS[(sector + OWNER_MOVEMENT_DIRECTION_SECTORS.length) % OWNER_MOVEMENT_DIRECTION_SECTORS.length];
  if (!currentDirection) return nextDirection;

  const currentSector = OWNER_MOVEMENT_DIRECTION_SECTORS.indexOf(currentDirection);
  const currentAngle = currentSector * (Math.PI / 4);
  const angleFromCurrent = Math.atan2(Math.sin(angle - currentAngle), Math.cos(angle - currentAngle));
  const directionChangeThreshold = Math.PI / 8 + Math.PI / 36;
  return Math.abs(angleFromCurrent) <= directionChangeThreshold ? currentDirection : nextDirection;
}

const CUSTOMER_DISPLAY_WIDTH = 54;
const CUSTOMER_DISPLAY_HEIGHT = 86;
const CHARACTER_TARGET_VISIBLE_HEIGHT = 78;
const CHARACTER_DISPLAY_SCALE = 1.5;
const WALKER_BASELINE_Y = 374;
const OWNER_WALK_FRAME_RATE = 9;
// A relaxed cadence keeps the generated eight-pose walk cycle from feeling hurried.
const WALK_FRAME_RATE = 6;
const CORE_WALKER_COUNT = 6;
const SHOP_OVERLAY_DEPTH = 3.25;
const COOKING_STEAM_DEPTH = 3.35;
const HOME_AMBIENT_WALKER_COUNT = 3;
const MARKET_AMBIENT_WALKER_COUNT = 9;
const MAX_ACTIVE_AMBIENT_WALKERS = WALKER_TEXTURES.length + HOME_AMBIENT_WALKER_COUNT + MARKET_AMBIENT_WALKER_COUNT;
const WALKER_COUNT_BY_CROWD = { quiet: 6, steady: 11, busy: 20 } as const;
const LATE_NIGHT_WALKER_PRIORITY = [
  "walk-genz-nightowl", "walk-delivery-rider", "walk-street-cat", "walk-food-reviewer",
  "walk-older-regular", "walk-ward-police-officer", "walk-lottery-vendor", "walk-street-sweeper",
  "walk-ingredient-supplier", "walk-office-woman", "walk-young-father", "walk-tourist", "walk-shopper",
  "walk-office", "walk-student", "walk-young-mother", "walk-grandmother", "walk-construction-worker", "walk-schoolboy",
  "walk-ward-inspector", "walk-preschooler",
  "walk-primary-teacher",
  "walk-night-shift-nurse", "walk-motorbike-mechanic", "walk-traditional-taxi-driver",
  "walk-taxi-driver", "walk-cajon-player",
] as const;
const MORNING_WALKER_PRIORITY = [
  "walk-morning-jogger", "walk-street-sweeper", "walk-office-woman", "walk-student",
  "walk-office", "walk-older-regular", "walk-grandmother", "walk-young-mother", "walk-young-father", "walk-ingredient-supplier",
  "walk-shopper", "walk-tourist", "walk-delivery-rider", "walk-street-cat",
  "walk-construction-worker", "walk-food-reviewer", "walk-schoolboy", "walk-lottery-vendor",
  "walk-genz-nightowl", "walk-ward-police-officer", "walk-ward-inspector", "walk-preschooler",
  "walk-primary-teacher",
  "walk-night-shift-nurse", "walk-motorbike-mechanic", "walk-traditional-taxi-driver",
  "walk-taxi-driver", "walk-cajon-player",
] as const;
const WIND_MAP_WIDTH = SHOP_BASE_SIZE.width / 4;
const WIND_MAP_HEIGHT = SHOP_BASE_SIZE.height / 4;
const ENVIRONMENT_WIND_TEXTURE = "environment-wind-displacement";
const TREE_CANOPY_LAYER_TEXTURE = "tree-canopy-depth-layer";
const TREE_CANOPY_LAYER_ASPECT_RATIO = 1484 / 1060;
const TREE_CANOPY_LAYERS = [
  { side: "left", x: 0.018, y: 0.28, height: 0.13, phase: 0.35 },
  { side: "left", x: 0.012, y: 0.15, height: 0.09, phase: 0.42 },
  { side: "right", x: 0.992, y: 0.18, height: 0.11, phase: 2.41 },
  { side: "right", x: 0.99, y: 0.075, height: 0.085, phase: 2.48 },
] as const;
const FLAG_WIND_REGION = [[0.916, 0.19], [0.955, 0.19], [0.955, 0.269], [0.916, 0.266]] as const;
const DAY_LENGTH_MS = 6 * 60_000;
const WEATHER_CYCLE_MS = 6 * 60_000;
const START_DAY_PHASE = 0.42;

// Measured alpha bounds keep sheets with different transparent margins at the
// same apparent height when they share a sidewalk or customer queue.
const WALKER_ART_HEIGHTS: Record<string, number> = {
  "walk-student": 350,
  "walk-office": 350,
  "walk-shopper": 350,
  "walk-tourist": 350,
  "walk-construction-worker": 350,
  "walk-delivery-rider": 350,
  "walk-food-reviewer": 350,
  "walk-genz-nightowl": 350,
  "walk-ingredient-supplier": 350,
  "walk-lottery-vendor": 350,
  "walk-morning-jogger": 350,
  "walk-office-woman": 350,
  "walk-older-regular": 350,
  "walk-schoolboy": 350,
  "walk-street-sweeper": 350,
  "walk-ward-police-officer": 350,
  "walk-ward-inspector": 350,
  "walk-young-mother": 350,
  "walk-young-father": 322,
  "walk-grandmother": 322,
  // Use the larger normalization height to keep the preschooler shorter than adults.
  "walk-preschooler": 380,
  "walk-primary-teacher": 322,
  "walk-motorbike-mechanic": 322,
  "walk-traditional-taxi-driver": 322,
  "walk-night-shift-nurse": 322,
  "walk-taxi-driver": 322,
  "walk-cajon-player": 322,
  "walk-taphoa-student-boy": 350,
  "walk-taphoa-college-girl": 350,
};

const CUSTOMER_ART_HEIGHTS: Record<string, number> = {
  "customer-schoolgirl-idle": 350,
  "customer-schoolboy": 352,
  "customer-office-man": 335,
  "customer-office-woman": 347,
  "customer-market-shopper": 346,
  "customer-older-regular": 349,
  "customer-young-mother": 344,
  "customer-young-father": 322,
  "customer-grandmother": 322,
  "customer-preschooler": 380,
  "customer-primary-teacher": 322,
  "customer-motorbike-mechanic": 322,
  "customer-traditional-taxi-driver": 322,
  "customer-night-shift-nurse": 322,
  "customer-taxi-driver": 322,
  "customer-cajon-player": 322,
  "customer-construction-worker": 345,
  "customer-delivery-rider": 345,
  "customer-ingredient-supplier": 353,
  "customer-lottery-vendor": 354,
  "customer-morning-jogger": 343,
  "customer-street-sweeper": 347,
  "customer-ward-inspector": 354,
  "customer-ward-police": 365,
  "customer-backpacker-tourist": 345,
  "customer-food-reviewer": 354,
  "customer-genz-nightowl": 349,
};

const CUSTOMER_ART_BOTTOMS: Record<string, number> = {
  "customer-schoolgirl-idle": 374,
  "customer-schoolboy": 389,
  "customer-office-man": 377,
  "customer-office-woman": 393,
  "customer-market-shopper": 391,
  "customer-older-regular": 393,
  "customer-young-mother": 377,
  "customer-young-father": 359,
  "customer-grandmother": 359,
  "customer-preschooler": 359,
  "customer-primary-teacher": 359,
  "customer-motorbike-mechanic": 359,
  "customer-traditional-taxi-driver": 359,
  "customer-night-shift-nurse": 359,
  "customer-taxi-driver": 359,
  "customer-cajon-player": 359,
  "customer-construction-worker": 390,
  "customer-delivery-rider": 389,
  "customer-ingredient-supplier": 391,
  "customer-lottery-vendor": 389,
  "customer-morning-jogger": 391,
  "customer-street-sweeper": 393,
  "customer-ward-inspector": 396,
  "customer-ward-police": 395,
  "customer-backpacker-tourist": 391,
  "customer-food-reviewer": 391,
  "customer-genz-nightowl": 396,
};

const WALKER_ART_BOTTOMS: Record<string, number> = {
  "walk-young-father": 359,
  "walk-grandmother": 359,
  "walk-preschooler": 359,
  "walk-primary-teacher": 359,
  "walk-motorbike-mechanic": 359,
  "walk-traditional-taxi-driver": 359,
  "walk-night-shift-nurse": 359,
  "walk-taxi-driver": 359,
  "walk-cajon-player": 359,
};

const GROCERY_BROWSE_ART_HEIGHTS: Record<string, number> = {
  "browse-taphoa-student-boy": 746,
  "browse-taphoa-college-girl": 779,
};

const GROCERY_BROWSE_ART_BOTTOMS: Record<string, number> = {
  "browse-taphoa-student-boy": 777,
  "browse-taphoa-college-girl": 779,
};

const DINER_ART_HEIGHTS: Record<string, number> = {
  "diner-office-man-pho": 342,
  "diner-office-woman-coffee": 342,
  "diner-construction-worker-com-tam": 338,
  "diner-backpacker-coffee": 711,
  "diner-older-regular-com-tam": 740,
};

const DINER_ART_BOTTOMS: Record<string, number> = {
  "diner-office-man-pho": 374,
  "diner-office-woman-coffee": 374,
  "diner-construction-worker-com-tam": 374,
  "diner-backpacker-coffee": 757,
  "diner-older-regular-com-tam": 770,
};

type OwnerGender = "male" | "female";
type TimeOfDayMap = "dawn" | "day" | "sunset" | "night";
type StreetMapMood = TimeOfDayMap | "rain";
const STREET_MAP_TEXTURES: Record<StreetMapMood, string> = {
  dawn: "street-map-dawn",
  day: "street-map-day",
  rain: "street-map-rain",
  sunset: "street-map-sunset",
  night: "street-map-night",
};
const STREET_MAP_ASSETS: { mood: StreetMapMood; url: string }[] = [
  { mood: "dawn", url: morningStreetMapUrl },
  { mood: "day", url: afternoonStreetMapUrl },
  { mood: "rain", url: rainStreetMapUrl },
  { mood: "sunset", url: sunsetStreetMapUrl },
  { mood: "night", url: nightStreetMapUrl },
];
const HOME_STREET_MAP_TEXTURES: Record<TimeOfDayMap, string> = {
  dawn: "street-map-home-dawn",
  day: "street-map-home-day",
  sunset: "street-map-home-sunset",
  night: "street-map-home-night",
};
const HOME_STREET_RAIN_TEXTURE = "street-map-home-rain";
const HOME_STREET_MAP_ASSETS: { mood: TimeOfDayMap; url: string }[] = [
  { mood: "dawn", url: homeStreetDawnMapUrl },
  { mood: "day", url: homeStreetDayMapUrl },
  { mood: "sunset", url: homeStreetSunsetMapUrl },
  { mood: "night", url: homeStreetNightMapUrl },
];
const TIME_OF_DAY_STOPS: readonly { phase: number; mood: TimeOfDayMap }[] = [
  { phase: 0, mood: "night" },
  { phase: 0.25, mood: "dawn" },
  { phase: 0.5, mood: "day" },
  { phase: 0.75, mood: "sunset" },
  { phase: 1, mood: "night" },
];
const OWNER_WALK_SPEED = 290;
const ZONE_TRANSITION_FADE_MS = 170;

// Exterior gains are measured against the matching areas of the painted street
// maps. Warm shop lights retain their brightness as the surrounding facade dims.
const SHOP_LIGHTING_GAINS: Record<Exclude<StreetMapMood, "day">, {
  ambient: readonly [number, number, number];
  lit: readonly [number, number, number];
}> = {
  dawn: { ambient: [0.65, 0.63, 0.82], lit: [1.03, 0.94, 0.84] },
  sunset: { ambient: [0.96, 0.74, 0.64], lit: [1.08, 0.9, 0.77] },
  // Keep the whole facade warm and readable at night; the darker ambient
  // gain left roofs, timber, and plaster far below the brightness of the lamps.
  night: { ambient: [0.7, 0.64, 0.58], lit: [1.08, 0.98, 0.84] },
  rain: { ambient: [0.78, 0.75, 0.79], lit: [0.97, 0.88, 0.85] },
};

function getWalkerOriginY(_textureKey: string): number {
  if (_textureKey === "walk-street-cat") return 1;
  return (WALKER_ART_BOTTOMS[_textureKey] ?? WALKER_BASELINE_Y) / CUSTOMER_FRAME_HEIGHT;
}

function getWalkerFrameHeight(_textureKey: string): number {
  return CUSTOMER_FRAME_HEIGHT;
}

function getCharacterScaleFactor(artHeight: number, frameHeight: number, displayHeight: number, targetHeight = CHARACTER_TARGET_VISIBLE_HEIGHT): number {
  return targetHeight / (artHeight / frameHeight * displayHeight);
}

function setCharacterDisplaySize(
  sprite: Phaser.GameObjects.Sprite,
  displayWidth: number,
  displayHeight: number,
  frameHeight: number,
  artHeight: number,
  targetHeight = CHARACTER_TARGET_VISIBLE_HEIGHT,
): void {
  sprite.setDisplaySize(displayWidth, displayHeight);
  const scaleFactor = getCharacterScaleFactor(artHeight, frameHeight, displayHeight, targetHeight);
  sprite.setScale(sprite.scaleX * scaleFactor, sprite.scaleY * scaleFactor);
}

function getWalkerArtHeight(textureKey: string): number {
  return WALKER_ART_HEIGHTS[textureKey] ?? 350;
}

function getZoneArtworkScale(zone: MapZone): number {
  const artworkHeight = zone === "home"
    ? HOME_MAP_SIZE.height
    : zone === "market"
      ? WHOLESALE_MARKET_EXTERIOR_SIZE.height
      : SHOP_BASE_SIZE.height;
  return SHOP_BASE_SIZE.height / artworkHeight;
}

function getDinerFrameHeight(textureKey: string): number {
  if (textureKey === "diner-backpacker-coffee") return 795;
  if (textureKey === "diner-older-regular-com-tam") return 794;
  return CUSTOMER_FRAME_HEIGHT;
}

function getCustomerOriginY(textureKey: string): number {
  return (CUSTOMER_ART_BOTTOMS[textureKey] ?? CUSTOMER_FRAME_HEIGHT) / CUSTOMER_FRAME_HEIGHT;
}

function getDinerOriginY(textureKey: string): number {
  return (DINER_ART_BOTTOMS[textureKey] ?? getDinerFrameHeight(textureKey)) / getDinerFrameHeight(textureKey);
}

function getGroceryBrowseOriginY(textureKey: string): number {
  const frameHeight = 795;
  return (GROCERY_BROWSE_ART_BOTTOMS[textureKey] ?? frameHeight) / frameHeight;
}

function getWalkerStartFrame(textureKey: string, direction: -1 | 1): number {
  if (textureKey === "walk-street-cat") return direction > 0 ? 4 : 12;
  return direction > 0 ? 8 : 0;
}

function getAmbientWalkerSpeed(index: number, textureKey: string, unit: number): number {
  if (textureKey === "walk-street-cat") return 30 * unit;
  return (28 + ((index * 11) % 5) * 3) * unit;
}

function getStreetCharacterDepth(y: number): number {
  // Every person and pet uses the same foot-baseline sort. A larger y is nearer
  // the camera, so the front sidewalk lane always draws over the back lane.
  return 3.5 + y / 100_000;
}

const WEATHER_FRAMES = {
  clouds: [
    [47, 122, 123, 59], [192, 82, 222, 107], [432, 42, 330, 150],
    [811, 90, 168, 99], [992, 95, 144, 89], [1158, 125, 167, 64], [1340, 90, 151, 97],
  ],
  rain: [
    [124, 560, 29, 35], [179, 562, 28, 33], [235, 552, 41, 50], [311, 568, 32, 45],
    [360, 561, 37, 57], [417, 552, 44, 66], [487, 544, 54, 80], [565, 528, 62, 79],
    [629, 533, 47, 61], [675, 530, 65, 94], [737, 532, 67, 102], [1103, 557, 26, 49],
    [1356, 562, 22, 51],
  ],
  splashes: [
    [74, 697, 46, 38], [174, 680, 58, 54], [293, 679, 99, 58],
    [441, 704, 48, 27], [544, 697, 30, 34], [656, 691, 66, 46],
  ],
  ripples: [
    [836, 689, 91, 41], [1002, 679, 79, 57], [1137, 687, 84, 37], [1343, 695, 51, 22],
  ],
  shadows: [
    [1064, 813, 178, 49], [1280, 814, 203, 50], [1085, 882, 398, 73],
  ],
} as const;

// Keep four pedestrian rows; home rows sit closer to the street side of the sidewalk.
const WALKER_LANE_RATIOS = [0.69, 0.708, 0.727, 0.745] as const;
const HOME_WALKER_LANE_RATIOS = [0.68, 0.688, 0.696, 0.704] as const;

const DAY_NIGHT_FRAMES = {
  sun: [327, 117, 128, 136],
  sunset: [1305, 163, 145, 73],
  moon: [195, 505, 100, 127],
  stars: [
    [470, 513, 103, 104], [673, 545, 59, 60], [846, 517, 101, 106],
    [1048, 545, 57, 59], [1274, 525, 93, 93], [1501, 546, 56, 56],
  ],
  warmGlows: [
    [55, 718, 180, 96], [346, 726, 149, 86], [592, 740, 125, 73], [822, 741, 116, 71],
  ],
} as const;

type AmbientWalkerZone = "home" | "shop" | "market";
type StreetCrowdSchedule = "late-night" | "morning" | "day";
export type StreetCrowdLevel = "quiet" | "steady" | "busy";
export interface StreetCrowdState {
  level: StreetCrowdLevel;
  customerArrivalMultiplier: number;
}

type Walker = {
  textureKey: (typeof WALKER_TEXTURES)[number];
  zone: AmbientWalkerZone;
  sprite: Phaser.GameObjects.Sprite;
  shadow: Phaser.GameObjects.Image;
  speechBubble?: Phaser.GameObjects.Container;
  active: boolean;
  enabled: boolean;
  direction: -1 | 1;
  lane: WalkerLaneIndex;
  speed: number;
  size: number;
  width: number;
  height: number;
  shadowWidth: number;
  shadowHeight: number;
  positionRatio: number;
  petMode?: "walking" | "paused";
  petNextPauseAt?: number;
  petPauseUntil?: number;
  petPauseCycle?: number;
  petAnimationComplete?: () => void;
};

type DiningGuestAtlas = {
  frame_layout: {
    cellWidth: number;
    cellHeight: number;
    rows: Record<string, { x: number; y: number; w: number; h: number }[]>;
  };
  animation: { rows: Record<string, { fps: number; loop: boolean }> };
  anchors: { standingFeet: { x: number; y: number } };
};

type OutdoorDiningGuestActor = {
  sprite: Phaser.GameObjects.Sprite;
  shadow: Phaser.GameObjects.Ellipse;
  status: DiningGuest["status"];
  transitionSeconds: number;
  syncedAt: number;
};

const DINING_GUEST_ATLAS_URLS = import.meta.glob("../../assets/characters/sprite-gen-dining/*/game-atlas.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const DINING_GUEST_ATLAS_MANIFESTS = import.meta.glob("../../assets/characters/sprite-gen-dining/*/game-manifest.json", {
  eager: true,
  import: "default",
}) as Record<string, DiningGuestAtlas>;

type TrafficBike = {
  profile: (typeof TRAFFIC_BIKE_PROFILES)[number];
  sprite: Phaser.GameObjects.Image;
  shadow: Phaser.GameObjects.Image;
  speechBubble: Phaser.GameObjects.Container;
  lane: TrafficLaneIndex;
  direction: -1 | 1;
  speed: number;
  exitX: number;
  stoppedForPlayer: boolean;
  resumeDelayMs: number;
  stoppedForTraffic: boolean;
  trafficResumeDelayMs: number;
  randomJamEligible: boolean;
  randomJamDelayMs: number;
  randomJamRemainingMs: number;
  dialogueTimerMs: number;
  dialogueCooldownMs: number;
};

type EnvironmentWindPixel = {
  offset: number;
  x: number;
  phase: number;
  weight: number;
};

const isInsidePolygon = (x: number, y: number, polygon: readonly (readonly [number, number])[]): boolean => {
  let inside = false;
  for (let current = 0, previous = polygon.length - 1; current < polygon.length; previous = current, current += 1) {
    const [currentX, currentY] = polygon[current];
    const [previousX, previousY] = polygon[previous];
    const crosses = (currentY > y) !== (previousY > y)
      && x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY) + currentX;
    if (crosses) inside = !inside;
  }
  return inside;
};

const getHueAndSaturation = (red: number, green: number, blue: number): [number, number] => {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const saturation = max === 0 ? 0 : delta / max;
  if (delta === 0) return [0, saturation];
  let hue = max === red
    ? 60 * (((green - blue) / delta) % 6)
    : max === green
      ? 60 * ((blue - red) / delta + 2)
      : 60 * ((red - green) / delta + 4);
  if (hue < 0) hue += 360;
  return [hue, saturation];
};

type SkyCloud = {
  sprite: Phaser.GameObjects.Sprite;
  shadow: Phaser.GameObjects.Sprite;
  x: number;
  y: number;
  speed: number;
  phase: number;
  width: number;
  height: number;
};

type PigeonState = "walking" | "eating" | "flying";

type Pigeon = {
  sprite: Phaser.GameObjects.Sprite;
  shadow: Phaser.GameObjects.Ellipse;
  x: number;
  y: number;
  speed: number;
  direction: -1 | 1;
  positionRatio: number;
  state: PigeonState;
  stateTimerMs: number;
  peckCount: number;
  roamMinRatio: number;
  roamMaxRatio: number;
  width: number;
  height: number;
};

type RainDrop = {
  sprite: Phaser.GameObjects.Sprite;
  x: number;
  y: number;
  speed: number;
  drift: number;
};

type SteamEmitter = {
  x: number;
  y: number;
  size: number;
  intervalMs: number;
  cooldownMs: number;
  sourceScale: number;
};

type SteamPuff = {
  sprite: Phaser.GameObjects.Image;
  life: number;
  duration: number;
  originX: number;
  originY: number;
  rise: number;
  drift: number;
  phase: number;
  baseScaleX: number;
  baseScaleY: number;
};

type WeatherState = {
  cloudCover: number;
  rain: number;
  wind: number;
  label: string;
  icon: UiIconName;
};

type CrowdMotion = {
  targetX: number;
  speed: number;
  direction: -1 | 1;
  moving: boolean;
  needsWalkingState: boolean;
  idlePhase: number;
};

type DinerVenue = "coffee" | "pho" | "com-tam";
type StreetDinerPhase = "walking-in" | "sitting-down" | "eating" | "standing-up" | "walking-out";

type StreetDinerProfile = {
  id: string;
  name: string;
  venue: DinerVenue;
  walkTexture: string;
  seatedTexture: string;
  seatedAnimation: string;
};

type StreetDiner = {
  profile: StreetDinerProfile;
  seat: StreetDinerSeat;
  container: Phaser.GameObjects.Container;
  sprite: Phaser.GameObjects.Sprite;
  phase: StreetDinerPhase;
  xRatio: number;
  targetRatio: number;
  seatYRatio: number;
  direction: -1 | 1;
  timerMs: number;
  idleDurationMs: number;
};

type GroceryShopperPhase = "walking-in" | "shopping" | "walking-out";

type GroceryShopperProfile = {
  id: string;
  walkTexture: string;
  browseTexture: string;
  browseAnimation: string;
  dialogues: readonly string[];
};

type GroceryShopper = {
  profile: GroceryShopperProfile;
  container: Phaser.GameObjects.Container;
  sprite: Phaser.GameObjects.Sprite;
  bubble: Phaser.GameObjects.Container;
  phase: GroceryShopperPhase;
  xRatio: number;
  targetRatio: number;
  direction: -1 | 1;
  timerMs: number;
  exitDistance: number;
};

const STREET_DINER_PROFILES: readonly StreetDinerProfile[] = [
  { id: "office-man", name: "Anh văn phòng", venue: "pho", walkTexture: "walk-office", seatedTexture: "diner-office-man-pho", seatedAnimation: "diner-office-man-pho-eat" },
  { id: "office-woman", name: "Cô văn phòng", venue: "coffee", walkTexture: "walk-office-woman", seatedTexture: "diner-office-woman-coffee", seatedAnimation: "diner-office-woman-coffee-drink" },
  { id: "construction-worker", name: "Chú công nhân", venue: "com-tam", walkTexture: "walk-construction-worker", seatedTexture: "diner-construction-worker-com-tam", seatedAnimation: "diner-construction-worker-com-tam-eat" },
  { id: "backpacker", name: "Du khách", venue: "coffee", walkTexture: "walk-tourist", seatedTexture: "diner-backpacker-coffee", seatedAnimation: "diner-backpacker-coffee-drink" },
  { id: "older-regular", name: "Khách quen", venue: "com-tam", walkTexture: "walk-older-regular", seatedTexture: "diner-older-regular-com-tam", seatedAnimation: "diner-older-regular-com-tam-eat" },
];

const GROCERY_SHOPPER_PROFILES: readonly GroceryShopperProfile[] = [
  {
    id: "taphoa-student-boy",
    walkTexture: "walk-taphoa-student-boy",
    browseTexture: "browse-taphoa-student-boy",
    browseAnimation: "browse-taphoa-student-boy-purchase",
    dialogues: ["Cô ơi, cho cháu chai Sting!", "Cho cháu một chai Sting ạ!"],
  },
  {
    id: "taphoa-college-girl",
    walkTexture: "walk-taphoa-college-girl",
    browseTexture: "browse-taphoa-college-girl",
    browseAnimation: "browse-taphoa-college-girl-purchase",
    dialogues: ["Cho cháu 2 bịch bim bim!", "Cô ơi, cho cháu hai gói snack nha!"],
  },
];

type StreetDinerSeat = { id: string; xRatio: number; yRatio: number };

const DINER_SEATS: Record<DinerVenue, readonly StreetDinerSeat[]> = {
  // Ratios are measured from the center of each actual red stool in the
  // four-shop background map (2172 × 1280). Keeping one slot per stool prevents diners
  // from stacking or appearing beside the furniture.
  coffee: [0.0295, 0.0525, 0.1041, 0.1298].map((xRatio, index) => ({ id: `coffee-${index}`, xRatio, yRatio: 0.67 })),
  pho: [0.2983, 0.3131].map((xRatio, index) => ({ id: `pho-${index}`, xRatio, yRatio: 0.67 })),
  "com-tam": [0.7827, 0.8121, 0.8398].map((xRatio, index) => ({ id: `com-tam-${index}`, xRatio, yRatio: 0.67 })),
};
const TOTAL_STREET_DINER_SEATS = Object.values(DINER_SEATS).reduce((total, seats) => total + seats.length, 0);
const MAX_ACTIVE_STREET_DINERS = Math.min(STREET_DINER_PROFILES.length, TOTAL_STREET_DINER_SEATS);
const DINER_APPROACH_DISTANCE = 132;
const DINER_DISPLAY_WIDTH = 52;
const DINER_DISPLAY_HEIGHT = 82;
const GROCERY_SHOP_TARGET_X_RATIO = 0.928;
const GROCERY_SHOP_TARGET_Y_RATIO = 0.67;
const GROCERY_APPROACH_DISTANCE = 118;
const GROCERY_DISPLAY_WIDTH = 54;
const GROCERY_DISPLAY_HEIGHT = 86;
const GROCERY_SPAWN_MIN_MS = 8_500;
const GROCERY_SPAWN_MAX_MS = 12_500;

export class NeighborhoodScene extends Phaser.Scene {
  private readonly store: GameStore;
  private homeStreet!: Phaser.GameObjects.Image;
  private homeStreetTransition!: Phaser.GameObjects.Image;
  private homeStreetOvercast!: Phaser.GameObjects.Image;
  private homeArtwork?: Phaser.GameObjects.Image;
  private homeArtworkTint = -1;
  private marketExterior!: Phaser.GameObjects.Image;
  private marketExteriorTransition!: Phaser.GameObjects.Image;
  private marketExteriorOvercast!: Phaser.GameObjects.Image;
  private streetBackdrop!: Phaser.GameObjects.Image;
  private street!: Phaser.GameObjects.Image;
  private streetTransition!: Phaser.GameObjects.Image;
  private streetOvercast!: Phaser.GameObjects.Image;
  private shopOverlay!: Phaser.GameObjects.Container;
  private shopPlaceholder!: Phaser.GameObjects.Rectangle;
  private shopPlaceholderFrame!: Phaser.GameObjects.Graphics;
  private shopStageTitle!: Phaser.GameObjects.Text;
  private shopStageAsset!: Phaser.GameObjects.Text;
  private shopNameSignText!: Phaser.GameObjects.Text;
  private shopArtwork?: Phaser.GameObjects.Image;
  private shopArtworkTransition?: Phaser.GameObjects.Image;
  private shopArtworkOvercast?: Phaser.GameObjects.Image;
  private displayedShopStage = 0;
  private homeStage = 0;
  private displayedHomeStage = 0;
  private shopLightingState: { from: TimeOfDayMap; to: TimeOfDayMap; blend: number; overcast: number } = {
    from: "day", to: "day", blend: 0, overcast: 0,
  };
  private shopStage = 0;
  private debugShopStage: number | null = null;
  private shopDebugEnabled = false;
  private ownerGender: OwnerGender = "male";
  private ownerCharacter?: Phaser.GameObjects.Sprite;
  private ownerShadow?: Phaser.GameObjects.Image;
  private ownerWorldX = 0;
  private ownerWorldY = 0;
  private ownerMoving = false;
  private ownerFacingDirection: -1 | 1 = 1;
  private ownerFacing8Direction: OwnerDirection = "s";
  private ownerIdleVariant: OwnerIdleVariant = "base";
  private ownerIdleAnimationTimer?: Phaser.Time.TimerEvent;
  private movementVector = { x: 0, y: 0 };
  private keyboardMovementVector = { x: 0, y: 0 };
  private activeZone: "home" | "shop" | "market" = "shop";
  private zoneTransitioning = false;
  private zoneTransitionCover?: Phaser.GameObjects.Rectangle;
  private mapTransitionSigns: MapTransitionSign[] = [];
  private shopEntranceNearby = false;
  private pendingShopStageImages = new Set<number>();
  private pendingHomeStageImages = new Set<number>();
  private shopOverlayScale = 1;
  private shopArtworkTransform: ShopArtworkTransform = { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 };
  private shopArtworkAlphaBoundsCache = new Map<string, ShopArtworkAlphaBounds>();
  private shopArtworkWarmthCache = new Map<string, Float32Array>();
  private devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
  private nightOverlay!: Phaser.GameObjects.Rectangle;
  private duskOverlay!: Phaser.GameObjects.Rectangle;
  private weatherOverlay!: Phaser.GameObjects.Rectangle;
  private crowd = new Map<number, Phaser.GameObjects.Container>();
  private crowdMotion = new Map<number, CrowdMotion>();
  private customerAppearances = new Map<number, CustomerAppearance>();
  private streetDiners: StreetDiner[] = [];
  private nextDinerProfileIndex = 0;
  private dinerSpawnCooldownMs = 1_300;
  private groceryShoppers: GroceryShopper[] = [];
  private nextGroceryShopperProfileIndex = 0;
  private grocerySpawnCooldownMs = 3_000;
  private pendingDepartures = new Map<number, { type: CustomerType; direction: -1 | 1 }>();
  private walkers: Walker[] = [];
  private outdoorDiningGuests = new Map<string, OutdoorDiningGuestActor>();
  private diningGuestAtlasRequests = new Set<string>();
  private walkerSpawnQueue: number[] = [];
  private ambientWalkerSpawnCooldownMs = 0;
  private trafficBikes: TrafficBike[] = [];
  private trafficBikeProfileBag: (typeof TRAFFIC_BIKE_PROFILES)[number][] = [];
  private trafficDriverDialogueBag: string[] = [];
  private trafficJamArgumentBag: string[] = [];
  private trafficJamReplyBag: string[] = [];
  private trafficJamStartBag: string[] = [];
  private trafficSpawnCooldownMs = 1_800;
  private streetSpeaker?: Walker;
  private streetSpeechTimerMs = 0;
  private streetSpeechCooldownMs = 4_000;
  private readonly streetDialogueBags = new Map<string, string[]>();
  private readonly lastStreetDialogueByContext = new Map<string, string>();
  private lastStreetDialogue = "";
  private clouds: SkyCloud[] = [];
  private pigeons: Pigeon[] = [];
  private rainDrops: RainDrop[] = [];
  private puddles: { sprite: Phaser.GameObjects.Sprite; x: number; y: number; phase: number }[] = [];
  private sun!: Phaser.GameObjects.Sprite;
  private moon!: Phaser.GameObjects.Sprite;
  private environmentWindTexture?: Phaser.Textures.CanvasTexture;
  private environmentWindImage?: ImageData;
  private environmentWindPixels: EnvironmentWindPixel[] = [];
  private environmentWindFilters: Phaser.Filters.Displacement[] = [];
  private environmentWindUploadElapsedMs = 0;
  private canopyLayers: Phaser.GameObjects.Image[] = [];
  private canopySunlightLayers: Phaser.GameObjects.Image[] = [];
  private stars: Phaser.GameObjects.Sprite[] = [];
  private warmGlows: Phaser.GameObjects.Sprite[] = [];
  private sunlightRays!: Phaser.GameObjects.Graphics;
  private rainTrails!: Phaser.GameObjects.Graphics;
  private steamPuffs: SteamPuff[] = [];
  private steamEmitters: SteamEmitter[] = [];
  private steamEmitterSignature = "";
  private colorGrade?: Phaser.Filters.ColorMatrix;
  private vignette?: Phaser.Filters.Vignette;
  private cartX = 0;
  private groundY = 0;
  private cartWidth = 0;
  private cartHeight = 0;
  private unit = 1;
  private characterUnit = 1;
  private layoutWidth = 0;
  private layoutHeight = 0;
  private mapWidth = 0;
  private homeMapWidth = 0;
  private marketMapWidth = 0;
  private cameraViewportWidth = 0;
  private mapTop = 0;
  private mapHeight = 0;
  private dragStart?: { x: number; scrollX: number; pointerId: number };
  private dragMoved = false;
  private dragSurface?: HTMLCanvasElement;
  private mapInteractionEnabled = true;
  private gradeSignature = "";
  private environmentElapsedMs = 0;
  private lastEnvironmentUiAt = 0;
  private streetCrowdState: StreetCrowdState = {
    level: "steady",
    customerArrivalMultiplier: 1,
  };
  private streetCrowdSignature = "";
  private debugTimeOfDay: "dawn" | "day" | "sunset" | "night" | null = null;
  private debugWeather: "clear" | "cloudy" | "rain" | null = null;
  private lastSnapshot!: GameSnapshot;

  // Leave taps available to Phaser; take over the pointer only once a drag starts.
  private readonly onMapPointerDown = (event: PointerEvent): void => {
    if (!this.mapInteractionEnabled) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("button, a, input, select, textarea, summary, [role='button']")) return;
    this.dragStart = {
      x: event.clientX,
      scrollX: this.cameras.main.scrollX,
      pointerId: event.pointerId,
    };
    this.dragMoved = false;
  };

  private readonly onMapPointerMove = (event: PointerEvent): void => {
    const dragStart = this.dragStart;
    if (!dragStart || event.pointerId !== dragStart.pointerId) return;

    const deltaX = event.clientX - dragStart.x;
    if (!this.dragMoved && Math.abs(deltaX) < 5) return;
    if (!this.dragMoved) {
      try {
        this.dragSurface?.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture can fail if the pointer was canceled during a resize.
      }
    }
    this.dragMoved = true;
    event.preventDefault();
    const camera = this.cameras.main;
    camera.setScroll(camera.clampX(dragStart.scrollX - deltaX), camera.scrollY);
  };

  private readonly onMapPointerUp = (event: PointerEvent): void => {
    if (this.dragStart?.pointerId === event.pointerId) this.dragStart = undefined;
  };

  private readonly onStreetKeyDown = (event: KeyboardEvent): void => {
    if (!this.mapInteractionEnabled || event.repeat) return;
    if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") {
      this.keyboardMovementVector.x = -1;
      event.preventDefault();
    } else if (key === "arrowright" || key === "d") {
      this.keyboardMovementVector.x = 1;
      event.preventDefault();
    } else if (key === "arrowup" || key === "w") {
      this.keyboardMovementVector.y = -1;
      event.preventDefault();
    } else if (key === "arrowdown" || key === "s") {
      this.keyboardMovementVector.y = 1;
      event.preventDefault();
    }
  };

  private readonly onStreetKeyUp = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    if ((key === "arrowleft" || key === "a") && this.keyboardMovementVector.x === -1) this.keyboardMovementVector.x = 0;
    if ((key === "arrowright" || key === "d") && this.keyboardMovementVector.x === 1) this.keyboardMovementVector.x = 0;
    if ((key === "arrowup" || key === "w") && this.keyboardMovementVector.y === -1) this.keyboardMovementVector.y = 0;
    if ((key === "arrowdown" || key === "s") && this.keyboardMovementVector.y === 1) this.keyboardMovementVector.y = 0;
  };

  constructor(store: GameStore) {
    super("neighborhood");
    this.store = store;
  }

  setDevicePixelRatio(value: number): void {
    this.devicePixelRatio = Math.max(1, value || 1);
    if (this.sys.isActive()) this.cameras.main.setZoom(this.devicePixelRatio);
  }

  getWholesaleMarketBackgroundMood(): WholesaleMarketBackgroundMood {
    if (this.getWeatherState(this.environmentElapsedMs / 1_000).rain > 0.22) return "rain";
    const phase = this.getCurrentDayPhase();
    if (phase < 0.25 || phase >= 0.79) return "night";
    if (phase < 0.46) return "morning";
    if (phase < 0.64) return "noon";
    return "afternoon";
  }

  getWholesaleMarketLightingState(): WholesaleMarketLightingState {
    const marketMoodByTime: Record<TimeOfDayMap, WholesaleMarketLightingState["from"]> = {
      dawn: "morning",
      day: "noon",
      sunset: "afternoon",
      night: "night",
    };
    const { fromMood, toMood, transition } = this.getTimeOfDayBlend(this.getCurrentDayPhase());
    const phase = this.getCurrentDayPhase();
    const sunHeight = Math.cos((phase - 0.5) * Math.PI * 2);
    const daylight = this.smoothStep(-0.12, 0.18, sunHeight);
    const rain = this.getWeatherState(this.environmentElapsedMs / 1_000).rain;
    return {
      from: marketMoodByTime[fromMood],
      to: marketMoodByTime[toMood],
      blend: transition,
      rain: this.smoothStep(0.08, 0.72, rain) * daylight * 0.95,
    };
  }

  getStreetCrowdState(): StreetCrowdState {
    return { ...this.streetCrowdState };
  }

  setMapInteractionEnabled(enabled: boolean): void {
    this.mapInteractionEnabled = enabled;
    if (!enabled) {
      this.movementVector = { x: 0, y: 0 };
      this.keyboardMovementVector = { x: 0, y: 0 };
    }
    this.updateShopEntranceAvailability();
    if (!this.dragSurface) return;
    if (enabled) {
      this.dragSurface.addEventListener("pointerdown", this.onMapPointerDown);
      this.dragSurface.addEventListener("pointermove", this.onMapPointerMove);
      this.dragSurface.addEventListener("pointerup", this.onMapPointerUp);
      this.dragSurface.addEventListener("pointercancel", this.onMapPointerUp);
      this.dragSurface.addEventListener("lostpointercapture", this.onMapPointerUp);
    } else {
      this.dragSurface.removeEventListener("pointerdown", this.onMapPointerDown);
      this.dragSurface.removeEventListener("pointermove", this.onMapPointerMove);
      this.dragSurface.removeEventListener("pointerup", this.onMapPointerUp);
      this.dragSurface.removeEventListener("pointercancel", this.onMapPointerUp);
      this.dragSurface.removeEventListener("lostpointercapture", this.onMapPointerUp);
      this.dragStart = undefined;
    }
  }

  setMovementVector(x: number, y: number): void {
    if (!this.mapInteractionEnabled || !Number.isFinite(x) || !Number.isFinite(y)) {
      this.movementVector = { x: 0, y: 0 };
      return;
    }
    const magnitude = Math.hypot(x, y);
    const scale = magnitude > 1 ? 1 / magnitude : 1;
    this.movementVector = { x: x * scale, y: y * scale };
  }

  isHomeZoneActive(): boolean {
    return this.activeZone === "home";
  }

  getPlayerOwnerGender(): "male" | "female" {
    return this.ownerGender;
  }

  isWholesaleMarketZoneActive(): boolean {
    return this.activeZone === "market";
  }

  private getLogicalWidth(): number {
    return this.scale.width / this.devicePixelRatio;
  }

  private getLogicalHeight(): number {
    return this.scale.height / this.devicePixelRatio;
  }

  preload(): void {
    this.load.on("progress", (progress: number) => {
      window.dispatchEvent(new CustomEvent("game-loading-progress", { detail: progress }));
    });
    // Keep the pending queue moving even when the scene update loop is throttled
    // by an embedded browser while the initial batch of large images is loading.
    const advanceLoadQueue = (): void => this.load.update();
    this.load.on("filecomplete", advanceLoadQueue);
    this.load.on("loaderror", (file: Phaser.Loader.File) => {
      console.error("[game asset load error]", file.key, file.src);
      advanceLoadQueue();
    });
    for (const asset of HOME_STREET_MAP_ASSETS) {
      this.load.image(HOME_STREET_MAP_TEXTURES[asset.mood], asset.url);
    }
    this.load.image(HOME_STREET_RAIN_TEXTURE, homeStreetRainMapUrl);
    for (const asset of WHOLESALE_MARKET_EXTERIOR_ASSETS) {
      this.load.image(asset.textureKey, asset.url);
    }
    this.preloadHomeStageImages(Phaser.Math.Clamp(this.getInitialShopStage(), 1, HOME_STAGES.length), true);
    for (const asset of STREET_MAP_ASSETS) {
      this.load.image(STREET_MAP_TEXTURES[asset.mood], asset.url);
    }
    for (const profile of TRAFFIC_BIKE_PROFILES) {
      this.load.image(profile.key, profile.url);
    }
    this.load.spritesheet("player-owner-male-idle-base", ownerMaleIdleBase8DirUrl, {
      frameWidth: OWNER_FRAME_WIDTH,
      frameHeight: OWNER_FRAME_HEIGHT,
    });
    this.load.spritesheet("player-owner-male-idle-glance", ownerMaleIdleGlance8DirUrl, {
      frameWidth: OWNER_FRAME_WIDTH,
      frameHeight: OWNER_FRAME_HEIGHT,
    });
    this.load.spritesheet("player-owner-male-idle-apron", ownerMaleIdleApron8DirUrl, {
      frameWidth: OWNER_FRAME_WIDTH,
      frameHeight: OWNER_FRAME_HEIGHT,
    });
    this.load.spritesheet("player-owner-male-walk-8dir", ownerMaleWalk8DirUrl, {
      frameWidth: OWNER_FRAME_WIDTH,
      frameHeight: OWNER_FRAME_HEIGHT,
    });
    this.load.spritesheet("player-owner-female-idle", ownerFemaleIdleUrl, {
      frameWidth: OWNER_FRAME_WIDTH,
      frameHeight: OWNER_FRAME_HEIGHT,
    });
    this.load.spritesheet("player-owner-female-walk", ownerFemaleWalkUrl, {
      frameWidth: OWNER_FRAME_WIDTH,
      frameHeight: OWNER_FRAME_HEIGHT,
    });
    this.load.image("player-owner-ground-shadow", ownerGroundShadowUrl);
    this.preloadShopStageImages(this.getInitialShopStage(), true);
    this.load.spritesheet("diner-office-man-pho", officeManPhoSeatUrl, { frameWidth: CUSTOMER_FRAME_WIDTH, frameHeight: CUSTOMER_FRAME_HEIGHT });
    this.load.spritesheet("diner-office-woman-coffee", officeWomanCoffeeSeatUrl, { frameWidth: CUSTOMER_FRAME_WIDTH, frameHeight: CUSTOMER_FRAME_HEIGHT });
    this.load.spritesheet("diner-construction-worker-com-tam", constructionWorkerComTamSeatUrl, { frameWidth: CUSTOMER_FRAME_WIDTH, frameHeight: CUSTOMER_FRAME_HEIGHT });
    this.load.image("diner-backpacker-coffee", backpackerCoffeeSeatUrl);
    this.load.image("diner-older-regular-com-tam", olderRegularComTamSeatUrl);
    this.load.spritesheet("walk-taphoa-student-boy", taphoaStudentBoyWalkUrl, {
      frameWidth: CUSTOMER_FRAME_WIDTH,
      frameHeight: CUSTOMER_FRAME_HEIGHT,
    });
    this.load.spritesheet("walk-taphoa-college-girl", taphoaCollegeGirlWalkUrl, {
      frameWidth: CUSTOMER_FRAME_WIDTH,
      frameHeight: CUSTOMER_FRAME_HEIGHT,
    });
    this.load.image("browse-taphoa-student-boy", taphoaStudentBoyBrowseUrl);
    this.load.image("browse-taphoa-college-girl", taphoaCollegeGirlBrowseUrl);
    this.load.image("day-night-effects", dayNightEffectsUrl);
    this.load.image("weather-effects", weatherEffectsUrl);
    this.load.image(TREE_CANOPY_LAYER_TEXTURE, treeCanopyLayerUrl);
    this.load.spritesheet("pigeon-walking", pigeonWalkUrl, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet("pigeon-eating", pigeonEatUrl, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet("pigeon-flying", pigeonFlyUrl, { frameWidth: 32, frameHeight: 32 });
    for (const appearance of ALL_CUSTOMER_APPEARANCES) {
      this.load.spritesheet(appearance.key, appearance.frontUrl, {
        frameWidth: CUSTOMER_FRAME_WIDTH,
        frameHeight: CUSTOMER_FRAME_HEIGHT,
      });
    }
    for (const { key, url } of AMBIENT_WALKER_ASSETS.slice(0, CORE_WALKER_COUNT)) {
      const petGrid = key in PET_SPRITE_GRIDS ? PET_SPRITE_GRIDS[key as keyof typeof PET_SPRITE_GRIDS] : undefined;
      this.load.spritesheet(key, url, {
        frameWidth: petGrid?.frameWidth ?? CUSTOMER_FRAME_WIDTH,
        frameHeight: petGrid?.frameHeight ?? CUSTOMER_FRAME_HEIGHT,
      });
    }
  }

  create(): void {
    this.devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
    this.cameras.main.setZoom(this.devicePixelRatio);
    if (import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search);
      const time = params.get("time");
      const weather = params.get("weather");
      if (time === "dawn" || time === "day" || time === "sunset" || time === "night") this.debugTimeOfDay = time;
      if (weather === "clear" || weather === "cloudy" || weather === "rain") this.debugWeather = weather;
      const requestedOwner = params.get("owner");
      if (requestedOwner === "male" || requestedOwner === "female") this.ownerGender = requestedOwner;
      this.shopDebugEnabled = params.get("debug") === "1";
      const requestedStage = this.parseDevStage(params.get("stage"));
      // Keep a stage chosen from the debug controls while Phaser is still booting.
      if (requestedStage !== null && this.debugShopStage === null) this.debugShopStage = requestedStage;
    }
    this.registerEnvironmentFrames();
    this.createCharacterShadowTexture();
    this.createCookingSteamTexture();
    this.homeStreet = this.add.image(0, 0, HOME_STREET_MAP_TEXTURES.day)
      .setOrigin(0.5).setDepth(-1.4);
    this.homeStreetTransition = this.add.image(0, 0, HOME_STREET_MAP_TEXTURES.day)
      .setOrigin(0.5).setDepth(-1.39).setAlpha(0).setVisible(false);
    this.homeStreetOvercast = this.add.image(0, 0, HOME_STREET_RAIN_TEXTURE)
      .setOrigin(0.5).setDepth(-1.38).setAlpha(0).setVisible(false);
    this.updateHomeStreetMap(this.getCurrentDayPhase(), 1, 0);
    this.homeStage = Phaser.Math.Clamp(this.getInitialShopStage(), 1, HOME_STAGES.length);
    this.displayedHomeStage = this.homeStage;
    this.homeArtwork = this.add.image(0, 0, getHomeStageImageKey(this.homeStage))
      .setOrigin(0)
      .setDepth(-1.25);
    this.streetBackdrop = this.add.image(0, 0, STREET_MAP_TEXTURES.day)
      .setOrigin(0.5).setDepth(-2).setAlpha(0.7).setTint(0x9d8c72);
    this.streetBackdrop.enableFilters();
    this.streetBackdrop.filters?.internal.addBlur(0, 3, 3, 1.8);
    this.street = this.add.image(0, 0, STREET_MAP_TEXTURES.day).setOrigin(0.5).setDepth(-1.3);
    this.streetTransition = this.add.image(0, 0, STREET_MAP_TEXTURES.day)
      .setOrigin(0.5).setDepth(-1.2).setAlpha(0).setVisible(false);
    this.streetOvercast = this.add.image(0, 0, STREET_MAP_TEXTURES.rain)
      .setOrigin(0.5).setDepth(-1.1).setAlpha(0).setVisible(false);
    const initialMarketTexture = WHOLESALE_MARKET_EXTERIOR_TEXTURE_KEYS[this.getWholesaleMarketBackgroundMood()];
    this.marketExterior = this.add.image(0, 0, initialMarketTexture)
      .setOrigin(0, 0)
      .setDepth(-1.3);
    this.marketExteriorTransition = this.add.image(0, 0, initialMarketTexture)
      .setOrigin(0, 0).setDepth(-1.2).setAlpha(0).setVisible(false);
    this.marketExteriorOvercast = this.add.image(0, 0, WHOLESALE_MARKET_EXTERIOR_TEXTURE_KEYS.rain)
      .setOrigin(0, 0).setDepth(-1.1).setAlpha(0).setVisible(false);
    this.createEnvironmentWindEffect();
    this.createCanopyDepthLayers();
    this.createShopStageOverlay();
    this.nightOverlay = this.add.rectangle(0, 0, 1, 1, 0x111c3a, 0).setOrigin(0).setDepth(9);
    this.duskOverlay = this.add.rectangle(0, 0, 1, 1, 0xff9360, 0).setOrigin(0).setDepth(9);
    this.weatherOverlay = this.add.rectangle(0, 0, 1, 1, 0x6c8da6, 0).setOrigin(0).setDepth(9);
    this.zoneTransitionCover = this.add.rectangle(0, 0, 1, 1, 0x111817, 0)
      .setOrigin(0).setDepth(20).setScrollFactor(0).setVisible(false);
    this.streetBackdrop.setScrollFactor(0);
    this.nightOverlay.setScrollFactor(0);
    this.duskOverlay.setScrollFactor(0);
    this.weatherOverlay.setScrollFactor(0);

    const cameraFilters = this.cameras.main.filters;
    if (cameraFilters) {
      this.colorGrade = cameraFilters.external.addColorMatrix();
      this.vignette = cameraFilters.external.addVignette(0.5, 0.54, 0.98, 0.045, 0x332e3c);
    }

    this.registerWalkerAnimations(0, CORE_WALKER_COUNT);
    this.registerStreetDinerFrames();
    this.registerStreetDinerAnimations();
    this.registerGroceryShopperFrames();
    this.registerGroceryShopperAnimations();
    this.anims.create({
      key: "customer-student-idle-loop",
      frames: this.anims.generateFrameNumbers("customer-schoolgirl-idle", { start: 0, end: 3 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "player-owner-female-idle-loop",
      frames: this.anims.generateFrameNumbers("player-owner-female-idle", { frames: OWNER_IDLE_FRAME_SEQUENCE }),
      frameRate: 8,
      repeat: -1,
    });
    // Each runtime strip stores one 8-frame-wide row per direction; idle states use its first four cells.
    const ownerMaleAnimationSets = [
      { state: "idle-base", textureKey: "player-owner-male-idle-base", frameCount: 4, frameRate: 4 },
      { state: "idle-glance", textureKey: "player-owner-male-idle-glance", frameCount: 4, frameRate: 4 },
      { state: "idle-apron", textureKey: "player-owner-male-idle-apron", frameCount: 4, frameRate: 4 },
      { state: "walk", textureKey: "player-owner-male-walk-8dir", frameCount: 8, frameRate: OWNER_WALK_FRAME_RATE },
    ] as const;
    for (const animationSet of ownerMaleAnimationSets) {
      OWNER_DIRECTIONS.forEach((direction, directionIndex) => {
        const firstFrame = directionIndex * OWNER_ATLAS_COLUMNS;
        this.anims.create({
          key: `player-owner-male-${animationSet.state}-${direction}`,
          frames: this.anims.generateFrameNumbers(animationSet.textureKey, {
            frames: Array.from({ length: animationSet.frameCount }, (_, frame) => firstFrame + frame),
          }),
          frameRate: animationSet.frameRate,
          repeat: -1,
        });
      });
    }
    const textureKey = "player-owner-female-walk";
    this.anims.create({
      key: `${textureKey}-left`,
      frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: `${textureKey}-right`,
      frames: this.anims.generateFrameNumbers(textureKey, { start: 12, end: 23 }),
      frameRate: 10,
      repeat: -1,
    });

    this.createAmbientWalkers(0, CORE_WALKER_COUNT);
    this.createPlayerOwner();
    this.createMapTransitionSigns();
    this.loadBackgroundWalkerAssets();
    this.createLivingEnvironment();
    // Capture drags on the canvas itself so touch/mouse gestures keep working
    // after the pointer leaves the canvas edge.
    this.dragSurface = this.game.canvas;
    this.setMapInteractionEnabled(this.mapInteractionEnabled);
    window.addEventListener("keydown", this.onStreetKeyDown);
    window.addEventListener("keyup", this.onStreetKeyUp);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.dragSurface?.removeEventListener("pointerdown", this.onMapPointerDown);
      this.dragSurface?.removeEventListener("pointermove", this.onMapPointerMove);
      this.dragSurface?.removeEventListener("pointerup", this.onMapPointerUp);
      this.dragSurface?.removeEventListener("pointercancel", this.onMapPointerUp);
      this.dragSurface?.removeEventListener("lostpointercapture", this.onMapPointerUp);
      this.dragSurface = undefined;
      this.dragStart = undefined;
      window.removeEventListener("keydown", this.onStreetKeyDown);
      window.removeEventListener("keyup", this.onStreetKeyUp);
    });
    if (this.shopDebugEnabled) {
      this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
        if (event.key === "[" || event.key === "-") this.stepShopStage(-1);
        else if (event.key === "]" || event.key === "+" || event.key === "=") this.stepShopStage(1);
      });
    }
    this.scale.on("resize", this.layout, this);
    this.time.addEvent({ delay: 1_000, loop: true, callback: () => this.store.tick() });
    this.store.subscribe((snapshot) => {
      const previous = this.lastSnapshot;
      if (previous?.inShift) {
        const liveIds = new Set(snapshot.customers.map((customer) => customer.id));
        const servedIds = new Set<number>();
        if (snapshot.totalServed > previous.totalServed) {
          const served = previous.customers.find((customer) => !liveIds.has(customer.id));
          if (served) servedIds.add(served.id);
        }
        for (const customer of previous.customers) {
          if (!liveIds.has(customer.id)) {
            this.pendingDepartures.set(customer.id, {
              type: customer.type,
              direction: servedIds.has(customer.id) ? 1 : -1,
            });
          }
        }
      }
      this.lastSnapshot = snapshot;
      this.layout();
    });
    this.layout();
    this.centerOnShop();
    window.dispatchEvent(new Event("game-map-ready"));
  }

  private registerWalkerAnimations(startIndex: number, endIndex: number): void {
    for (const textureKey of WALKER_TEXTURES.slice(startIndex, endIndex)) {
      if (!this.textures.exists(textureKey)) continue;
      if (textureKey === "walk-street-cat") {
        this.anims.create({
          key: `${textureKey}-left`,
          frames: this.anims.generateFrameNumbers(textureKey, { start: 12, end: 15 }),
          frameRate: 5,
          repeat: -1,
        });
        this.anims.create({
          key: `${textureKey}-right`,
          frames: this.anims.generateFrameNumbers(textureKey, { start: 4, end: 7 }),
          frameRate: 5,
          repeat: -1,
        });
        this.anims.create({
          key: `${textureKey}-sit`,
          frames: this.anims.generateFrameNumbers(textureKey, { start: 16, end: 17 }),
          frameRate: 2,
          repeat: -1,
        });
        this.anims.create({
          key: `${textureKey}-groom`,
          frames: this.anims.generateFrameNumbers(textureKey, { start: 18, end: 23 }),
          frameRate: 3,
          repeat: -1,
        });
        this.anims.create({
          key: `${textureKey}-settle`,
          frames: this.anims.generateFrameNumbers(textureKey, { start: 24, end: 27 }),
          frameRate: 4,
          repeat: 0,
        });
        this.anims.create({
          key: `${textureKey}-sleep`,
          frames: this.anims.generateFrameNumbers(textureKey, { start: 28, end: 31 }),
          frameRate: 2,
          repeat: -1,
        });
        continue;
      }
      this.anims.create({
        key: `${textureKey}-left`,
        frames: this.anims.generateFrameNumbers(textureKey, {
          start: 0,
          end: 7,
        }),
        frameRate: WALK_FRAME_RATE,
        repeat: -1,
      });
      this.anims.create({
        key: `${textureKey}-right`,
        frames: this.anims.generateFrameNumbers(textureKey, { start: 8, end: 15 }),
        frameRate: WALK_FRAME_RATE,
        repeat: -1,
      });
    }
  }

  private registerStreetDinerFrames(): void {
    // The two additional character sheets were generated at roughly 2x the
    // requested size. Slice their four columns using measured source edges so
    // the one-pixel width rounding does not leak into neighboring frames.
    for (const textureKey of ["diner-backpacker-coffee", "diner-older-regular-com-tam"]) {
      const texture = this.textures.get(textureKey);
      const source = texture.getSourceImage() as HTMLImageElement;
      for (let frame = 0; frame < 4; frame += 1) {
        const left = Math.round(frame * source.width / 4);
        const right = Math.round((frame + 1) * source.width / 4);
        texture.add(frame, 0, left, 0, right - left, source.height);
      }
    }
  }

  private registerStreetDinerAnimations(): void {
    for (const profile of STREET_DINER_PROFILES) {
      this.anims.create({
        key: profile.seatedAnimation,
        frames: Array.from({ length: 4 }, (_, frame) => ({ key: profile.seatedTexture, frame })),
        frameRate: 2,
        repeat: -1,
      });
    }
  }

  private registerGroceryShopperFrames(): void {
    for (const profile of GROCERY_SHOPPER_PROFILES) {
      const texture = this.textures.get(profile.browseTexture);
      const source = texture.getSourceImage() as HTMLImageElement;
      for (let frame = 0; frame < 4; frame += 1) {
        const left = Math.round(frame * source.width / 4);
        const right = Math.round((frame + 1) * source.width / 4);
        texture.add(frame, 0, left, 0, right - left, source.height);
      }
    }
  }

  private registerGroceryShopperAnimations(): void {
    for (const profile of GROCERY_SHOPPER_PROFILES) {
      this.anims.create({
        key: `${profile.walkTexture}-left`,
        frames: this.anims.generateFrameNumbers(profile.walkTexture, { start: 0, end: 7 }),
        frameRate: WALK_FRAME_RATE,
        repeat: -1,
      });
      this.anims.create({
        key: `${profile.walkTexture}-right`,
        frames: this.anims.generateFrameNumbers(profile.walkTexture, { start: 8, end: 15 }),
        frameRate: WALK_FRAME_RATE,
        repeat: -1,
      });
      this.anims.create({
        key: profile.browseAnimation,
        frames: Array.from({ length: 4 }, (_, frame) => ({ key: profile.browseTexture, frame })),
        frameRate: 2,
        repeat: 0,
      });
    }
  }

  private setDinerWalkingPose(diner: StreetDiner): void {
    const sprite = diner.sprite;
    const animation = `${diner.profile.walkTexture}-${diner.direction > 0 ? "right" : "left"}`;
    sprite.anims.stop();
    sprite.setOrigin(0.5, getWalkerOriginY(diner.profile.walkTexture));
    sprite.setTexture(diner.profile.walkTexture, getWalkerStartFrame(diner.profile.walkTexture, diner.direction));
    setCharacterDisplaySize(
      sprite,
      DINER_DISPLAY_WIDTH * this.characterUnit,
      DINER_DISPLAY_HEIGHT * this.characterUnit,
      getWalkerFrameHeight(diner.profile.walkTexture),
      getWalkerArtHeight(diner.profile.walkTexture),
      CHARACTER_TARGET_VISIBLE_HEIGHT * this.characterUnit,
    );
    sprite.setPosition(0, 0).play(animation);
  }

  private setDinerSeatedPose(diner: StreetDiner): void {
    diner.sprite.anims.stop();
    // Each seated sheet has a slightly different transparent bottom margin.
    // Anchor its visible base at the same stool/sidewalk line.
    diner.sprite.setOrigin(0.5, getDinerOriginY(diner.profile.seatedTexture));
    diner.sprite.setTexture(diner.profile.seatedTexture, 0);
    setCharacterDisplaySize(
      diner.sprite,
      DINER_DISPLAY_WIDTH * this.characterUnit,
      DINER_DISPLAY_HEIGHT * this.characterUnit,
      getDinerFrameHeight(diner.profile.seatedTexture),
      DINER_ART_HEIGHTS[diner.profile.seatedTexture] ?? 342,
      CHARACTER_TARGET_VISIBLE_HEIGHT * this.characterUnit,
    );
    diner.sprite.setPosition(0, -4 * this.unit).play(diner.profile.seatedAnimation);
    this.tweens.add({
      targets: diner.sprite,
      y: 0,
      duration: 280,
      ease: "Quad.Out",
    });
  }

  private createGrocerySpeechBubble(dialogue: string): Phaser.GameObjects.Container {
    const label = this.add.text(0, 0, dialogue, {
      fontFamily: "Trebuchet MS, sans-serif",
      fontSize: "16px",
      fontStyle: "bold",
      color: "#493726",
      align: "center",
      lineSpacing: 0,
      padding: { x: 3, y: 2 },
    }).setOrigin(0.5);
    const graphics = this.add.graphics();
    // Keep the tail separate so edge-clamping cannot shift the text background.
    const tail = this.add.graphics();
    const bubble = this.add.container(0, -101 * this.unit, [graphics, tail, label])
      .setScale(this.unit)
      .setVisible(false)
      .setDepth(8);
    this.setStreetSpeechBubbleText(bubble, dialogue);
    return bubble;
  }

  private setStreetSpeechBubbleText(bubble: Phaser.GameObjects.Container, dialogue: string): void {
    const graphics = bubble.getAt(0) as Phaser.GameObjects.Graphics;
    const tail = bubble.getAt(1) as Phaser.GameObjects.Graphics;
    const label = bubble.getAt(2) as Phaser.GameObjects.Text;
    const camera = this.cameras.main;
    const edgePadding = Math.max(8, 8 * this.unit);
    const maxWidth = Math.max(72, Math.min(260, camera.displayWidth - edgePadding * 2));
    label.setWordWrapWidth(maxWidth - 22, true).setText(dialogue);
    const width = Math.min(maxWidth, Math.max(Math.min(96, maxWidth), label.width + 22));
    const height = label.height + 14;

    graphics.clear();
    graphics.fillStyle(0xfff9e9, 0.98);
    graphics.fillRoundedRect(-width / 2, -height, width, height, 9);
    graphics.lineStyle(1.5, 0x624a34, 0.95);
    graphics.strokeRoundedRect(-width / 2, -height, width, height, 9);
    tail.clear();
    tail.fillStyle(0xfff9e9, 0.98);
    tail.fillTriangle(-6, 0, 6, 0, 0, 8);
    tail.lineStyle(1.5, 0x624a34, 0.95);
    tail.lineBetween(-5, 1, 0, 8);
    tail.lineBetween(0, 8, 5, 1);
    label.setPosition(0, -height / 2);
    bubble.setData("bubbleWidth", width);
    bubble.setData("bubbleHeight", height);
  }

  private positionStreetSpeechBubble(bubble: Phaser.GameObjects.Container, speakerX: number, y: number): void {
    const tail = bubble.getAt(1) as Phaser.GameObjects.Graphics;
    tail.setPosition(0, 0);
    bubble.setPosition(speakerX, y);
  }

  private getStreetWalkerSpeechBubbleY(walker: Walker, laneY: number): number {
    const characterUnit = this.characterUnit * getZoneArtworkScale(walker.zone);
    const characterHeight = CHARACTER_TARGET_VISIBLE_HEIGHT * characterUnit;
    return laneY - characterHeight - 18 * this.unit;
  }

  private takeStreetDialogue(walker: Walker): string {
    const contextKey = `${walker.zone}:${walker.textureKey}`;
    let bag = this.streetDialogueBags.get(contextKey);
    if (!bag || bag.length === 0) {
      bag = Phaser.Utils.Array.Shuffle([...streetWalkerDialogues(walker.textureKey, walker.zone)]);
      const previousForCharacter = this.lastStreetDialogueByContext.get(contextKey);
      if (bag.at(-1) === previousForCharacter && bag.length > 1) {
        [bag[bag.length - 1], bag[bag.length - 2]] = [bag[bag.length - 2]!, bag[bag.length - 1]!];
      }
      if (bag.at(-1) === this.lastStreetDialogue && bag.length > 1) {
        [bag[bag.length - 1], bag[bag.length - 2]] = [bag[bag.length - 2]!, bag[bag.length - 1]!];
      }
      this.streetDialogueBags.set(contextKey, bag);
    }
    const dialogue = bag.pop() ?? "Đi bộ một chút rồi mình tính tiếp.";
    this.lastStreetDialogue = dialogue;
    this.lastStreetDialogueByContext.set(contextKey, dialogue);
    return dialogue;
  }

  private takeTrafficBikeProfile(): (typeof TRAFFIC_BIKE_PROFILES)[number] {
    if (this.trafficBikeProfileBag.length === 0) {
      this.trafficBikeProfileBag = Phaser.Utils.Array.Shuffle([...TRAFFIC_BIKE_PROFILES]);
    }
    return this.trafficBikeProfileBag.pop() ?? TRAFFIC_BIKE_PROFILES[0];
  }

  private getTrafficLaneY(lane: TrafficLaneIndex): number {
    const lanes = this.activeZone === "market" ? MARKET_TRAFFIC_BIKE_LANES : TRAFFIC_BIKE_LANES;
    return this.mapTop + this.mapHeight * lanes[lane].yRatio;
  }

  private getTrafficLaneDirection(lane: TrafficLaneIndex): -1 | 1 {
    const lanes = this.activeZone === "market" ? MARKET_TRAFFIC_BIKE_LANES : TRAFFIC_BIKE_LANES;
    return lanes[lane].direction;
  }

  private takeTrafficDriverDialogue(): string {
    if (this.trafficDriverDialogueBag.length === 0) {
      this.trafficDriverDialogueBag = Phaser.Utils.Array.Shuffle([...TRAFFIC_DRIVER_DIALOGUES]);
    }
    return this.trafficDriverDialogueBag.pop() ?? "Bạn đứng giữa lối xe chạy kìa, né vào trong giúp mình.";
  }

  private takeTrafficJamArgument(): string {
    if (this.trafficJamArgumentBag.length === 0) {
      this.trafficJamArgumentBag = Phaser.Utils.Array.Shuffle([...TRAFFIC_JAM_ARGUMENTS]);
    }
    return this.trafficJamArgumentBag.pop() ?? "Xe phía trước đi được chưa? Đèn xanh rồi kìa.";
  }

  private takeTrafficJamReply(): string {
    if (this.trafficJamReplyBag.length === 0) {
      this.trafficJamReplyBag = Phaser.Utils.Array.Shuffle([...TRAFFIC_JAM_REPLIES]);
    }
    return this.trafficJamReplyBag.pop() ?? "Tôi cũng đang chờ xe phía trước đây.";
  }

  private takeTrafficJamStartLine(): string {
    if (this.trafficJamStartBag.length === 0) {
      this.trafficJamStartBag = Phaser.Utils.Array.Shuffle([...TRAFFIC_JAM_START_LINES]);
    }
    return this.trafficJamStartBag.pop() ?? "Sao xe dừng lại hết rồi nhỉ?";
  }

  private getNearestTrafficBike(
    bike: TrafficBike,
    side: "ahead" | "behind",
  ): { bike: TrafficBike; distance: number } | undefined {
    let nearest: TrafficBike | undefined;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (const other of this.trafficBikes) {
      if (other === bike || other.lane !== bike.lane) continue;
      const distance = side === "ahead"
        ? (other.sprite.x - bike.sprite.x) * bike.direction
        : (bike.sprite.x - other.sprite.x) * bike.direction;
      if (distance > 0 && distance < nearestDistance) {
        nearest = other;
        nearestDistance = distance;
      }
    }
    return nearest ? { bike: nearest, distance: nearestDistance } : undefined;
  }

  private isTrafficBikeBlockedByPlayer(bike: TrafficBike): boolean {
    if ((this.activeZone !== "shop" && this.activeZone !== "market")
      || this.zoneTransitioning || !this.mapInteractionEnabled || !this.ownerCharacter) {
      return false;
    }

    const laneY = this.getTrafficLaneY(bike.lane);
    const verticalTolerance = Math.max(40 * this.unit, this.mapHeight * 0.04);
    const distanceAhead = (this.ownerWorldX - bike.sprite.x) * bike.direction;
    return Math.abs(this.ownerWorldY - laneY) <= verticalTolerance
      && distanceAhead >= -70 * this.unit
      && distanceAhead <= 164 * this.unit;
  }

  private showTrafficBikeComplaint(bike: TrafficBike, dialogue = this.takeTrafficDriverDialogue()): void {
    const laneY = this.getTrafficLaneY(bike.lane);
    this.setStreetSpeechBubbleText(bike.speechBubble, dialogue);
    bike.speechBubble
      .setDepth(getStreetCharacterDepth(laneY) + 0.0001)
      .setScale(this.unit)
      .setAlpha(1)
      .setVisible(true);
    this.positionTrafficBikeSpeechBubble(bike, bike.sprite.x, laneY);
    bike.dialogueTimerMs = 2_700;
  }

  private positionTrafficBikeSpeechBubble(bike: TrafficBike, x: number, laneY: number): void {
    const laneRank = this.trafficBikes.filter((candidate) => candidate.lane === bike.lane).indexOf(bike);
    const laneLift = 132 + (Math.max(0, laneRank) % 2) * 52;
    const zoneScale = getZoneArtworkScale(this.activeZone);
    this.positionStreetSpeechBubble(bike.speechBubble, x, laneY - laneLift * zoneScale * this.unit);
  }

  private destroyTrafficBike(bike: TrafficBike): void {
    bike.sprite.destroy();
    bike.shadow.destroy();
    bike.speechBubble.destroy();
  }

  private layoutTrafficBikes(): void {
    const camera = this.cameras.main;
    const viewportLeft = camera.scrollX + (camera.width - camera.displayWidth) / 2;
    const viewportRight = viewportLeft + this.getLogicalWidth();
    const exitMargin = 100 * this.unit;
    for (const bike of this.trafficBikes) {
      const laneY = this.getTrafficLaneY(bike.lane);
      bike.direction = this.getTrafficLaneDirection(bike.lane);
      const zoneScale = getZoneArtworkScale(this.activeZone);
      const scale = this.unit * bike.profile.scale * zoneScale;
      bike.speed = bike.profile.speed * this.unit;
      bike.exitX = bike.direction > 0 ? viewportRight + exitMargin : viewportLeft - exitMargin;
      bike.sprite.setPosition(bike.sprite.x, laneY)
        .setOrigin(0.5, 0.95)
        .setDisplaySize(TRAFFIC_BIKE_DISPLAY_WIDTH * scale, TRAFFIC_BIKE_DISPLAY_HEIGHT * scale)
        .setFlipX(bike.direction < 0)
        .setDepth(getStreetCharacterDepth(laneY));
      bike.shadow.setPosition(bike.sprite.x, laneY + 1.5 * this.unit)
        .setDisplaySize(TRAFFIC_BIKE_SHADOW_WIDTH * this.unit * zoneScale, 11 * this.unit * zoneScale)
        .setDepth(getStreetCharacterDepth(laneY) - 0.02);
      bike.speechBubble
        .setScale(this.unit)
        .setDepth(getStreetCharacterDepth(laneY) + 0.0001);
      this.positionTrafficBikeSpeechBubble(bike, bike.sprite.x, laneY);
    }
  }

  private trySpawnTrafficBike(): boolean {
    if (!this.mapWidth || this.trafficBikes.length >= MAX_ACTIVE_TRAFFIC_BIKES) return false;

    const camera = this.cameras.main;
    const viewportLeft = camera.scrollX + (camera.width - camera.displayWidth) / 2;
    const viewportRight = viewportLeft + this.getLogicalWidth();
    const zoneLeft = this.activeZone === "market" ? this.mapWidth : 0;
    const zoneRight = zoneLeft + (this.activeZone === "market" ? this.marketMapWidth : this.mapWidth);
    const entranceMargin = 86 * this.unit;
    const minimumSpawnGap = TRAFFIC_BIKE_SPAWN_GAP * this.unit;
    const laneCandidates = (this.activeZone === "market" ? MARKET_TRAFFIC_BIKE_LANES : TRAFFIC_BIKE_LANES)
      .map((_, index) => {
        const lane = index as TrafficLaneIndex;
        const direction = this.getTrafficLaneDirection(lane);
        const spawnX = direction > 0
          ? Math.max(zoneLeft - entranceMargin, viewportLeft - entranceMargin)
          : Math.min(zoneRight + entranceMargin, viewportRight + entranceMargin);
        const laneBikes = this.trafficBikes.filter((bike) => bike.lane === lane);
        const bikeIsTooCloseToSpawn = laneBikes.some((bike) => {
          const distanceFromSpawn = (bike.sprite.x - spawnX) * direction;
          return distanceFromSpawn >= 0 && distanceFromSpawn < minimumSpawnGap;
        });
        return { lane, direction, spawnX, count: laneBikes.length, bikeIsTooCloseToSpawn };
      })
      .filter((candidate) => candidate.count < MAX_TRAFFIC_BIKES_PER_LANE && !candidate.bikeIsTooCloseToSpawn);
    if (laneCandidates.length === 0) return false;

    const fewestBikesInLane = Math.min(...laneCandidates.map((candidate) => candidate.count));
    const availableLanes = laneCandidates.filter((candidate) => candidate.count === fewestBikesInLane);
    const { lane, direction, spawnX } = Phaser.Utils.Array.GetRandom(availableLanes);

    const exitX = direction > 0
      ? Math.min(zoneRight + entranceMargin, viewportRight + entranceMargin)
      : Math.max(zoneLeft - entranceMargin, viewportLeft - entranceMargin);
    const laneY = this.getTrafficLaneY(lane);
    const profile = this.takeTrafficBikeProfile();
    const zoneScale = getZoneArtworkScale(this.activeZone);
    const scale = this.unit * profile.scale * zoneScale;
    const shadow = this.add.image(spawnX, laneY + 1.5 * this.unit, "character-contact-shadow-soft")
      .setOrigin(0.5)
      .setDisplaySize(TRAFFIC_BIKE_SHADOW_WIDTH * this.unit * zoneScale, 11 * this.unit * zoneScale)
      .setAlpha(0.38)
      .setDepth(getStreetCharacterDepth(laneY) - 0.02);
    const sprite = this.add.image(spawnX, laneY, profile.key)
      .setOrigin(0.5, 0.95)
      .setDisplaySize(TRAFFIC_BIKE_DISPLAY_WIDTH * scale, TRAFFIC_BIKE_DISPLAY_HEIGHT * scale)
      .setFlipX(direction < 0)
      .setDepth(getStreetCharacterDepth(laneY));
    const speechBubble = this.createGrocerySpeechBubble("").setVisible(false);

    this.trafficBikes.push({
      profile,
      sprite,
      shadow,
      speechBubble,
      lane,
      direction,
      speed: profile.speed * this.unit,
      exitX,
      stoppedForPlayer: false,
      resumeDelayMs: 0,
      stoppedForTraffic: false,
      trafficResumeDelayMs: 0,
      randomJamEligible: Math.random() < (this.streetCrowdState.level === "busy" ? 0.24 : 0.15),
      randomJamDelayMs: Phaser.Math.Between(2_800, 6_500),
      randomJamRemainingMs: 0,
      dialogueTimerMs: 0,
      dialogueCooldownMs: 0,
    });
    return true;
  }

  private updateTrafficBikes(delta: number): void {
    if (this.activeZone !== "shop" && this.activeZone !== "market") {
      for (const bike of this.trafficBikes) {
        this.destroyTrafficBike(bike);
      }
      this.trafficBikes.length = 0;
      this.trafficSpawnCooldownMs = 1_800;
      return;
    }

    const elapsed = Math.min(Math.max(delta, 0), 100) / 1_000;
    const elapsedMs = elapsed * 1_000;
    for (let index = this.trafficBikes.length - 1; index >= 0; index -= 1) {
      const bike = this.trafficBikes[index];
      const laneDirection = this.getTrafficLaneDirection(bike.lane);
      // Re-derive all directional state from the lane. A sprite may outlive a
      // lane configuration change during a live preview, so matching direction
      // values alone are not enough to guarantee that its art is facing correctly.
      const camera = this.cameras.main;
      const viewportLeft = camera.scrollX + (camera.width - camera.displayWidth) / 2;
      const viewportRight = viewportLeft + this.getLogicalWidth();
      const exitMargin = 100 * this.unit;
      bike.direction = laneDirection;
      bike.exitX = laneDirection > 0 ? viewportRight + exitMargin : viewportLeft - exitMargin;
      bike.sprite.setFlipX(laneDirection < 0);
      const laneY = this.getTrafficLaneY(bike.lane);
      const blockedByPlayer = this.isTrafficBikeBlockedByPlayer(bike);
      const bikeAhead = this.getNearestTrafficBike(bike, "ahead");
      const followingGap = TRAFFIC_BIKE_FOLLOWING_GAP * this.unit;
      const blockedByTraffic = Boolean(bikeAhead && bikeAhead.distance <= followingGap);

      let startedRandomJam = false;
      if (bike.randomJamRemainingMs > 0) {
        bike.randomJamRemainingMs = Math.max(0, bike.randomJamRemainingMs - elapsedMs);
      } else if (bike.randomJamEligible && !blockedByPlayer && !blockedByTraffic) {
        bike.randomJamDelayMs = Math.max(0, bike.randomJamDelayMs - elapsedMs);
        if (bike.randomJamDelayMs === 0) {
          bike.randomJamEligible = false;
          bike.randomJamRemainingMs = Phaser.Math.Between(3_200, 4_200);
          startedRandomJam = true;
        }
      }
      const randomJamActive = bike.randomJamRemainingMs > 0;

      bike.dialogueCooldownMs = Math.max(0, bike.dialogueCooldownMs - elapsedMs);
      if (bike.dialogueTimerMs > 0) {
        bike.dialogueTimerMs = Math.max(0, bike.dialogueTimerMs - elapsedMs);
        if (bike.dialogueTimerMs === 0) bike.speechBubble.setVisible(false);
      }

      if (blockedByPlayer) {
        bike.stoppedForPlayer = true;
        bike.resumeDelayMs = 450;
      } else if (bike.stoppedForPlayer) {
        bike.resumeDelayMs = Math.max(0, bike.resumeDelayMs - elapsedMs);
        if (bike.resumeDelayMs === 0) bike.stoppedForPlayer = false;
      }

      if (blockedByTraffic) {
        bike.stoppedForTraffic = true;
        bike.trafficResumeDelayMs = 320;
      } else if (bike.stoppedForTraffic) {
        bike.trafficResumeDelayMs = Math.max(0, bike.trafficResumeDelayMs - elapsedMs);
        if (bike.trafficResumeDelayMs === 0) bike.stoppedForTraffic = false;
      }

      const bikeBehind = this.getNearestTrafficBike(bike, "behind");
      const hasCloseBikeBehind = Boolean(bikeBehind && bikeBehind.distance <= followingGap * 1.7);
      const isStoppedInJam = blockedByPlayer || blockedByTraffic || randomJamActive
        || bike.stoppedForPlayer || bike.stoppedForTraffic;
      if (bike.dialogueCooldownMs === 0) {
        if (blockedByTraffic) {
          this.showTrafficBikeComplaint(bike, this.takeTrafficJamArgument());
          bike.dialogueCooldownMs = Phaser.Math.Between(3_300, 5_200);
        } else if (startedRandomJam) {
          this.showTrafficBikeComplaint(bike, this.takeTrafficJamStartLine());
          bike.dialogueCooldownMs = Phaser.Math.Between(1_700, 2_400);
        } else if (isStoppedInJam && hasCloseBikeBehind) {
          this.showTrafficBikeComplaint(bike, this.takeTrafficJamReply());
          bike.dialogueCooldownMs = Phaser.Math.Between(3_600, 5_400);
        } else if (blockedByPlayer) {
          this.showTrafficBikeComplaint(bike);
          bike.dialogueCooldownMs = Phaser.Math.Between(4_500, 6_200);
        }
      }

      const queuedTravel = bikeAhead ? Math.max(0, bikeAhead.distance - followingGap) : Number.POSITIVE_INFINITY;
      const travelDistance = bike.stoppedForPlayer || bike.stoppedForTraffic || randomJamActive
        ? 0
        : Math.min(bike.speed * elapsed, queuedTravel);
      const x = bike.sprite.x + bike.direction * travelDistance;
      const reachedExit = bike.direction > 0 ? x >= bike.exitX : x <= bike.exitX;
      if (reachedExit) {
        this.destroyTrafficBike(bike);
        this.trafficBikes.splice(index, 1);
        continue;
      }
      bike.sprite.setPosition(x, laneY).setDepth(getStreetCharacterDepth(laneY));
      bike.shadow.setPosition(x, laneY + 1.5 * this.unit)
        .setDepth(getStreetCharacterDepth(laneY) - 0.02);
      bike.speechBubble.setScale(this.unit);
      this.positionTrafficBikeSpeechBubble(bike, x, laneY);
      bike.speechBubble.setVisible(bike.dialogueTimerMs > 0);
    }

    this.trafficSpawnCooldownMs = Math.max(0, this.trafficSpawnCooldownMs - Math.max(0, delta));
    if (this.trafficSpawnCooldownMs > 0) return;
    const started = this.trySpawnTrafficBike();
    const trafficGap = this.streetCrowdState.level === "busy"
      ? [1_100, 2_100]
      : this.streetCrowdState.level === "quiet" ? [3_800, 6_000] : [2_000, 3_300];
    this.trafficSpawnCooldownMs = started
      ? Phaser.Math.Between(trafficGap[0], trafficGap[1])
      : 1_000;
  }

  private updateStreetWalkerDialogue(delta: number): void {
    const dtMs = Math.min(Math.max(0, delta), 100);
    const speaker = this.streetSpeaker;
    if (speaker) {
      const bubble = speaker.speechBubble;
      if (!speaker.active || !bubble) {
        bubble?.setVisible(false);
        this.streetSpeaker = undefined;
        this.streetSpeechCooldownMs = 1_500;
      } else {
        this.streetSpeechTimerMs -= dtMs;
        bubble.setScale(this.unit).setDepth(getStreetCharacterDepth(speaker.sprite.y) + 0.0001);
        this.positionStreetSpeechBubble(bubble, speaker.sprite.x, this.getStreetWalkerSpeechBubbleY(speaker, speaker.sprite.y));
        if (this.streetSpeechTimerMs <= 0) {
          this.streetSpeaker = undefined;
          this.streetSpeechCooldownMs = Phaser.Math.Between(5_500, 9_000);
          this.tweens.add({
            targets: bubble,
            alpha: 0,
            duration: 180,
            onComplete: () => bubble.setVisible(false).setAlpha(1),
          });
        }
        return;
      }
    }

    this.streetSpeechCooldownMs -= dtMs;
    if (this.streetSpeechCooldownMs > 0) return;

    const camera = this.cameras.main;
    const viewportLeft = camera.scrollX + (camera.width - camera.displayWidth) / 2;
    const viewportRight = viewportLeft + this.getLogicalWidth();
    const candidates = this.walkers.filter((walker) =>
      walker.active
      && walker.speechBubble
      && walker.textureKey !== "walk-street-cat"
      && walker.sprite.x >= viewportLeft
      && walker.sprite.x <= viewportRight,
    );
    if (candidates.length === 0) {
      this.streetSpeechCooldownMs = 1_200;
      return;
    }

    const nextSpeaker = Phaser.Utils.Array.GetRandom(candidates);
    const bubble = nextSpeaker.speechBubble!;
    this.setStreetSpeechBubbleText(bubble, this.takeStreetDialogue(nextSpeaker));
    bubble.setScale(this.unit * 0.86)
      .setDepth(getStreetCharacterDepth(nextSpeaker.sprite.y) + 0.0001)
      .setAlpha(0)
      .setVisible(true);
    this.positionStreetSpeechBubble(bubble, nextSpeaker.sprite.x, this.getStreetWalkerSpeechBubbleY(nextSpeaker, nextSpeaker.sprite.y));
    this.tweens.add({
      targets: bubble,
      alpha: 1,
      scaleX: this.unit,
      scaleY: this.unit,
      duration: 180,
      ease: "Back.Out",
    });
    this.streetSpeaker = nextSpeaker;
    this.streetSpeechTimerMs = Phaser.Math.Between(2_200, 3_000);
  }

  private setGroceryWalkingPose(shopper: GroceryShopper): void {
    const animation = `${shopper.profile.walkTexture}-${shopper.direction > 0 ? "right" : "left"}`;
    shopper.sprite.anims.stop();
    shopper.sprite
      .setOrigin(0.5, getWalkerOriginY(shopper.profile.walkTexture))
      .setTexture(shopper.profile.walkTexture, getWalkerStartFrame(shopper.profile.walkTexture, shopper.direction))
      .setPosition(0, 0)
      .play(animation);
    setCharacterDisplaySize(
      shopper.sprite,
      GROCERY_DISPLAY_WIDTH * this.characterUnit,
      GROCERY_DISPLAY_HEIGHT * this.characterUnit,
      getWalkerFrameHeight(shopper.profile.walkTexture),
      getWalkerArtHeight(shopper.profile.walkTexture),
      CHARACTER_TARGET_VISIBLE_HEIGHT * this.characterUnit,
    );
  }

  private getViewportExitX(direction: -1 | 1, currentX: number): number {
    const camera = this.cameras.main;
    const viewportLeft = camera.scrollX + (camera.width - camera.displayWidth) / 2;
    const viewportRight = viewportLeft + this.getLogicalWidth();
    const margin = 70 * this.unit;
    return direction > 0
      ? Math.max(currentX, viewportRight) + margin
      : Math.min(currentX, viewportLeft) - margin;
  }

  private trySpawnGroceryShopper(): boolean {
    if (!this.mapWidth || this.groceryShoppers.length > 0) return false;
    const camera = this.cameras.main;
    const viewportLeft = camera.scrollX + (camera.width - camera.displayWidth) / 2;
    const viewportRight = viewportLeft + this.getLogicalWidth();
    const targetX = GROCERY_SHOP_TARGET_X_RATIO * this.mapWidth;
    const visibleMargin = 56 * this.unit;
    if (targetX < viewportLeft - visibleMargin || targetX > viewportRight + visibleMargin) return false;

    for (let offset = 0; offset < GROCERY_SHOPPER_PROFILES.length; offset += 1) {
      const index = (this.nextGroceryShopperProfileIndex + offset) % GROCERY_SHOPPER_PROFILES.length;
      const profile = GROCERY_SHOPPER_PROFILES[index];
      if (!this.textures.exists(profile.walkTexture) || !this.anims.exists(`${profile.walkTexture}-left`)) continue;

      const direction: -1 | 1 = targetX < (viewportLeft + viewportRight) / 2 ? 1 : -1;
      const approachDistance = GROCERY_APPROACH_DISTANCE * this.unit;
      const startRatio = GROCERY_SHOP_TARGET_X_RATIO - direction * approachDistance / this.mapWidth;
      const shadow = this.add.image(0, 1.5 * this.unit, "character-contact-shadow-soft")
        .setDisplaySize(42 * this.unit, 11 * this.unit)
        .setAlpha(0.8);
      const sprite = this.add.sprite(0, 0, profile.walkTexture, getWalkerStartFrame(profile.walkTexture, direction))
        .setOrigin(0.5, getWalkerOriginY(profile.walkTexture))
        .setDisplaySize(GROCERY_DISPLAY_WIDTH * this.characterUnit, GROCERY_DISPLAY_HEIGHT * this.characterUnit)
        .setAlpha(0.98);
      const bubble = this.createGrocerySpeechBubble(Phaser.Utils.Array.GetRandom([...profile.dialogues]));
      const container = this.add.container(startRatio * this.mapWidth, this.groundY, [shadow, sprite, bubble])
        .setDepth(getStreetCharacterDepth(this.groundY));
      const shopper: GroceryShopper = {
        profile,
        container,
        sprite,
        bubble,
        phase: "walking-in",
        xRatio: startRatio,
        targetRatio: GROCERY_SHOP_TARGET_X_RATIO,
        direction,
        timerMs: 0,
        exitDistance: 0,
      };
      this.setGroceryWalkingPose(shopper);
      sprite.anims.setProgress(Math.random());
      this.groceryShoppers.push(shopper);
      this.nextGroceryShopperProfileIndex = (index + 1) % GROCERY_SHOPPER_PROFILES.length;
      return true;
    }

    return false;
  }

  private updateGroceryShoppers(delta: number): void {
    const dtMs = Math.min(Math.max(0, delta), 100);
    const elapsed = dtMs / 1_000;
    if (this.groceryShoppers.length === 0) {
      this.grocerySpawnCooldownMs = Math.max(0, this.grocerySpawnCooldownMs - dtMs);
    }

    for (let index = this.groceryShoppers.length - 1; index >= 0; index -= 1) {
      const shopper = this.groceryShoppers[index];
      const targetY = this.mapTop + this.mapHeight * GROCERY_SHOP_TARGET_Y_RATIO;
      const walkingSpeed = 40 * this.unit;
      const approachDistance = GROCERY_APPROACH_DISTANCE * this.unit;

      if (shopper.phase === "walking-in") {
        const distance = shopper.targetRatio * this.mapWidth - shopper.xRatio * this.mapWidth;
        const step = walkingSpeed * elapsed;
        if (Math.abs(distance) <= step + 0.5) {
          shopper.xRatio = shopper.targetRatio;
          shopper.phase = "shopping";
          shopper.timerMs = 2_350;
          shopper.container.y = targetY;
          shopper.sprite.anims.stop();
          shopper.sprite
            .setOrigin(0.5, getGroceryBrowseOriginY(shopper.profile.browseTexture))
            .setTexture(shopper.profile.browseTexture, 0)
            .setPosition(0, 0)
            .play(shopper.profile.browseAnimation);
          setCharacterDisplaySize(
            shopper.sprite,
            GROCERY_DISPLAY_WIDTH * this.characterUnit,
            GROCERY_DISPLAY_HEIGHT * this.characterUnit,
            795,
            GROCERY_BROWSE_ART_HEIGHTS[shopper.profile.browseTexture] ?? 760,
            CHARACTER_TARGET_VISIBLE_HEIGHT * this.characterUnit,
          );
          shopper.bubble.setVisible(true).setAlpha(0).setScale(this.unit * 0.84);
          this.tweens.add({
            targets: shopper.bubble,
            alpha: 1,
            scaleX: this.unit,
            scaleY: this.unit,
            duration: 180,
            ease: "Back.Out",
          });
        } else {
          shopper.xRatio += Math.sign(distance) * step / this.mapWidth;
          const approachProgress = Phaser.Math.Clamp(1 - Math.abs(distance) / approachDistance, 0, 1);
          const turnInProgress = this.smoothStep(0.52, 1, approachProgress);
          shopper.container.y = Phaser.Math.Linear(
            this.groundY,
            targetY,
            turnInProgress,
          );
        }
      } else if (shopper.phase === "shopping") {
        shopper.timerMs -= dtMs;
        if (shopper.timerMs <= 0) {
          shopper.phase = "walking-out";
          shopper.timerMs = 0;
          shopper.targetRatio = this.getViewportExitX(shopper.direction, shopper.xRatio * this.mapWidth) / this.mapWidth;
          shopper.exitDistance = Math.max(
            Math.abs((shopper.targetRatio - shopper.xRatio) * this.mapWidth),
            1,
          );
          this.tweens.add({
            targets: shopper.bubble,
            alpha: 0,
            duration: 140,
            onComplete: () => shopper.bubble.setVisible(false),
          });
          this.setGroceryWalkingPose(shopper);
        }
      } else {
        const distance = shopper.targetRatio * this.mapWidth - shopper.xRatio * this.mapWidth;
        const step = walkingSpeed * elapsed;
        if (Math.abs(distance) <= step + 0.5) {
          shopper.container.destroy(true);
          this.groceryShoppers.splice(index, 1);
          this.grocerySpawnCooldownMs = Phaser.Math.Between(GROCERY_SPAWN_MIN_MS, GROCERY_SPAWN_MAX_MS);
          continue;
        }
        shopper.xRatio += Math.sign(distance) * step / this.mapWidth;
        const exitProgress = Phaser.Math.Clamp(1 - Math.abs(distance) / shopper.exitDistance, 0, 1);
        shopper.container.y = Phaser.Math.Linear(
          targetY,
          this.groundY,
          this.smoothStep(0, 1, exitProgress),
        );
      }

      shopper.container.x = shopper.xRatio * this.mapWidth;
      shopper.container.setDepth(getStreetCharacterDepth(shopper.container.y));
      const shadow = shopper.container.getAt(0) as Phaser.GameObjects.Image;
      shadow.setPosition(0, 1.5 * this.unit).setDisplaySize(42 * this.unit, 11 * this.unit);
      if (shopper.phase === "shopping") {
        shopper.sprite.setOrigin(0.5, getGroceryBrowseOriginY(shopper.profile.browseTexture));
        setCharacterDisplaySize(
          shopper.sprite,
          GROCERY_DISPLAY_WIDTH * this.characterUnit,
          GROCERY_DISPLAY_HEIGHT * this.characterUnit,
          795,
          GROCERY_BROWSE_ART_HEIGHTS[shopper.profile.browseTexture] ?? 760,
          CHARACTER_TARGET_VISIBLE_HEIGHT * this.characterUnit,
        );
      } else {
        shopper.sprite.setOrigin(0.5, getWalkerOriginY(shopper.profile.walkTexture));
        setCharacterDisplaySize(
          shopper.sprite,
          GROCERY_DISPLAY_WIDTH * this.characterUnit,
          GROCERY_DISPLAY_HEIGHT * this.characterUnit,
          getWalkerFrameHeight(shopper.profile.walkTexture),
          getWalkerArtHeight(shopper.profile.walkTexture),
          CHARACTER_TARGET_VISIBLE_HEIGHT * this.characterUnit,
        );
      }
      shopper.bubble.setPosition(0, -101 * this.unit).setScale(this.unit);
    }

    if (this.groceryShoppers.length === 0 && this.grocerySpawnCooldownMs <= 0) {
      const started = this.trySpawnGroceryShopper();
      if (!started) this.grocerySpawnCooldownMs = 1_100;
    }
  }

  private trySpawnStreetDiner(): boolean {
    if (!this.mapWidth || this.streetDiners.length >= MAX_ACTIVE_STREET_DINERS) return false;
    const camera = this.cameras.main;
    const viewportLeft = camera.scrollX + (camera.width - camera.displayWidth) / 2;
    const viewportRight = viewportLeft + this.getLogicalWidth();

    for (let offset = 0; offset < STREET_DINER_PROFILES.length; offset += 1) {
      const index = (this.nextDinerProfileIndex + offset) % STREET_DINER_PROFILES.length;
      const profile = STREET_DINER_PROFILES[index];
      const profileAlreadyOnStreet = this.streetDiners.some((diner) => diner.profile.id === profile.id);
      if (profileAlreadyOnStreet) continue;
      if (!this.textures.exists(profile.walkTexture) || !this.anims.exists(`${profile.walkTexture}-left`)) continue;

      const occupiedSeats = new Set(
        this.streetDiners
          .filter((diner) => diner.phase !== "walking-out")
          .map((diner) => diner.seat.id),
      );
      const seat = DINER_SEATS[profile.venue].find((slot) => !occupiedSeats.has(slot.id));
      if (!seat) continue;

      const targetX = seat.xRatio * this.mapWidth;
      const visibleMargin = 36 * this.unit;
      if (targetX < viewportLeft - visibleMargin || targetX > viewportRight + visibleMargin) continue;

      const direction: -1 | 1 = targetX < (viewportLeft + viewportRight) / 2 ? 1 : -1;
      const approachDistance = DINER_APPROACH_DISTANCE * this.unit;
      const startRatio = seat.xRatio - direction * approachDistance / this.mapWidth;
      const spawnX = startRatio * this.mapWidth;
      const shadow = this.add.image(0, 1.5 * this.unit, "character-contact-shadow-soft")
        .setDisplaySize(38 * this.unit, 11 * this.unit)
        .setAlpha(0.8);
      const sprite = this.add.sprite(0, 0, profile.walkTexture, getWalkerStartFrame(profile.walkTexture, direction))
        .setOrigin(0.5, getWalkerOriginY(profile.walkTexture))
        .setDisplaySize(DINER_DISPLAY_WIDTH * this.characterUnit, DINER_DISPLAY_HEIGHT * this.characterUnit)
        .setAlpha(0.98)
        .play(`${profile.walkTexture}-${direction > 0 ? "right" : "left"}`);
      sprite.anims.setProgress(Math.random());
      const container = this.add.container(spawnX, this.groundY, [shadow, sprite])
        .setDepth(getStreetCharacterDepth(this.groundY));
      const diner: StreetDiner = {
        profile,
        seat,
        container,
        sprite,
        phase: "walking-in",
        xRatio: startRatio,
        targetRatio: seat.xRatio,
        seatYRatio: seat.yRatio,
        direction,
        timerMs: 0,
        idleDurationMs: Phaser.Math.Between(9_000, 15_000),
      };
      this.streetDiners.push(diner);
      this.nextDinerProfileIndex = (index + 1) % STREET_DINER_PROFILES.length;
      return true;
    }

    return false;
  }

  private updateStreetDiners(delta: number): void {
    const dtMs = Math.min(Math.max(0, delta), 100);
    const elapsed = dtMs / 1_000;
    this.dinerSpawnCooldownMs = Math.max(0, this.dinerSpawnCooldownMs - dtMs);

    for (let index = this.streetDiners.length - 1; index >= 0; index -= 1) {
      const diner = this.streetDiners[index];
      const targetX = diner.targetRatio * this.mapWidth;
      const seatY = this.mapTop + this.mapHeight * diner.seatYRatio;
      const approachDistance = DINER_APPROACH_DISTANCE * this.unit;
      const walkingSpeed = 36 * this.unit;

      if (diner.phase === "walking-in") {
        const distance = targetX - diner.xRatio * this.mapWidth;
        const step = walkingSpeed * elapsed;
        if (Math.abs(distance) <= step + 0.5) {
          diner.xRatio = diner.targetRatio;
          diner.phase = "sitting-down";
          diner.timerMs = 380;
          diner.container.y = seatY;
          this.setDinerSeatedPose(diner);
        } else {
          diner.xRatio += Math.sign(distance) * step / this.mapWidth;
          const approachProgress = Phaser.Math.Clamp(1 - Math.abs(distance) / approachDistance, 0, 1);
          const turnInProgress = this.smoothStep(0.58, 1, approachProgress);
          diner.container.y = Phaser.Math.Linear(this.groundY, seatY, turnInProgress);
        }
      } else if (diner.phase === "sitting-down") {
        diner.timerMs -= dtMs;
        if (diner.timerMs <= 0) {
          diner.phase = "eating";
          diner.timerMs = diner.idleDurationMs;
        }
      } else if (diner.phase === "eating") {
        diner.timerMs -= dtMs;
        if (diner.timerMs <= 0) {
          diner.phase = "standing-up";
          diner.timerMs = 420;
          this.setDinerWalkingPose(diner);
        }
      } else if (diner.phase === "standing-up") {
        diner.timerMs -= dtMs;
        const standProgress = Phaser.Math.Clamp(1 - diner.timerMs / 420, 0, 1);
        diner.container.y = Phaser.Math.Linear(seatY, this.groundY, this.smoothStep(0, 1, standProgress));
        if (diner.timerMs <= 0) {
          diner.phase = "walking-out";
          diner.container.y = this.groundY;
          diner.targetRatio = this.getViewportExitX(diner.direction, diner.xRatio * this.mapWidth) / this.mapWidth;
        }
      } else if (diner.phase === "walking-out") {
        const distance = diner.targetRatio * this.mapWidth - diner.xRatio * this.mapWidth;
        const step = walkingSpeed * elapsed;
        if (Math.abs(distance) <= step + 0.5) {
          diner.container.destroy(true);
          this.streetDiners.splice(index, 1);
          this.dinerSpawnCooldownMs = Math.min(this.dinerSpawnCooldownMs, 900);
          continue;
        }
        diner.xRatio += Math.sign(distance) * step / this.mapWidth;
        diner.container.y = this.groundY;
      }

      const x = diner.xRatio * this.mapWidth;
      diner.container.x = x;
      diner.container.setDepth(getStreetCharacterDepth(diner.container.y));
      const shadow = diner.container.getAt(0) as Phaser.GameObjects.Image;
      shadow.setPosition(0, 1.5 * this.unit).setDisplaySize(38 * this.unit, 11 * this.unit);
      const isWalking = diner.sprite.texture.key === diner.profile.walkTexture;
      const textureKey = diner.sprite.texture.key;
      const frameHeight = isWalking ? getWalkerFrameHeight(diner.profile.walkTexture) : getDinerFrameHeight(textureKey);
      const artHeight = isWalking ? getWalkerArtHeight(diner.profile.walkTexture) : DINER_ART_HEIGHTS[textureKey] ?? 342;
      diner.sprite.setOrigin(0.5, isWalking ? getWalkerOriginY(diner.profile.walkTexture) : getDinerOriginY(textureKey));
      setCharacterDisplaySize(
        diner.sprite,
        DINER_DISPLAY_WIDTH * this.characterUnit,
        DINER_DISPLAY_HEIGHT * this.characterUnit,
        frameHeight,
        artHeight,
        CHARACTER_TARGET_VISIBLE_HEIGHT * this.characterUnit,
      );
    }

    if (this.dinerSpawnCooldownMs <= 0) {
      const started = this.trySpawnStreetDiner();
      this.dinerSpawnCooldownMs = started ? Phaser.Math.Between(2_200, 3_400) : 1_100;
    }
  }

  private diningGuestAtlasManifest(characterId: string): DiningGuestAtlas | undefined {
    const path = Object.keys(DINING_GUEST_ATLAS_MANIFESTS).find((entry) => entry.includes(`/${characterId}/`));
    return path ? DINING_GUEST_ATLAS_MANIFESTS[path] : undefined;
  }

  private registerDiningGuestWalkAnimation(characterId: string): void {
    const textureKey = `dining-npc-${characterId}`;
    const manifest = this.diningGuestAtlasManifest(characterId);
    const rectangles = manifest?.frame_layout.rows.side_walk;
    if (!manifest || !rectangles?.length || !this.textures.exists(textureKey)) return;

    const texture = this.textures.get(textureKey);
    rectangles.forEach((rect, index) => {
      const frame = `side_walk-${index}`;
      if (!texture.has(frame)) texture.add(frame, 0, rect.x, rect.y, rect.w, rect.h);
    });
    const animationKey = `${textureKey}-side_walk`;
    if (this.anims.exists(animationKey)) return;
    const animation = manifest.animation.rows.side_walk;
    this.anims.create({
      key: animationKey,
      frames: rectangles.map((_, index) => ({ key: textureKey, frame: `side_walk-${index}` })),
      frameRate: Math.min(animation?.fps ?? 5, 4),
      repeat: -1,
    });
  }

  private requestDiningGuestAtlas(characterId: string): void {
    const textureKey = `dining-npc-${characterId}`;
    if (this.textures.exists(textureKey)) {
      this.registerDiningGuestWalkAnimation(characterId);
      return;
    }
    if (this.diningGuestAtlasRequests.has(characterId)) return;
    const path = Object.keys(DINING_GUEST_ATLAS_URLS).find((entry) => entry.includes(`/${characterId}/`));
    if (!path) return;
    this.diningGuestAtlasRequests.add(characterId);
    this.load.once(`filecomplete-image-${textureKey}`, () => {
      this.diningGuestAtlasRequests.delete(characterId);
      this.registerDiningGuestWalkAnimation(characterId);
      this.syncOutdoorDiningGuests(this.lastSnapshot);
    });
    this.load.image(textureKey, DINING_GUEST_ATLAS_URLS[path]);
    if (!this.load.isLoading()) this.load.start();
  }

  private syncOutdoorDiningGuests(snapshot: GameSnapshot): void {
    const outdoorGuests = snapshot.dining.guests.filter((guest) => guest.status === "approaching" || guest.status === "departing");
    const activeIds = new Set(outdoorGuests.map((guest) => guest.id));
    for (const [guestId, actor] of this.outdoorDiningGuests) {
      if (activeIds.has(guestId)) continue;
      actor.sprite.destroy();
      actor.shadow.destroy();
      this.outdoorDiningGuests.delete(guestId);
    }

    const canShowOutside = snapshot.inShift && this.activeZone === "shop";
    if (!canShowOutside || this.mapWidth <= 0 || this.characterUnit <= 0) {
      for (const actor of this.outdoorDiningGuests.values()) {
        actor.sprite.setVisible(false);
        actor.shadow.setVisible(false);
      }
      return;
    }

    for (const guest of outdoorGuests) {
      const textureKey = `dining-npc-${guest.characterId}`;
      const manifest = this.diningGuestAtlasManifest(guest.characterId);
      if (!manifest) continue;
      if (!this.textures.exists(textureKey)) {
        this.requestDiningGuestAtlas(guest.characterId);
        continue;
      }
      this.registerDiningGuestWalkAnimation(guest.characterId);
      const firstFrame = "side_walk-0";
      if (!this.textures.get(textureKey).has(firstFrame)) continue;

      let actor = this.outdoorDiningGuests.get(guest.id);
      if (!actor) {
        const shadow = this.add.ellipse(0, 0, 37, 9, 0x241b15, 0.28);
        const sprite = this.add.sprite(0, 0, textureKey, firstFrame);
        actor = { sprite, shadow, status: guest.status, transitionSeconds: guest.transitionSeconds, syncedAt: this.time.now };
        this.outdoorDiningGuests.set(guest.id, actor);
      } else if (actor.status !== guest.status || actor.transitionSeconds !== guest.transitionSeconds) {
        actor.status = guest.status;
        actor.transitionSeconds = guest.transitionSeconds;
        actor.syncedAt = this.time.now;
      }

      const animationKey = `${textureKey}-side_walk`;
      if (actor.sprite.texture.key !== textureKey || actor.sprite.anims.currentAnim?.key !== animationKey) {
        actor.sprite.setTexture(textureKey, firstFrame);
        actor.sprite.play(animationKey, true);
      }
      const progress = Phaser.Math.Clamp(
        1 - Math.max(0, actor.transitionSeconds - (this.time.now - actor.syncedAt) / 1_000) / DINING_OUTDOOR_WALK_SECONDS,
        0,
        1,
      );
      const movementDirection: -1 | 1 = guest.status === "approaching"
        ? guest.outsideDirection === 1 ? -1 : 1
        : guest.outsideDirection;
      const distance = Math.min(this.mapWidth * 0.28, 360 * this.unit);
      const memberOffset = (guest.partyMemberIndex - (guest.partySize - 1) / 2) * 20 * this.unit;
      const doorX = this.cartX - guest.outsideDirection * memberOffset;
      const entranceLaneY = this.mapTop + this.mapHeight * 0.66;
      // Keep arrivals on one sidewalk baseline all the way to the doorway;
      // changing their foot height here made the side-walk animation look airborne.
      const outwardRoute = [
        { x: doorX, y: entranceLaneY },
        { x: doorX + guest.outsideDirection * distance, y: entranceLaneY },
      ];
      const route = guest.status === "approaching" ? [...outwardRoute].reverse() : outwardRoute;
      const segmentLengths = route.slice(1).map((point, index) =>
        Phaser.Math.Distance.Between(route[index].x, route[index].y, point.x, point.y),
      );
      const routeLength = segmentLengths.reduce((sum, length) => sum + length, 0);
      let distanceAlongRoute = progress * routeLength;
      let segmentIndex = 0;
      while (segmentIndex < segmentLengths.length - 1 && distanceAlongRoute > segmentLengths[segmentIndex]) {
        distanceAlongRoute -= segmentLengths[segmentIndex];
        segmentIndex += 1;
      }
      const segmentLength = segmentLengths[segmentIndex] ?? 0;
      const segmentProgress = segmentLength > 0 ? Phaser.Math.Clamp(distanceAlongRoute / segmentLength, 0, 1) : 1;
      const from = route[segmentIndex];
      const to = route[segmentIndex + 1] ?? from;
      const x = Phaser.Math.Clamp(Phaser.Math.Linear(from.x, to.x, segmentProgress), 0, this.mapWidth);
      const y = Phaser.Math.Linear(from.y, to.y, segmentProgress);
      const anchor = manifest.anchors.standingFeet;
      actor.sprite
        .setOrigin(anchor.x / manifest.frame_layout.cellWidth, anchor.y / manifest.frame_layout.cellHeight)
        .setFlipX(movementDirection < 0)
        .setPosition(x, y)
        .setDisplaySize(50 * this.characterUnit, 80 * this.characterUnit)
        .setDepth(getStreetCharacterDepth(y) + 0.015)
        .setVisible(true);
      actor.shadow
        .setPosition(x, y + 1.5 * this.unit)
        .setDisplaySize(34 * this.characterUnit, 8 * this.characterUnit)
        .setDepth(getStreetCharacterDepth(y) - 0.02)
        .setVisible(true);
    }
  }

  private loadBackgroundWalkerAssets(): void {
    const ambientAssets = AMBIENT_WALKER_ASSETS.slice(CORE_WALKER_COUNT);
    if (ambientAssets.length === 0) return;
    for (const { key, url } of ambientAssets) {
      const petGrid = key in PET_SPRITE_GRIDS ? PET_SPRITE_GRIDS[key as keyof typeof PET_SPRITE_GRIDS] : undefined;
      this.load.spritesheet(key, url, {
        frameWidth: petGrid?.frameWidth ?? CUSTOMER_FRAME_WIDTH,
        frameHeight: petGrid?.frameHeight ?? CUSTOMER_FRAME_HEIGHT,
      });
    }
    this.load.once("complete", () => {
      this.registerWalkerAnimations(CORE_WALKER_COUNT, WALKER_TEXTURES.length);
      this.createAmbientWalkers(CORE_WALKER_COUNT, WALKER_TEXTURES.length);
      this.createAmbientWalkers(0, HOME_AMBIENT_WALKER_COUNT, "home");
      this.createAmbientWalkers(4, 4 + MARKET_AMBIENT_WALKER_COUNT, "market");
      this.streetCrowdSignature = "";
      this.updateStreetCrowdState(
        this.getCurrentDayPhase() * 24,
        this.getWeatherState(this.environmentElapsedMs / 1_000).rain,
      );
      this.layout();
    });
    this.load.start();
  }

  private parseDevStage(value: string | null): number | null {
    if (!value || !/^(?:[1-9]|1[0-3])$/.test(value)) return null;
    return Number(value);
  }

  private getInitialShopStage(): number {
    if (import.meta.env.DEV) {
      const requested = this.parseDevStage(new URLSearchParams(window.location.search).get("stage"));
      if (requested !== null) return requested;
    }
    return this.store.getSnapshot().cartLevel;
  }

  private preloadHomeStageImages(stageId: number, duringScenePreload = false): void {
    const safeStageId = Phaser.Math.Clamp(Math.round(stageId), 1, HOME_STAGES.length);
    const ids = [...new Set([
      safeStageId,
      Math.min(HOME_STAGES.length, safeStageId + 1),
    ])];
    let queued = false;
    for (const id of ids) {
      const stage = HOME_STAGES[id - 1];
      const textureKey = getHomeStageImageKey(id);
      if (!stage?.image || this.textures.exists(textureKey) || this.pendingHomeStageImages.has(id)) continue;
      this.pendingHomeStageImages.add(id);
      this.load.image(textureKey, stage.image);
      queued = true;
    }

    if (duringScenePreload) {
      this.load.once("complete", () => this.pendingHomeStageImages.clear());
      return;
    }
    if (!queued) return;
    this.load.once("complete", () => {
      this.pendingHomeStageImages.clear();
      this.refreshHomeArtwork();
      this.layout();
    });
    this.load.start();
  }

  private transitionHomeStage(stageId: number): void {
    const nextStage = Phaser.Math.Clamp(Math.round(stageId), 1, HOME_STAGES.length);
    if (nextStage === this.homeStage) {
      this.refreshHomeArtwork();
      return;
    }

    this.homeStage = nextStage;
    this.preloadHomeStageImages(nextStage);
    this.refreshHomeArtwork();
  }

  private refreshHomeArtwork(): void {
    if (!this.homeArtwork || this.homeStage < 1) return;
    const textureKey = getHomeStageImageKey(this.homeStage);
    if (!this.textures.exists(textureKey)) return;

    const previousStage = this.displayedHomeStage;
    if (this.homeArtwork.texture.key !== textureKey) this.homeArtwork.setTexture(textureKey);
    this.homeArtwork.setVisible(true);
    this.displayedHomeStage = this.homeStage;
    this.layoutHomeArtwork();
    if (previousStage && previousStage !== this.displayedHomeStage) {
      const previousTextureKey = getHomeStageImageKey(previousStage);
      if (this.textures.exists(previousTextureKey)) this.textures.remove(previousTextureKey);
    }
  }

  private layoutHomeArtwork(): void {
    if (!this.homeArtwork || this.homeMapWidth <= 0 || this.mapHeight <= 0) return;
    const stage = HOME_STAGES[this.displayedHomeStage - 1];
    if (!stage) return;
    const sourceScale = this.mapHeight / HOME_MAP_SIZE.height;
    const artworkScale = sourceScale * stage.displayScale;
    const centerX = -this.homeMapWidth + (stage.offsetX + stage.canvasWidth / 2) * sourceScale;
    const groundY = this.mapTop + (stage.offsetY + stage.canvasHeight - 2) * sourceScale;
    this.homeArtwork
      .setPosition(centerX - stage.canvasWidth * artworkScale / 2, groundY - (stage.canvasHeight - 2) * artworkScale)
      .setDisplaySize(stage.canvasWidth * artworkScale, stage.canvasHeight * artworkScale)
      .setDepth(-1.25);
  }

  private preloadShopStageImages(stageId: number, duringScenePreload = false): void {
    const ids = [...new Set([
      stageId,
      Math.min(SHOP_STAGES.length, stageId + 1),
    ])];
    let queued = false;
    for (const id of ids) {
      const stage = SHOP_STAGES[id - 1];
      if (!stage?.image || this.textures.exists(getShopStageImageKey(id)) || this.pendingShopStageImages.has(id)) continue;
      this.pendingShopStageImages.add(id);
      this.load.image(getShopStageImageKey(id), stage.image);
      queued = true;
    }
    if (!queued || duringScenePreload) return;
    this.load.once("complete", () => {
      this.pendingShopStageImages.clear();
      this.refreshShopStageArtwork();
      this.layout();
    });
    this.load.start();
  }

  private createShopStageOverlay(): void {
    this.shopPlaceholder = this.add.rectangle(0, 0, 1, 1, 0x5c5147, 0.88).setOrigin(0);
    this.shopPlaceholderFrame = this.add.graphics();
    this.shopStageTitle = this.add.text(0, 0, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      fontSize: "32px",
      fontStyle: "bold",
      color: "#fff4dc",
      stroke: "#342a23",
      strokeThickness: 4,
      align: "center",
    }).setOrigin(0.5);
    this.shopStageAsset = this.add.text(0, 0, "", {
      fontFamily: "Trebuchet MS, sans-serif",
      fontSize: "20px",
      color: "#f4d39d",
      stroke: "#342a23",
      strokeThickness: 3,
      align: "center",
    }).setOrigin(0.5);
    this.shopNameSignText = this.add.text(0, 0, GAME_NAME_VI, {
      fontFamily: "Trebuchet MS, sans-serif",
      fontSize: "18px",
      fontStyle: "bold",
      color: "#56331d",
      stroke: "#fff1d2",
      strokeThickness: 1.5,
      align: "center",
    }).setOrigin(0.5).setVisible(false);
    this.shopOverlay = this.add.container(0, 0, [
      this.shopPlaceholder,
      this.shopPlaceholderFrame,
      this.shopStageTitle,
      this.shopStageAsset,
      this.shopNameSignText,
    ]).setDepth(SHOP_OVERLAY_DEPTH);

  }

  private getPlayerOwnerTextureKey(): string {
    return this.ownerGender === "male" ? "player-owner-male-idle-base" : "player-owner-female-idle";
  }

  private createPlayerOwner(): void {
    const textureKey = this.getPlayerOwnerTextureKey();
    this.ownerShadow = this.add.image(0, 0, "player-owner-ground-shadow")
      .setOrigin(0.5)
      .setAlpha(0.92);
    this.ownerCharacter = this.add.sprite(0, 0, textureKey, 0)
      .setOrigin(0.5, OWNER_FRAME_BASELINE / OWNER_FRAME_HEIGHT);
    this.syncPlayerOwnerAnimation();
  }

  private syncPlayerOwnerAnimation(): void {
    if (!this.ownerCharacter) return;
    this.ownerIdleAnimationTimer?.remove(false);
    this.ownerIdleAnimationTimer = undefined;

    if (this.ownerGender === "male") {
      if (this.ownerMoving) this.ownerIdleVariant = "base";
      this.playMaleOwnerAnimation();
      if (!this.ownerMoving) this.schedulePlayerOwnerIdleAnimation();
      return;
    }

    this.ownerIdleVariant = "base";
    const idleTextureKey = this.getPlayerOwnerTextureKey();
    const desiredTextureKey = this.ownerMoving ? idleTextureKey.replace("-idle", "-walk") : idleTextureKey;
    if (this.ownerCharacter.texture.key !== desiredTextureKey) {
      this.ownerCharacter.setTexture(desiredTextureKey, 0);
    }
    const animationKey = this.ownerMoving
      ? `${desiredTextureKey}-${this.ownerFacingDirection < 0 ? "left" : "right"}`
      : `${idleTextureKey}-loop`;
    this.ownerCharacter.play(animationKey, true);
  }

  private playMaleOwnerAnimation(): void {
    if (!this.ownerCharacter) return;
    const animationState = this.ownerMoving ? "walk" : `idle-${this.ownerIdleVariant}`;
    const textureKey = `player-owner-male-${animationState}`;
    const animationKey = `${textureKey}-${this.ownerFacing8Direction}`;
    if (this.ownerCharacter.texture.key !== textureKey) this.ownerCharacter.setTexture(textureKey, 0);
    this.ownerCharacter.play(animationKey, true);
  }

  private schedulePlayerOwnerIdleAnimation(): void {
    if (!this.ownerCharacter || this.ownerGender !== "male" || this.ownerMoving || this.zoneTransitioning) return;
    this.ownerIdleAnimationTimer = this.time.delayedCall(7_000 + Phaser.Math.Between(0, 5_000), () => {
      this.ownerIdleAnimationTimer = undefined;
      if (!this.ownerCharacter || this.ownerGender !== "male" || this.ownerMoving || this.zoneTransitioning) return;
      this.ownerIdleVariant = Phaser.Math.Between(0, 1) === 0 ? "glance" : "apron";
      this.playMaleOwnerAnimation();
      this.ownerIdleAnimationTimer = this.time.delayedCall(1_100, () => {
        this.ownerIdleAnimationTimer = undefined;
        if (!this.ownerCharacter || this.ownerGender !== "male" || this.ownerMoving || this.zoneTransitioning) return;
        this.ownerIdleVariant = "base";
        this.playMaleOwnerAnimation();
        this.schedulePlayerOwnerIdleAnimation();
      });
    });
  }

  setPlayerOwnerGender(gender: OwnerGender): void {
    if (gender !== "male" && gender !== "female") return;
    if (!this.ownerCharacter) {
      this.ownerGender = gender;
      return;
    }
    const requiredTextures = gender === "male"
      ? ["player-owner-male-idle-base", "player-owner-male-walk-8dir"]
      : ["player-owner-female-idle", "player-owner-female-walk"];
    if (!requiredTextures.every((textureKey) => this.textures.exists(textureKey))) return;
    this.ownerGender = gender;
    this.ownerCharacter.anims.stop();
    this.ownerCharacter.setOrigin(0.5, OWNER_FRAME_BASELINE / OWNER_FRAME_HEIGHT);
    this.syncPlayerOwnerAnimation();
  }

  private layoutPlayerOwner(x: number, y: number, unit: number, characterUnit: number): void {
    if (!this.ownerCharacter || !this.ownerShadow) return;
    const zoneScale = getZoneArtworkScale(this.activeZone);
    const actorUnit = characterUnit * zoneScale;
    this.ownerWorldX = x;
    this.ownerWorldY = y;
    const depth = getStreetCharacterDepth(y);
    this.ownerShadow
      .setPosition(x, y + 1.5 * unit)
      .setDisplaySize(42 * unit * zoneScale, 12 * unit * zoneScale)
      .setDepth(depth - 0.02);
    this.ownerCharacter
      .setPosition(x, y)
      .setDepth(depth)
      .setOrigin(0.5, OWNER_FRAME_BASELINE / OWNER_FRAME_HEIGHT);
    setCharacterDisplaySize(
      this.ownerCharacter,
      OWNER_DISPLAY_WIDTH * actorUnit,
      OWNER_DISPLAY_HEIGHT * actorUnit,
      OWNER_FRAME_HEIGHT,
      OWNER_ART_HEIGHT,
      OWNER_TARGET_VISIBLE_HEIGHT * actorUnit,
    );
  }

  private setZoneCameraBounds(zone: "home" | "shop" | "market"): void {
    if (!this.mapWidth || !this.homeMapWidth || !this.marketMapWidth) return;
    const camera = this.cameras.main;
    if (zone === "home") camera.setBounds(-this.homeMapWidth, 0, this.homeMapWidth, this.getLogicalHeight(), false);
    else if (zone === "market") camera.setBounds(this.mapWidth, 0, this.marketMapWidth, this.getLogicalHeight(), false);
    else camera.setBounds(0, 0, this.mapWidth, this.getLogicalHeight(), false);
  }

  private createMapTransitionSigns(): void {
    const signDefinitions: Omit<MapTransitionSign, "container" | "hitZone" | "frame" | "titleText" | "width" | "height">[] = [
      { from: "shop", kind: "edge", to: "home", title: "Khu nhà dân" },
      { from: "shop", kind: "edge", to: "market", title: "Chợ đầu mối" },
      { from: "home", kind: "edge", to: "shop", title: "Góc phố thân quen" },
      { from: "market", kind: "edge", to: "shop", title: "Góc phố thân quen" },
      { from: "home", kind: "door", action: "enter-home", title: "Vào nhà" },
      { from: "market", kind: "door", action: "enter-market", title: "Vào chợ" },
    ];

    this.mapTransitionSigns = signDefinitions.map((definition) => {
      const frame = this.add.graphics();
      const titleText = this.add.text(0, 0, definition.title, {
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "12px",
        fontStyle: "bold",
        color: "#fff4dc",
        stroke: "#211810",
        strokeThickness: 2,
        align: "center",
      }).setOrigin(0.5);
      const container = this.add.container(0, 0, [frame, titleText])
        .setDepth(8.4)
        .setScrollFactor(1)
        .setVisible(false);
      const hitZone = this.add.zone(0, 0, 1, 1).setOrigin(0).setDepth(8.5).setVisible(false);
      const sign: MapTransitionSign = { ...definition, container, hitZone, frame, titleText, width: 0, height: 0 };
      hitZone.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
        if (!this.mapInteractionEnabled || this.zoneTransitioning || this.activeZone !== sign.from) return;
        if (pointer.getDistance() > 22) return;
        if (sign.action) this.enterDoor(sign.action);
        else if (sign.to) this.transitionToZone(sign.to);
      });
      this.resizeMapTransitionSign(sign);
      return sign;
    });
  }

  private resizeMapTransitionSign(sign: MapTransitionSign): void {
    const fontScale = Math.max(1, this.unit);
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    sign.titleText
      .setFontSize(Math.max(11, Math.round(13 * fontScale)))
      .setResolution(dpr);
    sign.width = sign.titleText.width + 18 * fontScale;
    sign.height = sign.titleText.height + 12 * fontScale;
    sign.titleText.setPosition(0, 0);
    sign.frame.clear()
      .fillStyle(0x211810, 0.82)
      .fillRoundedRect(-sign.width / 2, -sign.height / 2, sign.width, sign.height, 5 * fontScale)
      .lineStyle(Math.max(1, fontScale), 0xd3aa68, 0.88)
      .strokeRoundedRect(-sign.width / 2, -sign.height / 2, sign.width, sign.height, 5 * fontScale);
    sign.container.setSize(sign.width, sign.height);
    const touchWidth = Math.max(sign.width, 48);
    const touchHeight = Math.max(sign.height, 44);
    sign.hitZone
      .setSize(touchWidth, touchHeight)
      .setInteractive(new Phaser.Geom.Rectangle(0, 0, touchWidth, touchHeight), Phaser.Geom.Rectangle.Contains);
  }

  private layoutMapTransitionSigns(): void {
    if (!this.mapTransitionSigns.length || this.mapWidth <= 0 || this.homeMapWidth <= 0 || this.marketMapWidth <= 0) return;
    const edgeY = this.mapTop + this.mapHeight * 0.55;
    const doorY = this.mapTop + this.mapHeight * 0.58;
    for (const sign of this.mapTransitionSigns) {
      this.resizeMapTransitionSign(sign);
      const edgeInset = Math.max(56 * this.unit, this.getLogicalWidth() * 0.13, sign.width / 2 + 8 * this.unit);
      const x = sign.kind === "door"
        ? sign.from === "home" ? this.getHomeEntryWorldX()
          : sign.from === "market" ? this.mapWidth + this.marketMapWidth * 0.525 : this.cartX
        : sign.from === "home" ? -edgeInset
          : sign.from === "market" ? this.mapWidth + edgeInset
            : sign.to === "home" ? edgeInset : this.mapWidth - edgeInset;
      sign.container.setPosition(x, sign.kind === "door" ? doorY : edgeY);
    }
    this.updateMapTransitionSigns();
  }

  private updateMapTransitionSigns(): void {
    for (const sign of this.mapTransitionSigns) {
      const revealDistance = Math.max(this.getLogicalWidth() * 0.52, this.mapHeight * 0.28);
      const nearDoor = Math.abs(this.ownerWorldX - sign.container.x) <= Math.max(56 * this.unit, this.mapHeight * 0.11)
        && this.ownerWorldY <= this.mapTop + this.mapHeight * 0.8;
      const visible = this.mapInteractionEnabled
        && !this.zoneTransitioning
        && this.activeZone === sign.from
        && (sign.kind === "door" ? nearDoor
          : Math.hypot(this.ownerWorldX - sign.container.x, this.ownerWorldY - sign.container.y) <= revealDistance);
      sign.container.setVisible(visible);
      sign.hitZone
        .setPosition(sign.container.x - sign.hitZone.width / 2, sign.container.y - sign.hitZone.height / 2)
        .setVisible(visible)
        .setActive(visible);
    }
  }

  isNearShopEntrance(): boolean {
    return this.mapHeight > 0
      && this.mapInteractionEnabled
      && !this.zoneTransitioning
      && this.activeZone === "shop"
      && Math.abs(this.ownerWorldX - this.cartX) <= Math.max(56 * this.unit, this.mapHeight * 0.11)
      && this.ownerWorldY <= this.mapTop + this.mapHeight * 0.8;
  }

  private updateShopEntranceAvailability(): void {
    const nearby = this.isNearShopEntrance();
    if (nearby === this.shopEntranceNearby) return;
    this.shopEntranceNearby = nearby;
    this.events.emit("street-shop-entrance-nearby", nearby);
  }

  private clampOwnerWorldY(y: number, zone: "home" | "shop" | "market" = this.activeZone): number {
    if (this.mapHeight <= 0) return y;
    const { minRatio, maxRatio } = OWNER_MAP_Y_BOUNDS[zone];
    return Phaser.Math.Clamp(
      y,
      this.mapTop + this.mapHeight * minRatio,
      this.mapTop + this.mapHeight * maxRatio,
    );
  }

  private transitionToZone(zone: "home" | "shop" | "market"): void {
    if (this.zoneTransitioning || zone === this.activeZone) return;
    const previousZone = this.activeZone;
    const cover = this.zoneTransitionCover;
    if (!cover) {
      this.activeZone = zone;
      this.ownerWorldY = this.clampOwnerWorldY(zone === "home" ? this.mapTop + this.mapHeight * 0.745 : this.ownerWorldY, zone);
      this.ownerWorldX = this.getZoneArrivalWorldX(zone, previousZone);
      this.layoutPlayerOwner(this.ownerWorldX, this.ownerWorldY, this.unit, this.characterUnit);
      this.setZoneCameraBounds(zone);
      const camera = this.cameras.main;
      camera.setScroll(camera.clampX(this.ownerWorldX - camera.width / 2), 0);
      this.events.emit("street-zone-changed", zone);
      return;
    }

    this.zoneTransitioning = true;
    cover.setSize(this.getLogicalWidth(), this.getLogicalHeight()).setVisible(true).setAlpha(0);
    this.tweens.add({
      targets: cover,
      alpha: 1,
      duration: ZONE_TRANSITION_FADE_MS,
      ease: "Sine.easeIn",
      onComplete: () => {
        this.activeZone = zone;
        this.ownerWorldY = this.clampOwnerWorldY(zone === "home" ? this.mapTop + this.mapHeight * 0.745 : this.ownerWorldY, zone);
        this.ownerWorldX = this.getZoneArrivalWorldX(zone, previousZone);
        this.setZoneCameraBounds(zone);
        const camera = this.cameras.main;
        camera.setScroll(camera.clampX(this.ownerWorldX - camera.width / 2), 0);
        this.layoutPlayerOwner(this.ownerWorldX, this.ownerWorldY, this.unit, this.characterUnit);
        this.events.emit("street-zone-changed", zone);
        this.tweens.add({
          targets: cover,
          alpha: 0,
          duration: ZONE_TRANSITION_FADE_MS,
          ease: "Sine.easeOut",
          onComplete: () => {
            cover.setVisible(false);
            this.zoneTransitioning = false;
            this.syncPlayerOwnerAnimation();
          },
        });
      },
    });
  }

  private getZoneArrivalWorldX(zone: MapZone, previousZone: MapZone): number {
    const edgeInset = 70 * this.unit;
    if (zone === "home") return -edgeInset;
    if (zone === "market") return this.mapWidth + edgeInset;
    return previousZone === "market" ? this.mapWidth - edgeInset : edgeInset;
  }

  private getHomeEntryWorldX(): number {
    const stage = HOME_STAGES[this.displayedHomeStage - 1] ?? HOME_STAGES[0];
    const sourceScale = this.mapHeight / HOME_MAP_SIZE.height;
    const centerX = -this.homeMapWidth + (stage.offsetX + stage.canvasWidth / 2) * sourceScale;
    return centerX + (stage.entryX - stage.canvasWidth / 2) * sourceScale * stage.displayScale;
  }

  private enterDoor(action: "enter-home" | "enter-market"): void {
    if (!this.mapInteractionEnabled || this.zoneTransitioning) return;
    this.movementVector = { x: 0, y: 0 };
    this.keyboardMovementVector = { x: 0, y: 0 };
    this.ownerMoving = false;
    this.syncPlayerOwnerAnimation();
    const eventName = action === "enter-home" ? "street-enter-home" : "street-enter-wholesale-market";
    this.events.emit(eventName);
  }

  private updatePlayerMovement(elapsed: number): void {
    let inputX = this.movementVector.x + this.keyboardMovementVector.x;
    let inputY = this.movementVector.y + this.keyboardMovementVector.y;
    const inputMagnitude = Math.hypot(inputX, inputY);
    if (inputMagnitude > 1) {
      inputX /= inputMagnitude;
      inputY /= inputMagnitude;
    }
    const moving = this.mapInteractionEnabled && inputMagnitude > 0.08 && !this.zoneTransitioning;
    if (!moving || !this.ownerCharacter || !this.ownerShadow) {
      if (this.ownerMoving) {
        this.ownerMoving = false;
        this.syncPlayerOwnerAnimation();
      }
      return;
    }

    const startedMoving = !this.ownerMoving;
    this.ownerMoving = true;
    const nextFacingDirection = Math.abs(inputX) > 0.18 ? (inputX < 0 ? -1 : 1) : this.ownerFacingDirection;
    const nextFacing8Direction = getOwnerDirectionFromVector(inputX, inputY, this.ownerFacing8Direction);
    const facingChanged = this.ownerGender === "male"
      ? nextFacing8Direction !== this.ownerFacing8Direction
      : nextFacingDirection !== this.ownerFacingDirection;
    this.ownerFacingDirection = nextFacingDirection;
    this.ownerFacing8Direction = nextFacing8Direction;
    if (startedMoving || facingChanged) {
      this.syncPlayerOwnerAnimation();
    }
    const distance = OWNER_WALK_SPEED * this.unit * elapsed;
    const nextX = this.ownerWorldX + inputX * distance;
    this.ownerWorldY = this.clampOwnerWorldY(this.ownerWorldY + inputY * distance);
    if (this.activeZone === "shop" && nextX <= 0) {
      this.ownerWorldX = 0;
      this.transitionToZone("home");
    } else if (this.activeZone === "shop" && nextX >= this.mapWidth) {
      this.ownerWorldX = this.mapWidth;
      this.transitionToZone("market");
    } else if (this.activeZone === "home" && nextX >= 0) {
      this.ownerWorldX = 0;
      this.transitionToZone("shop");
    } else if (this.activeZone === "market" && nextX <= this.mapWidth) {
      this.ownerWorldX = this.mapWidth;
      this.transitionToZone("shop");
    } else {
      const leftEdge = this.activeZone === "home"
        ? -this.homeMapWidth + 48 * this.unit
        : this.activeZone === "market" ? this.mapWidth : 0;
      const rightEdge = this.activeZone === "home"
        ? 0
        : this.activeZone === "market"
          ? this.mapWidth + this.marketMapWidth - 48 * this.unit
          : this.mapWidth;
      this.ownerWorldX = Phaser.Math.Clamp(nextX, leftEdge, rightEdge);
    }

    this.ownerCharacter.setPosition(this.ownerWorldX, this.ownerWorldY)
      .setDepth(getStreetCharacterDepth(this.ownerWorldY));
    this.ownerShadow.setPosition(this.ownerWorldX, this.ownerWorldY + 1.5 * this.unit)
      .setDepth(getStreetCharacterDepth(this.ownerWorldY) - 0.02);
    const camera = this.cameras.main;
    camera.setScroll(camera.clampX(this.ownerWorldX - camera.width / 2), camera.scrollY);
  }

  setShopStage(stageId: number): void {
    if (!Number.isFinite(stageId)) return;
    this.debugShopStage = Phaser.Math.Clamp(Math.round(stageId), 1, SHOP_STAGES.length);
    this.transitionHomeStage(this.debugShopStage);
    this.transitionShopStage(this.debugShopStage, true);
  }

  getShopStageForDebug(): number {
    return this.debugShopStage ?? (this.shopStage > 0 ? this.shopStage : this.store.getSnapshot().cartLevel);
  }

  stepShopStage(delta: number): void {
    // The HTML controls can be clicked before Phaser finishes its initial asset
    // load, so do not rely on create() having set shopDebugEnabled yet.
    const debugEnabled = import.meta.env.DEV && new URLSearchParams(window.location.search).get("debug") === "1";
    if (!debugEnabled || !Number.isFinite(delta)) return;
    this.setShopStage(this.getShopStageForDebug() + Math.sign(delta));
  }

  private transitionShopStage(stageId: number, animate: boolean): void {
    const nextStage = Phaser.Math.Clamp(Math.round(stageId), 1, SHOP_STAGES.length);
    if (nextStage === this.shopStage) {
      this.refreshShopStageArtwork();
      return;
    }

    this.shopStage = nextStage;
    if (!this.shopOverlay) return;
    this.preloadShopStageImages(nextStage);
    this.tweens.killTweensOf(this.shopOverlay);
    if (!animate || this.shopStage === 0) {
      this.shopOverlay.setAlpha(1);
      this.refreshShopStageArtwork();
      return;
    }

    const halfFade = SHOP_STAGE_FADE_MS / 2;
    this.tweens.add({
      targets: this.shopOverlay,
      alpha: 0,
      duration: halfFade,
      ease: "Sine.easeIn",
      onComplete: () => {
        this.refreshShopStageArtwork();
        this.tweens.add({ targets: this.shopOverlay, alpha: 1, duration: halfFade, ease: "Sine.easeOut" });
      },
    });
  }

  private refreshShopStageArtwork(): void {
    if (!this.shopOverlay || !this.shopStageTitle || !this.shopStageAsset || this.shopStage < 1) return;
    const stage = SHOP_STAGES[this.shopStage - 1];
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    this.shopStageTitle
      .setText(`CẤP ${String(stage.id).padStart(2, "0")} / ${SHOP_STAGES.length} · ${stage.name}`)
      .setResolution(dpr);
    this.shopStageAsset
      .setText(`Thiếu ảnh: ${SHOP_STAGE_ASSET_DIRECTORY}/${stage.filename}`)
      .setResolution(dpr);
    this.shopNameSignText
      .setText(formatStoreNameForDisplay(this.lastSnapshot?.storeName ?? "") || GAME_NAME_VI)
      .setResolution(dpr);

    const textureKey = getShopStageImageKey(stage.id);
    const hasArt = Boolean(stage.image && this.textures.exists(textureKey));
    if (hasArt) {
      const previousStage = this.displayedShopStage;
      const displayTextureKey = this.getShopArtworkDisplayTextureKey(stage.id, textureKey);
      if (!this.shopArtwork) {
        this.shopArtwork = this.add.image(0, 0, displayTextureKey).setOrigin(0).setDepth(0.36);
        this.shopOverlay.add(this.shopArtwork);
        this.shopArtworkTransition = this.add.image(0, 0, displayTextureKey).setOrigin(0).setDepth(0.37);
        this.shopArtworkOvercast = this.add.image(0, 0, displayTextureKey).setOrigin(0).setDepth(0.38);
        this.shopOverlay.add([this.shopArtworkTransition, this.shopArtworkOvercast]);
        this.shopOverlay.bringToTop(this.shopNameSignText);
      } else {
        this.shopArtwork.setTexture(displayTextureKey);
        this.shopArtworkTransition?.setTexture(displayTextureKey);
        this.shopArtworkOvercast?.setTexture(displayTextureKey);
      }
      this.displayedShopStage = stage.id;
      this.shopArtwork.setVisible(true);
      this.shopPlaceholder.setVisible(false);
      this.shopPlaceholderFrame.setVisible(false);
      this.shopStageTitle.setVisible(false);
      this.shopStageAsset.setVisible(false);
      this.shopNameSignText.setVisible(true);
      this.layoutShopArtwork();
      this.updateShopLighting();
      if (previousStage && previousStage !== stage.id) this.releaseShopArtworkTextures(previousStage);
      this.syncCookingSteamEmitters();
    } else {
      this.shopArtwork?.setVisible(false);
      this.shopArtworkTransition?.setVisible(false);
      this.shopArtworkOvercast?.setVisible(false);
      this.shopPlaceholder.setVisible(true);
      this.shopPlaceholderFrame.setVisible(true);
      this.shopStageTitle.setVisible(true);
      this.shopStageAsset.setVisible(true);
      this.shopNameSignText.setVisible(false);
    }
  }

  private getShopArtworkDisplayTextureKey(stageId: number, sourceTextureKey: string): string {
    const displayTextureKey = `shop-stage-overlay-${String(stageId).padStart(2, "0")}-map-roof`;
    if (this.textures.exists(displayTextureKey)) return displayTextureKey;

    const source = this.textures.get(sourceTextureKey).getSourceImage() as CanvasImageSource & { width: number; height: number };
    const texture = this.textures.createCanvas(displayTextureKey, source.width, source.height);
    if (!texture) return sourceTextureKey;

    const context = texture.context;
    context.clearRect(0, 0, source.width, source.height);
    // The painted interiors read too shadowy at phone size. Lift the artwork
    // slightly and add a restrained amber fill so every time-of-day variant
    // keeps a welcoming, lantern-lit feel without flattening the highlights.
    context.filter = "brightness(1.08)";
    context.drawImage(source, 0, 0);
    context.filter = "none";
    context.globalCompositeOperation = "source-atop";
    context.fillStyle = "rgba(255, 184, 104, 0.045)";
    context.fillRect(0, 0, source.width, source.height);
    context.globalCompositeOperation = "source-over";
    // The four-shop map has an empty lot, so every upgrade supplies its own
    // roof and upper facade as well as its storefront.
    texture.refresh();
    return displayTextureKey;
  }

  private getShopArtworkWarmthMap(textureKey: string, pixels: Uint8ClampedArray, width: number, height: number): Float32Array {
    const cached = this.shopArtworkWarmthCache.get(textureKey);
    if (cached) return cached;

    const warmth = new Float32Array(width * height);
    for (let index = 0; index < warmth.length; index += 1) {
      const offset = index * 4;
      if (pixels[offset + 3] === 0) continue;
      const red = pixels[offset];
      const green = pixels[offset + 1];
      const blue = pixels[offset + 2];
      const orange = Phaser.Math.Clamp((red - green - 35) / 85, 0, 1)
        * Phaser.Math.Clamp((green - blue - 20) / 65, 0, 1)
        * Phaser.Math.Clamp((green - 45) / 70, 0, 1);
      warmth[index] = orange * pixels[offset + 3] / 255;
    }

    // Spread the glow from lamps and food onto nearby walls and furniture.
    // A separable box blur is linear in the number of pixels and runs only
    // when a new stage texture is prepared, never during animation frames.
    const radius = 26;
    const horizontal = new Float32Array(warmth.length);
    const glow = new Float32Array(warmth.length);
    for (let y = 0; y < height; y += 1) {
      const row = y * width;
      let sum = 0;
      for (let x = 0; x <= Math.min(radius, width - 1); x += 1) sum += warmth[row + x];
      for (let x = 0; x < width; x += 1) {
        if (x > 0) {
          if (x - radius - 1 >= 0) sum -= warmth[row + x - radius - 1];
          if (x + radius < width) sum += warmth[row + x + radius];
        }
        horizontal[row + x] = sum / (Math.min(width - 1, x + radius) - Math.max(0, x - radius) + 1);
      }
    }
    for (let x = 0; x < width; x += 1) {
      let sum = 0;
      for (let y = 0; y <= Math.min(radius, height - 1); y += 1) sum += horizontal[y * width + x];
      for (let y = 0; y < height; y += 1) {
        if (y > 0) {
          if (y - radius - 1 >= 0) sum -= horizontal[(y - radius - 1) * width + x];
          if (y + radius < height) sum += horizontal[(y + radius) * width + x];
        }
        glow[y * width + x] = Phaser.Math.Clamp(warmth[y * width + x] * 0.35 + sum / (Math.min(height - 1, y + radius) - Math.max(0, y - radius) + 1) * 5, 0, 1);
      }
    }
    this.shopArtworkWarmthCache.set(textureKey, glow);
    return glow;
  }

  private getShopArtworkMoodTextureKey(stageId: number, sourceTextureKey: string, mood: StreetMapMood): string {
    const dayTextureKey = this.getShopArtworkDisplayTextureKey(stageId, sourceTextureKey);
    if (mood === "day") return dayTextureKey;
    const textureKey = `${dayTextureKey}-${mood}`;
    if (this.textures.exists(textureKey)) return textureKey;

    const source = this.textures.get(dayTextureKey).getSourceImage() as CanvasImageSource & { width: number; height: number };
    const texture = this.textures.createCanvas(textureKey, source.width, source.height);
    if (!texture) return dayTextureKey;
    const context = texture.context;
    context.drawImage(source, 0, 0);
    const image = context.getImageData(0, 0, source.width, source.height);
    const pixels = image.data;
    const glow = this.getShopArtworkWarmthMap(dayTextureKey, pixels, source.width, source.height);
    const { ambient, lit } = SHOP_LIGHTING_GAINS[mood];
    for (let index = 0; index < glow.length; index += 1) {
      const offset = index * 4;
      if (pixels[offset + 3] === 0) continue;
      const red = pixels[offset];
      const green = pixels[offset + 1];
      const blue = pixels[offset + 2];
      // Teal shutters, awnings, and green plants receive the map's cool
      // outdoor light even when a warm lamp is nearby.
      const coolSurface = green > red * 1.12 && blue > red * 0.78;
      const lampLight = glow[index] * (coolSurface ? 0.08 : 1);
      pixels[offset] = Math.min(255, red * (ambient[0] + (lit[0] - ambient[0]) * lampLight));
      pixels[offset + 1] = Math.min(255, green * (ambient[1] + (lit[1] - ambient[1]) * lampLight));
      pixels[offset + 2] = Math.min(255, blue * (ambient[2] + (lit[2] - ambient[2]) * lampLight));
    }
    context.putImageData(image, 0, 0);
    texture.refresh();
    return textureKey;
  }

  private releaseShopArtworkTextures(stageId: number): void {
    const dayKey = `shop-stage-overlay-${String(stageId).padStart(2, "0")}-map-roof`;
    this.shopArtworkWarmthCache.delete(dayKey);
    for (const textureKey of [dayKey, ...(["dawn", "sunset", "night", "rain"] as const).map((mood) => `${dayKey}-${mood}`)]) {
      this.shopArtworkAlphaBoundsCache.delete(textureKey);
      if (this.textures.exists(textureKey)) this.textures.remove(textureKey);
    }
  }

  private updateShopLighting(): void {
    if (!this.shopArtwork || !this.shopArtworkTransition || !this.shopArtworkOvercast || this.shopStage < 1) return;
    if (this.displayedShopStage !== this.shopStage) return;
    const sourceTextureKey = getShopStageImageKey(this.shopStage);
    if (!this.textures.exists(sourceTextureKey)) return;
    const { from, to, blend, overcast } = this.shopLightingState;
    const fromKey = this.getShopArtworkMoodTextureKey(this.shopStage, sourceTextureKey, from);
    if (this.shopArtwork.texture.key !== fromKey) this.shopArtwork.setTexture(fromKey);
    if (blend > 0.001) {
      const toKey = this.getShopArtworkMoodTextureKey(this.shopStage, sourceTextureKey, to);
      if (this.shopArtworkTransition.texture.key !== toKey) this.shopArtworkTransition.setTexture(toKey);
      this.shopArtworkTransition.setAlpha(blend).setVisible(true);
    } else {
      this.shopArtworkTransition.setVisible(false);
    }
    if (overcast > 0.001) {
      const overcastKey = this.getShopArtworkMoodTextureKey(this.shopStage, sourceTextureKey, "rain");
      if (this.shopArtworkOvercast.texture.key !== overcastKey) this.shopArtworkOvercast.setTexture(overcastKey);
      this.shopArtworkOvercast.setAlpha(overcast).setVisible(true);
    } else {
      this.shopArtworkOvercast.setVisible(false);
    }
  }

  private getShopArtworkAlphaBounds(textureKey: string): ShopArtworkAlphaBounds {
    const cached = this.shopArtworkAlphaBoundsCache.get(textureKey);
    if (cached) return cached;

    const source = this.textures.get(textureKey).getSourceImage() as CanvasImageSource & { width: number; height: number };
    let bounds: ShopArtworkAlphaBounds = { left: 0, top: 0, right: source.width, bottom: source.height };
    try {
      const canvas = document.createElement("canvas");
      canvas.width = source.width;
      canvas.height = source.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (context) {
        context.drawImage(source, 0, 0);
        const pixels = context.getImageData(0, 0, source.width, source.height).data;
        let left = source.width;
        let top = source.height;
        let right = 0;
        let bottom = 0;
        for (let y = 0; y < source.height; y += 1) {
          for (let x = 0; x < source.width; x += 1) {
            // Generated sprites can contain nearly invisible stray pixels far
            // outside the facade. Anchor to the visible paint, not that fringe.
            if (pixels[(y * source.width + x) * 4 + 3] < 128) continue;
            if (x < left) left = x;
            if (x + 1 > right) right = x + 1;
            if (y < top) top = y;
            if (y + 1 > bottom) bottom = y + 1;
          }
        }
        if (left < right && top < bottom) bounds = { left, top, right, bottom };
      }
    } catch {
      // If the browser cannot inspect a texture's alpha channel, keep its full canvas.
    }
    this.shopArtworkAlphaBoundsCache.set(textureKey, bounds);
    return bounds;
  }

  private layoutShopArtwork(): void {
    if (!this.shopArtwork) return;
    const textureKey = this.shopArtwork.texture.key;
    const source = this.textures.get(textureKey).getSourceImage() as CanvasImageSource & { width: number; height: number };
    const bounds = this.getShopArtworkAlphaBounds(textureKey);
    // Fit the physical lot width at every level. The first small shops keep
    // their proportions; their low rear fence spans the rest of the plot.
    // Later facades grow upward toward the neighboring roofline while their
    // feet all meet the same sidewalk edge.
    const stageHeights = [0, 0, 0, 0, 510, 560, 610, 685, 685, 685, 685, 685, 685, 685];
    const stage = this.displayedShopStage;
    const scaleX = SHOP_OVERLAY_BOX.w / Math.max(1, bounds.right - bounds.left);
    const naturalHeight = (bounds.bottom - bounds.top) * scaleX;
    const targetHeight = stage <= 3 ? naturalHeight : stageHeights[stage] || SHOP_OVERLAY_BOX.h;
    // Levels 10–12 were redrawn for this near-square lot. Keep their original
    // proportions so the upper floors and doors do not look pinched.
    const scaleY = stage >= 10 && stage <= 12
      ? scaleX
      : Math.min(SHOP_OVERLAY_BOX.h, targetHeight) / Math.max(1, bounds.bottom - bounds.top);
    const offsetX = (SHOP_OVERLAY_BOX.w - (bounds.right - bounds.left) * scaleX) / 2 - bounds.left * scaleX;
    const offsetY = SHOP_OVERLAY_BOX.h - (bounds.bottom - bounds.top) * scaleY - bounds.top * scaleY;
    this.shopArtworkTransform = { offsetX, offsetY, scaleX, scaleY };
    for (const artwork of [this.shopArtwork, this.shopArtworkTransition, this.shopArtworkOvercast]) {
      artwork?.setPosition(offsetX * this.shopOverlayScale, offsetY * this.shopOverlayScale)
        .setDisplaySize(
          source.width * scaleX * this.shopOverlayScale,
          source.height * scaleY * this.shopOverlayScale,
        );
    }
    this.layoutShopSignName(source.width);
  }

  private layoutShopSignName(sourceWidth: number): void {
    const stage = SHOP_STAGES[this.displayedShopStage - 1];
    const artwork = this.shopArtwork;
    if (!stage || !artwork || !this.shopNameSignText) return;

    const signWidth = stage.sign.width * sourceWidth * this.shopArtworkTransform.scaleX * this.shopOverlayScale;
    const signX = artwork.x + stage.sign.x * sourceWidth * this.shopArtworkTransform.scaleX * this.shopOverlayScale;
    const signY = artwork.y + stage.sign.y * artwork.displayHeight;
    const maxWidth = signWidth * 0.92;
    const fontSize = Math.max(6, Math.min(28 * this.shopOverlayScale, signWidth * 0.14));

    this.shopNameSignText
      .setText(formatStoreNameForDisplay(this.lastSnapshot?.storeName ?? "") || GAME_NAME_VI)
      .setPosition(signX, signY)
      .setFontSize(fontSize)
      .setResolution(Math.max(1, window.devicePixelRatio || 1));

    if (this.shopNameSignText.width > maxWidth) {
      this.shopNameSignText
        .setFontSize(Math.max(5, fontSize * maxWidth / this.shopNameSignText.width))
        .setResolution(Math.max(1, window.devicePixelRatio || 1));
    }
  }

  update(_time: number, delta: number): void {
    const width = this.mapWidth || this.getLogicalWidth();
    const elapsed = Math.min(delta / 1_000, 0.05);
    this.environmentElapsedMs += Math.max(0, delta);
    this.updatePlayerMovement(elapsed);
    this.updateMapTransitionSigns();
    this.updateShopEntranceAvailability();
    this.updateLivingEnvironment(_time, elapsed, width);
    this.updateTrafficBikes(delta);
    this.syncOutdoorDiningGuests(this.lastSnapshot);

    for (const [index, walker] of this.walkers.entries()) {
      if (!walker.active) continue;
      const isPet = walker.textureKey === "walk-street-cat";
      const zoneBounds = this.getWalkerZoneBounds(walker.zone);
      const laneY = this.getWalkerLaneY(walker.lane, walker.zone) + Math.sin(index * 1.9) * 2 * this.unit;
      if (isPet) {
        if (walker.petMode === "paused" && _time >= (walker.petPauseUntil ?? 0)) {
          this.resumePet(walker, _time, index);
        }
        if (walker.petMode === "walking" && _time >= (walker.petNextPauseAt ?? Number.POSITIVE_INFINITY)) {
          this.startPetPause(walker, _time);
        }
        if (walker.petMode === "paused") {
          if (!walker.enabled) {
            walker.active = false;
            walker.sprite.setVisible(false);
            walker.shadow.setVisible(false);
            continue;
          }
          walker.sprite.y = laneY;
          walker.sprite.setDepth(getStreetCharacterDepth(walker.sprite.y));
          walker.shadow.setPosition(walker.sprite.x, laneY + 1.5 * this.unit)
            .setDepth(getStreetCharacterDepth(laneY) - 0.02);
          continue;
        }
      }
      walker.sprite.x += walker.direction * walker.speed * elapsed;
      // Keep each walker on one of two sidewalk lanes; the walk frames provide
      // the leg motion, so an extra high-frequency bob only makes sprites jitter.
      walker.sprite.y = laneY;
      walker.sprite.setDepth(getStreetCharacterDepth(walker.sprite.y));
      walker.positionRatio = (walker.sprite.x - zoneBounds.left) / zoneBounds.width;
      // Recycle at the assigned map edges, not the camera edges. This keeps
      // each area's pedestrian flow local when the player changes zones.
      const mapMargin = 60 * this.unit;
      const leftMapEdge = walker.direction < 0 && walker.sprite.x < zoneBounds.left - mapMargin;
      const rightMapEdge = walker.direction > 0 && walker.sprite.x > zoneBounds.left + zoneBounds.width + mapMargin;
      if (leftMapEdge || rightMapEdge) {
        walker.active = false;
        walker.sprite.setVisible(false);
        walker.shadow.setVisible(false);
        if (walker.enabled && !this.walkerSpawnQueue.includes(index)) this.walkerSpawnQueue.push(index);
        this.ambientWalkerSpawnCooldownMs = Math.max(
          this.ambientWalkerSpawnCooldownMs,
          1_200 + ((index * 337) % 700),
        );
        continue;
      }
      walker.shadow.setPosition(walker.sprite.x, laneY + 1.5 * this.unit)
        .setDepth(getStreetCharacterDepth(laneY) - 0.02);
    }

    this.updateStreetWalkerDialogue(delta);
    this.updateStreetDiners(delta);
    this.updateGroceryShoppers(delta);

    this.ambientWalkerSpawnCooldownMs = Math.max(0, this.ambientWalkerSpawnCooldownMs - delta);
    const activeWalkerCount = this.walkers.reduce((count, walker) => count + Number(walker.active), 0);
    if (
      this.ambientWalkerSpawnCooldownMs <= 0 &&
      this.walkerSpawnQueue.length > 0 &&
      activeWalkerCount < MAX_ACTIVE_AMBIENT_WALKERS
    ) {
      const walkerIndex = this.walkerSpawnQueue.shift()!;
      const walker = this.walkers[walkerIndex];
      if (walker) {
        const zoneBounds = this.getWalkerZoneBounds(walker.zone);
        const spawnX = walker.direction > 0
          ? zoneBounds.left - 60 * this.unit
          : zoneBounds.left + zoneBounds.width + 60 * this.unit;
        const animation = `${walker.textureKey}-${walker.direction > 0 ? "right" : "left"}`;
        walker.active = true;
        walker.positionRatio = (spawnX - zoneBounds.left) / zoneBounds.width;
        if (walker.petMode) {
          walker.petMode = "walking";
          walker.petNextPauseAt = _time + 5_500 + (walkerIndex % 2) * 4_000;
          walker.petPauseUntil = undefined;
        }
        const laneY = this.getWalkerLaneY(walker.lane, walker.zone);
        walker.sprite.setPosition(spawnX, laneY)
          .setAlpha(0.96 + (walkerIndex % 3) * 0.02)
          .setDepth(getStreetCharacterDepth(laneY))
          .setVisible(true)
          .play(animation);
        walker.shadow.setPosition(spawnX, laneY + 1.5 * this.unit)
          .setDepth(getStreetCharacterDepth(laneY) - 0.02)
          .setVisible(true);
        this.ambientWalkerSpawnCooldownMs = this.streetCrowdState.level === "busy"
          ? 700 + ((walkerIndex * 197) % 350)
          : this.streetCrowdState.level === "quiet"
            ? 1_500 + ((walkerIndex * 197) % 500)
            : 1_000 + ((walkerIndex * 197) % 450);
      }
    }

    for (const [id, container] of this.crowd) {
      const motion = this.crowdMotion.get(id);
      const customer = this.lastSnapshot.customers.find((entry) => entry.id === id);
      const sprite = container.getAt(1) as Phaser.GameObjects.Sprite;
      if (!motion || !customer) continue;
      const appearance = this.getCustomerAppearance(customer.type, customer.id);

      if (motion.moving) {
        if (motion.needsWalkingState) {
          motion.needsWalkingState = false;
          this.store.markCustomerWalking(id);
        }
        const distance = motion.targetX - container.x;
        const direction: -1 | 1 = distance >= 0 ? 1 : -1;
        motion.direction = direction;
        const walkTexture = appearance.walkKey;
        const animationKey = `${walkTexture}-${direction > 0 ? "right" : "left"}`;
        if (sprite.texture.key !== walkTexture || sprite.anims.currentAnim?.key !== animationKey) {
          sprite.setOrigin(0.5, getWalkerOriginY(walkTexture));
          const visualScale = getCharacterScaleFactor(
            getWalkerArtHeight(walkTexture),
            getWalkerFrameHeight(walkTexture),
            CUSTOMER_DISPLAY_HEIGHT,
          );
          sprite.setScale(
            (CUSTOMER_DISPLAY_WIDTH * this.characterUnit / CUSTOMER_FRAME_WIDTH) * visualScale,
            (CUSTOMER_DISPLAY_HEIGHT * this.characterUnit / getWalkerFrameHeight(walkTexture)) * visualScale,
          );
          sprite.y = 0;
          sprite.setTexture(walkTexture, getWalkerStartFrame(walkTexture, direction));
          sprite.play(animationKey);
        }
        if (Math.abs(distance) <= motion.speed * elapsed) {
          container.x = motion.targetX;
          motion.moving = false;
          this.store.markCustomerArrived(id);
        } else {
          container.x += direction * motion.speed * elapsed;
        }
      } else {
        sprite.y = 0;
        const idleTexture = appearance.key;
        const idleAnimation = appearance.idleAnimation;
        if (sprite.texture.key !== idleTexture || (idleAnimation && sprite.anims.currentAnim?.key !== idleAnimation)) {
          sprite.anims.stop();
          sprite.setOrigin(0.5, 1);
          sprite.setTexture(idleTexture, 0);
          if (idleAnimation) sprite.play(idleAnimation);
        }
        if (!idleAnimation) {
          const breath = (Math.sin(_time / 320 + motion.idlePhase) + 1) / 2;
          const visualScale = getCharacterScaleFactor(
            CUSTOMER_ART_HEIGHTS[appearance.key] ?? 350,
            CUSTOMER_FRAME_HEIGHT,
            CUSTOMER_DISPLAY_HEIGHT,
          );
          const baseScaleX = (CUSTOMER_DISPLAY_WIDTH * this.characterUnit / CUSTOMER_FRAME_WIDTH) * visualScale;
          const baseScaleY = (CUSTOMER_DISPLAY_HEIGHT * this.characterUnit / CUSTOMER_FRAME_HEIGHT) * visualScale;
          // Anchor the subtle breathing scale at the soles so the contact shadow stays grounded.
          sprite.setScale(baseScaleX, baseScaleY * (1 + breath * 0.014));
        }
      }
    }

    this.updateCookingSteam(delta);
  }

  private startPetPause(walker: Walker, now: number): void {
    const cycle = walker.petPauseCycle ?? 0;
    walker.petPauseCycle = cycle + 1;
    walker.petMode = "paused";

    const playThenLoop = (transition: string, loop: string) => {
      const listener = () => {
        walker.petAnimationComplete = undefined;
        if (walker.active && walker.petMode === "paused") walker.sprite.play(loop);
      };
      walker.petAnimationComplete = listener;
      walker.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, listener);
      walker.sprite.play(transition);
    };

    const actions = ["sit", "groom", "nap", "groom"] as const;
    const action = actions[cycle % actions.length];
    walker.petPauseUntil = now + (action === "nap" ? 14_000 : action === "groom" ? 8_000 : 8_000);
    if (action === "nap") playThenLoop("walk-street-cat-settle", "walk-street-cat-sleep");
    else walker.sprite.play(`walk-street-cat-${action}`);
  }

  private resumePet(walker: Walker, now: number, index: number): void {
    if (walker.petAnimationComplete) {
      walker.sprite.off(Phaser.Animations.Events.ANIMATION_COMPLETE, walker.petAnimationComplete);
      walker.petAnimationComplete = undefined;
    }
    walker.petMode = "walking";
    walker.petPauseUntil = undefined;
    walker.petNextPauseAt = now + 9_000 + ((index + (walker.petPauseCycle ?? 0)) % 4) * 2_000;
    walker.sprite.play(`${walker.textureKey}-${walker.direction > 0 ? "right" : "left"}`);
  }

  private createAmbientWalkers(startIndex: number, endIndex: number, zone: AmbientWalkerZone = "shop"): void {
    const zoneBounds = this.getWalkerZoneBounds(zone);
    const zoneCount = zone === "home"
      ? HOME_AMBIENT_WALKER_COUNT
      : zone === "market" ? MARKET_AMBIENT_WALKER_COUNT : WALKER_TEXTURES.length;
    const directions = [1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1, 1, -1, 1, -1] as const;
    for (let index = startIndex; index < endIndex; index += 1) {
      const textureKey = WALKER_TEXTURES[index];
      if (!this.textures.exists(textureKey) || !this.anims.exists(`${textureKey}-left`)) continue;
      const direction = textureKey === "walk-street-cat" ? 1 : directions[index % directions.length];
      const zoneWalkerIndex = this.walkers.filter((walker) => walker.zone === zone).length;
      const lane = (zoneWalkerIndex % 4) as WalkerLaneIndex;
      const laneY = this.getWalkerLaneY(lane, zone);
      const isPet = textureKey === "walk-street-cat";
      const size = isPet
        ? (0.88 + ((index * 3) % 5) * 0.07) * 0.92
        : getCharacterScaleFactor(
          getWalkerArtHeight(textureKey),
          getWalkerFrameHeight(textureKey),
          96,
        );
      const footprint = WALKER_FOOTPRINTS[textureKey] ?? { width: 60, height: 96, shadowWidth: 42, shadowHeight: 12 };
      const positionRatio = textureKey === "walk-street-cat"
        ? 0.43
        : (zoneWalkerIndex + 0.5) / zoneCount;
      const x = zoneBounds.left + positionRatio * zoneBounds.width;
      const animationKey = `${textureKey}-${direction > 0 ? "right" : "left"}`;
      const active = this.walkers.reduce((count, walker) => count + Number(walker.active), 0) < MAX_ACTIVE_AMBIENT_WALKERS;
      const shadow = this.add.image(x, laneY + 1.5 * this.unit, "character-contact-shadow-soft")
        .setOrigin(0.5)
        .setDepth(getStreetCharacterDepth(laneY) - 0.02)
        .setAlpha(isPet ? 0.48 : 0.8)
        .setVisible(active);
      const sprite = this.add.sprite(x, laneY, textureKey, getWalkerStartFrame(textureKey, direction))
        .setOrigin(0.5, getWalkerOriginY(textureKey))
        .setDepth(getStreetCharacterDepth(laneY))
        .setAlpha(0.96 + (index % 3) * 0.02)
        .setVisible(active);
      const speechBubble = isPet ? undefined : this.createGrocerySpeechBubble("").setVisible(false);
      if (active) sprite.play(animationKey).anims.setProgress((index * 0.173) % 1);
      else if (!this.walkerSpawnQueue.includes(this.walkers.length)) this.walkerSpawnQueue.push(this.walkers.length);
      this.walkers.push({
        textureKey,
        zone,
        shadow,
        sprite,
        speechBubble,
        active,
        enabled: true,
        direction,
        lane,
        speed: getAmbientWalkerSpeed(index, textureKey, this.unit),
        size,
        ...footprint,
        positionRatio,
        petMode: isPet ? "walking" : undefined,
        petNextPauseAt: isPet ? this.time.now + 4_000 + (index % 2) * 4_500 : undefined,
        petPauseCycle: isPet ? index % 4 : undefined,
      });
    }
  }

  private getWalkerZoneBounds(zone: AmbientWalkerZone): { left: number; width: number } {
    const left = zone === "home" ? -this.homeMapWidth : zone === "market" ? this.mapWidth : 0;
    const width = zone === "home" ? this.homeMapWidth : zone === "market" ? this.marketMapWidth : this.mapWidth;
    if (width > 0) return { left, width };

    const fallbackWidth = Math.max(1, this.getLogicalWidth());
    return {
      left: zone === "home" ? -fallbackWidth : zone === "market" ? fallbackWidth : 0,
      width: fallbackWidth,
    };
  }

  private getWalkerLaneY(lane: WalkerLaneIndex, zone: AmbientWalkerZone = "shop"): number {
    const ratios = zone === "home" ? HOME_WALKER_LANE_RATIOS : WALKER_LANE_RATIOS;
    return this.mapTop + this.mapHeight * ratios[lane];
  }

  private createCharacterShadowTexture(): void {
    const textureKey = "character-contact-shadow-soft";
    if (this.textures.exists(textureKey)) return;
    const texture = this.textures.createCanvas(textureKey, 96, 28);
    if (!texture) return;

    const { context } = texture;
    context.clearRect(0, 0, 96, 28);
    context.save();
    context.translate(48, 14);
    context.scale(1, 0.22);
    const gradient = context.createRadialGradient(0, 0, 2, 0, 0, 44);
    gradient.addColorStop(0, "rgba(30, 23, 18, 0.48)");
    gradient.addColorStop(0.42, "rgba(30, 23, 18, 0.30)");
    gradient.addColorStop(0.76, "rgba(30, 23, 18, 0.10)");
    gradient.addColorStop(1, "rgba(33, 25, 18, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, 44, 0, Math.PI * 2);
    context.fill();
    context.restore();
    texture.refresh();
  }

  private createCookingSteamTexture(): void {
    const textureKey = "cooking-steam-soft";
    if (this.textures.exists(textureKey)) return;
    const width = 30;
    const height = 54;
    const texture = this.textures.createCanvas(textureKey, width, height);
    if (!texture) return;

    const { context } = texture;
    context.clearRect(0, 0, width, height);
    // Thin, uneven vapor threads read as rising heat from cookware. Avoid a
    // blurred, solid plume: that looked detached from the pots and food.
    const vapor = context.createLinearGradient(0, height, 0, 0);
    vapor.addColorStop(0, "rgba(246, 238, 218, 0.03)");
    vapor.addColorStop(0.18, "rgba(246, 238, 218, 0.27)");
    vapor.addColorStop(0.56, "rgba(237, 235, 225, 0.20)");
    vapor.addColorStop(0.86, "rgba(237, 235, 225, 0.08)");
    vapor.addColorStop(1, "rgba(237, 235, 225, 0)");
    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = vapor;
    context.lineWidth = 2.7;
    context.beginPath();
    context.moveTo(12, 52);
    context.bezierCurveTo(8, 46, 16, 40, 12, 34);
    context.bezierCurveTo(9, 29, 16, 25, 14, 19);
    context.bezierCurveTo(12, 14, 18, 10, 17, 4);
    context.stroke();

    context.globalAlpha = 0.72;
    context.lineWidth = 1.9;
    context.beginPath();
    context.moveTo(18, 53);
    context.bezierCurveTo(23, 47, 16, 42, 20, 36);
    context.bezierCurveTo(24, 30, 17, 25, 21, 20);
    context.bezierCurveTo(24, 15, 21, 10, 24, 6);
    context.stroke();

    context.globalAlpha = 0.48;
    context.lineWidth = 1.4;
    context.beginPath();
    context.moveTo(7, 51);
    context.bezierCurveTo(4, 47, 9, 44, 7, 40);
    context.bezierCurveTo(5, 36, 9, 33, 8, 29);
    context.stroke();
    context.restore();
    texture.refresh();
  }

  private registerEnvironmentFrames(): void {
    const weatherTexture = this.textures.get("weather-effects");
    const dayNightTexture = this.textures.get("day-night-effects");
    const addFrames = (
      texture: Phaser.Textures.Texture,
      prefix: string,
      frames: readonly (readonly [number, number, number, number])[],
    ) => frames.forEach(([x, y, width, height], index) => {
      texture.add(`${prefix}-${index}`, 0, x, y, width, height);
    });

    addFrames(weatherTexture, "sky-cloud", WEATHER_FRAMES.clouds);
    addFrames(weatherTexture, "rain-streak", WEATHER_FRAMES.rain);
    addFrames(weatherTexture, "rain-splash", WEATHER_FRAMES.splashes);
    addFrames(weatherTexture, "rain-ripple", WEATHER_FRAMES.ripples);
    addFrames(weatherTexture, "cloud-shadow", WEATHER_FRAMES.shadows);
    addFrames(dayNightTexture, "sun-disc", [DAY_NIGHT_FRAMES.sun]);
    addFrames(dayNightTexture, "sunset-disc", [DAY_NIGHT_FRAMES.sunset]);
    addFrames(dayNightTexture, "moon-crescent", [DAY_NIGHT_FRAMES.moon]);
    addFrames(dayNightTexture, "night-star", DAY_NIGHT_FRAMES.stars);
    addFrames(dayNightTexture, "warm-window-glow", DAY_NIGHT_FRAMES.warmGlows);
  }

  private createEnvironmentWindEffect(): void {
    if (this.game.renderer.type !== Phaser.WEBGL) return;

    const texture = this.textures.createCanvas(ENVIRONMENT_WIND_TEXTURE, WIND_MAP_WIDTH, WIND_MAP_HEIGHT);
    if (!texture) return;
    const imageData = texture.context.createImageData(WIND_MAP_WIDTH, WIND_MAP_HEIGHT);
    for (let offset = 0; offset < imageData.data.length; offset += 4) {
      imageData.data[offset] = 128;
      imageData.data[offset + 1] = 128;
      imageData.data[offset + 2] = 0;
      imageData.data[offset + 3] = 255;
    }
    texture.context.putImageData(imageData, 0, 0);
    texture.refresh();

    const source = this.textures.get(STREET_MAP_TEXTURES.day).getSourceImage() as CanvasImageSource;
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = WIND_MAP_WIDTH;
    maskCanvas.height = WIND_MAP_HEIGHT;
    const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
    if (!maskContext) return;
    maskContext.drawImage(source, 0, 0, WIND_MAP_WIDTH, WIND_MAP_HEIGHT);
    const sourcePixels = maskContext.getImageData(0, 0, WIND_MAP_WIDTH, WIND_MAP_HEIGHT).data;
    const samples: EnvironmentWindPixel[] = [];

    for (let y = 0; y < WIND_MAP_HEIGHT; y += 1) {
      const normalizedY = (y + 0.5) / WIND_MAP_HEIGHT;
      for (let x = 0; x < WIND_MAP_WIDTH; x += 1) {
        const normalizedX = (x + 0.5) / WIND_MAP_WIDTH;
        if (!isInsidePolygon(normalizedX, normalizedY, FLAG_WIND_REGION)) continue;
        const offset = (y * WIND_MAP_WIDTH + x) * 4;
        const red = sourcePixels[offset];
        const green = sourcePixels[offset + 1];
        const blue = sourcePixels[offset + 2];
        const [hue, saturation] = getHueAndSaturation(red, green, blue);
        const flagCloth = (hue < 14 || hue > 346) && saturation > 0.35 && red > 90;
        const flagStar = hue >= 36 && hue <= 68 && saturation > 0.38 && red > 130;
        if (!flagCloth && !flagStar) continue;
        const freeEdge = Phaser.Math.Clamp((normalizedX - 0.916) / 0.039, 0, 1);
        samples.push({
          offset,
          x: normalizedX,
          phase: normalizedY * 15 - normalizedX * 8,
          weight: freeEdge * freeEdge,
        });
      }
    }

    this.environmentWindTexture = texture;
    this.environmentWindImage = imageData;
    this.environmentWindPixels = samples;
    for (const background of [this.street, this.streetTransition, this.streetOvercast]) {
      background.enableFilters();
      const filter = background.filters?.internal.addDisplacement(ENVIRONMENT_WIND_TEXTURE, 0.004, 0.0025);
      if (filter) this.environmentWindFilters.push(filter);
    }
  }

  private createCanopyDepthLayers(): void {
    this.canopyLayers = TREE_CANOPY_LAYERS.map((anchor) => this.add.image(0, 0, TREE_CANOPY_LAYER_TEXTURE)
      .setDepth(-1.02)
      .setOrigin(anchor.side === "left" ? 0.04 : 0.96, 0.72)
      .setFlipX(anchor.side === "right")
      .setAlpha(0.82));
    this.canopySunlightLayers = TREE_CANOPY_LAYERS.map((anchor) => this.add.image(0, 0, TREE_CANOPY_LAYER_TEXTURE)
      .setDepth(-1.01)
      .setOrigin(anchor.side === "left" ? 0.04 : 0.96, 0.72)
      .setFlipX(anchor.side === "right")
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(0xffe6a6)
      .setAlpha(0));
  }

  private updateEnvironmentWind(time: number, wind: number, elapsed: number): void {
    const imageData = this.environmentWindImage;
    const texture = this.environmentWindTexture;
    for (const filter of this.environmentWindFilters) {
      filter.x = 0.0038 + wind * 0.0052;
      filter.y = 0.0018 + wind * 0.0022;
    }
    if (!imageData || !texture) return;

    this.environmentWindUploadElapsedMs += elapsed * 1_000;
    if (this.environmentWindUploadElapsedMs < 33) return;
    this.environmentWindUploadElapsedMs %= 33;

    const pixels = imageData.data;
    for (const sample of this.environmentWindPixels) {
      const phase = time * 0.0031 + sample.phase;
      const amplitude = 0.62 + wind * 0.5;
      const horizontal = Math.sin(phase) * sample.weight * amplitude;
      const vertical = Math.cos(phase * 0.83 + sample.x * 5) * sample.weight * amplitude * 0.16;
      pixels[sample.offset] = 128 + Math.round(horizontal * 127);
      pixels[sample.offset + 1] = 128 + Math.round(vertical * 127);
    }
    texture.context.putImageData(imageData, 0, 0);
    texture.refresh();
  }

  private createLivingEnvironment(): void {
    const weatherTexture = "weather-effects";
    const dayNightTexture = "day-night-effects";
    if (!this.anims.exists("pigeon-walk")) {
      this.anims.create({ key: "pigeon-walk", frames: this.anims.generateFrameNumbers("pigeon-walking", { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: "pigeon-eat", frames: this.anims.generateFrameNumbers("pigeon-eating", { start: 0, end: 3 }), frameRate: 5, repeat: -1 });
      this.anims.create({ key: "pigeon-fly", frames: this.anims.generateFrameNumbers("pigeon-flying", { start: 0, end: 6 }), frameRate: 8, repeat: -1 });
    }
    this.sun = this.add.sprite(0, 0, dayNightTexture, "sun-disc-0")
      .setDepth(-0.92).setOrigin(0.5).setScrollFactor(1).setAlpha(0);
    this.moon = this.add.sprite(0, 0, dayNightTexture, "moon-crescent-0")
      .setDepth(-0.91).setOrigin(0.5).setScrollFactor(1).setAlpha(0);
    this.sunlightRays = this.add.graphics().setDepth(-0.88).setScrollFactor(1).setBlendMode(Phaser.BlendModes.ADD);
    this.rainTrails = this.add.graphics().setDepth(10.1).setScrollFactor(0);

    for (let index = 0; index < 12; index += 1) {
      const sprite = this.add.sprite(0, 0, dayNightTexture, `night-star-${index % DAY_NIGHT_FRAMES.stars.length}`)
        .setDepth(-0.84).setOrigin(0.5).setScrollFactor(1).setAlpha(0);
      this.stars.push(sprite);
    }

    for (let index = 0; index < 5; index += 1) {
      const cloudFrame = (index * 3 + 1) % WEATHER_FRAMES.clouds.length;
      const cloudSprite = this.add.sprite(0, 0, weatherTexture, `sky-cloud-${cloudFrame}`)
        .setDepth(-0.80).setOrigin(0.5).setScrollFactor(0.72).setAlpha(0.72);
      const shadow = this.add.sprite(0, 0, weatherTexture, `cloud-shadow-${index % WEATHER_FRAMES.shadows.length}`)
        .setDepth(-0.45).setOrigin(0.5).setScrollFactor(1)
        .setTint(0x667576).setBlendMode(Phaser.BlendModes.MULTIPLY).setAlpha(0.03);
      this.clouds.push({
        sprite: cloudSprite,
        shadow,
        x: 0,
        y: 0,
        speed: 8 + index % 3 * 3,
        phase: index * 1.87,
        width: 90 + (index % 3) * 22,
        height: 45 + (index % 2) * 12,
      });
    }

    for (let index = 0; index < 2; index += 1) {
      const positionRatio = index === 0 ? 0.485 : 0.515;
      const sprite = this.add.sprite(0, 0, "pigeon-walking", 0)
        .setOrigin(0.5, 1).setDepth(3.55).setScrollFactor(1).setVisible(false);
      const shadow = this.add.ellipse(0, 0, 19, 5, 0x332a27, 0.24)
        .setDepth(3.5).setScrollFactor(1).setVisible(false);
      this.pigeons.push({
        sprite,
        shadow,
        x: 0,
        y: 0,
        speed: 18 + index * 3,
        direction: index === 0 ? 1 : -1,
        positionRatio,
        state: "walking",
        stateTimerMs: 2_800 + index * 2_700,
        peckCount: 0,
        roamMinRatio: 0.48,
        roamMaxRatio: 0.52,
        width: 30,
        height: 30,
      });
    }

    for (let index = 0; index < 4; index += 1) {
      const glow = this.add.sprite(0, 0, dayNightTexture, `warm-window-glow-${index}`)
        .setDepth(9.6).setOrigin(0.5).setScrollFactor(1)
        .setBlendMode(Phaser.BlendModes.ADD).setTint(0xffc46b).setAlpha(0);
      this.warmGlows.push(glow);
    }

    for (let index = 0; index < 38; index += 1) {
      const frame = index % WEATHER_FRAMES.rain.length;
      const sprite = this.add.sprite(0, 0, weatherTexture, `rain-streak-${frame}`)
        .setDepth(10).setOrigin(0.5).setScrollFactor(0)
        .setRotation(0.36).setTint(0xc2e7f7).setAlpha(0);
      const width = 6 + (index % 3) * 2;
      sprite.setDisplaySize(width, 19 + (index % 4) * 4);
      this.rainDrops.push({ sprite, x: 0, y: 0, speed: 250 + index % 5 * 55, drift: 48 + index % 4 * 11 });
    }

    for (let index = 0; index < 4; index += 1) {
      const ripple = this.add.sprite(0, 0, weatherTexture, `rain-ripple-${index}`)
        .setDepth(2.8).setOrigin(0.5).setScrollFactor(1).setTint(0xa7d8e8).setAlpha(0);
      const splash = this.add.sprite(0, 0, weatherTexture, `rain-splash-${index + 1}`)
        .setDepth(2.9).setOrigin(0.5, 0.85).setScrollFactor(1).setAlpha(0);
      this.puddles.push({ sprite: ripple, x: 0, y: 0, phase: index * 1.67 });
      this.puddles.push({ sprite: splash, x: 0, y: 0, phase: index * 2.19 + 0.8 });
    }
  }

  private getTimeOfDayBlend(phase: number): {
    fromMood: TimeOfDayMap;
    toMood: TimeOfDayMap;
    transition: number;
  } {
    let segment = 0;
    while (segment < TIME_OF_DAY_STOPS.length - 2 && phase >= TIME_OF_DAY_STOPS[segment + 1].phase) segment += 1;

    return {
      fromMood: TIME_OF_DAY_STOPS[segment].mood,
      toMood: TIME_OF_DAY_STOPS[segment + 1].mood,
      transition: this.smoothStep(TIME_OF_DAY_STOPS[segment].phase, TIME_OF_DAY_STOPS[segment + 1].phase, phase),
    };
  }

  private updateHomeStreetMap(phase: number, daylight: number, rain: number): void {
    const { fromMood, toMood, transition } = this.getTimeOfDayBlend(phase);
    const fromTexture = HOME_STREET_MAP_TEXTURES[fromMood];
    const toTexture = HOME_STREET_MAP_TEXTURES[toMood];
    if (this.homeStreet.texture.key !== fromTexture) this.homeStreet.setTexture(fromTexture);
    if (this.homeStreetTransition.texture.key !== toTexture) this.homeStreetTransition.setTexture(toTexture);
    this.homeStreetTransition.setAlpha(transition).setVisible(transition > 0.001);
    const overcastAmount = this.smoothStep(0.08, 0.72, rain) * daylight * 0.95;
    this.homeStreetOvercast.setAlpha(overcastAmount).setVisible(overcastAmount > 0.001);
  }

  private updateHomeArtworkLighting(daylight: number, twilight: number, cloudCover: number, rain: number): void {
    if (!this.homeArtwork) return;

    // Upgrade house art is a fixed daytime asset, so tint it with the same
    // day/night cycle as the street to keep it from glowing against night maps.
    const night = 1 - daylight;
    const weatherDim = cloudCover * 0.055 + rain * 0.075;
    const red = Phaser.Math.Clamp(Math.round(255 * (1 - night * 0.34 - weatherDim + twilight * 0.035)), 0, 255);
    const green = Phaser.Math.Clamp(Math.round(255 * (1 - night * 0.29 - weatherDim + twilight * 0.01)), 0, 255);
    const blue = Phaser.Math.Clamp(Math.round(255 * (1 - night * 0.18 - weatherDim - twilight * 0.045)), 0, 255);
    const tint = (red << 16) | (green << 8) | blue;
    if (tint === this.homeArtworkTint) return;

    this.homeArtwork.setTint(tint);
    this.homeArtworkTint = tint;
  }

  private updateStreetMap(phase: number, daylight: number, rain: number): void {
    const { fromMood, toMood, transition } = this.getTimeOfDayBlend(phase);
    const fromTexture = STREET_MAP_TEXTURES[fromMood];
    const toTexture = STREET_MAP_TEXTURES[toMood];
    if (this.street.texture.key !== fromTexture) this.street.setTexture(fromTexture);
    if (this.streetTransition.texture.key !== toTexture) this.streetTransition.setTexture(toTexture);
    this.streetTransition.setAlpha(transition).setVisible(transition > 0.001);

    // The wet map is reserved for actual rain. Keep the time-of-day artwork
    // underneath so a rainy night still reads as night.
    const overcastAmount = this.smoothStep(0.08, 0.72, rain) * daylight * 0.95;
    this.streetOvercast.setAlpha(overcastAmount).setVisible(overcastAmount > 0.001);
    this.shopLightingState = { from: fromMood, to: toMood, blend: transition, overcast: overcastAmount };
    this.updateShopLighting();

    const backdropMood = overcastAmount > 0.45 ? "rain" : transition > 0.5 ? toMood : fromMood;
    const backdropTexture = STREET_MAP_TEXTURES[backdropMood];
    if (this.streetBackdrop.texture.key !== backdropTexture) this.streetBackdrop.setTexture(backdropTexture);
  }

  private updateMarketExteriorLighting(phase: number, daylight: number, rain: number): void {
    const { fromMood: fromTime, toMood: toTime, transition } = this.getTimeOfDayBlend(phase);
    const marketMoodByTime: Record<TimeOfDayMap, WholesaleMarketBackgroundMood> = {
      dawn: "morning",
      day: "noon",
      sunset: "afternoon",
      night: "night",
    };
    const fromMood = marketMoodByTime[fromTime];
    const toMood = marketMoodByTime[toTime];
    const fromTexture = WHOLESALE_MARKET_EXTERIOR_TEXTURE_KEYS[fromMood];
    const toTexture = WHOLESALE_MARKET_EXTERIOR_TEXTURE_KEYS[toMood];
    if (this.marketExterior.texture.key !== fromTexture) this.marketExterior.setTexture(fromTexture);
    if (this.marketExteriorTransition.texture.key !== toTexture) this.marketExteriorTransition.setTexture(toTexture);
    this.marketExteriorTransition.setAlpha(transition).setVisible(transition > 0.001);

    // Use the same rain blend as the main street so the two connected maps
    // change weather together without replacing the underlying time-of-day art.
    const overcastAmount = this.smoothStep(0.08, 0.72, rain) * daylight * 0.95;
    this.marketExteriorOvercast.setAlpha(overcastAmount).setVisible(overcastAmount > 0.001);
  }

  private updateLivingEnvironment(time: number, elapsed: number, mapWidth: number): void {
    const seconds = this.environmentElapsedMs / 1_000;
    const phase = this.getCurrentDayPhase();
    const sunHeight = Math.cos((phase - 0.5) * Math.PI * 2);
    const daylight = this.smoothStep(-0.12, 0.18, sunHeight);
    const night = 1 - daylight;
    const twilight = Phaser.Math.Clamp(1 - Math.abs(sunHeight) / 0.34, 0, 1);
    const weather = this.getWeatherState(seconds);
    this.updateStreetMap(phase, daylight, weather.rain);
    this.updateHomeStreetMap(phase, daylight, weather.rain);
    this.updateMarketExteriorLighting(phase, daylight, weather.rain);
    this.updateHomeArtworkLighting(daylight, twilight, weather.cloudCover, weather.rain);
    this.canopyLayers.forEach((layer, index) => {
      const anchor = TREE_CANOPY_LAYERS[index];
      // The two foliage pieces on each map edge share nearly the same sway,
      // so they read as one tree. Their pivots stay fixed at the edge.
      const period = anchor.side === "left" ? 3_450 : 3_720;
      const sway = Math.sin(time / period + anchor.phase);
      // Keep the motion gentle but large enough to read on a phone-sized map.
      const rotation = sway * (0.042 + weather.wind * 0.047);
      layer.setRotation(rotation);
      const sunlight = this.canopySunlightLayers[index];
      const shimmer = 0.92 + Math.sin(time / (3_800 + index * 260) + anchor.phase) * 0.08;
      sunlight.setRotation(rotation)
        .setTint(twilight > 0.1 ? 0xffc977 : 0xffe6a6)
        .setAlpha(daylight * (1 - weather.cloudCover * 0.72) * (1 - weather.rain * 0.72) * 0.105 * shimmer);
    });
    this.nightOverlay.setAlpha(night * 0.07);
    this.duskOverlay.setAlpha(twilight * 0.025);
    this.weatherOverlay.setAlpha(weather.cloudCover * 0.075 + weather.rain * 0.11);
    this.updateColorGrade(night, twilight, weather.cloudCover, weather.rain);

    const isDayArc = phase >= 0.25 && phase <= 0.75;
    const sunProgress = isDayArc ? (phase - 0.25) / 0.5 : 0;
    const sunX = mapWidth * (0.045 + sunProgress * 0.91);
    // This panorama starts at the roofline instead of showing an open sky.
    // Keep the sun and cloud silhouettes in the atmospheric margin above it.
    const sunY = this.mapTop + this.mapHeight * 0.035;
    const sunOpacity = isDayArc ? Math.max(daylight, twilight * 0.42) * (1 - weather.cloudCover * 0.45) : 0;
    const sunFrame = twilight > 0.24 ? "sunset-disc-0" : "sun-disc-0";
    if (this.sun.frame.name !== sunFrame) this.sun.setTexture("day-night-effects", sunFrame);
    this.sun.setPosition(sunX, sunY).setDisplaySize(26 * this.unit, 28 * this.unit).setAlpha(sunOpacity * 0.12);

    const moonProgress = (sunProgress + 0.5) % 1;
    const moonX = mapWidth * (0.045 + moonProgress * 0.91);
    this.moon.setPosition(moonX, sunY)
      .setDisplaySize(22 * this.unit, 28 * this.unit)
      .setAlpha(Phaser.Math.Clamp((night - 0.58) / 0.42, 0, 1) * (1 - weather.cloudCover * 0.36) * 0.58);
    this.updateEnvironmentWind(time, weather.wind, elapsed);

    this.clouds.forEach((cloud, index) => {
      cloud.x += (cloud.speed + weather.wind * 16) * elapsed;
      if (cloud.x > mapWidth + cloud.width) cloud.x = -cloud.width;
      const bob = Math.sin(time / 4_700 + cloud.phase) * this.unit * 3;
      cloud.sprite.setPosition(cloud.x, this.mapTop + this.mapHeight * 0.038 + bob)
        .setDisplaySize(cloud.width * this.unit * 0.56, cloud.height * this.unit * 0.56)
        .setAlpha(0.25 + weather.cloudCover * 0.22)
        .setTint(night > 0.55 ? 0xb4bdd8 : twilight > 0.1 ? 0xffd8b0 : 0xffffff);
      cloud.shadow.setPosition(cloud.x + cloud.width * 0.38, this.mapTop + this.mapHeight * 0.805)
        .setDisplaySize(this.mapHeight * 0.28, this.mapHeight * 0.08)
        .setAlpha(daylight * (0.035 + weather.cloudCover * 0.29));
    });

    this.updatePigeons(elapsed, daylight, weather.rain, mapWidth);

    // The time-of-day maps already contain their own window and lamp lighting.
    // Extra additive glow sprites produce bright streaks over nearby facades.
    this.warmGlows.forEach((glow) => glow.setVisible(false));

    this.stars.forEach((star, index) => {
      const starX = mapWidth * (0.055 + (index * 0.173) % 0.89);
      const starY = this.mapTop + this.mapHeight * (0.014 + index % 4 * 0.011);
      const twinkle = 0.58 + (Math.sin(time / (520 + index * 19) + index) + 1) * 0.18;
      star.setPosition(starX, starY).setDisplaySize((5 + index % 3 * 2) * this.unit, (5 + index % 3 * 2) * this.unit)
        .setAlpha(night * night * (1 - weather.cloudCover * 0.75) * twinkle);
    });

    this.sunlightRays.clear();
    const rayOpacity = daylight * (1 - weather.cloudCover * 0.68) * 0.042;
    if (rayOpacity > 0.002) {
      const endY = this.mapTop + this.mapHeight * 0.79;
      const rayWidth = this.mapHeight * 0.09;
      for (let index = -2; index <= 2; index += 1) {
        const spread = index * this.mapHeight * 0.052;
        this.sunlightRays.fillStyle(twilight > 0.1 ? 0xffbb79 : 0xffefbd, rayOpacity * (index === 0 ? 1 : 0.68));
        this.sunlightRays.beginPath();
        this.sunlightRays.moveTo(sunX + index * 4 * this.unit, sunY + this.mapHeight * 0.035);
        this.sunlightRays.lineTo(sunX + spread - rayWidth, endY);
        this.sunlightRays.lineTo(sunX + spread + rayWidth, endY);
        this.sunlightRays.closePath();
        this.sunlightRays.fillPath();
      }
    }

    const screenWidth = this.getLogicalWidth();
    const screenHeight = this.getLogicalHeight();
    this.rainTrails.clear();
    if (weather.rain > 0.015) {
      this.rainTrails.lineStyle(Math.max(1, this.unit * 1.1), 0x9edbf1, weather.rain * 0.56);
    }
    this.rainDrops.forEach((drop) => {
      if (drop.y > screenHeight + 24) {
        drop.y = -Phaser.Math.Between(10, Math.max(12, screenHeight * 0.48));
        drop.x = Phaser.Math.Between(0, Math.max(1, screenWidth));
      }
      drop.y += drop.speed * (0.72 + weather.rain * 0.8) * elapsed;
      drop.x -= (drop.drift + weather.wind * 58) * elapsed;
      drop.sprite.setPosition(drop.x, drop.y).setRotation(0.33 + weather.wind * 0.16)
        .setAlpha(weather.rain * 0.92).setVisible(weather.rain > 0.015);
      if (weather.rain > 0.015) {
        this.rainTrails.lineBetween(drop.x, drop.y, drop.x - (4 + weather.wind * 3) * this.unit, drop.y + (12 + weather.rain * 8) * this.unit);
      }
    });

    this.puddles.forEach((effect, index) => {
      const ripple = index % 2 === 0;
      const pulse = (Math.sin(time / (ripple ? 700 : 270) + effect.phase) + 1) / 2;
      effect.sprite.setPosition(effect.x, effect.y)
        .setDisplaySize((ripple ? 44 : 23) * this.unit, (ripple ? 19 : 25) * this.unit)
        .setAlpha(weather.rain * (ripple ? 0.34 + pulse * 0.2 : pulse * 0.68));
    });

    if (this.environmentElapsedMs - this.lastEnvironmentUiAt >= 500) {
      this.lastEnvironmentUiAt = this.environmentElapsedMs;
      const clockHours = Math.floor(phase * 24) % 24;
      const clockMinutes = Math.floor((phase * 24 * 60) % 60 / 5) * 5;
      const clockText = `${clockHours.toString().padStart(2, "0")}:${clockMinutes.toString().padStart(2, "0")}`;
      this.updateStreetCrowdState(phase * 24, weather.rain);
      const weatherCopy = document.querySelector<HTMLElement>("#weather-copy");
      if (weatherCopy) weatherCopy.textContent = `${clockText} · ${weather.label} · Sài Gòn`;
      setIcon(document.querySelector("#weather-icon"), weather.icon);
    }
  }

  private getCurrentDayPhase(): number {
    const phaseByName = { dawn: 0.25, day: 0.5, sunset: 0.75, night: 0 } as const;
    return this.debugTimeOfDay
      ? phaseByName[this.debugTimeOfDay]
      : (START_DAY_PHASE + this.environmentElapsedMs / DAY_LENGTH_MS) % 1;
  }

  private updateStreetCrowdState(hour: number, rain: number): void {
    const lateNight = hour >= 18.5 || hour < 5;
    const morning = hour >= 5 && hour < 10;
    let level: StreetCrowdLevel;

    if ((hour >= 7 && hour < 9) || (hour >= 11 && hour < 14) || (hour >= 17 && hour < 23.5)) {
      level = "busy";
    } else if ((hour >= 5 && hour < 7) || (hour >= 9 && hour < 11) || (hour >= 14 && hour < 17) || hour >= 23.5 || hour < 1) {
      level = "steady";
    } else {
      level = "quiet";
    }

    // A heavy downpour thins the sidewalk by one step; light clouds do not.
    if (rain >= 0.55) {
      if (level === "busy") level = "steady";
      else if (level === "steady") level = "quiet";
    }

    const nextState: StreetCrowdState = {
      level,
      customerArrivalMultiplier: level === "busy" ? 1.25 : level === "steady" ? 1 : 0.7,
    };
    const schedule = lateNight ? "late-night" : morning ? "morning" : "day";
    const signature = `${level}:${schedule}`;
    if (signature === this.streetCrowdSignature) return;

    this.streetCrowdSignature = signature;
    this.streetCrowdState = nextState;
    this.updateAmbientCrowdPopulation(level, schedule);
    this.events.emit("street-crowd-changed", this.getStreetCrowdState());
  }

  private updateAmbientCrowdPopulation(level: StreetCrowdLevel, schedule: StreetCrowdSchedule): void {
    const shopWalkers = this.walkers
      .map((walker, index) => ({ walker, index }))
      .filter(({ walker }) => walker.zone === "shop");
    const priority = schedule === "late-night"
      ? LATE_NIGHT_WALKER_PRIORITY
      : schedule === "morning" ? MORNING_WALKER_PRIORITY : WALKER_TEXTURES;
    const priorityRank = new Map<string, number>();
    priority.forEach((textureKey, index) => priorityRank.set(textureKey, index));
    const orderedWalkers = [...shopWalkers].sort((left, right) =>
      (priorityRank.get(left.walker.textureKey) ?? Number.MAX_SAFE_INTEGER)
      - (priorityRank.get(right.walker.textureKey) ?? Number.MAX_SAFE_INTEGER),
    );
    const desiredCount = Math.min(WALKER_COUNT_BY_CROWD[level], orderedWalkers.length);
    const enabledWalkers = new Set(orderedWalkers.slice(0, desiredCount).map(({ index }) => index));

    for (const { walker, index } of shopWalkers) {
      const enabled = enabledWalkers.has(index);
      if (walker.enabled === enabled) continue;
      walker.enabled = enabled;

      if (!enabled) {
        this.walkerSpawnQueue = this.walkerSpawnQueue.filter((queuedIndex) => queuedIndex !== index);
        if (walker.textureKey === "walk-street-cat" && walker.petMode === "paused") {
          walker.active = false;
          walker.sprite.setVisible(false);
          walker.shadow.setVisible(false);
        }
      } else if (!walker.active && !this.walkerSpawnQueue.includes(index)) {
        this.walkerSpawnQueue.push(index);
      }
    }
  }

  private updatePigeons(elapsed: number, daylight: number, rain: number, mapWidth: number): void {
    const weatherAllowsPigeons = daylight >= 0.16 && rain <= 0.72;
    for (const pigeon of this.pigeons) {
      const { sprite, shadow } = pigeon;
      if (!weatherAllowsPigeons) {
        sprite.setVisible(false);
        shadow.setVisible(false);
        continue;
      }

      pigeon.stateTimerMs -= elapsed * 1_000;
      if (pigeon.state === "walking") {
        pigeon.x += pigeon.direction * pigeon.speed * this.unit * elapsed;
        pigeon.positionRatio = pigeon.x / mapWidth;
        if (pigeon.positionRatio <= pigeon.roamMinRatio) {
          pigeon.direction = 1;
          pigeon.positionRatio = pigeon.roamMinRatio;
          pigeon.x = pigeon.positionRatio * mapWidth;
        } else if (pigeon.positionRatio >= pigeon.roamMaxRatio) {
          pigeon.direction = -1;
          pigeon.positionRatio = pigeon.roamMaxRatio;
          pigeon.x = pigeon.positionRatio * mapWidth;
        }

        if (pigeon.stateTimerMs <= 0) {
          pigeon.state = "eating";
          pigeon.stateTimerMs = Phaser.Math.Between(950, 1_650);
          sprite.play("pigeon-eat", true);
        }
      } else if (pigeon.state === "eating" && pigeon.stateTimerMs <= 0) {
        pigeon.peckCount += 1;
        if (pigeon.peckCount >= 3 || (pigeon.peckCount > 0 && Math.random() < 0.12)) {
          pigeon.peckCount = 0;
          pigeon.state = "flying";
          pigeon.stateTimerMs = 1_500;
          pigeon.speed = Phaser.Math.Between(78, 105);
          sprite.play("pigeon-fly", true);
        } else {
          pigeon.state = "walking";
          pigeon.stateTimerMs = Phaser.Math.Between(3_200, 6_500);
          sprite.play("pigeon-walk", true);
        }
      } else if (pigeon.state === "flying") {
        pigeon.x += pigeon.direction * pigeon.speed * this.unit * elapsed;
        pigeon.y -= 23 * this.unit * elapsed;
        pigeon.positionRatio = pigeon.x / mapWidth;
        if (pigeon.stateTimerMs <= 0) {
          pigeon.positionRatio = Phaser.Math.Clamp(pigeon.positionRatio, pigeon.roamMinRatio, pigeon.roamMaxRatio);
          pigeon.x = pigeon.positionRatio * mapWidth;
          if (pigeon.positionRatio >= pigeon.roamMaxRatio) pigeon.direction = -1;
          else if (pigeon.positionRatio <= pigeon.roamMinRatio) pigeon.direction = 1;
          pigeon.y = this.groundY;
          pigeon.state = "walking";
          pigeon.stateTimerMs = Phaser.Math.Between(2_000, 4_500);
          pigeon.speed = Phaser.Math.Between(16, 22);
          sprite.play("pigeon-walk", true);
        }
      }

      const displayWidth = pigeon.width * this.unit;
      const displayHeight = pigeon.height * this.unit;
      sprite.setFlipX(pigeon.direction < 0)
        .setPosition(pigeon.x, pigeon.y)
        .setDisplaySize(displayWidth, displayHeight)
        .setDepth(getStreetCharacterDepth(pigeon.y) - 0.035)
        .setAlpha(daylight * (1 - rain * 0.45))
        .setVisible(true);
      shadow.setPosition(pigeon.x, pigeon.y + 1.5 * this.unit)
        .setDisplaySize(displayWidth * 0.54, 5 * this.unit)
        .setAlpha(pigeon.state === "flying" ? 0.12 : 0.24)
        .setVisible(pigeon.state !== "flying");
    }
  }

  private getWeatherState(seconds: number): WeatherState {
    if (this.debugWeather === "clear") return { cloudCover: 0.12, rain: 0, wind: 0.18, label: "Nắng nhẹ", icon: "sun" };
    if (this.debugWeather === "cloudy") return { cloudCover: 0.82, rain: 0, wind: 0.36, label: "Mây che nắng", icon: "cloud" };
    if (this.debugWeather === "rain") return { cloudCover: 0.92, rain: 0.86, wind: 0.72, label: "Mưa rào", icon: "rain" };

    const cycle = (seconds * 1_000 % WEATHER_CYCLE_MS) / WEATHER_CYCLE_MS;
    const overcast = this.smoothStep(0.48, 0.60, cycle) * (1 - this.smoothStep(0.75, 0.84, cycle));
    const rainyWindow = this.smoothStep(0.77, 0.82, cycle) * (1 - this.smoothStep(0.91, 0.96, cycle));
    const gustWindow = this.smoothStep(0.64, 0.72, cycle) * (1 - this.smoothStep(0.91, 0.98, cycle));
    const cloudCover = 0.12 + overcast * 0.66 + rainyWindow * 0.18;
    const wind = 0.15 + gustWindow * 0.5 + rainyWindow * 0.28;
    if (rainyWindow > 0.08) return { cloudCover, rain: rainyWindow * 0.86, wind, label: "Mưa rào", icon: "rain" };
    if (overcast > 0.56) return { cloudCover, rain: 0, wind, label: gustWindow > 0.12 ? "Gió lay hàng me" : "Mây che nắng", icon: gustWindow > 0.12 ? "leaf" : "cloud" };
    return { cloudCover, rain: 0, wind, label: gustWindow > 0.15 ? "Gió nhẹ" : "Nắng nhẹ", icon: "sun" };
  }

  private smoothStep(edge0: number, edge1: number, value: number): number {
    const t = Phaser.Math.Clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  private syncCookingSteamEmitters(): void {
    if (!this.shopOverlay || !this.mapHeight) return;
    const sourceScale = this.shopOverlayScale;
    const signature = [
      this.shopStage,
      this.shopOverlay.x,
      this.shopOverlay.y,
      sourceScale,
      this.shopArtworkTransform.offsetX,
      this.shopArtworkTransform.offsetY,
      this.shopArtworkTransform.scaleX,
      this.shopArtworkTransform.scaleY,
    ].join(":");
    if (signature === this.steamEmitterSignature) return;
    this.steamEmitterSignature = signature;

    const points = [
      ...STREET_COOKING_STEAM_POINTS.map((point) => ({
        ...point,
        x: point.x * sourceScale,
        y: this.mapTop + point.y * sourceScale,
      })),
      ...(SHOP_COOKING_STEAM_POINTS[this.shopStage] ?? []).map((point) => ({
        ...point,
        x: this.shopOverlay.x + (this.shopArtworkTransform.offsetX + point.x * this.shopArtworkTransform.scaleX) * sourceScale,
        y: this.shopOverlay.y + (this.shopArtworkTransform.offsetY + point.y * this.shopArtworkTransform.scaleY) * sourceScale,
      })),
    ];

    this.steamEmitters = points.map((point) => {
      const intervalMs = point.intervalMs ?? 1_900;
      return {
        x: point.x,
        y: point.y,
        size: point.size ?? 1,
        intervalMs,
        cooldownMs: Math.random() * intervalMs,
        sourceScale,
      };
    });
  }

  private emitSteam(emitter: SteamEmitter): void {
    const sprite = this.add.image(
      emitter.x + Phaser.Math.Between(-1, 1) * emitter.sourceScale,
      emitter.y,
      "cooking-steam-soft",
    )
      .setOrigin(0.5, 1)
      .setDepth(COOKING_STEAM_DEPTH)
      .setTint(0xf4efdf);
    const width = 30 * emitter.sourceScale * emitter.size;
    const height = 54 * emitter.sourceScale * emitter.size;
    sprite.setDisplaySize(width, height);

    this.steamPuffs.push({
      sprite,
      life: 1_450,
      duration: 1_450,
      originX: sprite.x,
      originY: emitter.y,
      rise: Phaser.Math.Between(22, 29) * emitter.sourceScale * emitter.size,
      drift: Phaser.Math.Between(2, 5) * emitter.sourceScale * emitter.size,
      phase: Math.random() * Math.PI * 2,
      baseScaleX: sprite.scaleX,
      baseScaleY: sprite.scaleY,
    });
  }

  private updateCookingSteam(delta: number): void {
    this.steamEmitters.forEach((emitter) => {
      emitter.cooldownMs -= delta;
      if (emitter.cooldownMs <= 0) {
        this.emitSteam(emitter);
        emitter.cooldownMs = emitter.intervalMs + Phaser.Math.Between(-260, 260);
      }
    });

    for (let index = this.steamPuffs.length - 1; index >= 0; index -= 1) {
      const steam = this.steamPuffs[index];
      steam.life -= delta;
      const progress = Phaser.Math.Clamp(1 - steam.life / steam.duration, 0, 1);
      const fade = Math.sin(progress * Math.PI) * 0.38;
      steam.sprite
        .setPosition(
          steam.originX + Math.sin(progress * 2.8 + steam.phase) * steam.drift,
          steam.originY - steam.rise * progress,
        )
        .setScale(steam.baseScaleX * (0.9 + progress * 0.12), steam.baseScaleY * (0.9 + progress * 0.12))
        .setAlpha(fade);
      if (steam.life <= 0) {
        steam.sprite.destroy();
        this.steamPuffs.splice(index, 1);
      }
    }
  }

  private layout(): void {
    if (!this.street || !this.shopOverlay || !this.lastSnapshot) return;

    const width = this.getLogicalWidth();
    const height = this.getLogicalHeight();
    const previousMapWidth = this.mapWidth;
    const previousHomeMapWidth = this.homeMapWidth;
    const previousMarketMapWidth = this.marketMapWidth;
    const previousOwnerWorldX = this.ownerWorldX;
    const previousOwnerWorldY = this.ownerWorldY;
    const previousMapHeight = this.mapHeight;
    const previousMapTop = this.mapTop;
    const portrait = width / height < 0.85;
    // The street artwork fills the portrait play area instead of sitting in a
    // small centered strip with a blurred duplicate above and below it.
    const gameplayMapHeight = height;
    // On wide screens keep the debug asset preview fitted between the HUD and
    // controls. Portrait phones use the same full-height map as regular play.
    const debugTopInset = this.shopDebugEnabled ? Math.min(88, height * 0.2) : 0;
    const debugBottomInset = this.shopDebugEnabled ? Math.min(128, height * 0.29) : 0;
    const debugAvailableHeight = Math.max(1, height - debugTopInset - debugBottomInset);
    const debugPreviewMapHeight = this.shopDebugEnabled && !portrait
      ? Math.min(
        width * (SHOP_BASE_SIZE.height / SHOP_OVERLAY_BOX.w) * 0.92,
        debugAvailableHeight * (SHOP_BASE_SIZE.height / SHOP_OVERLAY_BOX.h),
      )
      : gameplayMapHeight;
    const mapHeight = Math.min(gameplayMapHeight, debugPreviewMapHeight);
    const mapWidth = mapHeight * (SHOP_BASE_SIZE.width / SHOP_BASE_SIZE.height);
    const homeMapWidth = mapHeight * (HOME_MAP_SIZE.width / HOME_MAP_SIZE.height);
    const marketMapWidth = mapHeight * (WHOLESALE_MARKET_EXTERIOR_SIZE.width / WHOLESALE_MARKET_EXTERIOR_SIZE.height);
    const sourceScale = mapHeight / SHOP_BASE_SIZE.height;
    const characterUnit = sourceScale * CHARACTER_DISPLAY_SCALE;
    const overlayHeight = SHOP_OVERLAY_BOX.h * sourceScale;
    const mapTop = (height - mapHeight) / 2;
    // Place character feet on the lower half of the map's tiled sidewalk, above the curb.
    const groundY = mapTop + mapHeight * 0.745;
    const overlayX = SHOP_OVERLAY_BOX.x * sourceScale;
    const overlayY = mapTop + SHOP_OVERLAY_BOX.y * sourceScale;
    const overlayWidth = SHOP_OVERLAY_BOX.w * sourceScale;
    const centerX = overlayX + overlayWidth / 2;
    const resized = width !== this.layoutWidth
      || height !== this.layoutHeight
      || mapWidth !== previousMapWidth
      || homeMapWidth !== previousHomeMapWidth
      || marketMapWidth !== previousMarketMapWidth
      || mapHeight !== previousMapHeight
      || mapTop !== previousMapTop;
    if (resized) {
      if (!this.layoutWidth) {
        this.ownerWorldX = centerX;
        this.ownerWorldY = mapTop + mapHeight * OWNER_MAP_Y_RATIO;
      } else {
        if (previousMapHeight > 0) {
          const { minRatio, maxRatio } = OWNER_MAP_Y_BOUNDS[this.activeZone];
          const previousYRatio = Phaser.Math.Clamp(
            (previousOwnerWorldY - previousMapTop) / previousMapHeight,
            minRatio,
            maxRatio,
          );
          this.ownerWorldY = mapTop + mapHeight * previousYRatio;
        }
        if (this.activeZone === "home" && previousHomeMapWidth > 0) {
          const homeProgress = Phaser.Math.Clamp((previousOwnerWorldX + previousHomeMapWidth) / previousHomeMapWidth, 0, 1);
          this.ownerWorldX = -homeMapWidth + homeProgress * homeMapWidth;
        } else if (this.activeZone === "market" && previousMarketMapWidth > 0) {
          const marketProgress = Phaser.Math.Clamp((previousOwnerWorldX - previousMapWidth) / previousMarketMapWidth, 0, 1);
          this.ownerWorldX = mapWidth + marketProgress * marketMapWidth;
        } else if (previousMapWidth > 0) {
          this.ownerWorldX = Phaser.Math.Clamp(previousOwnerWorldX / previousMapWidth, 0, 1) * mapWidth;
        }
      }
    }
    // World effects follow the map scale; actors get a small visual boost.
    // Both remain proportional across viewport sizes.
    const unit = sourceScale;
    const stage = this.debugShopStage ?? this.lastSnapshot.cartLevel;
    const cartWidth = overlayWidth;
    const cartHeight = overlayHeight;

    this.unit = unit;
    this.characterUnit = characterUnit;
    this.mapTop = mapTop;
    this.mapHeight = mapHeight;
    this.homeMapWidth = homeMapWidth;
    this.marketMapWidth = marketMapWidth;
    this.cartX = centerX;
    this.groundY = groundY;
    this.cartWidth = cartWidth;
    this.cartHeight = cartHeight;

    // The panorama already covers a portrait phone; skip the blurred duplicate
    // and its full-screen filter unless a wide viewport exposes side margins.
    const activeZoneWidth = this.activeZone === "home"
      ? homeMapWidth
      : this.activeZone === "market" ? marketMapWidth : mapWidth;
    this.streetBackdrop.setPosition(width / 2, height / 2)
      .setDisplaySize(width, height)
      .setVisible(activeZoneWidth < width);
    for (const background of [this.homeStreet, this.homeStreetTransition, this.homeStreetOvercast]) {
      background.setPosition(-homeMapWidth / 2, mapTop + mapHeight / 2)
        .setDisplaySize(homeMapWidth, mapHeight);
    }
    this.transitionHomeStage(stage);
    this.layoutHomeArtwork();
    this.street.setPosition(mapWidth / 2, mapTop + mapHeight / 2).setDisplaySize(mapWidth, mapHeight);
    this.streetTransition.setPosition(mapWidth / 2, mapTop + mapHeight / 2).setDisplaySize(mapWidth, mapHeight);
    this.streetOvercast.setPosition(mapWidth / 2, mapTop + mapHeight / 2).setDisplaySize(mapWidth, mapHeight);
    for (const background of [this.marketExterior, this.marketExteriorTransition, this.marketExteriorOvercast]) {
      background.setPosition(mapWidth, mapTop).setDisplaySize(marketMapWidth, mapHeight);
    }
    this.canopyLayers.forEach((layer, index) => {
      const anchor = TREE_CANOPY_LAYERS[index];
      const layerHeight = mapHeight * anchor.height;
      layer.setPosition(mapWidth * anchor.x, mapTop + mapHeight * anchor.y)
        .setDisplaySize(layerHeight * TREE_CANOPY_LAYER_ASPECT_RATIO, layerHeight);
      this.canopySunlightLayers[index]
        .setPosition(layer.x, layer.y)
        .setDisplaySize(layer.displayWidth, layer.displayHeight);
    });
    this.nightOverlay.setPosition(0, 0).setSize(width, height);
    this.duskOverlay.setPosition(0, 0).setSize(width, height);
    this.weatherOverlay.setPosition(0, 0).setSize(width, height);
    this.zoneTransitionCover?.setPosition(0, 0).setSize(width, height);

    this.shopOverlay.setPosition(overlayX, overlayY);
    this.shopPlaceholder.setSize(overlayWidth, overlayHeight);
    const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
    const frameThickness = Math.max(2, Math.round(3 * sourceScale));
    this.shopPlaceholderFrame.clear()
      .lineStyle(frameThickness, 0xe4c28d, 1)
      .strokeRect(0, 0, overlayWidth, overlayHeight);
    this.shopStageTitle
      .setPosition(overlayWidth / 2, overlayHeight * 0.43)
      .setFontSize(Math.max(12, Math.round(22 * sourceScale)))
      .setResolution(devicePixelRatio);
    this.shopStageAsset
      .setPosition(overlayWidth / 2, overlayHeight * 0.57)
      .setFontSize(Math.max(10, Math.round(16 * sourceScale)))
      .setResolution(devicePixelRatio);
    this.shopOverlayScale = sourceScale;
    this.layoutShopArtwork();
    this.syncCookingSteamEmitters();
    this.layoutPlayerOwner(this.ownerWorldX, this.ownerWorldY, unit, characterUnit);
    this.transitionShopStage(stage, this.shopStage > 0);

    if (resized) {
      const camera = this.cameras.main;
      // Preserve normal gameplay's visible world center when the canvas resizes.
      // In debug preview, recenter on the full shop every time: the preview fits
      // the whole overlay to the viewport and must not inherit an old pan offset.
      const oldCenterX = this.layoutWidth ? camera.scrollX + this.cameraViewportWidth / 2 : mapWidth / 2;
      this.layoutWidth = width;
      this.layoutHeight = height;
      this.mapWidth = mapWidth;
      this.setZoneCameraBounds(this.activeZone);
      const targetCenterX = this.shopDebugEnabled ? centerX : oldCenterX;
      camera.setScroll(camera.clampX(targetCenterX - camera.width / 2), 0);
      this.cameraViewportWidth = camera.width;
      this.walkers.forEach((walker) => {
        const zoneBounds = this.getWalkerZoneBounds(walker.zone);
        walker.sprite.x = zoneBounds.left + walker.positionRatio * zoneBounds.width;
      });
      this.clouds.forEach((cloud, index) => {
        cloud.x = mapWidth * (0.05 + index * 0.19);
        cloud.y = mapTop + mapHeight * (0.085 + index % 3 * 0.035);
      });
      this.stars.forEach((star, index) => {
        star.setPosition(mapWidth * (0.055 + (index * 0.173) % 0.89), mapTop + mapHeight * (0.045 + (index % 4) * 0.026));
      });
      this.warmGlows.forEach((glow, index) => {
        glow.setPosition(mapWidth * [0.205, 0.30, 0.705, 0.855][index], mapTop + mapHeight * (0.468 + (index % 2) * 0.018));
      });
      this.puddles.forEach((effect, index) => {
        effect.x = mapWidth * (0.07 + Math.floor(index / 2) * 0.285);
        effect.y = mapTop + mapHeight * 0.939;
      });
      this.rainDrops.forEach((drop, index) => {
        drop.x = (index / this.rainDrops.length) * width;
        drop.y = (index % 5) * (height / 5) - height * 0.35;
      });
    }

    this.walkers.forEach((walker, index) => {
      walker.speed = getAmbientWalkerSpeed(index, walker.textureKey, unit);
      const laneY = this.getWalkerLaneY(walker.lane, walker.zone) + Math.sin(index * 1.9) * 2 * unit;
      const zoneScale = getZoneArtworkScale(walker.zone);
      walker.shadow.setPosition(walker.sprite.x, laneY + 1.5 * unit)
        .setDisplaySize(walker.shadowWidth * walker.size * unit * zoneScale, walker.shadowHeight * walker.size * unit * zoneScale)
        .setDepth(getStreetCharacterDepth(laneY) - 0.02)
        .setVisible(walker.active);
      const actorScale = walker.textureKey === "walk-street-cat" ? unit : characterUnit * zoneScale;
      walker.sprite.setPosition(walker.sprite.x, laneY)
        .setDisplaySize(walker.width * walker.size * actorScale, walker.height * walker.size * actorScale)
        .setDepth(getStreetCharacterDepth(laneY))
        .setVisible(walker.active);
      if (walker.speechBubble) {
        walker.speechBubble.setScale(unit).setDepth(getStreetCharacterDepth(laneY) + 0.0001);
        this.positionStreetSpeechBubble(walker.speechBubble, walker.sprite.x, this.getStreetWalkerSpeechBubbleY(walker, laneY));
      }
    });
    this.layoutTrafficBikes();
    this.clouds.forEach((cloud, index) => {
      cloud.sprite.setPosition(cloud.x, cloud.y).setDisplaySize(cloud.width * unit, cloud.height * unit);
      cloud.shadow.setPosition(cloud.x, mapTop + mapHeight * 0.805)
        .setDisplaySize(mapHeight * 0.22, mapHeight * 0.065);
    });
    const pigeonRoamHalfWidth = Math.min(0.13, Math.max(0.035, (width / mapWidth) * 0.32));
    this.pigeons.forEach((pigeon, index) => {
      pigeon.roamMinRatio = 0.5 - pigeonRoamHalfWidth;
      pigeon.roamMaxRatio = 0.5 + pigeonRoamHalfWidth;
      pigeon.positionRatio = Phaser.Math.Clamp(pigeon.positionRatio, pigeon.roamMinRatio, pigeon.roamMaxRatio);
      pigeon.x = pigeon.positionRatio * mapWidth;
      pigeon.y = groundY + index * 2.5 * unit;
      pigeon.sprite.setPosition(pigeon.x, pigeon.y).setDisplaySize(pigeon.width * unit, pigeon.height * unit);
      pigeon.shadow.setPosition(pigeon.x, pigeon.y + 1.5 * unit).setDisplaySize(pigeon.width * unit * 0.54, 5 * unit);
    });
    // Keep order customers out of the sidewalk scene; the street crowd here is ambient walkers.
    this.syncCrowd([], centerX, groundY, cartWidth, unit, characterUnit);
    this.layoutMapTransitionSigns();
  }

  centerOnShop(): void {
    if (!this.mapWidth) return;
    this.activeZone = "shop";
    this.zoneTransitioning = false;
    this.movementVector = { x: 0, y: 0 };
    this.keyboardMovementVector = { x: 0, y: 0 };
    if (this.zoneTransitionCover) {
      this.tweens.killTweensOf(this.zoneTransitionCover);
      this.zoneTransitionCover.setAlpha(0).setVisible(false);
    }
    this.ownerMoving = false;
    this.ownerWorldX = this.cartX;
    this.ownerWorldY = this.mapTop + this.mapHeight * OWNER_MAP_Y_RATIO;
    this.layoutPlayerOwner(this.ownerWorldX, this.ownerWorldY, this.unit, this.characterUnit);
    this.syncPlayerOwnerAnimation();
    this.setZoneCameraBounds("shop");
    this.events.emit("street-zone-changed", "shop");
    const camera = this.cameras.main;
    camera.setScroll(camera.clampX(this.cartX - camera.width / 2), 0);
  }

  private getCustomerAppearance(type: CustomerType, id: number): CustomerAppearance {
    const existing = this.customerAppearances.get(id);
    if (existing) return existing;

    const options = CUSTOMER_APPEARANCES[type];
    const desiredIndex = Math.max(0, id - 1) % options.length;
    const desired = options[desiredIndex];
    const loaded = options.filter((appearance) =>
      this.textures.exists(appearance.key) && this.textures.exists(appearance.walkKey),
    );
    const appearance = loaded.includes(desired)
      ? desired
      : loaded[Math.max(0, id - 1) % Math.max(1, loaded.length)] ?? desired;
    this.customerAppearances.set(id, appearance);
    return appearance;
  }

  private updateColorGrade(nightAmount: number, twilight: number, cloudCover: number, rain: number): void {
    if (!this.colorGrade) return;
    const signature = [nightAmount, twilight, cloudCover, rain].map((value) => Math.round(value * 100)).join(":");
    if (signature === this.gradeSignature) return;
    const matrix = this.colorGrade.colorMatrix;
    matrix.reset();
    matrix.brightness(1 - nightAmount * 0.045 - cloudCover * 0.03 - rain * 0.025);
    matrix.hue(-nightAmount * 3 + twilight * 4 - cloudCover * 2, true);
    matrix.saturate(-cloudCover * 0.1 + twilight * 0.07, true);
    const warmth = twilight * 0.045;
    matrix.multiply([
      1 + warmth, 0, 0, 0, 0,
      0, 1 + warmth * 0.18, 0, 0, 0,
      0, 0, 1 - warmth * 0.8, 0, 0,
      0, 0, 0, 1, 0,
    ], true);
    matrix.contrast(twilight * 0.018, true);
    if (this.vignette) this.vignette.strength = 0.035 + nightAmount * 0.025 + rain * 0.018;
    this.gradeSignature = signature;
  }

  private syncCrowd(
    customers: WaitingCustomer[],
    centerX = this.getLogicalWidth() / 2,
    groundY = this.getLogicalHeight() * 0.7,
    shopWidth = this.cartWidth,
    unit = this.unit,
    characterUnit = this.characterUnit,
  ): void {
    const liveIds = new Set(customers.map((customer) => customer.id));
    for (const [id, container] of this.crowd) {
      if (!liveIds.has(id)) {
        const departure = this.pendingDepartures.get(id);
        if (departure) this.animateDeparture(container, departure.type, departure.direction);
        else container.destroy(true);
        this.pendingDepartures.delete(id);
        this.crowdMotion.delete(id);
        this.customerAppearances.delete(id);
        this.crowd.delete(id);
      }
    }

    customers.forEach((customer, index) => {
      let container = this.crowd.get(customer.id);
      const appearance = this.getCustomerAppearance(customer.type, customer.id);
      const walkKey = appearance.walkKey;
      const frontKey = appearance.key;
      const recipe = RECIPES[customer.recipe];
      const crowdGap = Math.max(66 * unit, CUSTOMER_DISPLAY_WIDTH * characterUnit * 1.08);
      const targetX = centerX - shopWidth * 0.32 - index * crowdGap;

      if (!container) {
        const shadow = this.add.image(0, 1.5 * unit, "character-contact-shadow-soft")
          .setDisplaySize(38 * unit, 11 * unit)
          .setAlpha(0.8);
        const sprite = this.add.sprite(0, 0, walkKey, getWalkerStartFrame(walkKey, 1)).setOrigin(0.5, getWalkerOriginY(walkKey));
        const label = this.add.text(0, -98 * characterUnit, appearance.shortName, {
          fontFamily: "Trebuchet MS, sans-serif",
          fontSize: `${Math.max(9, 10 * unit)}px`,
          color: "#3f3023",
          backgroundColor: "#fff4dc",
          padding: { x: 5, y: 3 },
        }).setOrigin(0.5, 1);
        const orderTag = this.add.text(0, -116 * characterUnit, recipe.name, {
          fontFamily: "Trebuchet MS, sans-serif",
          fontSize: `${Math.max(8, 9 * unit)}px`,
          color: "#ffffff",
          backgroundColor: "#285a53",
          padding: { x: 5, y: 3 },
        }).setOrigin(0.5, 1);
        container = this.add.container(this.cameras.main.scrollX + 48 * unit, groundY, [shadow, sprite, label, orderTag])
          .setDepth(getStreetCharacterDepth(groundY))
          .setData("customerId", customer.id);
        this.crowd.set(customer.id, container);
        const arrival = customer.status === "walking";
        this.crowdMotion.set(customer.id, {
          targetX,
          speed: 42 * unit,
          direction: 1,
          moving: arrival,
          needsWalkingState: false,
          idlePhase: Math.random() * Math.PI * 2,
        });
      }

      const motion = this.crowdMotion.get(customer.id);
      if (!motion || !container) return;
      motion.targetX = targetX;
      if (!motion.moving && Math.abs(container.x - targetX) > 3 * unit) {
        motion.moving = true;
        motion.needsWalkingState = customer.status === "waiting";
      }

      container.y = groundY;
      const shadow = container.getAt(0) as Phaser.GameObjects.Image;
      const sprite = container.getAt(1) as Phaser.GameObjects.Sprite;
      const label = container.getAt(2) as Phaser.GameObjects.Text;
      const orderTag = container.getAt(3) as Phaser.GameObjects.Text;
      shadow.setDisplaySize(38 * unit, 11 * unit).setPosition(0, 1.5 * unit);
      sprite.setDisplaySize(CUSTOMER_DISPLAY_WIDTH * characterUnit, CUSTOMER_DISPLAY_HEIGHT * characterUnit);
      label.setY(-98 * characterUnit).setFontSize(`${Math.max(9, 10 * unit)}px`).setText(appearance.shortName);
      orderTag.setY(-116 * characterUnit).setFontSize(`${Math.max(8, 9 * unit)}px`).setText(recipe.name);
      const isWalking = motion.moving || customer.status === "walking";
      if (isWalking) {
        const direction: -1 | 1 = targetX >= container.x ? 1 : -1;
        const animation = `${walkKey}-${direction > 0 ? "right" : "left"}`;
        if (sprite.texture.key !== walkKey || sprite.anims.currentAnim?.key !== animation) {
          sprite.setOrigin(0.5, getWalkerOriginY(walkKey));
          const visualScale = getCharacterScaleFactor(
            getWalkerArtHeight(walkKey),
            getWalkerFrameHeight(walkKey),
            CUSTOMER_DISPLAY_HEIGHT,
          );
          sprite.setScale(
            (CUSTOMER_DISPLAY_WIDTH * characterUnit / CUSTOMER_FRAME_WIDTH) * visualScale,
            (CUSTOMER_DISPLAY_HEIGHT * characterUnit / getWalkerFrameHeight(walkKey)) * visualScale,
          );
          sprite.y = 0;
          sprite.setTexture(walkKey, getWalkerStartFrame(walkKey, direction));
          sprite.play(animation);
        }
      } else {
        const idleTexture = frontKey;
        const idleAnimation = appearance.idleAnimation;
        if (sprite.texture.key !== idleTexture || (idleAnimation && sprite.anims.currentAnim?.key !== idleAnimation)) {
          sprite.anims.stop();
          sprite.setOrigin(0.5, getCustomerOriginY(frontKey));
          sprite.setTexture(idleTexture, 0);
          if (idleAnimation) sprite.play(idleAnimation);
        }
      }
      sprite.setOrigin(0.5, isWalking ? getWalkerOriginY(walkKey) : getCustomerOriginY(frontKey));
      const normalizedHeight = isWalking
        ? getWalkerArtHeight(walkKey)
        : CUSTOMER_ART_HEIGHTS[frontKey] ?? 350;
      const normalizedFrameHeight = isWalking ? getWalkerFrameHeight(walkKey) : CUSTOMER_FRAME_HEIGHT;
      setCharacterDisplaySize(
        sprite,
        CUSTOMER_DISPLAY_WIDTH * characterUnit,
        CUSTOMER_DISPLAY_HEIGHT * characterUnit,
        normalizedFrameHeight,
        normalizedHeight,
        CHARACTER_TARGET_VISIBLE_HEIGHT * characterUnit,
      );
      const showOrder = index === 0 && !isWalking;
      label.setVisible(showOrder);
      orderTag.setVisible(showOrder);
    });
  }

  private animateDeparture(container: Phaser.GameObjects.Container, type: CustomerType, direction: -1 | 1): void {
    const sprite = container.getAt(1) as Phaser.GameObjects.Sprite;
    const label = container.getAt(2) as Phaser.GameObjects.Text;
    const orderTag = container.getAt(3) as Phaser.GameObjects.Text;
    const customerId = container.getData("customerId") as number;
    const walkKey = this.getCustomerAppearance(type, customerId).walkKey;
    sprite.setOrigin(0.5, getWalkerOriginY(walkKey));
    const visualScale = getCharacterScaleFactor(
      getWalkerArtHeight(walkKey),
      getWalkerFrameHeight(walkKey),
      CUSTOMER_DISPLAY_HEIGHT,
    );
    sprite.setScale(
      (CUSTOMER_DISPLAY_WIDTH * this.characterUnit / CUSTOMER_FRAME_WIDTH) * visualScale,
      (CUSTOMER_DISPLAY_HEIGHT * this.characterUnit / getWalkerFrameHeight(walkKey)) * visualScale,
    );
    sprite.y = 0;
    sprite.setTexture(walkKey, getWalkerStartFrame(walkKey, direction)).play(`${walkKey}-${direction > 0 ? "right" : "left"}`);
    label.setVisible(false);
    orderTag.setVisible(false);
    const destination = this.getViewportExitX(direction, container.x);
    const duration = Math.max(1_000, Math.abs(destination - container.x) / (90 * this.unit) * 1_000);
    this.tweens.add({
      targets: container,
      x: destination,
      duration,
      ease: "Linear",
      onComplete: () => container.destroy(true),
    });
  }
}
