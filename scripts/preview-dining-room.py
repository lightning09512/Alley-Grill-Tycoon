"""Render the game's modular dining assets with four animated guest sprites for QA."""

import json
import sys
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ROOM = ROOT / "assets/interior-v2/modular-pack-v1"
DINING = ROOT / "assets/characters/sprite-gen-dining"
TABLE_ORIGIN = (81, 513)
SEATS = ((96, 77), (162, 133), (96, 181), (30, 133))
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
    (4, "dining_set_table_4stools_stove.png", 81, 313, 1),
    (4, "dining_set_table_4stools_stove.png", 300, 313, 1),
    (4, "dining_set_table_4stools_stove.png", 81, 513, 1),
    (4, "dining_set_table_4stools_stove.png", 301, 513, 1),
    (4, "dining_set_table_4stools_stove.png", 81, 710, 1),
    (4, "dining_set_table_4stools_stove.png", 303, 711, 1),
    (5, "reception_counter_clean.png", -7, 903, .9),
    (6, "cash_register_compact.png", 55, 896, 1),
    (6, "order_ledger.png", 133, 926, 1),
    (6, "lantern_woven_red.png", -10, 902, .82),
    (6, "potted_plant_large.png", -9, 1043, .92),
    (6, "potted_plant_large.png", 494, 1082, .92),
)


def image_layer(name: str, x: int, y: int, scale: float) -> tuple[Image.Image, int, int]:
    layer = Image.open(ROOM / name).convert("RGBA")
    if scale != 1:
        layer = layer.resize((round(layer.width * scale), round(layer.height * scale)), Image.Resampling.LANCZOS)
    return layer, x, y


def guest_layer(character: str, direction: str, seat: int, frame: int) -> tuple[Image.Image, int, int]:
    directory = DINING / character
    manifest = json.loads((directory / "game-manifest.json").read_text(encoding="utf-8"))
    atlas = Image.open(directory / "game-atlas.png").convert("RGBA")
    cell = manifest["frame_layout"]["rows"][f"{direction}_eat"][frame]
    crop = atlas.crop((cell["x"], cell["y"], cell["x"] + cell["w"], cell["y"] + cell["h"]))
    crop = crop.resize((72, 116), Image.Resampling.LANCZOS)
    if seat == 1:
        crop = ImageOps.mirror(crop)
    hip = manifest["anchors"]["seatedHip"]
    seat_x = TABLE_ORIGIN[0] + SEATS[seat][0]
    seat_y = TABLE_ORIGIN[1] + SEATS[seat][1]
    x = round(seat_x - hip["x"] / manifest["frame_layout"]["cellWidth"] * 72)
    y = round(seat_y - hip["y"] / manifest["frame_layout"]["cellHeight"] * 116)
    return crop, x, y


def main() -> None:
    frames = []
    for frame in range(6):
        canvas = Image.new("RGBA", (576, 1280))
        layers = [(depth, image_layer(name, x, y, scale)) for depth, name, x, y, scale in PARTS]
        layers += [((3.5 if seat == 0 else 5 if seat == 2 else 4.5), guest_layer(character, direction, seat, frame))
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
