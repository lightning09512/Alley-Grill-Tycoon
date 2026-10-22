import Phaser from "phaser";
import "./style.css";
import { BUSINESS_STAGE_NAMES, CART_UPGRADE_COST, CUSTOMER_TYPES, getRecipeLearningCost, INGREDIENTS, MAX_CART_LEVEL, PLAYABLE_RECIPE_IDS, RECIPES, type RecipeId } from "./game/data";
import { DINING_ORDER_APPROACH_SECONDS, DINING_ORDER_DELIVERY_SECONDS, DINING_ORDER_GUEST_DIALOGUE_SECONDS, DINING_ORDER_SERVER_REPLY_SECONDS, DINING_ORDER_TAKE_SECONDS, GameStore, getDiningTableCapacity, type CashCollectionEvent, type DiningOrder, type GameSnapshot } from "./game/GameStore";
import { formatVndFromThousands } from "./game/currency";
import { MAX_STAFF_LEVEL, STAFF_CANDIDATES, STAFF_ROLES, STAFF_TRAINING_COST, getStaffCandidate, getStaffRole, type StaffRoleId } from "./game/staffCatalog";
import { MENU_DISHES, MENU_CATEGORIES, MENU_INGREDIENTS, type MenuCategory, type MenuDish, type MenuIngredientId } from "./game/menuCatalog";
import { getMarketStall, MARKET_PRODUCT_DETAILS, type MarketStallId } from "./game/marketCatalog";
import { MusicPlayer } from "./game/MusicPlayer";
import { NeighborhoodScene } from "./game/NeighborhoodScene";
import { DiningRoomScene } from "./game/DiningRoomScene";
import { HomeInteriorScene } from "./game/HomeInteriorScene";
import { WholesaleMarketScene, WHOLESALE_MARKET_INTERIOR_SECTIONS, type WholesaleMarketLightingState, type WholesaleMarketSection } from "./game/WholesaleMarketScene";
import { formatStoreNameForDisplay, GAME_TITLE } from "./config/game";
import { iconMarkup, setIcon, type UiIconName } from "./ui/icons";
import kitchenRoomShellUrl from "../assets/interior-v2/kitchen-pack-v1/kitchen-room-shell-empty.png?url";
import kitchenObjectsLayoutUrl from "../assets/interior-v2/kitchen-pack-v1/kitchen_objects_layout.png?url";
import kitchenPrepStaffChopUrl from "../assets/characters/slow-playback-v1/kitchen-prep-staff-v3/run/exports/chop_vegetables.gif?url";
import kitchenPrepStaffPhoneUrl from "../assets/characters/slow-playback-v1/kitchen-prep-staff-v2/run/exports/idle_phone.gif?url";
import kitchenPrepStaffWipeUrl from "../assets/characters/slow-playback-v1/kitchen-prep-staff-v2/run/exports/idle_wipe_sweat.gif?url";
import kitchenPrepStaffLookUrl from "../assets/characters/slow-playback-v1/kitchen-prep-staff-v2/run/exports/idle_look_around.gif?url";
import heldBasketUrl from "../assets/characters/market-player/held-basket.png?url";
import heldBasketFullUrl from "../assets/characters/market-player/held-basket-full.png?url";
import maiLinhPortraitUrl from "../assets/characters/restaurant-staff-v1/server-mai-linh.png?url";
import quangTinPortraitUrl from "../assets/characters/restaurant-staff-v1/cashier-quang-tin.png?url";
import tanHuyPortraitUrl from "../assets/characters/kitchen-prep-staff-v2/base-source.png?url";
import coHanhPortraitUrl from "../assets/characters/restaurant-staff-v1/chef-co-hanh.png?url";
import anNhienPortraitUrl from "../assets/characters/restaurant-staff-v1/promoter-an.png?url";
import lineCookPortraitUrl from "../assets/characters/kitchen-line-cook-v1/base-source.png?url";
import maiLinhWalkEmptyGifUrl from "../assets/characters/staff-roster-v1/server-mai-linh/redrawn-v1/gif/walk-empty.gif?url";
import maiLinhWalkTrayGifUrl from "../assets/characters/staff-roster-v1/server-mai-linh/redrawn-v1/gif/walk-tray.gif?url";
import maiLinhIdleGifUrl from "../assets/characters/staff-roster-v1/server-mai-linh/redrawn-v1/gif/idle.gif?url";
import maiLinhTakeOrderGifUrl from "../assets/characters/staff-roster-v1/server-mai-linh/redrawn-v1/gif/take-order.gif?url";
import maiLinhPickupKitchenGifUrl from "../assets/characters/staff-roster-v1/server-mai-linh/redrawn-v1/gif/pickup-kitchen.gif?url";
import maiLinhServeTableGifUrl from "../assets/characters/staff-roster-v1/server-mai-linh/redrawn-v1/gif/serve-table.gif?url";
import maiLinhRestGifUrl from "../assets/characters/staff-roster-v1/server-mai-linh/redrawn-v1/gif/rest.gif?url";
import maiLinhPhoneGifUrl from "../assets/characters/staff-roster-v1/server-mai-linh/redrawn-v1/gif/phone.gif?url";
import quangTinWorkUrl from "../assets/characters/slow-playback-v1/staff-roster-v1/cashier-quang-tin/run/exports/work_cashier.gif?url";
import quangTinRestUrl from "../assets/characters/slow-playback-v1/staff-roster-v1/cashier-quang-tin/run/exports/rest_tired.gif?url";
import quangTinLazyUrl from "../assets/characters/slow-playback-v1/staff-roster-v1/cashier-quang-tin/run/exports/idle_lazy.gif?url";
import coHanhWorkUrl from "../assets/characters/slow-playback-v1/staff-roster-v1/chef-co-hanh/run/exports/work_cook.gif?url";
import coHanhRestUrl from "../assets/characters/slow-playback-v1/staff-roster-v1/chef-co-hanh/run/exports/rest_tired.gif?url";
import coHanhLazyUrl from "../assets/characters/slow-playback-v1/staff-roster-v1/chef-co-hanh/run/exports/idle_lazy.gif?url";
import anNhienWorkUrl from "../assets/characters/slow-playback-v1/staff-roster-v1/promoter-an/run/exports/work_promoter.gif?url";
import anNhienRestUrl from "../assets/characters/slow-playback-v1/staff-roster-v1/promoter-an/run/exports/rest_tired.gif?url";
import anNhienLazyUrl from "../assets/characters/slow-playback-v1/staff-roster-v1/promoter-an/run/exports/idle_lazy.gif?url";
import lineCookWorkUrl from "../assets/characters/slow-playback-v1/kitchen-line-cook-v1/run/exports/cook_stir.gif?url";
import lineCookRestUrl from "../assets/characters/slow-playback-v1/kitchen-line-cook-v1/run/exports/rest_tired.gif?url";
import lineCookLazyUrl from "../assets/characters/slow-playback-v1/kitchen-line-cook-v1/run/exports/idle_lazy.gif?url";
import choppedVegetablesUrl from "../assets/interior-v2/food/kitchen-pass-v1/chopped-vegetables.png?url";
import { DISH_ART_URLS } from "./game/dishArt";

document.title = GAME_TITLE;

const debugParams = new URLSearchParams(window.location.search);
const store = new GameStore();
let displayedCoinBalance = store.getSnapshot().coins;
let latestCoinBalance = displayedCoinBalance;
let lastCashCollectionId = 0;
let cashFlightPlaying = false;
const cashFlightQueue: CashCollectionEvent[] = [];
const musicPlayer = new MusicPlayer((state) => {
  const trigger = document.querySelector<HTMLElement>("#settings-trigger");
  const toggle = document.querySelector<HTMLButtonElement>("#music-toggle");
  const icon = document.querySelector<HTMLElement>("#music-toggle-icon");
  const label = document.querySelector<HTMLElement>("#music-toggle-label");
  const trackName = document.querySelector<HTMLElement>("#music-track-name");
  const slider = document.querySelector<HTMLInputElement>("#music-volume");
  const volumeValue = document.querySelector<HTMLOutputElement>("#music-volume-value");

  if (trigger) {
    trigger.dataset.musicPlaying = String(state.isPlaying);
    trigger.setAttribute("aria-label", state.isPlaying ? "Mở cài đặt · nhạc đang phát" : "Mở cài đặt");
    trigger.title = state.isPlaying ? `Cài đặt · đang phát ${state.trackName}` : "Cài đặt";
  }
  if (toggle) toggle.setAttribute("aria-pressed", String(state.isPlaying));
  setIcon(icon, state.isPlaying ? "pause" : "play");
  if (label) label.textContent = state.isPlaying ? "Tạm dừng nhạc" : state.enabled ? "Phát nhạc" : "Bật nhạc";
  if (trackName) trackName.textContent = state.trackName;
  if (slider) slider.value = state.volumePercent.toString();
  if (volumeValue) volumeValue.value = `${state.volumePercent}%`;
});
const scene = new NeighborhoodScene(store);
const diningScene = new DiningRoomScene(store);
const homeInteriorScene = new HomeInteriorScene(store, () => scene.getPlayerOwnerGender());
const wholesaleMarketScene = new WholesaleMarketScene();
wholesaleMarketScene.setBackgroundLightingProvider((): WholesaleMarketLightingState => scene.getWholesaleMarketLightingState());
let activeTab = "outside";
let selectedLedgerDay: number | null = null;

function renderLedger(snapshot: GameSnapshot): void {
  const dialog = document.querySelector<HTMLDialogElement>("#ledger-dialog");
  if (!dialog?.open) return;
  const day = selectedLedgerDay === null ? snapshot.ledgerDay : Math.min(selectedLedgerDay, snapshot.ledgerDay);
  const entries = snapshot.ledger.filter((entry) => entry.day === day);
  const income = entries.reduce((sum, entry) => sum + Math.max(0, entry.amount), 0);
  const expense = entries.reduce((sum, entry) => sum + Math.max(0, -entry.amount), 0);
  const sales = entries.filter((entry) => entry.label.startsWith("Bán ")).reduce((sum, entry) => sum + entry.amount, 0);
  const ingredients = entries.filter((entry) => entry.label.startsWith("Đi chợ:") || entry.label.startsWith("Nhập nguyên liệu"))
    .reduce((sum, entry) => sum - entry.amount, 0);
  const setText = (selector: string, value: string): void => {
    const node = dialog.querySelector<HTMLElement>(selector);
    if (node) node.textContent = value;
  };
  setText("#ledger-title", `Ngày ${day}`);
  setText("#ledger-paper-day", `· Ngày ${day}`);
  setText("#ledger-balance", formatVndFromThousands(snapshot.coins));
  setText("#ledger-sales", sales ? `+${formatVndFromThousands(sales)}` : "0đ");
  setText("#ledger-other-income", income > sales ? `+${formatVndFromThousands(income - sales)}` : "0đ");
  setText("#ledger-ingredients", ingredients ? `−${formatVndFromThousands(ingredients)}` : "0đ");
  setText("#ledger-other-expense", expense > ingredients ? `−${formatVndFromThousands(expense - ingredients)}` : "0đ");
  setText("#ledger-income", income ? `+${formatVndFromThousands(income)}` : "0đ");
  setText("#ledger-expense", expense ? `−${formatVndFromThousands(expense)}` : "0đ");
  const net = income - expense;
  setText("#ledger-profit", net ? `${net > 0 ? "+" : "−"}${formatVndFromThousands(Math.abs(net))}` : "0đ");
  dialog.querySelector(".ledger-profit")?.classList.toggle("is-negative", net < 0);
  const days = dialog.querySelector<HTMLElement>("#ledger-days");
  if (days) days.innerHTML = Array.from(new Set([...snapshot.ledger.map((entry) => entry.day), snapshot.ledgerDay]))
    .sort((a, b) => b - a).map((value) => `<button type="button" data-ledger-day="${value}" aria-pressed="${value === day}">Ngày ${value}</button>`).join("");
  const list = dialog.querySelector<HTMLElement>("#ledger-entries");
  if (list) {
    list.replaceChildren();
    if (entries.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Hôm nay chưa có khoản thu chi nào.";
      list.append(empty);
    }
    for (const entry of [...entries].reverse()) {
      const row = document.createElement("div");
      row.className = `ledger-entry ${entry.amount < 0 ? "is-expense" : "is-income"}`;
      const label = document.createElement("span");
      label.textContent = entry.label;
      const amount = document.createElement("strong");
      amount.textContent = `${entry.amount < 0 ? "−" : "+"}${formatVndFromThousands(Math.abs(entry.amount))}`;
      row.append(label, amount);
      list.append(row);
    }
  }
}
let diningView: "tables" | "kitchen" = "tables";
let homeOpen = false;
let homeInteriorStarted = false;
let homeInteriorSleeping = false;
let wholesaleMarketOpen = false;
let wholesaleMarketStarted = false;
let wholesaleMarketSleeping = false;
let selectedMenuCategory: MenuCategory | "all" = "all";
let shiftMenuDraft = new Set<RecipeId>();
let recipeLearningFeedback = "";
let selectedStaffRole: StaffRoleId = "server";
let staffManagementSignature = "";
let diningDeliveryReturnTimer: number | null = null;
let staffEntranceActive = false;
let staffEntranceRunId = 0;
const staffEntranceArrivedIds = new Set<string>();
const staffEntranceTimers = new Set<number>();
type StockCategoryId = "all" | "fresh" | "produce" | "dry" | "seasoning";
const STOCK_CATEGORY_FILTERS: { id: StockCategoryId; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "fresh", label: "Thịt cá" },
  { id: "produce", label: "Rau củ" },
  { id: "dry", label: "Đồ khô" },
  { id: "seasoning", label: "Gia vị" },
];
const STOCK_CATEGORY_STALLS: Record<Exclude<StockCategoryId, "all">, MarketStallId[]> = {
  fresh: ["meat", "fish"],
  produce: ["produce", "greens"],
  dry: ["dry-goods"],
  seasoning: ["seasonings"],
};
let selectedStockCategory: StockCategoryId = "all";
let selectedStockIngredient: MenuIngredientId | null = null;
let selectedMarketStallId: MarketStallId | null = null;
let marketShopFeedback = "";
const marketProductQuantities = new Map<MenuIngredientId, number>();
const app = document.querySelector<HTMLDivElement>("#app");
const phaserRoot = document.querySelector<HTMLDivElement>("#phaser-root");
const gameLoadingScreen = document.querySelector<HTMLElement>("#game-loading-screen");
const gameLoadingCopy = document.querySelector<HTMLElement>("#game-loading-copy");
const gameLoadingProgress = document.querySelector<HTMLElement>("#game-loading-progress");
const wholesaleMarketInterface = document.querySelector<HTMLDivElement>("#market-interface");
const homeInterface = document.querySelector<HTMLDivElement>("#home-interface");
const homeStageCopy = document.querySelector<HTMLElement>("#home-stage-copy");
const homeEntryPrompt = document.querySelector<HTMLDivElement>("#home-entry-prompt");
const wholesaleMarketSectionCopy = document.querySelector<HTMLElement>("#market-section-copy");
const wholesaleMarketSectionProgress = document.querySelector<HTMLElement>("#market-section-progress");
const wholesaleMarketHeldBasket = document.querySelector<HTMLImageElement>("#market-held-basket");
if (wholesaleMarketHeldBasket) wholesaleMarketHeldBasket.src = store.getSnapshot().marketBasketHasItems ? heldBasketFullUrl : heldBasketUrl;
const wholesaleMarketStallArrow = document.querySelector<HTMLButtonElement>("#market-stall-arrow");
const wholesaleMarketPanCopy = document.querySelector<HTMLElement>("#market-pan-copy");
const marketShopDialog = document.querySelector<HTMLDialogElement>("#market-shop-dialog");
const shiftMenuDialog = document.querySelector<HTMLDialogElement>("#shift-menu-dialog");
const recipeLearningDialog = document.querySelector<HTMLDialogElement>("#recipe-learning-dialog");
const shiftMenuTitle = document.querySelector<HTMLElement>("#shift-menu-title");
const shiftMenuDescription = document.querySelector<HTMLElement>("#shift-menu-description");
const shiftMenuList = document.querySelector<HTMLElement>("#shift-menu-list");
const shiftMenuSelectionCount = document.querySelector<HTMLElement>("#shift-menu-selection-count");
const shiftMenuAvailability = document.querySelector<HTMLElement>("#shift-menu-availability");
const shiftMenuFeedback = document.querySelector<HTMLElement>("#shift-menu-feedback");
const confirmShiftMenuButton = document.querySelector<HTMLButtonElement>("#confirm-shift-menu");
const marketShopTitle = document.querySelector<HTMLElement>("#market-shop-title");
const marketShopSubtitle = document.querySelector<HTMLElement>("#market-shop-subtitle");
const marketShopBalance = document.querySelector<HTMLElement>("#market-shop-balance");
const marketShopProducts = document.querySelector<HTMLElement>("#market-shop-products");
const marketShopFeedbackNode = document.querySelector<HTMLElement>("#market-shop-feedback");
marketShopDialog?.addEventListener("close", () => {
  selectedMarketStallId = null;
  marketProductQuantities.clear();
  marketShopFeedback = "";
});
if (!app || !phaserRoot || !wholesaleMarketInterface) throw new Error("Không tìm thấy khung game.");
window.addEventListener("game-loading-progress", (event) => {
  const progress = (event as CustomEvent<number>).detail;
  if (gameLoadingProgress) gameLoadingProgress.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
  if (gameLoadingCopy) gameLoadingCopy.textContent = `Đang tải hình ảnh · ${Math.round(progress * 100)}%`;
});
window.addEventListener("game-map-ready", () => {
  if (!gameLoadingScreen) return;
  gameLoadingScreen.classList.add("is-hidden");
  window.setTimeout(() => { gameLoadingScreen.hidden = true; }, 320);
});
const kitchenArt: [string, string][] = [
  ["kitchen-shell-art", kitchenRoomShellUrl],
  ["kitchen-layout-art", kitchenObjectsLayoutUrl],
];
let kitchenArtLoaded = false;
const staffAnimationUrls: Record<string, { work: string; rest: string; lazy: string }> = {
  "quang-tin": { work: quangTinWorkUrl, rest: quangTinRestUrl, lazy: quangTinLazyUrl },
  "huy-phu-bep": { work: kitchenPrepStaffChopUrl, rest: kitchenPrepStaffWipeUrl, lazy: kitchenPrepStaffPhoneUrl },
  "co-hanh": { work: coHanhWorkUrl, rest: coHanhRestUrl, lazy: coHanhLazyUrl },
  "line-cook": { work: lineCookWorkUrl, rest: lineCookRestUrl, lazy: lineCookLazyUrl },
  "an-nhien": { work: anNhienWorkUrl, rest: anNhienRestUrl, lazy: anNhienLazyUrl },
};
const maiLinhSpriteUrls = {
  "walk-empty": maiLinhWalkEmptyGifUrl,
  "walk-tray": maiLinhWalkTrayGifUrl,
  idle: maiLinhIdleGifUrl,
  "take-order": maiLinhTakeOrderGifUrl,
  "pickup-kitchen": maiLinhPickupKitchenGifUrl,
  "serve-table": maiLinhServeTableGifUrl,
  rest: maiLinhRestGifUrl,
  phone: maiLinhPhoneGifUrl,
} as const;
const maiLinhWalkDirectionUrls = {
  "walk-empty": import.meta.glob("../assets/characters/staff-roster-v1/server-mai-linh/redrawn-v1/gif/walk-empty/dir-*.gif", {
    eager: true,
    query: "?url",
    import: "default",
  }) as Record<string, string>,
  "walk-tray": import.meta.glob("../assets/characters/staff-roster-v1/server-mai-linh/redrawn-v1/gif/walk-tray/dir-*.gif", {
    eager: true,
    query: "?url",
    import: "default",
  }) as Record<string, string>,
};
type MaiLinhSpriteMotion = keyof typeof maiLinhSpriteUrls;
const staffPortraitById: Record<string, string> = {
  "mai-linh": maiLinhPortraitUrl,
  "quang-tin": quangTinPortraitUrl,
  "huy-phu-bep": tanHuyPortraitUrl,
  "co-hanh": coHanhPortraitUrl,
  "line-cook": lineCookPortraitUrl,
  "an-nhien": anNhienPortraitUrl,
};

