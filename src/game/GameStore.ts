import {
  CART_UPGRADE_COST,
  BUSINESS_STAGE_NAMES,
  CUSTOMER_ARRIVAL_SECONDS,
  CUSTOMER_PATIENCE_SECONDS,
  CUSTOMER_TYPES,
  INGREDIENTS,
  OFFLINE_CAP_MINUTES,
  OFFLINE_COINS_PER_MINUTE,
  PLAYABLE_RECIPE_IDS,
  RECIPES,
  STARTER_INGREDIENTS,
  RESTOCK_PACK_COST,
  RESTOCK_PACK_SIZE,
  ACCOUNTING_PERIOD_SECONDS,
  MAX_CART_LEVEL,
  createStartingMenu,
  createStartingInventory,
  getRecipeCost,
  getRecipeLearningCost,
  type CustomerType,
  type IngredientId,
  type Inventory,
  type RecipeId,
} from "./data";
import {
  cloneDiningPartySelectionState,
  createDiningPartySelectionState,
  diningArrivalSeconds,
  diningFamilyContext,
  diningPartyForArrival,
  diningTravelSeconds,
  restoreDiningPartySelectionState,
  type DiningPartySelectionState,
  type DiningPartyType,
} from "./diningCharacters";
import { diningArrivalDialogue, diningConversationDialogue, diningOrderDialogue } from "./diningDialogues";
import { formatVndFromThousands } from "./currency";
import { MARKET_PRODUCT_DETAILS } from "./marketCatalog";
import { MENU_DISHES, MENU_INGREDIENTS, type MenuCategory, type MenuIngredientId } from "./menuCatalog";
import {
  MAX_STAFF_LEVEL,
  STAFF_CANDIDATES,
  STAFF_TRAINING_COST,
  getServerCleaningRestSeconds,
  getStaffCandidate,
  getStaffRole,
  type StaffRoleId,
} from "./staffCatalog";

export interface WaitingCustomer {
  id: number;
  type: CustomerType;
  recipe: RecipeId;
  patience: number;
  status: "walking" | "waiting";
}

export type ServiceMode = "street" | "dining";
export type DiningTableStatus = "empty" | "reserved" | "occupied";
export interface DiningSeat {
  index: number;
  status: DiningTableStatus;
  guestId: string | null;
}
export type DiningGuestStatus = "approaching" | "entering" | "waiting-order" | "waiting-food" | "eating" | "awaiting-payment" | "leaving" | "departing";
export const DINING_OUTDOOR_WALK_SECONDS = 9;
export const DINING_ORDER_APPROACH_SECONDS = 4;
export const DINING_ORDER_GUEST_DIALOGUE_SECONDS = 4;
export const DINING_ORDER_SERVER_REPLY_SECONDS = 2;
export const DINING_ORDER_WRITE_SECONDS = 3;
export const DINING_ORDER_TAKE_SECONDS = DINING_ORDER_APPROACH_SECONDS
  + DINING_ORDER_GUEST_DIALOGUE_SECONDS
  + DINING_ORDER_SERVER_REPLY_SECONDS
  + DINING_ORDER_WRITE_SECONDS;
export const DINING_ORDER_DELIVERY_SECONDS = 16;
export type DiningOrderStatus = "called" | "taking" | "queued" | "cooking" | "ready" | "carrying" | "delivered" | "paid";

export interface DiningTable {
  id: number;
  status: DiningTableStatus;
  cleanliness: "clean" | "dirty";
  cleaningSeconds: number;
  cleaningTotalSeconds: number;
  guestId: string | null;
  seats: DiningSeat[];
}

export interface DiningGuest {
  id: string;
  partyId: string;
  partyType: DiningPartyType;
  partySize: number;
  partyMemberIndex: number;
  arrivalDelaySeconds: number;
  outsideDirection: -1 | 1;
  tableId: number;
  seatIndex: number;
  characterId: string;
  arrivalDialogue: string | null;
  orderDialogue: string;
  dialogueNumber: number;
  type: CustomerType;
  recipe: RecipeId;
  status: DiningGuestStatus;
  patience: number;
  transitionSeconds: number;
}

export interface DiningOrder {
  id: string;
  guestId: string;
  partyId: string;
  tableId: number;
  recipe: RecipeId;
  status: DiningOrderStatus;
  takeSeconds: number;
  cookSeconds: number;
  deliverySeconds: number;
  carriedByStaff: boolean;
  eatSeconds: number;
}

export interface DiningDialogueEvent {
  id: number;
  guestId: string;
  text: string;
  kind: "order" | "conversation" | "complaint";
  endsAt: number;
}

export interface CashCollectionEvent {
  id: number;
  amount: number;
  source: "street" | "dining";
  tableId?: number;
}

export interface DiningState {
  cleaningCooldownSeconds: number;
  tables: DiningTable[];
  guests: DiningGuest[];
  orders: DiningOrder[];
  selectedTableId: number | null;
  selectedSeatIndex: number | null;
  selectedGuestId: string | null;
  selectedOrderId: string | null;
  activeOrderId: string | null;
  dialogueEvent: DiningDialogueEvent | null;
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
  bestSellingRecipe: RecipeId | null;
  bestSellingCount: number;
}

export interface LedgerEntry {
  day: number;
  label: string;
  amount: number;
}

export interface HiredStaffMember {
  id: string;
  role: StaffRoleId;
  level: number;
  isWorking: boolean;
  energy: number;
  restSeconds: number;
}

function createStartingStaff(): HiredStaffMember[] {
  return [
    { id: "mai-linh", role: "server", level: 1, isWorking: true, energy: 100, restSeconds: 0 },
    { id: "co-hanh", role: "chef", level: 1, isWorking: true, energy: 100, restSeconds: 0 },
  ];
}

export interface GameSnapshot {
  storeName: string;
  coins: number;
  reputation: number;
  cartLevel: number;
  hasStaff: boolean;
  staff: HiredStaffMember[];
  learnedRecipes: RecipeId[];
  activeMenu: RecipeId[];
  inventory: Inventory;
  marketInventory: Record<MenuIngredientId, number>;
  marketBasketHasItems: boolean;
  inShift: boolean;
  closingShift: boolean;
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
  cashCollection: CashCollectionEvent | null;
  ledgerDay: number;
  ledger: LedgerEntry[];
}

interface SavedGame {
  version: 1 | 2 | 3;
  inShift?: boolean;
  storeName?: string;
  coins: number;
  reputation: number;
  cartLevel: number;
  hasStaff?: boolean;
  staff?: HiredStaffMember[];
  learnedRecipes?: RecipeId[];
  activeMenu?: RecipeId[];
  inventory: Partial<Record<string, number>>;
  marketInventory?: Partial<Record<MenuIngredientId, number>>;
  marketBasketHasItems?: boolean;
  totalServed: number;
  shiftRecipeSales?: Partial<Record<RecipeId, number>>;
  report?: ShiftReport | null;
  diningDialogueNumber?: number;
  diningPartySelection?: DiningPartySelectionState;
  lastSavedAt: number;
  ledgerDay?: number;
  ledger?: LedgerEntry[];
}

const SAVE_KEY = "banh-mi-pho-save-v1";
const STORE_NAME_MAX_LENGTH = 24;
const DINING_MAX_ACTIVE_PARTIES = 3;
const DINING_MAX_ACTIVE_GUESTS = 8;
const MENU_DISH_BY_ID = new Map(MENU_DISHES.map((dish) => [dish.id, dish]));
const CUSTOMER_MENU_PREFERENCES: Record<CustomerType, readonly MenuCategory[]> = {
  student: ["snack", "grill"],
  office: ["meal", "grill"],
  shopper: ["snack", "hotpot", "grill"],
  tourist: ["hotpot", "meal", "grill"],
};

export function getDiningTableCapacity(): number {
  return 6;
}

function createDiningState(): DiningState {
  return {
    cleaningCooldownSeconds: 0,
    tables: [1, 2, 3, 4, 5, 6].map((id) => ({
      id,
      status: "empty",
      cleanliness: "clean",
      cleaningSeconds: 0,
      cleaningTotalSeconds: 0,
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
    dialogueEvent: null,
    arrivalClock: 0,
    feedback: "Khách tự chọn bàn; Mai Linh sẽ tới nhận món.",
  };
}

function normalizeStoreName(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, STORE_NAME_MAX_LENGTH);
}

function recipeIngredientList(recipeId: RecipeId): IngredientId[] {
  return RECIPES[recipeId].ingredients.flatMap(({ id, quantity }) => Array.from({ length: quantity }, () => id));
}

function clampStock(value: unknown): number {
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value as number)) : 0;
}

export class GameStore {
  private storeName = "";
  private coins = 500;
  private ledgerDay = 1;
  private ledger: LedgerEntry[] = [];
  private recordLedger(label: string, amount: number): void {
    if (!amount) return;
    this.ledger.push({ day: this.ledgerDay, label, amount });
    if (this.ledger.length > 300) this.ledger.shift();
  }
  private reputation = 0;
  private cartLevel = 1;
  private staff: HiredStaffMember[] = createStartingStaff();
  private inventory = createStartingInventory();
  private marketBasketHasItems = false;
  private learnedRecipes = createStartingMenu();
  private activeMenu = createStartingMenu();
  private inShift = false;
  private closingShift = false;
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
  private shiftRecipeSales: Record<RecipeId, number> = Object.fromEntries(PLAYABLE_RECIPE_IDS.map((id) => [id, 0])) as Record<RecipeId, number>;
  private arrivalClock = 0;
  private staffClock = 0;
  private diningStaffClock = 0;
  private diningArrivalClock = 0;
  private diningArrivalIntervalSeconds = 22;
  private customerId = 0;
  private diningPartyNumber = 0;
  private recentMenuOrders: RecipeId[] = [];
  private diningPartySelection = createDiningPartySelectionState();
  private diningDialogueNumber = 0;
  private diningConversationNumber = 0;
  private diningConversationClock = 0;
  private diningDialogueId = 0;
  private diningDialogueAvailableAt = 0;
  private pendingDiningDialogues: { event: DiningDialogueEvent; startsAt: number }[] = [];
  private cashCollectionId = 0;
  private cashCollection: CashCollectionEvent | null = null;
  private lastPersistAt = 0;
  private totalServed = 0;
  private serviceMode: ServiceMode = "street";
  private streetDemandMultiplier = 1;
  private dining = createDiningState();
  private readonly listeners = new Set<(snapshot: GameSnapshot) => void>();

