import Phaser from "phaser";
import "./style.css";
import { BUSINESS_STAGE_NAMES, CART_UPGRADE_COST, CUSTOMER_TYPES, INGREDIENTS, MAX_CART_LEVEL, RECIPES, RESTOCK_PACK_COST, STAFF_HIRE_COST } from "./game/data";
import { GameStore, getDiningTableCapacity, type CashCollectionEvent, type GameSnapshot } from "./game/GameStore";
import { formatVndFromThousands } from "./game/currency";
import { MENU_DISHES, MENU_CATEGORIES, MENU_INGREDIENTS, type MenuCategory, type MenuDish, type MenuIngredientId } from "./game/menuCatalog";
import { MusicPlayer } from "./game/MusicPlayer";
import { NeighborhoodScene } from "./game/NeighborhoodScene";
import { DiningRoomScene } from "./game/DiningRoomScene";
import { WholesaleMarketScene, type WholesaleMarketBackgroundMood } from "./game/WholesaleMarketScene";
import { formatStoreNameForDisplay, GAME_TITLE } from "./config/game";
import { SHOP_STAGES } from "./config/shopStages";
import { iconMarkup, setIcon, type UiIconName } from "./ui/icons";
import kitchenRoomShellUrl from "../assets/interior-v2/kitchen-pack-v1/kitchen-room-shell-empty.png?url";
import kitchenObjectsLayoutUrl from "../assets/interior-v2/kitchen-pack-v1/kitchen_objects_layout.png?url";
import hotpotGrillSheetUrl from "../assets/interior-v2/food/food-spritesheet-hotpot-grill.png?url";
import snacksRiceSheetUrl from "../assets/interior-v2/food/food-spritesheet-snacks-rice.png?url";
import mixedGrillPlatterUrl from "../assets/interior-v2/food/mixed_grill_platter.png?url";

document.title = GAME_TITLE;

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
const wholesaleMarketScene = new WholesaleMarketScene();
wholesaleMarketScene.setBackgroundMoodProvider((): WholesaleMarketBackgroundMood => scene.getWholesaleMarketBackgroundMood());
const shopStageDebugControls = document.querySelector<HTMLDivElement>("#shop-stage-debug");
const shopStageDebugValue = document.querySelector<HTMLElement>("#shop-stage-debug-value");
const debugParams = new URLSearchParams(window.location.search);
const shopStageDebugEnabled = import.meta.env.DEV && debugParams.get("debug") === "1";
if (shopStageDebugControls && shopStageDebugEnabled) {
  shopStageDebugControls.hidden = false;
  const requestedStage = Number(debugParams.get("stage"));
  const initialStage = Number.isInteger(requestedStage) && requestedStage >= 1 && requestedStage <= SHOP_STAGES.length
    ? requestedStage
    : store.getSnapshot().cartLevel;
  if (shopStageDebugValue) shopStageDebugValue.textContent = `${String(initialStage).padStart(2, "0")} / ${SHOP_STAGES.length}`;
  // Bind this before Phaser initializes so a quick click during its asset load
  // is queued instead of being lost while the rest of the UI is still booting.
  shopStageDebugControls.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>("button[data-shop-stage-step]");
    if (button) {
      scene.stepShopStage(Number(button.dataset.shopStageStep));
    }
  });
}
let activeTab = "outside";
let diningView: "tables" | "kitchen" = "tables";
let homeOpen = false;
let wholesaleMarketOpen = false;
let wholesaleMarketStarted = false;
let wholesaleMarketSleeping = false;
let selectedMenuCategory: MenuCategory | "all" = "all";
const app = document.querySelector<HTMLDivElement>("#app");
const phaserRoot = document.querySelector<HTMLDivElement>("#phaser-root");
const gameLoadingScreen = document.querySelector<HTMLElement>("#game-loading-screen");
const gameLoadingCopy = document.querySelector<HTMLElement>("#game-loading-copy");
const gameLoadingProgress = document.querySelector<HTMLElement>("#game-loading-progress");
const wholesaleMarketInterface = document.querySelector<HTMLDivElement>("#market-interface");
const homeInterface = document.querySelector<HTMLDivElement>("#home-interface");
const wholesaleMarketSectionCopy = document.querySelector<HTMLElement>("#market-section-copy");
const wholesaleMarketSectionButton = document.querySelector<HTMLButtonElement>("#market-section-button");
const wholesaleMarketPanCopy = document.querySelector<HTMLElement>("#market-pan-copy");
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

