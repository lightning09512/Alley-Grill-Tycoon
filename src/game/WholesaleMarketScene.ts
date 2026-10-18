import Phaser from "phaser";
import produceMorningUrl from "../../assets/backgrounds/wholesale-market/interior-produce/wholesale-market-produce-morning.png?url";
import produceNoonUrl from "../../assets/backgrounds/wholesale-market/interior-produce/wholesale-market-produce-noon.png?url";
import produceAfternoonUrl from "../../assets/backgrounds/wholesale-market/interior-produce/wholesale-market-produce-afternoon.png?url";
import produceNightUrl from "../../assets/backgrounds/wholesale-market/interior-produce/wholesale-market-produce-night.png?url";
import produceRainUrl from "../../assets/backgrounds/wholesale-market/interior-produce/wholesale-market-produce-rain.png?url";
import seafoodMorningUrl from "../../assets/backgrounds/wholesale-market/interior-seafood/wholesale-market-seafood-morning.png?url";
import seafoodNoonUrl from "../../assets/backgrounds/wholesale-market/interior-seafood/wholesale-market-seafood-noon.png?url";
import butcherAtlasUrl from "../../assets/characters/market-vendors/butcher-auntie-sprite-atlas.png?url";
import fishmongerAtlasUrl from "../../assets/characters/market-vendors/fishmonger-uncle-sprite-atlas.png?url";
import crabSellerAtlasUrl from "../../assets/characters/market-vendors/crab-seller-auntie-sprite-atlas.png?url";
import {
  WHOLESALE_MARKET_EXTERIOR_ASSETS,
  WHOLESALE_MARKET_EXTERIOR_TEXTURE_KEYS,
  type WholesaleMarketBackgroundMood,
} from "../config/wholesaleMarket";

export type { WholesaleMarketBackgroundMood, WholesaleMarketTimeOfDay } from "../config/wholesaleMarket";

type VendorId = "butcher-auntie" | "fishmonger-uncle" | "crab-seller-auntie";
export type WholesaleMarketSection = "exterior" | "produce" | "seafood";
type VendorDefinition = {
  id: VendorId;
  textureKey: string;
  atlasUrl: string;
  xRatio: number;
  footYRatio: number;
  idleSeconds: [number, number];
  workSeconds: [number, number];
};

const PRODUCE_TEXTURE_KEYS: Record<WholesaleMarketBackgroundMood, string> = {
  morning: "wholesale-market-produce-morning",
  noon: "wholesale-market-produce-noon",
  afternoon: "wholesale-market-produce-afternoon",
  night: "wholesale-market-produce-night",
  rain: "wholesale-market-produce-rain",
};
const SEAFOOD_TEXTURE_KEYS: Record<WholesaleMarketBackgroundMood, string> = {
  morning: "wholesale-market-seafood-morning",
  noon: "wholesale-market-seafood-noon",
  afternoon: "wholesale-market-seafood-morning",
  night: "wholesale-market-seafood-morning",
  rain: "wholesale-market-seafood-morning",
};
const ATLAS_COLUMNS = 4;
const ATLAS_ROWS = 2;
const IDLE_FPS = 2;
const WORK_FPS = 3;
const VENDOR_SCALE = 0.82;

const VENDORS: VendorDefinition[] = [
  {
    id: "butcher-auntie",
    textureKey: "market-vendor-butcher",
    atlasUrl: butcherAtlasUrl,
    xRatio: 0.16,
    footYRatio: 0.73,
    idleSeconds: [2.6, 5.2],
    workSeconds: [1.5, 2.4],
  },
  {
    id: "fishmonger-uncle",
    textureKey: "market-vendor-fishmonger",
    atlasUrl: fishmongerAtlasUrl,
    xRatio: 0.54,
    footYRatio: 0.68,
    idleSeconds: [2.2, 4.7],
    workSeconds: [1.4, 2.1],
  },
  {
    id: "crab-seller-auntie",
    textureKey: "market-vendor-crab-seller",
    atlasUrl: crabSellerAtlasUrl,
    xRatio: 0.87,
    footYRatio: 0.78,
    idleSeconds: [3.1, 5.8],
    workSeconds: [1.6, 2.6],
  },
];