  private get hasStaff(): boolean {
    return this.staff.some((member) => member.isWorking);
  }

  private getWorkingLevel(role: StaffRoleId): number {
    return this.staff.filter((member) => member.isWorking && member.role === role && member.restSeconds <= 0 && member.energy > 18)
      .reduce((total, member) => total + member.level, 0);
  }

  private getAvailableStaff(role: StaffRoleId): HiredStaffMember | undefined {
    return this.staff
      .filter((member) => member.isWorking && member.role === role && member.restSeconds <= 0 && member.energy > 18)
      .sort((a, b) => b.level - a.level || b.energy - a.energy)[0];
  }

  private consumeStaffEnergy(member: HiredStaffMember, amount: number): void {
    member.energy = Math.max(0, member.energy - amount);
    if (member.energy <= 18 && member.restSeconds <= 0) member.restSeconds = 8;
  }

  private tickStaffRecovery(): void {
    for (const member of this.staff) {
      if (!member.isWorking) continue;
      if (member.restSeconds <= 0) {
        if (member.energy <= 18) member.restSeconds = 8;
        continue;
      }
      member.energy = Math.min(100, member.energy + 10);
      member.restSeconds = member.energy >= 90 ? 0 : Math.max(0, member.restSeconds - 1);
    }
  }

  constructor() {
    this.load();
  }

