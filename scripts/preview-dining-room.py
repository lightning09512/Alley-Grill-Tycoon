"""Render the game's modular dining assets with four animated guest sprites for QA."""

import json
import sys
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ROOM = ROOT / "assets/interior-v2/modular-pack-v1"
TABLE_ASSET_NAME = "dining_set_table_4stools_stove-v2.png"
TABLE_ASSET = ROOT / "assets/interior-v2/modular-pack-v2" / TABLE_ASSET_NAME
DINING = ROOT / "assets/characters/sprite-gen-dining"
TABLE_ORIGIN = (24, 550)
TABLE_ART_SCALE = .17
SEATS = ((109.3, 28.9), (181.1, 99.5), (109.1, 157.3), (37.4, 99.5))
SIDE_SEAT_INSET = 10
GUESTS = (
    ("saigon-schoolgirl", "down", 0),
    ("saigon-office-man", "side", 1),
    ("saigon-market-shopper", "up", 2),
    ("saigon-backpacker-tourist", "side", 3),
)
PARTS = (
    (0, "tavern_room_shell_base.png", 0, 0, 1),
    (1, "curtain_closed_teal.png", 223, 82, .75),
    (2, "spice_shelf.png", 4, 20, 1),
    (2, "staircase_wood.png", 440, 24, .85),
    (3, "lantern_woven_red.png", 179, 61, .95),
    (3, "lantern_woven_red.png", 344, 56, .95),
    (3, "potted_plant_large.png", 99, 75, .72),
    (3, "potted_plant_large.png", -6, 159, 1),
    (3, "potted_plant_large.png", 483, -23, .75),
    (3, "potted_plant_large.png", 435, 261, .8),
    (4, TABLE_ASSET_NAME, 24, 313, TABLE_ART_SCALE),
    (4, TABLE_ASSET_NAME, 260, 313, TABLE_ART_SCALE),
    (4, TABLE_ASSET_NAME, 24, 550, TABLE_ART_SCALE),
    (4, TABLE_ASSET_NAME, 260, 550, TABLE_ART_SCALE),
    (4, TABLE_ASSET_NAME, 24, 787, TABLE_ART_SCALE),
    (4, TABLE_ASSET_NAME, 260, 787, TABLE_ART_SCALE),
    (5, TABLE_ASSET_NAME, 24, 313, TABLE_ART_SCALE, (370, 350, 920, 810)),
    (5, TABLE_ASSET_NAME, 260, 313, TABLE_ART_SCALE, (370, 350, 920, 810)),
    (5, TABLE_ASSET_NAME, 24, 550, TABLE_ART_SCALE, (370, 350, 920, 810)),
    (5, TABLE_ASSET_NAME, 260, 550, TABLE_ART_SCALE, (370, 350, 920, 810)),
    (5, TABLE_ASSET_NAME, 24, 787, TABLE_ART_SCALE, (370, 350, 920, 810)),
    (5, TABLE_ASSET_NAME, 260, 787, TABLE_ART_SCALE, (370, 350, 920, 810)),
    (5, "reception_counter_clean.png", -7, 1000, .9),
    (6, "cash_register_compact.png", 55, 993, 1),
    (6, "order_ledger.png", 133, 1023, 1),
    (6, "lantern_woven_red.png", -10, 999, .82),
    (6, "potted_plant_large.png", -9, 1140, .92),
    (6, "potted_plant_large.png", 494, 1082, .92),
)


def image_layer(name: str, x: int, y: int, scale: float, crop: tuple[int, int, int, int] | None = None) -> tuple[Image.Image, int, int]:
    path = TABLE_ASSET if name == TABLE_ASSET_NAME else ROOM / name
    layer = Image.open(path).convert("RGBA")
    if crop:
        layer = layer.crop(crop)
        x += round(crop[0] * scale)
        y += round(crop[1] * scale)
    if scale != 1:
        layer = layer.resize((round(layer.width * scale), round(layer.height * scale)), Image.Resampling.LANCZOS)
    return layer, x, y


def guest_layer(character: str, direction: str, seat: int, frame: int) -> tuple[Image.Image, int, int]:
    directory = DINING / character
    manifest = json.loads((directory / "game-manifest.json").read_text(encoding="utf-8"))
    atlas = Image.open(directory / "game-atlas.png").convert("RGBA")
    pose_state = f"{direction}_eat" if seat == 2 else f"{direction}_seated_idle"
    pose_frames = manifest["frame_layout"]["rows"][pose_state]
    cell = pose_frames[frame % len(pose_frames)] if seat == 2 else pose_frames[1 + frame % (len(pose_frames) - 1)]
    crop = atlas.crop((cell["x"], cell["y"], cell["x"] + cell["w"], cell["y"] + cell["h"]))
    sprite_width, sprite_height = 84, 136
    crop = crop.resize((sprite_width, sprite_height), Image.Resampling.LANCZOS)
    if seat == 1:
        crop = ImageOps.mirror(crop)
    hip = manifest["anchors"]["seatedHip"]
    seat_x = TABLE_ORIGIN[0] + SEATS[seat][0]
    seat_y = TABLE_ORIGIN[1] + SEATS[seat][1]
    if seat == 1:
        seat_x -= SIDE_SEAT_INSET
    elif seat == 3:
        seat_x += SIDE_SEAT_INSET
    x = round(seat_x - hip["x"] / manifest["frame_layout"]["cellWidth"] * sprite_width)
    y = round(seat_y - hip["y"] / manifest["frame_layout"]["cellHeight"] * sprite_height)
    return crop, x, y


def main() -> None:
    frames = []
    for frame in range(6):
        canvas = Image.new("RGBA", (576, 1280))
        layers = [(part[0], image_layer(*part[1:5], crop=part[5] if len(part) > 5 else None)) for part in PARTS]
        layers += [((5.5 if seat == 2 else 4.5), guest_layer(character, direction, seat, frame))
                   for character, direction, seat in GUESTS]
        for _, (art, x, y) in sorted(layers, key=lambda layer: layer[0]):
            canvas.alpha_composite(art, (x, y))
        frames.append(canvas.convert("RGB"))
    destination = DINING / "room-preview"
    frames[0].save(destination.with_suffix(".png"), optimize=True)
    frames[0].save(destination.with_suffix(".gif"), save_all=True, append_images=frames[1:], duration=166, loop=0, optimize=True)
    print(destination.with_suffix(".png"))
    print(destination.with_suffix(".gif"))


if __name__ == "__main__":
    if not all((DINING / character / "game-atlas.png").exists() for character, _, _ in GUESTS):
        sys.exit("Generate the four preview characters first")
    main()