const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
const initialCanvasBounds = phaserRoot.getBoundingClientRect();
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
game.scene.add("wholesale-market", wholesaleMarketScene, false);
const updateStreetStatus = (): void => {
  const status = document.querySelector<HTMLElement>("#street-status");
  const indicator = document.querySelector<HTMLElement>("#street-crowd-indicator");
  if (scene.isHomeZoneActive()) {
    if (status) status.textContent = "Khu nhà dân";
    indicator?.removeAttribute("data-crowd");
  } else if (scene.isWholesaleMarketZoneActive()) {
    if (status) status.textContent = "Chợ đầu mối";
    indicator?.removeAttribute("data-crowd");
  } else {
    const crowd = scene.getStreetCrowdState();
    if (status) status.textContent = crowd.label;
    if (indicator) indicator.dataset.crowd = crowd.level;
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
  scene.setMovementVector(directionX, directionY);
};
const resetMovementJoystick = (pointerId?: number): void => {
  if (pointerId !== undefined && movementJoystickPointerId !== pointerId) return;
  movementJoystickPointerId = null;
  if (movementJoystickKnob) movementJoystickKnob.style.transform = "translate3d(0,0,0)";
  scene.setMovementVector(0, 0);
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
    scene.scene.setVisible(false, "neighborhood");
    scene.scene.setVisible(false, "dining-room");
    return;
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
  if (homeInterface) homeInterface.hidden = false;
  if (app) app.dataset.location = "home";
  applyLocationScenes();
}

function closeHome(): void {
  homeOpen = false;
  if (homeInterface) homeInterface.hidden = true;
  if (app) app.dataset.location = "street";
  applyLocationScenes();
}

function openWholesaleMarket(): void {
  if (store.getSnapshot().serviceMode !== "street") return;
  selectTab("outside");
  wholesaleMarketScene.setSection("produce");
  updateWholesaleMarketSectionUI();
  wholesaleMarketOpen = true;
  if (wholesaleMarketInterface) wholesaleMarketInterface.hidden = false;
  if (app) app.dataset.location = "market";
  applyLocationScenes();
}

function closeWholesaleMarket(): void {
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
    produce: "Khu rau củ và nông sản",
    seafood: "Sạp thịt, cá & hải sản",
  } as const;
  const buttonCopy = {
    exterior: "Vào khu rau củ ↑",
    produce: "Qua khu thịt cá →",
    seafood: "Về khu rau củ ←",
  } as const;
  const buttonLabels = {
    exterior: "Vào khu rau củ trong chợ",
    produce: "Đi sang khu thịt và hải sản",
    seafood: "Quay lại khu rau củ",
  } as const;
  if (wholesaleMarketSectionCopy) {
    wholesaleMarketSectionCopy.textContent = sectionCopy[section];
  }
  if (wholesaleMarketSectionButton) {
    wholesaleMarketSectionButton.textContent = buttonCopy[section];
    wholesaleMarketSectionButton.setAttribute("aria-label", buttonLabels[section]);
  }
  if (wholesaleMarketPanCopy) {
    wholesaleMarketPanCopy.textContent = "Kéo ngang để xem bãi xe và các dãy nhà";
    wholesaleMarketPanCopy.closest(".market-pan-hint")?.toggleAttribute("hidden", section !== "exterior");
  }
}

function toggleWholesaleMarketSection(): void {
  const next = {
    exterior: "produce",
    produce: "seafood",
    seafood: "produce",
  } as const;
  wholesaleMarketScene.setSection(next[wholesaleMarketScene.getSection()]);
  updateWholesaleMarketSectionUI();
}

function setLocation(location: "street" | "dining"): void {
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
  renderDining(store.getSnapshot());
}

function setDiningPanelMode(mode: "tables" | "kitchen" | null): void {
  const panel = document.querySelector<HTMLElement>("#dining-control-panel");
  const title = document.querySelector<HTMLElement>("#dining-panel-title");
  const kitchenPanelToggle = document.querySelector<HTMLButtonElement>("#dining-panel-toggle");
  const isOpen = mode !== null;
  if (app) app.dataset.diningPanelOpen = String(isOpen);
  if (panel) {
    panel.hidden = !isOpen;
    panel.dataset.mode = mode ?? "tables";
    panel.scrollTop = 0;
  }
  if (title) title.textContent = mode === "kitchen" ? "Phiếu bếp" : "Bàn ăn";
  kitchenPanelToggle?.setAttribute("aria-expanded", String(isOpen));
}