  subscribe(listener: (snapshot: GameSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): GameSnapshot {
    const dayPhase = this.elapsedSeconds % ACCOUNTING_PERIOD_SECONDS;
    const nightAmount = this.inShift
      ? Math.max(0, Math.min(1, (dayPhase - 85) / 18, (ACCOUNTING_PERIOD_SECONDS - dayPhase) / 17))
      : 0;

    return {
      storeName: this.storeName,
      coins: this.coins,
      ledgerDay: this.ledgerDay,
      ledger: this.ledger.map((entry) => ({ ...entry })),
      reputation: this.reputation,
      cartLevel: this.cartLevel,
      hasStaff: this.hasStaff,
      staff: this.staff.map((member) => ({ ...member })),
      learnedRecipes: [...this.learnedRecipes],
      activeMenu: [...this.activeMenu],
      inventory: { ...this.inventory },
      marketInventory: this.getMarketInventory(),
      marketBasketHasItems: this.marketBasketHasItems,
      inShift: this.inShift,
      closingShift: this.closingShift,
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
      cashCollection: this.cashCollection ? { ...this.cashCollection } : null,
      dining: {
        ...this.dining,
        dialogueEvent: this.dining.dialogueEvent ? { ...this.dining.dialogueEvent } : null,
        tables: this.dining.tables.map((table) => ({ ...table, seats: table.seats.map((seat) => ({ ...seat })) })),
        guests: this.dining.guests.map((guest) => ({ ...guest })),
        orders: this.dining.orders.map((order) => ({ ...order })),
      },
    };
  }

  setServiceMode(mode: ServiceMode): void {
    if (this.serviceMode === mode) return;
    this.serviceMode = mode;
    if (mode === "dining" && this.inShift) {
      for (const guest of this.dining.guests) {
        if (guest.status !== "approaching") continue;
        guest.status = "entering";
        guest.transitionSeconds = diningArrivalSeconds(guest.tableId) + guest.arrivalDelaySeconds;
      }
      if (this.dining.guests.length === 0) {
        this.diningArrivalClock = 0;
        this.diningArrivalIntervalSeconds = this.nextDiningArrivalInterval(true);
      }
    }
    this.dining.feedback = mode === "dining"
      ? "Khách tự chọn bàn; Mai Linh sẽ tới hỏi món."
      : "Bạn đang ở ngoài phố; vòng phục vụ tại quầy vẫn giữ nguyên.";
    this.publish();
  }

  setStreetDemandMultiplier(multiplier: number): void {
    this.streetDemandMultiplier = Math.max(0.65, Math.min(1.25, multiplier));
  }

  private getEnabledRecipes(): RecipeId[] {
    return this.activeMenu.filter((id) => RECIPES[id] && RECIPES[id].unlockLevel <= this.cartLevel);
  }

  private getMostPopularActiveRecipe(type: CustomerType): RecipeId {
    const enabled = this.getEnabledRecipes();
    const preferred = enabled.filter((id) => {
      const category = MENU_DISH_BY_ID.get(id)?.category;
      return category && CUSTOMER_MENU_PREFERENCES[type].includes(category);
    });
    const choices = preferred.length > 0 ? preferred : enabled;
    const recentCount = Math.min(2, choices.length - 1);
    const recent = new Set(this.recentMenuOrders.slice(-recentCount));
    const variedChoices = choices.filter((id) => !recent.has(id));
    const recipe = (variedChoices.length > 0 ? variedChoices : choices)[Math.floor(Math.random() * (variedChoices.length || choices.length))]
      ?? createStartingMenu()[0];
    this.recentMenuOrders.push(recipe);
    if (this.recentMenuOrders.length > 8) this.recentMenuOrders.shift();
    return recipe;
  }

  selectDiningTable(tableId: number): void {
    const table = this.dining.tables.find((entry) => entry.id === tableId);
    if (!table) return;
    const seat = table.seats.find((entry) => entry.guestId === this.dining.selectedGuestId)
      ?? table.seats.find((entry) => entry.guestId)
      ?? table.seats[0];
    this.selectDiningSeat(tableId, seat.index);
  }

  selectDiningSeat(tableId: number, seatIndex: number): void {
    const table = this.dining.tables.find((entry) => entry.id === tableId);
    const seat = table?.seats[seatIndex];
    if (!table || !seat) return;
    this.dining.selectedTableId = tableId;
    this.dining.selectedSeatIndex = seatIndex;
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

  selectDiningOrder(orderId: string): void {
    const order = this.dining.orders.find((entry) => entry.id === orderId);
    if (!order || !["taking", "queued", "cooking", "ready", "carrying", "delivered", "paid"].includes(order.status)) return;
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
    if (this.dining.orders.some((entry) => entry.status === "carrying")) {
      this.dining.feedback = "Đang bưng món trước tới bàn; hãy chờ một chút.";
      this.publish();
      return;
    }
    this.takeDiningOrder(order, guest, false);
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
      this.dining.feedback = "Cả nhóm chưa ăn xong; chưa thể thu hóa đơn.";
      this.publish();
      return;
    }
    const partyGuests = this.dining.guests.filter((member) => member.partyId === guest.partyId);
    if (partyGuests.some((member) => member.status !== "awaiting-payment")) {
      this.dining.feedback = "Cả nhóm cần ăn xong rồi mới thanh toán chung một lần.";
      this.publish();
      return;
    }
    this.payDiningOrder(order, guest, false);
  }

  collectDiningPaymentForTable(tableId: number): void {
    const guest = this.dining.guests.find((entry) => entry.tableId === tableId && entry.status === "awaiting-payment");
    const order = guest && this.dining.orders.find((entry) => entry.partyId === guest.partyId && entry.status === "delivered");
    const partyGuests = guest && this.dining.guests.filter((entry) => entry.partyId === guest.partyId);
    const partyOrders = guest && this.dining.orders.filter((entry) => entry.partyId === guest.partyId);
    if (!guest || !order || !partyGuests?.every((entry) => entry.status === "awaiting-payment")
      || !partyOrders?.every((entry) => entry.status === "delivered")) {
      this.dining.feedback = `Bàn ${tableId} chưa sẵn sàng thanh toán.`;
      this.publish();
      return;
    }
    this.payDiningOrder(order, guest, false);
  }

  cleanDiningTable(tableId: number): void {
    const table = this.dining.tables.find((entry) => entry.id === tableId);
    if (!table || table.cleanliness !== "dirty") return;
    if (table.seats.some((seat) => seat.status !== "empty" || seat.guestId)) {
      this.dining.feedback = `Khách ở bàn ${tableId} chưa rời hết; chưa thể dọn bàn.`;
      this.publish();
      return;
    }
    table.cleanliness = "clean";
    table.cleaningSeconds = 0;
    table.cleaningTotalSeconds = 0;
    this.dining.feedback = `Đã dọn sạch bàn ${tableId}; bàn sẵn sàng đón khách.`;
    this.persist();
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

  startShift(menuSelection: readonly RecipeId[] = this.activeMenu): boolean {
    if (this.inShift || this.closingShift) return false;
    const selectedMenu = [...new Set(menuSelection.filter((id) => PLAYABLE_RECIPE_IDS.includes(id)
      && this.learnedRecipes.includes(id)
      && RECIPES[id].unlockLevel <= this.cartLevel))];
    if (selectedMenu.length === 0) {
      this.feedback = "Chọn ít nhất một món đã học để bắt đầu ca.";
      this.publish();
      return false;
    }
    this.activeMenu = selectedMenu;
    this.offlineNotice = "";
    this.inShift = true;
    this.closingShift = false;
    this.elapsedSeconds = 0;
    this.customers = this.serviceMode === "street" ? [this.makeCustomer()] : [];
    const tableCleanliness = this.dining.tables.map((table) => table.cleanliness ?? "clean");
    this.dining = createDiningState();
    this.dining.tables.forEach((table, index) => { table.cleanliness = tableCleanliness[index] ?? "clean"; });
    this.diningPartyNumber = 0;
    this.diningConversationClock = 0;
    this.diningDialogueAvailableAt = 0;
    this.pendingDiningDialogues = [];
    this.assembly = [];
    this.shiftRevenue = 0;
    this.shiftTips = 0;
    this.shiftIngredientCosts = 0;
    this.shiftServed = 0;
    this.shiftLeft = 0;
    this.shiftReputation = 0;
    this.shiftRecipeSales = Object.fromEntries(PLAYABLE_RECIPE_IDS.map((id) => [id, 0])) as Record<RecipeId, number>;
    this.arrivalClock = 0;
    this.staffClock = 0;
    this.diningStaffClock = 0;
    this.diningArrivalClock = 0;
    this.diningArrivalIntervalSeconds = this.nextDiningArrivalInterval(true);
    if (this.serviceMode === "dining") {
      this.arriveDiningParty();
      this.diningArrivalIntervalSeconds = this.nextDiningArrivalInterval();
    }
    this.feedback = this.serviceMode === "street"
      ? "Khách đầu tiên đang đi bộ tới quán từ ngoài phố."
      : "Quán đã mở bán liên tục. Nhóm khách đầu tiên đang đi từ phố tới quán.";
    this.persist();
    this.publish();
    return true;
  }

  toggleShift(menuSelection?: readonly RecipeId[]): boolean {
    if (this.inShift) {
      this.inShift = false;
      this.beginShiftClosure();
      return true;
    }
    if (this.closingShift) {
      this.feedback = "Khách đang đi ra cửa; đợi họ ra hết rồi hãy mở bán lại.";
      this.publish();
      return false;
    }

    const selectedMenu = [...new Set((menuSelection ?? this.activeMenu).filter((id) => PLAYABLE_RECIPE_IDS.includes(id)
      && this.learnedRecipes.includes(id)
      && RECIPES[id].unlockLevel <= this.cartLevel))];
    if (selectedMenu.length === 0) {
      this.feedback = "Chọn ít nhất một món đã học để mở bán.";
      this.publish();
      return false;
    }
    this.activeMenu = selectedMenu;
    const hasExistingShift = this.elapsedSeconds > 0
      || this.shiftServed > 0
      || this.shiftLeft > 0
      || this.customers.length > 0
      || this.dining.guests.length > 0;
    if (!hasExistingShift) {
      return this.startShift(selectedMenu);
    }

    this.offlineNotice = "";
    this.inShift = true;
    this.feedback = "Quán đã mở bán lại; tiếp tục phục vụ khách đang chờ.";
    this.persist();
    this.publish();
    return true;
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

    const requiredIngredients = recipeIngredientList(customer.recipe);
    const expectedIngredient = requiredIngredients[this.assembly.length];
    if (ingredientId !== expectedIngredient) {
      const expectedName = INGREDIENTS.find((item) => item.id === expectedIngredient)?.name ?? "nguyên liệu kế tiếp";
      this.feedback = `Khách đang chờ ${expectedName}. Chọn đúng thứ tự để hoàn thành món nhé.`;
      this.publish();
      return;
    }

    this.assembly.push(ingredientId);
    if (this.assembly.length === requiredIngredients.length) {
      this.completeOrder(false);
    } else {
      const next = requiredIngredients[this.assembly.length];
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
        for (const ingredientId of STARTER_INGREDIENTS) this.inventory[ingredientId] += 4;
        this.feedback = "Kho cạn tiền nhập hàng: quán nhận 4 phần nguyên liệu cơ bản để mở bán lại.";
        this.persist();
      } else {
        this.feedback = `Chưa đủ tiền nhập hàng; cần ${formatVndFromThousands(RESTOCK_PACK_COST)}.`;
      }
      this.publish();
      return;
    }

    this.coins -= RESTOCK_PACK_COST;
    this.recordLedger("Nhập nguyên liệu cơ bản", -RESTOCK_PACK_COST);
    for (const ingredientId of STARTER_INGREDIENTS) this.inventory[ingredientId] += RESTOCK_PACK_SIZE;
    this.feedback = `Đã nhập gói cơ bản: +${RESTOCK_PACK_SIZE} phần mỗi loại nguyên liệu đầu ca.`;
    this.persist();
    this.publish();
  }

  buyMarketIngredient(ingredientId: MenuIngredientId, quantity: number): boolean {
    const product = MARKET_PRODUCT_DETAILS[ingredientId];
    const amount = Math.trunc(quantity);
    if (!product || amount < 1 || amount > 99) return false;

    const total = product.priceThousands * amount;
    if (this.coins < total) {
      this.feedback = `Chưa đủ tiền; cần ${formatVndFromThousands(total)} để mua ${MENU_INGREDIENTS[ingredientId].name}.`;
      this.publish();
      return false;
    }

    this.coins -= total;
    this.recordLedger(`Đi chợ: ${MENU_INGREDIENTS[ingredientId].name} ×${amount}`, -total);
    this.inventory[ingredientId] += amount;
    this.marketBasketHasItems = true;
    this.feedback = `Đã mua ${amount} ${product.unit} ${MENU_INGREDIENTS[ingredientId].name.toLowerCase()} · ${formatVndFromThousands(total)}.`;
    this.persist();
    this.publish();
    return true;
  }

  toggleMenuDish(recipeId: RecipeId): void {
    const recipe = RECIPES[recipeId];
    if (!recipe) return;
    if (!this.learnedRecipes.includes(recipeId)) {
      this.feedback = `Hãy học công thức ${recipe.name.toLowerCase()} trước khi đưa vào thực đơn.`;
      this.publish();
      return;
    }
    if (recipe.unlockLevel > this.cartLevel) {
      this.feedback = `Nâng quán lên cấp ${recipe.unlockLevel} để bán ${recipe.name.toLowerCase()}.`;
      this.publish();
      return;
    }
    const isActive = this.activeMenu.includes(recipeId);
    if (isActive && this.activeMenu.length === 1) {
      this.feedback = "Quán cần giữ ít nhất một món trong thực đơn.";
      this.publish();
      return;
    }
    this.activeMenu = isActive
      ? this.activeMenu.filter((id) => id !== recipeId)
      : [...this.activeMenu, recipeId];
    this.feedback = isActive
      ? `Đã tạm ngừng bán ${recipe.name.toLowerCase()}.`
      : `Đã đưa ${recipe.name.toLowerCase()} vào thực đơn.`;
    this.persist();
    this.publish();
  }

  learnRecipe(recipeId: RecipeId): boolean {
    const recipe = RECIPES[recipeId];
    if (!recipe || this.learnedRecipes.includes(recipeId)) return false;
    if (recipe.unlockLevel > this.cartLevel) {
      this.feedback = `Nâng quán lên cấp ${recipe.unlockLevel} để học ${recipe.name.toLowerCase()}.`;
      this.publish();
      return false;
    }
    const cost = getRecipeLearningCost(recipeId);
    if (this.coins < cost) {
      this.feedback = `Chưa đủ tiền để học ${recipe.name.toLowerCase()}; cần ${formatVndFromThousands(cost)}.`;
      this.publish();
      return false;
    }
    this.coins -= cost;
    this.recordLedger(`Học món: ${recipe.name}`, -cost);
    this.learnedRecipes = [...this.learnedRecipes, recipeId];
    this.feedback = `Đã học công thức ${recipe.name.toLowerCase()}. Hãy chọn món này khi mở ca.`;
    this.persist();
    this.publish();
    return true;
  }

  hireEmployee(candidateId: string): void {
    const candidate = getStaffCandidate(candidateId);
    if (!candidate) return;
    if (candidate.unlockLevel > this.cartLevel) {
      this.feedback = `Nâng quán lên cấp ${candidate.unlockLevel} để tuyển ${candidate.name}.`;
      this.publish();
      return;
    }
    if (this.staff.some((member) => member.id === candidateId)) {
      this.feedback = `${candidate.name} đã có trong đội ngũ.`;
      this.publish();
      return;
    }
    if (this.coins < candidate.hireCost) {
      this.feedback = `Cần thêm ${formatVndFromThousands(candidate.hireCost - this.coins)} để tuyển ${candidate.name}.`;
      this.publish();
      return;
    }
    this.coins -= candidate.hireCost;
    this.recordLedger(`Tuyển nhân viên: ${candidate.name}`, -candidate.hireCost);
    this.staff.push({ id: candidate.id, role: candidate.role, level: 1, isWorking: true, energy: 100, restSeconds: 0 });
    this.feedback = `Đã tuyển ${candidate.name} vào vị trí ${getStaffRole(candidate.role).shortName.toLowerCase()}.`;
    this.persist();
    this.publish();
  }

  trainEmployee(employeeId: string): void {
    const employee = this.staff.find((member) => member.id === employeeId);
    if (!employee) return;
    if (employee.level >= MAX_STAFF_LEVEL) {
      this.feedback = "Nhân viên này đã đạt bậc kỹ năng tối đa.";
      this.publish();
      return;
    }
    const cost = STAFF_TRAINING_COST[employee.level] ?? Number.POSITIVE_INFINITY;
    if (this.coins < cost) {
      this.feedback = `Cần thêm ${formatVndFromThousands(cost - this.coins)} để đào tạo.`;
      this.publish();
      return;
    }
    employee.level += 1;
    this.coins -= cost;
    const candidate = getStaffCandidate(employee.id);
    this.recordLedger(`${employee.role === "server" ? "Tăng lương" : "Đào tạo"}: ${candidate?.name ?? "Nhân viên"}`, -cost);
    this.feedback = employee.role === "server"
      ? `${candidate?.name ?? "Phục vụ"} lên bậc ${employee.level}; dọn bàn trong 3 giây, nghỉ ${getServerCleaningRestSeconds(employee.level)} giây giữa hai bàn.`
      : `${candidate?.name ?? "Nhân viên"} lên bậc ${employee.level}; kỹ năng nghề được cải thiện.`;
    this.persist();
    this.publish();
  }

  toggleEmployeeShift(employeeId: string): void {
    const employee = this.staff.find((member) => member.id === employeeId);
    if (!employee) return;
    employee.isWorking = !employee.isWorking;
    if (!employee.isWorking) employee.restSeconds = 0;
    const candidate = getStaffCandidate(employee.id);
    this.feedback = employee.isWorking
      ? `${candidate?.name ?? "Nhân viên"} đã vào ca.`
      : `${candidate?.name ?? "Nhân viên"} nghỉ ca này; quán không tính lương vị trí đó.`;
    this.persist();
    this.publish();
  }

  prioritizeDiningOrder(orderId: string): void {
    const target = this.dining.orders.find((order) => order.id === orderId && order.status === "queued");
    if (!target) return;
    if (this.dining.activeOrderId) {
      this.dining.feedback = "Món đang nấu sẽ hoàn tất trước; phiếu này được ưu tiên ngay sau đó.";
      this.publish();
      return;
    }
    const queued = this.dining.orders.filter((order) => order.status === "queued");
    this.dining.orders = [...this.dining.orders.filter((order) => order.status !== "queued"), target, ...queued.filter((order) => order.id !== target.id)];
    this.dining.feedback = `Đã ưu tiên phiếu bàn ${target.tableId}.`;
    this.persist();
    this.publish();
  }

  boostDiningKitchen(): void {
    const order = this.dining.orders.find((entry) => entry.id === this.dining.activeOrderId && entry.status === "cooking");
    if (!this.inShift || !order) {
      this.dining.feedback = "Chưa có món đang nấu để hỗ trợ.";
      this.publish();
      return;
    }
    if (this.coins < 5) {
      this.dining.feedback = "Cần 5.000đ để gọi một lượt hỗ trợ bếp.";
      this.publish();
      return;
    }
    this.coins -= 5;
    this.recordLedger("Hỗ trợ bếp", -5);
    order.cookSeconds = Math.max(1, order.cookSeconds - 3);
    this.dining.feedback = `Đã gọi hỗ trợ bếp cho bàn ${order.tableId}; món sẽ ra sớm hơn.`;
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
      this.feedback = `Cần thêm ${formatVndFromThousands(cost - this.coins)} để nâng cấp quán.`;
      this.publish();
      return;
    }

    this.coins -= cost;
    this.cartLevel += 1;
    this.recordLedger(`Nâng cấp quán lên cấp ${this.cartLevel}`, -cost);
    this.feedback = this.cartLevel === 2
      ? "Quán có bếp nướng mới và mặt quầy rộng hơn. Món đặc biệt đã mở!"
      : `Đã mở khóa ${BUSINESS_STAGE_NAMES[this.cartLevel - 1]}.`;
    this.persist();
    this.publish();
  }