function getMaiLinhDirectionRow(from: { x: number; y: number }, to: { x: number; y: number }): number {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const compassStep = ((Math.round(angle / (Math.PI / 4)) % 8) + 8) % 8;
  // Direction indices are S, SW, W, NW, N, NE, E, SE.
  return (compassStep + 6) % 8;
}

function setMaiLinhSpriteMotion(element: HTMLElement, motion: MaiLinhSpriteMotion, directionRow = 4): void {
  const oldMotion = element.dataset.spriteMotion as MaiLinhSpriteMotion | undefined;
  const direction = ((directionRow % 8) + 8) % 8;
  const directionalWalk = motion === "walk-empty" || motion === "walk-tray";
  const walkDirectionPath = `../assets/characters/staff-roster-v1/server-mai-linh/redrawn-v1/gif/${motion}/dir-${direction}.gif`;
  const directionalSpriteUrl = directionalWalk
    ? maiLinhWalkDirectionUrls[motion][walkDirectionPath]
    : undefined;
  const spriteUrl = directionalSpriteUrl ?? maiLinhSpriteUrls[motion];
  if (oldMotion !== motion || element.dataset.spriteDirection !== String(direction)) {
    if (oldMotion) element.classList.remove(`mai-linh-motion-${oldMotion}`);
    element.classList.add(`mai-linh-motion-${motion}`);
    element.dataset.spriteMotion = motion;
    element.dataset.spriteDirection = String(direction);
    element.style.setProperty("--mai-linh-animation", `url(${JSON.stringify(spriteUrl)})`);
  }
  // The redrawn action GIFs have one facing pose, so mirror only when she is
  // facing left. Walking uses the complete eight-direction redrawn set.
  element.classList.toggle("is-mirrored", !directionalSpriteUrl && [1, 2, 3].includes(direction));
}

const MAI_LINH_WORK_HOLD_SECONDS = 32;
let maiLinhWorkHoldUntil = -1;

function getStaffActivity(member: GameSnapshot["staff"][number], snapshot: GameSnapshot): "work" | "rest" | "lazy" {
  if (member.id === "mai-linh") {
    if (!snapshot.inShift || !member.isWorking) maiLinhWorkHoldUntil = -1;
    else {
      const isServing = snapshot.dining.orders.some((order) => ["called", "taking", "queued", "cooking", "ready", "carrying"].includes(order.status))
        || snapshot.dining.guests.some((guest) => ["approaching", "entering", "waiting-order", "waiting-food", "eating", "awaiting-payment"].includes(guest.status));
      if (isServing) maiLinhWorkHoldUntil = snapshot.elapsedSeconds + MAI_LINH_WORK_HOLD_SECONDS;
      if (isServing || snapshot.elapsedSeconds <= maiLinhWorkHoldUntil) {
        if (member.restSeconds <= 0 && member.energy > 18) return "work";
      }
    }
  }
  if (member.restSeconds > 0 || member.energy <= 18) return "rest";
  const hasKitchenWork = snapshot.dining.orders.some((order) => order.status === "cooking");
  if (member.role === "server" && snapshot.dining.orders.some((order) => ["taking", "ready", "carrying"].includes(order.status))) return "work";
  if (member.role === "cashier" && snapshot.dining.guests.some((guest) => guest.status === "awaiting-payment")) return "work";
  if ((member.role === "chef" || member.role === "prep") && hasKitchenWork) return "work";
  if (member.role === "promoter" && snapshot.elapsedSeconds % 32 < 9) return "work";
  return "lazy";
}

function renderRestaurantStaffActors(snapshot: GameSnapshot): void {
  const stage = document.querySelector<HTMLElement>("#restaurant-staff-stage");
  if (!stage) return;
  const deliveryStage = document.querySelector<HTMLElement>("#dining-delivery-stage");
  const serverDelivering = snapshot.dining.orders.some((order) => ["taking", "carrying"].includes(order.status) && order.carriedByStaff)
    || Boolean(deliveryStage?.dataset.returnOrderId);
  const visibleStaff = snapshot.inShift ? snapshot.staff.filter((member) => member.isWorking && !["prep", "chef"].includes(member.role)
    && (!staffEntranceActive || staffEntranceArrivedIds.has(member.id))
    && !(member.role === "server" && serverDelivering)) : [];
  const roleIndexes = new Map<string, number>();
  const actors = visibleStaff.map((member) => {
    const candidate = getStaffCandidate(member.id);
    const activity = getStaffActivity(member, snapshot);
    const animation = staffAnimationUrls[member.id];
    if (!candidate || (member.id !== "mai-linh" && !animation)) return { signature: `${member.id}:missing`, markup: "" };
    const roleIndex = roleIndexes.get(member.role) ?? 0;
    roleIndexes.set(member.role, roleIndex + 1);
    const markup = member.id === "mai-linh"
      ? `<div class="restaurant-staff-sprite role-${member.role} mai-linh-gif" data-staff-id="${member.id}" data-staff-index="${roleIndex}" data-staff-activity="${activity}" aria-hidden="true" title="${candidate.name} · ${getStaffRole(member.role).shortName}"></div>`
      : `<img class="restaurant-staff-sprite role-${member.role}" data-staff-id="${member.id}" data-staff-index="${roleIndex}" src="${animation![activity]}" alt="" aria-hidden="true" title="${candidate.name} · ${getStaffRole(member.role).shortName}">`;
    return {
      signature: `${member.id}:${member.level}:${activity}:${roleIndex}`,
      markup,
    };
  });
  const signature = actors.map((actor) => actor.signature).join(",");
  if (stage.dataset.staffSignature !== signature) {
    stage.dataset.staffSignature = signature;
    stage.innerHTML = actors.map((actor) => actor.markup).join("");
  }
  const maiLinh = stage.querySelector<HTMLElement>('[data-staff-id="mai-linh"]');
  const counterStaffPoint = diningScene.getServiceCounterStaffScreenPoint();
  if (maiLinh && counterStaffPoint && !serverDelivering) {
    const activity = maiLinh.dataset.staffActivity;
    // Work poses now match the actual task: writing is reserved for a table,
    // while waiting at the service counter uses the directional idle pose.
    setMaiLinhSpriteMotion(maiLinh, activity === "rest" ? "rest" : activity === "lazy" ? "phone" : "idle", 1);
    maiLinh.style.left = `${counterStaffPoint.x}px`;
    maiLinh.style.top = `${counterStaffPoint.y}px`;
    maiLinh.style.bottom = "auto";
  }
  for (const actor of stage.querySelectorAll<HTMLElement>(".restaurant-staff-sprite:not([data-staff-id='mai-linh'])")) {
    const member = visibleStaff.find((entry) => entry.id === actor.dataset.staffId);
    if (!member) continue;
    const point = diningScene.getStaffWorkstationScreenPoint(member.role, Number(actor.dataset.staffIndex ?? 0));
    if (!point) continue;
    actor.style.left = `${point.x}px`;
    actor.style.top = `${point.y}px`;
    actor.style.bottom = "auto";
  }
}

function renderKitchenStaffSprite(selector: string, member: GameSnapshot["staff"][number] | undefined, snapshot: GameSnapshot): void {
  const sprite = document.querySelector<HTMLImageElement>(selector);
  if (!sprite) return;
  if (!member || !snapshot.inShift || !member.isWorking || (staffEntranceActive && !staffEntranceArrivedIds.has(member.id))) {
    sprite.hidden = true;
    delete sprite.dataset.activity;
    return;
  }

  const animation = staffAnimationUrls[member.id];
  if (!animation) {
    sprite.hidden = true;
    return;
  }
  const activity = getStaffActivity(member, snapshot);
  const source = member.id === "huy-phu-bep" && activity === "lazy" && Math.floor(snapshot.elapsedSeconds / 12) % 2 === 1
    ? kitchenPrepStaffLookUrl
    : animation[activity];
  const sourceKey = `${activity}:${source}`;
  if (sprite.dataset.activity !== sourceKey) {
    sprite.src = source;
    sprite.dataset.activity = sourceKey;
  }
  sprite.hidden = false;
}

const STAFF_ENTRANCE_DIALOGUES: Record<string, readonly string[]> = {
  "mai-linh": [
    "Mới mở mắt ra đã thấy bàn với ghế... thôi, làm!",
    "Cầu cho ca nay khách gọi món từ từ giùm em.",
    "Chân còn chưa tỉnh mà quán mở cửa rồi đó hả trời.",
  ],
  "quang-tin": [
    "Hôm nay ai trả tiền lẻ là tui khóc tại quầy luôn á.",
    "Cầu cho máy tính tiền đừng dở chứng giữa giờ đông.",
    "Chưa đếm tiền đã thấy mỏi ngón tay rồi nha.",
  ],
  "huy-phu-bep": [
    "Ai ăn rau nhớ thương giùm người đứng nhặt rau nghen.",
    "Nay mà hành thêm ba bao nữa là tui xin nằm cạnh thớt.",
    "Bếp chưa nóng mà cái lưng tui nóng trước rồi.",
  ],
  "co-hanh": [
    "Đứa nào để cháy bếp là tự ở lại chùi nghen!",
    "Cô mới tới mà nghe mùi phiếu món dí sau lưng rồi đó.",
    "Hôm nay gọi món vừa thôi, cái vai cô còn muốn sống.",
  ],
  "line-cook": [
    "Xin đừng gọi mười món cùng lúc, bếp cũng biết buồn đó.",
    "Vừa bước vô đã nghe cái chảo réo tên mình rồi.",
    "Ca nay mà đông nữa chắc tui xào luôn cả giấc ngủ.",
  ],
  "an-nhien": [
    "Đứng mời khách cả ca, tối về khỏi cần tập chân.",
    "Hôm nay mà khách lơ nữa là tui mời luôn cây cột điện.",
    "Miệng cười tươi, trong lòng chỉ muốn kiếm cái ghế.",
  ],
};

function queueStaffEntranceTimer(callback: () => void, delay: number): void {
  const timer = window.setTimeout(() => {
    staffEntranceTimers.delete(timer);
    callback();
  }, delay);
  staffEntranceTimers.add(timer);
}

function clearStaffEntranceSequence(): void {
  staffEntranceRunId += 1;
  for (const timer of staffEntranceTimers) window.clearTimeout(timer);
  staffEntranceTimers.clear();
  document.querySelector<HTMLElement>("#staff-entrance-stage")?.replaceChildren();
  staffEntranceActive = false;
  staffEntranceArrivedIds.clear();
  if (app) delete app.dataset.staffEntering;
}

function finishStaffEntranceActor(memberId: string, runId: number, total: number): void {
  if (runId !== staffEntranceRunId) return;
  staffEntranceArrivedIds.add(memberId);
  document.querySelector<HTMLElement>(`#staff-entrance-stage [data-staff-id="${memberId}"]`)?.remove();
  const snapshot = store.getSnapshot();
  renderRestaurantStaffActors(snapshot);
  renderKitchenStaff(snapshot);
  if (staffEntranceArrivedIds.size < total) return;
  staffEntranceActive = false;
  staffEntranceArrivedIds.clear();
  if (app) delete app.dataset.staffEntering;
  renderRestaurantStaffActors(snapshot);
  renderKitchenStaff(snapshot);
}

function startStaffEntranceSequence(snapshot: GameSnapshot): void {
  const stage = document.querySelector<HTMLElement>("#staff-entrance-stage");
  if (!stage) {
    staffEntranceActive = false;
    return;
  }
  const members = snapshot.staff.filter((member) => member.isWorking);
  if (members.length === 0) {
    staffEntranceActive = false;
    return;
  }
  const runId = ++staffEntranceRunId;
  staffEntranceActive = true;
  staffEntranceArrivedIds.clear();
  stage.replaceChildren();
  if (app) app.dataset.staffEntering = "true";
  const roleIndexes = new Map<string, number>();
  members.forEach((member, memberIndex) => {
    const candidate = getStaffCandidate(member.id);
    if (!candidate) {
      finishStaffEntranceActor(member.id, runId, members.length);
      return;
    }
    const roleIndex = roleIndexes.get(member.role) ?? 0;
    roleIndexes.set(member.role, roleIndex + 1);
    const route = diningScene.getStaffEntranceRouteScreenPoints(member.role, roleIndex);
    if (!route || route.length < 2) {
      finishStaffEntranceActor(member.id, runId, members.length);
      return;
    }
    const dialoguePool = STAFF_ENTRANCE_DIALOGUES[member.id] ?? ["Lại thêm một ca nữa, ráng thôi bà con ơi."];
    const dialogue = dialoguePool[Math.floor(Math.random() * dialoguePool.length)]!;
    const actor = document.createElement("div");
    actor.className = `staff-entrance-actor role-${member.role}${member.id === "mai-linh" ? " is-mai-linh" : ""}`;
    actor.dataset.staffId = member.id;
    actor.hidden = true;
    actor.style.left = `${route[0]!.x}px`;
    actor.style.top = `${route[0]!.y}px`;
    const bubble = document.createElement("div");
    bubble.className = "staff-entrance-bubble";
    bubble.textContent = dialogue;
    bubble.hidden = true;
    let sprite: HTMLElement;
    if (member.id === "mai-linh") {
      sprite = document.createElement("div");
      sprite.className = "staff-entrance-sprite mai-linh-gif";
      setMaiLinhSpriteMotion(sprite, "walk-empty", getMaiLinhDirectionRow(route[0]!, route[1]!));
    } else {
      const image = document.createElement("img");
      image.className = "staff-entrance-sprite";
      image.src = staffAnimationUrls[member.id]?.lazy ?? staffPortraitById[member.id] ?? "";
      image.alt = "";
      sprite = image;
    }
    actor.append(sprite, bubble);
    stage.append(actor);
    const startDelay = memberIndex * 720;
    queueStaffEntranceTimer(() => {
      if (runId !== staffEntranceRunId || !store.getSnapshot().inShift) return;
      actor.hidden = false;
      const tail = route.slice(2);
      const keyframes: Keyframe[] = [
        { left: `${route[0]!.x}px`, top: `${route[0]!.y}px`, offset: 0, opacity: 0.72 },
        { left: `${route[1]!.x}px`, top: `${route[1]!.y}px`, offset: 0.18, opacity: 1 },
        { left: `${route[1]!.x}px`, top: `${route[1]!.y}px`, offset: 0.48, opacity: 1 },
        ...tail.map((point, index) => ({
          left: `${point.x}px`,
          top: `${point.y}px`,
          offset: 0.48 + ((index + 1) / tail.length) * 0.52,
          opacity: index === tail.length - 1 && ["prep", "chef"].includes(member.role) ? 0 : 1,
        })),
      ];
      const animation = actor.animate(keyframes, { duration: 4_800, easing: "linear", fill: "forwards" });
      queueStaffEntranceTimer(() => {
        if (runId !== staffEntranceRunId) return;
        bubble.hidden = false;
        if (member.id === "mai-linh") setMaiLinhSpriteMotion(sprite, "idle", 0);
      }, 820);
      queueStaffEntranceTimer(() => {
        if (runId !== staffEntranceRunId) return;
        bubble.hidden = true;
        if (member.id === "mai-linh") {
          const nextPoint = route[2] ?? route[route.length - 1]!;
          setMaiLinhSpriteMotion(sprite, "walk-empty", getMaiLinhDirectionRow(route[1]!, nextPoint));
        }
      }, 2_320);
      animation.addEventListener("finish", () => finishStaffEntranceActor(member.id, runId, members.length), { once: true });
    }, startDelay);
  });
}

function renderKitchenStaff(snapshot: GameSnapshot): void {
  const prep = snapshot.staff.find((member) => member.id === "huy-phu-bep");
  const hanh = snapshot.staff.find((member) => member.id === "co-hanh");
  const lineCook = snapshot.staff.find((member) => member.id === "line-cook");
  renderKitchenStaffSprite("#kitchen-prep-staff", prep, snapshot);
  renderKitchenStaffSprite("#kitchen-chef-hanh", hanh, snapshot);
  renderKitchenStaffSprite("#kitchen-chef-line", lineCook, snapshot);
  const choppedVegetables = document.querySelector<HTMLImageElement>("#kitchen-chopped-vegetables");
  if (choppedVegetables) {
    if (!choppedVegetables.dataset.srcReady) {
      choppedVegetables.src = choppedVegetablesUrl;
      choppedVegetables.dataset.srcReady = "true";
    }
    const hasKitchenWork = snapshot.dining.orders.some((order) => order.status === "cooking");
    choppedVegetables.hidden = !prep?.isWorking || !snapshot.inShift || !hasKitchenWork || prep.restSeconds > 0;
  }
}

