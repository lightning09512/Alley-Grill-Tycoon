import Phaser from "phaser";
import "./style.css";
import { BUSINESS_STAGE_NAMES, CART_UPGRADE_COST, CUSTOMER_TYPES, INGREDIENTS, MAX_CART_LEVEL, RECIPES, RESTOCK_PACK_COST, STAFF_HIRE_COST } from "./game/data";
import { GameStore, getDiningTableCapacity, type GameSnapshot } from "./game/GameStore";
import { MusicPlayer } from "./game/MusicPlayer";
import { NeighborhoodScene } from "./game/NeighborhoodScene";
import { DiningRoomScene } from "./game/DiningRoomScene";
import { GAME_NAME_VI, GAME_TITLE } from "./config/game";
import { SHOP_STAGES } from "./config/shopStages";
import { iconMarkup, setIcon, type UiIconName } from "./ui/icons";
import kitchenShelfUrl from "../assets/interior-v2/stations/bowl_shelf.png?url";
import kitchenHoodUrl from "../assets/interior-v2/stations/exhaust_hood_small.png?url";
import kitchenGrillUrl from "../assets/interior-v2/stations/charcoal_grill_t1.png?url";
import kitchenPrepUrl from "../assets/interior-v2/stations/prep_counter_short.png?url";
import kitchenRiceUrl from "../assets/interior-v2/stations/rice_cooker.png?url";

document.title = GAME_TITLE;

const store = new GameStore();
const musicPlayer = new MusicPlayer((state) => {
  const control = document.querySelector<HTMLDetailsElement>(".music-control");
  const trigger = document.querySelector<HTMLElement>("#music-control-trigger");
  const toggle = document.querySelector<HTMLButtonElement>("#music-toggle");
  const icon = document.querySelector<HTMLElement>("#music-toggle-icon");
  const label = document.querySelector<HTMLElement>("#music-toggle-label");
  const trackName = document.querySelector<HTMLElement>("#music-track-name");
  const slider = document.querySelector<HTMLInputElement>("#music-volume");
  const volumeValue = document.querySelector<HTMLOutputElement>("#music-volume-value");

  if (control) control.dataset.playing = String(state.isPlaying);
  if (trigger) {
    trigger.setAttribute("aria-label", state.isPlaying ? "Nhạc nền đang phát" : "Mở điều khiển nhạc nền");
    trigger.title = state.isPlaying ? `Đang phát: ${state.trackName}` : "Nhạc nền";
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
  diningScene.setPreviewStage(initialStage);
  store.setDiningPreviewLevel(initialStage);
  if (shopStageDebugValue) shopStageDebugValue.textContent = `${String(initialStage).padStart(2, "0")} / ${SHOP_STAGES.length}`;
  // Bind this before Phaser initializes so a quick click during its asset load
  // is queued instead of being lost while the rest of the UI is still booting.
  shopStageDebugControls.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>("button[data-shop-stage-step]");
    if (button) {
      scene.stepShopStage(Number(button.dataset.shopStageStep));
      const previewStage = scene.getShopStageForDebug();
      diningScene.setPreviewStage(previewStage);
      store.setDiningPreviewLevel(previewStage);
    }
  });
}
let activeTab = "outside";
let diningView: "tables" | "kitchen" = "tables";
const app = document.querySelector<HTMLDivElement>("#app");
const phaserRoot = document.querySelector<HTMLDivElement>("#phaser-root");
if (!app || !phaserRoot) throw new Error("Không tìm thấy khung game.");
const kitchenArt: [string, string][] = [
  ["kitchen-shelf-art", kitchenShelfUrl],
  ["kitchen-hood-art", kitchenHoodUrl],
  ["kitchen-grill-art", kitchenGrillUrl],
  ["kitchen-prep-art", kitchenPrepUrl],
  ["kitchen-rice-art", kitchenRiceUrl],
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
    antialias: false,
    roundPixels: true,
  },
  scene: [scene, diningScene],
});