  hireStaff(): void {
    this.offlineNotice = "";
    this.hireEmployee("huy-phu-bep");
  }

  private beginShiftClosure(): void {
    this.offlineNotice = "";
    this.closingShift = false;
    this.customers = [];
    this.assembly = [];
    this.arrivalClock = 0;
    this.pendingDiningDialogues = [];
    this.dining.dialogueEvent = null;

    const parties = [...new Set(this.dining.guests.map((guest) => guest.partyId))];
    for (const partyId of parties) {
      const guests = this.dining.guests.filter((guest) => guest.partyId === partyId);
      if (guests.length === 0 || guests.every((guest) => guest.status === "leaving" || guest.status === "departing")) continue;
      const orders = this.dining.orders.filter((order) => order.partyId === partyId);
      const allPaid = orders.length > 0 && orders.every((order) => order.status === "paid");
      if (allPaid) continue;
      const allDelivered = orders.length === guests.length && orders.every((order) => order.status === "delivered");
      if (allDelivered) {
        for (const guest of guests) guest.status = "awaiting-payment";
        this.payDiningOrder(orders[0], guests[0], false);
        continue;
      }

      for (const order of orders) {
        if (["cooking", "ready", "carrying", "delivered"].includes(order.status)) {
          for (const ingredient of RECIPES[order.recipe].ingredients) this.inventory[ingredient.id] += ingredient.quantity;
          this.shiftIngredientCosts = Math.max(0, this.shiftIngredientCosts - getRecipeCost(order.recipe));
        }
      }
      const cancelledOrderIds = new Set(orders.map((order) => order.id));
      this.dining.orders = this.dining.orders.filter((order) => order.partyId !== partyId);
      if (this.dining.activeOrderId && cancelledOrderIds.has(this.dining.activeOrderId)) this.dining.activeOrderId = null;
      if (guests.some((guest) => guest.id === this.dining.selectedGuestId)) this.dining.selectedGuestId = null;
      if (orders.some((order) => order.id === this.dining.selectedOrderId)) this.dining.selectedOrderId = null;
      this.shiftLeft += guests.length;

      for (const guest of guests) {
        guest.arrivalDialogue = null;
        if (guest.status === "approaching") {
          guest.status = "entering";
          guest.transitionSeconds = diningArrivalSeconds(guest.tableId) + guest.arrivalDelaySeconds;
        } else if (guest.status !== "entering" && guest.status !== "leaving" && guest.status !== "departing") {
          guest.status = "leaving";
          guest.transitionSeconds = diningTravelSeconds(guest.tableId);
        }
      }
    }

    this.closingShift = this.dining.guests.length > 0;
    this.dining.feedback = this.closingShift
      ? "Quán đã nghỉ bán; khách đang đi ra. Đơn chưa giao đã hủy và nguyên liệu được trả lại kho."
      : "Quán đang nghỉ bán. Khách ở quầy đã rời đi.";
    this.persist();
    this.publish();
  }

  private tickClosingDepartures(): void {
    for (const guest of this.dining.guests) {
      if (guest.status === "entering") {
        guest.transitionSeconds -= 1;
        if (guest.transitionSeconds <= 0) {
          guest.status = "leaving";
          guest.transitionSeconds = diningTravelSeconds(guest.tableId);
          const table = this.dining.tables.find((entry) => entry.id === guest.tableId);
          if (table) {
            table.seats[guest.seatIndex].status = "occupied";
            this.syncDiningTable(table);
          }
        }
      } else if (guest.status === "leaving") {
        guest.transitionSeconds -= 1;
      } else if (guest.status === "departing") {
        guest.transitionSeconds = Math.max(-1, guest.transitionSeconds - 1);
      }
    }

    const leavingParties = new Set(this.dining.guests
      .filter((guest) => guest.status === "leaving" && guest.transitionSeconds <= 0)
      .map((guest) => guest.partyId));
    for (const partyId of leavingParties) {
      const party = this.dining.guests.filter((guest) => guest.partyId === partyId);
      if (party.length === 0 || !party.every((guest) => guest.status === "leaving" && guest.transitionSeconds <= 0)) continue;
      const table = this.dining.tables.find((entry) => entry.id === party[0].tableId);
      if (table) {
        for (const guest of party) {
          table.seats[guest.seatIndex].status = "empty";
          table.seats[guest.seatIndex].guestId = null;
        }
        table.cleanliness = "dirty";
        this.syncDiningTable(table);
      }
      for (const guest of party) {
        guest.status = "departing";
        guest.transitionSeconds = DINING_OUTDOOR_WALK_SECONDS;
      }
    }

    const departedParties = new Set(this.dining.guests
      .filter((guest) => guest.status === "departing" && guest.transitionSeconds < 0)
      .map((guest) => guest.partyId));
    for (const partyId of departedParties) {
      this.dining.guests = this.dining.guests.filter((guest) => guest.partyId !== partyId);
      this.dining.orders = this.dining.orders.filter((order) => order.partyId !== partyId);
    }
    if (this.dining.guests.length === 0) {
      this.closingShift = false;
      this.dining.selectedGuestId = null;
      this.dining.selectedOrderId = null;
      this.dining.feedback = "Khách đã ra khỏi quán. Quán đang nghỉ bán.";
    }
    this.persist();
    this.publish();
  }

  tick(): void {
    if (!this.inShift) {
      if (this.closingShift) this.tickClosingDepartures();
      return;
    }

    this.elapsedSeconds += 1;
    this.tickStaffRecovery();
    this.tickDiningRoom();
    if (this.serviceMode === "street") this.tickStreetShift();

    if (this.elapsedSeconds % ACCOUNTING_PERIOD_SECONDS === 0) this.settleServicePeriod();

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

    const recipe = this.getMostPopularActiveRecipe(type);

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
    const promoterBonus = Math.min(4, this.getWorkingLevel("promoter"));
    const arrivalInterval = Math.max(4, Math.round((CUSTOMER_ARRIVAL_SECONDS - promoterBonus) / this.streetDemandMultiplier));
    if (this.arrivalClock >= arrivalInterval) {
      this.arrivalClock = 0;
      if (this.customers.length < 3) this.customers.push(this.makeCustomer());
    }
    this.staffClock += 1;
    const serviceSkill = this.getWorkingLevel("server") + this.getWorkingLevel("prep") + this.getWorkingLevel("chef");
    const serviceInterval = Math.max(6, 18 - serviceSkill * 3 - this.getWorkingLevel("cashier"));
    if (this.staffClock >= serviceInterval && this.customers[0]?.status === "waiting" && this.assembly.length === 0) {
      this.staffClock = 0;
      this.completeOrder(true);
    }
  }