function renderKitchenStove(snapshot: GameSnapshot): void {
  const indicator = document.querySelector<HTMLElement>("#kitchen-stove-indicator");
  if (!indicator) return;
  const cookingOrder = snapshot.dining.orders.find((order) => order.status === "cooking");
  const queuedOrder = snapshot.dining.orders.find((order) => order.status === "queued");
  const order = cookingOrder ?? queuedOrder;
  if (!order || !snapshot.inShift) {
    indicator.hidden = true;
    return;
  }

  const isCooking = order.status === "cooking";
  const recipe = RECIPES[order.recipe];
  const missingIngredient = recipe.ingredients.find((ingredient) => (snapshot.inventory[ingredient.id] ?? 0) < ingredient.quantity);
  const missingName = missingIngredient && INGREDIENTS.find((ingredient) => ingredient.id === missingIngredient.id)?.name;
  indicator.hidden = false;
  indicator.classList.toggle("is-cooking", isCooking);
  indicator.classList.toggle("has-missing-stock", Boolean(missingIngredient));
  if (isCooking) {
    indicator.innerHTML = `<span class="kitchen-stove-indicator-icon" aria-hidden="true">🔥</span><span class="kitchen-stove-indicator-copy"><strong>ĐANG NẤU</strong><small>Bàn ${order.tableId} · còn ${order.cookSeconds}s</small></span>`;
    indicator.setAttribute("aria-label", `Đầu bếp đang nấu ${recipe.name} cho bàn ${order.tableId}, còn ${order.cookSeconds} giây`);
  } else if (missingIngredient) {
    indicator.innerHTML = `<span class="kitchen-stove-indicator-icon" aria-hidden="true">🧺</span><span class="kitchen-stove-indicator-copy"><strong>CHỜ NGUYÊN LIỆU</strong><small>${missingName}</small></span>`;
    indicator.setAttribute("aria-label", `Đang chờ ${missingName} để đầu bếp nấu món cho bàn ${order.tableId}`);
  } else {
    const cookAvailable = snapshot.staff.some((member) => (member.role === "chef" || member.role === "prep")
      && member.isWorking && member.restSeconds <= 0 && member.energy > 18);
    indicator.innerHTML = `<span class="kitchen-stove-indicator-icon" aria-hidden="true">${cookAvailable ? "🍳" : "💤"}</span><span class="kitchen-stove-indicator-copy"><strong>${cookAvailable ? "ĐẦU BẾP ĐANG NHẬN PHIẾU" : "ĐẦU BẾP ĐANG NGHỈ"}</strong><small>${cookAvailable ? `Bàn ${order.tableId} · ${recipe.name}` : `Bàn ${order.tableId} · chờ nhân viên hồi sức`}</small></span>`;
    indicator.setAttribute("aria-label", cookAvailable
      ? `Phiếu ${recipe.name} bàn ${order.tableId} đang chờ đầu bếp`
      : `Đầu bếp đang nghỉ, đơn bàn ${order.tableId} sẽ được nấu khi nhân viên hồi sức`);
  }
}

function renderKitchenPass(snapshot: GameSnapshot): void {
  const stage = document.querySelector<HTMLElement>("#kitchen-pass-stage");
  if (!stage) return;
  const readyOrders = snapshot.dining.orders.filter((order) => order.status === "ready");
  const hasAvailableServer = snapshot.inShift && snapshot.staff.some((member) => member.role === "server"
    && member.isWorking && member.restSeconds <= 0 && member.energy > 18);
  const serverPickup = document.querySelector<HTMLElement>("#kitchen-server-pickup");
  if (serverPickup) {
    const hasDishToPickUp = readyOrders.length > 0 && hasAvailableServer;
    serverPickup.hidden = !hasDishToPickUp;
    if (hasDishToPickUp) setMaiLinhSpriteMotion(serverPickup, "pickup-kitchen", 0);
  }
  const signature = readyOrders.map((order) => `${order.id}:${order.recipe}:${order.tableId}`).join(",");
  const serviceSignature = `${signature}:${hasAvailableServer}`;
  if (stage.dataset.passSignature === serviceSignature) return;
  stage.dataset.passSignature = serviceSignature;
  stage.innerHTML = readyOrders.slice(0, 4).map((order, index) => `<button class="kitchen-pass-dish ${hasAvailableServer ? "has-server" : "needs-manual-service"}" data-action="dining-take-dish" data-order-id="${order.id}" type="button" style="--pass-index:${index}" aria-label="${hasAvailableServer ? `Món ${RECIPES[order.recipe].name} đang chờ phục vụ tới bàn ${order.tableId}` : `Chạm để bưng ${RECIPES[order.recipe].name} tới bàn ${order.tableId}`}" title="${hasAvailableServer ? `Nhân viên sẽ bưng tới bàn ${order.tableId}` : `Chạm để bưng tới bàn ${order.tableId}`}" ${hasAvailableServer ? "disabled" : ""}>
    <img src="${DISH_ART_URLS[order.recipe]}" alt="" draggable="false">
    <small>${hasAvailableServer ? `Bàn ${order.tableId}` : `Bàn ${order.tableId} · Bưng món`}</small>
  </button>`).join("");
}

function pointAlongScreenRoute(points: { x: number; y: number }[], progress: number): { x: number; y: number } {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0]!;
  const distances = points.slice(1).map((point, index) => Math.hypot(point.x - points[index]!.x, point.y - points[index]!.y));
  const total = distances.reduce((sum, distance) => sum + distance, 0);
  let remaining = Math.max(0, Math.min(1, progress)) * total;
  for (let index = 0; index < distances.length; index += 1) {
    const distance = distances[index]!;
    if (remaining > distance && index < distances.length - 1) {
      remaining -= distance;
      continue;
    }
    const from = points[index]!;
    const to = points[index + 1]!;
    const amount = distance > 0 ? Math.min(1, remaining / distance) : 1;
    return { x: from.x + (to.x - from.x) * amount, y: from.y + (to.y - from.y) * amount };
  }
  return points[points.length - 1]!;
}

function directionAlongScreenRoute(points: { x: number; y: number }[], progress: number): number {
  if (points.length < 2) return 4;
  const distances = points.slice(1).map((point, index) => Math.hypot(point.x - points[index]!.x, point.y - points[index]!.y));
  const total = distances.reduce((sum, distance) => sum + distance, 0);
  let remaining = Math.max(0, Math.min(1, progress)) * total;
  for (let index = 0; index < distances.length; index += 1) {
    const distance = distances[index]!;
    if (remaining > distance && index < distances.length - 1) {
      remaining -= distance;
      continue;
    }
    const from = points[index]!;
    const to = points[index + 1]!;
    return getMaiLinhDirectionRow(from, to);
  }
  return getMaiLinhDirectionRow(points[points.length - 2]!, points[points.length - 1]!);
}

function renderDiningDelivery(snapshot: GameSnapshot): void {
  const stage = document.querySelector<HTMLElement>("#dining-delivery-stage");
  if (!stage) return;
  const order = snapshot.dining.orders.find((entry) => entry.status === "taking" || entry.status === "carrying");
  if (snapshot.serviceMode !== "dining") {
    if (diningDeliveryReturnTimer !== null) window.clearTimeout(diningDeliveryReturnTimer);
    diningDeliveryReturnTimer = null;
    stage.replaceChildren();
    delete stage.dataset.orderId;
    delete stage.dataset.returnOrderId;
    delete stage.dataset.carriedByStaff;
    return;
  }

  if (!order) {
    const actor = stage.querySelector<HTMLElement>(".dining-delivery-actor");
    const tableId = Number(stage.dataset.tableId);
    const serviceRoute = diningScene.getServiceTableRouteScreenPoints(tableId);
    const homePoint = serviceRoute?.[0] ?? diningScene.getServiceCounterStaffScreenPoint();
    const destination = serviceRoute?.[serviceRoute.length - 1] ?? diningScene.getServiceTableApproachScreenPoint(tableId);
    if (actor && stage.dataset.carriedByStaff === "true" && stage.dataset.orderId && !stage.dataset.returnOrderId && homePoint && destination) {
      stage.dataset.returnOrderId = stage.dataset.orderId;
      actor.classList.add("is-returning");
      actor.querySelector(".dining-delivery-dish")?.remove();
      actor.querySelector("span")?.remove();
      const person = actor.querySelector<HTMLElement>(".dining-delivery-person");
      const returnRoute = serviceRoute ? [...serviceRoute].reverse() : [destination, homePoint];
      const firstTurn = returnRoute[1] ?? homePoint;
      if (person) setMaiLinhSpriteMotion(person, "walk-empty", getMaiLinhDirectionRow(destination, firstTurn));
      actor.dataset.staffMotion = "walk-empty";
      actor.style.left = `${destination.x}px`;
      actor.style.top = `${destination.y}px`;
      const returnDistances = returnRoute.slice(1).map((point, index) => Math.hypot(point.x - returnRoute[index]!.x, point.y - returnRoute[index]!.y));
      const returnDistance = returnDistances.reduce((sum, distance) => sum + distance, 0);
      let coveredDistance = 0;
      const returnKeyframes = returnRoute.map((point, index) => {
        if (index > 0) coveredDistance += returnDistances[index - 1]!;
        return { left: `${point.x}px`, top: `${point.y}px`, offset: returnDistance > 0 ? coveredDistance / returnDistance : 1 };
      });
      actor.style.transition = "none";
      const returnAnimation = actor.animate(returnKeyframes, { duration: 2_200, easing: "linear", fill: "forwards" });
      diningDeliveryReturnTimer = window.setTimeout(() => {
        returnAnimation.cancel();
        stage.replaceChildren();
        delete stage.dataset.orderId;
        delete stage.dataset.returnOrderId;
        delete stage.dataset.carriedByStaff;
        diningDeliveryReturnTimer = null;
        renderRestaurantStaffActors(store.getSnapshot());
      }, 2_220);
      return;
    }
    if (stage.dataset.returnOrderId) return;
    stage.replaceChildren();
    delete stage.dataset.orderId;
    delete stage.dataset.carriedByStaff;
    delete stage.dataset.tableId;
    return;
  }

  const serviceRoute = order.carriedByStaff ? diningScene.getServiceTableRouteScreenPoints(order.tableId) : null;
  const homePoint = order.carriedByStaff
    ? serviceRoute?.[0] ?? diningScene.getServiceCounterStaffScreenPoint()
    : diningScene.getServiceCounterScreenPoint();
  const destination = order.carriedByStaff
    ? serviceRoute?.[serviceRoute.length - 1] ?? diningScene.getServiceTableApproachScreenPoint(order.tableId)
    : diningScene.getTableScreenPoint(order.tableId);
  const tableCenter = diningScene.getTableScreenPoint(order.tableId);
  if (!homePoint || !destination || !tableCenter) return;
  if (diningDeliveryReturnTimer !== null) window.clearTimeout(diningDeliveryReturnTimer);
  diningDeliveryReturnTimer = null;
  delete stage.dataset.returnOrderId;
  const duration = order.status === "taking" ? DINING_ORDER_TAKE_SECONDS : DINING_ORDER_DELIVERY_SECONDS;
  const remaining = order.status === "taking" ? order.takeSeconds : order.deliverySeconds;
  const progress = Math.max(0, Math.min(1, (duration - remaining) / duration));
  const approachProgress = DINING_ORDER_APPROACH_SECONDS / DINING_ORDER_TAKE_SECONDS;
  const guestDialogueEndProgress = (DINING_ORDER_APPROACH_SECONDS + DINING_ORDER_GUEST_DIALOGUE_SECONDS) / DINING_ORDER_TAKE_SECONDS;
  const serverReplyEndProgress = (DINING_ORDER_APPROACH_SECONDS + DINING_ORDER_GUEST_DIALOGUE_SECONDS + DINING_ORDER_SERVER_REPLY_SECONDS) / DINING_ORDER_TAKE_SECONDS;
  const interactionProgress = order.status === "taking" ? approachProgress : 0.82;
  const travelProgress = order.status === "taking" ? Math.min(1, progress / approachProgress) : progress;
  const movementProgress = order.status === "carrying" ? Math.min(1, progress / interactionProgress) : travelProgress;
  const route = serviceRoute ?? [homePoint, destination];
  const nextPoint = pointAlongScreenRoute(route, movementProgress);
  const directionRow = progress >= interactionProgress
    ? getMaiLinhDirectionRow(destination, tableCenter)
    : directionAlongScreenRoute(route, movementProgress);
  const staffMotion: MaiLinhSpriteMotion = order.status === "taking"
    ? progress < approachProgress ? "walk-empty" : progress < serverReplyEndProgress ? "idle" : "take-order"
    : progress >= 0.82 ? "serve-table" : "walk-tray";
  if (stage.dataset.orderId !== order.id) {
    stage.dataset.orderId = order.id;
    stage.dataset.carriedByStaff = String(order.carriedByStaff);
    stage.dataset.tableId = String(order.tableId);
    stage.innerHTML = `<div class="dining-delivery-actor ${order.carriedByStaff ? "is-staff" : "is-player"} ${order.status === "taking" ? "is-taking-order" : "is-delivering-dish"}" style="left:${homePoint.x}px;top:${homePoint.y}px">
      ${order.carriedByStaff ? `<div class="dining-delivery-person mai-linh-gif" aria-hidden="true"></div>` : ""}
      ${order.status === "taking" && order.carriedByStaff ? `<div class="dining-order-staff-bubble" hidden>Dạ, để em ghi từng món cho bàn mình ạ.</div>` : ""}
      ${order.status === "carrying" && !order.carriedByStaff ? `<img class="dining-delivery-dish" src="${DISH_ART_URLS[order.recipe]}" alt="">` : ""}
      ${order.status === "carrying" ? `<span>Bàn ${order.tableId}</span>` : ""}
    </div>`;
  }
  const actor = stage.querySelector<HTMLElement>(".dining-delivery-actor");
  if (!actor) return;
  if (order.carriedByStaff) {
    actor.dataset.staffMotion = staffMotion;
    const person = actor.querySelector<HTMLElement>(".dining-delivery-person");
    if (person) setMaiLinhSpriteMotion(person, staffMotion, directionRow);
    const staffBubble = actor.querySelector<HTMLElement>(".dining-order-staff-bubble");
    if (staffBubble) staffBubble.hidden = !(progress >= guestDialogueEndProgress && progress < serverReplyEndProgress);
    actor.querySelector(".dining-delivery-dish")?.remove();
  }
  const nextX = nextPoint.x;
  const nextY = nextPoint.y;
  if (actor.dataset.pathPosition !== `${nextX},${nextY}`) {
    actor.dataset.pathPosition = `${nextX},${nextY}`;
    actor.style.left = `${nextX}px`;
    actor.style.top = `${nextY}px`;
  }
}

const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
const initialCanvasBounds = phaserRoot.getBoundingClientRect();
// A slightly slower frame cadence keeps animated characters from looking rushed.
const SPRITE_ANIMATION_SPEED = 0.85;
const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "phaser-root",
  width: Math.max(1, Math.round(initialCanvasBounds.width * devicePixelRatio)),
  height: Math.max(1, Math.round(initialCanvasBounds.height * devicePixelRatio)),
  backgroundColor: "#c9a276",
  scale: {
    mode: Phaser.Scale.NONE,
  },
  render: {
    antialias: true,
    roundPixels: false,
  },
  scene: [scene, diningScene],
});
game.anims.globalTimeScale = SPRITE_ANIMATION_SPEED;
game.scene.add("wholesale-market", wholesaleMarketScene, false);
game.scene.add("home-interior", homeInteriorScene, false);
const updateStreetStatus = (): void => {
  const status = document.querySelector<HTMLElement>("#street-status");
  const indicator = document.querySelector<HTMLElement>("#street-crowd-indicator");
  if (homeEntryPrompt) homeEntryPrompt.hidden = homeOpen || !scene.isHomeZoneActive();
  if (scene.isHomeZoneActive()) {
    if (status) status.textContent = "Khu nhà dân";
    indicator?.removeAttribute("data-crowd");
  } else if (scene.isWholesaleMarketZoneActive()) {
    if (status) status.textContent = "Chợ đầu mối";
    indicator?.removeAttribute("data-crowd");
  } else {
    if (status) status.textContent = "Góc phố thân quen";
    indicator?.removeAttribute("data-crowd");
  }
};
const updateOutsideNavLabel = (): void => {
  const outsideLabel = document.querySelector<HTMLElement>("#outside-nav-label");
  if (outsideLabel) outsideLabel.textContent = store.getSnapshot().serviceMode === "dining"
    ? "Ra phố"
    : scene.isNearShopEntrance() ? "Vào quán" : "Ngoài phố";
};
game.events.once(Phaser.Core.Events.READY, () => {
  scene.events.on("street-zone-changed", updateStreetStatus);
  scene.events.on("street-crowd-changed", () => {
    store.setStreetDemandMultiplier(scene.getStreetCrowdState().customerArrivalMultiplier);
    updateStreetStatus();
  });
  scene.events.on("street-shop-entrance-nearby", updateOutsideNavLabel);
  scene.events.on("street-enter-home", openHome);
  scene.events.on("street-enter-wholesale-market", openWholesaleMarket);
  wholesaleMarketScene.events.on("market-section-changed", updateWholesaleMarketSectionUI);
  store.setStreetDemandMultiplier(scene.getStreetCrowdState().customerArrivalMultiplier);
  updateStreetStatus();
  updateOutsideNavLabel();
});

