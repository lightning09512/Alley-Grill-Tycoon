import Phaser from "phaser";
import type { GameStore } from "./GameStore";
import {
  getHomeInteriorStage,
  getHomeInteriorStageTextureKey,
  getHomeInteriorStageUrl,
} from "../config/homeInteriorStages";

type OwnerGender = "male" | "female";
type Direction8 = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

const OWNER_FRAME_WIDTH = 247;
const OWNER_FRAME_HEIGHT = 396;
const OWNER_FRAME_BASELINE = 390;
const OWNER_ART_HEIGHT = 375;
const OWNER_DISPLAY_WIDTH = 188;
const OWNER_TARGET_VISIBLE_HEIGHT = 270;
const OWNER_WALK_SPEED = 405;
const OWNER_DIRECTIONS: readonly Direction8[] = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
type NormalizedBlocker = { left: number; top: number; right: number; bottom: number };

// The backgrounds are flattened paintings, so these broad zones keep the player on
// the visible floor routes without requiring separate collision art for each tier.
const HOME_INTERIOR_BLOCKERS: readonly (readonly NormalizedBlocker[])[] = [
  [
    { left: 0, top: 0, right: 0.34, bottom: 0.35 }, { left: 0.33, top: 0, right: 0.64, bottom: 0.31 },
    { left: 0.68, top: 0, right: 1, bottom: 0.25 }, { left: 0, top: 0.43, right: 0.28, bottom: 0.66 },
    { left: 0.62, top: 0.29, right: 1, bottom: 0.58 }, { left: 0, top: 0.72, right: 0.3, bottom: 1 },
    { left: 0.72, top: 0.7, right: 1, bottom: 1 },
  ],
  [
    { left: 0, top: 0, right: 0.36, bottom: 0.34 }, { left: 0.77, top: 0, right: 1, bottom: 0.28 },
    { left: 0, top: 0.37, right: 0.33, bottom: 0.59 }, { left: 0.76, top: 0.35, right: 1, bottom: 0.7 },
    { left: 0, top: 0.69, right: 0.34, bottom: 1 }, { left: 0.8, top: 0.72, right: 1, bottom: 1 },
  ],
  [
    { left: 0, top: 0, right: 0.65, bottom: 0.18 }, { left: 0.73, top: 0, right: 1, bottom: 0.33 },
    { left: 0, top: 0.2, right: 0.32, bottom: 0.41 }, { left: 0.8, top: 0.37, right: 1, bottom: 0.59 },
    { left: 0, top: 0.66, right: 0.35, bottom: 0.94 }, { left: 0.79, top: 0.68, right: 1, bottom: 1 },
  ],
  [
    { left: 0, top: 0, right: 0.38, bottom: 0.22 }, { left: 0.4, top: 0, right: 0.65, bottom: 0.16 },
    { left: 0.7, top: 0, right: 1, bottom: 0.25 }, { left: 0, top: 0.25, right: 0.18, bottom: 0.44 },
    { left: 0, top: 0.48, right: 0.3, bottom: 0.69 }, { left: 0.77, top: 0.28, right: 1, bottom: 0.68 },
    { left: 0.78, top: 0.7, right: 1, bottom: 0.95 },
  ],
  [
    { left: 0, top: 0, right: 0.38, bottom: 0.2 }, { left: 0.55, top: 0, right: 1, bottom: 0.21 },
    { left: 0, top: 0.25, right: 0.36, bottom: 0.46 }, { left: 0.65, top: 0.32, right: 0.96, bottom: 0.52 },
    { left: 0.14, top: 0.47, right: 0.56, bottom: 0.72 }, { left: 0.55, top: 0.7, right: 0.85, bottom: 0.88 },
  ],
  [
    { left: 0, top: 0, right: 0.42, bottom: 0.2 }, { left: 0.42, top: 0, right: 0.68, bottom: 0.25 },
    { left: 0.82, top: 0, right: 1, bottom: 0.32 }, { left: 0.08, top: 0.27, right: 0.49, bottom: 0.47 },
    { left: 0.72, top: 0.31, right: 1, bottom: 0.53 }, { left: 0.09, top: 0.58, right: 0.61, bottom: 0.81 },
    { left: 0, top: 0.84, right: 0.34, bottom: 1 }, { left: 0.72, top: 0.78, right: 1, bottom: 1 },
  ],
  [
    { left: 0, top: 0, right: 0.41, bottom: 0.2 }, { left: 0.82, top: 0, right: 1, bottom: 0.33 },
    { left: 0.1, top: 0.25, right: 0.5, bottom: 0.44 }, { left: 0.75, top: 0.34, right: 1, bottom: 0.56 },
    { left: 0, top: 0.57, right: 0.45, bottom: 0.81 }, { left: 0.83, top: 0.59, right: 1, bottom: 0.84 },
  ],
  [
    { left: 0, top: 0, right: 0.37, bottom: 0.2 }, { left: 0.68, top: 0, right: 0.88, bottom: 0.24 },
    { left: 0.85, top: 0, right: 1, bottom: 0.34 }, { left: 0, top: 0.3, right: 0.37, bottom: 0.49 },
    { left: 0.57, top: 0.3, right: 0.94, bottom: 0.51 }, { left: 0, top: 0.65, right: 0.61, bottom: 0.9 },
  ],
  [
    { left: 0, top: 0, right: 0.39, bottom: 0.22 }, { left: 0.42, top: 0, right: 0.67, bottom: 0.18 },
    { left: 0.83, top: 0, right: 1, bottom: 0.31 }, { left: 0.06, top: 0.28, right: 0.49, bottom: 0.47 },
    { left: 0.68, top: 0.33, right: 1, bottom: 0.53 }, { left: 0.08, top: 0.58, right: 0.56, bottom: 0.83 },
    { left: 0, top: 0.85, right: 0.35, bottom: 1 }, { left: 0.72, top: 0.78, right: 1, bottom: 1 },
  ],
  [
    { left: 0, top: 0, right: 0.45, bottom: 0.18 }, { left: 0.83, top: 0, right: 1, bottom: 0.34 },
    { left: 0.08, top: 0.26, right: 0.46, bottom: 0.47 }, { left: 0.69, top: 0.31, right: 1, bottom: 0.51 },
    { left: 0, top: 0.58, right: 0.55, bottom: 0.84 }, { left: 0.76, top: 0.58, right: 1, bottom: 0.87 },
  ],
  [
    { left: 0, top: 0, right: 0.41, bottom: 0.2 }, { left: 0.82, top: 0, right: 1, bottom: 0.33 },
    { left: 0, top: 0.28, right: 0.34, bottom: 0.48 }, { left: 0.69, top: 0.29, right: 1, bottom: 0.52 },
    { left: 0.12, top: 0.57, right: 0.61, bottom: 0.84 }, { left: 0.81, top: 0.58, right: 1, bottom: 0.85 },
  ],
  [
    { left: 0, top: 0, right: 0.47, bottom: 0.2 }, { left: 0.56, top: 0, right: 0.8, bottom: 0.18 },
    { left: 0.82, top: 0, right: 1, bottom: 0.35 }, { left: 0.71, top: 0.25, right: 1, bottom: 0.52 },
    { left: 0, top: 0.28, right: 0.44, bottom: 0.5 }, { left: 0.1, top: 0.56, right: 0.61, bottom: 0.83 },
    { left: 0, top: 0.85, right: 0.37, bottom: 1 }, { left: 0.72, top: 0.77, right: 1, bottom: 1 },
  ],
];

