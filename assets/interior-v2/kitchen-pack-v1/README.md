# Kitchen modular assets

This pack separates the kitchen scene into transparent PNG layers for later updates.

`kitchen-room-shell-empty.png` is the empty room background. It retains the original wall framing and floral floor tiles while leaving out the kitchen stations and decorative assets, so the room surfaces and modular objects can be updated separately.

`kitchen-room-composed-preview.png` shows the full set of modular asset layers placed over that empty room shell at the original canvas size.

## Source and proportions

- Source scene: `assets/backgrounds/kitchen-stage-01-banh-mi-pho-concept.png`
- Source canvas: `931 × 1689 px` (portrait ratio `0.551214`)
- Cropped assets retain their source pixel dimensions and proportions.
- Use `asset_manifest.json` for each crop's original position. Place at `sourceRect.x` / `sourceRect.y` with `scale: 1.0`; do not stretch the PNGs.

## Station assets

- `cookline_top.png` — upper cooking line, hood, cabinets and cookware
- `prep_station_left.png` — left ingredient and chopping counter; cutting boards are clear
- `service_island_center.png` — central plating/service island
- `dishwashing_line_bottom.png` — bottom sink and washing counter

## Decorative assets

- `hanging_plant_left.png`, `hanging_plant_right.png`
- `lantern_left.png`, `lantern_right.png`
- `teal_floral_panel.png`

The `kitchen_station_layer.png`, `kitchen_decor_layer.png`, and `kitchen_objects_layout.png` files are full-canvas transparent layers aligned to the source scene.
