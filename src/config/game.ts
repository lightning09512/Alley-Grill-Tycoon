export const GAME_NAME = "Alley Grill Tycoon";
export const GAME_NAME_VI = "Quán Nhậu Hẻm";
export const GAME_TITLE = `${GAME_NAME} · ${GAME_NAME_VI}`;
export const GAME_DESCRIPTION = `${GAME_TITLE} — quản lý quán nhậu giữa lòng Sài Gòn.`;

export function formatStoreNameForDisplay(name: string): string {
  return name.replace(/^(?:xe\s+)?bánh\s+mì(?=\s|$)/i, "Quán Nhậu");
}
