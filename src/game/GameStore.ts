import {
  CART_UPGRADE_COST,
  BUSINESS_STAGE_NAMES,
  CUSTOMER_ARRIVAL_SECONDS,
  CUSTOMER_PATIENCE_SECONDS,
  CUSTOMER_TYPES,
  INGREDIENTS,
  OFFLINE_CAP_MINUTES,
  OFFLINE_COINS_PER_MINUTE,
  RECIPES,
  RESTOCK_PACK_COST,
  RESTOCK_PACK_SIZE,
  SHIFT_SECONDS,
  STAFF_HIRE_COST,
  STAFF_WAGE_PER_SHIFT,
  MAX_CART_LEVEL,
  createStartingInventory,
  getRecipeCost,
  type CustomerType,
  type IngredientId,
  type Inventory,
  type RecipeId,
} from "./data";
import { diningCharacterForArrival, diningTravelSeconds } from "./diningCharacters";

export interface WaitingCustomer {
  id: number;
  type: CustomerType;
  recipe: RecipeId;
  patience: number;
  status: "walking" | "waiting";
}

export type ServiceMode = "street" | "dining";
export type DiningTableStatus = "empty" | "reserved" | "occupied" | "dirty";
export interface DiningSeat {
  index: number;
  status: DiningTableStatus;
  guestId: string | null;
}
export type DiningGuestStatus = "entering" | "waiting-order" | "waiting-food" | "eating" | "awaiting-payment" | "leaving";
export type DiningOrderStatus = "called" | "queued" | "cooking" | "ready" | "delivered" | "paid";

export interface DiningTable {
  id: number;
  status: DiningTableStatus;
  guestId: string | null;
  seats: DiningSeat[];
}

export interface DiningGuest {
  id: string;
  tableId: number;
  seatIndex: number;
  characterId: string;
  type: CustomerType;
  recipe: RecipeId;
  status: DiningGuestStatus;
  patience: number;
  transitionSeconds: number;
}

export interface DiningOrder {
  id: string;
  guestId: string;
  tableId: number;
  recipe: RecipeId;
  status: DiningOrderStatus;
  assembly: IngredientId[];
  cookSeconds: number;
  eatSeconds: number;
}

export interface DiningState {
  tables: DiningTable[];
  guests: DiningGuest[];
  orders: DiningOrder[];
  selectedTableId: number | null;
  selectedSeatIndex: number | null;
  selectedGuestId: string | null;
  selectedOrderId: string | null;
  activeOrderId: string | null;
  arrivalClock: number;
  feedback: string;
}

export interface ShiftReport {
  served: number;
  left: number;
  revenue: number;
  tips: number;
  ingredientCosts: number;
  wages: number;
  net: number;
  reputationEarned: number;
}

export interface GameSnapshot {
  storeName: string;
  coins: number;
  reputation: number;
  cartLevel: number;
  hasStaff: boolean;
  inventory: Inventory;
  inShift: boolean;
  secondsRemaining: number;
  elapsedSeconds: number;
  customers: WaitingCustomer[];
  assembly: IngredientId[];
  feedback: string;
  report: ShiftReport | null;
  offlineNotice: string;
  shiftRevenue: number;
  nightAmount: number;
  totalServed: number;
  emergencyRestockAvailable: boolean;
  serviceMode: ServiceMode;
  dining: DiningState;
}

interface SavedGame {
  version: 1;
  storeName?: string;
  coins: number;
  reputation: number;
  cartLevel: number;
  hasStaff: boolean;
  inventory: Inventory;
  totalServed: number;
  lastSavedAt: number;
}

const SAVE_KEY = "banh-mi-pho-save-v1";
const STORE_NAME_MAX_LENGTH = 24;

export function getDiningTableCapacity(_level: number): number {
  return 6;
}

function createDiningState(): DiningState {
  return {
    tables: [1, 2, 3, 4, 5, 6].map((id) => ({
      id,
      status: "empty",
      guestId: null,
      seats: [0, 1, 2, 3].map((index) => ({ index, status: "empty", guestId: null })),
    })),
    guests: [],
    orders: [],
    selectedTableId: 1,
    selectedSeatIndex: null,
    selectedGuestId: null,
    selectedOrderId: null,
    activeOrderId: null,
    arrivalClock: 0,
    feedback: "Chọn bàn để xem khách; khách mới sẽ tự tìm chỗ trống.",
  };
}

function normalizeStoreName(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, STORE_NAME_MAX_LENGTH);
}

export class GameStore {
  private storeName = "";
  private coins = 100;
  private reputation = 0;
  private cartLevel = 1;
  private hasStaff = false;
  private inventory = createStartingInventory();
  private inShift = false;
  private secondsRemaining = 0;
  private elapsedSeconds = 0;
  private customers: WaitingCustomer[] = [];
  private assembly: IngredientId[] = [];
  private feedback = "Chào buổi sáng! Khách sẽ tự ghé quán.";
  private report: ShiftReport | null = null;
  private offlineNotice = "";
  private shiftRevenue = 0;
  private shiftTips = 0;
  private shiftIngredientCosts = 0;
  private shiftServed = 0;
  private shiftLeft = 0;
  private shiftReputation = 0;
  private arrivalClock = 0;
  private staffClock = 0;
  private customerId = 0;
  private lastPersistAt = 0;
  private totalServed = 0;
  private serviceMode: ServiceMode = "street";
  private dining = createDiningState();
  private diningPreviewLevel: number | null = null;
  private readonly listeners = new Set<(snapshot: GameSnapshot) => void>();