function getDirection8(x: number, y: number): Direction8 {
  const sector = (Math.round(Math.atan2(y, x) / (Math.PI / 4)) + OWNER_DIRECTIONS.length) % OWNER_DIRECTIONS.length;
  return ["e", "se", "s", "sw", "w", "nw", "n", "ne"][sector] as Direction8;
}

export class HomeInteriorScene extends Phaser.Scene {
  private readonly store: GameStore;
  private readonly getOwnerGender: () => OwnerGender;
  private devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
  private currentStage: number;
  private loadedStages = new Set<number>();
  private loadingStage: number | null = null;
  private mapImage?: Phaser.GameObjects.Image;
  private ownerCharacter?: Phaser.GameObjects.Sprite;
  private ownerShadow?: Phaser.GameObjects.Image;
  private mapScale = 1;
  private mapWidth = 0;
  private mapHeight = 0;
  private ownerX = 0;
  private ownerY = 0;
  private ownerGender: OwnerGender = "male";
  private ownerMoving = false;
  private ownerDirection: Direction8 = "s";
  private movementVector = { x: 0, y: 0 };
  private keyboardVector = { x: 0, y: 0 };
  private interactionEnabled = false;
  private unsubscribe?: () => void;

  constructor(store: GameStore, getOwnerGender: () => OwnerGender) {
    super("home-interior");
    this.store = store;
    this.getOwnerGender = getOwnerGender;
    this.currentStage = getHomeInteriorStage(store.getSnapshot().cartLevel);
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
    if (!enabled) {
      this.movementVector = { x: 0, y: 0 };
      this.keyboardVector = { x: 0, y: 0 };
      this.setOwnerMoving(false);
    }
    if (this.sys.isActive()) this.input.enabled = enabled;
  }