  private tickDiningRoom(): void {
    this.dining.arrivalClock += 1;
    const impatientParties = new Set<string>();
    for (const guest of [...this.dining.guests]) {
      if (guest.status === "approaching") {
        if (guest.transitionSeconds <= 0) {
          guest.status = "entering";
          guest.transitionSeconds = diningArrivalSeconds(guest.tableId) + guest.arrivalDelaySeconds;
        } else {
          guest.transitionSeconds -= 1;
        }
      } else if (guest.status === "entering") {
        guest.transitionSeconds -= 1;
        if (guest.transitionSeconds <= 0) {
          guest.status = "waiting-order";
          const table = this.dining.tables.find((entry) => entry.id === guest.tableId);
          if (table) {
            table.seats[guest.seatIndex].status = "occupied";
            this.syncDiningTable(table);
          }
          this.dining.feedback = `Khách đã ngồi bàn ${guest.tableId}; Mai Linh sẽ tới hỏi món.`;
        }
      } else if (guest.status === "leaving") {
        guest.transitionSeconds -= 1;
      } else if (guest.status === "departing") {
        guest.transitionSeconds = Math.max(-1, guest.transitionSeconds - 1);
      } else if (guest.status === "waiting-order" || guest.status === "waiting-food") {
        guest.patience -= 1;
        if (guest.patience <= 0) impatientParties.add(guest.partyId);
      }
    }
    const takingParties = new Set(this.dining.orders.filter((order) => order.status === "taking").map((order) => order.partyId));
    for (const partyId of takingParties) {
      const partyOrders = this.dining.orders.filter((order) => order.partyId === partyId);
      for (const order of partyOrders) order.takeSeconds = Math.max(0, order.takeSeconds - 1);
      if (partyOrders.length === 0 || !partyOrders.every((order) => order.takeSeconds <= 0)) continue;
      const partyGuests = this.dining.guests.filter((guest) => guest.partyId === partyId);
      for (const order of partyOrders) order.status = "queued";
      for (const guest of partyGuests) guest.status = "waiting-food";
      this.dining.selectedOrderId = partyOrders[0].id;
      this.dining.feedback = `Mai Linh đã nhận ${partyOrders.length} món ở bàn ${partyOrders[0].tableId}; bếp bắt đầu xử lý.`;
    }
    for (const partyId of impatientParties) {
      const party = this.dining.guests.filter((guest) => guest.partyId === partyId);
      if (party.length === 0 || party.every((guest) => guest.status === "leaving" || guest.status === "departing")) continue;
      const waitingForFood = party.some((guest) => guest.status === "waiting-food");
      for (const guest of party) {
        guest.status = "leaving";
        guest.transitionSeconds = diningTravelSeconds(guest.tableId);
      }
      this.shiftLeft += party.length;
      const cancelledOrders = this.dining.orders.filter((order) => order.partyId === partyId);
      for (const order of cancelledOrders) {
        if (!["cooking", "ready", "carrying", "delivered"].includes(order.status)) continue;
        for (const ingredient of RECIPES[order.recipe].ingredients) this.inventory[ingredient.id] += ingredient.quantity;
        this.shiftIngredientCosts = Math.max(0, this.shiftIngredientCosts - getRecipeCost(order.recipe));
      }
      const cancelledIds = new Set(cancelledOrders.map((order) => order.id));
      this.dining.orders = this.dining.orders.filter((order) => order.partyId !== partyId);
      if (this.dining.activeOrderId && cancelledIds.has(this.dining.activeOrderId)) this.dining.activeOrderId = null;
      if (party.some((guest) => guest.id === this.dining.selectedGuestId)) this.dining.selectedGuestId = null;
      this.dining.feedback = waitingForFood
        ? `Cả nhóm bàn ${party[0].tableId} phàn nàn rồi rời đi vì chờ món quá lâu.`
        : `Cả nhóm bàn ${party[0].tableId} phàn nàn rồi rời đi vì chờ nhận món quá lâu.`;
      const complaint = waitingForFood
        ? "Tụi mình đợi hơi lâu rồi, xin phép đi trước nhé."
        : "Mình ngồi đợi mà chưa ai nhận món, thôi để hôm khác ghé lại nhé.";
      this.queueDiningDialogue(party[0].id, complaint, "complaint");
    }
    const leavingParties = new Map<string, DiningGuest[]>();
    for (const guest of this.dining.guests) {
      if (guest.status !== "leaving" || guest.transitionSeconds > 0) continue;
      const party = leavingParties.get(guest.partyId) ?? [];
      party.push(guest);
      leavingParties.set(guest.partyId, party);
    }
    for (const [partyId, arrivedMembers] of leavingParties) {
      const party = this.dining.guests.filter((guest) => guest.partyId === partyId);
      if (party.length === 0 || !party.every((guest) => guest.status === "leaving" && guest.transitionSeconds <= 0)) continue;
      const table = this.dining.tables.find((entry) => entry.id === party[0].tableId);
      const selectedOrderGuest = this.dining.orders.find((order) => order.id === this.dining.selectedOrderId)?.guestId;
      if (table) {
        for (const guest of party) {
          const seat = table.seats[guest.seatIndex];
          seat.status = "empty";
          seat.guestId = null;
        }
        table.cleanliness = "dirty";
        this.syncDiningTable(table);
      }
      for (const guest of party) {
        guest.status = "departing";
        guest.transitionSeconds = DINING_OUTDOOR_WALK_SECONDS;
      }
      this.dining.feedback = `Cả nhóm đã ra tới cửa quán; ${arrivedMembers.length} chỗ bàn ${party[0].tableId} đã trống.`;
    }
    const departedParties = new Set(this.dining.guests
      .filter((guest) => guest.status === "departing" && guest.transitionSeconds < 0)
      .map((guest) => guest.partyId));
    for (const partyId of departedParties) {
      const party = this.dining.guests.filter((guest) => guest.partyId === partyId);
      if (party.length === 0 || !party.every((guest) => guest.status === "departing" && guest.transitionSeconds < 0)) continue;
      const selectedOrderGuest = this.dining.orders.find((order) => order.id === this.dining.selectedOrderId)?.guestId;
      this.dining.guests = this.dining.guests.filter((guest) => guest.partyId !== partyId);
      this.dining.orders = this.dining.orders.filter((order) => order.partyId !== partyId);
      if (party.some((guest) => guest.id === this.dining.selectedGuestId)) this.dining.selectedGuestId = null;
      if (party.some((guest) => guest.id === selectedOrderGuest)) this.dining.selectedOrderId = null;
      this.dining.feedback = `Cả nhóm đã đi khỏi quán; bàn ${party[0].tableId} cần được dọn trước khi đón khách mới.`;
    }
    this.tickDiningTableCleaning();
    const activeOrder = this.dining.orders.find((order) => order.id === this.dining.activeOrderId);
    if (this.dining.activeOrderId && (!activeOrder || activeOrder.status !== "cooking")) {
      this.dining.activeOrderId = null;
    }
    const cookingOrder = this.dining.orders.find((order) => order.id === this.dining.activeOrderId && order.status === "cooking");
    if (cookingOrder) {
      cookingOrder.cookSeconds -= 1;
      if (cookingOrder.cookSeconds <= 0) {
        cookingOrder.status = "ready";
        this.dining.activeOrderId = null;
        this.dining.selectedOrderId = cookingOrder.id;
        this.dining.feedback = `${RECIPES[cookingOrder.recipe].name} đã sẵn sàng; đang chờ phục vụ mang ra bàn.`;
      }
    }
    for (const order of this.dining.orders) {
      if (order.status !== "carrying") continue;
      order.deliverySeconds = Math.max(0, order.deliverySeconds - 1);
      if (order.deliverySeconds > 0) continue;
      const guest = this.dining.guests.find((entry) => entry.id === order.guestId);
      if (guest?.status === "waiting-food") this.serveDiningOrder(order, guest, order.carriedByStaff);
    }
    for (const order of this.dining.orders) {
      if (order.status !== "delivered") continue;
      const guest = this.dining.guests.find((entry) => entry.id === order.guestId);
      if (!guest || guest.status !== "eating") continue;
      order.eatSeconds = Math.max(0, order.eatSeconds - 1);
    }
    const eatingParties = new Set(this.dining.guests.filter((guest) => guest.status === "eating").map((guest) => guest.partyId));
    for (const partyId of eatingParties) {
      const party = this.dining.guests.filter((guest) => guest.partyId === partyId);
      const partyOrders = this.dining.orders.filter((order) => order.partyId === partyId);
      if (party.length > 0 && partyOrders.length === party.length && partyOrders.every((order) => order.status === "delivered" && order.eatSeconds <= 0)) {
        for (const member of party) member.status = "awaiting-payment";
        this.dining.feedback = `Cả nhóm bàn ${party[0].tableId} đã ăn xong; có thể thu hóa đơn.`;
      }
    }
    this.diningArrivalClock += 1;
    if (this.elapsedSeconds % 32 === 0) {
      const promoter = this.getAvailableStaff("promoter");
      if (promoter) this.consumeStaffEnergy(promoter, 8);
    }
    if (this.diningArrivalClock >= this.diningArrivalIntervalSeconds) {
      this.diningArrivalClock = 0;
      this.arriveDiningParty();
      this.diningArrivalIntervalSeconds = this.nextDiningArrivalInterval();
    }
    if (this.serviceMode === "dining") {
      this.tickDiningConversation();
      this.advanceDiningDialogue();
    }
    this.diningStaffClock += 1;
    const serviceLevel = this.getWorkingLevel("server") + this.getWorkingLevel("cashier") + this.getWorkingLevel("prep") + this.getWorkingLevel("chef");
    const supportInterval = Math.max(3, 8 - serviceLevel);
    if (this.diningStaffClock >= supportInterval) {
      this.diningStaffClock = 0;
      this.helpDiningRoom();
    }
  }

  private tickDiningTableCleaning(): void {
    this.dining.cleaningCooldownSeconds = Math.max(0, this.dining.cleaningCooldownSeconds - 1);
    const activeTable = this.dining.tables.find((table) => table.cleanliness === "dirty" && table.cleaningSeconds > 0);
    if (activeTable) {
      activeTable.cleaningSeconds = Math.max(0, activeTable.cleaningSeconds - 1);
      if (activeTable.cleaningSeconds > 0) return;
      activeTable.cleanliness = "clean";
      activeTable.cleaningTotalSeconds = 0;
      const server = this.staff.find((member) => member.isWorking && member.role === "server");
      this.dining.cleaningCooldownSeconds = server ? getServerCleaningRestSeconds(server.level) : 0;
      this.dining.feedback = `${getStaffCandidate(server?.id ?? "")?.name ?? "Phục vụ"} đã dọn sạch bàn ${activeTable.id}.`;
      return;
    }

    const server = this.getAvailableStaff("server");
    if (!server) return;
    const serverHasPriorityWork = this.dining.orders.some((order) => ["called", "taking", "queued", "cooking", "ready", "carrying"].includes(order.status))
      || this.dining.guests.some((guest) => guest.status === "waiting-order" || guest.status === "waiting-food");
    if (serverHasPriorityWork || this.dining.cleaningCooldownSeconds > 0) return;

    const dirtyTable = this.dining.tables.find((table) => table.cleanliness === "dirty"
      && table.seats.every((seat) => seat.status === "empty" && !seat.guestId));
    if (!dirtyTable) return;
    // Four seconds to approach, followed by three seconds actually cleaning.
    const duration = 7;
    dirtyTable.cleaningSeconds = duration;
    dirtyTable.cleaningTotalSeconds = duration;
    this.consumeStaffEnergy(server, 7);
    this.dining.feedback = `${getStaffCandidate(server.id)?.name ?? "Phục vụ"} đang dọn bàn ${dirtyTable.id} · khoảng ${duration} giây.`;
  }

