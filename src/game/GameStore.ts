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
export type DiningGuestStatus = "approaching" | "entering" | "waiting-order" | "waiting-food" | "eating" | "awaiting-payment" | "leaving" | "departing";
export const DINING_OUTDOOR_WALK_SECONDS = 9;
export type DiningOrderStatus = "called" | "queued" | "cooking" | "ready" | "delivered" | "paid";

export interface DiningTable {
  id: number;
  status: DiningTableStatus;
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
  assembly: IngredientId[];
  cookSeconds: number;
  eatSeconds: number;
}

export interface DiningDialogueEvent {
  id: number;
  guestId: string;
  text: string;
  kind: "order" | "conversation";
  endsAt: number;
}

export interface CashCollectionEvent {
  id: number;
  amount: number;
  source: "street" | "dining";
  tableId?: number;
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
  cashCollection: CashCollectionEvent | null;
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
  diningDialogueNumber?: number;
  diningPartySelection?: DiningPartySelectionState;
  lastSavedAt: number;
}

const SAVE_KEY = "banh-mi-pho-save-v1";
const STORE_NAME_MAX_LENGTH = 24;

export function getDiningTableCapacity(): number {
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
    dialogueEvent: null,
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
  private diningStaffClock = 0;
  private customerId = 0;
  private diningPartyNumber = 0;
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

  constructor() {
    this.load();
  }

  subscribe(listener: (snapshot: GameSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
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
      cashCollection: this.cashCollection ? { ...this.cashCollection } : null,
      dining: {
        ...this.dining,
        dialogueEvent: this.dining.dialogueEvent ? { ...this.dining.dialogueEvent } : null,
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
      this.arriveDiningParty();
    }
    this.dining.feedback = mode === "dining"
      ? "Khách sẽ tự vào và chọn bàn trống. Chạm khách để xem lời gọi món."
      : "Bạn đang ở ngoài phố; vòng phục vụ tại quầy vẫn giữ nguyên.";
    this.publish();
  }

  setStreetDemandMultiplier(multiplier: number): void {
    this.streetDemandMultiplier = Math.max(0.65, Math.min(1.25, multiplier));
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
    const party = this.dining.guests.filter((member) => member.partyId === guest.partyId);
    const partyOrders = this.dining.orders.filter((entry) => entry.partyId === guest.partyId);
    const missingIngredients = guest.status === "waiting-order" && party.length === guest.partySize
      && party.every((member) => member.status === "waiting-order")
      ? this.getMissingPartyIngredients(partyOrders)
      : [];
    this.dining.feedback = missingIngredients.length > 0
      ? `Order nhóm bàn ${guest.tableId} chưa nhận được: kho thiếu ${missingIngredients.join(", ")}.`
      : this.getDiningGuestDialogue(guest);
    this.publish();
  }

  acceptDiningOrder(): void {
    const guest = this.dining.guests.find((entry) => entry.id === this.dining.selectedGuestId);
    const partyGuests = guest && this.dining.guests.filter((entry) => entry.partyId === guest.partyId);
    const partyOrders = guest && this.dining.orders.filter((entry) => entry.partyId === guest.partyId);
    if (!this.inShift || !guest || !partyGuests?.length || !partyOrders?.length
      || partyGuests.length !== guest.partySize
      || partyGuests.some((member) => member.status !== "waiting-order")
      || partyOrders.length !== partyGuests.length
      || partyOrders.some((entry) => entry.status !== "called")) {
      this.dining.feedback = "Chọn khách đang chờ gọi món để nhận phiếu nhé.";
      this.publish();
      return;
    }
    const missing = this.getMissingPartyIngredients(partyOrders);
    if (missing.length > 0) {
      this.dining.feedback = `Kho thiếu ${missing.join(", ")}; chưa gửi order nhóm tới bếp.`;
      this.publish();
      return;
    }
    for (const order of partyOrders) order.status = "queued";
    for (const member of partyGuests) member.status = "waiting-food";
    this.dining.selectedOrderId = partyOrders[0].id;
    this.dining.feedback = `Đã nhận order bàn ${guest.tableId} gồm ${partyOrders.length} món; các phiếu đang chờ ở bếp.`;
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
    const firstQueuedOrder = this.dining.orders.find((entry) => entry.status === "queued");
    if (firstQueuedOrder && firstQueuedOrder.id !== order.id) {
      this.dining.feedback = `Bếp làm lần lượt; hãy hoàn tất phiếu bàn ${firstQueuedOrder.tableId} trước.`;
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
    if (!this.startDiningOrderCooking(order)) {
      order.assembly = [];
      this.dining.activeOrderId = null;
      this.dining.feedback = "Không thể bắt đầu món này; nguyên liệu được giữ nguyên và phiếu vẫn chờ bếp.";
    } else {
      this.dining.feedback = `Bếp đang nấu ${recipe.name.toLowerCase()}…`;
    }
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
    this.serveDiningOrder(order, guest, false);
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
    this.diningPartyNumber = 0;
    this.diningConversationClock = 0;
    this.diningDialogueAvailableAt = 0;
    this.pendingDiningDialogues = [];
    this.arriveDiningParty();
    this.assembly = [];
    this.shiftRevenue = 0;
    this.shiftTips = 0;
    this.shiftIngredientCosts = 0;
    this.shiftServed = 0;
    this.shiftLeft = 0;
    this.shiftReputation = 0;
    this.arrivalClock = 0;
    this.staffClock = 0;
    this.diningStaffClock = 0;
    this.report = null;
    this.feedback = this.serviceMode === "street"
      ? "Khách đầu tiên đang đi bộ tới quán từ ngoài phố."
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
        this.feedback = `Chưa đủ tiền nhập hàng; cần ${formatVndFromThousands(RESTOCK_PACK_COST)}.`;
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
      this.feedback = `Cần thêm ${formatVndFromThousands(cost - this.coins)} để nâng cấp quán.`;
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
      this.feedback = `Cần thêm ${formatVndFromThousands(STAFF_HIRE_COST - this.coins)} để thuê phụ bếp.`;
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
    this.tickDiningRoom();
    if (this.serviceMode === "street") this.tickStreetShift();

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
    const arrivalInterval = Math.max(1, Math.round(CUSTOMER_ARRIVAL_SECONDS / this.streetDemandMultiplier));
    if (this.arrivalClock >= arrivalInterval) {
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
          this.dining.feedback = `Khách đã ngồi bàn ${guest.tableId}; chạm khách để xem món muốn gọi.`;
          this.queueDiningDialogue(guest.id, guest.orderDialogue, "order");
        }
      } else if (guest.status === "leaving") {
        guest.transitionSeconds -= 1;
      } else if (guest.status === "departing" && this.serviceMode === "street") {
        guest.transitionSeconds = Math.max(-1, guest.transitionSeconds - 1);
      } else if (guest.status === "waiting-order" || guest.status === "waiting-food") {
        guest.patience -= 1;
        if (guest.patience <= 0) impatientParties.add(guest.partyId);
      }
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
      const cancelledIds = new Set(this.dining.orders.filter((order) => order.partyId === partyId).map((order) => order.id));
      this.dining.orders = this.dining.orders.filter((order) => order.partyId !== partyId);
      if (this.dining.activeOrderId && cancelledIds.has(this.dining.activeOrderId)) this.dining.activeOrderId = null;
      if (party.some((guest) => guest.id === this.dining.selectedGuestId)) this.dining.selectedGuestId = null;
      this.dining.feedback = waitingForFood
        ? `Cả nhóm bàn ${party[0].tableId} rời đi vì chờ món quá lâu.`
        : `Cả nhóm bàn ${party[0].tableId} rời đi vì chờ nhận order quá lâu.`;
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
          seat.status = "dirty";
          seat.guestId = null;
        }
        this.syncDiningTable(table);
      }
      for (const guest of party) {
        guest.status = "departing";
        guest.transitionSeconds = DINING_OUTDOOR_WALK_SECONDS;
      }
      this.dining.feedback = `Cả nhóm đã ra tới cửa quán; ${arrivedMembers.length} chỗ bàn ${party[0].tableId} đang cần dọn.`;
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
      this.dining.feedback = `Cả nhóm đã đi khỏi quán; chỗ bàn ${party[0].tableId} đã sẵn sàng sau khi dọn.`;
    }
    const activeOrder = this.dining.orders.find((order) => order.id === this.dining.activeOrderId);
    const firstQueuedOrder = this.dining.orders.find((order) => order.status === "queued");
    if (this.dining.activeOrderId && (!activeOrder
      || (activeOrder.status !== "cooking" && activeOrder.status !== "queued")
      || (activeOrder.status === "queued" && (activeOrder.assembly.length === 0 || firstQueuedOrder?.id !== activeOrder.id)))) {
      if (activeOrder?.status === "queued") activeOrder.assembly = [];
      this.dining.activeOrderId = null;
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
    if (this.dining.arrivalClock >= CUSTOMER_ARRIVAL_SECONDS + 4) {
      this.dining.arrivalClock = 0;
      this.arriveDiningParty();
    }
    if (this.serviceMode === "dining") {
      this.tickDiningConversation();
      this.advanceDiningDialogue();
    }
    if (this.hasStaff) {
      this.diningStaffClock += 1;
      if (this.diningStaffClock >= 3) {
        this.diningStaffClock = 0;
        this.helpDiningRoom();
      }
    }
  }

  private arriveDiningParty(): void {
    if (!this.inShift) return;
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
      .filter((entry) => entry.id <= unlockedTableCount)
      .filter((entry) => preferredSeatOrder(size).filter((index) => entry.seats[index].status === "empty").length >= size)
      .sort((a, b) => a.seats.filter((seat) => seat.guestId).length - b.seats.filter((seat) => seat.guestId).length || a.id - b.id)[0];
    let table = findTableForParty(partySize);

    // If there is no room for a full party, keep a group of at least two together.
    while (!table && partySize > 2) {
      partySize -= 1;
      table = findTableForParty(partySize);
    }
    if (!table) {
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
    const initialStatus: DiningGuestStatus = this.serviceMode === "street" ? "approaching" : "entering";
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
        transitionSeconds: initialStatus === "approaching"
          ? DINING_OUTDOOR_WALK_SECONDS
          : diningArrivalSeconds(table!.id) + memberIndex * 0.8,
      });
      this.dining.orders.push({
        id: `dining-order-${customer.id}`,
        guestId,
        partyId,
        tableId: table!.id,
        recipe: customer.recipe,
        status: "called",
        assembly: [],
        cookSeconds: 0,
        eatSeconds: 0,
      });
    });
    this.syncDiningTable(table);
    const partyName = party.type === "family" ? "Gia đình" : "Nhóm bạn";
    this.dining.feedback = `${partyName} ${partySize} người vào bàn ${table.id}: “${arrivalDialogue.text}”`;
  }

  private queueDiningDialogue(guestId: string, text: string, kind: DiningDialogueEvent["kind"]): void {
    const startsAt = Math.max(this.elapsedSeconds, this.diningDialogueAvailableAt);
    const event: DiningDialogueEvent = {
      id: ++this.diningDialogueId,
      guestId,
      text,
      kind,
      endsAt: startsAt + 3,
    };
    this.pendingDiningDialogues.push({ event, startsAt });
    this.diningDialogueAvailableAt = startsAt + 4;
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
      if (!guest || guest.status === "approaching" || guest.status === "entering" || guest.status === "leaving" || guest.status === "departing") continue;
      this.dining.dialogueEvent = next.event;
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
      queued: "chờ bếp",
      cooking: "đang nấu",
      ready: "đã sẵn sàng",
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
    this.cashCollection = {
      id: ++this.cashCollectionId,
      amount: revenue + tip,
      source: "dining",
      tableId: guest.tableId,
    };
    this.shiftRevenue += revenue;
    this.shiftTips += tip;
    this.shiftServed += partyOrders.length;
    this.totalServed += partyGuests.length;
    this.reputation += reputationEarned;
    this.shiftReputation += reputationEarned;
    this.dining.feedback = byStaff
      ? `Thu ngân đã thanh toán hóa đơn ${partyOrders.length} món bàn ${guest.tableId}: ${formatVndFromThousands(revenue)}.`
      : `Đã thu hóa đơn ${partyOrders.length} món: +${formatVndFromThousands(revenue + tip)}${tip > 0 ? ` (gồm ${formatVndFromThousands(tip)} tiền boa)` : ""}.`;
    this.persist();
    this.publish();
  }

  private serveDiningOrder(order: DiningOrder, guest: DiningGuest, byStaff: boolean): void {
    if (order.status !== "ready" || guest.status !== "waiting-food") return;
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

  private startDiningOrderCooking(order: DiningOrder): boolean {
    const firstQueuedOrder = this.dining.orders.find((entry) => entry.status === "queued");
    if (order.status !== "queued"
      || (this.dining.activeOrderId && this.dining.activeOrderId !== order.id)
      || (firstQueuedOrder && firstQueuedOrder.id !== order.id)
      || !this.hasRecipeStock(order.recipe)) return false;
    const recipe = RECIPES[order.recipe];
    for (const ingredient of recipe.ingredients) this.inventory[ingredient] -= 1;
    order.assembly = [...recipe.ingredients];
    order.status = "cooking";
    order.cookSeconds = 3;
    this.dining.activeOrderId = order.id;
    this.shiftIngredientCosts += getRecipeCost(order.recipe);
    this.persist();
    return true;
  }

  private helpDiningRoom(): void {
    const awaitingPayment = this.dining.guests.find((guest) => guest.status === "awaiting-payment");
    const payableOrder = awaitingPayment && this.dining.orders.find((order) => order.partyId === awaitingPayment.partyId && order.status === "delivered");
    const payableParty = awaitingPayment && this.dining.guests.filter((guest) => guest.partyId === awaitingPayment.partyId);
    const payablePartyOrders = awaitingPayment && this.dining.orders.filter((order) => order.partyId === awaitingPayment.partyId);
    if (awaitingPayment && payableOrder && payableParty?.every((guest) => guest.status === "awaiting-payment")
      && payablePartyOrders?.every((order) => order.status === "delivered")) {
      this.payDiningOrder(payableOrder, awaitingPayment, true);
      return;
    }

    const readyOrder = this.dining.orders.find((order) => order.status === "ready");
    const readyGuest = readyOrder && this.dining.guests.find((guest) => guest.id === readyOrder.guestId && guest.status === "waiting-food");
    if (readyOrder && readyGuest) {
      this.serveDiningOrder(readyOrder, readyGuest, true);
      return;
    }

    const queuedOrder = this.dining.orders.find((order) => order.status === "queued");
    if (queuedOrder && (!this.dining.activeOrderId || this.dining.activeOrderId === queuedOrder.id)) {
      if (this.hasRecipeStock(queuedOrder.recipe)) {
        if (!this.startDiningOrderCooking(queuedOrder)) return;
        this.dining.feedback = `Phụ bếp đang nấu món cho bàn ${queuedOrder.tableId}.`;
      } else {
        const missing = this.getMissingRecipeIngredients(queuedOrder.recipe).join(", ");
        this.dining.feedback = `Phiếu bàn ${queuedOrder.tableId} chưa thể bắt đầu: kho thiếu ${missing}. Phiếu vẫn chờ, nguyên liệu chưa bị trừ.`;
      }
      return;
    }

    const waitingGuest = this.dining.guests
      .filter((guest) => guest.status === "waiting-order")
      .sort((a, b) => a.patience - b.patience)
      .find((guest) => {
        const party = this.dining.guests.filter((member) => member.partyId === guest.partyId);
        const orders = this.dining.orders.filter((order) => order.partyId === guest.partyId);
        return party.length === guest.partySize
          && party.every((member) => member.status === "waiting-order")
          && orders.length === party.length
          && orders.every((order) => order.status === "called")
          && this.getMissingPartyIngredients(orders).length === 0;
      });
    const calledOrders = waitingGuest && this.dining.orders.filter((order) => order.partyId === waitingGuest.partyId && order.status === "called");
    if (waitingGuest && calledOrders?.length) {
      for (const order of calledOrders) order.status = "queued";
      for (const member of this.dining.guests.filter((entry) => entry.partyId === waitingGuest.partyId)) member.status = "waiting-food";
      this.dining.feedback = `Phụ bếp đã nhận ${calledOrders.length} món của bàn ${waitingGuest.tableId}.`;
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
    return this.getMissingRecipeIngredients(recipeId).length === 0;
  }

  private getMissingRecipeIngredients(recipeId: RecipeId): string[] {
    return RECIPES[recipeId].ingredients
      .filter((ingredient) => this.inventory[ingredient] <= 0)
      .map((ingredient) => INGREDIENTS.find((entry) => entry.id === ingredient)?.name ?? ingredient);
  }

  private getMissingPartyIngredients(orders: DiningOrder[]): string[] {
    const required = new Map<IngredientId, number>();
    const incomingOrderIds = new Set(orders.map((order) => order.id));
    const reservedOrders = this.dining.orders.filter((order) => order.status === "queued" && !incomingOrderIds.has(order.id));
    for (const order of [...reservedOrders, ...orders]) {
      for (const ingredient of RECIPES[order.recipe].ingredients) {
        required.set(ingredient, (required.get(ingredient) ?? 0) + 1);
      }
    }
    return [...required.entries()]
      .filter(([ingredient, amount]) => this.inventory[ingredient] < amount)
      .map(([ingredient, amount]) => {
        const name = INGREDIENTS.find((item) => item.id === ingredient)?.name ?? ingredient;
        const shortfall = amount - this.inventory[ingredient];
        return `${name} (thiếu ${shortfall})`;
      });
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
    this.cashCollection = {
      id: ++this.cashCollectionId,
      amount: recipe.salePrice + tip,
      source: "street",
    };
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
      if (saved.version !== 1) return;

      this.storeName = typeof saved.storeName === "string" ? normalizeStoreName(saved.storeName) : "";
      this.coins = Math.max(0, saved.coins);
      this.reputation = Math.max(0, saved.reputation);
      this.cartLevel = Math.max(1, Math.min(MAX_CART_LEVEL, saved.cartLevel));
      this.hasStaff = saved.hasStaff;
      this.inventory = { ...createStartingInventory(), ...saved.inventory };
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
          this.offlineNotice = `Phụ bếp đã bán giúp bạn ${elapsedMinutes} phút, mang về ${formatVndFromThousands(offlineCoins)}.`;
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
}
