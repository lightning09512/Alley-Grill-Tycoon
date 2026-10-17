import Phaser from "phaser";
import roomShellUrl from "../../assets/interior-v2/modular-pack-v1/tavern_room_shell_base.png?url";
import curtainUrl from "../../assets/interior-v2/modular-pack-v1/curtain_closed_teal.png?url";
import shelfUrl from "../../assets/interior-v2/modular-pack-v1/spice_shelf.png?url";
import staircaseUrl from "../../assets/interior-v2/modular-pack-v1/staircase_wood.png?url";
import lanternUrl from "../../assets/interior-v2/modular-pack-v1/lantern_woven_red.png?url";
import plantUrl from "../../assets/interior-v2/modular-pack-v1/potted_plant_large.png?url";
import tableUrl from "../../assets/interior-v2/modular-pack-v1/dining_set_table_4stools_stove.png?url";
import counterUrl from "../../assets/interior-v2/modular-pack-v1/reception_counter_clean.png?url";
import registerUrl from "../../assets/interior-v2/modular-pack-v1/cash_register_compact.png?url";
import ledgerUrl from "../../assets/interior-v2/modular-pack-v1/order_ledger.png?url";
import { CUSTOMER_TYPES, MAX_CART_LEVEL, type CustomerType } from "./data";
import { GameStore, getDiningTableCapacity, type DiningGuest, type GameSnapshot } from "./GameStore";
import { diningTravelSeconds } from "./diningCharacters";

type TablePoint = { x: number; y: number; seats: { x: number; y: number }[] };
type GameAtlas = { frame_layout: { cellWidth: number; cellHeight: number; rows: Record<string, { x: number; y: number; w: number; h: number }[]> }; animation: { rows: Record<string, { fps: number; loop: boolean }> }; anchors: { standingFeet: { x: number; y: number }; seatedHip: { x: number; y: number } } };
type GuestMotion = { status: DiningGuest["status"]; startedAt: number };
type RoomTexture = "shell" | "curtain" | "shelf" | "staircase" | "lantern" | "plant" | "table" | "counter" | "register" | "ledger";
type RoomPart = {
  slot: string;
  x: number;
  y: number;
  scale?: number;
  depth: number;
  variants: { fromLevel: number; texture: RoomTexture }[];
};

const ROOM_WIDTH = 576;
const ROOM_HEIGHT = 1280;
const ROOM_TEXTURES: Record<RoomTexture, string> = {
  shell: roomShellUrl,
  curtain: curtainUrl,
  shelf: shelfUrl,
  staircase: staircaseUrl,
  lantern: lanternUrl,
  plant: plantUrl,
  table: tableUrl,
  counter: counterUrl,
  register: registerUrl,
  ledger: ledgerUrl,
};
// Each slot owns its image. A later level can swap one slot's texture without changing the room layout.
const ROOM_PARTS: RoomPart[] = [
  { slot: "shell", x: 0, y: 0, depth: 0, variants: [{ fromLevel: 1, texture: "shell" }] },
  { slot: "curtain", x: 223, y: 82, scale: 0.75, depth: 1, variants: [{ fromLevel: 1, texture: "curtain" }] },
  { slot: "shelf", x: 4, y: 20, depth: 2, variants: [{ fromLevel: 1, texture: "shelf" }] },
  { slot: "staircase", x: 440, y: 24, scale: 0.85, depth: 2, variants: [{ fromLevel: 1, texture: "staircase" }] },
  { slot: "lantern-left", x: 179, y: 61, scale: 0.95, depth: 3, variants: [{ fromLevel: 1, texture: "lantern" }] },
  { slot: "lantern-right", x: 344, y: 56, scale: 0.95, depth: 3, variants: [{ fromLevel: 1, texture: "lantern" }] },
  { slot: "plant-shelf", x: 99, y: 75, scale: 0.72, depth: 3, variants: [{ fromLevel: 1, texture: "plant" }] },
  { slot: "plant-left-wall", x: -6, y: 159, depth: 3, variants: [{ fromLevel: 1, texture: "plant" }] },
  { slot: "plant-stair-top", x: 483, y: -23, scale: 0.75, depth: 3, variants: [{ fromLevel: 1, texture: "plant" }] },
  { slot: "plant-stair-middle", x: 435, y: 261, scale: 0.8, depth: 3, variants: [{ fromLevel: 1, texture: "plant" }] },
  { slot: "table-1", x: 81, y: 313, depth: 4, variants: [{ fromLevel: 1, texture: "table" }] },
  { slot: "table-2", x: 300, y: 313, depth: 4, variants: [{ fromLevel: 1, texture: "table" }] },
  { slot: "table-3", x: 81, y: 513, depth: 4, variants: [{ fromLevel: 1, texture: "table" }] },
  { slot: "table-4", x: 301, y: 513, depth: 4, variants: [{ fromLevel: 1, texture: "table" }] },
  { slot: "table-5", x: 81, y: 710, depth: 4, variants: [{ fromLevel: 1, texture: "table" }] },
  { slot: "table-6", x: 303, y: 711, depth: 4, variants: [{ fromLevel: 1, texture: "table" }] },
  { slot: "counter", x: -7, y: 903, scale: 0.9, depth: 5, variants: [{ fromLevel: 1, texture: "counter" }] },
  { slot: "register", x: 55, y: 896, depth: 6, variants: [{ fromLevel: 1, texture: "register" }] },
  { slot: "ledger", x: 133, y: 926, depth: 6, variants: [{ fromLevel: 1, texture: "ledger" }] },
  { slot: "counter-lantern", x: -10, y: 902, scale: 0.82, depth: 6, variants: [{ fromLevel: 1, texture: "lantern" }] },
  { slot: "plant-bottom-left", x: -9, y: 1043, scale: 0.92, depth: 6, variants: [{ fromLevel: 1, texture: "plant" }] },
  { slot: "plant-bottom-right", x: 494, y: 1082, scale: 0.92, depth: 6, variants: [{ fromLevel: 1, texture: "plant" }] },
];