  private arriveDiningParty(): void {
    if (!this.inShift) return;
    const activeParties = new Set(this.dining.guests
      .filter((guest) => guest.status !== "departing")
      .map((guest) => guest.partyId));
    const activeGuestCount = this.dining.guests.filter((guest) => guest.status !== "departing").length;
    if (activeParties.size >= DINING_MAX_ACTIVE_PARTIES || activeGuestCount >= DINING_MAX_ACTIVE_GUESTS) return;

    const unlockedTableCount = getDiningTableCapacity();
    const nextPartyNumber = this.diningPartyNumber + 1;
    const previousSelectionState = cloneDiningPartySelectionState(this.diningPartySelection);
    const party = diningPartyForArrival(this.diningPartySelection);
    let partySize = party.characterIds.length;
    const usesBackFacingSeat = (size: number) => size === 4
      || (size === 3 && party.characterIds.length === 3 && party.hasBackFacingGuest);
    const preferredSeatOrder = (size: number): readonly number[] => {
      if (size <= 2 || !usesBackFacingSeat(size)) return [1, 3, 0];
      return [1, 3, 2, 0];
    };
    const findTableForParty = (size: number) => this.dining.tables
      .filter((entry) => entry.id <= unlockedTableCount && entry.cleanliness !== "dirty")
      .filter((entry) => preferredSeatOrder(size).filter((index) => entry.seats[index].status === "empty").length >= size)
      .sort((a, b) => a.seats.filter((seat) => seat.guestId).length - b.seats.filter((seat) => seat.guestId).length || a.id - b.id)[0];
    let table = findTableForParty(partySize);

    // If there is no room for a full party, keep a group of at least two together.
    while (!table && partySize > 2) {
      partySize -= 1;
      table = findTableForParty(partySize);
    }
    if (!table || activeGuestCount + partySize > DINING_MAX_ACTIVE_GUESTS) {
      this.diningPartySelection = previousSelectionState;
      return;
    }

    this.diningPartyNumber = nextPartyNumber;
    this.diningDialogueNumber += 1;
    const partyId = `dining-party-${this.diningPartyNumber}`;
    const memberCharacterIds = party.characterIds.slice(0, partySize);
    const familyContext = diningFamilyContext(memberCharacterIds);
    const arrivalDialogue = diningArrivalDialogue(party.type, this.diningDialogueNumber, partySize, familyContext, memberCharacterIds);
    const outsideDirection: -1 | 1 = Math.random() < 0.5 ? -1 : 1;
    const initialStatus: DiningGuestStatus = "approaching";
    const seatIndices = preferredSeatOrder(partySize).filter((index) => table!.seats[index].status === "empty").slice(0, partySize);
    memberCharacterIds.forEach((characterId, memberIndex) => {
    const customer = this.makeCustomer();
      const guestId = `dining-guest-${customer.id}`;
      const seat = table!.seats[seatIndices[memberIndex]];
      const orderDialogue = diningOrderDialogue(
        party.type,
        RECIPES[customer.recipe].name.toLowerCase(),
        this.diningDialogueNumber,
        partySize,
        memberIndex,
        familyContext,
        memberCharacterIds,
      );
      seat.status = "reserved";
      seat.guestId = guestId;
      this.dining.guests.push({
        id: guestId,
        partyId,
        partyType: party.type,
        partySize,
        partyMemberIndex: memberIndex,
        arrivalDelaySeconds: memberIndex * 0.8,
        outsideDirection,
        tableId: table!.id,
        seatIndex: seat.index,
        characterId,
        arrivalDialogue: memberIndex === arrivalDialogue.speakerIndex ? arrivalDialogue.text : null,
        orderDialogue: orderDialogue.text,
        dialogueNumber: this.diningDialogueNumber,
        type: customer.type,
        recipe: customer.recipe,
        status: initialStatus,
        patience: CUSTOMER_PATIENCE_SECONDS,
        transitionSeconds: DINING_OUTDOOR_WALK_SECONDS,
      });
      this.dining.orders.push({
        id: `dining-order-${customer.id}`,
        guestId,
        partyId,
        tableId: table!.id,
        recipe: customer.recipe,
        status: "called",
        takeSeconds: 0,
        cookSeconds: 0,
        deliverySeconds: 0,
        carriedByStaff: false,
        eatSeconds: 0,
      });
    });
    this.syncDiningTable(table);
    const partyName = party.type === "family" ? "Gia đình" : "Nhóm bạn";
    this.dining.feedback = `${partyName} ${partySize} người vào bàn ${table.id}: “${arrivalDialogue.text}”`;
  }

  private nextDiningArrivalInterval(firstArrival = false): number {
    const activePartyCount = new Set(this.dining.guests
      .filter((guest) => guest.status !== "departing")
      .map((guest) => guest.partyId)).size;
    let minSeconds: number;
    let maxSeconds: number;
    if (firstArrival) {
      // Get the first party moving soon so the room does not feel broken at shift start.
      // Later arrivals keep the slower, variable cadence below.
      minSeconds = 3;
      maxSeconds = 5;
    } else if (activePartyCount >= 2) {
      minSeconds = 42;
      maxSeconds = 56;
    } else if (Math.random() < 0.28) {
      // Short busy spells happen occasionally; most arrivals stay spaced out.
      minSeconds = 20;
      maxSeconds = 28;
    } else {
      minSeconds = 32;
      maxSeconds = 46;
    }
    const randomSeconds = minSeconds + Math.floor(Math.random() * (maxSeconds - minSeconds + 1));
    const promoterBonus = Math.min(4, this.getWorkingLevel("promoter") * 2);
    return Math.max(firstArrival ? 3 : 18, randomSeconds - promoterBonus);
  }

  private queueDiningDialogue(guestId: string, text: string, kind: DiningDialogueEvent["kind"], delaySeconds = 0): void {
    const isComplaint = kind === "complaint";
    const isOrder = kind === "order";
    const requestedStart = this.elapsedSeconds + Math.max(0, delaySeconds);
    const startsAt = isComplaint ? this.elapsedSeconds : isOrder ? requestedStart : Math.max(requestedStart, this.diningDialogueAvailableAt);
    const event: DiningDialogueEvent = {
      id: ++this.diningDialogueId,
      guestId,
      text,
      kind,
      endsAt: startsAt + 4,
    };
    if (isComplaint && this.dining.dialogueEvent?.kind !== "complaint") {
      this.dining.dialogueEvent = { ...event, endsAt: this.elapsedSeconds + 3 };
    } else if (isComplaint) {
      this.pendingDiningDialogues.unshift({ event, startsAt });
    } else if (isOrder) {
      // Service dialogue takes priority over optional table chatter so the
      // customer's line starts after Mai Linh actually reaches the table.
      this.pendingDiningDialogues = this.pendingDiningDialogues.filter((entry) => entry.event.kind !== "conversation");
      this.pendingDiningDialogues.unshift({ event, startsAt });
    } else {
      this.pendingDiningDialogues.push({ event, startsAt });
    }
    if (!isComplaint) this.diningDialogueAvailableAt = startsAt + 4;
  }

  private advanceDiningDialogue(): void {
    if (this.dining.dialogueEvent && this.elapsedSeconds >= this.dining.dialogueEvent.endsAt) {
      this.dining.dialogueEvent = null;
    }
    if (this.dining.dialogueEvent) return;

    while (this.pendingDiningDialogues.length > 0) {
      const next = this.pendingDiningDialogues[0];
      if (next.startsAt > this.elapsedSeconds) return;
      this.pendingDiningDialogues.shift();
      const guest = this.dining.guests.find((entry) => entry.id === next.event.guestId);
      if (!guest || guest.status === "approaching" || guest.status === "entering" || guest.status === "departing") continue;
      if (guest.status === "leaving" && next.event.kind !== "complaint") continue;
      const displaySeconds = next.event.kind === "complaint" ? 3 : 4;
      this.dining.dialogueEvent = { ...next.event, endsAt: this.elapsedSeconds + displaySeconds };
      return;
    }
  }

  private tickDiningConversation(): void {
    this.diningConversationClock += 1;
    const interval = 18 + (this.diningConversationNumber % 4) * 3;
    if (this.diningConversationClock < interval || this.pendingDiningDialogues.length > 0 || this.dining.dialogueEvent) return;

    const partyMap = new Map<string, DiningGuest[]>();
    for (const guest of this.dining.guests) {
      if (!["waiting-order", "waiting-food", "eating", "awaiting-payment"].includes(guest.status)) continue;
      const party = partyMap.get(guest.partyId) ?? [];
      party.push(guest);
      partyMap.set(guest.partyId, party);
    }
    const parties = [...partyMap.values()].filter((party) => party.length > 1)
      .map((party) => party.sort((a, b) => a.partyMemberIndex - b.partyMemberIndex));
    if (parties.length === 0) return;

    const party = parties[this.diningConversationNumber % parties.length];
    const partyLeader = party[0];
    if (!partyLeader) return;
    const phase = party.some((member) => member.status === "eating")
      ? "eating"
      : party.some((member) => member.status === "awaiting-payment")
        ? "awaiting-payment"
      : party.some((member) => member.status === "waiting-food")
        ? "waiting-food"
        : "waiting-order";
    const conversation = diningConversationDialogue(
      partyLeader.partyType,
      this.diningDialogueNumber * 17 + this.diningConversationNumber,
      party.length,
      diningFamilyContext(party.map((member) => member.characterId)),
      phase,
      party.map((member) => member.characterId),
    );
    const speaker = party[conversation.speakerIndex];
    const replySpeaker = party[conversation.replySpeakerIndex];
    if (!speaker || !replySpeaker) return;
    this.queueDiningDialogue(speaker.id, conversation.text, "conversation");
    this.queueDiningDialogue(replySpeaker.id, conversation.reply, "conversation");
    this.diningConversationNumber += 1;
    this.diningConversationClock = 0;
  }

