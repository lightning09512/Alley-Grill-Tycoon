"""Make a mobile-size runtime copy of a sprite-gen composed atlas.

The sprite-gen run remains the canonical high-resolution atlas and QA record.
"""

import copy
import json
import sys
from pathlib import Path

from PIL import Image


def main(run_dir: Path, target_dir: Path) -> None:
    manifest = json.loads((run_dir / "manifest.json").read_text(encoding="utf-8"))
    source = Image.open(run_dir / "sprite-sheet-alpha.png").convert("RGBA")
    rows = manifest["frame_layout"]["rows"]
    width, height = 96, 154
    column_count = max(len(frames) for frames in rows.values())
    runtime = Image.new("RGBA", (column_count * width, len(rows) * height))
    runtime_rows: dict[str, list[dict[str, int]]] = {}
    for row_index, (state, frames) in enumerate(rows.items()):
        runtime_rows[state] = []
        for column, frame in enumerate(frames):
            cut = source.crop((frame["x"], frame["y"], frame["x"] + frame["w"], frame["y"] + frame["h"]))
            cut = cut.resize((width, height), Image.Resampling.LANCZOS)
            x, y = column * width, row_index * height
            runtime.alpha_composite(cut, (x, y))
            runtime_rows[state].append({"x": x, "y": y, "w": width, "h": height})
    game_manifest = {
        "characterId": manifest["characterId"],
        "source_run": str(run_dir),
        "source_atlas": "sprite-sheet-alpha.png",
        "animation": copy.deepcopy(manifest["animation"]),
        "anchors": {
            "standingFeet": {"x": 48, "y": 149},
            "seatedHip": {"x": 48, "y": 107},
        },
        "frame_layout": {
            "sheetWidth": runtime.width,
            "sheetHeight": runtime.height,
            "cellWidth": width,
            "cellHeight": height,
            "rows": runtime_rows,
        },
    }
    target_dir.mkdir(parents=True, exist_ok=True)
    runtime.save(target_dir / "game-atlas.png", optimize=True)
    (target_dir / "game-manifest.json").write_text(json.dumps(game_manifest, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
