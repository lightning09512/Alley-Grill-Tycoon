export type DiningPartyType = "family" | "friends";

export interface DiningPartyTemplate {
  type: DiningPartyType;
  characterIds: readonly string[];
  hasBackFacingGuest: boolean;
}

type PartySize = 2 | 3 | 4;

// These are made from the same animated guests used elsewhere in the game, so
// each group member keeps their own walking, sitting, and eating animations.
// In every 20 parties, 14 have two guests, 5 have three, and 1 has four.
const PARTY_SIZE_SCHEDULE: readonly PartySize[] = [
  2, 2, 3, 2, 2, 3, 2, 2, 2, 3,
  2, 2, 3, 2, 2, 2, 3, 2, 2, 4,
];
// One of every five three-person parties uses the bottom seat. Alternate
// family and friends between 20-party cycles; four-person parties are already rare.
const BACK_FACING_THREE_PARTY_SLOT_BY_CYCLE: readonly number[] = [2, 5];

const PARTY_PROFILES: Record<DiningPartyType, Record<PartySize, readonly (readonly string[])[]>> = {
  family: {
    2: [
      ["saigon-young-mother", "saigon-schoolboy"],
      ["saigon-older-regular", "saigon-young-mother"],
      ["saigon-young-mother", "saigon-schoolgirl"],
    ],
    3: [
      ["saigon-older-regular", "saigon-young-mother", "saigon-schoolgirl"],
      ["saigon-young-mother", "saigon-schoolboy", "saigon-schoolgirl"],
      ["saigon-comic-uncle", "saigon-comic-auntie", "saigon-schoolgirl"],
    ],
    4: [["saigon-older-regular", "saigon-young-mother", "saigon-schoolboy", "saigon-schoolgirl"]],
  },
  friends: {
    2: [
      ["saigon-genz-nightowl", "saigon-food-reviewer"],
      ["saigon-office-woman", "saigon-office-man"],
      ["saigon-delivery-rider", "saigon-construction-worker"],
      ["saigon-comic-uncle", "saigon-comic-foodie"],
      ["saigon-comic-uncle", "saigon-comic-auntie"],
      ["saigon-comic-auntie", "saigon-food-reviewer"],
    ],
    3: [
      ["saigon-genz-nightowl", "saigon-food-reviewer", "saigon-taphoa-college-girl"],
      ["saigon-office-woman", "saigon-office-man", "saigon-backpacker-tourist"],
      ["saigon-comic-uncle", "saigon-comic-foodie", "saigon-food-reviewer"],
    ],
    4: [["saigon-genz-nightowl", "saigon-food-reviewer", "saigon-backpacker-tourist", "saigon-market-shopper"]],
  },
};

export function diningPartyForArrival(arrivalNumber: number): DiningPartyTemplate {
  const partyIndex = arrivalNumber - 1;
  const size = PARTY_SIZE_SCHEDULE[partyIndex % PARTY_SIZE_SCHEDULE.length];
  const partyCycle = Math.floor(partyIndex / PARTY_SIZE_SCHEDULE.length);
  const type: DiningPartyType = size === 4
    ? partyCycle % 2 === 0 ? "family" : "friends"
    : arrivalNumber % 2 === 1 ? "family" : "friends";
  const profiles = PARTY_PROFILES[type][size];
  const profileIndex = Math.floor(partyIndex / 2) % profiles.length;
  const backFacingThreePartySlot = BACK_FACING_THREE_PARTY_SLOT_BY_CYCLE[partyCycle % BACK_FACING_THREE_PARTY_SLOT_BY_CYCLE.length];
  return {
    type,
    characterIds: profiles[profileIndex],
    hasBackFacingGuest: size === 4 || (size === 3 && partyIndex % PARTY_SIZE_SCHEDULE.length === backFacingThreePartySlot),
  };
}

export function diningTravelSeconds(tableId: number): number {
  return (7 - Math.ceil(tableId / 2)) * 1.25;
}

export function diningArrivalSeconds(tableId: number): number {
  return diningTravelSeconds(tableId) * 1.3;
}
