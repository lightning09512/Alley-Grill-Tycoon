import level01Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-01.png?url";
import level02Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-02.png?url";
import level03Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-03.png?url";
import level04Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-04.png?url";
import level05Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-05.png?url";
import level06Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-06.png?url";
import level07Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-07.png?url";
import level08Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-08.png?url";
import level09Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-09.png?url";
import level10Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-10.png?url";
import level11Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-11.png?url";
import level12Url from "../../assets/backgrounds/home-interiors-upgrades-12/home-interior-level-12.png?url";

export const HOME_INTERIOR_STAGES = [
  level01Url,
  level02Url,
  level03Url,
  level04Url,
  level05Url,
  level06Url,
  level07Url,
  level08Url,
  level09Url,
  level10Url,
  level11Url,
  level12Url,
] as const;

export const HOME_INTERIOR_STAGE_COUNT = HOME_INTERIOR_STAGES.length;

export function getHomeInteriorStage(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(HOME_INTERIOR_STAGE_COUNT, Math.round(value)));
}

export function getHomeInteriorStageUrl(stage: number): string {
  return HOME_INTERIOR_STAGES[getHomeInteriorStage(stage) - 1];
}

export function getHomeInteriorStageTextureKey(stage: number): string {
  return `home-interior-map-${getHomeInteriorStage(stage)}`;
}
