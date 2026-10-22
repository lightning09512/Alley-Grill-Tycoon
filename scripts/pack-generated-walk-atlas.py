"""Pack a QA-reviewed sprite-gen side_walk row into the game's 16-frame strip.

The game walk format is eight mirrored-left cells followed by eight generated-right
cells, each at the source atlas's native 247x396 frame size.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
WALK_ASSETS = ROOT / "assets" / "characters" / "sprite-gen-walk"
WALK_MANIFEST = WALK_ASSETS / "manifest.json"


def main(run_dir: Path) -> None:
    run_dir = run_dir.resolve()
    runtime = json.loads(WALK_MANIFEST.read_text(encoding="utf-8"))
    game = json.loads((run_dir / "manifest.json").read_text(encoding="utf-8"))
    character_id = game["characterId"]
    filename = f"{character_id}-walk-16f.png"
    output = WALK_ASSETS / filename
    entries = runtime.get("files", [])
    if any(entry.get("id") == character_id for entry in entries) or output.exists():
        raise SystemExit(f"refusing to overwrite existing walk asset or manifest entry: {character_id}")

    frame_layout = game["frame_layout"]
    frame_width, frame_height = frame_layout["cellWidth"], frame_layout["cellHeight"]
    directions = frame_layout["rows"].get("side_walk", [])
    if len(directions) != 8:
        raise SystemExit(f"expected 8 QA-reviewed side_walk frames, got {len(directions)}")
    atlas_path = run_dir / game["sprite_sheet_alpha"]
    atlas = Image.open(atlas_path).convert("RGBA")
    sheet = Image.new("RGBA", (frame_width * 16, frame_height), (0, 0, 0, 0))
    alpha_bounds: list[list[int]] = []

    for index, rect in enumerate(directions):
        if rect["w"] != frame_width or rect["h"] != frame_height:
            raise SystemExit(f"side_walk frame {index} has unexpected dimensions: {rect}")
        frame = atlas.crop((rect["x"], rect["y"], rect["x"] + rect["w"], rect["y"] + rect["h"]))
        bounds = frame.getchannel("A").getbbox()
        if bounds is None:
            raise SystemExit(f"side_walk frame {index} is empty")
        alpha_bounds.append(list(bounds))
        sheet.alpha_composite(frame.transpose(Image.Transpose.FLIP_LEFT_RIGHT), (index * frame_width, 0))
        sheet.alpha_composite(frame, ((index + 8) * frame_width, 0))

    WALK_ASSETS.mkdir(parents=True, exist_ok=True)
    sheet.save(output, optimize=True)
    entry = {
        "id": character_id,
        "file": filename,
        "source_image": str(run_dir / "base-source.png"),
        "run_dir": str(run_dir),
        "frame_size": [frame_width, frame_height],
        "left_frames": list(range(8)),
        "right_frames": list(range(8, 16)),
        "fps": game["animation"]["rows"]["side_walk"]["fps"],
        "alpha_bounds": alpha_bounds,
    }
    runtime["files"] = [*entries, entry]
    WALK_MANIFEST.write_text(json.dumps(runtime, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Created {output}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: pack-generated-walk-atlas.py <sprite-gen-run-dir>")
    main(Path(sys.argv[1]))
