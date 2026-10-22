import Phaser from "phaser";
import "./market-stall-boards.css";
import market01MorningUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-01-morning.png?url";
import market01NoonUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-01-noon.png?url";
import market01AfternoonUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-01-afternoon.png?url";
import market01NightUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-01-night.png?url";
import market01RainUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-01-rain.png?url";
import market02MorningUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-02-morning.png?url";
import market02NoonUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-02-noon.png?url";
import market02AfternoonUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-02-afternoon.png?url";
import market02NightUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-02-night.png?url";
import market02RainUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-02-rain.png?url";
import market03MorningUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-03-morning.png?url";
import market03NoonUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-03-noon.png?url";
import market03AfternoonUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-03-afternoon.png?url";
import market03NightUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-03-night.png?url";
import market03RainUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-03-rain.png?url";
import market04MorningUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-04-morning.png?url";
import market04NoonUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-04-noon.png?url";
import market04AfternoonUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-04-afternoon.png?url";
import market04NightUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-04-night.png?url";
import market04RainUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-04-rain.png?url";
import market05MorningUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-05-morning.png?url";
import market05NoonUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-05-noon.png?url";
import market05AfternoonUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-05-afternoon.png?url";
import market05NightUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-05-night.png?url";
import market05RainUrl from "../../assets/backgrounds/wholesale-market/redesign-v2/market-05-rain.png?url";
import {
  WHOLESALE_MARKET_EXTERIOR_ASSETS,
  type WholesaleMarketBackgroundMood,
  type WholesaleMarketLightingState,
  type WholesaleMarketTimeOfDay,
} from "../config/wholesaleMarket";

export type { WholesaleMarketBackgroundMood, WholesaleMarketLightingState, WholesaleMarketTimeOfDay } from "../config/wholesaleMarket";

export const WHOLESALE_MARKET_INTERIOR_SECTIONS = [
  "grocery",
  "grocery-clothing",
  "meat-fish",
  "seafood-vegetables",
  "shoes-bags",
] as const;

export type WholesaleMarketInteriorSection = typeof WHOLESALE_MARKET_INTERIOR_SECTIONS[number];
export type WholesaleMarketSection = "exterior" | WholesaleMarketInteriorSection;

interface InteriorBackgroundAsset {
  textureKey: string;
  url: string;
}

type InteriorBackgroundAssets = Record<WholesaleMarketBackgroundMood, InteriorBackgroundAsset>;

function createInteriorBackgroundAssets(
  section: WholesaleMarketInteriorSection,
  urls: Record<WholesaleMarketBackgroundMood, string>,
): InteriorBackgroundAssets {
  return {
    morning: { textureKey: `wholesale-market-${section}-morning`, url: urls.morning },
    noon: { textureKey: `wholesale-market-${section}-noon`, url: urls.noon },
    afternoon: { textureKey: `wholesale-market-${section}-afternoon`, url: urls.afternoon },
    night: { textureKey: `wholesale-market-${section}-night`, url: urls.night },
    rain: { textureKey: `wholesale-market-${section}-rain`, url: urls.rain },
  };
}

const INTERIOR_BACKGROUND_ASSETS: Record<WholesaleMarketInteriorSection, InteriorBackgroundAssets> = {
  // Map 1: fruit and spices.
  grocery: createInteriorBackgroundAssets("grocery", {
    morning: market01MorningUrl,
    noon: market01NoonUrl,
    afternoon: market01AfternoonUrl,
    night: market01NightUrl,
    rain: market01RainUrl,
  }),
  // Map 2: grocery and clothing.
  "grocery-clothing": createInteriorBackgroundAssets("grocery-clothing", {
    morning: market02MorningUrl,
    noon: market02NoonUrl,
    afternoon: market02AfternoonUrl,
    night: market02NightUrl,
    rain: market02RainUrl,
  }),
  // Map 3: meat and fish.
  "meat-fish": createInteriorBackgroundAssets("meat-fish", {
    morning: market03MorningUrl,
    noon: market03NoonUrl,
    afternoon: market03AfternoonUrl,
    night: market03NightUrl,
    rain: market03RainUrl,
  }),
  // Map 4: seafood and vegetables.
  "seafood-vegetables": createInteriorBackgroundAssets("seafood-vegetables", {
    morning: market04MorningUrl,
    noon: market04NoonUrl,
    afternoon: market04AfternoonUrl,
    night: market04NightUrl,
    rain: market04RainUrl,
  }),
  // Map 5: shoes and bags.
  "shoes-bags": createInteriorBackgroundAssets("shoes-bags", {
    morning: market05MorningUrl,
    noon: market05NoonUrl,
    afternoon: market05AfternoonUrl,
    night: market05NightUrl,
    rain: market05RainUrl,
  }),
};

