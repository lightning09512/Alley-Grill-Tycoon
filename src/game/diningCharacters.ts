import walkingManifest from "../../assets/characters/sprite-gen-walk/manifest.json";

// Every person who can walk outside can also visit the dining room.
export const DINING_CHARACTER_IDS: readonly string[] = walkingManifest.files.map((entry) => entry.id);

export function diningCharacterForArrival(arrivalNumber: number): string {
  return DINING_CHARACTER_IDS[(arrivalNumber - 1) % DINING_CHARACTER_IDS.length];
}

export function diningTravelSeconds(tableId: number): number {
  return 7 - Math.ceil(tableId / 2);
}