const movementJoystick = document.querySelector<HTMLButtonElement>("#street-joystick");
const movementJoystickKnob = document.querySelector<HTMLElement>("#street-joystick-knob");
let movementJoystickPointerId: number | null = null;
const updateMovementJoystick = (event: PointerEvent): void => {
  if (!movementJoystick || !movementJoystickKnob) return;
  const bounds = movementJoystick.getBoundingClientRect();
  const maxTravel = Math.max(1, Math.min(bounds.width, bounds.height) / 2 - movementJoystickKnob.offsetWidth / 2 - 4);
  let offsetX = event.clientX - (bounds.left + bounds.width / 2);
  let offsetY = event.clientY - (bounds.top + bounds.height / 2);
  const distance = Math.hypot(offsetX, offsetY);
  if (distance > maxTravel) {
    offsetX *= maxTravel / distance;
    offsetY *= maxTravel / distance;
  }
  let directionX = offsetX / maxTravel;
  let directionY = offsetY / maxTravel;
  if (Math.hypot(directionX, directionY) < 0.16) {
    offsetX = 0;
    offsetY = 0;
    directionX = 0;
    directionY = 0;
  }
  movementJoystickKnob.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  if (homeOpen) homeInteriorScene.setMovementVector(directionX, directionY);
  else scene.setMovementVector(directionX, directionY);
};
const resetMovementJoystick = (pointerId?: number): void => {
  if (pointerId !== undefined && movementJoystickPointerId !== pointerId) return;
  movementJoystickPointerId = null;
  if (movementJoystickKnob) movementJoystickKnob.style.transform = "translate3d(0,0,0)";
  scene.setMovementVector(0, 0);
  homeInteriorScene.setMovementVector(0, 0);
};
movementJoystick?.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (movementJoystickPointerId !== null) return;
  event.preventDefault();
  movementJoystickPointerId = event.pointerId;
  updateMovementJoystick(event);
  try {
    movementJoystick.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture can fail if the browser cancels the gesture during resize.
  }
});
movementJoystick?.addEventListener("pointermove", (event) => {
  if (movementJoystickPointerId !== event.pointerId) return;
  event.preventDefault();
  updateMovementJoystick(event);
});
movementJoystick?.addEventListener("lostpointercapture", (event) => resetMovementJoystick(event.pointerId));
window.addEventListener("pointerup", (event) => resetMovementJoystick(event.pointerId));
window.addEventListener("pointercancel", (event) => resetMovementJoystick(event.pointerId));
window.addEventListener("blur", () => resetMovementJoystick());

const resizeGameCanvasForDpr = (): void => {
  const bounds = phaserRoot.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(bounds.width * dpr));
  const height = Math.max(1, Math.round(bounds.height * dpr));
  scene.setDevicePixelRatio(dpr);
  diningScene.setDevicePixelRatio(dpr);
  homeInteriorScene.setDevicePixelRatio(dpr);
  wholesaleMarketScene.setDevicePixelRatio(dpr);
  if (game.scale.width !== width || game.scale.height !== height) game.scale.resize(width, height);
  game.canvas.style.width = `${bounds.width}px`;
  game.canvas.style.height = `${bounds.height}px`;
  game.scale.refresh();
};

const canvasResizeObserver = new ResizeObserver(resizeGameCanvasForDpr);
canvasResizeObserver.observe(phaserRoot);
window.addEventListener("resize", resizeGameCanvasForDpr, { passive: true });
game.events.once(Phaser.Core.Events.READY, resizeGameCanvasForDpr);

let phaserReady = false;
function applyLocationScenes(): void {
  if (!phaserReady) return;
  if (wholesaleMarketOpen) {
    scene.setMapInteractionEnabled(false);
    diningScene.setInteractionEnabled(false);
    homeInteriorScene.setInteractionEnabled(false);
    if (homeInteriorStarted && !homeInteriorSleeping) {
      scene.scene.setVisible(false, "home-interior");
      scene.scene.sleep("home-interior");
      homeInteriorSleeping = true;
    }
    scene.scene.setVisible(false, "neighborhood");
    scene.scene.setVisible(false, "dining-room");
    if (!wholesaleMarketStarted) {
      scene.scene.launch("wholesale-market");
      wholesaleMarketStarted = true;
    } else if (wholesaleMarketSleeping) {
      scene.scene.wake("wholesale-market");
      wholesaleMarketSleeping = false;
    }
    scene.scene.setVisible(true, "wholesale-market");
    return;
  }
  if (wholesaleMarketStarted && !wholesaleMarketSleeping) {
    scene.scene.sleep("wholesale-market");
    wholesaleMarketSleeping = true;
  }
  if (homeOpen) {
    scene.setMapInteractionEnabled(false);
    diningScene.setInteractionEnabled(false);
    homeInteriorScene.setHomeStage(store.getSnapshot().cartLevel);
    homeInteriorScene.setInteractionEnabled(true);
    scene.scene.setVisible(false, "neighborhood");
    scene.scene.setVisible(false, "dining-room");
    if (!homeInteriorStarted) {
      scene.scene.launch("home-interior");
      homeInteriorStarted = true;
      homeInteriorSleeping = false;
    } else if (homeInteriorSleeping) {
      scene.scene.wake("home-interior");
      homeInteriorSleeping = false;
    }
    scene.scene.setVisible(true, "home-interior");
    return;
  }
  if (homeInteriorStarted && !homeInteriorSleeping) {
    homeInteriorScene.setInteractionEnabled(false);
    scene.scene.setVisible(false, "home-interior");
    scene.scene.sleep("home-interior");
    homeInteriorSleeping = true;
  }
  if (store.getSnapshot().serviceMode === "dining") {
    scene.setMapInteractionEnabled(false);
    diningScene.setInteractionEnabled(diningView === "tables");
    // Keep NeighborhoodScene active but invisible: its existing 1-second timer
    // remains the single source of GameStore.tick() for both locations.
    scene.scene.setVisible(false, "neighborhood");
    if (!scene.scene.isActive("dining-room")) scene.scene.launch("dining-room");
    scene.scene.setVisible(true, "dining-room");
  } else {
    diningScene.setInteractionEnabled(false);
    scene.scene.setVisible(false, "dining-room");
    scene.scene.setVisible(true, "neighborhood");
    scene.setMapInteractionEnabled(true);
  }
}

function openHome(): void {
  if (store.getSnapshot().serviceMode !== "street" || !scene.isHomeZoneActive()) return;
  selectTab("outside");
  homeOpen = true;
  homeInteriorScene.setHomeStage(store.getSnapshot().cartLevel);
  if (homeStageCopy) homeStageCopy.textContent = `CẤP NHÀ ${String(store.getSnapshot().cartLevel).padStart(2, "0")} / 12`;
  if (homeInterface) homeInterface.hidden = false;
  if (app) app.dataset.location = "home";
  updateStreetStatus();
  applyLocationScenes();
}

function closeHome(): void {
  homeOpen = false;
  if (homeInterface) homeInterface.hidden = true;
  if (app) app.dataset.location = "street";
  updateStreetStatus();
  applyLocationScenes();
}

function openWholesaleMarket(): void {
  if (store.getSnapshot().serviceMode !== "street") return;
  closeMarketShop();
  selectTab("outside");
  wholesaleMarketOpen = true;
  wholesaleMarketScene.setSection("grocery");
  updateWholesaleMarketSectionUI();
  if (wholesaleMarketInterface) wholesaleMarketInterface.hidden = false;
  if (app) app.dataset.location = "market";
  applyLocationScenes();
}

function closeWholesaleMarket(): void {
  closeMarketShop();
  wholesaleMarketOpen = false;
  wholesaleMarketScene.setSection("exterior");
  if (wholesaleMarketInterface) wholesaleMarketInterface.hidden = true;
  if (app) app.dataset.location = store.getSnapshot().serviceMode === "dining" ? "dining" : "street";
  applyLocationScenes();
}

function updateWholesaleMarketSectionUI(): void {
  const section = wholesaleMarketScene.getSection();
  const sectionCopy = {
    exterior: "Mặt tiền · bãi xe máy",
    grocery: "Rau củ · nông sản",
    "grocery-clothing": "Tạp hóa · quần áo",
    "meat-fish": "Sạp thịt · cá",
    "seafood-vegetables": "Hải sản · rau xanh",
    "shoes-bags": "Giày dép · túi xách",
  } satisfies Record<WholesaleMarketSection, string>;
  const sectionIndex = wholesaleMarketScene.getInteriorSectionIndex();
  const isInterior = sectionIndex >= 0;
  if (wholesaleMarketHeldBasket) wholesaleMarketHeldBasket.hidden = !wholesaleMarketOpen || !isInterior;
  for (const button of document.querySelectorAll<HTMLButtonElement>(".market-stall-board")) {
    const stall = getMarketStall(button.dataset.marketStall);
    const isVisible = wholesaleMarketOpen && Boolean(stall && stall.products.length > 0 && stall.section === section);
    button.hidden = !isVisible;
    if (!stall) continue;

    const isLeftStall = Boolean(stall.position.left);
    button.style.left = isLeftStall ? "33%" : "auto";
    button.style.right = isLeftStall ? "auto" : "33%";
    button.style.top = "32%";
    button.style.translate = isLeftStall ? "-50% 0" : "50% 0";
    button.setAttribute("aria-label", `Mở bảng mua quầy ${stall.boardLabel.toLowerCase()}`);
    const boardName = button.querySelector<HTMLElement>(".market-stall-board-name");
    if (boardName) boardName.textContent = stall.boardLabel;

  }
  const selectedStall = selectedMarketStallId ? getMarketStall(selectedMarketStallId) : undefined;
  if (selectedStall && selectedStall.section !== section) closeMarketShop();
  if (wholesaleMarketSectionCopy) {
    wholesaleMarketSectionCopy.textContent = sectionCopy[section];
  }
  if (wholesaleMarketSectionProgress) {
    wholesaleMarketSectionProgress.textContent = isInterior
      ? `${sectionIndex + 1} / ${WHOLESALE_MARKET_INTERIOR_SECTIONS.length}`
      : "";
  }
  const hasNextStall = isInterior && sectionIndex < WHOLESALE_MARKET_INTERIOR_SECTIONS.length - 1;
  wholesaleMarketStallArrow?.toggleAttribute("hidden", !hasNextStall);
  if (wholesaleMarketStallArrow && hasNextStall) {
    const nextSection = WHOLESALE_MARKET_INTERIOR_SECTIONS[sectionIndex + 1];
    wholesaleMarketStallArrow.setAttribute("aria-label", `Đi tới quầy tiếp theo: ${sectionCopy[nextSection]}`);
  }
  if (wholesaleMarketPanCopy) {
    wholesaleMarketPanCopy.textContent = !isInterior
      ? "Kéo ngang để xem bãi xe và các dãy nhà"
      : hasNextStall
        ? sectionIndex === 0
          ? "Vuốt xuống hoặc chạm mũi tên để tới quầy tiếp theo"
          : "Vuốt xuống để đi tiếp · vuốt lên để quay lại"
        : "Vuốt lên để quay lại quầy trước";
    wholesaleMarketPanCopy.closest(".market-pan-hint")?.toggleAttribute("hidden", !isInterior);
  }
}

function openMarketStall(stallId: string | undefined): void {
  const stall = getMarketStall(stallId);
  if (!wholesaleMarketOpen || !stall || stall.products.length === 0 || stall.section !== wholesaleMarketScene.getSection() || !marketShopDialog) return;
  selectedMarketStallId = stall.id;
  marketShopFeedback = "";
  marketProductQuantities.clear();
  for (const id of stall.products) marketProductQuantities.set(id, 1);
  renderMarketShop();
  marketShopDialog.showModal();
}

function closeMarketShop(): void {
  if (marketShopDialog?.open) marketShopDialog.close();
  selectedMarketStallId = null;
  marketShopFeedback = "";
  marketProductQuantities.clear();
}

function renderMarketShop(): void {
  const stall = selectedMarketStallId ? getMarketStall(selectedMarketStallId) : undefined;
  if (!stall || !marketShopProducts) return;
  const snapshot = store.getSnapshot();
  if (marketShopTitle) marketShopTitle.textContent = stall.title;
  if (marketShopSubtitle) marketShopSubtitle.textContent = `${stall.subtitle} · giá theo đơn vị`;
  if (marketShopBalance) marketShopBalance.textContent = formatVndFromThousands(snapshot.coins);
  if (marketShopFeedbackNode) marketShopFeedbackNode.textContent = marketShopFeedback;
  marketShopProducts.innerHTML = stall.products.map((id) => {
    const ingredient = MENU_INGREDIENTS[id];
    const product = MARKET_PRODUCT_DETAILS[id];
    const quantity = marketProductQuantities.get(id) ?? 1;
    const total = product.priceThousands * quantity;
    const stock = snapshot.marketInventory[id] ?? 0;
    const image = `/assets/ingredients/individual/${ingredient.assetFile}`;
    return `<article class="market-product-card">
      <div class="market-product-heading">
        <img class="market-product-icon" src="${image}" alt="${ingredient.name}" loading="lazy">
        <div class="market-product-name"><strong>${ingredient.name}</strong><small>Trong kho: ${stock} ${product.unit}</small></div>
      </div>
      <p class="market-product-description">${product.description}</p>
      <div class="market-product-price"><span>Đơn giá / ${product.unit}</span><strong>${formatVndFromThousands(product.priceThousands)}</strong></div>
      <div class="market-product-actions">
        <div class="market-quantity-stepper" aria-label="Số lượng ${ingredient.name}">
          <button type="button" data-action="market-quantity-down" data-market-ingredient="${id}" aria-label="Giảm số lượng ${ingredient.name}" ${quantity <= 1 ? "disabled" : ""}>−</button>
          <output>${quantity}</output>
          <button type="button" data-action="market-quantity-up" data-market-ingredient="${id}" aria-label="Tăng số lượng ${ingredient.name}" ${quantity >= 99 ? "disabled" : ""}>+</button>
        </div>
        <button class="market-buy-button" type="button" data-action="market-buy" data-market-ingredient="${id}" ${total > snapshot.coins ? "disabled" : ""}>Mua ${formatVndFromThousands(total)}</button>
      </div>
    </article>`;
  }).join("");
}

function toggleWholesaleMarketSection(): void {
  wholesaleMarketScene.advanceSection(1);
  updateWholesaleMarketSectionUI();
}

let marketArrowPointerPressed = false;
wholesaleMarketStallArrow?.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary || event.button !== 0) return;
  marketArrowPointerPressed = true;
  toggleWholesaleMarketSection();
});
wholesaleMarketStallArrow?.addEventListener("click", (event) => {
  if (event.detail === 0) {
    toggleWholesaleMarketSection();
    return;
  }
  if (marketArrowPointerPressed) {
    marketArrowPointerPressed = false;
    return;
  }
  toggleWholesaleMarketSection();
});

function setLocation(location: "street" | "dining"): void {
  closeMarketShop();
  homeOpen = false;
  if (homeInterface) homeInterface.hidden = true;
  wholesaleMarketOpen = false;
  if (wholesaleMarketInterface) wholesaleMarketInterface.hidden = true;
  selectTab("outside");
  setDiningView("tables");
  store.setServiceMode(location);
  applyLocationScenes();
}

function setDiningView(view: "tables" | "kitchen"): void {
  diningView = view;
  if (app) app.dataset.diningView = view;
  if (view === "kitchen" && !kitchenArtLoaded) {
    for (const [id, url] of kitchenArt) {
      const image = document.getElementById(id);
      if (image instanceof HTMLImageElement) image.src = url;
    }
    kitchenArtLoaded = true;
  }
  if (store.getSnapshot().serviceMode === "dining") diningScene.setInteractionEnabled(view === "tables");
  const locationName = document.querySelector<HTMLElement>("#dining-location-name");
  if (locationName) locationName.textContent = view === "kitchen" ? "GIAN BẾP" : "PHÒNG ĂN";
  setDiningPanelMode(null);
  render(store.getSnapshot());
}

function setDiningPanelMode(mode: "tables" | "kitchen" | null): void {
  const panel = document.querySelector<HTMLElement>("#dining-control-panel");
  const title = document.querySelector<HTMLElement>("#dining-panel-title");
  const isOpen = mode !== null;
  if (app) app.dataset.diningPanelOpen = String(isOpen);
  if (panel) {
    panel.hidden = !isOpen;
    panel.dataset.mode = mode ?? "tables";
    panel.scrollTop = 0;
  }
  if (title) title.textContent = mode === "kitchen" ? "Bếp" : "Bàn ăn";
}

