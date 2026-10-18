export const UI_ICON_SPRITE = "/assets/saigon-ui-icons.svg";

export type UiIconName =
  | "beer-toast" | "coin" | "banknote" | "reputation-star" | "music-note" | "play" | "pause"
  | "fullscreen" | "exit-fullscreen" | "arrow-left" | "arrow-right" | "map-pan"
  | "sun" | "cloud" | "rain" | "leaf" | "corn" | "sauce-jar" | "pork-skewer"
  | "egg-grill" | "greens" | "grill-meal" | "lantern" | "storefront" | "staff-chef"
  | "menu-book" | "sparkles" | "basket" | "upgrade-shop" | "lock" | "edit-sign"
  | "crate" | "check" | "close" | "plus" | "minus";

export function iconMarkup(name: UiIconName, className = "ui-icon"): string {
  return `<svg class="${className}" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><use href="${UI_ICON_SPRITE}#${name}"></use></svg>`;
}

export function setIcon(element: Element | null, name: UiIconName): void {
  const use = element?.querySelector("use");
  use?.setAttribute("href", `${UI_ICON_SPRITE}#${name}`);
}