export class WholesaleMarketScene extends Phaser.Scene {
  private devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
  private background?: Phaser.GameObjects.Image;
  private backgroundTransition?: Phaser.GameObjects.Image;
  private backgroundOvercast?: Phaser.GameObjects.Image;
  private logicalWidth = 0;
  private logicalHeight = 0;
  private mapWidth = 0;
  private section: WholesaleMarketSection = "exterior";
  private lightingState: WholesaleMarketLightingState = { from: "morning", to: "morning", blend: 0, rain: 0 };
  private backgroundLightingProvider?: () => WholesaleMarketLightingState;
  private horizontalDrag: { clientX: number; scrollX: number; pointerId: number } | null = null;
  private verticalDrag: { clientX: number; clientY: number; pointerId: number } | null = null;
  private verticalSwipeRecognized = false;
  private readonly pendingBackgroundLoads = new Set<string>();
  private dragSurface?: HTMLCanvasElement;

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (!this.sys.isActive()) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (this.section === "exterior") {
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
      return;
    }

    this.verticalDrag = { clientX: event.clientX, clientY: event.clientY, pointerId: event.pointerId };
    this.verticalSwipeRecognized = false;
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.sys.isActive()) return;
    if (this.section === "exterior") {
      const drag = this.horizontalDrag;
      if (!drag || event.pointerId !== drag.pointerId) return;
      event.preventDefault();
      this.cameras.main.setScroll(
        this.cameras.main.clampX(drag.scrollX - (event.clientX - drag.clientX)),
        0,
      );
      return;
    }

    const drag = this.verticalDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const offsetX = event.clientX - drag.clientX;
    const offsetY = event.clientY - drag.clientY;
    if (Math.abs(offsetY) < 20 || Math.abs(offsetY) < Math.abs(offsetX) * 1.15) return;
    event.preventDefault();
    if (!this.verticalSwipeRecognized) {
      this.verticalSwipeRecognized = true;
      try {
        this.dragSurface?.setPointerCapture(event.pointerId);
      } catch {
        // Continue with pointer events when capture is unavailable.
      }
    }
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (this.horizontalDrag?.pointerId === event.pointerId) {
      this.horizontalDrag = null;
      return;
    }
    const drag = this.verticalDrag;
    if (drag?.pointerId !== event.pointerId) return;
    this.verticalDrag = null;
    this.verticalSwipeRecognized = false;
    const offsetX = event.clientX - drag.clientX;
    const offsetY = event.clientY - drag.clientY;
    if (Math.abs(offsetY) >= 38 && Math.abs(offsetY) > Math.abs(offsetX) * 1.15) {
      this.advanceSection(offsetY > 0 ? 1 : -1);
    }
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

  setBackgroundLightingProvider(provider: () => WholesaleMarketLightingState): void {
    this.backgroundLightingProvider = provider;
    this.lightingState = provider();
  }

  getSection(): WholesaleMarketSection {
    return this.section;
  }

  getInteriorSectionIndex(): number {
    return this.section === "exterior" ? -1 : WHOLESALE_MARKET_INTERIOR_SECTIONS.indexOf(this.section);
  }

  advanceSection(direction: -1 | 1): boolean {
    const currentIndex = this.getInteriorSectionIndex();
    const nextIndex = this.section === "exterior" && direction > 0 ? 0 : currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= WHOLESALE_MARKET_INTERIOR_SECTIONS.length) return false;
    this.setSection(WHOLESALE_MARKET_INTERIOR_SECTIONS[nextIndex]);
    return true;
  }

  setSection(section: WholesaleMarketSection): void {
    if (this.section === section) return;
    this.section = section;
    this.events.emit("market-section-changed", section);
    this.horizontalDrag = null;
    this.verticalDrag = null;
    this.verticalSwipeRecognized = false;
    this.showCurrentBackground();
  }

  preload(): void {
    this.lightingState = this.backgroundLightingProvider?.() ?? this.lightingState;
    for (const asset of WHOLESALE_MARKET_EXTERIOR_ASSETS) {
      if (!this.textures.exists(asset.textureKey)) this.load.image(asset.textureKey, asset.url);
    }
    for (const section of WHOLESALE_MARKET_INTERIOR_SECTIONS) {
      const asset = INTERIOR_BACKGROUND_ASSETS[section][this.lightingState.from];
      if (!this.textures.exists(asset.textureKey)) this.load.image(asset.textureKey, asset.url);
    }
  }

  create(): void {
    this.cameras.main.setZoom(this.devicePixelRatio);
    this.cameras.main.setBackgroundColor(0x28241f);
    this.lightingState = this.backgroundLightingProvider?.() ?? this.lightingState;
    const initialTexture = this.getBackgroundAsset(this.lightingState.from).textureKey;
    this.background = this.add.image(0, 0, initialTexture).setOrigin(0, 0).setDepth(0);
    this.backgroundTransition = this.add.image(0, 0, initialTexture)
      .setOrigin(0, 0).setDepth(1).setAlpha(0).setVisible(false);
    this.backgroundOvercast = this.add.image(0, 0, initialTexture)
      .setOrigin(0, 0).setDepth(2).setAlpha(0).setVisible(false);
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
    this.updateBackgroundLighting();
  }

  update(): void {
    const nextLighting = this.backgroundLightingProvider?.();
    if (nextLighting) {
      this.lightingState = nextLighting;
      this.updateBackgroundLighting();
    }
  }

  private getBackgroundAsset(mood: WholesaleMarketBackgroundMood): { textureKey: string; url: string } {
    if (this.section === "exterior") {
      const asset = WHOLESALE_MARKET_EXTERIOR_ASSETS.find((candidate) => candidate.mood === mood);
      if (asset) return asset;
    }
    return INTERIOR_BACKGROUND_ASSETS[this.section as WholesaleMarketInteriorSection][mood];
  }

  private showCurrentBackground(): void {
    if (!this.background) return;
    const previousScroll = this.cameras.main.scrollX;
    this.updateBackgroundLighting();
    this.layout();
    if (this.section === "exterior") this.cameras.main.setScroll(this.cameras.main.clampX(previousScroll), 0);
  }

  private updateBackgroundLighting(): void {
    if (!this.background || !this.backgroundTransition || !this.backgroundOvercast) return;
    const baseMood = this.lightingState.from;
    const transitionMood = this.lightingState.to;
    const baseAsset = this.getBackgroundAsset(baseMood);
    const transitionAsset = this.getBackgroundAsset(transitionMood);
    const rainAsset = this.getBackgroundAsset("rain");
    for (const asset of [baseAsset, transitionAsset, rainAsset]) {
      if (!this.textures.exists(asset.textureKey)) this.requestBackgroundAsset(asset);
    }
    const hasBase = this.textures.exists(baseAsset.textureKey);
    const hasTransition = this.textures.exists(transitionAsset.textureKey);
    const hasRain = this.textures.exists(rainAsset.textureKey);
    if (!hasBase) return;

    let textureChanged = false;
    if (this.background.texture.key !== baseAsset.textureKey) {
      this.background.setTexture(baseAsset.textureKey);
      textureChanged = true;
    }
    if (hasTransition && this.backgroundTransition.texture.key !== transitionAsset.textureKey) {
      this.backgroundTransition.setTexture(transitionAsset.textureKey);
      textureChanged = true;
    }
    if (hasRain && this.backgroundOvercast.texture.key !== rainAsset.textureKey) {
      this.backgroundOvercast.setTexture(rainAsset.textureKey);
      textureChanged = true;
    }
    this.backgroundTransition
      .setAlpha(hasTransition ? Phaser.Math.Clamp(this.lightingState.blend, 0, 1) : 0)
      .setVisible(hasTransition && this.lightingState.blend > 0.001);
    this.backgroundOvercast
      .setAlpha(hasRain ? Phaser.Math.Clamp(this.lightingState.rain, 0, 1) : 0)
      .setVisible(hasRain && this.lightingState.rain > 0.001);
    if (textureChanged) {
      const previousScroll = this.cameras.main.scrollX;
      this.layout();
      if (this.section === "exterior") this.cameras.main.setScroll(this.cameras.main.clampX(previousScroll), 0);
    }
  }

  private requestBackgroundAsset(asset: { textureKey: string; url: string }): void {
    if (this.pendingBackgroundLoads.has(asset.textureKey)) return;
    this.pendingBackgroundLoads.add(asset.textureKey);
    const completeEvent = `filecomplete-image-${asset.textureKey}`;
    const handleLoadError = (file: Phaser.Loader.File): void => {
      if (file.key !== asset.textureKey) return;
      this.pendingBackgroundLoads.delete(asset.textureKey);
      this.load.off("loaderror", handleLoadError);
    };
    this.load.once(completeEvent, () => {
      this.pendingBackgroundLoads.delete(asset.textureKey);
      this.load.off("loaderror", handleLoadError);
      this.updateBackgroundLighting();
    });
    this.load.on("loaderror", handleLoadError);
    this.load.image(asset.textureKey, asset.url);
    if (!this.load.isLoading()) this.load.start();
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
    this.verticalDrag = null;
    this.verticalSwipeRecognized = false;
    this.pendingBackgroundLoads.clear();
    this.scale.off("resize", this.layout, this);
    this.events.off(Phaser.Scenes.Events.WAKE, this.onWake, this);
    this.background?.destroy();
    this.background = undefined;
    this.backgroundTransition?.destroy();
    this.backgroundTransition = undefined;
    this.backgroundOvercast?.destroy();
    this.backgroundOvercast = undefined;
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
      for (const layer of [this.backgroundTransition, this.backgroundOvercast]) {
        layer?.setPosition(0, 0).setDisplaySize(this.mapWidth, this.logicalHeight);
      }
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
    for (const layer of [this.backgroundTransition, this.backgroundOvercast]) {
      layer
        ?.setPosition((this.logicalWidth - displayWidth) * 0.5, (this.logicalHeight - displayHeight) * 0.5)
        .setDisplaySize(displayWidth, displayHeight);
    }
    camera.setBounds(0, 0, this.logicalWidth, this.logicalHeight);
    camera.setScroll(0, 0);
  }
}