document.addEventListener("dining-table-selected", () => setDiningPanelMode("tables"));
document.addEventListener("dining-kitchen-requested", () => {
  setDiningView("kitchen");
  setDiningPanelMode("kitchen");
});
let diningSwipeStart: { x: number; y: number; pointerId: number } | null = null;
const beginDiningSwipe = (event: PointerEvent): void => {
  diningSwipeStart = null;
  if (store.getSnapshot().serviceMode !== "dining") return;
  if (!event.isPrimary) return;
  if (event.target instanceof Element && event.target.closest("button, a, input, select, textarea, [role='button'], .dining-ticket-list")) return;
  diningSwipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
};
phaserRoot.closest<HTMLElement>(".street-section")?.addEventListener("pointerdown", beginDiningSwipe);
window.addEventListener("pointerup", (event) => {
  if (!diningSwipeStart || diningSwipeStart.pointerId !== event.pointerId) return;
  const dx = event.clientX - diningSwipeStart.x;
  const dy = event.clientY - diningSwipeStart.y;
  diningSwipeStart = null;
  if (store.getSnapshot().serviceMode !== "dining" || Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
  if (dx > 0 && diningView === "tables") setDiningView("kitchen");
  else if (dx < 0 && diningView === "kitchen") setDiningView("tables");
});
window.addEventListener("pointercancel", () => { diningSwipeStart = null; });

game.events.once(Phaser.Core.Events.READY, () => {
  phaserReady = true;
  applyLocationScenes();
  const previewSection = import.meta.env.DEV ? debugParams.get("market-preview") : null;
  if (previewSection && WHOLESALE_MARKET_INTERIOR_SECTIONS.includes(previewSection as typeof WHOLESALE_MARKET_INTERIOR_SECTIONS[number])) {
    openWholesaleMarket();
    wholesaleMarketScene.setSection(previewSection as typeof WHOLESALE_MARKET_INTERIOR_SECTIONS[number]);
  }
});

let editingStoreName = false;

function updateStoreNameDraft(): void {
  const input = document.querySelector<HTMLInputElement>("#store-name-input");
  const preview = document.querySelector<HTMLElement>("#store-name-preview");
  const count = document.querySelector<HTMLElement>("#store-name-count");
  if (!input) return;
  const draft = input.value.replace(/\s+/g, " ").trim().slice(0, input.maxLength);
  if (preview) preview.textContent = formatStoreNameForDisplay(draft) || "Tên quán của bạn";
  if (count) count.textContent = `${input.value.length}/${input.maxLength}`;
}

function openStoreNameModal(editing = false): void {
  const modal = document.querySelector<HTMLElement>("#store-name-modal");
  const input = document.querySelector<HTMLInputElement>("#store-name-input");
  const heading = document.querySelector<HTMLElement>("#store-name-heading");
  const description = document.querySelector<HTMLElement>("#store-name-description");
  const submit = document.querySelector<HTMLButtonElement>("#submit-store-name");
  const cancel = document.querySelector<HTMLButtonElement>("#cancel-store-name");
  const error = document.querySelector<HTMLElement>("#store-name-error");
  if (!modal || !input) return;

  editingStoreName = editing;
  const currentName = store.getSnapshot().storeName;
  input.value = formatStoreNameForDisplay(currentName);
  if (heading) heading.textContent = editing ? "Đổi tên biển hiệu" : "Đặt tên cho cửa tiệm";
  if (description) {
    description.textContent = editing
      ? "Chọn một tên mới cho tiệm. Bảng hiệu sẽ được cập nhật và lưu lại trên thiết bị này."
      : "Quán nhậu nhỏ của gia đình giờ là của bạn. Hãy chọn tên để treo lên biển hiệu.";
  }
  if (submit) submit.textContent = editing ? "Lưu bảng hiệu" : "Bắt đầu ở góc phố";
  if (cancel) cancel.hidden = !editing;
  if (error) error.textContent = "";
  updateStoreNameDraft();
  modal.hidden = false;
  window.requestAnimationFrame(() => input.focus());
}

function saveStoreName(event: SubmitEvent): void {
  event.preventDefault();
  const input = document.querySelector<HTMLInputElement>("#store-name-input");
  const modal = document.querySelector<HTMLElement>("#store-name-modal");
  const error = document.querySelector<HTMLElement>("#store-name-error");
  if (!input || !modal) return;
  if (!store.setStoreName(input.value)) {
    if (error) error.textContent = "Bạn nhập tên tiệm trước khi treo bảng hiệu nhé.";
    input.focus();
    return;
  }
  modal.hidden = true;
}

function selectTab(tab: string, toggle = false): void {
  const panel = document.querySelector<HTMLElement>("#play-panel");
  const currentTab = activeTab;
  activeTab = toggle && tab === currentTab ? "outside" : tab;
  const activeButton = document.querySelector<HTMLButtonElement>(`[data-tab-target="${activeTab}"]`);
  const selectedPanel = activeTab !== "outside";
  if (app) app.dataset.panelOpen = String(selectedPanel);
  if (panel) {
    panel.hidden = !selectedPanel;
    panel.dataset.menu = activeTab;
    panel.setAttribute("aria-modal", String(selectedPanel));
  }
  const panelBackdrop = document.querySelector<HTMLButtonElement>("#panel-backdrop");
  if (panelBackdrop) panelBackdrop.hidden = !selectedPanel;
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-tab-target]")) {
    const selected = button.dataset.tabTarget === activeTab;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  }
  for (const content of document.querySelectorAll<HTMLElement>("[data-menu-content]")) {
    content.hidden = content.dataset.menuContent !== activeTab;
  }
  const headings: Record<string, [string, string]> = {
    shop: ["GÓC QUẢN LÝ", "Cửa tiệm"],
    staff: ["ĐỘI NGŨ", "Nhân viên"],
    menu: ["QUẦY ĐANG PHỤC VỤ", "Phiếu món"],
    recipes: ["THỰC ĐƠN QUÁN NHẬU", "Món ngon nhà mình"],
    stock: ["NGUYÊN LIỆU", "Kho bếp"],
  };
  const [eyebrow, title] = headings[activeTab] ?? ["GÓC PHỐ SÀI GÒN", "Bảng quản lý"];
  const eyebrowNode = document.querySelector<HTMLElement>("#sheet-eyebrow");
  const titleNode = document.querySelector<HTMLElement>("#sheet-title");
  if (eyebrowNode) eyebrowNode.textContent = eyebrow;
  if (titleNode) titleNode.textContent = title;
  if (activeTab === "recipes") renderMenuCatalog();
  if (activeTab === "staff") renderStaffManagement(store.getSnapshot());
  if (activeTab === "stock") renderStockInventory(store.getSnapshot());
  if (selectedPanel) activeButton?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function menuDishArtMarkup(dish: MenuDish): string {
  const imageUrl = DISH_ART_URLS[dish.id];
  if (imageUrl) return `<img class="menu-dish-art menu-dish-art--image" src="${imageUrl}" alt="${dish.name}" loading="lazy">`;
  if (dish.visual.type === "icon") return `<span class="menu-dish-art menu-dish-art--icon">${iconMarkup(dish.visual.icon, "ui-icon")}</span>`;
  return `<span class="menu-dish-art menu-dish-art--icon" role="img" aria-label="${dish.name}"></span>`;
}

function menuDishIngredientsMarkup(ingredientIds: readonly MenuIngredientId[]): string {
  return ingredientIds.map((ingredientId) => {
    const ingredient = MENU_INGREDIENTS[ingredientId];
    const icon = `<img class="menu-dish-ingredient-icon" src="/assets/ingredients/individual/${ingredient.assetFile}" alt="">`;
    return `<span class="menu-dish-ingredient" role="listitem" aria-label="${ingredient.name}" title="${ingredient.name}">
      ${icon}
      <span>${ingredient.name}</span>
    </span>`;
  }).join("");
}