document.addEventListener("dining-table-selected", () => setDiningPanelMode("tables"));

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
  if (!store.getSnapshot().inShift) store.startShift();
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
  if (selectedPanel) activeButton?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function menuDishArtMarkup(dish: MenuDish): string {
  if (dish.visual.type === "sheet") {
    const imageUrl = dish.visual.sheet === "hotpot-grill" ? hotpotGrillSheetUrl : snacksRiceSheetUrl;
    const column = dish.visual.cell % 4;
    const row = Math.floor(dish.visual.cell / 4);
    return `<span class="menu-dish-art menu-dish-art--sheet" role="img" aria-label="${dish.name}" style="--menu-sheet: url('${imageUrl}'); --menu-position-x: ${column * 100 / 3}%; --menu-position-y: ${row * 100 / 3}%"></span>`;
  }
  if (dish.visual.type === "image") return `<img class="menu-dish-art menu-dish-art--image" src="${mixedGrillPlatterUrl}" alt="${dish.name}">`;
  return `<span class="menu-dish-art menu-dish-art--icon">${iconMarkup(dish.visual.icon, "ui-icon")}</span>`;
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

function renderMenuCatalog(): void {
  const list = document.querySelector<HTMLElement>("#menu-dish-collection");
  const count = document.querySelector<HTMLElement>("#menu-catalog-count");
  if (!list) return;

  const visibleDishes = selectedMenuCategory === "all"
    ? MENU_DISHES
    : MENU_DISHES.filter((dish) => dish.category === selectedMenuCategory);
  const categoryName = selectedMenuCategory === "all"
    ? "4 danh mục"
    : MENU_CATEGORIES.find((category) => category.id === selectedMenuCategory)?.name ?? "Món ăn";
  if (count) count.textContent = selectedMenuCategory === "all"
    ? `${visibleDishes.length} món · ${categoryName}`
    : `${categoryName} · ${visibleDishes.length} món`;

  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-menu-filter]")) {
    const active = button.dataset.menuFilter === selectedMenuCategory;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  }

  list.innerHTML = visibleDishes.map((dish) => {
    const profit = dish.suggestedPrice - dish.estimatedCost;
    const priceLabel = dish.currentRecipe ? "Giá bán" : "Giá gợi ý";
    const costLabel = dish.currentRecipe ? "Chi phí" : "Chi phí dự kiến";
    const profitLabel = dish.currentRecipe ? "Lãi gộp" : "Lời dự kiến";
    const categoryLabel = MENU_CATEGORIES.find((category) => category.id === dish.category)?.name ?? "Món ăn";
    return `<article class="menu-dish-card">
      <div class="menu-dish-art-frame">${menuDishArtMarkup(dish)}</div>
      <div class="menu-dish-copy">
        <div class="menu-dish-heading"><div><span class="menu-dish-category">${categoryLabel}</span><h3>${dish.name}</h3></div><span class="menu-dish-status ${dish.currentRecipe ? "is-current" : ""}">${dish.currentRecipe ? "Đang bán" : "Gợi ý"}</span></div>
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
      </div>
    </article>`;
  }).join("");
}

