export type DiningPartyType = "family" | "friends";

export interface DiningPartyTemplate {
  type: DiningPartyType;
  characterIds: readonly string[];
  hasBackFacingGuest: boolean;
}

type PartySize = 2 | 3 | 4;
type DiningPartyProfile = { characterIds: readonly string[]; weight: number };

export interface DiningPartySelectionState {
  randomState: number;
  partySizeBag: PartySize[];
  partyTypeBag: DiningPartyType[];
  backFacingBag: boolean[];
  recentPartyTypes: DiningPartyType[];
  recentLineups: { type: DiningPartyType; characterIds: string[] }[];
}

export interface DiningFamilyContext {
  hasFather: boolean;
  hasMother: boolean;
  hasChild: boolean;
  fatherIndex: number | null;
  motherIndex: number | null;
  childIndices: number[];
}

const profile = (characterIds: string[], weight = 2): DiningPartyProfile => ({ characterIds, weight });

// The available IDs below were checked against sprite-gen-dining: each one has
// a game-atlas.png and game-manifest.json for walking, seating, and eating.
// Weights favor everyday groups; the funny chibi combinations appear less often.
const PARTY_PROFILES: Record<DiningPartyType, Record<PartySize, readonly DiningPartyProfile[]>> = {
  family: {
    2: [
      profile(["saigon-young-mother", "saigon-schoolboy"], 3),
      profile(["saigon-young-mother", "saigon-schoolgirl"], 3),
      profile(["saigon-older-regular", "saigon-young-mother"], 2),
      profile(["saigon-comic-uncle", "saigon-comic-auntie"], 1),
      profile(["saigon-comic-auntie", "saigon-schoolgirl"], 1),
      profile(["saigon-comic-uncle", "saigon-schoolboy"], 1),
      profile(["saigon-comic-uncle", "saigon-schoolgirl"], 1),
      profile(["saigon-schoolboy", "saigon-schoolgirl"], 2),
    ],
    3: [
      profile(["saigon-older-regular", "saigon-young-mother", "saigon-schoolboy"], 3),
      profile(["saigon-older-regular", "saigon-young-mother", "saigon-schoolgirl"], 3),
      profile(["saigon-young-mother", "saigon-schoolboy", "saigon-schoolgirl"], 3),
      profile(["saigon-comic-uncle", "saigon-comic-auntie", "saigon-schoolboy"], 1),
      profile(["saigon-comic-uncle", "saigon-comic-auntie", "saigon-schoolgirl"], 1),
      profile(["saigon-young-mother", "saigon-comic-auntie", "saigon-schoolgirl"], 2),
      profile(["saigon-older-regular", "saigon-comic-auntie", "saigon-schoolgirl"], 1),
    ],
    4: [
      profile(["saigon-older-regular", "saigon-young-mother", "saigon-schoolboy", "saigon-schoolgirl"], 3),
      profile(["saigon-comic-uncle", "saigon-comic-auntie", "saigon-schoolboy", "saigon-schoolgirl"], 1),
    ],
  },
  friends: {
    2: [
      profile(["saigon-genz-nightowl", "saigon-food-reviewer"], 3),
      profile(["saigon-office-woman", "saigon-office-man"], 3),
      profile(["saigon-delivery-rider", "saigon-construction-worker"], 2),
      profile(["saigon-comic-uncle", "saigon-comic-foodie"], 1),
      profile(["saigon-comic-uncle", "saigon-comic-auntie"], 1),
      profile(["saigon-comic-auntie", "saigon-food-reviewer"], 1),
      profile(["saigon-office-man", "saigon-backpacker-tourist"], 2),
      profile(["saigon-office-woman", "saigon-taphoa-college-girl"], 2),
      profile(["saigon-genz-nightowl", "saigon-taphoa-college-girl"], 2),
      profile(["saigon-taphoa-college-girl", "saigon-taphoa-student-boy"], 2),
      profile(["saigon-backpacker-tourist", "saigon-market-shopper"], 2),
      profile(["saigon-ingredient-supplier", "saigon-delivery-rider"], 2),
      profile(["saigon-lottery-vendor", "saigon-street-sweeper"], 2),
      profile(["saigon-ward-inspector", "saigon-ward-police-officer"], 2),
      profile(["saigon-morning-jogger", "saigon-market-shopper"], 2),
      profile(["saigon-comic-foodie", "saigon-market-shopper"], 1),
      profile(["saigon-delivery-rider", "saigon-food-reviewer"], 2),
      profile(["saigon-construction-worker", "saigon-ingredient-supplier"], 2),
      profile(["saigon-genz-nightowl", "saigon-backpacker-tourist"], 2),
      profile(["saigon-office-man", "saigon-taphoa-student-boy"], 2),
    ],
    3: [
      profile(["saigon-genz-nightowl", "saigon-food-reviewer", "saigon-taphoa-college-girl"], 3),
      profile(["saigon-office-woman", "saigon-office-man", "saigon-backpacker-tourist"], 3),
      profile(["saigon-comic-uncle", "saigon-comic-foodie", "saigon-food-reviewer"], 1),
      profile(["saigon-delivery-rider", "saigon-construction-worker", "saigon-ingredient-supplier"], 2),
      profile(["saigon-morning-jogger", "saigon-street-sweeper", "saigon-market-shopper"], 2),
      profile(["saigon-ward-inspector", "saigon-ward-police-officer", "saigon-ingredient-supplier"], 2),
      profile(["saigon-taphoa-college-girl", "saigon-taphoa-student-boy", "saigon-genz-nightowl"], 3),
      profile(["saigon-comic-auntie", "saigon-comic-foodie", "saigon-market-shopper"], 1),
      profile(["saigon-market-shopper", "saigon-backpacker-tourist", "saigon-food-reviewer"], 2),
      profile(["saigon-lottery-vendor", "saigon-ingredient-supplier", "saigon-office-man"], 2),
      profile(["saigon-delivery-rider", "saigon-food-reviewer", "saigon-backpacker-tourist"], 2),
      profile(["saigon-comic-uncle", "saigon-comic-auntie", "saigon-comic-foodie"], 1),
      profile(["saigon-office-man", "saigon-construction-worker", "saigon-ingredient-supplier"], 2),
      profile(["saigon-office-woman", "saigon-genz-nightowl", "saigon-market-shopper"], 2),
    ],
    4: [
      profile(["saigon-genz-nightowl", "saigon-food-reviewer", "saigon-backpacker-tourist", "saigon-market-shopper"], 2),
      profile(["saigon-delivery-rider", "saigon-construction-worker", "saigon-office-man", "saigon-food-reviewer"], 2),
    ],
  },
};