export class WholesaleMarketScene extends Phaser.Scene {
  private devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
  private background?: Phaser.GameObjects.Image;
  private vendorSprites: Phaser.GameObjects.Sprite[] = [];
  private vendorShadows: Phaser.GameObjects.Ellipse[] = [];
  private logicalWidth = 0;
  private logicalHeight = 0;
  private mapWidth = 0;
  private section: WholesaleMarketSection = "exterior";
  private backgroundMood: WholesaleMarketBackgroundMood = "morning";
  private backgroundMoodProvider?: () => WholesaleMarketBackgroundMood;
  private horizontalDrag: { clientX: number; scrollX: number; pointerId: number } | null = null;
  private dragSurface?: HTMLCanvasElement;

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (!this.sys.isActive()) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    this.horizontalDrag = {
      clientX: event.clientX,
      scrollX: this.cameras.main.scrollX,
      pointerId: event.pointerId,
    };
    try {
      this.dragSurface?.setPointerCapture(event.pointerId);
    } catch {
      // A pointer can be canceled while the browser is changing focus.
    }
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.sys.isActive()) return;
    const drag = this.horizontalDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    this.cameras.main.setScroll(
      this.cameras.main.clampX(drag.scrollX - (event.clientX - drag.clientX)),
      0,
    );
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (this.horizontalDrag?.pointerId !== event.pointerId) return;
    this.horizontalDrag = null;
  };

  constructor() {
    super("wholesale-market");
  }

  setDevicePixelRatio(value: number): void {
    this.devicePixelRatio = Math.max(1, value || 1);
    if (!this.sys.isActive()) return;
    this.cameras.main.setZoom(this.devicePixelRatio);
    this.layout();
  }

  setBackgroundMoodProvider(provider: () => WholesaleMarketBackgroundMood): void {
    this.backgroundMoodProvider = provider;
    this.backgroundMood = provider();
  }

  getSection(): WholesaleMarketSection {
    return this.section;
  }

  setSection(section: WholesaleMarketSection): void {
    if (this.section === section) return;
    this.section = section;
    if (!this.background) return;
    const previousScroll = this.cameras.main.scrollX;
    this.background?.setTexture(this.getBackgroundTextureKey());
    this.applyBackgroundTint();
    const showVendors = section === "seafood";
    this.vendorSprites.forEach((sprite) => sprite.setVisible(showVendors));
    this.vendorShadows.forEach((shadow) => shadow.setVisible(showVendors));
    this.layout();
    this.cameras.main.setScroll(this.cameras.main.clampX(previousScroll), 0);
  }

  preload(): void {
    this.load.image(PRODUCE_TEXTURE_KEYS.morning, produceMorningUrl);
    this.load.image(PRODUCE_TEXTURE_KEYS.noon, produceNoonUrl);
    this.load.image(PRODUCE_TEXTURE_KEYS.afternoon, produceAfternoonUrl);
    this.load.image(PRODUCE_TEXTURE_KEYS.night, produceNightUrl);
    this.load.image(PRODUCE_TEXTURE_KEYS.rain, produceRainUrl);
    this.load.image(SEAFOOD_TEXTURE_KEYS.morning, seafoodMorningUrl);
    this.load.image(SEAFOOD_TEXTURE_KEYS.noon, seafoodNoonUrl);
    for (const asset of WHOLESALE_MARKET_EXTERIOR_ASSETS) {
      if (!this.textures.exists(asset.textureKey)) this.load.image(asset.textureKey, asset.url);
    }
    for (const vendor of VENDORS) this.load.image(vendor.textureKey, vendor.atlasUrl);
  }

  create(): void {
    this.cameras.main.setZoom(this.devicePixelRatio);
    this.cameras.main.setBackgroundColor(0x28241f);
    this.backgroundMood = this.backgroundMoodProvider?.() ?? this.backgroundMood;
    this.background = this.add.image(0, 0, this.getBackgroundTextureKey()).setOrigin(0, 0).setDepth(0);
    this.applyBackgroundTint();
    this.registerVendorAnimations();
    this.createVendors();
    this.dragSurface = this.game.canvas;
    this.dragSurface.addEventListener("pointerdown", this.onPointerDown);
    this.dragSurface.addEventListener("pointermove", this.onPointerMove);
    this.dragSurface.addEventListener("pointerup", this.onPointerUp);
    this.dragSurface.addEventListener("pointercancel", this.onPointerUp);
    this.dragSurface.addEventListener("lostpointercapture", this.onPointerUp);
    this.scale.on("resize", this.layout, this);
    this.events.on(Phaser.Scenes.Events.WAKE, this.onWake, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanUp, this);
    this.layout();
  }

  update(): void {
    const nextMood = this.backgroundMoodProvider?.();
    if (!nextMood || nextMood === this.backgroundMood) return;
    const previousScroll = this.cameras.main.scrollX;
    this.backgroundMood = nextMood;
    this.background?.setTexture(this.getBackgroundTextureKey());
    this.applyBackgroundTint();
    this.layout();
    this.cameras.main.setScroll(this.cameras.main.clampX(previousScroll), 0);
  }

  private getBackgroundTextureKey(): string {
    if (this.section === "exterior") return WHOLESALE_MARKET_EXTERIOR_TEXTURE_KEYS[this.backgroundMood];
    if (this.section === "produce") return PRODUCE_TEXTURE_KEYS[this.backgroundMood];
    return SEAFOOD_TEXTURE_KEYS[this.backgroundMood];
  }

  private applyBackgroundTint(): void {
    if (!this.background) return;
    if (this.section !== "seafood") {
      this.background.clearTint();
      return;
    }
    const tint = this.backgroundMood === "afternoon"
      ? 0xffd5aa
      : this.backgroundMood === "night"
        ? 0x7483a1
        : this.backgroundMood === "rain"
          ? 0x9aaabc
          : 0xffffff;
    this.background.setTint(tint);
  }

  private onWake(): void {
    this.cameras.main.setZoom(this.devicePixelRatio);
    this.layout();
  }

  private cleanUp(): void {
    this.dragSurface?.removeEventListener("pointerdown", this.onPointerDown);
    this.dragSurface?.removeEventListener("pointermove", this.onPointerMove);
    this.dragSurface?.removeEventListener("pointerup", this.onPointerUp);
    this.dragSurface?.removeEventListener("pointercancel", this.onPointerUp);
    this.dragSurface?.removeEventListener("lostpointercapture", this.onPointerUp);
    this.dragSurface = undefined;
    this.horizontalDrag = null;
    this.scale.off("resize", this.layout, this);
    this.events.off(Phaser.Scenes.Events.WAKE, this.onWake, this);
    this.vendorSprites.forEach((sprite) => sprite.destroy());
    this.vendorShadows.forEach((shadow) => shadow.destroy());
    this.vendorSprites = [];
    this.vendorShadows = [];
    this.background?.destroy();
    this.background = undefined;
  }

  private registerVendorAnimations(): void {
    for (const vendor of VENDORS) {
      const texture = this.textures.get(vendor.textureKey);
      const source = texture.getSourceImage() as HTMLImageElement;
      const frameWidth = Math.floor(source.width / ATLAS_COLUMNS);
      const frameHeight = Math.floor(source.height / ATLAS_ROWS);

      for (let column = 0; column < ATLAS_COLUMNS; column += 1) {
        const idleFrame = `idle-${column}`;
        const workFrame = `work-${column}`;
        if (!texture.has(idleFrame)) texture.add(idleFrame, 0, column * frameWidth, 0, frameWidth, frameHeight);
        if (!texture.has(workFrame)) texture.add(workFrame, 0, column * frameWidth, frameHeight, frameWidth, frameHeight);
      }

      this.createAnimation(`${vendor.textureKey}-idle`, vendor.textureKey, "idle", IDLE_FPS);
      this.createAnimation(`${vendor.textureKey}-work`, vendor.textureKey, "work", WORK_FPS);
    }
  }

  private createAnimation(key: string, textureKey: string, state: "idle" | "work", frameRate: number): void {
    if (this.anims.exists(key)) return;
    this.anims.create({
      key,
      frames: Array.from({ length: ATLAS_COLUMNS }, (_, index) => ({ key: textureKey, frame: `${state}-${index}` })),
      frameRate,
      repeat: -1,
    });
  }

  private createVendors(): void {
    this.vendorSprites = VENDORS.map((vendor) => {
      const sprite = this.add.sprite(0, 0, vendor.textureKey, "idle-0")
        .setOrigin(0.5, 1)
        .setDepth(3);
      sprite.play(`${vendor.textureKey}-idle`);
      this.scheduleWorkLoop(sprite, vendor);
      return sprite;
    });
    this.vendorShadows = VENDORS.map(() => this.add.ellipse(0, 0, 92, 18, 0x171614, 0.28).setDepth(2));
  }

  private scheduleWorkLoop(sprite: Phaser.GameObjects.Sprite, vendor: VendorDefinition): void {
    const idleMs = Phaser.Math.Between(vendor.idleSeconds[0] * 1000, vendor.idleSeconds[1] * 1000);
    this.time.delayedCall(idleMs, () => {
      if (!sprite.active || !this.sys.isActive()) return;
      sprite.play(`${vendor.textureKey}-work`);
      const workMs = Phaser.Math.Between(vendor.workSeconds[0] * 1000, vendor.workSeconds[1] * 1000);
      this.time.delayedCall(workMs, () => {
        if (!sprite.active || !this.sys.isActive()) return;
        sprite.play(`${vendor.textureKey}-idle`);
        this.scheduleWorkLoop(sprite, vendor);
      });
    });
  }

  private layout(): void {
    if (!this.background || this.vendorSprites.length !== VENDORS.length) return;
    this.logicalWidth = this.scale.width / this.devicePixelRatio;
    this.logicalHeight = this.scale.height / this.devicePixelRatio;
    if (this.logicalWidth <= 0 || this.logicalHeight <= 0) return;

    const source = this.background.texture.getSourceImage() as HTMLImageElement;
    const mapScale = this.logicalHeight / source.height;
    this.mapWidth = source.width * mapScale;
    this.background.setPosition(0, 0).setDisplaySize(this.mapWidth, this.logicalHeight);
    this.vendorSprites.forEach((sprite, index) => {
      const vendor = VENDORS[index];
      const x = this.mapWidth * vendor.xRatio;
      const footY = this.logicalHeight * vendor.footYRatio;
      sprite
        .setPosition(x, footY)
        .setScale(mapScale * VENDOR_SCALE)
        .setDepth(3 + footY / this.logicalHeight);
      this.vendorShadows[index]
        .setPosition(x, footY - 2 * mapScale)
        .setDisplaySize(66 * mapScale, 12 * mapScale)
        .setDepth(2 + footY / this.logicalHeight);
    });

    const camera = this.cameras.main;
    camera.setBounds(0, 0, this.mapWidth, this.logicalHeight);
    const maxScroll = Math.max(0, this.mapWidth - this.logicalWidth);
    camera.setScroll(maxScroll * 0.5, 0);
  }
}
