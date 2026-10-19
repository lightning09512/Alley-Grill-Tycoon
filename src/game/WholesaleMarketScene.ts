import Phaser from "phaser";
import produceMorningUrl from "../../assets/backgrounds/wholesale-market/interior-produce/portrait-v2/produce-morning.png?url";
import produceNoonUrl from "../../assets/backgrounds/wholesale-market/interior-produce/portrait-v2/produce-noon.png?url";
import produceAfternoonUrl from "../../assets/backgrounds/wholesale-market/interior-produce/portrait-v2/produce-afternoon.png?url";
import produceNightUrl from "../../assets/backgrounds/wholesale-market/interior-produce/portrait-v2/produce-night.png?url";
import produceRainUrl from "../../assets/backgrounds/wholesale-market/interior-produce/portrait-v2/produce-rain.png?url";
import seafoodMorningUrl from "../../assets/backgrounds/wholesale-market/interior-seafood/portrait-v2/seafood-morning.png?url";
import seafoodNoonUrl from "../../assets/backgrounds/wholesale-market/interior-seafood/portrait-v2/seafood-noon.png?url";
import seafoodAfternoonUrl from "../../assets/backgrounds/wholesale-market/interior-seafood/portrait-v2/seafood-afternoon.png?url";
import seafoodNightUrl from "../../assets/backgrounds/wholesale-market/interior-seafood/portrait-v2/seafood-night.png?url";
import seafoodRainUrl from "../../assets/backgrounds/wholesale-market/interior-seafood/portrait-v2/seafood-rain.png?url";
import heldBasketUrl from "../../assets/characters/market-player/held-basket.png?url";
import {
  WHOLESALE_MARKET_EXTERIOR_ASSETS,
  WHOLESALE_MARKET_EXTERIOR_TEXTURE_KEYS,
  type WholesaleMarketBackgroundMood,
} from "../config/wholesaleMarket";

export type { WholesaleMarketBackgroundMood, WholesaleMarketTimeOfDay } from "../config/wholesaleMarket";

export type WholesaleMarketSection = "exterior" | "produce" | "seafood";

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
  afternoon: "wholesale-market-seafood-afternoon",
  night: "wholesale-market-seafood-night",
  rain: "wholesale-market-seafood-rain",
};
const HELD_BASKET_TEXTURE_KEY = "wholesale-market-held-basket";