function renderStaffManagement(snapshot: GameSnapshot): void {
  const tabs = document.querySelector<HTMLElement>("#staff-role-tabs");
  const roster = document.querySelector<HTMLElement>("#staff-roster");
  const status = document.querySelector<HTMLElement>("#staff-status");
  if (!tabs || !roster) return;
  const signature = `${snapshot.cartLevel}|${snapshot.coins}|${snapshot.inShift}|${selectedStaffRole}|${snapshot.staff.map((entry) => `${entry.id}:${entry.level}:${entry.isWorking}:${Math.floor(entry.energy / 5)}:${entry.restSeconds > 0}`).join(",")}`;
  if (signature === staffManagementSignature) return;
  staffManagementSignature = signature;

  tabs.innerHTML = STAFF_ROLES.map((role) => `<button type="button" class="staff-role-tab ${selectedStaffRole === role.id ? "is-active" : ""}" role="tab" aria-selected="${selectedStaffRole === role.id}" data-staff-role="${role.id}">${role.tabLabel}</button>`).join("");
  const role = getStaffRole(selectedStaffRole);
  const roleCandidates = STAFF_CANDIDATES.filter((entry) => entry.role === role.id);
  roster.innerHTML = roleCandidates.map((candidate) => {
    const employee = snapshot.staff.find((entry) => entry.id === candidate.id);
    const locked = candidate.unlockLevel > snapshot.cartLevel;
    const score = Math.min(99, candidate.serviceScore + Math.max(0, (employee?.level ?? 1) - 1) * 9);
    const wage = candidate.wagePerShift * (employee?.level ?? 1);
    const stars = Array.from({ length: 5 }, (_, index) => `<i class="${employee && index < employee.level ? "is-filled" : ""}" aria-hidden="true">★</i>`).join("");
    const hireDisabled = locked || snapshot.coins < candidate.hireCost;
    const trainingCost = employee ? STAFF_TRAINING_COST[employee.level] : undefined;
    const trainDisabled = !employee || employee.level >= MAX_STAFF_LEVEL || trainingCost === undefined || snapshot.coins < trainingCost;
    const workButton = employee
      ? `<button class="staff-action-button ${employee.isWorking ? "secondary" : ""}" data-action="staff-shift" data-employee-id="${employee.id}" type="button">${employee.isWorking ? "Cho nghỉ ca" : "Xếp vào ca"}</button>`
      : `<button class="staff-action-button" data-action="staff-hire" data-candidate-id="${candidate.id}" type="button" ${hireDisabled ? "disabled" : ""}>${locked ? `Mở ở cấp ${candidate.unlockLevel}` : `Tuyển · ${formatVndFromThousands(candidate.hireCost)}`}</button>`;
    const trainButton = employee
      ? `<button class="staff-action-button" data-action="staff-train" data-employee-id="${employee.id}" type="button" ${trainDisabled ? "disabled" : ""}>${employee.level >= MAX_STAFF_LEVEL ? "Đã tối đa" : `Đào tạo · ${formatVndFromThousands(trainingCost ?? 0)}`}</button>`
      : "";
    const state = !employee ? locked ? `Khóa tới cấp ${candidate.unlockLevel}` : "Ứng viên"
      : !employee.isWorking ? "Nghỉ ca"
        : !snapshot.inShift ? "Đã xếp ca"
          : employee.restSeconds > 0 ? `Đang nghỉ lấy sức · ${employee.energy}%`
            : employee.energy <= 45 ? `Mệt · ${employee.energy}%`
              : `Đang làm · ${employee.energy}%`;
    return `<article class="employee-management-card ${locked ? "is-locked" : ""}">
      <div class="employee-portrait"><img src="${staffPortraitById[candidate.id]}" alt="Chân dung ${candidate.name}" loading="lazy"></div>
      <div class="employee-details">
        <div class="employee-name-line"><div><small>${role.tabLabel}</small><h3>${candidate.name}</h3></div><span class="employee-score"><b>${score}</b><small>điểm phục vụ</small></span></div>
        <div class="employee-stars" aria-label="${employee ? `Bậc kỹ năng ${employee.level} trên ${MAX_STAFF_LEVEL}` : "Chưa tuyển"}">${stars}</div>
        <p>${role.duty}</p>
        ${employee ? `<div class="employee-energy" role="meter" aria-label="Sức bền ${employee.energy}%" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${employee.energy}"><span style="width:${employee.energy}%"></span></div>` : ""}
        <div class="employee-facts"><span><b>Nơi làm:</b> ${role.workstation}</span><span><b>Lương:</b> ${formatVndFromThousands(wage)}/ca</span><span><b>Trạng thái:</b> ${state}</span></div>
        <div class="employee-actions">${workButton}${trainButton}</div>
      </div>
    </article>`;
  }).join("");
  const workingCount = snapshot.staff.filter((entry) => entry.isWorking).length;
  if (status) status.textContent = workingCount > 0
    ? `${snapshot.inShift ? "Đang làm" : "Đã xếp ca"} ${workingCount}/${snapshot.staff.length} nhân viên · lương ca kế tiếp ${formatVndFromThousands(snapshot.staff.filter((entry) => entry.isWorking).reduce((sum, entry) => sum + (getStaffCandidate(entry.id)?.wagePerShift ?? 0) * entry.level, 0))}.`
    : "Nhân viên nghỉ ca sẽ không nhận lương và không đóng góp hiệu ứng nghề.";
}

function renderMenuCatalog(snapshot = store.getSnapshot()): void {
  const list = document.querySelector<HTMLElement>("#menu-dish-collection");
  const count = document.querySelector<HTMLElement>("#menu-catalog-count");
  if (!list) return;

  const learnedDishes = MENU_DISHES.filter((dish) => snapshot.learnedRecipes.includes(dish.id as RecipeId));
  const visibleDishes = selectedMenuCategory === "all"
    ? learnedDishes
    : learnedDishes.filter((dish) => dish.category === selectedMenuCategory);
  const categoryName = MENU_CATEGORIES.find((category) => category.id === selectedMenuCategory)?.name ?? "Món ăn";
  if (count) count.textContent = selectedMenuCategory === "all"
    ? `${learnedDishes.length} món đã học · ${PLAYABLE_RECIPE_IDS.length} công thức`
    : `${categoryName} · ${visibleDishes.length} món đã học`;
  const note = document.querySelector<HTMLElement>("#menu-catalog-note");
  if (note) note.textContent = `Đã học ${snapshot.learnedRecipes.length}/${PLAYABLE_RECIPE_IDS.length} công thức. Học thêm món bằng tiền trong quán.`;

  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-menu-filter]")) {
    const filter = button.dataset.menuFilter;
    const categoryCount = filter === "all"
      ? learnedDishes.length
      : learnedDishes.filter((dish) => dish.category === filter).length;
    const active = filter === selectedMenuCategory;
    const badge = button.querySelector<HTMLElement>("span");
    if (badge) badge.textContent = String(categoryCount);
    button.hidden = filter !== "all" && categoryCount === 0;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  }

  list.innerHTML = visibleDishes.map((dish) => {
    const profit = dish.suggestedPrice - dish.estimatedCost;
    const priceLabel = dish.currentRecipe ? "Giá bán" : "Giá gợi ý";
    const costLabel = dish.currentRecipe ? "Chi phí" : "Chi phí dự kiến";
    const profitLabel = dish.currentRecipe ? "Lãi gộp" : "Lời dự kiến";
    const categoryLabel = MENU_CATEGORIES.find((category) => category.id === dish.category)?.name ?? "Món ăn";
    const recipeId = PLAYABLE_RECIPE_IDS.find((id) => id === dish.id);
    const active = recipeId ? snapshot.activeMenu.includes(recipeId) : false;
    const locked = recipeId ? RECIPES[recipeId].unlockLevel > snapshot.cartLevel : true;
    const missing = recipeId
      ? RECIPES[recipeId].ingredients.filter((ingredient) => snapshot.inventory[ingredient.id] < ingredient.quantity)
        .map((ingredient) => MENU_INGREDIENTS[ingredient.id].name)
      : [];
    return `<article class="menu-dish-card ${recipeId ? "is-playable" : ""}">
      <div class="menu-dish-art-frame">${menuDishArtMarkup(dish)}</div>
      <div class="menu-dish-copy">
        <div class="menu-dish-heading"><div><span class="menu-dish-category">${categoryLabel}</span><h3>${dish.name}</h3></div><span class="menu-dish-status ${active ? "is-current" : ""}">${recipeId ? locked ? `Mở ở cấp ${RECIPES[recipeId].unlockLevel}` : active ? missing.length > 0 ? "Thiếu nguyên liệu" : "Đang bán" : "Tạm ngừng" : "Chưa mở"}</span></div>
        <div class="menu-dish-metrics">
          <span><small>${priceLabel}</small><b>${formatVndFromThousands(dish.suggestedPrice)}</b></span>
          <span><small>${costLabel}</small><b>${formatVndFromThousands(dish.estimatedCost)}</b></span>
          <span><small>${profitLabel}</small><b>${formatVndFromThousands(profit)}</b></span>
          <span><small>Khẩu phần</small><b>${dish.portion}</b></span>
        </div>
        <div class="menu-dish-ingredients">
          <span class="menu-dish-ingredients-heading">Nguyên liệu</span>
          <div class="menu-dish-ingredient-list" role="list" aria-label="Nguyên liệu món ${dish.name}">${menuDishIngredientsMarkup(dish.ingredients)}</div>
        </div>
        ${recipeId ? `<button class="menu-recipe-toggle ${active ? "is-active" : ""}" data-action="toggle-menu-dish" data-recipe-id="${recipeId}" type="button" ${locked ? "disabled" : ""}>${active ? "Ngừng bán món này" : "Đưa món vào thực đơn"}</button>` : ""}
      </div>
    </article>`;
  }).join("");
}

function renderShiftMenuSelector(snapshot: GameSnapshot): void {
  if (!shiftMenuList) return;
  const learnedDishes = MENU_DISHES.filter((dish) => snapshot.learnedRecipes.includes(dish.id as RecipeId)
    && RECIPES[dish.id as RecipeId].unlockLevel <= snapshot.cartLevel);
  updateShiftMenuSelectionSummary(learnedDishes.length, learnedDishes.length);

  shiftMenuList.innerHTML = learnedDishes.map((dish) => {
    const recipeId = PLAYABLE_RECIPE_IDS.find((id) => id === dish.id);
    if (!recipeId) return "";
    const recipe = RECIPES[recipeId];
    const selected = shiftMenuDraft.has(recipeId);
    const category = MENU_CATEGORIES.find((entry) => entry.id === dish.category)?.name ?? "Món ăn";
    const missing = recipe.ingredients.filter((ingredient) => snapshot.inventory[ingredient.id] < ingredient.quantity);
    const stockStatus = missing.length > 0 ? `Thiếu ${missing.length} loại nguyên liệu` : "Đủ nguyên liệu";
    return `<label class="shift-menu-item ${selected ? "is-selected" : ""}">
      <input type="checkbox" data-shift-menu-recipe="${recipeId}" ${selected ? "checked" : ""} aria-label="Bán ${dish.name}">
      <span class="shift-menu-art">${menuDishArtMarkup(dish)}</span>
      <span class="shift-menu-copy"><strong>${dish.name}</strong><small>${category} · ${formatVndFromThousands(dish.suggestedPrice)}</small></span>
      <span class="shift-menu-stock">${stockStatus}</span>
    </label>`;
  }).join("");
}

function renderRecipeLearningDialog(snapshot = store.getSnapshot()): void {
  const list = document.querySelector<HTMLElement>("#recipe-learning-list");
  const balance = document.querySelector<HTMLElement>("#recipe-learning-balance");
  const count = document.querySelector<HTMLElement>("#recipe-learning-count");
  const feedback = document.querySelector<HTMLElement>("#recipe-learning-feedback");
  if (!list) return;
  if (balance) balance.textContent = formatVndFromThousands(snapshot.coins);
  if (count) count.textContent = `${snapshot.learnedRecipes.length}/${PLAYABLE_RECIPE_IDS.length} công thức đã học`;
  if (feedback) feedback.textContent = recipeLearningFeedback;

  const unlearnedDishes = MENU_DISHES.filter((dish) => !snapshot.learnedRecipes.includes(dish.id as RecipeId));
  list.innerHTML = unlearnedDishes.length === 0
    ? `<p class="recipe-learning-empty">Bạn đã học hết công thức trong sổ.</p>`
    : unlearnedDishes.map((dish) => {
      const recipeId = dish.id as RecipeId;
      const recipe = RECIPES[recipeId];
      const cost = getRecipeLearningCost(recipeId);
      const levelLocked = recipe.unlockLevel > snapshot.cartLevel;
      const cannotAfford = snapshot.coins < cost;
      const category = MENU_CATEGORIES.find((entry) => entry.id === dish.category)?.name ?? "Món ăn";
      const status = levelLocked ? `Mở ở cấp ${recipe.unlockLevel}` : cannotAfford ? "Chưa đủ tiền" : "Có thể học";
      const buttonLabel = levelLocked ? `Cấp ${recipe.unlockLevel}` : `Học · ${formatVndFromThousands(cost)}`;
      return `<article class="recipe-learning-item ${levelLocked ? "is-locked" : ""}">
        <span class="recipe-learning-art">${menuDishArtMarkup(dish)}</span>
        <span class="recipe-learning-copy"><strong>${dish.name}</strong><small>${category} · ${status}</small><small>Học phí ${formatVndFromThousands(cost)} · bán gợi ý ${formatVndFromThousands(dish.suggestedPrice)}</small></span>
        <button class="recipe-learn-action" type="button" data-action="learn-recipe" data-recipe-id="${recipeId}" ${levelLocked || cannotAfford ? "disabled" : ""}>${buttonLabel}</button>
      </article>`;
    }).join("");
}

function updateShiftMenuSelectionSummary(availableCount: number, allCount: number): void {
  if (shiftMenuSelectionCount) shiftMenuSelectionCount.textContent = `${shiftMenuDraft.size} món đã chọn`;
  if (shiftMenuAvailability) shiftMenuAvailability.textContent = `${availableCount}/${allCount} món đã học`;
  if (confirmShiftMenuButton) confirmShiftMenuButton.disabled = shiftMenuDraft.size === 0;
  if (shiftMenuFeedback) shiftMenuFeedback.textContent = shiftMenuDraft.size > 0
    ? "Có thể chọn nhiều món. Món thiếu nguyên liệu vẫn bán được sau khi bạn nhập kho."
    : "Chọn ít nhất một món để bắt đầu bán.";
}

function openShiftMenuSelector(): void {
  if (!shiftMenuDialog) return;
  const snapshot = store.getSnapshot();
  const resumingShift = snapshot.elapsedSeconds > 0 || snapshot.customers.length > 0 || snapshot.dining.guests.length > 0;
  if (shiftMenuTitle) shiftMenuTitle.textContent = resumingShift ? "Chọn món để mở bán lại" : "Chọn món cho ca bán";
  if (shiftMenuDescription) shiftMenuDescription.textContent = resumingShift
    ? "Ca hiện tại sẽ tiếp tục; thực đơn mới áp dụng cho khách sắp tới."
    : "Khách chỉ gọi những món bạn chọn ở đây.";
  shiftMenuDraft = new Set(snapshot.activeMenu.filter((id) => snapshot.learnedRecipes.includes(id)
    && RECIPES[id]?.unlockLevel <= snapshot.cartLevel));
  renderShiftMenuSelector(snapshot);
  shiftMenuDialog.showModal();
}

function openRecipeLearningDialog(): void {
  if (!recipeLearningDialog) return;
  recipeLearningFeedback = "";
  renderRecipeLearningDialog(store.getSnapshot());
  recipeLearningDialog.showModal();
}

function getStockCategory(ingredientId: MenuIngredientId): Exclude<StockCategoryId, "all"> {
  const priority: Exclude<StockCategoryId, "all">[] = ["seasoning", "dry", "fresh", "produce"];
  return priority.find((category) => STOCK_CATEGORY_STALLS[category].some((stallId) => getMarketStall(stallId)?.products.includes(ingredientId))) ?? "produce";
}

function renderStockInventory(snapshot: GameSnapshot): void {
  const categoryTabs = document.querySelector<HTMLElement>("#stock-category-tabs");
  const inventoryGrid = document.querySelector<HTMLElement>("#stock-inventory-grid");
  const itemDetail = document.querySelector<HTMLElement>("#stock-item-detail");
  const stockStatus = document.querySelector<HTMLElement>("#stock-status");
  if (!inventoryGrid) return;

  const ingredientIds = Object.keys(MENU_INGREDIENTS) as MenuIngredientId[];
  const stockedIngredientIds = ingredientIds.filter((id) => (snapshot.marketInventory[id] ?? 0) > 0);
  if (selectedStockCategory !== "all" && !stockedIngredientIds.some((id) => getStockCategory(id) === selectedStockCategory)) {
    selectedStockCategory = "all";
  }
  if (stockStatus) stockStatus.textContent = `Kho đang có ${stockedIngredientIds.length} loại nguyên liệu`;

  if (categoryTabs) {
    const stockedCategories = STOCK_CATEGORY_FILTERS.filter((category) => category.id === "all"
      || stockedIngredientIds.some((id) => getStockCategory(id) === category.id));
    categoryTabs.innerHTML = stockedCategories.map((category) => {
      const count = category.id === "all"
        ? stockedIngredientIds.length
        : stockedIngredientIds.filter((id) => getStockCategory(id) === category.id).length;
      const active = selectedStockCategory === category.id;
      return `<button type="button" class="inventory-category-tab ${active ? "is-active" : ""}" data-stock-filter="${category.id}" aria-pressed="${active}">${category.label}<span>${count}</span></button>`;
    }).join("");
  }

  const visibleIds = selectedStockCategory === "all"
    ? stockedIngredientIds
    : stockedIngredientIds.filter((id) => getStockCategory(id) === selectedStockCategory);
  if (selectedStockIngredient && !visibleIds.includes(selectedStockIngredient)) selectedStockIngredient = null;
  inventoryGrid.innerHTML = visibleIds.length > 0 ? visibleIds.map((id) => {
    const ingredient = MENU_INGREDIENTS[id];
    const count = Math.max(0, Math.trunc(snapshot.marketInventory[id] ?? 0));
    const selected = selectedStockIngredient === id;
    return `<button type="button" class="inventory-slot ${count === 0 ? "is-empty" : ""} ${selected ? "is-selected" : ""}" role="listitem" data-stock-ingredient="${id}" aria-pressed="${selected}" aria-label="${ingredient.name}, ${count} ${MARKET_PRODUCT_DETAILS[id].unit}" title="${ingredient.name}">
      <span class="inventory-slot-art"><img src="/assets/ingredients/individual/${ingredient.assetFile}" alt="" loading="lazy"><b>${count}</b></span>
      <span class="inventory-slot-name">${ingredient.name}</span>
    </button>`;
  }).join("") : `<div class="inventory-empty-state">${stockedIngredientIds.length === 0 ? "Kho đang trống. Ghé chợ để mua nguyên liệu." : "Danh mục này hiện chưa có nguyên liệu."}</div>`;

  if (!itemDetail) return;
  const selectedId = selectedStockIngredient;
  const selectedIngredient = selectedId ? MENU_INGREDIENTS[selectedId] : null;
  const selectedProduct = selectedId ? MARKET_PRODUCT_DETAILS[selectedId] : null;
  if (!selectedId || !selectedIngredient || !selectedProduct) {
    itemDetail.innerHTML = `<span class="inventory-detail-empty">${stockedIngredientIds.length === 0 ? "Kho đang trống · vào Cửa tiệm để nhập nguyên liệu." : "Chạm vào một ô để xem thông tin nguyên liệu."}</span>`;
    return;
  }

  const categoryLabel = STOCK_CATEGORY_FILTERS.find((category) => category.id === getStockCategory(selectedId))?.label ?? "Nguyên liệu";
  const count = Math.max(0, Math.trunc(snapshot.marketInventory[selectedId] ?? 0));
  itemDetail.innerHTML = `<img class="inventory-detail-art" src="/assets/ingredients/individual/${selectedIngredient.assetFile}" alt="">
    <div class="inventory-detail-copy"><span>${categoryLabel} · ${selectedProduct.unit}</span><strong>${selectedIngredient.name}</strong><small>${selectedProduct.description}</small></div>
    <div class="inventory-detail-stock"><b>${count}</b><span>${selectedProduct.unit}</span></div>`;
}

function renderDining(snapshot: GameSnapshot): void {
  const root = document.querySelector<HTMLElement>("#dining-interface");
  const shiftStatus = document.querySelector<HTMLElement>("#dining-shift-status");
  const guestName = document.querySelector<HTMLElement>("#dining-guest-name");
  const recipeLine = document.querySelector<HTMLElement>("#dining-recipe-line");
  const contextActions = document.querySelector<HTMLElement>("#dining-context-actions");
  const ticketList = document.querySelector<HTMLElement>("#dining-ticket-list");
  const ticketCount = document.querySelector<HTMLElement>("#dining-ticket-count");
  const kitchenStatus = document.querySelector<HTMLElement>("#dining-kitchen-status");
  const orderActions = document.querySelector<HTMLElement>("#dining-order-actions");
  const inside = snapshot.serviceMode === "dining";
  if (root) root.hidden = !inside;
  if (app) app.dataset.location = homeOpen ? "home" : wholesaleMarketOpen ? "market" : inside ? "dining" : "street";
  updateOutsideNavLabel();
  renderKitchenStaff(snapshot);
  renderKitchenStove(snapshot);
  renderKitchenPass(snapshot);
  renderDiningDelivery(snapshot);
  renderRestaurantStaffActors(snapshot);
  if (!inside) return;

  const guestStatusNames: Record<string, string> = {
    approaching: "đang đi bộ tới quán",
    entering: "đang vào bàn",
    "waiting-order": "đã ngồi · chờ Mai Linh",
    "waiting-food": "đang chờ món",
    eating: "đang ăn",
    "awaiting-payment": "chờ thanh toán",
    leaving: "đang rời quán",
    departing: "đang đi ra phố",
  };
  const orderStatusNames: Record<string, string> = {
    called: "Khách vừa gọi",
    taking: "Mai Linh đang hỏi và ghi món",
    queued: "Chờ bếp",
    cooking: "Đang nấu",
    ready: "Đã sẵn sàng",
    carrying: "Đang bưng tới bàn",
    delivered: "Đã giao",
    paid: "Đã thanh toán",
  };
  const selectedGuest = snapshot.dining.guests.find((guest) => guest.id === snapshot.dining.selectedGuestId);
  const selectedOrder = snapshot.dining.orders.find((order) => order.id === snapshot.dining.selectedOrderId);
  const guestOrder = selectedGuest && snapshot.dining.orders.find((order) => order.guestId === selectedGuest.id);
  const selectedPartyGuests = selectedGuest ? snapshot.dining.guests.filter((guest) => guest.partyId === selectedGuest.partyId) : [];
  const selectedPartyOrders = selectedGuest ? snapshot.dining.orders.filter((order) => order.partyId === selectedGuest.partyId) : [];
  if (shiftStatus) {
    const capacity = getDiningTableCapacity();
    const activeGuests = snapshot.dining.guests.filter((guest) => !["leaving", "departing"].includes(guest.status));
    const partyCount = new Set(activeGuests.map((guest) => guest.partyId)).size;
    const arrivingPartyCount = new Set(activeGuests.filter((guest) => guest.status === "approaching").map((guest) => guest.partyId)).size;
    const enteringGuestCount = activeGuests.filter((guest) => guest.status === "entering").length;
    const emptySeatCount = snapshot.dining.tables.filter((table) => table.id <= capacity && table.cleanliness !== "dirty")
      .flatMap((table) => table.seats).filter((seat) => seat.status === "empty").length;
    shiftStatus.textContent = diningView === "kitchen"
      ? (snapshot.inShift ? "Đang ở gian bếp · chạm Phòng ăn để quay lại" : "Quán đang nghỉ · chạm Phòng ăn để quay lại")
      : snapshot.inShift
        ? arrivingPartyCount > 0
          ? `${arrivingPartyCount} nhóm đang tới từ phố · ${emptySeatCount} chỗ trống`
          : enteringGuestCount > 0
            ? `${enteringGuestCount} khách đang vào bàn · ${emptySeatCount} chỗ trống`
            : activeGuests.length > 0
              ? `${activeGuests.length} khách · ${partyCount} nhóm · ${emptySeatCount} chỗ trống`
              : `Đang chờ nhóm khách đầu tiên · ${emptySeatCount} chỗ trống`
        : "Quán đang nghỉ · chạm Mở bán để tiếp tục";
  }
  if (guestName) {
    const partyLabel = selectedGuest
      ? `${selectedGuest.partyType === "family" ? "Gia đình" : "Nhóm bạn"} ${selectedGuest.partySize} người`
      : "";
    guestName.textContent = selectedGuest
      ? `${partyLabel} · ${CUSTOMER_TYPES[selectedGuest.type].name} · bàn ${selectedGuest.tableId}, chỗ ${selectedGuest.seatIndex + 1}`
      : "Chưa chọn khách";
  }
  if (recipeLine) {
    if (!selectedGuest || selectedPartyOrders.length === 0) {
      recipeLine.textContent = "Chưa có món được gọi.";
    } else {
      const orderCounts = new Map<RecipeId, number>();
      for (const order of selectedPartyOrders) orderCounts.set(order.recipe, (orderCounts.get(order.recipe) ?? 0) + 1);
      recipeLine.innerHTML = `<span class="dining-order-list-label">MÓN ĐÃ GỌI</span><ul class="dining-order-list" role="list">${[...orderCounts].map(([recipeId, count]) => `<li class="dining-order-item" role="listitem"><strong>${RECIPES[recipeId].name}</strong><span>${count} phần</span></li>`).join("")}</ul><span class="dining-order-progress">${guestStatusNames[selectedGuest.status]}</span>`;
    }
  }
  if (contextActions) {
    const actions: string[] = [];
    if (selectedOrder?.status === "ready") {
      const serverAvailable = snapshot.inShift && snapshot.staff.some((member) => member.role === "server"
        && member.isWorking && member.restSeconds <= 0 && member.energy > 18);
      actions.push(`<span class="dining-empty-action">${serverAvailable ? "Phục vụ đang mang món tới bàn." : "Đầu bếp đã đặt món ở quầy. Vào bếp rồi chạm chiếc dĩa để tự mang ra."}</span>`);
    }
    if (selectedOrder?.status === "queued") {
      const firstQueuedOrder = snapshot.dining.orders.find((order) => order.status === "queued");
      if (firstQueuedOrder && firstQueuedOrder.id !== selectedOrder.id) {
        actions.push(`<button class="dining-action-button secondary" data-action="dining-prioritize" data-order-id="${selectedOrder.id}" type="button">Ưu tiên phiếu này</button>`);
      }
    }
    if (selectedOrder?.status === "cooking") {
      actions.push(`<button class="dining-action-button secondary" data-action="dining-boost" type="button">Hỗ trợ bếp · 5.000đ</button>`);
    }
    if (selectedGuest && guestOrder?.status === "delivered"
      && selectedPartyGuests.length > 0 && selectedPartyGuests.every((guest) => guest.status === "awaiting-payment")) {
      actions.push(`<button class="dining-action-button" data-action="dining-pay" type="button">Thu hóa đơn · ${selectedPartyOrders.length} món</button>`);
    }
    if (actions.length === 0 && !snapshot.inShift) {
      actions.push("<span class=\"dining-empty-action\">Khách sẽ tự chọn bàn khi quán tiếp tục bán.</span>");
    }
    contextActions.innerHTML = actions.join("");
  }

  const visibleOrders = snapshot.dining.orders.filter((order) => order.status !== "paid" && order.status !== "called");
  const groupedOrders = new Map<string, typeof visibleOrders>();
  for (const order of visibleOrders) {
    const key = `${order.partyId}:${order.recipe}`;
    const group = groupedOrders.get(key) ?? [];
    group.push(order);
    groupedOrders.set(key, group);
  }
  if (ticketCount) ticketCount.textContent = visibleOrders.length > 0 ? `${groupedOrders.size} phiếu · ${visibleOrders.length} phần` : "";
  if (ticketList) {
    ticketList.innerHTML = visibleOrders.length > 0
      ? [...groupedOrders.values()].map((orders) => {
        const order = orders.find((entry) => entry.status === "ready")
          ?? orders.find((entry) => entry.status === "carrying")
          ?? orders.find((entry) => entry.status === "cooking")
          ?? orders.find((entry) => entry.status === "queued")
          ?? orders.find((entry) => entry.status === "taking")
          ?? orders[0];
        if (!order) return "";
        const guest = snapshot.dining.guests.find((entry) => entry.id === order.guestId);
        const partyLabel = `${guest?.partyType === "family" ? "Gia đình" : "Nhóm bạn"} · ${guest?.partySize ?? 1} người`;
        const selectedGroup = orders.some((entry) => entry.id === selectedOrder?.id);
        const statusCounts = new Map<DiningOrder["status"], number>();
        for (const entry of orders) statusCounts.set(entry.status, (statusCounts.get(entry.status) ?? 0) + 1);
        const orderedStatuses: DiningOrder["status"][] = ["ready", "carrying", "cooking", "taking", "queued", "delivered"];
        const statusSummary = orderedStatuses
          .filter((status) => statusCounts.has(status))
          .map((status) => {
            const count = statusCounts.get(status) ?? 0;
            const label = orderStatusNames[status];
            return statusCounts.size > 1 ? `${count} ${label.toLowerCase()}` : count > 1 ? `${label} × ${count}` : label;
          })
          .join(" · ");
        return `<div role="listitem"><button type="button" class="dining-ticket-button ${selectedGroup ? "is-selected" : ""}" data-dining-order="${order.id}" data-status="${order.status}" aria-label="Bàn ${order.tableId}, ${RECIPES[order.recipe].name}, ${orders.length} phần, ${partyLabel}, ${statusSummary}">
          <span class="dining-ticket-table">${order.tableId}</span>
          <span class="dining-ticket-main"><strong>${RECIPES[order.recipe].name}${orders.length > 1 ? ` × ${orders.length}` : ""}</strong><small>${partyLabel}</small></span>
          <span class="dining-ticket-status">${statusSummary}</span>
        </button></div>`;
      }).join("")
      : `<div class="dining-ticket-empty"><strong>Chưa có phiếu chờ</strong><span>${snapshot.inShift ? "Mai Linh sẽ tự nhận món khách gọi rồi chuyển phiếu sang bếp." : "Vào phòng ăn và chạm Mở bán để đón khách."}</span></div>`;
  }
  const activeKitchenOrder = snapshot.dining.orders.find((order) => order.id === snapshot.dining.activeOrderId);
  const recipeIngredients = selectedOrder ? RECIPES[selectedOrder.recipe].ingredients : [];
  const missingIngredient = selectedOrder?.status === "queued"
    ? recipeIngredients.find((ingredient) => (snapshot.inventory[ingredient.id] ?? 0) < ingredient.quantity)
    : undefined;
  const missingIngredientName = missingIngredient
    ? INGREDIENTS.find((ingredient) => ingredient.id === missingIngredient.id)?.name
    : null;
  if (kitchenStatus) {
    if (!snapshot.inShift && selectedOrder && ["queued", "cooking"].includes(selectedOrder.status)) {
      kitchenStatus.textContent = "Ca đã nghỉ. Bật ca để tiếp tục xử lý phiếu này.";
    } else if (selectedOrder?.status === "cooking") kitchenStatus.textContent = `Bàn ${selectedOrder.tableId} · ${RECIPES[selectedOrder.recipe].name} · đang nấu, còn khoảng ${selectedOrder.cookSeconds}s.`;
    else if (selectedOrder?.status === "queued") {
      if (activeKitchenOrder && activeKitchenOrder.id !== selectedOrder.id) {
        kitchenStatus.textContent = `Bếp đang nấu món cho bàn ${activeKitchenOrder.tableId}. Xong phiếu đó sẽ đến lượt bàn ${selectedOrder.tableId}.`;
      } else if (missingIngredientName) {
        kitchenStatus.textContent = `Thiếu ${missingIngredientName} trong kho. Nhập thêm hàng; phiếu bàn ${selectedOrder.tableId} vẫn được giữ.`;
      } else {
        const cookAvailable = snapshot.staff.some((member) => (member.role === "chef" || member.role === "prep")
          && member.isWorking && member.restSeconds <= 0 && member.energy > 18);
        kitchenStatus.textContent = cookAvailable
          ? `Bàn ${selectedOrder.tableId} · ${RECIPES[selectedOrder.recipe].name}. Đầu bếp sẽ tự nhận phiếu.`
          : `Đầu bếp đang nghỉ; phiếu bàn ${selectedOrder.tableId} sẽ được nấu khi nhân viên hồi sức.`;
      }
    } else if (selectedOrder) kitchenStatus.textContent = `${RECIPES[selectedOrder.recipe].name} · ${orderStatusNames[selectedOrder.status]}.`;
    else if (visibleOrders.length > 0) kitchenStatus.textContent = "Chạm một phiếu để xem món và tiếp tục xử lý.";
    else kitchenStatus.textContent = snapshot.inShift
      ? "Mai Linh tự hỏi món ở phòng ăn rồi chuyển phiếu vào bếp."
      : "Ca đã nghỉ. Bật ca để khách tiếp tục gọi món.";
  }
  if (kitchenStatus && selectedOrder?.status === "ready") {
    const serverAvailable = snapshot.inShift && snapshot.staff.some((member) => member.role === "server"
      && member.isWorking && member.restSeconds <= 0 && member.energy > 18);
    kitchenStatus.textContent = serverAvailable
      ? `Món bàn ${selectedOrder.tableId} đã xong; phục vụ đang mang ra.`
      : `Món bàn ${selectedOrder.tableId} đã xong; chạm chiếc dĩa ở quầy để mang ra.`;
  }
  if (orderActions) {
    const actions: string[] = [];
    if (snapshot.inShift && selectedOrder?.status === "queued" && !missingIngredient && (!activeKitchenOrder || activeKitchenOrder.id === selectedOrder.id)) {
      const firstQueuedOrder = snapshot.dining.orders.find((order) => order.status === "queued");
      if (firstQueuedOrder && firstQueuedOrder.id !== selectedOrder.id) {
        actions.push(`<button class="dining-action-button secondary" data-action="dining-prioritize" data-order-id="${selectedOrder.id}" type="button">Ưu tiên phiếu này</button>`);
      } else {
        actions.push(`<p class="dining-stove-hint">Đầu bếp tự nhận phiếu. Nếu đang nghỉ, bếp sẽ tiếp tục khi nhân viên hồi sức.</p>`);
      }
    }
    if (snapshot.inShift && selectedOrder?.status === "cooking") {
      actions.push(`<button class="dining-action-button secondary" data-action="dining-boost" type="button">Hỗ trợ bếp · 5.000đ</button>`);
    }
    orderActions.innerHTML = actions.join("");
  }
}

function framePointForCashCollection(event: CashCollectionEvent, frame: HTMLElement): { x: number; y: number } {
  if (event.source === "dining" && event.tableId) {
    const tablePoint = diningScene.getTableScreenPoint(event.tableId);
    if (tablePoint) return tablePoint;
  }
  const canvasBounds = phaserRoot?.getBoundingClientRect();
  const frameBounds = frame.getBoundingClientRect();
  if (!canvasBounds) return { x: frameBounds.width * 0.52, y: frameBounds.height * 0.62 };
  return {
    x: canvasBounds.left - frameBounds.left + canvasBounds.width * 0.52,
    y: canvasBounds.top - frameBounds.top + canvasBounds.height * 0.62,
  };
}

function animateCoinCounter(from: number, to: number, coins: HTMLElement): Promise<void> {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reducedMotion ? 1 : 360;
  return new Promise((resolve) => {
    const startedAt = performance.now();
    const step = (now: number): void => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      coins.textContent = formatVndFromThousands(Math.round(from + (to - from) * eased));
      if (progress < 1) window.requestAnimationFrame(step);
      else resolve();
    };
    window.requestAnimationFrame(step);
  });
}

function queueCashCollection(event: CashCollectionEvent): void {
  if (event.id <= lastCashCollectionId) return;
  lastCashCollectionId = event.id;
  cashFlightQueue.push(event);
  if (!cashFlightPlaying) void playNextCashCollection();
}

async function playNextCashCollection(): Promise<void> {
  const event = cashFlightQueue.shift();
  if (!event) {
    cashFlightPlaying = false;
    displayedCoinBalance = latestCoinBalance;
    const coins = document.querySelector<HTMLElement>("#coins");
    const walletPill = coins?.closest<HTMLElement>(".wallet-pill");
    if (coins) coins.textContent = formatVndFromThousands(displayedCoinBalance);
    if (walletPill) walletPill.setAttribute("aria-label", `Số dư ${formatVndFromThousands(displayedCoinBalance)}`);
    return;
  }

  cashFlightPlaying = true;
  const frame = document.querySelector<HTMLElement>(".game-frame");
  const layer = document.querySelector<HTMLElement>("#money-animation-layer");
  const coins = document.querySelector<HTMLElement>("#coins");
  const walletPill = coins?.closest<HTMLElement>(".wallet-pill");
  const fallbackWallet = document.querySelector<HTMLElement>("#money-reward-wallet");
  const fallbackBalance = document.querySelector<HTMLElement>("#money-reward-balance");
  if (!frame || !layer || !coins) {
    displayedCoinBalance += event.amount;
    await playNextCashCollection();
    return;
  }

  const frameBounds = frame.getBoundingClientRect();
  const walletBounds = walletPill?.getBoundingClientRect();
  const walletVisible = Boolean(walletBounds && walletBounds.width > 0 && walletBounds.height > 0);
  const targetWallet = walletVisible ? walletPill : fallbackWallet;
  if (!walletVisible && fallbackWallet) {
    fallbackWallet.hidden = false;
    if (fallbackBalance) fallbackBalance.textContent = formatVndFromThousands(displayedCoinBalance);
  }
  const targetBounds = targetWallet?.getBoundingClientRect();
  if (!targetBounds || targetBounds.width <= 0) {
    displayedCoinBalance += event.amount;
    await playNextCashCollection();
    return;
  }

  const origin = framePointForCashCollection(event, frame);
  const target = {
    x: targetBounds.left - frameBounds.left + targetBounds.width * 0.5,
    y: targetBounds.top - frameBounds.top + targetBounds.height * 0.5,
  };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const flights = Array.from({ length: 6 }, (_, index) => {
    const bill = document.createElement("img");
    bill.className = "money-cash-flight";
    bill.src = "/assets/money-stack.png";
    bill.alt = "";
    bill.draggable = false;
    const startX = origin.x + (index - 2.5) * 9;
    const startY = origin.y + (index % 3 - 1) * 8;
    const deltaX = target.x - startX;
    const deltaY = target.y - startY;
    bill.style.left = `${startX}px`;
    bill.style.top = `${startY}px`;
    layer.append(bill);
    const arc = 38 + (index % 3) * 9;
    const sway = (index - 2.5) * 11;
    const frames = Array.from({ length: 13 }, (_, step) => {
      const t = step / 12;
      const eased = 1 - (1 - t) ** 2.1;
      const x = deltaX * eased + Math.sin(Math.PI * t) * sway;
      const y = deltaY * eased - Math.sin(Math.PI * t) * arc;
      const scale = 0.7 + Math.sin(Math.PI * t) * 0.23 - t * 0.36;
      const rotation = -18 + index * 7 + Math.sin(t * Math.PI * 2) * 11;
      return {
        offset: t,
        opacity: t < 0.08 ? t / 0.08 : t > 0.82 ? (1 - t) / 0.18 : 1,
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale}) rotate(${rotation}deg)`,
      };
    });
    const animation = bill.animate(frames, {
      duration: prefersReducedMotion ? 1 : 620,
      delay: prefersReducedMotion ? 0 : index * 42,
      easing: "linear",
      fill: "forwards",
    });
    return animation.finished.catch(() => undefined).finally(() => bill.remove());
  });
  await Promise.all(flights);

  const balanceAfterPayment = displayedCoinBalance + event.amount;
  const walletForBounce = walletVisible ? walletPill : fallbackWallet;
  walletForBounce?.classList.remove("is-cashing");
  if (walletForBounce) {
    void walletForBounce.offsetWidth;
    walletForBounce.classList.add("is-cashing");
    window.setTimeout(() => walletForBounce.classList.remove("is-cashing"), 560);
  }
  const gain = document.createElement("span");
  gain.className = "money-gain-pop";
  gain.textContent = `+${formatVndFromThousands(event.amount)}`;
  gain.style.left = `${target.x}px`;
  gain.style.top = `${target.y - 16}px`;
  layer.append(gain);
  window.setTimeout(() => gain.remove(), 900);

  await animateCoinCounter(displayedCoinBalance, balanceAfterPayment, coins);
  displayedCoinBalance = balanceAfterPayment;
  if (fallbackBalance && fallbackWallet && !fallbackWallet.hidden) {
    fallbackBalance.textContent = formatVndFromThousands(displayedCoinBalance);
  }
  if (walletPill) walletPill.setAttribute("aria-label", `Số dư ${formatVndFromThousands(displayedCoinBalance)}`);

  if (cashFlightQueue.length > 0) {
    await playNextCashCollection();
    return;
  }
  if (fallbackWallet) window.setTimeout(() => { fallbackWallet.hidden = true; }, 700);
  displayedCoinBalance = latestCoinBalance;
  coins.textContent = formatVndFromThousands(displayedCoinBalance);
  if (walletPill) walletPill.setAttribute("aria-label", `Số dư ${formatVndFromThousands(displayedCoinBalance)}`);
  cashFlightPlaying = false;
}

