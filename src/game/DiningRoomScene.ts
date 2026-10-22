import Phaser from "phaser";
import roomShellUrl from "../../assets/interior-v2/modular-pack-v1/tavern_room_shell_base.png?url";
import shelfUrl from "../../assets/interior-v2/modular-pack-v1/spice_shelf.png?url";
import staircaseUrl from "../../assets/interior-v2/modular-pack-v1/staircase_wood.png?url";
import tableUrl from "../../assets/interior-v2/modular-pack-v2/dining_set_table_4stools_stove-v2.png?url";
import counterUrl from "../../assets/interior-v2/modular-pack-v1/reception_counter_clean.png?url";
import registerUrl from "../../assets/interior-v2/modular-pack-v1/cash_register_compact.png?url";
import ledgerUrl from "../../assets/interior-v2/modular-pack-v1/order_ledger.png?url";
import { DISH_ART_URLS } from "./dishArt";
import { CUSTOMER_TYPES, PLAYABLE_RECIPE_IDS, RECIPES, type CustomerType, type RecipeId } from "./data";
import { GameStore, getDiningTableCapacity, type DiningDialogueEvent, type DiningGuest, type DiningOrder, type GameSnapshot } from "./GameStore";
import { diningArrivalSeconds, diningTravelSeconds } from "./diningCharacters";

type TablePoint = { x: number; y: number; seats: { x: number; y: number }[] };
type GameAtlas = { frame_layout: { cellWidth: number; cellHeight: number; rows: Record<string, { x: number; y: number; w: number; h: number }[]> }; animation: { rows: Record<string, { fps: number; loop: boolean }> }; anchors: { standingFeet: { x: number; y: number }; seatedHip: { x: number; y: number } } };
type GuestMotion = { status: DiningGuest["status"]; startedAt: number };
type RoomTexture = "shell" | "shelf" | "staircase" | "table" | "counter" | "register" | "ledger";
type RoomPart = {
  slot: string;
  x: number;
  y: number;
  scale?: number;
  depth: number;
  crop?: { x: number; y: number; width: number; height: number };
  texture: RoomTexture;
};