const resizeGameCanvasForDpr = (): void => {
  const bounds = phaserRoot.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(bounds.width * dpr));
  const height = Math.max(1, Math.round(bounds.height * dpr));
  scene.setDevicePixelRatio(dpr);
  diningScene.setDevicePixelRatio(dpr);
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

function setLocation(location: "street" | "dining"): void {
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
  setDiningPanelMode(view === "kitchen" ? "kitchen" : null);
  renderDining(store.getSnapshot());
}

function setDiningPanelMode(mode: "tables" | "kitchen" | null): void {
  const panel = document.querySelector<HTMLElement>("#dining-control-panel");
  const title = document.querySelector<HTMLElement>("#dining-panel-title");
  if (panel) {
    panel.hidden = mode === null;
    panel.dataset.mode = mode ?? "tables";
    panel.scrollTop = 0;
  }
  if (title) title.textContent = mode === "kitchen" ? "Phiếu bếp" : "Bàn ăn";
}

document.addEventListener("dining-table-selected", () => setDiningPanelMode("tables"));

let diningSwipeStart: { x: number; y: number; pointerId: number } | null = null;
const beginDiningSwipe = (event: PointerEvent): void => {
  if (store.getSnapshot().serviceMode !== "dining") return;
  if (event.target instanceof Element && event.target.closest("button, .dining-ticket-list")) return;
  diningSwipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
};
phaserRoot.addEventListener("pointerdown", beginDiningSwipe);
document.querySelector("#dining-control-panel")?.addEventListener("pointerdown", (event) => beginDiningSwipe(event as PointerEvent));
window.addEventListener("pointerup", (event) => {
  if (!diningSwipeStart || diningSwipeStart.pointerId !== event.pointerId) return;
  const dx = event.clientX - diningSwipeStart.x;
  const dy = event.clientY - diningSwipeStart.y;
  diningSwipeStart = null;
  if (store.getSnapshot().serviceMode !== "dining" || Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
  if (dx < 0 && diningView === "tables") setDiningView("kitchen");
  else if (dx > 0 && diningView === "kitchen") setDiningView("tables");
});
window.addEventListener("pointercancel", () => { diningSwipeStart = null; });

game.events.once(Phaser.Core.Events.READY, () => {
  phaserReady = true;
  applyLocationScenes();
});

let editingStoreName = false;

function getDisplayStoreName(name: string): string {
  return name.replace(/^(?:xe\s+)?bánh\s+mì(?=\s|$)/i, "Quán Nhậu");
}

function updateStoreNameDraft(): void {
  const input = document.querySelector<HTMLInputElement>("#store-name-input");
  const preview = document.querySelector<HTMLElement>("#store-name-preview");
  const count = document.querySelector<HTMLElement>("#store-name-count");
  if (!input) return;
  const draft = input.value.replace(/\s+/g, " ").trim().slice(0, input.maxLength);
  if (preview) preview.textContent = getDisplayStoreName(draft) || "Tên quán của bạn";
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
  input.value = getDisplayStoreName(currentName);
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
  }
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
    menu: ["ĐANG PHỤC VỤ", "Thực đơn"],
    recipes: ["SỔ TAY MÓN NGON", "Sổ món"],
    stock: ["KHO NGUYÊN LIỆU", "Cửa hàng"],
  };
  const [eyebrow, title] = headings[activeTab] ?? ["GÓC PHỐ SÀI GÒN", "Bảng quản lý"];
  const eyebrowNode = document.querySelector<HTMLElement>("#sheet-eyebrow");
  const titleNode = document.querySelector<HTMLElement>("#sheet-title");
  if (eyebrowNode) eyebrowNode.textContent = eyebrow;
  if (titleNode) titleNode.textContent = title;
  if (selectedPanel) activeButton?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function renderRecipes(snapshot: GameSnapshot): void {
  const list = document.querySelector<HTMLElement>("#recipe-collection");
  if (!list) return;
  list.innerHTML = Object.values(RECIPES).map((recipe) => {
    const unlocked = snapshot.cartLevel >= recipe.unlockLevel;
    const ingredientNames = recipe.ingredients.map((id) => INGREDIENTS.find((item) => item.id === id)?.name ?? id).join(" · ");
    return `<article class="recipe-card ${unlocked ? "" : "is-locked"}">${iconMarkup(unlocked ? "grill-meal" : "lock", "recipe-icon ui-icon")}<div><h3>${recipe.name}</h3><p>${unlocked ? ingredientNames : `Mở khóa ở cấp ${recipe.unlockLevel}`}</p></div><b>${unlocked ? `${recipe.salePrice} xu` : "Chưa mở"}</b></article>`;
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
  const outsideLabel = document.querySelector<HTMLElement>("#outside-nav-label");
  const inside = snapshot.serviceMode === "dining";
  if (root) root.hidden = !inside;
  if (app) app.dataset.location = inside ? "dining" : "street";
  if (outsideLabel) outsideLabel.textContent = inside ? "Ra phố" : "Bên ngoài";
  if (!inside) return;

  const guestStatusNames: Record<string, string> = {
    entering: "đang vào bàn",
    "waiting-order": "đã ngồi · chờ gọi món",
    "waiting-food": "đang chờ món",
    eating: "đang ăn",
    "awaiting-payment": "chờ thanh toán",
    leaving: "đang rời quán",
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

  if (shiftStatus) {
    const capacity = getDiningTableCapacity(shopStageDebugEnabled ? scene.getShopStageForDebug() : snapshot.cartLevel);
    shiftStatus.textContent = diningView === "kitchen"
      ? "Vuốt phải về phòng ăn"
      : snapshot.inShift
        ? `${snapshot.dining.guests.length} khách · ${snapshot.dining.tables.filter((table) => table.id <= capacity).flatMap((table) => table.seats).filter((seat) => seat.status === "empty").length} chỗ trống`
        : "Vuốt trái để vào bếp";
  }
  if (guestName) guestName.textContent = selectedGuest ? `${CUSTOMER_TYPES[selectedGuest.type].name} · bàn ${selectedGuest.tableId}, chỗ ${selectedGuest.seatIndex + 1}` : "Chưa chọn khách";
  if (dialogue) {
    dialogue.textContent = selectedGuest
      ? `“Cho tôi ${RECIPES[selectedGuest.recipe].name.toLowerCase()} nhé!”`
      : selectedSeat?.status === "dirty"
        ? `Chỗ ${selectedSeat.index + 1} tại bàn ${selectedTable?.id} đang cần dọn.`
        : "Chạm khách đang ngồi để nghe lời gọi món.";
  }
  if (recipeLine) {
    recipeLine.textContent = selectedGuest
      ? `${RECIPES[selectedGuest.recipe].name} · ${guestStatusNames[selectedGuest.status]}`
      : "Chưa có món được gọi.";
  }
  if (contextActions) {
    const actions: string[] = [];
    if (selectedSeat?.status === "dirty") {
      actions.push(`<button class="dining-action-button" data-action="dining-clean" data-table-id="${selectedTable!.id}" data-seat-index="${selectedSeat.index}" type="button">Dọn chỗ ${selectedSeat.index + 1}</button>`);
    }
    if (selectedGuest && guestOrder?.status === "called" && selectedGuest.status === "waiting-order") {
      actions.push(`<button class="dining-action-button" data-action="dining-accept" type="button">Nhận order</button>`);
    }
    if (selectedOrder?.status === "ready") {
      actions.push(`<button class="dining-action-button" data-action="dining-serve" type="button">Bưng món</button>`);
    }
    if (selectedGuest && guestOrder?.status === "delivered" && selectedGuest.status === "awaiting-payment") {
      actions.push(`<button class="dining-action-button" data-action="dining-pay" type="button">Thu tiền</button>`);
    }
    if (actions.length === 0 && !snapshot.inShift && selectedSeat?.status !== "dirty") {
      actions.push("<span class=\"dining-empty-action\">Khách sẽ tự chọn bàn khi quán tiếp tục bán.</span>");
    }
    contextActions.innerHTML = actions.join("");
  }

  const visibleOrders = snapshot.dining.orders.filter((order) => order.status !== "paid" && order.status !== "called");
  if (ticketList) {
    ticketList.innerHTML = visibleOrders.length > 0
      ? visibleOrders.map((order) => { const guest = snapshot.dining.guests.find((entry) => entry.id === order.guestId); return `<button type="button" class="dining-ticket-button ${selectedOrder?.id === order.id ? "is-selected" : ""}" data-dining-order="${order.id}" data-status="${order.status}">Bàn ${order.tableId}, chỗ ${(guest?.seatIndex ?? 0) + 1} · ${RECIPES[order.recipe].name} · ${orderStatusNames[order.status]}</button>`; }).join("")
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
  const canChooseIngredient = snapshot.inShift
    && selectedOrder?.status === "queued"
    && (!snapshot.dining.activeOrderId || snapshot.dining.activeOrderId === selectedOrder.id);
  if (ingredientGrid) {
    ingredientGrid.innerHTML = INGREDIENTS.map((ingredient) => `<button type="button" class="dining-ingredient-button" data-action="dining-ingredient" data-ingredient="${ingredient.id}" ${canChooseIngredient ? "" : "disabled"}>${iconMarkup(ingredient.icon as UiIconName, "ui-icon")}<b>${ingredient.name}</b><small>${snapshot.inventory[ingredient.id]}</small></button>`).join("");
  }
  if (feedback) feedback.textContent = snapshot.dining.feedback;
}

function render(snapshot: GameSnapshot): void {
  const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector);
  const coins = $("#coins");
  const reputation = $("#reputation");
  const orderTitle = $("#order-title");
  const orderHint = $("#order-hint");
  const callout = $("#customer-callout");
  const feedback = $("#feedback");
  const queueCount = $("#queue-count");
  const status = $("#street-status");
  const level = $("#cart-level");
  const businessStage = $("#business-stage");
  const upgradeButton = $("[data-action='upgrade']") as HTMLButtonElement | null;
  const hireButton = $("#hire-button") as HTMLButtonElement | null;
  const storeNameDisplay = $("#store-name-display");
  const storeNameShort = $("#store-name-short");

  if (storeNameDisplay) storeNameDisplay.textContent = getDisplayStoreName(snapshot.storeName) || GAME_NAME_VI;
  if (storeNameShort) storeNameShort.textContent = getDisplayStoreName(snapshot.storeName) || "Chưa đặt tên";
  if (coins) coins.textContent = snapshot.coins.toLocaleString("vi-VN");
  if (reputation) reputation.textContent = snapshot.reputation.toLocaleString("vi-VN");
  if (feedback) feedback.textContent = snapshot.offlineNotice || snapshot.feedback;
  if (queueCount) queueCount.textContent = snapshot.customers.length.toString();
  if (status) status.textContent = snapshot.inShift ? "Phố đang nhộn nhịp" : "Góc phố thân quen";
  if (level) level.textContent = `CẤP ${snapshot.cartLevel} / ${MAX_CART_LEVEL}`;
  if (level) level.title = BUSINESS_STAGE_NAMES[snapshot.cartLevel - 1];
  if (businessStage) businessStage.textContent = BUSINESS_STAGE_NAMES[snapshot.cartLevel - 1];
  renderRecipes(snapshot);
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
  if (orderTitle) orderTitle.textContent = activeCustomer?.status === "walking"
    ? "Khách đang tới quầy…"
    : activeCustomer ? RECIPES[activeCustomer.recipe].name : "Chưa có khách";
  if (orderHint) {
    if (!snapshot.inShift) orderHint.textContent = "Khách sẽ tự ghé quán. Chọn đúng thứ tự nguyên liệu để nhận tiền boa và danh tiếng.";
    else if (activeCustomer?.status === "walking") orderHint.textContent = `${CUSTOMER_TYPES[activeCustomer.type].shortName} đang đi bộ tới quầy trên vỉa hè.`;
    else if (activeCustomer) orderHint.textContent = `${CUSTOMER_TYPES[activeCustomer.type].shortName} đang chờ. Chạm nguyên liệu theo thứ tự bên dưới.`;
    else orderHint.textContent = "Quán đang chờ khách mới. Trong lúc chờ, chuẩn bị nguyên liệu nhé.";
  }

  const steps = $("#order-steps");
  if (steps) {
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

  for (const ingredient of INGREDIENTS) {
    const stock = $(`#stock-${ingredient.id}`);
    const button = $(`[data-ingredient='${ingredient.id}']`) as HTMLButtonElement | null;
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
  if (restockLabel) restockLabel.textContent = snapshot.emergencyRestockAvailable ? "Nhận nguyên liệu dự phòng" : "Nhập một chuyến hàng";
  if (restockCost) restockCost.textContent = snapshot.emergencyRestockAvailable
    ? "Miễn phí · thêm 4 phần mỗi món"
    : `${RESTOCK_PACK_COST} xu · thêm 5 phần mỗi món`;

  const nextUpgradeCost = CART_UPGRADE_COST[snapshot.cartLevel] ?? 0;
  const upgradeLabel = $("#upgrade-label");
  const upgradeCost = $("#upgrade-cost");
  if (upgradeLabel) upgradeLabel.querySelector<HTMLElement>(".action-label")!.textContent = snapshot.cartLevel < MAX_CART_LEVEL ? `Nâng quán lên cấp ${snapshot.cartLevel + 1}` : "Đã đạt cấp cao nhất";
  if (upgradeCost) upgradeCost.textContent = nextUpgradeCost > 0 ? `${nextUpgradeCost.toLocaleString("vi-VN")} xu` : "Đã đạt cấp cao nhất";
  if (upgradeButton) upgradeButton.disabled = nextUpgradeCost === 0 || snapshot.coins < nextUpgradeCost;

  const hireCost = $("#hire-cost");
  const businessNote = $("#business-note");
  const recentService = $("#recent-service");
  const staffStatus = $("#staff-status");
  if (recentService) {
    recentService.textContent = snapshot.report
      ? `2 phút vừa qua: phục vụ ${snapshot.report.served} khách · lãi ${snapshot.report.net >= 0 ? "+" : ""}${snapshot.report.net.toLocaleString("vi-VN")} xu.`
      : "Quán đang đón khách. Doanh thu gần đây sẽ hiện ở đây.";
  }
  if (snapshot.hasStaff) {
    if (hireCost) hireCost.textContent = "Đã có phụ bếp · lương 30 xu/2 phút";
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
    if (hireCost) hireCost.textContent = snapshot.cartLevel >= 2 ? `${STAFF_HIRE_COST.toLocaleString("vi-VN")} xu` : "1.200 xu · cần quán cấp 2";
    if (businessNote) businessNote.textContent = "Phục vụ món để dành tiền nâng cấp. Có phụ bếp, quán vẫn kiếm xu khi bạn rời game.";
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
  const button = target.closest<HTMLButtonElement>("button[data-action]");
  const diningTicketButton = target.closest<HTMLButtonElement>("button[data-dining-order]");
  if (diningTicketButton?.dataset.diningOrder) {
    store.selectDiningOrder(diningTicketButton.dataset.diningOrder);
    return;
  }
  if (!button || button.disabled) return;

  switch (button.dataset.action) {
    case "enter-dining":
      setLocation("dining");
      break;
    case "dining-close-panel":
      setDiningPanelMode(null);
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
  if (event.target instanceof Element && event.target.closest(".music-control")) return;
  stopAutoStartMusic();
  if (musicPlayer.shouldAutoStart) void musicPlayer.play();
}

document.addEventListener("pointerdown", startMusicAfterGesture);
document.addEventListener("keydown", startMusicAfterGesture);
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
    if (tabButton.dataset.tabTarget === "outside") {
      const wasDining = store.getSnapshot().serviceMode === "dining";
      if (wasDining) setLocation("street");
      selectTab("outside");
      if (!wasDining) scene.centerOnShop();
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

const mapHint = document.querySelector<HTMLElement>("#map-hint");
if (shopStageDebugEnabled && mapHint) mapHint.hidden = true;
phaserRoot.addEventListener("pointerdown", () => mapHint?.classList.add("is-dismissed"), { once: true });
window.setTimeout(() => mapHint?.classList.add("is-dismissed"), 6_000);