const SIZE_DISTRIBUTION: readonly PartySize[] = [
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  3, 3, 3, 3, 3,
  4,
];

function nonZeroSeed(seed: number): number {
  const normalized = seed >>> 0;
  return normalized || 0x6d2b79f5;
}

export function createDiningPartySelectionState(seed = Math.floor(Math.random() * 0xffffffff)): DiningPartySelectionState {
  return {
    randomState: nonZeroSeed(seed),
    partySizeBag: [],
    partyTypeBag: [],
    backFacingBag: [],
    recentPartyTypes: [],
    recentLineups: [],
  };
}

export function restoreDiningPartySelectionState(value: unknown): DiningPartySelectionState {
  const saved = value && typeof value === "object" ? value as Partial<DiningPartySelectionState> : {};
  const sizes = Array.isArray(saved.partySizeBag)
    ? saved.partySizeBag.filter((size): size is PartySize => size === 2 || size === 3 || size === 4)
    : [];
  const types = Array.isArray(saved.partyTypeBag)
    ? saved.partyTypeBag.filter((type): type is DiningPartyType => type === "family" || type === "friends")
    : [];
  const backFacing = Array.isArray(saved.backFacingBag)
    ? saved.backFacingBag.filter((value): value is boolean => typeof value === "boolean")
    : [];
  const recentLineups = Array.isArray(saved.recentLineups)
    ? saved.recentLineups
      .filter((lineup): lineup is { type: DiningPartyType; characterIds: string[] } => Boolean(
        lineup
          && typeof lineup === "object"
          && (lineup.type === "family" || lineup.type === "friends")
          && Array.isArray(lineup.characterIds)
          && lineup.characterIds.every((id: unknown) => typeof id === "string"),
      ))
      .slice(0, 5)
    : [];

  return {
    randomState: nonZeroSeed(Number.isFinite(saved.randomState) ? Number(saved.randomState) : Math.floor(Math.random() * 0xffffffff)),
    partySizeBag: sizes,
    partyTypeBag: types,
    backFacingBag: backFacing,
    recentPartyTypes: Array.isArray(saved.recentPartyTypes)
      ? saved.recentPartyTypes.filter((type): type is DiningPartyType => type === "family" || type === "friends").slice(-2)
      : [],
    recentLineups,
  };
}

export function cloneDiningPartySelectionState(state: DiningPartySelectionState): DiningPartySelectionState {
  return {
    ...state,
    partySizeBag: [...state.partySizeBag],
    partyTypeBag: [...state.partyTypeBag],
    backFacingBag: [...state.backFacingBag],
    recentPartyTypes: [...state.recentPartyTypes],
    recentLineups: state.recentLineups.map((lineup) => ({ type: lineup.type, characterIds: [...lineup.characterIds] })),
  };
}

function nextRandom(state: DiningPartySelectionState): number {
  let value = state.randomState >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  state.randomState = nonZeroSeed(value);
  return state.randomState / 0x1_0000_0000;
}

function shuffle<T>(items: T[], state: DiningPartySelectionState): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom(state) * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function nextPartySize(state: DiningPartySelectionState): PartySize {
  if (state.partySizeBag.length === 0) state.partySizeBag = shuffle([...SIZE_DISTRIBUTION], state);
  return state.partySizeBag.pop() ?? 2;
}