function render(snapshot: GameSnapshot): void {
  const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector);
  const coins = $("#coins");
  const walletPill = coins?.closest<HTMLElement>(".wallet-pill");
  const reputation = $("#reputation");
  const orderTitle = $("#order-title");
  const orderHint = $("#order-hint");
  const callout = $("#customer-callout");
  const feedback = $("#feedback");
  const status = $("#street-status");
  const level = $("#cart-level");
  const businessStage = $("#business-stage");
  const upgradeButton = $("[data-action='upgrade']") as HTMLButtonElement | null;
  const shiftButton = $("#shift-button") as HTMLButtonElement | null;
  const diningOpenButton = $("#dining-open-button") as HTMLButtonElement | null;
  const storeNameShort = $("#store-name-short");
  const walletRow = document.querySelector<HTMLElement>(".wallet-row");
  const walletTarget = snapshot.serviceMode === "dining" ? $("#dining-wallet-slot") : $(".topbar");
  if (!snapshot.inShift && staffEntranceActive) clearStaffEntranceSequence();
  if (walletRow && walletTarget && walletRow.parentElement !== walletTarget) {
    const hudActions = walletTarget.matches(".topbar") ? walletTarget.querySelector<HTMLElement>(".hud-actions") : null;
    if (hudActions) walletTarget.insertBefore(walletRow, hudActions);
    else walletTarget.append(walletRow);
  }

  if (wholesaleMarketHeldBasket) {
    wholesaleMarketHeldBasket.src = snapshot.marketBasketHasItems ? heldBasketFullUrl : heldBasketUrl;
  }
  if (homeStageCopy) homeStageCopy.textContent = `CẤP NHÀ ${String(snapshot.cartLevel).padStart(2, "0")} / 12`;
  homeInteriorScene.setHomeStage(snapshot.cartLevel);
  if (storeNameShort) storeNameShort.textContent = formatStoreNameForDisplay(snapshot.storeName) || "Chưa đặt tên";
  latestCoinBalance = snapshot.coins;
  if (snapshot.cashCollection) queueCashCollection(snapshot.cashCollection);
  if (coins && !cashFlightPlaying) coins.textContent = formatVndFromThousands(snapshot.coins);
  if (walletPill && !cashFlightPlaying) walletPill.setAttribute("aria-label", `Số dư ${formatVndFromThousands(snapshot.coins)}`);
  renderLedger(snapshot);
  if (reputation) reputation.textContent = snapshot.reputation.toLocaleString("vi-VN");
  if (feedback) feedback.textContent = snapshot.offlineNotice || snapshot.feedback;
  if (status) updateStreetStatus();
  if (level) level.textContent = `CẤP ${snapshot.cartLevel} / ${MAX_CART_LEVEL}`;
  if (level) level.title = BUSINESS_STAGE_NAMES[snapshot.cartLevel - 1];
  if (businessStage) businessStage.textContent = BUSINESS_STAGE_NAMES[snapshot.cartLevel - 1];
  const shiftActionLabel = snapshot.closingShift ? "Đang tiễn khách" : snapshot.inShift ? "Nghỉ bán" : "Mở bán";
  if (diningOpenButton) {
    const isKitchen = diningView === "kitchen";
    diningOpenButton.disabled = !isKitchen && snapshot.closingShift;
    diningOpenButton.dataset.action = isKitchen ? "dining-back-tables" : "toggle-shift";
    diningOpenButton.textContent = isKitchen ? "Phòng ăn" : shiftActionLabel;
    diningOpenButton.setAttribute("aria-pressed", String(!isKitchen && snapshot.inShift));
  }
  if (shiftButton) {
    shiftButton.hidden = false;
    shiftButton.disabled = snapshot.closingShift;
    shiftButton.setAttribute("aria-pressed", String(snapshot.inShift));
    const label = shiftButton.querySelector<HTMLElement>(".action-label");
    if (label) label.textContent = shiftActionLabel;
  }
  renderDining(snapshot);
  if (activeTab === "staff") renderStaffManagement(snapshot);

  if (callout) {
    const customer = snapshot.customers[0];
    if (!snapshot.inShift) {
      callout.textContent = snapshot.closingShift
        ? "Quán đã nghỉ bán; khách đang đi ra cửa."
        : "Quán đang nghỉ bán. Chạm Mở bán để tiếp tục đón khách.";
    } else if (snapshot.serviceMode === "dining") {
      const arrivingPartyCount = new Set(snapshot.dining.guests
        .filter((guest) => guest.status === "approaching")
        .map((guest) => guest.partyId)).size;
      const enteringGuestCount = snapshot.dining.guests.filter((guest) => guest.status === "entering").length;
      const activeGuestCount = snapshot.dining.guests.filter((guest) => !["leaving", "departing"].includes(guest.status)).length;
      if (arrivingPartyCount > 0) callout.textContent = `${arrivingPartyCount} nhóm khách đang đi từ phố tới quán…`;
      else if (enteringGuestCount > 0) callout.textContent = `${enteringGuestCount} khách đang vào bàn…`;
      else if (activeGuestCount > 0) callout.textContent = `${activeGuestCount} khách đang ở trong phòng ăn.`;
      else callout.textContent = "Đang chờ nhóm khách kế tiếp ghé quán…";
    } else if (customer?.status === "walking") {
      callout.textContent = `${CUSTOMER_TYPES[customer.type].name} đang đi tới quán…`;
    } else if (customer) {
      callout.textContent = `${CUSTOMER_TYPES[customer.type].name} gọi ${RECIPES[customer.recipe].name.toLowerCase()} · còn ${customer.patience}s`;
    } else {
      callout.textContent = "Đang đợi khách kế tiếp ghé quán…";
    }
  }

  const activeCustomer = snapshot.customers[0];
  const activeDiningOrder = snapshot.dining.orders.find((order) => ["called", "taking", "queued", "cooking", "ready", "carrying"].includes(order.status));
  const waitingForStreetOrder = snapshot.serviceMode === "street" && activeCustomer?.status === "waiting";
  const hasDiningOrder = snapshot.serviceMode === "dining"
    && snapshot.dining.orders.some((order) => ["called", "taking", "queued", "ready"].includes(order.status));
  document.querySelector<HTMLElement>('[data-tab-target="menu"]')?.classList.toggle("has-task", waitingForStreetOrder || hasDiningOrder);
  if (orderTitle) orderTitle.textContent = snapshot.serviceMode === "dining"
    ? activeDiningOrder ? `${RECIPES[activeDiningOrder.recipe].name} · bàn ${activeDiningOrder.tableId}`
      : snapshot.dining.guests.length > 0 ? `${snapshot.dining.guests.length} khách trong phòng ăn` : "Đang chờ nhóm khách"
    : activeCustomer?.status === "walking"
      ? "Khách đang tới"
      : activeCustomer ? RECIPES[activeCustomer.recipe].name : "Chưa có khách";
  if (orderHint) {
    if (!snapshot.inShift) orderHint.textContent = "Mở quán để đón khách.";
    else if (snapshot.serviceMode === "dining") {
      const approachingDiningGuests = snapshot.dining.guests.some((guest) => guest.status === "approaching" || guest.status === "entering");
      const waitingOrder = snapshot.dining.guests.some((guest) => guest.status === "waiting-order");
      if (activeDiningOrder) orderHint.textContent = `Đơn phòng ăn ở bàn ${activeDiningOrder.tableId}; mở Phiếu món để xem tiến độ.`;
      else if (approachingDiningGuests) orderHint.textContent = "Nhóm khách đang đi từ phố vào; đợi họ ngồi đủ chỗ.";
      else if (waitingOrder) orderHint.textContent = "Khách đã ngồi; Mai Linh sẽ tới hỏi món.";
      else orderHint.textContent = "Khách sẽ ghé theo từng nhóm; nhóm đầu tiên đang trên đường tới.";
    }
    else if (activeCustomer?.status === "walking") orderHint.textContent = `${CUSTOMER_TYPES[activeCustomer.type].shortName} đang tới quầy.`;
    else if (activeCustomer) orderHint.textContent = snapshot.staff.some((member) => member.isWorking)
      ? "Nhân viên đang tự xử lý đơn. Bạn có thể chỉnh món bán và nhập thêm hàng."
      : "Quầy vẫn tự phục vụ; đội ngũ cơ bản xử lý chậm hơn khi chưa tuyển người.";
    else orderHint.textContent = "Đang chờ khách mới. Nhân viên sẽ tự nhận đơn.";
  }

  const orderTimer = $("#order-timer");
  if (orderTimer) {
    orderTimer.hidden = !waitingForStreetOrder;
    if (waitingForStreetOrder) orderTimer.textContent = `${activeCustomer.patience}s`;
  }

  const steps = $("#order-steps");
  if (steps) {
    steps.hidden = !waitingForStreetOrder;
    if (!activeCustomer) {
      steps.innerHTML = "<span class='empty-step'>Đang chờ đơn đầu tiên</span>";
    } else {
      const recipe = RECIPES[activeCustomer.recipe];
      steps.innerHTML = recipe.ingredients.map((entry) => {
        const item = INGREDIENTS.find((ingredient) => ingredient.id === entry.id)!;
        const stock = snapshot.inventory[entry.id] ?? 0;
        const stocked = stock >= entry.quantity;
        return `<span class="step-chip ${stocked ? "done" : "current"}"><i>${iconMarkup(item.icon as UiIconName, "step-icon ui-icon")}</i>${item.name}${entry.quantity > 1 ? ` ×${entry.quantity}` : ""}<small>${stock}/${entry.quantity}</small></span>`;
      }).join("");
    }
  }
  const streetIngredientGrid = $(".sheet-content[data-menu-content='menu'] .ingredient-grid");
  if (streetIngredientGrid) streetIngredientGrid.hidden = !waitingForStreetOrder;
  if (feedback) feedback.hidden = !waitingForStreetOrder;

  const lowStock = INGREDIENTS.filter((ingredient) => snapshot.inventory[ingredient.id] <= 2);
  document.querySelector<HTMLElement>('[data-tab-target="stock"]')?.classList.toggle("has-alert", lowStock.length > 0);
  renderStockInventory(snapshot);

  for (const ingredient of INGREDIENTS) {
    const stock = $(`#stock-${ingredient.id}`);
    const button = $(`.ingredient-button[data-ingredient='${ingredient.id}']`) as HTMLButtonElement | null;
    const count = snapshot.inventory[ingredient.id];
    if (stock) stock.textContent = `${count} phần`;
    if (button) button.disabled = snapshot.serviceMode !== "street" || !snapshot.inShift || !activeCustomer || activeCustomer.status !== "waiting" || count < 1;
  }

  const nextUpgradeCost = CART_UPGRADE_COST[snapshot.cartLevel] ?? 0;
  const upgradeLabel = $("#upgrade-label");
  const upgradeCost = $("#upgrade-cost");
  if (upgradeLabel) upgradeLabel.querySelector<HTMLElement>(".action-label")!.textContent = snapshot.cartLevel < MAX_CART_LEVEL ? `Nâng cấp ${snapshot.cartLevel + 1}` : "Đã đạt cấp cao nhất";
  if (upgradeCost) upgradeCost.textContent = nextUpgradeCost > 0 ? formatVndFromThousands(nextUpgradeCost) : "";
  if (upgradeButton) upgradeButton.disabled = nextUpgradeCost === 0 || snapshot.coins < nextUpgradeCost;
  const shiftReport = $("#shift-report") as HTMLDetailsElement | null;
  if (shiftReport) {
    shiftReport.hidden = !snapshot.report;
  }
  if (snapshot.report) {
    const report = snapshot.report;
    const reportHeadline = $("#shift-report-headline");
    if (reportHeadline) reportHeadline.textContent = `${report.served} phục vụ${report.left ? ` · ${report.left} bỏ đi` : ""} · Lãi ${report.net > 0 ? "+" : ""}${formatVndFromThousands(report.net)}`;
    const reportValues: Record<string, string> = {
      "#shift-report-revenue": formatVndFromThousands(report.revenue),
      "#shift-report-ingredients": formatVndFromThousands(report.ingredientCosts),
      "#shift-report-tips": formatVndFromThousands(report.tips),
      "#shift-report-wages": formatVndFromThousands(report.wages),
      "#shift-report-reputation": `+${report.reputationEarned}`,
    };
    for (const [selector, value] of Object.entries(reportValues)) {
      const node = $(selector);
      if (node) node.textContent = value;
    }
    const bestSeller = $("#shift-report-best-seller");
    if (bestSeller) {
      bestSeller.hidden = !report.bestSellingRecipe;
      bestSeller.textContent = report.bestSellingRecipe
        ? `Bán chạy: ${RECIPES[report.bestSellingRecipe].name} ×${report.bestSellingCount}`
        : "";
    }
  }

  if (activeTab === "recipes") renderMenuCatalog(snapshot);
  if (recipeLearningDialog?.open) renderRecipeLearningDialog(snapshot);

}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const stockCategoryButton = target.closest<HTMLButtonElement>("button[data-stock-filter]");
  if (stockCategoryButton?.dataset.stockFilter) {
    selectedStockCategory = stockCategoryButton.dataset.stockFilter as StockCategoryId;
    selectedStockIngredient = null;
    renderStockInventory(store.getSnapshot());
    return;
  }
  const stockItemButton = target.closest<HTMLButtonElement>("button[data-stock-ingredient]");
  if (stockItemButton?.dataset.stockIngredient) {
    selectedStockIngredient = stockItemButton.dataset.stockIngredient as MenuIngredientId;
    renderStockInventory(store.getSnapshot());
    return;
  }
  const categoryButton = target.closest<HTMLButtonElement>("button[data-menu-filter]");
  if (categoryButton?.dataset.menuFilter) {
    const filter = categoryButton.dataset.menuFilter;
    selectedMenuCategory = filter === "all" ? "all" : filter as MenuCategory;
    renderMenuCatalog();
    return;
  }
  const staffRoleButton = target.closest<HTMLButtonElement>("button[data-staff-role]");
  if (staffRoleButton?.dataset.staffRole) {
    selectedStaffRole = staffRoleButton.dataset.staffRole as StaffRoleId;
    renderStaffManagement(store.getSnapshot());
    return;
  }
  if (target.closest("#panel-backdrop")) {
    selectTab("outside");
    return;
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const ledgerDayButton = target.closest<HTMLButtonElement>("button[data-ledger-day]");
  if (ledgerDayButton) {
    selectedLedgerDay = Number(ledgerDayButton.dataset.ledgerDay);
    renderLedger(store.getSnapshot());
    return;
  }
  const button = target.closest<HTMLButtonElement>("button[data-action]");
  const diningTicketButton = target.closest<HTMLButtonElement>("button[data-dining-order]");
  if (diningTicketButton?.dataset.diningOrder) {
    store.selectDiningOrder(diningTicketButton.dataset.diningOrder);
    return;
  }
  if (!button || button.disabled) return;

  switch (button.dataset.action) {
    case "open-ledger":
      selectedLedgerDay = null;
      document.querySelector<HTMLDialogElement>("#ledger-dialog")?.showModal();
      renderLedger(store.getSnapshot());
      break;
    case "close-ledger":
      document.querySelector<HTMLDialogElement>("#ledger-dialog")?.close();
      break;
    case "open-market-stall":
      openMarketStall(button.dataset.marketStall);
      break;
    case "close-market-shop":
      closeMarketShop();
      break;
    case "market-quantity-down":
    case "market-quantity-up": {
      const ingredientId = button.dataset.marketIngredient as MenuIngredientId | undefined;
      const stall = selectedMarketStallId ? getMarketStall(selectedMarketStallId) : undefined;
      if (!ingredientId || !stall?.products.includes(ingredientId)) break;
      const currentQuantity = marketProductQuantities.get(ingredientId) ?? 1;
      const delta = button.dataset.action === "market-quantity-up" ? 1 : -1;
      marketProductQuantities.set(ingredientId, Math.max(1, Math.min(99, currentQuantity + delta)));
      renderMarketShop();
      break;
    }
    case "market-buy": {
      const ingredientId = button.dataset.marketIngredient as MenuIngredientId | undefined;
      if (!ingredientId || !selectedMarketStallId) break;
      const stall = getMarketStall(selectedMarketStallId);
      if (!stall?.products.includes(ingredientId)) break;
      store.buyMarketIngredient(ingredientId, marketProductQuantities.get(ingredientId) ?? 1);
      marketShopFeedback = store.getSnapshot().feedback;
      renderMarketShop();
      break;
    }
    case "leave-home":
      closeHome();
      break;
    case "enter-home":
      openHome();
      break;
    case "leave-wholesale-market":
      closeWholesaleMarket();
      break;
    case "dining-close-panel":
      setDiningPanelMode(null);
      break;
    case "dining-take-dish": {
      const orderId = button.dataset.orderId;
      if (!orderId) break;
      button.disabled = true;
      button.classList.add("is-taking");
      window.setTimeout(() => {
        const order = store.getSnapshot().dining.orders.find((entry) => entry.id === orderId && entry.status === "ready");
        if (!order) return;
        store.selectDiningOrder(order.id);
        store.serveSelectedDiningOrder();
        if (diningView === "kitchen") setDiningView("tables");
      }, 520);
      break;
    }
    case "dining-pay":
      store.collectDiningPayment();
      break;
    case "toggle-shift":
      if (store.getSnapshot().inShift) store.toggleShift();
      else openShiftMenuSelector();
      break;
    case "cancel-shift-menu":
      shiftMenuDialog?.close();
      break;
    case "confirm-shift-menu": {
      const openingShift = !store.getSnapshot().inShift;
      if (openingShift) {
        staffEntranceActive = true;
        staffEntranceArrivedIds.clear();
      }
      const started = store.toggleShift([...shiftMenuDraft]);
      if (started) {
        shiftMenuDialog?.close();
        if (openingShift && store.getSnapshot().inShift) startStaffEntranceSequence(store.getSnapshot());
      } else if (openingShift) {
        staffEntranceActive = false;
        render(store.getSnapshot());
      }
      break;
    }
    case "open-recipe-learning":
      openRecipeLearningDialog();
      break;
    case "close-recipe-learning":
      recipeLearningDialog?.close();
      recipeLearningFeedback = "";
      break;
    case "learn-recipe": {
      const recipeId = button.dataset.recipeId as RecipeId | undefined;
      if (!recipeId || !PLAYABLE_RECIPE_IDS.includes(recipeId)) break;
      const learned = store.learnRecipe(recipeId);
      recipeLearningFeedback = learned
        ? `Đã học ${RECIPES[recipeId].name}. Món này đã được thêm vào sổ công thức.`
        : store.getSnapshot().feedback;
      renderRecipeLearningDialog(store.getSnapshot());
      renderMenuCatalog(store.getSnapshot());
      break;
    }
    case "dining-prioritize": {
      const orderId = button.dataset.orderId;
      if (orderId) store.prioritizeDiningOrder(orderId);
      break;
    }
    case "dining-back-tables":
      setDiningView("tables");
      break;
    case "dining-boost":
      store.boostDiningKitchen();
      break;
    case "toggle-menu-dish": {
      const recipeId = button.dataset.recipeId;
      if (recipeId) store.toggleMenuDish(recipeId as RecipeId);
      renderMenuCatalog();
      break;
    }
    case "staff-hire": {
      const candidateId = button.dataset.candidateId;
      if (candidateId) store.hireEmployee(candidateId);
      break;
    }
    case "staff-train": {
      const employeeId = button.dataset.employeeId;
      if (employeeId) store.trainEmployee(employeeId);
      break;
    }
    case "staff-shift": {
      const employeeId = button.dataset.employeeId;
      if (employeeId) store.toggleEmployeeShift(employeeId);
      break;
    }
    case "upgrade":
      store.upgradeCart();
      break;
    case "hire":
      store.hireStaff();
      break;
    case "edit-store-name":
      openStoreNameModal(true);
      break;
    case "close-panel":
      selectTab("outside");
      break;
    case "fullscreen":
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen?.();
      break;
    case "open-settings":
      document.querySelector<HTMLDialogElement>("#settings-dialog")?.showModal();
      break;
    case "close-settings":
      document.querySelector<HTMLDialogElement>("#settings-dialog")?.close();
      break;
    case "open-how-to-play":
      document.querySelector<HTMLDialogElement>("#how-to-play-dialog")?.showModal();
      break;
    case "close-how-to-play":
      document.querySelector<HTMLDialogElement>("#how-to-play-dialog")?.close();
      break;
    case "screenshot":
      captureGameScreenshot();
      break;
    case "toggle-music":
      stopAutoStartMusic();
      void musicPlayer.toggle();
      break;
  }
});