  setMovementVector(x: number, y: number): void {
    if (!this.interactionEnabled || !Number.isFinite(x) || !Number.isFinite(y)) {
      this.movementVector = { x: 0, y: 0 };
      return;
    }
    const magnitude = Math.hypot(x, y);
    const scale = magnitude > 1 ? 1 / magnitude : 1;
    this.movementVector = { x: x * scale, y: y * scale };
  }

  setHomeStage(stage: number): void {
    const nextStage = getHomeInteriorStage(stage);
    if (nextStage === this.currentStage) return;
    this.currentStage = nextStage;
    if (this.sys.isActive()) this.loadCurrentStage();
  }

  preload(): void {
    this.devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
    this.loadingStage = this.currentStage;
    this.load.image(getHomeInteriorStageTextureKey(this.currentStage), getHomeInteriorStageUrl(this.currentStage));
  }

  create(): void {
    this.cameras.main.setZoom(this.devicePixelRatio);
    this.cameras.main.setBackgroundColor(0x211b16);
    this.input.enabled = this.interactionEnabled;
    this.loadedStages.add(this.loadingStage ?? this.currentStage);
    this.loadingStage = null;

    this.mapImage = this.add.image(0, 0, getHomeInteriorStageTextureKey(this.currentStage))
      .setOrigin(0, 0)
      .setDepth(-1);
    this.createPlayer();
    this.ownerGender = this.getOwnerGender();
    this.syncOwnerAnimation();

    this.scale.on(Phaser.Scale.Events.RESIZE, this.layout, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this);
    this.events.on(Phaser.Scenes.Events.WAKE, this.onWake, this);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.unsubscribe = this.store.subscribe((snapshot) => this.setHomeStage(snapshot.cartLevel));

    this.layout(true);
    if (!this.loadedStages.has(this.currentStage)) this.loadCurrentStage();
  }

  private createPlayer(): void {
    this.ownerShadow = this.add.image(0, 0, "player-owner-ground-shadow")
      .setOrigin(0.5, 0.5)
      .setAlpha(0.9)
      .setDepth(1);
    const textureKey = this.getOwnerGender() === "male" ? "player-owner-male-idle-base" : "player-owner-female-idle";
    this.ownerCharacter = this.add.sprite(0, 0, textureKey, 0)
      .setOrigin(0.5, OWNER_FRAME_BASELINE / OWNER_FRAME_HEIGHT)
      .setDepth(2);
  }