  private getDiningGuestDialogue(guest: DiningGuest): string {
    return guest.orderDialogue;
  }

  private getDiningOrderStatusName(status: DiningOrderStatus): string {
    const names: Record<DiningOrderStatus, string> = {
      called: "khách vừa gọi",
      taking: "Mai Linh đang nhận món",
      queued: "chờ bếp",
      cooking: "đang nấu",
      ready: "đã sẵn sàng",
      carrying: "đang bưng tới bàn",
      delivered: "đã giao",
      paid: "đã thanh toán",
    };
    return names[status];
  }

  private payDiningOrder(order: DiningOrder, guest: DiningGuest, byStaff: boolean): void {
    const partyOrders = this.dining.orders.filter((entry) => entry.partyId === guest.partyId);
    const partyGuests = this.dining.guests.filter((entry) => entry.partyId === guest.partyId);
    if (order.status !== "delivered" || partyOrders.length === 0
      || partyOrders.some((entry) => entry.status !== "delivered")
      || partyGuests.length === 0 || partyGuests.some((entry) => entry.status !== "awaiting-payment")) return;
    const revenue = partyOrders.reduce((sum, entry) => sum + RECIPES[entry.recipe].salePrice, 0);
    const tip = partyGuests.reduce((sum, member) => sum + CUSTOMER_TYPES[member.type].tip + (member.patience >= 25 ? 2 : 0), 0);
    const reputationEarned = partyGuests.every((member) => member.patience >= 25) ? 2 : 1;
    const transitionSeconds = diningTravelSeconds(guest.tableId);
    for (const partyOrder of partyOrders) partyOrder.status = "paid";
    for (const member of partyGuests) {
      member.status = "leaving";
      member.transitionSeconds = transitionSeconds;
    }
    this.coins += revenue + tip;
    this.recordLedger(`Bán ${partyOrders.length} món · bàn ${guest.tableId}`, revenue);
    this.recordLedger("Tiền boa", tip);
    this.cashCollection = {
      id: ++this.cashCollectionId,
      amount: revenue + tip,
      source: "dining",
      tableId: guest.tableId,
    };
    this.shiftRevenue += revenue;
    this.shiftTips += tip;
    this.shiftServed += partyOrders.length;
    for (const partyOrder of partyOrders) this.shiftRecipeSales[partyOrder.recipe] += 1;
    this.totalServed += partyGuests.length;
    this.reputation += reputationEarned;
    this.shiftReputation += reputationEarned;
    this.dining.feedback = byStaff
      ? `Thu ngân đã thanh toán hóa đơn ${partyOrders.length} món bàn ${guest.tableId}: ${formatVndFromThousands(revenue)}.`
      : `Đã thu hóa đơn ${partyOrders.length} món: +${formatVndFromThousands(revenue + tip)}${tip > 0 ? ` (gồm ${formatVndFromThousands(tip)} tiền boa)` : ""}.`;
    this.persist();
    this.publish();
  }

  private takeDiningOrder(order: DiningOrder, guest: DiningGuest, byStaff: boolean): void {
    if (order.status !== "ready" || guest.status !== "waiting-food") return;
    order.status = "carrying";
    order.deliverySeconds = DINING_ORDER_DELIVERY_SECONDS;
    order.carriedByStaff = byStaff;
    this.dining.feedback = byStaff
      ? `Mai Linh đang qua bếp lấy ${RECIPES[order.recipe].name.toLowerCase()} cho bàn ${order.tableId}.`
      : `Bạn đang mang ${RECIPES[order.recipe].name.toLowerCase()} tới bàn ${order.tableId}.`;
  }

  private serveDiningOrder(order: DiningOrder, guest: DiningGuest, byStaff: boolean): void {
    if (order.status !== "carrying" || guest.status !== "waiting-food") return;
    order.status = "delivered";
    const partyOrders = this.dining.orders.filter((entry) => entry.partyId === guest.partyId);
    const partyGuests = this.dining.guests.filter((entry) => entry.partyId === guest.partyId);
    if (partyOrders.length > 0 && partyOrders.every((entry) => entry.status === "delivered")) {
      for (const member of partyGuests) member.status = "eating";
      for (const partyOrder of partyOrders) partyOrder.eatSeconds = 18;
      this.dining.feedback = byStaff
        ? `Phục vụ đã bưng đủ ${partyOrders.length} món tới bàn ${guest.tableId}; cả nhóm bắt đầu ăn.`
        : `Đã bưng đủ ${partyOrders.length} món tới bàn ${guest.tableId}; cả nhóm bắt đầu dùng bữa.`;
    } else {
      this.dining.feedback = byStaff
        ? `Phục vụ đã mang món tới bàn ${guest.tableId}; còn chờ các món khác.`
        : `Đã bưng ${RECIPES[order.recipe].name.toLowerCase()} tới bàn ${guest.tableId}; đang chờ các món còn lại.`;
    }
  }

  private startDiningOrderCooking(order: DiningOrder, staffMember?: HiredStaffMember): boolean {
    const firstQueuedOrder = this.dining.orders.find((entry) => entry.status === "queued");
    if (order.status !== "queued"
      || (this.dining.activeOrderId && this.dining.activeOrderId !== order.id)
      || (firstQueuedOrder && firstQueuedOrder.id !== order.id)
      || !this.hasRecipeStock(order.recipe)) return false;
    const recipe = RECIPES[order.recipe];
    for (const ingredient of recipe.ingredients) this.inventory[ingredient.id] -= ingredient.quantity;
    order.status = "cooking";
    const chefLevel = this.getWorkingLevel("chef");
    const prepLevel = this.getWorkingLevel("prep");
    const fatiguePenalty = staffMember ? Math.max(0, Math.ceil((78 - staffMember.energy) / 20)) : 0;
    const prepAssistPenalty = staffMember?.role === "prep" && chefLevel === 0 ? 2 : 0;
    order.cookSeconds = Math.max(1, 5 - chefLevel * 2 - prepLevel + fatiguePenalty + prepAssistPenalty);
    this.dining.activeOrderId = order.id;
    this.shiftIngredientCosts += getRecipeCost(order.recipe);
    if (staffMember) this.consumeStaffEnergy(staffMember, staffMember.role === "chef" ? 26 : 32);
    this.persist();
    return true;
  }

  private helpDiningRoom(): void {
    const queuedOrder = this.dining.orders.find((order) => order.status === "queued");
    const activeKitchenOrder = this.dining.orders.some((order) => order.status === "cooking");
    const cook = this.getAvailableStaff("chef") ?? this.getAvailableStaff("prep");
    if (queuedOrder && !activeKitchenOrder && cook && this.startDiningOrderCooking(queuedOrder, cook)) {
      const cookName = getStaffCandidate(cook.id)?.name ?? "Đầu bếp";
      this.dining.feedback = `${cookName} bắt đầu nấu ${RECIPES[queuedOrder.recipe].name.toLowerCase()} cho bàn ${queuedOrder.tableId}.`;
    }

    const awaitingPayment = this.dining.guests.find((guest) => guest.status === "awaiting-payment");
    const payableOrder = awaitingPayment && this.dining.orders.find((order) => order.partyId === awaitingPayment.partyId && order.status === "delivered");
    const payableParty = awaitingPayment && this.dining.guests.filter((guest) => guest.partyId === awaitingPayment.partyId);
    const payablePartyOrders = awaitingPayment && this.dining.orders.filter((order) => order.partyId === awaitingPayment.partyId);
    const cashier = this.getAvailableStaff("cashier");
    if (cashier && awaitingPayment && payableOrder && payableParty?.every((guest) => guest.status === "awaiting-payment")
      && payablePartyOrders?.every((order) => order.status === "delivered")) {
      this.consumeStaffEnergy(cashier, 16);
      this.payDiningOrder(payableOrder, awaitingPayment, true);
    }

    const readyOrder = this.dining.orders.find((order) => order.status === "ready");
    const readyGuest = readyOrder && this.dining.guests.find((guest) => guest.id === readyOrder.guestId && guest.status === "waiting-food");
    const server = this.getAvailableStaff("server");
    if (server && readyOrder && readyGuest
      && !this.dining.tables.some((table) => table.cleaningSeconds > 0)
      && !this.dining.orders.some((order) => order.status === "taking" || order.status === "carrying")) {
      this.consumeStaffEnergy(server, 17);
      this.takeDiningOrder(readyOrder, readyGuest, true);
      return;
    }

    // Deliver cooked food before Mai Linh accepts another table's order.
    this.takeCalledDiningOrder();
  }

  private takeCalledDiningOrder(): boolean {
    if (this.dining.tables.some((table) => table.cleaningSeconds > 0)) return false;
    if (this.dining.orders.some((order) => order.status === "taking" || order.status === "carrying")) return false;
    const server = this.getAvailableStaff("server");
    if (!server) return false;
    const waitingGuest = this.dining.guests.find((guest) => guest.status === "waiting-order");
    if (!waitingGuest) return false;
    const partyGuests = this.dining.guests.filter((guest) => guest.partyId === waitingGuest.partyId);
    const partyOrders = this.dining.orders.filter((order) => order.partyId === waitingGuest.partyId);
    if (partyGuests.length !== waitingGuest.partySize
      || partyGuests.some((guest) => guest.status !== "waiting-order")
      || partyOrders.length !== partyGuests.length
      || partyOrders.some((order) => order.status !== "called")) return false;

    for (const order of partyOrders) {
      order.status = "taking";
      order.takeSeconds = DINING_ORDER_TAKE_SECONDS;
      order.carriedByStaff = true;
    }
    if (this.serviceMode === "dining") {
      this.queueDiningDialogue(waitingGuest.id, waitingGuest.orderDialogue, "order", DINING_ORDER_APPROACH_SECONDS);
    }
    this.consumeStaffEnergy(server, 8);
    const serverName = getStaffCandidate(server.id)?.name ?? "Phục vụ";
    this.dining.feedback = `${serverName} đang tới bàn ${waitingGuest.tableId} để nhận món.`;
    return true;
  }