function renderDining(snapshot: GameSnapshot): void {
  const root = document.querySelector<HTMLElement>("#dining-interface");
  const shiftStatus = document.querySelector<HTMLElement>("#dining-shift-status");
  const guestName = document.querySelector<HTMLElement>("#dining-guest-name");
  const dialogue = document.querySelector<HTMLElement>("#dining-dialogue");
  const recipeLine = document.querySelector<HTMLElement>("#dining-recipe-line");
  const contextActions = document.querySelector<HTMLElement>("#dining-context-actions");
  const ticketList = document.querySelector<HTMLElement>("#dining-ticket-list");
  const kitchenStatus = document.querySelector<HTMLElement>("#dining-kitchen-status");
  const ingredientGrid = document.querySelector<HTMLElement>("#dining-ingredient-grid");
  const feedback = document.querySelector<HTMLElement>("#dining-feedback");
  const inside = snapshot.serviceMode === "dining";
  if (root) root.hidden = !inside;
  if (app) app.dataset.location = homeOpen ? "home" : wholesaleMarketOpen ? "market" : inside ? "dining" : "street";
  updateOutsideNavLabel();
  if (!inside) return;

  const guestStatusNames: Record<string, string> = {
    approaching: "đang đi bộ tới quán",
    entering: "đang vào bàn",
    "waiting-order": "đã ngồi · chờ gọi món",
    "waiting-food": "đang chờ món",
    eating: "đang ăn",
    "awaiting-payment": "chờ thanh toán",
    leaving: "đang rời quán",
    departing: "đang đi ra phố",
  };
  const orderStatusNames: Record<string, string> = {
    called: "Khách vừa gọi",
    queued: "Chờ bếp",
    cooking: "Đang nấu",
    ready: "Đã sẵn sàng",
    delivered: "Đã giao",
    paid: "Đã thanh toán",
  };
  const selectedGuest = snapshot.dining.guests.find((guest) => guest.id === snapshot.dining.selectedGuestId);
  const selectedOrder = snapshot.dining.orders.find((order) => order.id === snapshot.dining.selectedOrderId);
  const selectedTable = snapshot.dining.tables.find((table) => table.id === snapshot.dining.selectedTableId);
  const selectedSeat = selectedTable?.seats.find((seat) => seat.index === snapshot.dining.selectedSeatIndex);
  const guestOrder = selectedGuest && snapshot.dining.orders.find((order) => order.guestId === selectedGuest.id);
  const selectedPartyGuests = selectedGuest ? snapshot.dining.guests.filter((guest) => guest.partyId === selectedGuest.partyId) : [];
  const selectedPartyOrders = selectedGuest ? snapshot.dining.orders.filter((order) => order.partyId === selectedGuest.partyId) : [];

  if (shiftStatus) {
    const capacity = getDiningTableCapacity();
    const partyCount = new Set(snapshot.dining.guests.map((guest) => guest.partyId)).size;
    shiftStatus.textContent = diningView === "kitchen"
      ? (snapshot.inShift ? "Ca đang chạy · vuốt trái về phòng ăn" : "Ca đã nghỉ · vuốt trái về phòng ăn")
      : snapshot.inShift
        ? `${snapshot.dining.guests.length} khách · ${partyCount} nhóm · ${snapshot.dining.tables.filter((table) => table.id <= capacity).flatMap((table) => table.seats).filter((seat) => seat.status === "empty").length} chỗ trống`
        : "Vuốt phải để vào bếp";
  }
  if (guestName) {
    const partyLabel = selectedGuest
      ? `${selectedGuest.partyType === "family" ? "Gia đình" : "Nhóm bạn"} ${selectedGuest.partySize} người`
      : "";
    guestName.textContent = selectedGuest
      ? `${partyLabel} · ${CUSTOMER_TYPES[selectedGuest.type].name} · bàn ${selectedGuest.tableId}, chỗ ${selectedGuest.seatIndex + 1}`
      : "Chưa chọn khách";
  }
  if (dialogue) {
    dialogue.textContent = selectedGuest
      ? selectedGuest.status === "waiting-order"
        ? `“${selectedGuest.orderDialogue}” · cả nhóm gọi ${selectedPartyOrders.length} món`
        : `“${selectedGuest.orderDialogue}”`
      : selectedSeat?.status === "dirty"
        ? `Chỗ ${selectedSeat.index + 1} tại bàn ${selectedTable?.id} đang cần dọn.`
        : "Chạm khách đang ngồi để nghe lời gọi món.";
  }
  if (recipeLine) {
    recipeLine.textContent = selectedGuest
      ? `${selectedPartyOrders.length} món: ${selectedPartyOrders.map((order) => RECIPES[order.recipe].name).join(" · ")} · ${guestStatusNames[selectedGuest.status]}`
      : "Chưa có món được gọi.";
  }
  if (contextActions) {
    const actions: string[] = [];
    if (selectedSeat?.status === "dirty") {
      actions.push(`<button class="dining-action-button" data-action="dining-clean" data-table-id="${selectedTable!.id}" data-seat-index="${selectedSeat.index}" type="button">Dọn chỗ ${selectedSeat.index + 1}</button>`);
    }
    const canAcceptParty = selectedGuest
      && selectedPartyGuests.length === selectedGuest.partySize
      && selectedPartyGuests.every((guest) => guest.status === "waiting-order")
      && selectedPartyOrders.length === selectedPartyGuests.length
      && selectedPartyOrders.every((order) => order.status === "called");
    if (canAcceptParty) {
      actions.push(`<button class="dining-action-button" data-action="dining-accept" type="button">Nhận order nhóm · ${selectedPartyOrders.length} món</button>`);
    } else if (selectedGuest && selectedPartyGuests.some((guest) => guest.status === "approaching" || guest.status === "entering")) {
      const arrivedMembers = selectedPartyGuests.filter((guest) => guest.status !== "approaching" && guest.status !== "entering").length;
      actions.push(`<span class="dining-empty-action">Đang chờ cả nhóm tới và ngồi đủ chỗ (${arrivedMembers}/${selectedPartyGuests.length}).</span>`);
    }
    if (selectedOrder?.status === "ready") {
      actions.push(`<button class="dining-action-button" data-action="dining-serve" type="button">Bưng món</button>`);
    }
    if (selectedGuest && guestOrder?.status === "delivered"
      && selectedPartyGuests.length > 0 && selectedPartyGuests.every((guest) => guest.status === "awaiting-payment")) {
      actions.push(`<button class="dining-action-button" data-action="dining-pay" type="button">Thu hóa đơn · ${selectedPartyOrders.length} món</button>`);
    }
    if (actions.length === 0 && !snapshot.inShift && selectedSeat?.status !== "dirty") {
      actions.push("<span class=\"dining-empty-action\">Khách sẽ tự chọn bàn khi quán tiếp tục bán.</span>");
    }
    contextActions.innerHTML = actions.join("");
  }

  const visibleOrders = snapshot.dining.orders.filter((order) => order.status !== "paid" && order.status !== "called");
  if (ticketList) {
    ticketList.innerHTML = visibleOrders.length > 0
      ? visibleOrders.map((order) => { const guest = snapshot.dining.guests.find((entry) => entry.id === order.guestId); return `<button type="button" class="dining-ticket-button ${selectedOrder?.id === order.id ? "is-selected" : ""}" data-dining-order="${order.id}" data-status="${order.status}">Bàn ${order.tableId} · ${guest?.partyType === "family" ? "Gia đình" : "Nhóm bạn"} ${guest?.partySize ?? ""} người · ${RECIPES[order.recipe].name} · ${orderStatusNames[order.status]}</button>`; }).join("")
      : "<span class=\"dining-empty-action\">Chưa có phiếu bếp.</span>";
  }
  if (kitchenStatus) {
    if (selectedOrder?.status === "cooking") kitchenStatus.textContent = `Đang nấu · còn khoảng ${selectedOrder.cookSeconds}s.`;
    else if (selectedOrder?.status === "queued") {
      const next = RECIPES[selectedOrder.recipe].ingredients[selectedOrder.assembly.length];
      const nextName = INGREDIENTS.find((item) => item.id === next)?.name ?? "hoàn tất món";
      kitchenStatus.textContent = `Phiếu bàn ${selectedOrder.tableId} · tiếp theo: ${nextName}.`;
    } else if (selectedOrder) kitchenStatus.textContent = `${RECIPES[selectedOrder.recipe].name} · ${orderStatusNames[selectedOrder.status]}.`;
    else kitchenStatus.textContent = "Chọn phiếu ở bếp; chỉ nấu một order mỗi lần.";
  }
  if (kitchenStatus && selectedOrder?.status === "ready") {
    kitchenStatus.innerHTML = `Món đã sẵn sàng cho bàn ${selectedOrder.tableId}. <button class="dining-action-button" data-action="dining-serve" type="button">Bưng món tới bàn ${selectedOrder.tableId}</button>`;
  }
  const activeKitchenOrder = snapshot.dining.orders.find((order) => order.id === snapshot.dining.activeOrderId);
  if (kitchenStatus && selectedOrder?.status === "queued"
    && snapshot.dining.activeOrderId && snapshot.dining.activeOrderId !== selectedOrder.id) {
    kitchenStatus.textContent = activeKitchenOrder
      ? "Bếp đang xử lý " + RECIPES[activeKitchenOrder.recipe].name + " · bàn " + activeKitchenOrder.tableId + ". Hoàn tất phiếu đó trước."
      : "Bếp đang khôi phục phiếu còn dang dở; hãy chờ nhịp cập nhật tiếp theo.";
  }
  const canChooseIngredient = snapshot.inShift
    && selectedOrder?.status === "queued"
    && (!snapshot.dining.activeOrderId || snapshot.dining.activeOrderId === selectedOrder.id);
  if (ingredientGrid) {
    ingredientGrid.innerHTML = INGREDIENTS.map((ingredient) => `<button type="button" class="dining-ingredient-button" data-action="dining-ingredient" data-ingredient="${ingredient.id}" ${canChooseIngredient ? "" : "disabled"}>${iconMarkup(ingredient.icon as UiIconName, "ui-icon")}<b>${ingredient.name}</b><small>${snapshot.inventory[ingredient.id]}</small></button>`).join("");
  }
  if (feedback) feedback.textContent = snapshot.dining.feedback;
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
      coins.textContent = Math.round(from + (to - from) * eased).toLocaleString("vi-VN");
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
    if (coins) coins.textContent = displayedCoinBalance.toLocaleString("vi-VN");
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
    if (fallbackBalance) fallbackBalance.textContent = displayedCoinBalance.toLocaleString("vi-VN");
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
  const flights = Array.from({ length: 3 }, (_, index) => {
    const bill = document.createElement("img");
    bill.className = "money-cash-flight";
    bill.src = "/assets/money-stack.png";
    bill.alt = "";
    bill.draggable = false;
    const startX = origin.x + (index - 1) * 12;
    const startY = origin.y + (index % 2 ? -8 : 6);
    const deltaX = target.x - startX;
    const deltaY = target.y - startY;
    bill.style.left = `${startX}px`;
    bill.style.top = `${startY}px`;
    layer.append(bill);
    const animation = bill.animate([
      { opacity: 0, transform: "translate(-50%, -50%) scale(.62) rotate(-16deg)" },
      { opacity: 1, offset: 0.18, transform: `translate(calc(-50% + ${deltaX * 0.15}px), calc(-50% + ${deltaY * 0.15 - 28}px)) scale(.95) rotate(9deg)` },
      { opacity: 0.18, transform: `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(.28) rotate(24deg)` },
    ], {
      duration: prefersReducedMotion ? 1 : 760,
      delay: prefersReducedMotion ? 0 : index * 95,
      easing: "cubic-bezier(.2,.72,.21,1)",
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
    fallbackBalance.textContent = displayedCoinBalance.toLocaleString("vi-VN");
  }
  if (walletPill) walletPill.setAttribute("aria-label", `Số dư ${formatVndFromThousands(displayedCoinBalance)}`);

  if (cashFlightQueue.length > 0) {
    await playNextCashCollection();
    return;
  }
  if (fallbackWallet) window.setTimeout(() => { fallbackWallet.hidden = true; }, 700);
  displayedCoinBalance = latestCoinBalance;
  coins.textContent = displayedCoinBalance.toLocaleString("vi-VN");
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
  const hireButton = $("#hire-button") as HTMLButtonElement | null;
  const storeNameShort = $("#store-name-short");

  if (storeNameShort) storeNameShort.textContent = formatStoreNameForDisplay(snapshot.storeName) || "Chưa đặt tên";
  latestCoinBalance = snapshot.coins;
  if (snapshot.cashCollection) queueCashCollection(snapshot.cashCollection);
  if (coins && !cashFlightPlaying) coins.textContent = snapshot.coins.toLocaleString("vi-VN");
  if (walletPill && !cashFlightPlaying) walletPill.setAttribute("aria-label", `Số dư ${formatVndFromThousands(snapshot.coins)}`);
  if (reputation) reputation.textContent = snapshot.reputation.toLocaleString("vi-VN");
  if (feedback) feedback.textContent = snapshot.offlineNotice || snapshot.feedback;
  if (status) updateStreetStatus();
  if (level) level.textContent = `CẤP ${snapshot.cartLevel} / ${MAX_CART_LEVEL}`;
  if (level) level.title = BUSINESS_STAGE_NAMES[snapshot.cartLevel - 1];
  if (businessStage) businessStage.textContent = BUSINESS_STAGE_NAMES[snapshot.cartLevel - 1];
  renderDining(snapshot);

  if (callout) {
    const customer = snapshot.customers[0];
    if (snapshot.inShift && customer?.status === "walking") {
      callout.textContent = `${CUSTOMER_TYPES[customer.type].name} đang đi tới quán…`;
    } else if (snapshot.inShift && customer) {
      callout.textContent = `${CUSTOMER_TYPES[customer.type].name} gọi ${RECIPES[customer.recipe].name.toLowerCase()} · còn ${customer.patience}s`;
    } else if (snapshot.inShift) {
      callout.textContent = "Đang đợi khách kế tiếp ghé quán…";
    } else {
      callout.textContent = "Khách sẽ sớm ghé quán.";
    }
  }

  const activeCustomer = snapshot.customers[0];
  const waitingForStreetOrder = snapshot.serviceMode === "street" && activeCustomer?.status === "waiting";
  const hasDiningOrder = snapshot.serviceMode === "dining"
    && snapshot.dining.orders.some((order) => order.status === "called" || order.status === "queued" || order.status === "ready");
  document.querySelector<HTMLElement>('[data-tab-target="menu"]')?.classList.toggle("has-task", waitingForStreetOrder || hasDiningOrder);
  if (orderTitle) orderTitle.textContent = activeCustomer?.status === "walking"
    ? "Khách đang tới"
    : activeCustomer ? RECIPES[activeCustomer.recipe].name : "Chưa có khách";
  if (orderHint) {
    if (!snapshot.inShift) orderHint.textContent = "Mở quán để đón khách.";
    else if (activeCustomer?.status === "walking") orderHint.textContent = `${CUSTOMER_TYPES[activeCustomer.type].shortName} đang tới quầy.`;
    else if (activeCustomer) orderHint.textContent = "Chạm nguyên liệu theo thứ tự để làm món.";
    else orderHint.textContent = "Đang chờ khách mới. Hãy chuẩn bị nguyên liệu.";
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
      steps.innerHTML = recipe.ingredients.map((ingredientId, index) => {
        const item = INGREDIENTS.find((entry) => entry.id === ingredientId)!;
        const done = index < snapshot.assembly.length;
        const current = index === snapshot.assembly.length;
        return `<span class="step-chip ${done ? "done" : ""} ${current ? "current" : ""}"><i>${iconMarkup(done ? "check" : item.icon as UiIconName, "step-icon ui-icon")}</i>${item.name}</span>`;
      }).join("");
    }
  }
  const streetIngredientGrid = $(".sheet-content[data-menu-content='menu'] .ingredient-grid");
  if (streetIngredientGrid) streetIngredientGrid.hidden = !waitingForStreetOrder;
  if (feedback) feedback.hidden = !waitingForStreetOrder;

  const lowStock = INGREDIENTS.filter((ingredient) => snapshot.inventory[ingredient.id] <= 2);
  document.querySelector<HTMLElement>('[data-tab-target="stock"]')?.classList.toggle("has-alert", lowStock.length > 0);
  const stockStatus = $("#stock-status");
  if (stockStatus) {
    stockStatus.textContent = lowStock.length
      ? `Sắp hết: ${lowStock.map((ingredient) => ingredient.name).join(", ")}`
      : "Nguyên liệu đã sẵn sàng cho ca bán.";
  }

  for (const ingredient of INGREDIENTS) {
    const stock = $(`#stock-${ingredient.id}`);
    const button = $(`.ingredient-button[data-ingredient='${ingredient.id}']`) as HTMLButtonElement | null;
    const count = snapshot.inventory[ingredient.id];
    if (stock) stock.textContent = `${count} phần`;
    const stockCount = $(`[data-stock-count="${ingredient.id}"]`);
    if (stockCount) stockCount.textContent = count.toString();
    if (button) button.disabled = snapshot.serviceMode !== "street" || !snapshot.inShift || !activeCustomer || activeCustomer.status !== "waiting" || count < 1;
  }

  const restockButton = $("[data-action='restock']") as HTMLButtonElement | null;
  const restockLabel = $("#restock-label");
  const restockCost = $("#restock-cost");
  if (restockButton) restockButton.disabled = snapshot.coins < RESTOCK_PACK_COST && !snapshot.emergencyRestockAvailable;
  if (restockLabel) restockLabel.textContent = snapshot.emergencyRestockAvailable ? "Nhận nguyên liệu dự phòng" : "Nhập nguyên liệu";
  if (restockCost) restockCost.textContent = snapshot.emergencyRestockAvailable
    ? "Miễn phí · +4 mỗi loại"
    : `${formatVndFromThousands(RESTOCK_PACK_COST)} · +5 mỗi loại`;

  const nextUpgradeCost = CART_UPGRADE_COST[snapshot.cartLevel] ?? 0;
  const upgradeLabel = $("#upgrade-label");
  const upgradeCost = $("#upgrade-cost");
  if (upgradeLabel) upgradeLabel.querySelector<HTMLElement>(".action-label")!.textContent = snapshot.cartLevel < MAX_CART_LEVEL ? `Nâng quán lên cấp ${snapshot.cartLevel + 1}` : "Đã đạt cấp cao nhất";
  if (upgradeCost) upgradeCost.textContent = nextUpgradeCost > 0 ? formatVndFromThousands(nextUpgradeCost) : "Đã đạt cấp cao nhất";
  if (upgradeButton) upgradeButton.disabled = nextUpgradeCost === 0 || snapshot.coins < nextUpgradeCost;

  const hireCost = $("#hire-cost");
  const businessNote = $("#business-note");
  const recentService = $("#recent-service");
  const staffStatus = $("#staff-status");
  if (recentService) {
    recentService.textContent = snapshot.report
      ? `2 phút vừa qua: phục vụ ${snapshot.report.served} khách · lãi ${snapshot.report.net >= 0 ? "+" : ""}${formatVndFromThousands(snapshot.report.net)}.`
      : "Quán đang đón khách. Doanh thu gần đây sẽ hiện ở đây.";
  }
  if (snapshot.hasStaff) {
    if (hireCost) hireCost.textContent = `Đã có phụ bếp · lương ${formatVndFromThousands(30)}/2 phút`;
    if (businessNote) businessNote.textContent = "Phụ bếp tự phục vụ khách ngoài phố và trong quán, giúp quán có thu nhập ngoại tuyến tối đa 4 giờ.";
    if (staffStatus) {
      const cookingOrder = snapshot.dining.orders.find((order) => order.status === "cooking");
      staffStatus.textContent = snapshot.serviceMode === "dining"
        ? cookingOrder ? `Phụ bếp đang nấu món cho bàn ${cookingOrder.tableId}.` : "Phụ bếp đang hỗ trợ nhận món, bưng món, thu tiền và dọn bàn."
        : snapshot.customers.some((customer) => customer.status === "waiting") ? "Phụ bếp đang hỗ trợ khách tại quầy ngoài phố." : "Phụ bếp đang chờ khách mới.";
    }
    if (hireButton) {
      hireButton.disabled = true;
      hireButton.querySelector<HTMLElement>(".action-label")!.textContent = "Đã thuê phụ bếp";
    }
  } else {
    if (hireCost) hireCost.textContent = snapshot.cartLevel >= 2 ? formatVndFromThousands(STAFF_HIRE_COST) : "1.200.000đ · cần quán cấp 2";
    if (businessNote) businessNote.textContent = "Phục vụ món để dành tiền nâng cấp. Có phụ bếp, quán vẫn kiếm tiền khi bạn rời game.";
    if (staffStatus) staffStatus.textContent = "Thuê phụ bếp từ cấp quán 2 để hỗ trợ phục vụ.";
    if (hireButton) {
      hireButton.disabled = snapshot.cartLevel < 2 || snapshot.coins < STAFF_HIRE_COST;
      hireButton.querySelector<HTMLElement>(".action-label")!.textContent = "Thuê phụ bếp";
    }
  }

  for (const button of document.querySelectorAll<HTMLButtonElement>(".ingredient-button")) {
    button.classList.toggle("is-ready", !button.disabled);
  }

}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const categoryButton = target.closest<HTMLButtonElement>("button[data-menu-filter]");
  if (categoryButton?.dataset.menuFilter) {
    const filter = categoryButton.dataset.menuFilter;
    selectedMenuCategory = filter === "all" ? "all" : filter as MenuCategory;
    renderMenuCatalog();
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
  const button = target.closest<HTMLButtonElement>("button[data-action]");
  const diningTicketButton = target.closest<HTMLButtonElement>("button[data-dining-order]");
  if (diningTicketButton?.dataset.diningOrder) {
    store.selectDiningOrder(diningTicketButton.dataset.diningOrder);
    return;
  }
  if (!button || button.disabled) return;

  switch (button.dataset.action) {
    case "leave-home":
      closeHome();
      break;
    case "leave-wholesale-market":
      closeWholesaleMarket();
      break;
    case "toggle-wholesale-market-section":
      toggleWholesaleMarketSection();
      break;
    case "dining-close-panel":
      setDiningPanelMode(null);
      break;
    case "dining-toggle-panel":
      setDiningPanelMode("kitchen");
      break;
    case "dining-accept":
      store.acceptDiningOrder();
      setDiningPanelMode("tables");
      break;
    case "dining-serve":
      store.serveSelectedDiningOrder();
      break;
    case "dining-pay":
      store.collectDiningPayment();
      break;
    case "dining-clean":
      store.cleanDiningTable(Number(button.dataset.tableId), Number(button.dataset.seatIndex));
      break;
    case "ingredient": {
      const id = button.dataset.ingredient;
      if (id) store.tapIngredient(id as "bread" | "pate" | "cha" | "egg" | "greens");
      break;
    }
    case "dining-ingredient": {
      const id = button.dataset.ingredient;
      if (id) store.tapDiningIngredient(id as "bread" | "pate" | "cha" | "egg" | "greens");
      break;
    }
    case "restock":
      store.restock();
      break;
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
    case "screenshot":
      captureGameScreenshot();
      break;
    case "toggle-music":
      stopAutoStartMusic();
      void musicPlayer.toggle();
      break;
  }
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
      setDiningView("kitchen");
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
else store.startShift();