document.addEventListener("change", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !input.matches("input[data-shift-menu-recipe]")) return;
  const recipeId = input.dataset.shiftMenuRecipe as RecipeId | undefined;
  if (!recipeId || !PLAYABLE_RECIPE_IDS.includes(recipeId) || input.disabled) return;
  if (input.checked) shiftMenuDraft.add(recipeId);
  else shiftMenuDraft.delete(recipeId);
  input.closest(".shift-menu-item")?.classList.toggle("is-selected", input.checked);
  const snapshot = store.getSnapshot();
  const learnedCount = snapshot.learnedRecipes.filter((id) => RECIPES[id].unlockLevel <= snapshot.cartLevel).length;
  updateShiftMenuSelectionSummary(learnedCount, learnedCount);
});

function stopAutoStartMusic(): void {
  document.removeEventListener("pointerdown", startMusicAfterGesture);
  document.removeEventListener("keydown", startMusicAfterGesture);
}

function startMusicAfterGesture(event: Event): void {
  if (event.target instanceof Element && event.target.closest(".settings-button, .settings-dialog, .screenshot-button, .fullscreen-button")) return;
  stopAutoStartMusic();
  if (musicPlayer.shouldAutoStart) void musicPlayer.play();
}

document.addEventListener("pointerdown", startMusicAfterGesture);
document.addEventListener("keydown", startMusicAfterGesture);

document.querySelector<HTMLDialogElement>("#settings-dialog")?.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) (event.currentTarget as HTMLDialogElement).close();
});

document.querySelector<HTMLDialogElement>("#how-to-play-dialog")?.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) (event.currentTarget as HTMLDialogElement).close();
});

let hudToastTimer = 0;
function showHudToast(message: string): void {
  const toast = document.querySelector<HTMLElement>("#hud-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(hudToastTimer);
  hudToastTimer = window.setTimeout(() => { toast.hidden = true; }, 2_200);
}

function captureGameScreenshot(): void {
  const canvas = game.canvas;
  if (!canvas) {
    showHudToast("Màn chơi chưa sẵn sàng để chụp.");
    return;
  }
  try {
    canvas.toBlob((blob) => {
      if (!blob) {
        showHudToast("Chưa thể lưu ảnh lúc này.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const now = new Date();
      const stamp = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("")
        + "-" + [String(now.getHours()).padStart(2, "0"), String(now.getMinutes()).padStart(2, "0"), String(now.getSeconds()).padStart(2, "0")].join("");
      link.href = url;
      link.download = `quan-nhau-${stamp}.png`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
      showHudToast("Đã lưu ảnh màn chơi.");
    }, "image/png");
  } catch {
    showHudToast("Chưa thể lưu ảnh lúc này.");
  }
}

document.querySelector<HTMLInputElement>("#music-volume")?.addEventListener("input", (event) => {
  const slider = event.currentTarget;
  if (slider instanceof HTMLInputElement) musicPlayer.setVolume(Number(slider.value));
});

document.querySelector<HTMLFormElement>("#store-name-form")?.addEventListener("submit", saveStoreName);
document.querySelector<HTMLInputElement>("#store-name-input")?.addEventListener("input", () => {
  updateStoreNameDraft();
  const error = document.querySelector<HTMLElement>("#store-name-error");
  if (error) error.textContent = "";
});
document.querySelector<HTMLButtonElement>("#cancel-store-name")?.addEventListener("click", () => {
  if (editingStoreName) {
    const modal = document.querySelector<HTMLElement>("#store-name-modal");
    if (modal) modal.hidden = true;
  }
});
document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const suggestion = target.closest<HTMLButtonElement>("button[data-store-name-suggestion]");
  if (!suggestion?.dataset.storeNameSuggestion) return;
  const input = document.querySelector<HTMLInputElement>("#store-name-input");
  if (!input) return;
  input.value = suggestion.dataset.storeNameSuggestion;
  updateStoreNameDraft();
  input.focus();
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const tabButton = target.closest<HTMLButtonElement>("button[data-tab-target]");
  if (tabButton?.dataset.tabTarget) {
    if (homeOpen) {
      closeHome();
      if (tabButton.dataset.tabTarget === "outside") return;
    }
    if (wholesaleMarketOpen) {
      closeWholesaleMarket();
      if (tabButton.dataset.tabTarget === "outside") {
        return;
      }
    }
    if (tabButton.dataset.tabTarget === "outside") {
      const wasDining = store.getSnapshot().serviceMode === "dining";
      if (wasDining) {
        setLocation("street");
        scene.centerOnShop();
      } else if (scene.isNearShopEntrance()) {
        setLocation("dining");
      } else {
        selectTab("outside");
      }
      return;
    }
    if (tabButton.dataset.tabTarget === "menu" && store.getSnapshot().serviceMode === "dining") {
      selectTab("outside");
      setDiningPanelMode("kitchen");
      return;
    }
    selectTab(tabButton.dataset.tabTarget, true);
  }
});

document.addEventListener("fullscreenchange", () => {
  const fullscreenButton = document.querySelector<HTMLButtonElement>(".fullscreen-button");
  const isFullscreen = Boolean(document.fullscreenElement);
  if (!fullscreenButton) return;
  setIcon(document.querySelector("#fullscreen-icon"), isFullscreen ? "exit-fullscreen" : "fullscreen");
  fullscreenButton.setAttribute("aria-label", isFullscreen ? "Thoát toàn màn hình" : "Bật toàn màn hình");
  fullscreenButton.title = isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình";
});

store.subscribe(render);
selectTab("outside");
if (!store.getSnapshot().storeName) openStoreNameModal();