  private syncDiningTable(table: DiningTable): void {
    table.status = table.seats.some((seat) => seat.status === "occupied") ? "occupied"
      : table.seats.some((seat) => seat.status === "reserved") ? "reserved"
        : "empty";
    table.guestId = table.seats.find((seat) => seat.guestId)?.guestId ?? null;
  }

  private settleServicePeriod(): void {
    const wagesDue = this.staff.filter((member) => member.isWorking).reduce((total, member) => {
      return total + (getStaffCandidate(member.id)?.wagePerShift ?? 0) * member.level;
    }, 0);
    const wages = Math.min(this.coins, wagesDue);
    const bestSelling = PLAYABLE_RECIPE_IDS
      .map((id) => ({ id, count: this.shiftRecipeSales[id] }))
      .sort((a, b) => b.count - a.count)[0];
    const bestSellingRecipe = bestSelling && bestSelling.count > 0 ? bestSelling.id : null;
    this.coins -= wages;
    this.recordLedger("Lương nhân viên", -wages);
    this.report = {
      served: this.shiftServed,
      left: this.shiftLeft,
      revenue: this.shiftRevenue,
      tips: this.shiftTips,
      ingredientCosts: this.shiftIngredientCosts,
      wages,
      net: this.shiftRevenue + this.shiftTips - this.shiftIngredientCosts - wages,
      reputationEarned: this.shiftReputation,
      bestSellingRecipe,
      bestSellingCount: bestSelling?.count ?? 0,
    };
    this.shiftRevenue = 0;
    this.shiftTips = 0;
    this.shiftIngredientCosts = 0;
    this.shiftServed = 0;
    this.shiftLeft = 0;
    this.shiftReputation = 0;
    this.shiftRecipeSales = Object.fromEntries(PLAYABLE_RECIPE_IDS.map((id) => [id, 0])) as Record<RecipeId, number>;
    this.ledgerDay += 1;
    this.persist();
  }

  private hasRecipeStock(recipeId: RecipeId): boolean {
    return this.getMissingRecipeIngredients(recipeId).length === 0;
  }

  private getMissingRecipeIngredients(recipeId: RecipeId): string[] {
    return RECIPES[recipeId].ingredients
      .filter((ingredient) => this.inventory[ingredient.id] < ingredient.quantity)
      .map((ingredient) => {
        const name = INGREDIENTS.find((entry) => entry.id === ingredient.id)?.name ?? ingredient.id;
        const missing = ingredient.quantity - this.inventory[ingredient.id];
        return `${name}${missing > 1 ? ` (thiếu ${missing})` : ""}`;
      });
  }

  private canMakeAnyRecipe(): boolean {
    return this.getEnabledRecipes().some((recipeId) => this.hasRecipeStock(recipeId));
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

    for (const ingredient of recipe.ingredients) this.inventory[ingredient.id] -= ingredient.quantity;
    this.coins += recipe.salePrice + tip;
    this.recordLedger(`Bán ${recipe.name}`, recipe.salePrice);
    this.recordLedger("Tiền boa", tip);
    this.cashCollection = {
      id: ++this.cashCollectionId,
      amount: recipe.salePrice + tip,
      source: "street",
    };
    this.shiftRevenue += recipe.salePrice;
    this.shiftTips += tip;
    this.shiftIngredientCosts += ingredientCost;
    this.shiftRecipeSales[customer.recipe] += 1;
    this.shiftServed += 1;
    this.totalServed += 1;
    this.reputation += reputationEarned;
    this.shiftReputation += reputationEarned;
    this.customers.shift();
    this.assembly = [];

    const guestName = CUSTOMER_TYPES[customer.type].name.toLowerCase();
    this.feedback = byStaff
      ? `Phụ bếp giao ${recipe.name.toLowerCase()} cho ${guestName}. Thu ${formatVndFromThousands(recipe.salePrice)}.`
      : `Phục vụ món thành công! +${formatVndFromThousands(recipe.salePrice + tip)}${tip > 0 ? ` (có ${formatVndFromThousands(tip)} tiền boa)` : ""}.`;
    this.persist();
    this.publish();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedGame;
      if (saved.version !== 1 && saved.version !== 2 && saved.version !== 3) return;

      this.storeName = typeof saved.storeName === "string" ? normalizeStoreName(saved.storeName) : "";
      this.inShift = saved.inShift === true;
      this.coins = Math.max(0, saved.coins);
      this.ledgerDay = Number.isFinite(saved.ledgerDay) ? Math.max(1, Math.trunc(saved.ledgerDay!)) : 1;
      this.ledger = Array.isArray(saved.ledger) ? saved.ledger.filter((entry) => Number.isFinite(entry.day) && typeof entry.label === "string" && Number.isFinite(entry.amount)).slice(-300) : [];
      this.reputation = Math.max(0, saved.reputation);
      this.cartLevel = Math.max(1, Math.min(MAX_CART_LEVEL, saved.cartLevel));
      this.inventory = Object.fromEntries((Object.keys(MENU_INGREDIENTS) as MenuIngredientId[]).map((id) => [id, 0])) as Inventory;
      const savedInventory = saved.inventory ?? {};
      for (const id of Object.keys(MENU_INGREDIENTS) as MenuIngredientId[]) {
        if (Number.isFinite(savedInventory[id])) this.inventory[id] = clampStock(savedInventory[id]);
      }
      const legacyIngredientIds: Record<string, MenuIngredientId> = {
        bread: "corn",
        pate: "marinade",
        cha: "porkBelly",
        egg: "chickenEggs",
        greens: "sideVegetables",
      };
      for (const [legacyId, ingredientId] of Object.entries(legacyIngredientIds)) {
        if (Number.isFinite(savedInventory[legacyId])) this.inventory[ingredientId] += clampStock(savedInventory[legacyId]);
      }
      for (const [ingredientId, amount] of Object.entries(saved.marketInventory ?? {})) {
        if (ingredientId in MENU_INGREDIENTS) this.inventory[ingredientId as MenuIngredientId] += clampStock(amount);
      }
      const restoredStaff = Array.isArray(saved.staff)
        ? saved.staff.filter((member) => getStaffCandidate(member.id) && member.role === getStaffCandidate(member.id)?.role)
          .map((member) => ({ ...member, level: Math.max(1, Math.min(MAX_STAFF_LEVEL, Math.trunc(member.level))), isWorking: member.isWorking === true }))
        : saved.hasStaff ? [{ id: "huy-phu-bep", role: "prep" as const, level: 1, isWorking: true, energy: 100, restSeconds: 0 }] : [];
      this.staff = restoredStaff.length > 0 ? restoredStaff : createStartingStaff();
      const savedMenu = Array.isArray(saved.activeMenu)
        ? saved.activeMenu.filter((id): id is RecipeId => PLAYABLE_RECIPE_IDS.includes(id as RecipeId) && RECIPES[id as RecipeId].unlockLevel <= this.cartLevel)
        : createStartingMenu();
      const savedLearned = Array.isArray(saved.learnedRecipes)
        ? saved.learnedRecipes.filter((id): id is RecipeId => PLAYABLE_RECIPE_IDS.includes(id as RecipeId))
        : savedMenu;
      this.learnedRecipes = [...new Set([...createStartingMenu(), ...savedLearned, ...savedMenu])];
      this.activeMenu = savedMenu.length > 0 ? [...new Set(savedMenu)].filter((id) => this.learnedRecipes.includes(id)) : createStartingMenu();
      if (saved.version === 1) {
        this.activeMenu = [...new Set([...this.activeMenu, ...createStartingMenu()])];
      }
      if (this.inShift) {
        this.customers = [this.makeCustomer()];
        this.diningArrivalIntervalSeconds = this.nextDiningArrivalInterval(true);
      }
      this.shiftRecipeSales = Object.fromEntries(PLAYABLE_RECIPE_IDS.map((id) => [id, clampStock(saved.shiftRecipeSales?.[id])])) as Record<RecipeId, number>;
      this.report = saved.report ? { ...saved.report } : null;
      this.marketBasketHasItems = saved.marketBasketHasItems === true;
      this.totalServed = Math.max(0, saved.totalServed ?? 0);
      this.diningDialogueNumber = Number.isFinite(saved.diningDialogueNumber)
        ? Math.max(0, Math.trunc(saved.diningDialogueNumber!))
        : 0;
      this.diningPartySelection = restoreDiningPartySelectionState(saved.diningPartySelection);

      if (this.hasStaff && Number.isFinite(saved.lastSavedAt)) {
        const elapsedMinutes = Math.min(
          OFFLINE_CAP_MINUTES,
          Math.max(0, Math.floor((Date.now() - saved.lastSavedAt) / 60_000)),
        );
        const offlineCoins = elapsedMinutes * OFFLINE_COINS_PER_MINUTE;
        if (offlineCoins > 0) {
          this.coins += offlineCoins;
          this.recordLedger("Thu nhập khi vắng mặt", offlineCoins);
          this.offlineNotice = `Đội ngũ đã vận hành ${elapsedMinutes} phút khi bạn vắng mặt, mang về ${formatVndFromThousands(offlineCoins)}.`;
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
      version: 3,
      inShift: this.inShift,
      storeName: this.storeName,
      coins: this.coins,
      ledgerDay: this.ledgerDay,
      ledger: this.ledger,
      reputation: this.reputation,
      cartLevel: this.cartLevel,
      hasStaff: this.hasStaff,
      staff: this.staff,
      learnedRecipes: this.learnedRecipes,
      activeMenu: this.activeMenu,
      inventory: this.inventory,
      marketBasketHasItems: this.marketBasketHasItems,
      totalServed: this.totalServed,
      shiftRecipeSales: this.shiftRecipeSales,
      report: this.report,
      diningDialogueNumber: this.diningDialogueNumber,
      diningPartySelection: cloneDiningPartySelectionState(this.diningPartySelection),
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

  private getMarketInventory(): Record<MenuIngredientId, number> {
    return Object.fromEntries(
      (Object.keys(MENU_INGREDIENTS) as MenuIngredientId[]).map((id) => [id, this.inventory[id]]),
    ) as Record<MenuIngredientId, number>;
  }
}