function roomTextureAtLevel(part: RoomPart, level: number): RoomTexture {
  return [...part.variants].reverse().find((variant) => level >= variant.fromLevel)!.texture;
}

// These are the six table asset origins, and the four stool locations inside each asset.
const TABLE_ORIGINS = [{ x: 81, y: 313 }, { x: 300, y: 313 }, { x: 81, y: 513 }, { x: 301, y: 513 }, { x: 81, y: 710 }, { x: 303, y: 711 }] as const;
const SEAT_OFFSETS = [{ x: 96, y: 77 }, { x: 162, y: 133 }, { x: 96, y: 181 }, { x: 30, y: 133 }] as const;
const SEAT_DIRECTIONS = ["down", "side", "up", "side"] as const;
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
  private guestMotion = new Map<string, GuestMotion>();
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
  private previewStage?: number;

  constructor(store: GameStore) {
    super("dining-room");
    this.store = store;
  }

  setPreviewStage(stage: number): void {
    if (!Number.isFinite(stage)) return;
    this.previewStage = Phaser.Math.Clamp(Math.round(stage), 1, MAX_CART_LEVEL);
    if (this.sys.isActive()) {
      if (this.updateRoomTextures()) this.layout();
      else this.renderGuests();
    }
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
  }

  create(): void {
    this.cameras.main.setZoom(this.devicePixelRatio);
    this.input.enabled = this.interactionEnabled;
    this.cameras.main.setBackgroundColor(0x302920);
    this.snapshot = this.store.getSnapshot();
    this.roomPieces = ROOM_PARTS.map((part) => ({
      part,
      image: this.add.image(0, 0, `dining-${roomTextureAtLevel(part, this.previewStage ?? this.snapshot?.cartLevel ?? 1)}`)
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
      if (this.updateRoomTextures()) this.layout();
      else this.renderGuests();
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
    }
    this.cameras.main.setBounds(worldLeft, 0, worldWidth, this.roomMapHeight);
    this.tablePoints = TABLE_ORIGINS.map((origin) => ({
      x: this.roomMapLeft + (origin.x + 96) * roomScale,
      y: (origin.y + 132) * roomScale,
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

  private updateRoomTextures(): boolean {
    const level = this.previewStage ?? this.snapshot?.cartLevel ?? 1;
    let changed = false;
    for (const { part, image } of this.roomPieces) {
      const key = `dining-${roomTextureAtLevel(part, level)}`;
      if (image.texture.key !== key) {
        image.setTexture(key);
        changed = true;
      }
    }
    return changed;
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

  private createTableTargets(): void {
    this.tableZones.forEach((zone) => zone.destroy());
    this.tableZones = [];
    this.seatZones.forEach((zone) => zone.destroy());
    this.seatZones = [];
    this.tablePoints.forEach((point, index) => {
      const roomScale = this.roomMapWidth / ROOM_WIDTH;
      const width = 104 * roomScale;
      const height = 78 * roomScale;
      const unlocked = index < getDiningTableCapacity(this.previewStage ?? this.snapshot?.cartLevel ?? 1);
      const zone = this.add.zone(point.x, point.y, width, height).setDepth(8);
      if (unlocked) zone.setInteractive();
      else zone.setVisible(false);
      zone.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
        if (Math.hypot(pointer.x - pointer.downX, pointer.y - pointer.downY) > 16 * this.devicePixelRatio) return;
        this.store.selectDiningTable(index + 1);
        this.focusDiningTable(index + 1);
        document.dispatchEvent(new Event("dining-table-selected"));
      });
      this.tableZones.push(zone);
      point.seats.forEach((seat, seatIndex) => {
        const seatZone = this.add.zone(seat.x, seat.y - 38 * roomScale, 58 * roomScale, 84 * roomScale).setDepth(9);
        if (unlocked) seatZone.setInteractive();
        else seatZone.setVisible(false);
        seatZone.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
          if (Math.hypot(pointer.x - pointer.downX, pointer.y - pointer.downY) > 16 * this.devicePixelRatio) return;
          this.store.selectDiningSeat(index + 1, seatIndex);
          this.focusDiningTable(index + 1);
          document.dispatchEvent(new Event("dining-table-selected"));
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
        const animationKey = `${key}-${state}`;
        rectangles.forEach((rect, index) => {
          const frame = `${state}-${index}`;
          if (!texture.has(frame)) texture.add(frame, 0, rect.x, rect.y, rect.w, rect.h);
        });
        if (this.anims.exists(animationKey)) continue;
        const animation = manifest.animation.rows[state];
        this.anims.create({
          key: animationKey,
          frames: rectangles.map((_, index) => ({ key, frame: `${state}-${index}` })),
          frameRate: animation?.fps ?? 5,
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
    const door = { x: this.roomMapLeft + 288 * roomScale, y: 1210 * roomScale };
    for (const guest of snapshot.dining.guests) {
      const sprite = this.guestSprites.get(guest.id);
      const target = this.tablePoints[guest.tableId - 1]?.seats[guest.seatIndex];
      const motion = this.guestMotion.get(guest.id);
      if (!sprite || !target || !motion) continue;
      const direction = SEAT_DIRECTIONS[guest.seatIndex];
      sprite.setFlipX(guest.seatIndex === 1);
      const elapsed = Math.max(0, time - motion.startedAt);
      const duration = diningTravelSeconds(guest.tableId) * 1000;
      const poseFraction = 700 / duration;
      const path = this.guestPath(guest, target, door, roomScale);
      if (guest.status === "entering") {
        const progress = Math.min(1, elapsed / duration);
        if (progress < 1 - poseFraction) {
          const step = this.positionOnPath(path, progress / (1 - poseFraction));
          sprite.setPosition(step.x, step.y);
          sprite.setFlipX(step.direction === "side" ? step.facingLeft : false);
          this.setGuestOrigin(sprite, guest.characterId, false);
          this.playGuestAnimation(sprite, guest.characterId, `${step.direction}_walk`);
        } else {
          sprite.setPosition(target.x, target.y);
          this.setGuestOrigin(sprite, guest.characterId, true);
          this.playGuestAnimation(sprite, guest.characterId, `${direction}_sit`);
        }
      } else if (guest.status === "leaving") {
        const progress = Math.min(1, elapsed / duration);
        if (progress < poseFraction) {
          sprite.setPosition(target.x, target.y);
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
        sprite.setPosition(target.x, target.y);
        this.setGuestOrigin(sprite, guest.characterId, true);
        this.playGuestAnimation(sprite, guest.characterId, `${direction}_${guest.status === "eating" ? "eat" : "seated_idle"}`);
      }
    }
  }

  private guestPath(guest: DiningGuest, seat: { x: number; y: number }, door: { x: number; y: number }, scale: number): { x: number; y: number }[] {
    const table = TABLE_ORIGINS[guest.tableId - 1];
    const isOuter = (guest.tableId % 2 === 1 && guest.seatIndex === 3) || (guest.tableId % 2 === 0 && guest.seatIndex === 1);
    const routeY = table.y + (guest.seatIndex === 0 || isOuter ? 45 : guest.seatIndex === 2 ? 224 : 165);
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
  }

  private renderGuests(): void {
    const graphics = this.guestArt;
    const snapshot = this.snapshot;
    if (!graphics || !snapshot) return;
    graphics.clear();
    const unlockedTableCount = getDiningTableCapacity(this.previewStage ?? snapshot.cartLevel);
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
        this.requestGuestAtlas(guest.characterId);
        if (!this.drawGuestSprite(seatPoint, guest)) this.drawGuest(graphics, seatPoint, guest);
        if (selected && guest.status === "waiting-order") {
          const bubbleX = seatPoint.x + this.roomMapWidth * 0.018;
          const bubbleY = seatPoint.y - this.roomMapWidth * 0.105;
          graphics.fillStyle(0xffe7b4, 0.96).fillCircle(bubbleX, bubbleY, 6);
          graphics.lineStyle(1, 0x8c5735, 0.85).strokeCircle(bubbleX, bubbleY, 6);
        }
      });
    });
    for (const [guestId, sprite] of this.guestSprites) {
      if (livingGuestIds.has(guestId)) continue;
      sprite.destroy();
      this.guestSprites.delete(guestId);
      this.guestMotion.delete(guestId);
    }
    const activeCharacters = new Set(snapshot.dining.guests.map((guest) => guest.characterId));
    for (const characterId of this.requestedCharacters) {
      if (activeCharacters.has(characterId)) continue;
      const atlasKey = `dining-npc-${characterId}`;
      if (!this.textures.exists(atlasKey)) continue;
      this.textures.remove(atlasKey);
      this.requestedCharacters.delete(characterId);
    }
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
      const seatDepth = guest.seatIndex === 0 ? 3.5 : guest.seatIndex === 2 ? 5 : 4.5;
      const roomScale = this.roomMapWidth / ROOM_WIDTH;
      sprite.setDepth(seatDepth).setDisplaySize(72 * roomScale, 116 * roomScale).setVisible(true);
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
      .setDisplaySize(58 * scale, 74 * scale)
      .setPosition(point.x, guestBaseY)
      .setVisible(true);
    this.syncGuestMotion(guest);
    return true;
  }

  private syncGuestMotion(guest: DiningGuest): void {
    const prior = this.guestMotion.get(guest.id);
    if (prior?.status === guest.status) return;
    const elapsedBeforeAtlasLoad = guest.status === "entering" || guest.status === "leaving"
      ? Math.max(0, diningTravelSeconds(guest.tableId) - guest.transitionSeconds) * 1000
      : 0;
    this.guestMotion.set(guest.id, { status: guest.status, startedAt: this.time.now - elapsedBeforeAtlasLoad });
  }

  private drawGuest(graphics: Phaser.GameObjects.Graphics, point: { x: number; y: number }, guest: DiningGuest): void {
    const colors = GUEST_COLORS[guest.type];
    const scale = this.logicalWidth < 520 ? 0.88 : 1;
    const x = point.x;
    const guestBaseY = point.y;
    const headY = guestBaseY - 30 * scale;
    const outline = 0x30251f;
    graphics.fillStyle(0x30251f, 0.58).fillEllipse(x, guestBaseY + 2, 44 * scale, 8 * scale);
    graphics.fillStyle(colors.shirt, 1).fillRoundedRect(x - 16 * scale, guestBaseY - 31 * scale, 32 * scale, 31 * scale, 8 * scale);
    graphics.lineStyle(2, outline, 1).strokeRoundedRect(x - 16 * scale, guestBaseY - 31 * scale, 32 * scale, 31 * scale, 8 * scale);
    graphics.fillStyle(0xdba47c, 1).fillCircle(x, headY, 17 * scale);
    graphics.lineStyle(2, outline, 1).strokeCircle(x, headY, 17 * scale);
    graphics.fillStyle(colors.hair, 1).fillEllipse(x, headY - 8 * scale, 34 * scale, 18 * scale);
    graphics.fillStyle(0x38271f, 1).fillCircle(x - 5 * scale, headY + 1 * scale, 1.8 * scale);
    graphics.fillStyle(0x38271f, 1).fillCircle(x + 5 * scale, headY + 1 * scale, 1.8 * scale);
    graphics.lineStyle(1.4 * scale, 0x8e4e3f, 1).lineBetween(x - 3 * scale, headY + 7 * scale, x + 3 * scale, headY + 7 * scale);
    graphics.lineStyle(3 * scale, 0xdba47c, 1).lineBetween(x - 13 * scale, guestBaseY - 22 * scale, x - 22 * scale, guestBaseY - 10 * scale);
    graphics.lineStyle(3 * scale, 0xdba47c, 1).lineBetween(x + 13 * scale, guestBaseY - 22 * scale, x + 22 * scale, guestBaseY - 10 * scale);
    if (guest.status === "waiting-order") {
      graphics.fillStyle(0xfff2cd, 1).fillRoundedRect(x + 22 * scale, headY - 22 * scale, 12 * scale, 17 * scale, 5);
      graphics.fillStyle(0xa45e35, 1).fillCircle(x + 28 * scale, headY - 14 * scale, 2 * scale);
    }
  }
}
