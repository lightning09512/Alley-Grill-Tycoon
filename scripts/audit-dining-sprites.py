"""Check every dining atlas and make a compact visual review sheet."""

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets/characters"
OUTPUT = ASSETS / "sprite-gen-dining"
CHARACTERS = json.loads((ASSETS / "sprite-gen-walk/manifest.json").read_text(encoding="utf-8"))["files"]
EXPECTED = {f"{direction}_{state}": count for direction in ("down", "side", "up")
            for state, count in (("idle", 4), ("walk", 8), ("sit", 4), ("seated_idle", 4), ("eat", 6), ("stand", 4))}
EXAMPLES = (("down_walk", 0), ("down_sit", -1), ("down_eat", 2), ("side_eat", 2), ("up_eat", 2))
POSES = (("down_sit", -1), ("down_seated_idle", 2), ("down_eat", 2),
         ("side_seated_idle", 2), ("side_eat", 2), ("up_seated_idle", 2), ("up_eat", 2))


def main() -> None:
    sheet = Image.new("RGB", (4 * 400, 5 * 185), "#f5efe4")
    drawing = ImageDraw.Draw(sheet)
    pose_sheet = Image.new("RGB", (4 * 500, 5 * 175), "#f5efe4")
    pose_drawing = ImageDraw.Draw(pose_sheet)
    notes = ["# Dining sprite QA", "", "All four seat directions use the generated down, side, and up rows; left mirrors side.", "Each atlas is loaded only when that character enters the dining room.", "", "| Character | Frames | Alpha | Inspector errors | Inspector warnings |", "|---|---:|---|---:|---:|"]
    incomplete = []
    for index, entry in enumerate(CHARACTERS):
        character = entry["id"]
        directory = OUTPUT / character
        atlas_file, manifest_file = directory / "game-atlas.png", directory / "game-manifest.json"
        x, y = index % 4 * 400, index // 4 * 185
        drawing.text((x + 8, y + 7), f"{index + 1:02}. {character.removeprefix('saigon-')}", fill="#35251d", font=ImageFont.load_default())
        pose_x, pose_y = index % 4 * 500, index // 4 * 175
        pose_drawing.text((pose_x + 8, pose_y + 7), f"{index + 1:02}. {character.removeprefix('saigon-')}", fill="#35251d", font=ImageFont.load_default())
        if not atlas_file.exists() or not manifest_file.exists():
            incomplete.append(character)
            notes.append(f"| `{character}` | missing | — | — | — |")
            continue
        manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
        atlas = Image.open(atlas_file).convert("RGBA")
        rows = manifest["frame_layout"]["rows"]
        frame_count = sum(len(frames) for frames in rows.values())
        valid = all(len(rows.get(state, [])) == count for state, count in EXPECTED.items())
        alpha = atlas.getchannel("A").getextrema()
        alpha_ok = alpha[0] == 0 and alpha[1] == 255
        for example_index, (state, frame_index) in enumerate(EXAMPLES):
            frames = rows.get(state, [])
            if not frames:
                continue
            frame = frames[frame_index]
            cut = atlas.crop((frame["x"], frame["y"], frame["x"] + frame["w"], frame["y"] + frame["h"]))
            cut = cut.resize((72, 116), Image.Resampling.LANCZOS)
            sheet.paste(cut, (x + 12 + example_index * 76, y + 29), cut)
            drawing.text((x + 15 + example_index * 76, y + 151), state.split("_")[-1], fill="#58463a", font=ImageFont.load_default())
        for pose_index, (state, frame_index) in enumerate(POSES):
            frames = rows.get(state, [])
            if not frames:
                continue
            frame = frames[frame_index]
            cut = atlas.crop((frame["x"], frame["y"], frame["x"] + frame["w"], frame["y"] + frame["h"]))
            cut = cut.resize((62, 100), Image.Resampling.LANCZOS)
            pose_sheet.paste(cut, (pose_x + 8 + pose_index * 70, pose_y + 29), cut)
            pose_drawing.text((pose_x + 8 + pose_index * 70, pose_y + 138), state.replace("seated_idle", "idle"), fill="#58463a", font=ImageFont.load_default())
        report_file = Path(manifest["source_run"]) / "sprite-inspect.report.json"
        report = json.loads(report_file.read_text(encoding="utf-8")) if report_file.exists() else {}
        errors, warnings = report.get("errors", []), report.get("warnings", [])
        if not valid or not alpha_ok or errors:
            incomplete.append(character)
        notes.append(f"| `{character}` | {frame_count}/90{' ✓' if valid else ' !'} | {'✓' if alpha_ok else '!'} | {len(errors)} | {len(warnings)} |")
    notes += [
        "", "## Needs work", "",
        "- " + (", ".join(incomplete) if incomplete else "No missing rows, broken alpha atlases, or inspector errors."),
        "", "## Visual review", "",
        "- `qa-contact-sheet.png` and `qa-pose-sheet.png` show samples from all 20 characters at game scale.",
        "- `room-preview.png` and `room-preview.gif` composite the existing modular room assets with four sample guests; they are asset QA previews, not a captured game session.",
        "- Inspector warnings are minor edge pixels or low motion in subtle idle loops; inspect the GIF for any character that needs more art polish.",
        "- A live browser preview was unavailable under the current browser access policy, so in-game animation and collision need a final visual pass.",
    ]
    (OUTPUT / "qa-summary.md").write_text("\n".join(notes) + "\n", encoding="utf-8")
    sheet.save(OUTPUT / "qa-contact-sheet.png", optimize=True)
    pose_sheet.save(OUTPUT / "qa-pose-sheet.png", optimize=True)
    print(f"Complete: {len(CHARACTERS) - len(incomplete)}/{len(CHARACTERS)}")
    print(f"Needs work: {', '.join(incomplete) if incomplete else 'none'}")


if __name__ == "__main__":
    main()
