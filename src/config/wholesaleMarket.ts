import exteriorMorningUrl from "../../assets/backgrounds/wholesale-market/exterior/wholesale-market-exterior-morning.png?url";
import exteriorNoonUrl from "../../assets/backgrounds/wholesale-market/exterior/wholesale-market-exterior-noon.png?url";
import exteriorAfternoonUrl from "../../assets/backgrounds/wholesale-market/exterior/wholesale-market-exterior-afternoon.png?url";
import exteriorNightUrl from "../../assets/backgrounds/wholesale-market/exterior/wholesale-market-exterior-night.png?url";
import exteriorRainUrl from "../../assets/backgrounds/wholesale-market/exterior/wholesale-market-exterior-rain.png?url";

export type WholesaleMarketTimeOfDay = "morning" | "noon" | "afternoon" | "night";
export type WholesaleMarketBackgroundMood = WholesaleMarketTimeOfDay | "rain";

export const WHOLESALE_MARKET_EXTERIOR_SIZE = { width: 1_672, height: 941 } as const;

export const WHOLESALE_MARKET_EXTERIOR_ASSETS: readonly {
  mood: WholesaleMarketBackgroundMood;
  textureKey: string;
  url: string;
}[] = [
  { mood: "morning", textureKey: "wholesale-market-exterior-morning", url: exteriorMorningUrl },
  { mood: "noon", textureKey: "wholesale-market-exterior-noon", url: exteriorNoonUrl },
  { mood: "afternoon", textureKey: "wholesale-market-exterior-afternoon", url: exteriorAfternoonUrl },
  { mood: "night", textureKey: "wholesale-market-exterior-night", url: exteriorNightUrl },
  { mood: "rain", textureKey: "wholesale-market-exterior-rain", url: exteriorRainUrl },
];

export const WHOLESALE_MARKET_EXTERIOR_TEXTURE_KEYS: Record<WholesaleMarketBackgroundMood, string> = {
  morning: "wholesale-market-exterior-morning",
  noon: "wholesale-market-exterior-noon",
  afternoon: "wholesale-market-exterior-afternoon",
  night: "wholesale-market-exterior-night",
  rain: "wholesale-market-exterior-rain",
};