export class WholesaleMarketScene extends Phaser.Scene {
  private devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
  private background?: Phaser.GameObjects.Image;
  private heldBasket?: Phaser.GameObjects.Image;
  private logicalWidth = 0;
  private logicalHeight = 0;
  private mapWidth = 0;
  private section: WholesaleMarketSection = "exterior";
  private backgroundMood: WholesaleMarketBackgroundMood = "morning";
  private backgroundMoodProvider?: () => WholesaleMarketBackgroundMood;
  private horizontalDrag: { clientX: number; scrollX: number; pointerId: number } | null = null;
  private dragSurface?: HTMLCanvasElement;

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (!this.sys.isActive() || this.section !== "exterior") return;
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
    if (!this.sys.isActive() || this.section !== "exterior") return;
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
    this.clearBackgroundTint();
    this.heldBasket?.setVisible(section !== "exterior");
    this.horizontalDrag = null;
    this.layout();
    if (section === "exterior") this.cameras.main.setScroll(this.cameras.main.clampX(previousScroll), 0);
  }

  preload(): void {
    this.load.image(PRODUCE_TEXTURE_KEYS.morning, produceMorningUrl);
    this.load.image(PRODUCE_TEXTURE_KEYS.noon, produceNoonUrl);
    this.load.image(PRODUCE_TEXTURE_KEYS.afternoon, produceAfternoonUrl);
    this.load.image(PRODUCE_TEXTURE_KEYS.night, produceNightUrl);
    this.load.image(PRODUCE_TEXTURE_KEYS.rain, produceRainUrl);
    this.load.image(SEAFOOD_TEXTURE_KEYS.morning, seafoodMorningUrl);
    this.load.image(SEAFOOD_TEXTURE_KEYS.noon, seafoodNoonUrl);
    this.load.image(SEAFOOD_TEXTURE_KEYS.afternoon, seafoodAfternoonUrl);
    this.load.image(SEAFOOD_TEXTURE_KEYS.night, seafoodNightUrl);
    this.load.image(SEAFOOD_TEXTURE_KEYS.rain, seafoodRainUrl);
    for (const asset of WHOLESALE_MARKET_EXTERIOR_ASSETS) {
      if (!this.textures.exists(asset.textureKey)) this.load.image(asset.textureKey, asset.url);
    }
    this.load.image(HELD_BASKET_TEXTURE_KEY, heldBasketUrl);
  }

  create(): void {
    this.cameras.main.setZoom(this.devicePixelRatio);
    this.cameras.main.setBackgroundColor(0x28241f);
    this.backgroundMood = this.backgroundMoodProvider?.() ?? this.backgroundMood;
    this.background = this.add.image(0, 0, this.getBackgroundTextureKey()).setOrigin(0, 0).setDepth(0);
    this.heldBasket = this.add.image(0, 0, HELD_BASKET_TEXTURE_KEY)
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(10)
      .setVisible(this.section !== "exterior");
    this.clearBackgroundTint();
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

  update(time: number): void {
    if (this.heldBasket?.visible) {
      this.heldBasket
        .setPosition(
          this.logicalWidth * 0.5 + Math.sin(time * 0.0016) * 0.8,
          this.logicalHeight + Math.sin(time * 0.0032) * 2,
        )
        .setRotation(Math.sin(time * 0.0016) * 0.003);
    }
    const nextMood = this.backgroundMoodProvider?.();
    if (!nextMood || nextMood === this.backgroundMood) return;
    const previousScroll = this.cameras.main.scrollX;
    this.backgroundMood = nextMood;
    this.background?.setTexture(this.getBackgroundTextureKey());
    this.clearBackgroundTint();
    this.layout();
    if (this.section === "exterior") this.cameras.main.setScroll(this.cameras.main.clampX(previousScroll), 0);
  }

  private getBackgroundTextureKey(): string {
    if (this.section === "exterior") return WHOLESALE_MARKET_EXTERIOR_TEXTURE_KEYS[this.backgroundMood];
    if (this.section === "produce") return PRODUCE_TEXTURE_KEYS[this.backgroundMood];
    return SEAFOOD_TEXTURE_KEYS[this.backgroundMood];
  }

  private clearBackgroundTint(): void {
    if (!this.background) return;
    this.background.clearTint();
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
    this.heldBasket?.destroy();
    this.heldBasket = undefined;
    this.background?.destroy();
    this.background = undefined;
  }

  private layout(): void {
    if (!this.background) return;
    this.logicalWidth = this.scale.width / this.devicePixelRatio;
    this.logicalHeight = this.scale.height / this.devicePixelRatio;
    if (this.logicalWidth <= 0 || this.logicalHeight <= 0) return;

    const source = this.background.texture.getSourceImage() as HTMLImageElement;
    const camera = this.cameras.main;
    if (this.section === "exterior") {
      const mapScale = this.logicalHeight / source.height;
      this.mapWidth = source.width * mapScale;
      this.background.setPosition(0, 0).setDisplaySize(this.mapWidth, this.logicalHeight);
      camera.setBounds(0, 0, this.mapWidth, this.logicalHeight);
      camera.setScroll(Math.max(0, this.mapWidth - this.logicalWidth) * 0.5, 0);
      return;
    }

    const portraitScale = Math.max(this.logicalWidth / source.width, this.logicalHeight / source.height);
    const displayWidth = source.width * portraitScale;
    const displayHeight = source.height * portraitScale;
    this.mapWidth = this.logicalWidth;
    this.background
      .setPosition((this.logicalWidth - displayWidth) * 0.5, (this.logicalHeight - displayHeight) * 0.5)
      .setDisplaySize(displayWidth, displayHeight);
    this.heldBasket?.setPosition(this.logicalWidth * 0.5, this.logicalHeight)
      .setDisplaySize(this.logicalWidth * 0.82, this.logicalHeight * 0.82);
    camera.setBounds(0, 0, this.logicalWidth, this.logicalHeight);
    camera.setScroll(0, 0);
  }
}