  constructor() {
    this.load();
  }

  subscribe(listener: (snapshot: GameSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  setDiningPreviewLevel(level: number): void {
    this.diningPreviewLevel = Number.isFinite(level) ? level : null;
    this.publish();
  }

  getSnapshot(): GameSnapshot {
    const nightAmount = this.inShift
      ? Math.max(0, Math.min(1, (this.elapsedSeconds - 85) / 35))
      : 0;

    return {
      storeName: this.storeName,
      coins: this.coins,
      reputation: this.reputation,
      cartLevel: this.cartLevel,
      hasStaff: this.hasStaff,
      inventory: { ...this.inventory },
      inShift: this.inShift,
      secondsRemaining: this.secondsRemaining,
      elapsedSeconds: this.elapsedSeconds,
      customers: this.customers.map((customer) => ({ ...customer })),
      assembly: [...this.assembly],
      feedback: this.feedback,
      report: this.report ? { ...this.report } : null,
      offlineNotice: this.offlineNotice,
      shiftRevenue: this.shiftRevenue,
      nightAmount,
      totalServed: this.totalServed,
      emergencyRestockAvailable: this.coins < RESTOCK_PACK_COST && !this.canMakeAnyRecipe(),
      serviceMode: this.serviceMode,
      dining: {
        ...this.dining,
        tables: this.dining.tables.map((table) => ({ ...table, seats: table.seats.map((seat) => ({ ...seat })) })),
        guests: this.dining.guests.map((guest) => ({ ...guest })),
        orders: this.dining.orders.map((order) => ({ ...order, assembly: [...order.assembly] })),
      },
    };
  }

  setServiceMode(mode: ServiceMode): void {
    if (this.serviceMode === mode) return;
    this.serviceMode = mode;
    if (mode === "dining" && this.inShift && this.dining.guests.length === 0) {
      this.arriveDiningGuest();
    }
    this.dining.feedback = mode === "dining"
      ? "Khách sẽ tự vào và chọn bàn trống. Chạm khách để xem lời gọi món."
      : "Bạn đang ở ngoài phố; vòng phục vụ tại quầy vẫn giữ nguyên.";
    this.publish();
  }

  selectDiningTable(tableId: number): void {
    const table = this.dining.tables.find((entry) => entry.id === tableId);
    if (!table) return;
    const seat = table.seats.find((entry) => entry.guestId === this.dining.selectedGuestId)
      ?? table.seats.find((entry) => entry.guestId)
      ?? table.seats.find((entry) => entry.status === "dirty")
      ?? table.seats[0];
    this.selectDiningSeat(tableId, seat.index);
  }

  selectDiningSeat(tableId: number, seatIndex: number): void {
    const table = this.dining.tables.find((entry) => entry.id === tableId);
    const seat = table?.seats[seatIndex];
    if (!table || !seat) return;
    this.dining.selectedTableId = tableId;
    this.dining.selectedSeatIndex = seatIndex;
    if (seat.status === "dirty") {
      this.dining.selectedGuestId = null;
      this.dining.selectedOrderId = null;
      this.dining.feedback = `Chỗ ${seatIndex + 1} tại bàn ${tableId} cần dọn.`;
      this.publish();
      return;
    }
    if (seat.status === "empty") {
      this.dining.selectedGuestId = null;
      this.dining.selectedOrderId = null;
      this.dining.feedback = this.inShift
        ? `Chỗ ${seatIndex + 1} tại bàn ${tableId} đang trống.`
        : "Khách sẽ tự đến khi quán tiếp tục bán.";
      this.publish();
      return;
    }
    const guest = this.dining.guests.find((entry) => entry.id === seat.guestId);
    if (!guest) {
      this.dining.selectedGuestId = null;
      this.dining.selectedOrderId = null;
      this.dining.feedback = `Bàn ${tableId} đang được giữ chỗ.`;
      this.publish();
      return;
    }
    this.dining.selectedGuestId = guest.id;
    const order = this.dining.orders.find((entry) => entry.guestId === guest.id);
    this.dining.selectedOrderId = order?.id ?? null;
    this.dining.feedback = this.getDiningGuestDialogue(guest);
    this.publish();
  }

  acceptDiningOrder(): void {
    const guest = this.dining.guests.find((entry) => entry.id === this.dining.selectedGuestId);
    const order = guest && this.dining.orders.find((entry) => entry.guestId === guest.id);
    if (!this.inShift || !guest || !order || guest.status !== "waiting-order" || order.status !== "called") {
      this.dining.feedback = "Chọn khách đang chờ gọi món để nhận phiếu nhé.";
      this.publish();
      return;
    }
    if (!this.hasRecipeStock(order.recipe)) {
      this.dining.feedback = "Kho đang thiếu nguyên liệu cho món này; chưa gửi phiếu tới bếp.";
      this.publish();
      return;
    }
    order.status = "queued";
    guest.status = "waiting-food";
    this.dining.selectedOrderId = order.id;
    this.dining.feedback = `Đã nhận ${RECIPES[order.recipe].name.toLowerCase()}; phiếu đang chờ ở bếp.`;
    this.publish();
  }

  selectDiningOrder(orderId: string): void {
    const order = this.dining.orders.find((entry) => entry.id === orderId);
    if (!order || !["queued", "cooking", "ready", "delivered", "paid"].includes(order.status)) return;
    if (order.status === "queued" && this.dining.activeOrderId && this.dining.activeOrderId !== order.id) {
      this.dining.feedback = "Bếp đang nấu phiếu khác. Hoàn tất phiếu đó rồi hãy bắt đầu phiếu này.";
      this.publish();
      return;
    }
    this.dining.selectedOrderId = order.id;
    const guest = this.dining.guests.find((entry) => entry.id === order.guestId);
    if (guest) {
      this.dining.selectedGuestId = guest.id;
      this.dining.selectedTableId = guest.tableId;
      this.dining.selectedSeatIndex = guest.seatIndex;
    }
    this.dining.feedback = `${RECIPES[order.recipe].name} · ${this.getDiningOrderStatusName(order.status)}.`;
    this.publish();
  }

  tapDiningIngredient(ingredientId: IngredientId): void {
    const order = this.dining.orders.find((entry) => entry.id === this.dining.selectedOrderId);
    if (!this.inShift || !order || order.status !== "queued" || (this.dining.activeOrderId && this.dining.activeOrderId !== order.id)) {
      this.dining.feedback = "Chọn một phiếu đang chờ ở bếp trước khi lấy nguyên liệu.";
      this.publish();
      return;
    }
    const recipe = RECIPES[order.recipe];
    const expectedIngredient = recipe.ingredients[order.assembly.length];
    if (ingredientId !== expectedIngredient) {
      const expectedName = INGREDIENTS.find((item) => item.id === expectedIngredient)?.name ?? "nguyên liệu kế tiếp";
      this.dining.feedback = `Sai thứ tự rồi — bếp cần ${expectedName}. Kho chưa bị trừ.`;
      this.publish();
      return;
    }
    order.assembly.push(ingredientId);
    this.dining.activeOrderId = order.id;
    if (order.assembly.length < recipe.ingredients.length) {
      const next = recipe.ingredients[order.assembly.length];
      const nextName = INGREDIENTS.find((item) => item.id === next)?.name;
      this.dining.feedback = `Đúng rồi! Phiếu này cần thêm ${nextName}.`;
      this.publish();
      return;
    }
    if (!this.hasRecipeStock(order.recipe)) {
      order.assembly = [];
      this.dining.activeOrderId = null;
      this.dining.feedback = "Kho không đủ nguyên liệu cho món này. Chưa có nguyên liệu nào bị trừ.";
      this.publish();
      return;
    }
    for (const ingredient of recipe.ingredients) this.inventory[ingredient] -= 1;
    const ingredientCost = getRecipeCost(order.recipe);
    this.shiftIngredientCosts += ingredientCost;
    order.status = "cooking";
    order.cookSeconds = 3;
    this.dining.feedback = `Bếp đang nấu ${recipe.name.toLowerCase()}…`;
    this.persist();
    this.publish();
  }

  serveSelectedDiningOrder(): void {
    const order = this.dining.orders.find((entry) => entry.id === this.dining.selectedOrderId);
    if (!order || order.status !== "ready") {
      this.dining.feedback = "Chọn phiếu món đã sẵn sàng rồi hãy bưng.";
      this.publish();
      return;
    }
    if (order.guestId !== this.dining.selectedGuestId) {
      this.dining.feedback = "Sai khách rồi. Hãy chọn đúng khách đang chờ món trên phiếu.";
      this.publish();
      return;
    }
    const guest = this.dining.guests.find((entry) => entry.id === order.guestId);
    if (!guest || guest.status !== "waiting-food") {
      this.dining.feedback = "Khách này không còn chờ món nữa.";
      this.publish();
      return;
    }
    order.status = "delivered";
    guest.status = "eating";
    order.eatSeconds = 5;
    this.dining.feedback = `Đã bưng món tới bàn ${guest.tableId}. Khách đang dùng bữa.`;
    this.publish();
  }

  collectDiningPayment(): void {
    const order = this.dining.orders.find((entry) => entry.id === this.dining.selectedOrderId);
    if (!order || order.status !== "delivered") {
      this.dining.feedback = "Khách chưa ăn xong; chưa thể thu tiền.";
      this.publish();
      return;
    }
    if (order.guestId !== this.dining.selectedGuestId) {
      this.dining.feedback = "Sai khách rồi. Chọn đúng bàn có món vừa giao để thu tiền.";
      this.publish();
      return;
    }
    const guest = this.dining.guests.find((entry) => entry.id === order.guestId);
    if (!guest || guest.status !== "awaiting-payment") {
      this.dining.feedback = "Khách chưa gọi thanh toán.";
      this.publish();
      return;
    }
    this.payDiningOrder(order, guest, false);
  }

  cleanDiningTable(tableId: number, seatIndex = this.dining.selectedSeatIndex ?? 0): void {
    const table = this.dining.tables.find((entry) => entry.id === tableId);
    const seat = table?.seats[seatIndex];
    if (!table || !seat || seat.status !== "dirty") {
      this.dining.feedback = "Bàn này chưa cần dọn hoặc vẫn đang có khách.";
      this.publish();
      return;
    }
    seat.status = "empty";
    seat.guestId = null;
    this.syncDiningTable(table);
    this.dining.selectedTableId = table.id;
    this.dining.selectedSeatIndex = seatIndex;
    this.dining.selectedGuestId = null;
    if (this.dining.selectedOrderId && !this.dining.guests.some((guest) => guest.id === this.dining.orders.find((order) => order.id === this.dining.selectedOrderId)?.guestId)) {
      this.dining.selectedOrderId = null;
    }
    this.dining.orders = this.dining.orders.filter((order) => order.status !== "paid" || this.dining.guests.some((guest) => guest.id === order.guestId));
    this.dining.feedback = `Đã dọn chỗ ${seatIndex + 1} tại bàn ${tableId}.`;
    this.publish();
  }

  setStoreName(value: string): boolean {
    const storeName = normalizeStoreName(value);
    if (!storeName) return false;
    this.storeName = storeName;
    this.feedback = `Đã treo biển hiệu “${storeName}”.`;
    this.persist();
    this.publish();
    return true;
  }

  startShift(): void {
    if (this.inShift) return;
    this.offlineNotice = "";
    this.inShift = true;
    this.secondsRemaining = SHIFT_SECONDS;
    this.elapsedSeconds = 0;
    this.customers = this.serviceMode === "street" ? [this.makeCustomer()] : [];
    this.dining = createDiningState();
    if (this.serviceMode === "dining") this.arriveDiningGuest();
    this.assembly = [];
    this.shiftRevenue = 0;
    this.shiftTips = 0;
    this.shiftIngredientCosts = 0;
    this.shiftServed = 0;
    this.shiftLeft = 0;
    this.shiftReputation = 0;
    this.arrivalClock = 0;
    this.staffClock = 0;
    this.report = null;
    this.feedback = this.serviceMode === "street"
      ? "Khách đầu tiên đang đi bộ tới quán. Chờ bạn ấy tới rồi bắt đầu chế biến món nhé!"
      : "Ca bán trong phòng ăn bắt đầu. Khách đầu tiên đang chọn bàn.";
    this.persist();
    this.publish();
  }

  tapIngredient(ingredientId: IngredientId): void {
    this.offlineNotice = "";
    if (this.serviceMode === "dining") {
      this.feedback = "Đơn trong phòng ăn được nấu bằng phiếu bếp bên trong quán.";
      this.publish();
      return;
    }
    if (!this.inShift) {
      this.feedback = "Chờ quán tiếp tục bán rồi mình chế biến món nhé.";
      this.publish();
      return;
    }

    const customer = this.customers[0];
    if (!customer) {
      this.feedback = "Chưa có khách ở quầy, chờ khách kế tiếp nhé.";
      this.publish();
      return;
    }
    if (customer.status !== "waiting") {
      this.feedback = "Khách đang đi bộ tới quán; đợi bạn ấy tới rồi chế biến món nhé.";
      this.publish();
      return;
    }

    const recipe = RECIPES[customer.recipe];
    if (!this.hasRecipeStock(customer.recipe)) {
      this.assembly = [];
      this.feedback = "Thiếu nguyên liệu cho món này. Hãy nhập thêm hàng nhé.";
      this.publish();
      return;
    }

    const expectedIngredient = recipe.ingredients[this.assembly.length];
    if (ingredientId !== expectedIngredient) {
      const expectedName = INGREDIENTS.find((item) => item.id === expectedIngredient)?.name ?? "nguyên liệu kế tiếp";
      this.feedback = `Khách đang chờ ${expectedName}. Chọn đúng thứ tự để hoàn thành món nhé.`;
      this.publish();
      return;
    }

    this.assembly.push(ingredientId);
    if (this.assembly.length === recipe.ingredients.length) {
      this.completeOrder(false);
    } else {
      const next = recipe.ingredients[this.assembly.length];
      const nextName = INGREDIENTS.find((item) => item.id === next)?.name;
      this.feedback = `Đúng rồi! Tiếp theo: ${nextName}.`;
      this.publish();
    }
  }

  markCustomerWalking(customerId: number): void {
    const customer = this.customers.find((entry) => entry.id === customerId);
    if (!customer || customer.status === "walking") return;
    customer.status = "walking";
    this.assembly = [];
    this.feedback = "Khách phía trước đang bước tới quầy.";
    this.publish();
  }

  markCustomerArrived(customerId: number): void {
    const customer = this.customers.find((entry) => entry.id === customerId);
    if (!customer || customer.status === "waiting") return;
    customer.status = "waiting";
    this.feedback = "Khách đã tới quán. Hoàn thiện món theo đơn nhé!";
    this.publish();
  }

  restock(): void {
    this.offlineNotice = "";
    if (this.coins < RESTOCK_PACK_COST) {
      if (!this.canMakeAnyRecipe()) {
        for (const ingredient of INGREDIENTS) this.inventory[ingredient.id] += 4;
        this.feedback = "Quán đã nhận 4 phần nguyên liệu cơ bản để tiếp tục phục vụ khách.";
        this.persist();
      } else {
        this.feedback = `Chưa đủ xu nhập hàng; cần ${RESTOCK_PACK_COST} xu.`;
      }
      this.publish();
      return;
    }

    this.coins -= RESTOCK_PACK_COST;
    for (const ingredient of INGREDIENTS) this.inventory[ingredient.id] += RESTOCK_PACK_SIZE;
    this.feedback = `Đã nhập hàng: +${RESTOCK_PACK_SIZE} phần mỗi loại.`;
    this.persist();
    this.publish();
  }

  upgradeCart(): void {
    this.offlineNotice = "";
    const cost = CART_UPGRADE_COST[this.cartLevel];
    if (!cost) {
      this.feedback = "Thương hiệu đã đạt cấp cao nhất.";
      this.publish();
      return;
    }
    if (this.coins < cost) {
      this.feedback = `Cần thêm ${cost - this.coins} xu để nâng cấp quán.`;
      this.publish();
      return;
    }

    this.coins -= cost;
    this.cartLevel += 1;
    this.feedback = this.cartLevel === 2
      ? "Quán có bếp nướng mới và mặt quầy rộng hơn. Món đặc biệt đã mở!"
      : `Đã mở khóa ${BUSINESS_STAGE_NAMES[this.cartLevel - 1]}.`;
    this.persist();
    this.publish();
  }

  hireStaff(): void {
    this.offlineNotice = "";
    if (this.cartLevel < 2) {
      this.feedback = "Cần nâng quán lên cấp 2 trước khi thuê phụ bếp.";
      this.publish();
      return;
    }
    if (this.hasStaff) {
      this.feedback = "Phụ bếp đang phụ mình trông quán rồi!";
      this.publish();
      return;
    }
    if (this.coins < STAFF_HIRE_COST) {
      this.feedback = `Cần thêm ${STAFF_HIRE_COST - this.coins} xu để thuê phụ bếp.`;
      this.publish();
      return;
    }

    this.coins -= STAFF_HIRE_COST;
    this.hasStaff = true;
    this.feedback = "Đã thuê phụ bếp! Bạn ấy sẽ tự phục vụ khách và giúp quán có thu nhập ngoại tuyến.";
    this.persist();
    this.publish();
  }

  tick(): void {
    if (!this.inShift) return;

    this.elapsedSeconds += 1;
    this.secondsRemaining = SHIFT_SECONDS - (this.elapsedSeconds % SHIFT_SECONDS);
    if (this.serviceMode === "dining") this.tickDiningRoom();
    else this.tickStreetShift();

    if (this.elapsedSeconds % SHIFT_SECONDS === 0) this.settleServicePeriod();

    if (this.elapsedSeconds % 10 === 0) this.persist();
    this.publish();
  }

  private makeCustomer(): WaitingCustomer {
    const roll = Math.random();
    const type: CustomerType = roll < 0.32
      ? "student"
      : roll < 0.60
        ? "office"
        : roll < 0.82
          ? "shopper"
          : "tourist";

    let recipe: RecipeId;
    if (type === "student") recipe = "cha";
    else if (type === "office") recipe = "egg";
    else if (type === "tourist" && this.cartLevel >= 2) recipe = "special";
    else if (type === "shopper" && this.cartLevel >= 2 && Math.random() < 0.4) recipe = "special";
    else recipe = Math.random() < 0.5 ? "cha" : "egg";

    return { id: ++this.customerId, type, recipe, patience: CUSTOMER_PATIENCE_SECONDS, status: "walking" };
  }

  private tickStreetShift(): void {
    this.arrivalClock += 1;
    for (const customer of this.customers) {
      if (customer.status === "waiting") customer.patience -= 1;
    }
    const expired = this.customers.filter((customer) => customer.patience <= 0);
    if (expired.length > 0) {
      this.shiftLeft += expired.length;
      this.customers = this.customers.filter((customer) => customer.patience > 0);
      this.assembly = [];
      this.feedback = "Có khách đi mất vì đợi lâu. Nâng cấp quán hoặc nhờ phụ bếp để phục vụ nhanh hơn.";
    }
    if (this.arrivalClock >= CUSTOMER_ARRIVAL_SECONDS) {
      this.arrivalClock = 0;
      if (this.customers.length < 3) this.customers.push(this.makeCustomer());
    }
    if (this.hasStaff) {
      this.staffClock += 1;
      if (this.staffClock >= 8 && this.customers[0]?.status === "waiting" && this.assembly.length === 0) {
        this.staffClock = 0;
        this.completeOrder(true);
      }
    }
  }

  private tickDiningRoom(): void {
    this.dining.arrivalClock += 1;
    for (const guest of [...this.dining.guests]) {
      if (guest.status === "entering" || guest.status === "leaving") {
        guest.transitionSeconds -= 1;
        if (guest.transitionSeconds <= 0) {
          if (guest.status === "entering") {
            guest.status = "waiting-order";
            const table = this.dining.tables.find((entry) => entry.id === guest.tableId);
            if (table) {
              table.seats[guest.seatIndex].status = "occupied";
              this.syncDiningTable(table);
            }
            this.dining.feedback = `Khách đã ngồi bàn ${guest.tableId}; chạm khách để xem món muốn gọi.`;
          } else {
            const table = this.dining.tables.find((entry) => entry.id === guest.tableId);
            if (table) {
              table.seats[guest.seatIndex].status = "dirty";
              table.seats[guest.seatIndex].guestId = null;
              this.syncDiningTable(table);
            }
            this.dining.guests = this.dining.guests.filter((entry) => entry.id !== guest.id);
            if (this.dining.selectedGuestId === guest.id) this.dining.selectedGuestId = null;
            this.dining.feedback = `Chỗ ${guest.seatIndex + 1} tại bàn ${guest.tableId} cần dọn.`;
          }
        }
      } else if (guest.status === "waiting-order") {
        guest.patience -= 1;
        if (guest.patience <= 0) {
          guest.status = "leaving";
          guest.transitionSeconds = diningTravelSeconds(guest.tableId);
          this.shiftLeft += 1;
          this.dining.orders = this.dining.orders.filter((order) => order.guestId !== guest.id);
          if (this.dining.selectedGuestId === guest.id) this.dining.selectedGuestId = null;
          this.dining.feedback = `Khách bàn ${guest.tableId} rời đi vì chưa nhận order.`;
        }
      }
    }
    const cookingOrder = this.dining.orders.find((order) => order.id === this.dining.activeOrderId && order.status === "cooking");
    if (cookingOrder) {
      cookingOrder.cookSeconds -= 1;
      if (cookingOrder.cookSeconds <= 0) {
        cookingOrder.status = "ready";
        this.dining.activeOrderId = null;
        this.dining.selectedOrderId = cookingOrder.id;
        this.dining.feedback = `${RECIPES[cookingOrder.recipe].name} đã sẵn sàng. Chọn đúng khách để bưng món.`;
      }
    }
    for (const order of this.dining.orders) {
      if (order.status !== "delivered") continue;
      const guest = this.dining.guests.find((entry) => entry.id === order.guestId);
      if (!guest || guest.status !== "eating") continue;
      order.eatSeconds -= 1;
      if (order.eatSeconds <= 0) {
        guest.status = "awaiting-payment";
        this.dining.feedback = `Khách bàn ${guest.tableId} đã ăn xong; thu tiền để hoàn tất đơn.`;
      }
    }
    if (this.dining.arrivalClock >= CUSTOMER_ARRIVAL_SECONDS + 4) {
      this.dining.arrivalClock = 0;
      this.arriveDiningGuest();
    }
    if (this.hasStaff) {
      this.staffClock += 1;
      if (this.staffClock >= 3) {
        this.staffClock = 0;
        this.helpDiningRoom();
      }
    }
  }

  private arriveDiningGuest(): void {
    if (!this.inShift || this.serviceMode !== "dining") return;
    const unlockedTableCount = getDiningTableCapacity(this.diningPreviewLevel ?? this.cartLevel);
    const table = this.dining.tables
      .filter((entry) => entry.id <= unlockedTableCount && entry.seats.some((seat) => seat.status === "empty"))
      .sort((a, b) => a.seats.filter((seat) => seat.guestId).length - b.seats.filter((seat) => seat.guestId).length || a.id - b.id)[0];
    if (!table) return;
    const seat = table.seats.find((entry) => entry.status === "empty")!;
    const customer = this.makeCustomer();
    const guestId = `dining-guest-${customer.id}`;
    const orderId = `dining-order-${customer.id}`;
    seat.status = "reserved";
    seat.guestId = guestId;
    this.syncDiningTable(table);
    const guest: DiningGuest = {
      id: guestId,
      tableId: table.id,
      seatIndex: seat.index,
      characterId: diningCharacterForArrival(customer.id),
      type: customer.type,
      recipe: customer.recipe,
      status: "entering",
      patience: CUSTOMER_PATIENCE_SECONDS,
      transitionSeconds: diningTravelSeconds(table.id),
    };
    this.dining.guests.push(guest);
    this.dining.orders.push({
      id: orderId,
      guestId,
      tableId: table.id,
      recipe: customer.recipe,
      status: "called",
      assembly: [],
      cookSeconds: 0,
      eatSeconds: 0,
    });
    this.dining.feedback = `Khách mới đang đi vào và chọn bàn ${table.id}.`;
  }

  private getDiningGuestDialogue(guest: DiningGuest): string {
    const recipeName = RECIPES[guest.recipe].name.toLowerCase();
    const lines: Record<CustomerType, string> = {
      student: `“Cho em ${recipeName} nha chị!”`,
      office: `“Cho anh một phần ${recipeName} nhé.”`,
      shopper: `“Ở đây có ${recipeName} phải không? Cho cô một phần.”`,
      tourist: `“Cho tôi thử ${recipeName} đặc biệt của quán!”`,
    };
    return lines[guest.type];
  }

  private getDiningOrderStatusName(status: DiningOrderStatus): string {
    const names: Record<DiningOrderStatus, string> = {
      called: "khách vừa gọi",
      queued: "chờ bếp",
      cooking: "đang nấu",
      ready: "đã sẵn sàng",
      delivered: "đã giao",
      paid: "đã thanh toán",
    };
    return names[status];
  }

  private payDiningOrder(order: DiningOrder, guest: DiningGuest, byStaff: boolean): void {
    const recipe = RECIPES[order.recipe];
    const tip = byStaff ? 0 : CUSTOMER_TYPES[guest.type].tip + (guest.patience >= 25 ? 2 : 0);
    const reputationEarned = byStaff ? 1 : guest.patience >= 25 ? 2 : 1;
    order.status = "paid";
    guest.status = "leaving";
    guest.transitionSeconds = diningTravelSeconds(guest.tableId);
    this.coins += recipe.salePrice + tip;
    this.shiftRevenue += recipe.salePrice;
    this.shiftTips += tip;
    this.shiftServed += 1;
    this.totalServed += 1;
    this.reputation += reputationEarned;
    this.shiftReputation += reputationEarned;
    this.dining.feedback = byStaff
      ? `Phụ bếp đã thu tiền bàn ${guest.tableId}: +${recipe.salePrice} xu.`
      : `Đã thu tiền: +${recipe.salePrice + tip} xu${tip > 0 ? ` (gồm ${tip} xu boa)` : ""}.`;
    this.persist();
    this.publish();
  }

  private helpDiningRoom(): void {
    const awaitingPayment = this.dining.guests.find((guest) => guest.status === "awaiting-payment");
    const payableOrder = awaitingPayment && this.dining.orders.find((order) => order.guestId === awaitingPayment.id && order.status === "delivered");
    if (awaitingPayment && payableOrder) {
      this.payDiningOrder(payableOrder, awaitingPayment, true);
      return;
    }

    const readyOrder = this.dining.orders.find((order) => order.status === "ready");
    const readyGuest = readyOrder && this.dining.guests.find((guest) => guest.id === readyOrder.guestId && guest.status === "waiting-food");
    if (readyOrder && readyGuest) {
      readyOrder.status = "delivered";
      readyOrder.eatSeconds = 5;
      readyGuest.status = "eating";
      this.dining.feedback = `Phụ bếp đã bưng món tới bàn ${readyGuest.tableId}.`;
      return;
    }

    const queuedOrder = this.dining.orders.find((order) =>
      order.status === "queued"
      && (!this.dining.activeOrderId || this.dining.activeOrderId === order.id)
      && this.hasRecipeStock(order.recipe));
    if (queuedOrder) {
      for (const ingredient of RECIPES[queuedOrder.recipe].ingredients) this.inventory[ingredient] -= 1;
      this.shiftIngredientCosts += getRecipeCost(queuedOrder.recipe);
      queuedOrder.assembly = [...RECIPES[queuedOrder.recipe].ingredients];
      queuedOrder.status = "cooking";
      queuedOrder.cookSeconds = 3;
      this.dining.activeOrderId = queuedOrder.id;
      this.dining.feedback = `Phụ bếp đang nấu món cho bàn ${queuedOrder.tableId}.`;
      this.persist();
      return;
    }

    const waitingGuest = this.dining.guests
      .filter((guest) => guest.status === "waiting-order")
      .sort((a, b) => a.patience - b.patience)
      .find((guest) => this.hasRecipeStock(guest.recipe));
    const calledOrder = waitingGuest && this.dining.orders.find((order) => order.guestId === waitingGuest.id && order.status === "called");
    if (waitingGuest && calledOrder) {
      calledOrder.status = "queued";
      waitingGuest.status = "waiting-food";
      this.dining.feedback = `Phụ bếp đã nhận món của bàn ${waitingGuest.tableId}.`;
      return;
    }

    const dirtyTable = this.dining.tables.find((table) => table.seats.some((seat) => seat.status === "dirty"));
    if (dirtyTable) {
      const dirtySeat = dirtyTable.seats.find((seat) => seat.status === "dirty")!;
      dirtySeat.status = "empty";
      dirtySeat.guestId = null;
      this.syncDiningTable(dirtyTable);
      this.dining.orders = this.dining.orders.filter((order) => order.status !== "paid" || this.dining.guests.some((guest) => guest.id === order.guestId));
      if (this.dining.selectedOrderId && !this.dining.orders.some((order) => order.id === this.dining.selectedOrderId)) {
        this.dining.selectedOrderId = null;
      }
      this.dining.feedback = `Phụ bếp đã dọn chỗ ${dirtySeat.index + 1} tại bàn ${dirtyTable.id}.`;
    }
  }

  private syncDiningTable(table: DiningTable): void {
    table.status = table.seats.some((seat) => seat.status === "occupied") ? "occupied"
      : table.seats.some((seat) => seat.status === "reserved") ? "reserved"
        : table.seats.some((seat) => seat.status === "dirty") ? "dirty" : "empty";
    table.guestId = table.seats.find((seat) => seat.guestId)?.guestId ?? null;
  }

  private settleServicePeriod(): void {
    const wages = this.hasStaff ? Math.min(this.coins, STAFF_WAGE_PER_SHIFT) : 0;
    this.coins -= wages;
    this.report = {
      served: this.shiftServed,
      left: this.shiftLeft,
      revenue: this.shiftRevenue,
      tips: this.shiftTips,
      ingredientCosts: this.shiftIngredientCosts,
      wages,
      net: this.shiftRevenue + this.shiftTips - this.shiftIngredientCosts - wages,
      reputationEarned: this.shiftReputation,
    };
    this.shiftRevenue = 0;
    this.shiftTips = 0;
    this.shiftIngredientCosts = 0;
    this.shiftServed = 0;
    this.shiftLeft = 0;
    this.shiftReputation = 0;
    this.persist();
  }

  private hasRecipeStock(recipeId: RecipeId): boolean {
    return RECIPES[recipeId].ingredients.every((ingredient) => this.inventory[ingredient] > 0);
  }

  private canMakeAnyRecipe(): boolean {
    return Object.values(RECIPES).some((recipe) => recipe.unlockLevel <= this.cartLevel && this.hasRecipeStock(recipe.id));
  }

  private completeOrder(byStaff: boolean): void {
    const customer = this.customers[0];
    if (!customer) return;
    if (!this.hasRecipeStock(customer.recipe)) {
      this.assembly = [];
      this.feedback = "Hết món trong kho! Nhập hàng để tiếp tục bán.";
      this.publish();
      return;
    }

    const recipe = RECIPES[customer.recipe];
    const ingredientCost = getRecipeCost(customer.recipe);
    const baseTip = CUSTOMER_TYPES[customer.type].tip;
    const speedTip = !byStaff && customer.patience >= 25 ? 2 : 0;
    const tip = byStaff ? 0 : baseTip + speedTip;
    const reputationEarned = byStaff ? 1 : customer.patience >= 25 ? 2 : 1;

    for (const ingredient of recipe.ingredients) this.inventory[ingredient] -= 1;
    this.coins += recipe.salePrice + tip;
    this.shiftRevenue += recipe.salePrice;
    this.shiftTips += tip;
    this.shiftIngredientCosts += ingredientCost;
    this.shiftServed += 1;
    this.totalServed += 1;
    this.reputation += reputationEarned;
    this.shiftReputation += reputationEarned;
    this.customers.shift();
    this.assembly = [];

    const guestName = CUSTOMER_TYPES[customer.type].name.toLowerCase();
    this.feedback = byStaff
      ? `Phụ bếp giao ${recipe.name.toLowerCase()} cho ${guestName}. Thu ${recipe.salePrice} xu.`
      : `Phục vụ món thành công! +${recipe.salePrice + tip} xu${tip > 0 ? ` (có ${tip} xu boa)` : ""}.`;
    this.persist();
    this.publish();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedGame;
      if (saved.version !== 1) return;

      this.storeName = typeof saved.storeName === "string" ? normalizeStoreName(saved.storeName) : "";
      this.coins = Math.max(0, saved.coins);
      this.reputation = Math.max(0, saved.reputation);
      this.cartLevel = Math.max(1, Math.min(MAX_CART_LEVEL, saved.cartLevel));
      this.hasStaff = saved.hasStaff;
      this.inventory = { ...createStartingInventory(), ...saved.inventory };
      this.totalServed = Math.max(0, saved.totalServed ?? 0);

      if (this.hasStaff && Number.isFinite(saved.lastSavedAt)) {
        const elapsedMinutes = Math.min(
          OFFLINE_CAP_MINUTES,
          Math.max(0, Math.floor((Date.now() - saved.lastSavedAt) / 60_000)),
        );
        const offlineCoins = elapsedMinutes * OFFLINE_COINS_PER_MINUTE;
        if (offlineCoins > 0) {
          this.coins += offlineCoins;
          this.offlineNotice = `Phụ bếp đã bán giúp bạn ${elapsedMinutes} phút, mang về ${offlineCoins.toLocaleString("vi-VN")} xu.`;
        }
      }
      this.persist();
    } catch {
      this.feedback = "Chưa đọc được bản lưu cũ; mình bắt đầu một lượt mới nhé.";
    }
  }

  private persist(): void {
    this.lastPersistAt = Date.now();
    const saved: SavedGame = {
      version: 1,
      storeName: this.storeName,
      coins: this.coins,
      reputation: this.reputation,
      cartLevel: this.cartLevel,
      hasStaff: this.hasStaff,
      inventory: this.inventory,
      totalServed: this.totalServed,
      lastSavedAt: this.lastPersistAt,
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
    } catch {
      this.feedback = "Máy đang chặn lưu dữ liệu trình duyệt; tiến trình có thể không được giữ.";
    }
  }

  private publish(): void {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) listener(snapshot);
  }
}