  private loadCurrentStage(): void {
    if (this.loadedStages.has(this.currentStage)) {
      this.showStage(this.currentStage);
      return;
    }
    if (this.loadingStage !== null || !this.sys.isActive()) return;

    const stage = this.currentStage;
    this.loadingStage = stage;
    this.load.once(Phaser.Loader.Events.COMPLETE, this.onStageLoadComplete, this);
    this.load.once(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
      console.error("[home interior asset load error]", file.key, file.src);
    });
    this.load.image(getHomeInteriorStageTextureKey(stage), getHomeInteriorStageUrl(stage));
    this.load.start();
  }

  private onStageLoadComplete(): void {
    const loadedStage = this.loadingStage;
    this.loadingStage = null;
    if (loadedStage !== null) this.loadedStages.add(loadedStage);
    if (loadedStage === this.currentStage) this.showStage(loadedStage);
    else this.loadCurrentStage();
  }

  private showStage(stage: number): void {
    if (!this.mapImage || !this.textures.exists(getHomeInteriorStageTextureKey(stage))) return;
    this.mapImage.setTexture(getHomeInteriorStageTextureKey(stage));
    for (const loadedStage of this.loadedStages) {
      if (loadedStage === stage) continue;
      this.textures.remove(getHomeInteriorStageTextureKey(loadedStage));
      this.loadedStages.delete(loadedStage);
    }
    this.ownerX = 0;
    this.ownerY = 0;
    this.layout(true);
  }

  private layout(resetSpawn = false): void {
    if (!this.mapImage || !this.ownerCharacter || !this.ownerShadow) return;
    const texture = this.mapImage.texture.getSourceImage() as HTMLImageElement;
    const logicalWidth = this.scale.width / this.devicePixelRatio;
    const logicalHeight = this.scale.height / this.devicePixelRatio;
    if (!texture.width || !texture.height || !logicalWidth || !logicalHeight) return;

    // Cover the viewport while preserving the artwork's original aspect ratio.
    this.mapScale = Math.max(logicalWidth / texture.width, logicalHeight / texture.height);
    this.mapWidth = texture.width * this.mapScale;
    this.mapHeight = texture.height * this.mapScale;
    this.mapImage.setPosition(0, 0).setScale(this.mapScale);
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight, false);

    if (resetSpawn || (this.ownerX === 0 && this.ownerY === 0)) {
      this.ownerX = this.mapWidth * 0.5;
      this.ownerY = this.mapHeight * 0.86;
    }
    this.ownerX = Phaser.Math.Clamp(this.ownerX, 96 * this.mapScale, this.mapWidth - 96 * this.mapScale);
    this.ownerY = Phaser.Math.Clamp(this.ownerY, 24 * this.mapScale, this.mapHeight - 12 * this.mapScale);

    const visibleHeight = OWNER_TARGET_VISIBLE_HEIGHT * this.mapScale;
    const frameDisplayHeight = visibleHeight * OWNER_FRAME_HEIGHT / OWNER_ART_HEIGHT;
    this.ownerCharacter
      .setPosition(this.ownerX, this.ownerY)
      .setOrigin(0.5, OWNER_FRAME_BASELINE / OWNER_FRAME_HEIGHT)
      .setDisplaySize(OWNER_DISPLAY_WIDTH * this.mapScale, frameDisplayHeight)
      .setDepth(2 + this.ownerY / Math.max(1, this.mapHeight) * 0.01);
    this.ownerShadow
      .setPosition(this.ownerX, this.ownerY + 1.5 * this.mapScale)
      .setDisplaySize(145 * this.mapScale, 41 * this.mapScale)
      .setDepth(1 + this.ownerY / Math.max(1, this.mapHeight) * 0.01);

    const camera = this.cameras.main;
    if (resetSpawn) camera.startFollow(this.ownerCharacter, true, 0.12, 0.12);
    const maxScrollX = Math.max(0, this.mapWidth - logicalWidth);
    const maxScrollY = Math.max(0, this.mapHeight - logicalHeight);
    camera.setScroll(
      Phaser.Math.Clamp(this.ownerX - logicalWidth / 2, 0, maxScrollX),
      Phaser.Math.Clamp(this.ownerY - logicalHeight / 2, 0, maxScrollY),
    );
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (!this.interactionEnabled || this.isTypingTarget(event.target)) return;
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") this.keyboardVector.x = -1;
    else if (key === "arrowright" || key === "d") this.keyboardVector.x = 1;
    else if (key === "arrowup" || key === "w") this.keyboardVector.y = -1;
    else if (key === "arrowdown" || key === "s") this.keyboardVector.y = 1;
    else return;
    event.preventDefault();
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    if ((key === "arrowleft" || key === "a") && this.keyboardVector.x === -1) this.keyboardVector.x = 0;
    if ((key === "arrowright" || key === "d") && this.keyboardVector.x === 1) this.keyboardVector.x = 0;
    if ((key === "arrowup" || key === "w") && this.keyboardVector.y === -1) this.keyboardVector.y = 0;
    if ((key === "arrowdown" || key === "s") && this.keyboardVector.y === 1) this.keyboardVector.y = 0;
  };

  private isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
  }

  private syncOwnerAnimation(): void {
    if (!this.ownerCharacter) return;
    const direction = this.ownerDirection;
    if (this.ownerGender === "male") {
      const textureKey = this.ownerMoving ? "player-owner-male-walk-8dir" : "player-owner-male-idle-base";
      const animationKey = this.ownerMoving ? `player-owner-male-walk-${direction}` : `player-owner-male-idle-base-${direction}`;
      if (this.ownerCharacter.texture.key !== textureKey) this.ownerCharacter.setTexture(textureKey, 0);
      this.ownerCharacter.play(animationKey, true);
      return;
    }
    const textureKey = this.ownerMoving ? "player-owner-female-walk" : "player-owner-female-idle";
    if (this.ownerCharacter.texture.key !== textureKey) this.ownerCharacter.setTexture(textureKey, 0);
    const animationKey = this.ownerMoving
      ? `player-owner-female-walk-${direction === "w" || direction === "nw" || direction === "sw" ? "left" : "right"}`
      : "player-owner-female-idle-loop";
    this.ownerCharacter.play(animationKey, true);
  }

  private setOwnerMoving(moving: boolean): void {
    if (this.ownerMoving === moving) return;
    this.ownerMoving = moving;
    this.syncOwnerAnimation();
  }

  private isBlocked(x: number, y: number): boolean {
    const padding = 19 * this.mapScale;
    const blockers = HOME_INTERIOR_BLOCKERS[this.currentStage - 1] ?? [];
    return blockers.some((blocker) => (
      x + padding > blocker.left * this.mapWidth
      && x - padding < blocker.right * this.mapWidth
      && y + padding > blocker.top * this.mapHeight
      && y - padding < blocker.bottom * this.mapHeight
    ));
  }

  private onWake(): void {
    this.devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
    this.cameras.main.setZoom(this.devicePixelRatio);
    this.input.enabled = this.interactionEnabled;
    this.ownerGender = this.getOwnerGender();
    this.syncOwnerAnimation();
    this.layout();
    this.loadCurrentStage();
  }

  private onShutdown(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.scale.off(Phaser.Scale.Events.RESIZE, this.layout, this);
    this.events.off(Phaser.Scenes.Events.WAKE, this.onWake, this);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  update(_time: number, delta: number): void {
    if (!this.interactionEnabled || !this.ownerCharacter) return;
    const inputX = this.movementVector.x + this.keyboardVector.x;
    const inputY = this.movementVector.y + this.keyboardVector.y;
    const magnitude = Math.hypot(inputX, inputY);
    if (magnitude < 0.08) {
      this.setOwnerMoving(false);
      return;
    }

    const directionX = inputX / Math.max(1, magnitude);
    const directionY = inputY / Math.max(1, magnitude);
    const direction = getDirection8(directionX, directionY);
    const nextGender = this.getOwnerGender();
    const changed = this.ownerGender !== nextGender || this.ownerDirection !== direction || !this.ownerMoving;
    this.ownerGender = nextGender;
    this.ownerDirection = direction;
    this.setOwnerMoving(true);
    if (changed) this.syncOwnerAnimation();

    const elapsed = Math.min(Math.max(0, delta) / 1_000, 0.05);
    const step = OWNER_WALK_SPEED * elapsed;
    const nextX = Phaser.Math.Clamp(this.ownerX + directionX * step, 96 * this.mapScale, this.mapWidth - 96 * this.mapScale);
    const nextY = Phaser.Math.Clamp(this.ownerY + directionY * step, 24 * this.mapScale, this.mapHeight - 12 * this.mapScale);
    if (!this.isBlocked(nextX, this.ownerY)) this.ownerX = nextX;
    if (!this.isBlocked(this.ownerX, nextY)) this.ownerY = nextY;
    this.ownerCharacter.setPosition(this.ownerX, this.ownerY);
    this.ownerShadow?.setPosition(this.ownerX, this.ownerY + 1.5 * this.mapScale);
    const depth = 2 + this.ownerY / Math.max(1, this.mapHeight) * 0.01;
    this.ownerCharacter.setDepth(depth);
    this.ownerShadow?.setDepth(depth - 1);
  }
}