const ROOM_WIDTH = 576;
const ROOM_HEIGHT = 1280;
const SERVICE_COUNTER_TOP_Y = 1000;
const GUEST_COUNTER_CLEARANCE = 40;
// Threshold of the open doorway at the top of tavern_room_shell_base.png.
const ROOM_ENTRY_DOOR = { x: ROOM_WIDTH / 2, y: 232 } as const;
const DINING_WALK_FPS = 3;
const DINING_EAT_ANIMATION_TIME_SCALE = 0.55;
const TABLE_ART_SCALE = 0.17;
const TABLE_ART_HEIGHT = 1226 * TABLE_ART_SCALE;
// Keep guests close to the atlas's intended proportions relative to the table art.
const GUEST_VISUAL_SCALE = 1.15;
const TABLE_CENTER = { x: 109.1, y: 93.5 } as const;
// Origins for the six tables in the dining-room art.
const TABLE_ORIGINS = [{ x: 24, y: 313 }, { x: 260, y: 313 }, { x: 24, y: 550 }, { x: 260, y: 550 }, { x: 24, y: 787 }, { x: 260, y: 787 }] as const;
// Seating anchors measured from the full four-stool table art.
const SEAT_OFFSETS = [{ x: 109.3, y: 28.9 }, { x: 181.1, y: 99.5 }, { x: 109.1, y: 157.3 }, { x: 37.4, y: 99.5 }] as const;
// Keep Mai Linh's feet inside the narrow aisle between the two table columns.
// A small final step makes her approach the correct side without entering the
// table or stool footprint.
const SERVICE_TABLE_SIDE_STEP = 14;
const ROOM_TEXTURES: Record<RoomTexture, string> = {
  shell: roomShellUrl,
  shelf: shelfUrl,
  staircase: staircaseUrl,
  table: tableUrl,
  counter: counterUrl,
  register: registerUrl,
  ledger: ledgerUrl,
};
const DINING_FOOD_TEXTURES = Object.fromEntries(PLAYABLE_RECIPE_IDS.map((id) => [id, {
  key: `dining-food-${id}`,
  url: DISH_ART_URLS[id],
}])) as Record<RecipeId, { key: string; url: string }>;
// Keep one fixed starter room until matching upgrade art is ready.
const ROOM_PARTS: RoomPart[] = [
  { slot: "shell", x: 0, y: 0, depth: 0, texture: "shell" },
  { slot: "shelf", x: 4, y: 20, depth: 2, texture: "shelf" },
  { slot: "staircase", x: 440, y: 24, scale: 0.85, depth: 2, texture: "staircase" },
  ...TABLE_ORIGINS.map((origin, index) => ({ slot: `table-${index + 1}`, x: origin.x, y: origin.y, scale: TABLE_ART_SCALE, depth: 4, texture: "table" as const })),
  // Re-draw the near half above side/back guests. This restores depth for the original combined table-and-stools art.
  ...TABLE_ORIGINS.map((origin, index) => ({
    slot: `table-front-${index + 1}`,
    x: origin.x,
    y: origin.y,
    scale: TABLE_ART_SCALE,
    depth: 5,
    crop: { x: 370, y: 350, width: 550, height: 460 },
    texture: "table" as const,
  })),
  { slot: "counter", x: -7, y: 1000, scale: 0.9, depth: 5, texture: "counter" },
  { slot: "register", x: 55, y: 993, depth: 6, texture: "register" },
  { slot: "ledger", x: 133, y: 1023, depth: 6, texture: "ledger" },
];
const SEAT_DIRECTIONS = ["down", "side", "up", "side"] as const;
const SIDE_SEAT_INSET = 10;
const DINING_ATLAS_URLS = import.meta.glob("../../assets/characters/sprite-gen-dining/*/game-atlas.png", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const DINING_ATLAS_MANIFESTS = import.meta.glob("../../assets/characters/sprite-gen-dining/*/game-manifest.json", { eager: true, import: "default" }) as Record<string, GameAtlas>;

const GUEST_COLORS: Record<CustomerType, { shirt: number; hair: number }> = {
  student: { shirt: 0x4d8fb0, hair: 0x292532 },
  office: { shirt: 0xd2ddd0, hair: 0x372b24 },
  shopper: { shirt: 0xd88354, hair: 0x392820 },
  tourist: { shirt: 0x779575, hair: 0x3d3028 },
};

export class DiningRoomScene extends Phaser.Scene {
  private readonly store: GameStore;
  private devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
  private roomPieces: { part: RoomPart; image: Phaser.GameObjects.Image }[] = [];
  private guestArt?: Phaser.GameObjects.Graphics;
  private guestSprites = new Map<string, Phaser.GameObjects.Sprite>();
  private diningFood = new Map<string, Phaser.GameObjects.Image | Phaser.GameObjects.Graphics>();
  private tableTaskLabels = new Map<number, Phaser.GameObjects.Text>();
  private tableTaskBackgrounds = new Map<number, Phaser.GameObjects.Graphics>();
  private guestMotion = new Map<string, GuestMotion>();
  private guestEntryBubbles = new Map<string, Phaser.GameObjects.Container>();
  private diningDialogueBubble?: Phaser.GameObjects.Container;
  private diningDialogueBubbleId: number | null = null;
  private shiftPausedAt: number | null = null;
  private requestedCharacters = new Set<string>();
  private tableZones: Phaser.GameObjects.Zone[] = [];
  private seatZones: Phaser.GameObjects.Zone[] = [];
  private tablePoints: TablePoint[] = [];
  private logicalWidth = 0;
  private logicalHeight = 0;
  private roomMapWidth = 0;
  private roomMapHeight = 0;
  private roomMapLeft = 0;
  private unsubscribe?: () => void;
  private snapshot?: GameSnapshot;
  private interactionEnabled = true;

  constructor(store: GameStore) {
    super("dining-room");
    this.store = store;
  }

  setDevicePixelRatio(value: number): void {
    this.devicePixelRatio = Math.max(1, value || 1);
    if (this.sys.isActive()) {
      this.cameras.main.setZoom(this.devicePixelRatio);
      this.layout();
    }
  }

  setInteractionEnabled(enabled: boolean): void {
    this.interactionEnabled = enabled;
    if (this.sys.isActive()) this.input.enabled = enabled;
  }

  preload(): void {
    for (const [key, url] of Object.entries(ROOM_TEXTURES)) this.load.image(`dining-${key}`, url);
    for (const { key, url } of Object.values(DINING_FOOD_TEXTURES)) this.load.image(key, url);
  }

  create(): void {
    this.cameras.main.setZoom(this.devicePixelRatio);
    this.input.enabled = this.interactionEnabled;
    this.cameras.main.setBackgroundColor(0x302920);
    this.snapshot = this.store.getSnapshot();
    this.roomPieces = ROOM_PARTS.map((part) => ({
      part,
      image: this.add.image(0, 0, `dining-${part.texture}`)
        .setOrigin(0, 0)
        .setDepth(part.depth),
    }));
    this.registerGuestAnimations();
    this.guestArt = this.add.graphics().setDepth(6);
    this.scale.on("resize", this.layout, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.unsubscribe?.();
      this.unsubscribe = undefined;
      this.tableZones.forEach((zone) => zone.destroy());
      this.tableZones = [];
      this.seatZones.forEach((zone) => zone.destroy());
      this.seatZones = [];
      this.guestSprites.forEach((sprite) => sprite.destroy());
      this.guestSprites.clear();
      this.diningFood.forEach((sprite) => sprite.destroy());
      this.diningFood.clear();
      this.tableTaskLabels.forEach((label) => label.destroy());
      this.tableTaskLabels.clear();
      this.tableTaskBackgrounds.forEach((background) => background.destroy());
      this.tableTaskBackgrounds.clear();
      this.guestEntryBubbles.forEach((bubble) => bubble.destroy());
      this.guestEntryBubbles.clear();
      this.diningDialogueBubble?.destroy();
      this.diningDialogueBubble = undefined;
      this.diningDialogueBubbleId = null;
      this.guestMotion.clear();
      this.requestedCharacters.forEach((characterId) => {
        const key = `dining-npc-${characterId}`;
        if (this.textures.exists(key)) this.textures.remove(key);
      });
      this.requestedCharacters.clear();
      this.roomPieces = [];
      this.scale.off("resize", this.layout, this);
    });
    this.unsubscribe = this.store.subscribe((snapshot) => {
      this.snapshot = snapshot;
      this.renderGuests();
    });
    this.layout();
  }

  private getLogicalWidth(): number {
    return this.scale.width / this.devicePixelRatio;
  }

  private getLogicalHeight(): number {
    return this.scale.height / this.devicePixelRatio;
  }

  private layout(): void {
    if (!this.roomPieces.length || !this.guestArt) return;
    this.logicalWidth = this.getLogicalWidth();
    this.logicalHeight = this.getLogicalHeight();
    this.roomMapHeight = this.logicalHeight;
    this.roomMapWidth = Math.min(this.logicalWidth, this.roomMapHeight * ROOM_WIDTH / ROOM_HEIGHT);
    this.roomMapLeft = (this.logicalWidth - this.roomMapWidth) / 2;
    const worldLeft = Math.min(0, this.roomMapLeft);
    const worldWidth = Math.max(this.logicalWidth, this.roomMapLeft + this.roomMapWidth) - worldLeft;
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    for (const { part, image } of this.roomPieces) {
      const source = this.textures.get(image.texture.key).getSourceImage();
      const scale = roomScale * (part.scale ?? 1);
      image
        .setPosition(this.roomMapLeft + part.x * roomScale, part.y * roomScale)
        .setDisplaySize(source.width * scale, source.height * scale);
      if (part.crop) image.setCrop(part.crop.x, part.crop.y, part.crop.width, part.crop.height);
    }
    this.cameras.main.setBounds(worldLeft, 0, worldWidth, this.roomMapHeight);
    this.tablePoints = TABLE_ORIGINS.map((origin) => ({
      x: this.roomMapLeft + (origin.x + TABLE_CENTER.x) * roomScale,
      y: (origin.y + TABLE_CENTER.y) * roomScale,
      seats: SEAT_OFFSETS.map((seat) => ({
        x: this.roomMapLeft + (origin.x + seat.x) * roomScale,
        y: (origin.y + seat.y) * roomScale,
      })),
    }));
    this.createTableTargets();
    this.renderGuests();
    if (this.snapshot?.dining.selectedGuestId) {
      this.focusDiningTable(this.snapshot.dining.selectedTableId ?? 1, false);
    } else {
      this.cameras.main.setScroll(0, 0);
    }
  }

  focusDiningTable(tableId: number, animate = true): void {
    const point = this.tablePoints[Math.max(0, Math.min(this.tablePoints.length - 1, Math.trunc(tableId) - 1))];
    if (!point || this.logicalWidth <= 0) return;
    const minScroll = Math.min(0, this.roomMapLeft);
    const maxScroll = Math.max(0, this.roomMapLeft + this.roomMapWidth - this.logicalWidth);
    const targetX = this.roomMapWidth <= this.logicalWidth * 1.2
      ? 0
      : Phaser.Math.Clamp(point.x - this.logicalWidth / 2, minScroll, maxScroll);
    const maxScrollY = Math.max(0, this.roomMapHeight - this.logicalHeight);
    const targetY = Phaser.Math.Clamp(point.y - this.logicalHeight * 0.34, 0, maxScrollY);
    if (!animate || !this.sys.isActive()) {
      this.cameras.main.setScroll(targetX, targetY);
      return;
    }
    this.tweens.killTweensOf(this.cameras.main);
    this.tweens.add({ targets: this.cameras.main, scrollX: targetX, scrollY: targetY, duration: 260, ease: "Sine.Out" });
  }

  getTableScreenPoint(tableId: number): { x: number; y: number } | null {
    const point = this.tablePoints[Math.trunc(tableId) - 1];
    return point ? this.worldToFramePoint(point) : null;
  }

  getServiceCounterScreenPoint(): { x: number; y: number } | null {
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    return this.worldToFramePoint({
      x: this.roomMapLeft + 150 * roomScale,
      y: 1032 * roomScale,
    });
  }

  getServiceCounterStaffScreenPoint(): { x: number; y: number } | null {
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    return this.worldToFramePoint({
      // One home anchor for both the waiting sprite and every service trip.
      x: this.roomMapLeft + 240 * roomScale,
      y: 960 * roomScale,
    });
  }

  getStaffWorkstationScreenPoint(role: string, roleIndex = 0): { x: number; y: number } | null {
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    const logicalPoint = role === "server"
      ? { x: 240 + roleIndex * 38, y: 960 }
      : role === "cashier"
        ? { x: 426 + roleIndex * 34, y: 960 }
        : role === "promoter"
          ? { x: 414 + roleIndex * 34, y: 330 }
          : { x: 506 + roleIndex * 22, y: 292 };
    return this.worldToFramePoint({
      x: this.roomMapLeft + logicalPoint.x * roomScale,
      y: logicalPoint.y * roomScale,
    });
  }

  getStaffEntranceRouteScreenPoints(role: string, roleIndex = 0): { x: number; y: number }[] | null {
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    const door = { x: ROOM_ENTRY_DOOR.x, y: ROOM_ENTRY_DOOR.y };
    const greetingPoint = { x: ROOM_ENTRY_DOOR.x, y: 318 };
    const workstation = role === "server"
      ? { x: 240 + roleIndex * 38, y: 960 }
      : role === "cashier"
        ? { x: 426 + roleIndex * 34, y: 960 }
        : role === "promoter"
          ? { x: 414 + roleIndex * 34, y: 330 }
          : { x: 506 + roleIndex * 22, y: 292 };
    const logicalRoute = role === "server" || role === "cashier"
      ? [door, greetingPoint, { x: ROOM_ENTRY_DOOR.x, y: 910 }, workstation]
      : role === "promoter"
        ? [door, greetingPoint, workstation]
        : [door, greetingPoint, { x: 450, y: 318 }, workstation];
    const route = logicalRoute.map((point) => this.worldToFramePoint({
      x: this.roomMapLeft + point.x * roomScale,
      y: point.y * roomScale,
    }));
    return route.every((point): point is { x: number; y: number } => Boolean(point)) ? route : null;
  }

  getServiceTableApproachScreenPoint(tableId: number): { x: number; y: number } | null {
    const route = this.getServiceTableRouteScreenPoints(tableId);
    return route?.[route.length - 1] ?? null;
  }

  getServiceTableRouteScreenPoints(tableId: number): { x: number; y: number }[] | null {
    const origin = TABLE_ORIGINS[Math.trunc(tableId) - 1];
    if (!origin) return null;
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    const home = { x: 240, y: 960 };
    // Follow a simple service grid: leave the counter, walk along the clear
    // center aisle, then take one short step toward the requested table.
    const leftTableRightSeatX = TABLE_ORIGINS[0].x + SEAT_OFFSETS[1].x;
    const rightTableLeftSeatX = TABLE_ORIGINS[1].x + SEAT_OFFSETS[3].x;
    const aisleX = (leftTableRightSeatX + rightTableLeftSeatX) / 2;
    const tableIsLeft = Math.trunc(tableId) % 2 === 1;
    const rowIndex = Math.floor((Math.trunc(tableId) - 1) / 2);
    const adjacentRowOrigin = rowIndex < 2
      ? TABLE_ORIGINS[(rowIndex + 1) * 2]!
      : TABLE_ORIGINS[(rowIndex - 1) * 2]!;
    // Stand in the horizontal gap between rows. For the last row, reuse the
    // gap above it so Mai Linh never walks into the reception counter.
    const stopY = rowIndex < 2
      ? (origin.y + TABLE_ART_HEIGHT + adjacentRowOrigin.y) / 2
      : (adjacentRowOrigin.y + TABLE_ART_HEIGHT + origin.y) / 2;
    const serviceX = aisleX + (tableIsLeft ? -SERVICE_TABLE_SIDE_STEP : SERVICE_TABLE_SIDE_STEP);
    const logicalRoute = [
      home,
      { x: aisleX, y: home.y },
      { x: aisleX, y: stopY },
      { x: serviceX, y: stopY },
    ];
    const route = logicalRoute.map((point) => this.worldToFramePoint({
      x: this.roomMapLeft + point.x * roomScale,
      y: point.y * roomScale,
    }));
    return route.every((point): point is { x: number; y: number } => Boolean(point)) ? route : null;
  }

  private worldToFramePoint(point: { x: number; y: number }): { x: number; y: number } | null {
    const canvas = this.game?.canvas;
    if (!canvas || !this.sys?.isActive()) return null;
    const frame = canvas.closest<HTMLElement>(".game-frame");
    if (!frame) return null;

    const canvasBounds = canvas.getBoundingClientRect();
    const frameBounds = frame.getBoundingClientRect();
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    if (roomScale <= 0) return null;
    const roomX = (point.x - this.roomMapLeft) / roomScale;
    const roomY = point.y / roomScale;
    const cssRoomWidth = Math.min(canvasBounds.width, canvasBounds.height * ROOM_WIDTH / ROOM_HEIGHT);
    const cssRoomLeft = (canvasBounds.width - cssRoomWidth) / 2;
    // DOM actors sit over a high-DPI Phaser canvas. Convert through the fixed
    // 576x1280 room coordinates instead of camera/backing-store pixels so the
    // route stays locked to the rendered aisles at every browser zoom level.
    return {
      x: canvasBounds.left - frameBounds.left + cssRoomLeft + roomX / ROOM_WIDTH * cssRoomWidth,
      y: canvasBounds.top - frameBounds.top + roomY / ROOM_HEIGHT * canvasBounds.height,
    };
  }

  private createTableTargets(): void {
    this.tableZones.forEach((zone) => zone.destroy());
    this.tableZones = [];
    this.seatZones.forEach((zone) => zone.destroy());
    this.seatZones = [];
    this.tablePoints.forEach((point, index) => {
      const roomScale = this.roomMapWidth / ROOM_WIDTH;
      const width = 104 * roomScale;
      const height = 78 * roomScale;
      const unlocked = index < getDiningTableCapacity();
      const zone = this.add.zone(point.x, point.y, width, height).setDepth(8);
      if (unlocked) zone.setInteractive();
      else zone.setVisible(false);
      zone.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
        if (Math.hypot(pointer.x - pointer.downX, pointer.y - pointer.downY) > 16 * this.devicePixelRatio) return;
        this.store.selectDiningTable(index + 1);
        this.focusDiningTable(index + 1);
      });
      this.tableZones.push(zone);
      point.seats.forEach((seat, seatIndex) => {
        const seatZone = this.add.zone(seat.x, seat.y - 38 * roomScale, 58 * roomScale, 84 * roomScale).setDepth(9);
        if (unlocked) seatZone.setInteractive();
        else seatZone.setVisible(false);
        seatZone.on(Phaser.Input.Events.POINTER_UP, (
          pointer: Phaser.Input.Pointer,
          _localX: number,
          _localY: number,
          event: Phaser.Types.Input.EventData,
        ) => {
          if (Math.hypot(pointer.x - pointer.downX, pointer.y - pointer.downY) > 16 * this.devicePixelRatio) return;
          // Chairs are visual seating targets, not controls. Keep an invisible
          // input zone so a chair tap cannot fall through to the table target.
          event.stopPropagation();
        });
        this.seatZones.push(seatZone);
      });
    });
  }

  private registerGuestAnimations(): void {
    for (const [path, manifest] of Object.entries(DINING_ATLAS_MANIFESTS)) {
      const id = path.split("/").at(-2);
      if (!id) continue;
      const key = `dining-npc-${id}`;
      if (!this.textures.exists(key)) continue;
      const texture = this.textures.get(key);
      for (const [state, rectangles] of Object.entries(manifest.frame_layout.rows)) {
        // The generated up-facing idle row is standing art; use a true seated back-view frame instead.
        const sourceRectangles = state === "up_seated_idle" ? [manifest.frame_layout.rows.up_eat[0]] : rectangles;
        sourceRectangles.forEach((rect, index) => {
          const frame = `${state}-${index}`;
          if (!texture.has(frame)) texture.add(frame, 0, rect.x, rect.y, rect.w, rect.h);
        });
        const animationKey = `${key}-${state}`;
        if (this.anims.exists(animationKey)) continue;
        const animation = manifest.animation.rows[state];
        // Frame 0 in these idle rows is still the settling pose, which makes seated guests pop upright on each loop.
        const firstAnimationFrame = state.endsWith("_seated_idle") && sourceRectangles.length > 1 ? 1 : 0;
        this.anims.create({
          key: animationKey,
          frames: sourceRectangles.slice(firstAnimationFrame).map((_, index) => ({ key, frame: `${state}-${index + firstAnimationFrame}` })),
          frameRate: state.endsWith("_walk") ? Math.min(animation?.fps ?? 5, DINING_WALK_FPS) : animation?.fps ?? 5,
          repeat: animation?.loop ? -1 : 0,
        });
      }
    }
  }

  private requestGuestAtlas(characterId: string): void {
    const key = `dining-npc-${characterId}`;
    if (this.textures.exists(key)) {
      this.requestedCharacters.add(characterId);
      return;
    }
    if (this.requestedCharacters.has(characterId)) return;
    const path = Object.keys(DINING_ATLAS_URLS).find((entry) => entry.includes(`/${characterId}/`));
    if (!path) return;
    this.requestedCharacters.add(characterId);
    this.load.once(`filecomplete-image-${key}`, () => {
      if (!this.sys.isActive() || !this.snapshot?.dining.guests.some((guest) => guest.characterId === characterId)) {
        this.textures.remove(key);
        this.requestedCharacters.delete(characterId);
        return;
      }
      this.registerGuestAnimations();
      this.renderGuests();
    });
    this.load.image(key, DINING_ATLAS_URLS[path]);
    if (!this.load.isLoading()) this.load.start();
  }

  update(time: number): void {
    const snapshot = this.snapshot;
    if (!snapshot) return;
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    for (const [tableId, label] of this.tableTaskLabels) {
      const background = this.tableTaskBackgrounds.get(tableId);
      const baseY = label.getData("orderHintBaseY") as number | undefined;
      const isOrderHint = label.getData("orderHintActive") === true && baseY !== undefined;
      const bouncePhase = (time % 2_200) / 2_200 * Math.PI * 2;
      const bounceOffset = isOrderHint ? Math.max(0, Math.sin(bouncePhase)) * 1.5 * roomScale : 0;
      if (baseY !== undefined) label.setY(baseY - bounceOffset);
      background?.setY(-bounceOffset);
    }
    const hasGuestExitMotion = snapshot.dining.guests.some((guest) => guest.status === "entering" || guest.status === "leaving");
    if (!snapshot.inShift && !hasGuestExitMotion) {
      this.shiftPausedAt ??= time;
      return;
    }
    if (this.shiftPausedAt !== null) {
      for (const motion of this.guestMotion.values()) {
        motion.startedAt += Math.max(0, time - Math.max(this.shiftPausedAt, motion.startedAt));
      }
      this.shiftPausedAt = null;
    }
    const door = {
      x: this.roomMapLeft + ROOM_ENTRY_DOOR.x * roomScale,
      y: ROOM_ENTRY_DOOR.y * roomScale,
    };
    for (const guest of snapshot.dining.guests) {
      const sprite = this.guestSprites.get(guest.id);
      const target = this.tablePoints[guest.tableId - 1]?.seats[guest.seatIndex];
      const motion = this.guestMotion.get(guest.id);
      if (!sprite || !target || !motion) continue;
      if (guest.status === "approaching" || guest.status === "departing") {
        sprite.setVisible(false);
        this.removeGuestEntryBubble(guest.id);
        continue;
      }
      const direction = SEAT_DIRECTIONS[guest.seatIndex];
      if (guest.status === "entering" || guest.status === "leaving") {
        sprite.setCrop(0, 0, 96, 154);
      }
      const seatedTarget = guest.seatIndex === 2
        ? target
        : guest.seatIndex === 1
          ? { x: target.x - SIDE_SEAT_INSET * roomScale, y: target.y }
          : guest.seatIndex === 3
            ? { x: target.x + SIDE_SEAT_INSET * roomScale, y: target.y }
            : target;
      // Side source sprites face right: mirror the right-side seat so it faces left toward the table.
      sprite.setFlipX(guest.seatIndex === 1);
      const elapsed = Math.max(0, time - motion.startedAt);
      const travelSeconds = guest.status === "entering" ? diningArrivalSeconds(guest.tableId) : diningTravelSeconds(guest.tableId);
      const duration = travelSeconds * 1000;
      const poseFraction = 700 / duration;
      const entryOffset = (guest.partyMemberIndex - (guest.partySize - 1) / 2) * 13 * roomScale;
      const entryDoor = { x: door.x + entryOffset, y: door.y };
      const path = this.guestPath(guest, seatedTarget, entryDoor, roomScale);
      if (guest.status === "entering") {
        const delayedElapsed = Math.max(0, elapsed - guest.arrivalDelaySeconds * 1000);
        const progress = Math.min(1, delayedElapsed / duration);
        if (progress < 1 - poseFraction) {
          const step = this.positionOnPath(path, progress / (1 - poseFraction));
          sprite.setPosition(step.x, step.y);
          sprite.setFlipX(step.direction === "side" ? step.facingLeft : false);
          this.setGuestOrigin(sprite, guest.characterId, false);
          this.playGuestAnimation(sprite, guest.characterId, `${step.direction}_walk`);
        } else {
          sprite.setPosition(seatedTarget.x, seatedTarget.y);
          this.setGuestOrigin(sprite, guest.characterId, true);
          this.playGuestAnimation(sprite, guest.characterId, guest.seatIndex === 2 ? `${direction}_seated_idle` : `${direction}_sit`);
        }
      } else if (guest.status === "leaving") {
        const progress = Math.min(1, elapsed / duration);
        if (progress < poseFraction) {
          sprite.setPosition(seatedTarget.x, seatedTarget.y);
          this.setGuestOrigin(sprite, guest.characterId, true);
          this.playGuestAnimation(sprite, guest.characterId, `${direction}_stand`);
        } else {
          const step = this.positionOnPath([...path].reverse(), (progress - poseFraction) / (1 - poseFraction));
          sprite.setPosition(step.x, step.y);
          sprite.setFlipX(step.direction === "side" ? step.facingLeft : false);
          this.setGuestOrigin(sprite, guest.characterId, false);
          this.playGuestAnimation(sprite, guest.characterId, `${step.direction}_walk`);
        }
      } else {
        sprite.setPosition(seatedTarget.x, seatedTarget.y);
        sprite.setCrop(0, 0, 96, 154);
        this.setGuestOrigin(sprite, guest.characterId, true);
        // Side and back eating rows contain seated poses; the front eating row is a standing pose.
        const hasSeatedEatingPose = guest.seatIndex !== 0;
        const animationState = guest.status === "eating" && hasSeatedEatingPose ? `${direction}_eat` : `${direction}_seated_idle`;
        this.playGuestAnimation(sprite, guest.characterId, animationState);
      }
      this.updateGuestEntryBubble(guest, sprite, elapsed, roomScale);
    }
  }

  private updateGuestEntryBubble(guest: DiningGuest, sprite: Phaser.GameObjects.Sprite, elapsed: number, roomScale: number): void {
    const bubble = this.guestEntryBubbles.get(guest.id);
    if (!bubble) return;
    const speechStart = guest.arrivalDelaySeconds * 1_000;
    const speaking = guest.status === "entering"
      && elapsed >= speechStart
      && elapsed < speechStart + 2_600;
    if (!speaking) {
      bubble.setVisible(false);
      return;
    }
    const speakerBounds = sprite.getBounds();
    this.positionSpeechBubble(
      bubble,
      speakerBounds.centerX,
      speakerBounds.top - 3 * roomScale,
      roomScale,
    );
  }

  private guestPath(guest: DiningGuest, seat: { x: number; y: number }, door: { x: number; y: number }, scale: number): { x: number; y: number }[] {
    const table = TABLE_ORIGINS[guest.tableId - 1];
    const isOuter = (guest.tableId % 2 === 1 && guest.seatIndex === 3) || (guest.tableId % 2 === 0 && guest.seatIndex === 1);
    const tableApproachY = table.y + (guest.seatIndex === 0 || isOuter ? 45 : guest.seatIndex === 2 ? 224 : 165);
    // The lower tables' south seats used to route at y=1011, through the counter at y=1000.
    // Keep their approach in the clear aisle above the counter instead.
    const routeY = guest.tableId > 4 && guest.seatIndex === 2
      ? Math.min(tableApproachY, SERVICE_COUNTER_TOP_Y - GUEST_COUNTER_CLEARANCE)
      : tableApproachY;
    return [door, { x: door.x, y: routeY * scale }, { x: seat.x, y: routeY * scale }, { x: seat.x, y: seat.y + 32 * scale }];
  }

  private positionOnPath(path: { x: number; y: number }[], progress: number): { x: number; y: number; direction: "down" | "side" | "up"; facingLeft: boolean } {
    const distances = path.slice(1).map((point, index) => Phaser.Math.Distance.Between(path[index].x, path[index].y, point.x, point.y));
    const total = distances.reduce((sum, distance) => sum + distance, 0);
    let remaining = Phaser.Math.Clamp(progress, 0, 1) * total;
    for (let index = 0; index < distances.length; index += 1) {
      const segment = distances[index];
      if (remaining > segment && index < distances.length - 1) { remaining -= segment; continue; }
      const from = path[index];
      const to = path[index + 1];
      const amount = segment ? Math.min(1, remaining / segment) : 1;
      return {
        x: Phaser.Math.Linear(from.x, to.x, amount),
        y: Phaser.Math.Linear(from.y, to.y, amount),
        direction: Math.abs(to.x - from.x) > Math.abs(to.y - from.y) ? "side" : to.y > from.y ? "down" : "up",
        facingLeft: to.x < from.x,
      };
    }
    return { ...path[path.length - 1], direction: "up", facingLeft: false };
  }

  private setGuestOrigin(sprite: Phaser.GameObjects.Sprite, characterId: string, seated: boolean): void {
    if (sprite.texture.key !== `dining-npc-${characterId}`) return;
    const path = Object.keys(DINING_ATLAS_MANIFESTS).find((entry) => entry.includes(`/${characterId}/`));
    const manifest = path && DINING_ATLAS_MANIFESTS[path];
    if (!manifest) return;
    const anchor = seated ? manifest.anchors.seatedHip : manifest.anchors.standingFeet;
    sprite.setOrigin(anchor.x / manifest.frame_layout.cellWidth, anchor.y / manifest.frame_layout.cellHeight);
  }

  private playGuestAnimation(sprite: Phaser.GameObjects.Sprite, characterId: string, state: string): void {
    const key = `dining-npc-${characterId}-${state}`;
    if (this.anims.exists(key) && sprite.anims.currentAnim?.key !== key) sprite.play(key);
    sprite.anims.timeScale = state.endsWith("_eat") ? DINING_EAT_ANIMATION_TIME_SCALE : 1;
  }

  private renderGuests(): void {
    const graphics = this.guestArt;
    const snapshot = this.snapshot;
    if (!graphics || !snapshot) return;
    graphics.clear();
    const unlockedTableCount = getDiningTableCapacity();
    this.tableZones.forEach((zone, index) => {
      const unlocked = index < unlockedTableCount;
      zone.setVisible(unlocked);
      if (unlocked && !zone.input) zone.setInteractive();
      else if (!unlocked && zone.input) zone.disableInteractive();
    });
    this.seatZones.forEach((zone, index) => {
      const unlocked = Math.floor(index / 4) < unlockedTableCount;
      zone.setVisible(unlocked);
      if (unlocked && !zone.input) zone.setInteractive();
      else if (!unlocked && zone.input) zone.disableInteractive();
    });
    const livingGuestIds = new Set<string>();
    snapshot.dining.tables.forEach((table, index) => {
      if (index >= unlockedTableCount) return;
      const point = this.tablePoints[index];
      if (!point) return;
      table.seats.forEach((seat, seatIndex) => {
        const seatPoint = point.seats[seatIndex];
        const selected = snapshot.dining.selectedTableId === table.id && snapshot.dining.selectedSeatIndex === seatIndex;
        if (selected) {
          graphics.lineStyle(2, 0xf0c982, 0.88).strokeEllipse(seatPoint.x, seatPoint.y - 6, this.roomMapWidth * 0.085, this.roomMapWidth * 0.035);
        }
        const guest = seat.guestId ? snapshot.dining.guests.find((entry) => entry.id === seat.guestId) : undefined;
        if (!guest) return;
        livingGuestIds.add(guest.id);
        // Load the matching atlas during the walk outside so it is ready at the doorway.
        this.requestGuestAtlas(guest.characterId);
        if (guest.status === "approaching" || guest.status === "departing") {
          this.guestSprites.get(guest.id)?.setVisible(false);
          this.removeGuestEntryBubble(guest.id);
          return;
        }
        if (guest.status === "entering" && guest.arrivalDialogue) this.ensureGuestEntryBubble(guest);
        else this.removeGuestEntryBubble(guest.id);
        if (!this.drawGuestSprite(seatPoint, guest)) this.drawGuest(graphics, seatPoint, guest);
        const orderStillNeedsWaiter = snapshot.dining.orders.some((order) => order.guestId === guest.id && order.status === "called");
        if (selected && guest.status === "waiting-order" && orderStillNeedsWaiter) {
          const bubbleX = seatPoint.x + this.roomMapWidth * 0.018;
          const bubbleY = seatPoint.y - this.roomMapWidth * 0.105;
          graphics.fillStyle(0xffe7b4, 0.96).fillCircle(bubbleX, bubbleY, 6);
          graphics.lineStyle(1, 0x8c5735, 0.85).strokeCircle(bubbleX, bubbleY, 6);
        }
      });
    });
    this.renderDiningFood(snapshot);
    this.renderTableTasks(snapshot);
    for (const [guestId, sprite] of this.guestSprites) {
      if (livingGuestIds.has(guestId)) continue;
      sprite.destroy();
      this.guestSprites.delete(guestId);
      this.guestMotion.delete(guestId);
      this.removeGuestEntryBubble(guestId);
    }
    for (const guestId of this.guestEntryBubbles.keys()) {
      if (!livingGuestIds.has(guestId)) this.removeGuestEntryBubble(guestId);
    }
    const activeCharacters = new Set(snapshot.dining.guests.map((guest) => guest.characterId));
    for (const characterId of this.requestedCharacters) {
      if (activeCharacters.has(characterId)) continue;
      const atlasKey = `dining-npc-${characterId}`;
      if (!this.textures.exists(atlasKey)) continue;
      const manifestPath = Object.keys(DINING_ATLAS_MANIFESTS).find((entry) => entry.includes(`/${characterId}/`));
      const manifest = manifestPath && DINING_ATLAS_MANIFESTS[manifestPath];
      if (manifest) {
        for (const state of Object.keys(manifest.frame_layout.rows)) {
          const animationKey = `${atlasKey}-${state}`;
          if (this.anims.exists(animationKey)) this.anims.remove(animationKey);
        }
      }
      this.textures.remove(atlasKey);
      this.requestedCharacters.delete(characterId);
    }
    this.updateDiningDialogueBubble(snapshot.dining.dialogueEvent, snapshot.dining.guests);
  }

  private renderDiningFood(snapshot: GameSnapshot): void {
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    const visibleOrders = snapshot.dining.orders.filter((order) => {
      if (order.status !== "delivered") return false;
      const guest = snapshot.dining.guests.find((entry) => entry.id === order.guestId);
      return guest && (guest.status === "eating" || guest.status === "awaiting-payment");
    });
    const visibleIds = new Set(visibleOrders.map((order) => order.id));
    const dishIndexByTable = new Map<number, number>();
    for (const order of visibleOrders) {
      const guest = snapshot.dining.guests.find((entry) => entry.id === order.guestId);
      const tablePoint = this.tablePoints[order.tableId - 1];
      if (!guest || !tablePoint) continue;
      const dishIndex = dishIndexByTable.get(order.tableId) ?? 0;
      dishIndexByTable.set(order.tableId, dishIndex + 1);
      let sprite = this.diningFood.get(order.id);
      if (!sprite) {
        sprite = this.createDiningFood(order.recipe);
        this.diningFood.set(order.id, sprite);
      }
      const slots = [
        { x: -26, y: -13 },
        { x: 26, y: -13 },
        { x: -26, y: 13 },
        { x: 26, y: 13 },
      ];
      const slot = slots[dishIndex % slots.length];
      sprite.setPosition(tablePoint.x + slot.x * roomScale, tablePoint.y + slot.y * roomScale).setDepth(5.2);
      if (sprite instanceof Phaser.GameObjects.Image) {
        sprite.setDisplaySize(42 * roomScale, 36 * roomScale).setVisible(true);
      } else {
        sprite.setScale(roomScale).setVisible(true).clear();
        sprite.fillStyle(0x3c2518, 0.32).fillEllipse(1, 5, 34, 20);
        sprite.fillStyle(0xf6e8cf, 1).fillEllipse(0, 2, 34, 20);
        sprite.lineStyle(1.8, 0x9a6336, 1).strokeEllipse(0, 2, 34, 20);
        sprite.fillStyle(0xf0ad42, 1)
          .fillEllipse(-8, 1, 8, 9)
          .fillEllipse(0, -2, 8, 9)
          .fillEllipse(8, 1, 8, 9);
        sprite.fillStyle(0x4d8042, 1).fillCircle(0, 4, 2);
      }
    }
    for (const [orderId, sprite] of this.diningFood) {
      if (visibleIds.has(orderId)) continue;
      sprite.destroy();
      this.diningFood.delete(orderId);
    }
  }

  private renderTableTasks(snapshot: GameSnapshot): void {
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    const capacity = getDiningTableCapacity();
    for (const table of snapshot.dining.tables) {
      const point = this.tablePoints[table.id - 1];
      const tableGuests = snapshot.dining.guests.filter((guest) => guest.tableId === table.id && !["approaching", "departing", "leaving"].includes(guest.status));
      const taskAction = tableGuests.some((guest) => guest.status === "awaiting-payment")
        ? "collect-payment"
        : table.cleanliness === "dirty" && tableGuests.length === 0 ? "clean-table" : "";
      const task = taskAction === "collect-payment" ? "Thu tiền" : taskAction === "clean-table" ? "Dọn bàn" : "";
      let label = this.tableTaskLabels.get(table.id);
      let background = this.tableTaskBackgrounds.get(table.id);
      if (!point || table.id > capacity || !taskAction) {
        label?.setVisible(false);
        label?.setData("orderHintActive", false);
        label?.setData("taskAction", "");
        background?.setVisible(false);
        background?.setY(0);
        continue;
      }
      if (!label) {
        background = this.add.graphics().setDepth(9.8);
        this.tableTaskBackgrounds.set(table.id, background);
        label = this.add.text(0, 0, "", {
          fontFamily: "Arial, sans-serif", fontSize: `${Math.max(10, 12 * roomScale)}px`,
          fontStyle: "bold", color: "#fff4d8", backgroundColor: "transparent",
          padding: { x: Math.max(5, 7 * roomScale), y: Math.max(3, 4 * roomScale) },
        }).setOrigin(0.5, 1).setDepth(10).setResolution(this.devicePixelRatio);
        const taskLabel = label;
        taskLabel.on(Phaser.Input.Events.POINTER_UP, (
          pointer: Phaser.Input.Pointer,
          _localX: number,
          _localY: number,
          event: Phaser.Types.Input.EventData,
        ) => {
          if (Math.hypot(pointer.x - pointer.downX, pointer.y - pointer.downY) > 16 * this.devicePixelRatio) return;
          event.stopPropagation();
          const action = taskLabel.getData("taskAction");
          if (action === "collect-payment") this.store.collectDiningPaymentForTable(table.id);
          else if (action === "clean-table") this.store.cleanDiningTable(table.id);
        });
        this.tableTaskLabels.set(table.id, label);
      }
      label.setStyle({
        fontSize: `${Math.max(11, 12 * roomScale)}px`,
        color: "#fff4d8",
        backgroundColor: "transparent",
        padding: { x: Math.max(8, 9 * roomScale), y: Math.max(6, 7 * roomScale) },
      });
      label.setShadow(0, 1.5 * roomScale, "#352317", 0.6, true, true);
      const seatedHeadY = tableGuests.length > 0
        ? Math.min(...tableGuests.map((guest) => point.seats[guest.seatIndex].y - 136 * GUEST_VISUAL_SCALE * roomScale))
        : point.y - 88 * roomScale;
      const labelY = Math.max(12 * roomScale, seatedHeadY - 8 * roomScale);
      label.setText(task)
        .setPosition(point.x, labelY)
        .setVisible(true);
      label.setData("orderHintActive", true);
      label.setData("taskAction", taskAction);
      label.setData("orderHintBaseY", labelY);
      // The label is created empty, so Phaser initially gives it a zero-sized
      // input hit area. Enable input after the first real label is measured,
      // then resize the hit area whenever the label text changes.
      if (!label.input) label.setInteractive({ useHandCursor: true });
      const hitArea = label.input?.hitArea;
      if (hitArea instanceof Phaser.Geom.Rectangle) {
        hitArea.setTo(0, 0, label.width, label.height);
      }
      if (background) {
        background.setPosition(0, 0).setY(0);
        const left = label.x - label.width / 2;
        const top = label.y - label.height;
        const inset = Math.max(1, 1.5 * roomScale);
        const width = label.width + inset * 2;
        const height = label.height + inset * 2;
        const radius = Math.min(height / 2, 8 * roomScale);
        background.clear().setVisible(true);
        background.fillStyle(0x26180f, 0.16).fillRoundedRect(left - inset, top - inset + 2 * roomScale, width, height, radius);
        background.fillStyle(0x214b3e, 0.48)
          .fillRoundedRect(left - inset, top - inset, width, height, radius);
        background.lineStyle(Math.max(1, 1.2 * roomScale), 0xffdda0, 0.62)
          .strokeRoundedRect(left - inset, top - inset, width, height, radius);
      }
    }
  }

  private createDiningFood(recipeId: RecipeId): Phaser.GameObjects.Image | Phaser.GameObjects.Graphics {
    return this.add.image(0, 0, DINING_FOOD_TEXTURES[recipeId].key).setOrigin(0.5).setDepth(5.2);
  }

  private ensureGuestEntryBubble(guest: DiningGuest): void {
    if (this.guestEntryBubbles.has(guest.id) || !guest.arrivalDialogue) return;
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    this.guestEntryBubbles.set(guest.id, this.createSpeechBubble(guest.arrivalDialogue, roomScale));
  }

  private createSpeechBubble(text: string, roomScale: number): Phaser.GameObjects.Container {
    const width = Math.min(208 * roomScale, this.roomMapWidth * 0.70);
    const label = this.add.text(0, 0, text, {
      fontFamily: "Arial, sans-serif",
      fontSize: `${Math.max(9.5, 11 * roomScale)}px`,
      fontStyle: "bold",
      color: "#513423",
      align: "center",
      lineSpacing: -1,
      wordWrap: { width: width - 16 * roomScale, useAdvancedWrap: true },
    }).setOrigin(0.5, 0).setResolution(this.devicePixelRatio);
    const height = Math.max(26 * roomScale, label.height + 8 * roomScale);
    label.setPosition(0, -height - 2.5 * roomScale);
    const tailBaseY = -5.5 * roomScale;
    const tailTipY = 2.5 * roomScale;
    const tail = this.add.graphics();
    tail.fillStyle(0xffefc9, 0.98).fillTriangle(-6 * roomScale, tailBaseY, 6 * roomScale, tailBaseY, 0, tailTipY);
    tail.lineStyle(1.1 * roomScale, 0x8c5735, 0.98)
      .strokeTriangle(-6 * roomScale, tailBaseY, 6 * roomScale, tailBaseY, 0, tailTipY);
    const graphics = this.add.graphics();
    graphics.fillStyle(0x36271b, 0.24).fillRoundedRect(-width / 2 + 1, -height - 4.5 * roomScale, width, height, 7 * roomScale);
    graphics.fillStyle(0xffefc9, 0.98).fillRoundedRect(-width / 2, -height - 6.5 * roomScale, width, height, 7 * roomScale);
    graphics.lineStyle(1.1 * roomScale, 0x8c5735, 0.98)
      .strokeRoundedRect(-width / 2, -height - 6.5 * roomScale, width, height, 7 * roomScale);
    const bubble = this.add.container(0, 0, [tail, graphics, label]).setDepth(11).setVisible(false);
    bubble.setData("bubbleWidth", width);
    return bubble;
  }

  private positionSpeechBubble(bubble: Phaser.GameObjects.Container, speakerX: number, y: number, roomScale: number): void {
    const width = bubble.getData("bubbleWidth") as number;
    const left = this.roomMapLeft + width / 2 + 4;
    const right = this.roomMapLeft + this.roomMapWidth - width / 2 - 4;
    const x = left <= right ? Phaser.Math.Clamp(speakerX, left, right) : this.roomMapLeft + this.roomMapWidth / 2;
    const maxTailOffset = Math.max(0, width / 2 - 10 * roomScale);
    const tailOffset = Phaser.Math.Clamp(speakerX - x, -maxTailOffset, maxTailOffset);
    const tail = bubble.getAt(0) as Phaser.GameObjects.Graphics;
    tail.setPosition(tailOffset, 0);
    bubble.setPosition(x, y).setVisible(true);
  }

  private updateDiningDialogueBubble(event: DiningDialogueEvent | null, guests: DiningGuest[]): void {
    const existing = this.diningDialogueBubble;
    if (!event) {
      existing?.setVisible(false);
      this.diningDialogueBubbleId = null;
      return;
    }
    const guest = guests.find((entry) => entry.id === event.guestId);
    if (!guest) {
      existing?.setVisible(false);
      this.diningDialogueBubbleId = null;
      return;
    }
    if (!existing || this.diningDialogueBubbleId !== event.id) {
      existing?.destroy();
      this.diningDialogueBubble = this.createSpeechBubble(event.text, this.roomMapWidth / ROOM_WIDTH);
      this.diningDialogueBubbleId = event.id;
    }

    const bubble = this.diningDialogueBubble;
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    const sprite = this.guestSprites.get(guest.id);
    const seatPoint = this.tablePoints[guest.tableId - 1]?.seats[guest.seatIndex];
    if (!bubble || !seatPoint) return;
    const speakerBounds = sprite?.visible ? sprite.getBounds() : null;
    const anchorX = speakerBounds?.centerX ?? seatPoint.x;
    const anchorY = speakerBounds?.top ?? seatPoint.y - 35 * roomScale;
    this.positionSpeechBubble(bubble, anchorX, anchorY - 3 * roomScale, roomScale);
  }

  private removeGuestEntryBubble(guestId: string): void {
    const bubble = this.guestEntryBubbles.get(guestId);
    if (!bubble) return;
    bubble.destroy(true);
    this.guestEntryBubbles.delete(guestId);
  }

  private drawGuestSprite(point: { x: number; y: number }, guest: DiningGuest): boolean {
    const atlasKey = `dining-npc-${guest.characterId}`;
    if (this.textures.exists(atlasKey) && this.textures.get(atlasKey).has("down_idle-0")) {
      let sprite = this.guestSprites.get(guest.id);
      if (!sprite) {
        sprite = this.add.sprite(point.x, point.y, atlasKey, "down_idle-0").setOrigin(0.5, 1);
        this.guestSprites.set(guest.id, sprite);
      } else if (sprite.texture.key !== atlasKey) {
        sprite.setTexture(atlasKey, "down_idle-0");
      }
      // Show the back-facing guest's torso and seated pants while keeping feet tucked under the table.
      // The table's near-edge redraw is depth 5. Side-seat guests share that
      // edge in the room perspective; keep them above it so the tabletop art
      // cannot cover their entire sprite. The far seat stays behind the table.
      const seatDepth = guest.seatIndex === 0 ? 4.5 : 5.5;
      const roomScale = this.roomMapWidth / ROOM_WIDTH;
      sprite.setDepth(seatDepth)
        .setDisplaySize(84 * roomScale * GUEST_VISUAL_SCALE, 136 * roomScale * GUEST_VISUAL_SCALE)
        .setVisible(true);
      this.syncGuestMotion(guest);
      return true;
    }
    const genericTextureKey: Record<CustomerType, string> = {
      student: "customer-schoolgirl-idle",
      office: "diner-office-man-pho",
      shopper: "diner-older-regular-com-tam",
      tourist: "diner-backpacker-coffee",
    };
    const identityTextureKey = guest.characterId === "saigon-schoolgirl" ? "customer-schoolgirl-idle"
      : guest.characterId === "saigon-ward-police-officer" ? "customer-ward-police"
        : guest.characterId.startsWith("saigon-taphoa-") ? `walk-${guest.characterId.slice(7)}`
          : `customer-${guest.characterId.slice(7)}`;
    const key = this.textures.exists(identityTextureKey) ? identityTextureKey : genericTextureKey[guest.type];
    if (!this.textures.exists(key)) return false;
    const frame = this.textures.get(key).has("0") ? 0 : undefined;
    const guestBaseY = point.y;
    let sprite = this.guestSprites.get(guest.id);
    if (!sprite) {
      sprite = this.add.sprite(point.x, guestBaseY, key, frame).setDepth(7).setOrigin(0.5, 1);
      this.guestSprites.set(guest.id, sprite);
    }
    const scale = this.roomMapWidth / ROOM_WIDTH;
    sprite.setTexture(key, frame)
      .setOrigin(0.5, 1)
      .setDisplaySize(84 * scale * GUEST_VISUAL_SCALE, 136 * scale * GUEST_VISUAL_SCALE)
      .setPosition(point.x, guestBaseY)
      .setVisible(true);
    this.syncGuestMotion(guest);
    return true;
  }

  private syncGuestMotion(guest: DiningGuest): void {
    const prior = this.guestMotion.get(guest.id);
    if (prior?.status === guest.status) return;
    const elapsedBeforeAtlasLoad = guest.status === "entering" || guest.status === "leaving"
      ? Math.max(0, (guest.status === "entering" ? diningArrivalSeconds(guest.tableId) : diningTravelSeconds(guest.tableId)) + (guest.status === "entering" ? guest.arrivalDelaySeconds : 0) - guest.transitionSeconds) * 1000
      : 0;
    this.guestMotion.set(guest.id, { status: guest.status, startedAt: this.time.now - elapsedBeforeAtlasLoad });
  }

  private drawGuest(graphics: Phaser.GameObjects.Graphics, point: { x: number; y: number }, guest: DiningGuest): void {
    const colors = GUEST_COLORS[guest.type];
    const roomScale = this.roomMapWidth / ROOM_WIDTH;
    const scaleX = 1.25 * roomScale * GUEST_VISUAL_SCALE;
    const scaleY = 2.45 * roomScale * GUEST_VISUAL_SCALE;
    const lineScale = Math.min(scaleX, scaleY);
    const x = point.x;
    const guestBaseY = point.y;
    const headY = guestBaseY - 30 * scaleY;
    const outline = 0x30251f;
    graphics.fillStyle(0x30251f, 0.58).fillEllipse(x, guestBaseY + 2 * scaleY, 44 * scaleX, 8 * scaleY);
    graphics.fillStyle(colors.shirt, 1).fillRoundedRect(x - 16 * scaleX, guestBaseY - 31 * scaleY, 32 * scaleX, 31 * scaleY, 8 * lineScale);
    graphics.lineStyle(2 * lineScale, outline, 1).strokeRoundedRect(x - 16 * scaleX, guestBaseY - 31 * scaleY, 32 * scaleX, 31 * scaleY, 8 * lineScale);
    graphics.fillStyle(0xdba47c, 1).fillEllipse(x, headY, 17 * scaleX, 17 * scaleY);
    graphics.lineStyle(2 * lineScale, outline, 1).strokeEllipse(x, headY, 17 * scaleX, 17 * scaleY);
    graphics.fillStyle(colors.hair, 1).fillEllipse(x, headY - 8 * scaleY, 34 * scaleX, 18 * scaleY);
    graphics.fillStyle(0x38271f, 1).fillCircle(x - 5 * scaleX, headY + 1 * scaleY, 1.8 * lineScale);
    graphics.fillStyle(0x38271f, 1).fillCircle(x + 5 * scaleX, headY + 1 * scaleY, 1.8 * lineScale);
    graphics.lineStyle(1.4 * lineScale, 0x8e4e3f, 1).lineBetween(x - 3 * scaleX, headY + 7 * scaleY, x + 3 * scaleX, headY + 7 * scaleY);
    graphics.lineStyle(3 * lineScale, 0xdba47c, 1).lineBetween(x - 13 * scaleX, guestBaseY - 22 * scaleY, x - 22 * scaleX, guestBaseY - 10 * scaleY);
    graphics.lineStyle(3 * lineScale, 0xdba47c, 1).lineBetween(x + 13 * scaleX, guestBaseY - 22 * scaleY, x + 22 * scaleX, guestBaseY - 10 * scaleY);
    const orderStillNeedsWaiter = this.snapshot?.dining.orders.some((order) => order.guestId === guest.id && order.status === "called");
    if (guest.status === "waiting-order" && orderStillNeedsWaiter) {
      graphics.fillStyle(0xfff2cd, 1).fillRoundedRect(x + 22 * scaleX, headY - 22 * scaleY, 12 * scaleX, 17 * scaleY, 5 * lineScale);
      graphics.fillStyle(0xa45e35, 1).fillCircle(x + 28 * scaleX, headY - 14 * scaleY, 2 * lineScale);
    }
  }
}