function nextPartyType(state: DiningPartySelectionState): DiningPartyType {
  if (state.partyTypeBag.length === 0) {
    state.partyTypeBag = shuffle([
      ...Array.from({ length: 10 }, () => "family" as const),
      ...Array.from({ length: 10 }, () => "friends" as const),
    ], state);
  }
  const recentTypes = state.recentPartyTypes;
  const lastType = recentTypes.at(-1);
  const previousType = recentTypes.at(-2);
  if (lastType && previousType === lastType && state.partyTypeBag.at(-1) === lastType) {
    const alternateIndex = state.partyTypeBag.findIndex((type, index) => index < state.partyTypeBag.length - 1 && type !== lastType);
    if (alternateIndex >= 0) {
      const lastIndex = state.partyTypeBag.length - 1;
      [state.partyTypeBag[lastIndex], state.partyTypeBag[alternateIndex]] = [state.partyTypeBag[alternateIndex], state.partyTypeBag[lastIndex]];
    }
  }
  const type = state.partyTypeBag.pop() ?? (lastType === "family" ? "friends" : "family");
  state.recentPartyTypes.push(type);
  state.recentPartyTypes = state.recentPartyTypes.slice(-2);
  return type;
}

function nextBackFacingGuest(state: DiningPartySelectionState): boolean {
  if (state.backFacingBag.length === 0) state.backFacingBag = shuffle([true, false, false, false, false], state);
  return state.backFacingBag.pop() ?? false;
}

function lineupSignature(characterIds: readonly string[]): string {
  return [...characterIds].sort().join(",");
}

function countRecentCharacterUses(characterId: string, recentLineups: readonly string[][]): number {
  return recentLineups.reduce((count, lineup) => count + (lineup.includes(characterId) ? 1 : 0), 0);
}

function pickProfile(
  profiles: readonly DiningPartyProfile[],
  type: DiningPartyType,
  state: DiningPartySelectionState,
): DiningPartyProfile {
  const recentSignatures = new Set(state.recentLineups.map((lineup) => lineupSignature(lineup.characterIds)));
  let candidates = profiles.filter((candidate) => !recentSignatures.has(lineupSignature(candidate.characterIds)));
  if (candidates.length === 0) candidates = [...profiles];

  const previousLineup = state.recentLineups[0]?.characterIds ?? [];
  const noImmediateCharacterReuse = candidates.filter((candidate) =>
    candidate.characterIds.every((id) => !previousLineup.includes(id)),
  );
  if (noImmediateCharacterReuse.length > 0) candidates = noImmediateCharacterReuse;

  const repetitionScore = (candidate: DiningPartyProfile) => candidate.characterIds.reduce(
    (score, id) => score + countRecentCharacterUses(id, state.recentLineups.map((lineup) => lineup.characterIds)),
    0,
  );
  const leastUsedScore = Math.min(...candidates.map(repetitionScore));
  candidates = candidates.filter((candidate) => repetitionScore(candidate) === leastUsedScore);

  const totalWeight = candidates.reduce((sum, candidate) => sum + candidate.weight, 0);
  let roll = nextRandom(state) * totalWeight;
  for (const candidate of candidates) {
    roll -= candidate.weight;
    if (roll < 0) return candidate;
  }
  return candidates[candidates.length - 1] ?? profiles[0]!;
}

export function diningPartyForArrival(state: DiningPartySelectionState): DiningPartyTemplate {
  const size = nextPartySize(state);
  const type = nextPartyType(state);
  const selected = pickProfile(PARTY_PROFILES[type][size], type, state);
  const characterIds = [...selected.characterIds];
  const template = {
    type,
    characterIds,
    hasBackFacingGuest: size === 4 || (size === 3 && nextBackFacingGuest(state)),
  };

  state.recentLineups.unshift({ type, characterIds });
  state.recentLineups = state.recentLineups.slice(0, 5);
  return template;
}

export function diningFamilyContext(characterIds: readonly string[]): DiningFamilyContext {
  const motherIndex = characterIds.indexOf("saigon-young-mother");
  const fatherIndex = characterIds.indexOf("saigon-older-regular");
  const childIndices = characterIds
    .map((id, index) => id === "saigon-schoolboy" || id === "saigon-schoolgirl" ? index : -1)
    .filter((index) => index >= 0);
  const hasMother = motherIndex >= 0;
  const hasChild = childIndices.length > 0;
  // The older regular is used as the dad only when the mother is also present.
  // The comic uncle is not automatically treated as a father in family dialogue.
  return {
    hasFather: hasMother && fatherIndex >= 0,
    hasMother,
    hasChild,
    fatherIndex: hasMother && fatherIndex >= 0 ? fatherIndex : null,
    motherIndex: hasMother ? motherIndex : null,
    childIndices,
  };
}

export function diningTravelSeconds(tableId: number): number {
  return (7 - Math.ceil(tableId / 2)) * 1.25;
}

export function diningArrivalSeconds(tableId: number): number {
  return diningTravelSeconds(tableId) * 1.3;
}
