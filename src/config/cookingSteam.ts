/** Steam origins are anchored at the rim of a visible pot or cooking surface. */
export type CookingSteamPoint = {
  /** X coordinate in the source image. */
  x: number;
  /** Y coordinate at the pot rim / grill surface in the source image. */
  y: number;
  /** Relative to the deliberately small, narrow steam sprite. */
  size?: number;
  intervalMs?: number;
};

/** Hot cookware painted into the four-shop 2172 × 1280 street panorama. */
export const STREET_COOKING_STEAM_POINTS: readonly CookingSteamPoint[] = [
  { x: 630, y: 700, size: 0.56, intervalMs: 2_250 },
  { x: 1_555, y: 705, size: 0.48, intervalMs: 2_700 },
];

/** Cooking origins in each stage image, only where a grill is visibly open. */
export const SHOP_COOKING_STEAM_POINTS: Readonly<Record<number, readonly CookingSteamPoint[]>> = {
  // Levels 1–4 have covered grills; levels 10–12 cook behind the screened entry.
  5: [{ x: 1_264, y: 666, size: 0.54, intervalMs: 2_300 }],
  6: [{ x: 1_267, y: 727, size: 0.54, intervalMs: 2_300 }],
  7: [{ x: 1_268, y: 744, size: 0.54, intervalMs: 2_300 }],
  8: [{ x: 1_269, y: 747, size: 0.54, intervalMs: 2_300 }],
  9: [{ x: 1_353, y: 750, size: 0.50, intervalMs: 2_500 }],
};
