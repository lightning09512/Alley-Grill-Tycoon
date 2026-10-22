"""Split isolated Mai Linh poses from horizontal redraw strips into PNG frames and GIFs."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
CHARACTER_ROOT = ROOT / "assets" / "characters" / "staff-roster-v1" / "server-mai-linh"
ASSET_ROOT = CHARACTER_ROOT / "redrawn-v1"
SOURCE_ROOT = ASSET_ROOT / "sheets"
OUTPUT_ROOT = ASSET_ROOT / "gif"
FRAME_ROOT = ASSET_ROOT / "frames"

WALK_SHEETS = {
    "walk-empty": {
        0: "walk-empty-south-8f.png",
        4: "walk-empty-north-8f.png",
        5: "walk-empty-northeast-8f.png",
        6: "walk-empty-east-8f.png",
        7: "walk-empty-8dir-8f.png",
    },
    "walk-tray": {
        0: "walk-tray-south-8f.png",
        4: "walk-tray-north-8f.png",
        5: "walk-tray-northeast-8f.png",
        6: "walk-tray-east-8f.png",
        7: "walk-tray-8dir-8f.png",
    },
}
MIRRORED_DIRECTIONS = {1: 7, 2: 6, 3: 5}
DIRECTION_NAMES = ("south", "southwest", "west", "northwest", "north", "northeast", "east", "southeast")

SHEETS = {
    "idle": "idle-8dir-8f.png",
    "take-order": "take-order-8dir-8f.png",
    "pickup-kitchen": "pickup-kitchen-8f.png",
    "serve-table": "serve-table-8dir-8f.png",
    "rest": "rest-8dir-8f.png",
    "phone": "idle-phone-8dir-8f.png",
}

FPS = {
    "walk-empty": 8,
    "walk-tray": 8,
    "idle": 4,
    "take-order": 6,
    "pickup-kitchen": 6,
    "serve-table": 6,
    "rest": 4,
    "phone": 4,
}

FRAME_SIZE = (192, 224)
CONTENT_HEIGHT = 204
BASELINE_MARGIN = 10
COMPONENT_THRESHOLD = 48


def isolate_pose_components(atlas: Image.Image, filename: str) -> list[Image.Image]:
    """Keep each disconnected character pose, excluding bits from neighboring poses."""
    rgba = atlas.convert("RGBA")
    alpha = np.asarray(rgba.getchannel("A"))
    mask = (alpha >= COMPONENT_THRESHOLD).astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    pose_labels = [
        index
        for index in range(1, count)
        if stats[index, cv2.CC_STAT_AREA] >= 10_000
    ]
    pose_labels.sort(key=lambda index: stats[index, cv2.CC_STAT_LEFT] + stats[index, cv2.CC_STAT_WIDTH] / 2)
    if len(pose_labels) != 8:
        raise ValueError(f"{filename} has {len(pose_labels)} separate poses; expected 8")

    original = np.asarray(rgba)
    poses: list[Image.Image] = []
    edge_kernel = np.ones((5, 5), dtype=np.uint8)
    for label in pose_labels:
        x, y, width, height, _ = stats[label]
        component = (labels == label).astype(np.uint8)
        softened_edge = cv2.dilate(component, edge_kernel, iterations=1).astype(bool)
        left = max(0, int(x) - 3)
        top = max(0, int(y) - 3)
        right = min(rgba.width, int(x + width) + 3)
        bottom = min(rgba.height, int(y + height) + 3)
        isolated = original[top:bottom, left:right].copy()
        isolated_alpha = isolated[:, :, 3]
        isolated_mask = softened_edge[top:bottom, left:right]
        isolated_alpha[~isolated_mask] = 0
        isolated[:, :, 3] = isolated_alpha
        poses.append(Image.fromarray(isolated))
    return poses


def normalize_pose(pose: Image.Image) -> Image.Image:
    scale = CONTENT_HEIGHT / pose.height
    resized_size = (max(1, round(pose.width * scale)), CONTENT_HEIGHT)
    resized = pose.resize(resized_size, Image.Resampling.LANCZOS)
    frame = Image.new("RGBA", FRAME_SIZE, (0, 0, 0, 0))
    x = (FRAME_SIZE[0] - resized.width) // 2
    y = FRAME_SIZE[1] - BASELINE_MARGIN - resized.height
    frame.alpha_composite(resized, (x, y))
    return frame


def shared_palette(frames: list[Image.Image]) -> Image.Image:
    pixels: list[tuple[int, int, int]] = []
    for frame in frames:
        rgba = frame.convert("RGBA")
        rgb_pixels = list(rgba.convert("RGB").getdata())
        alpha_pixels = list(rgba.getchannel("A").getdata())
        pixels.extend(pixel for pixel, alpha in zip(rgb_pixels, alpha_pixels) if alpha >= 128)
    if not pixels:
        raise ValueError("sprite frames have no visible pixels")
    sample = Image.new("RGB", (len(pixels), 1))
    sample.putdata(pixels)
    return sample.quantize(colors=255, method=Image.Quantize.MEDIANCUT)


def indexed_frames(frames: list[Image.Image], palette: Image.Image) -> list[Image.Image]:
    palette_data = palette.getpalette()[: 255 * 3]
    palette_data = [255, 0, 255] + palette_data
    palette_data += [0] * (768 - len(palette_data))
    result: list[Image.Image] = []
    for frame in frames:
        rgba = frame.convert("RGBA")
        alpha = rgba.getchannel("A")
        quantized = rgba.convert("RGB").quantize(palette=palette, dither=Image.Dither.NONE)
        shifted = quantized.point(lambda index: index + 1)
        transparent = alpha.point(lambda value: 255 if value < 128 else 0)
        shifted.paste(0, mask=transparent)
        shifted.putpalette(palette_data)
        shifted.info["transparency"] = 0
        result.append(shifted)
    return result


def save_gif(frames: list[Image.Image], destination: Path, fps: int) -> None:
    indexed = indexed_frames(frames, shared_palette(frames))
    destination.parent.mkdir(parents=True, exist_ok=True)
    indexed[0].save(
        destination,
        save_all=True,
        append_images=indexed[1:],
        duration=round(1000 / fps),
        loop=0,
        transparency=0,
        disposal=2,
        optimize=False,
    )


def save_frames(frames: list[Image.Image], folder: Path) -> None:
    folder.mkdir(parents=True, exist_ok=True)
    for frame_index, frame in enumerate(frames):
        frame.save(folder / f"frame-{frame_index:02d}.png", optimize=True)


def pack_directional_walks(manifest: dict[str, object]) -> int:
    packed = 0
    for motion, directional_sources in WALK_SHEETS.items():
        source_poses: dict[int, list[Image.Image]] = {}
        for direction, filename in directional_sources.items():
            source = SOURCE_ROOT / filename
            if not source.is_file():
                raise SystemExit(f"missing source strip: {source}")
            source_poses[direction] = [normalize_pose(pose) for pose in isolate_pose_components(Image.open(source), filename)]

        direction_entries = []
        for direction in range(8):
            source_direction = MIRRORED_DIRECTIONS.get(direction, direction)
            frames = source_poses[source_direction]
            if direction in MIRRORED_DIRECTIONS:
                frames = [frame.transpose(Image.Transpose.FLIP_LEFT_RIGHT) for frame in frames]
            direction_name = DIRECTION_NAMES[direction]
            frame_folder = FRAME_ROOT / motion / f"dir-{direction}"
            save_frames(frames, frame_folder)
            gif_path = OUTPUT_ROOT / motion / f"dir-{direction}.gif"
            save_gif(frames, gif_path, FPS[motion])

            # Keep the original flat GIF paths available as a fallback for older callers.
            if direction == 7:
                save_frames(frames, FRAME_ROOT / motion)
                save_gif(frames, OUTPUT_ROOT / f"{motion}.gif", FPS[motion])

            direction_entries.append(
                {
                    "index": direction,
                    "direction": direction_name,
                    "source": f"sheets/{directional_sources.get(direction, directional_sources.get(source_direction))}",
                    "mirroredFrom": source_direction if direction in MIRRORED_DIRECTIONS else None,
                    "frames": len(frames),
                    "gif": f"gif/{motion}/dir-{direction}.gif",
                    "pngFrames": f"frames/{motion}/dir-{direction}/",
                }
            )

        manifest["motions"].append(
            {
                "id": motion,
                "directional": True,
                "directions": direction_entries,
                "fps": FPS[motion],
                "fallbackGif": f"gif/{motion}.gif",
            }
        )
        packed += len(direction_entries)
    return packed


def main() -> None:
    # These two folders are build outputs owned by this script and are recreated on every run.
    if FRAME_ROOT.exists():
        shutil.rmtree(FRAME_ROOT)
    if OUTPUT_ROOT.exists():
        shutil.rmtree(OUTPUT_ROOT)

    manifest = {
        "character": "Mai Linh",
        "version": 2,
        "format": "transparent PNG frames and animated GIFs; walk motions have 8 directions",
        "frameSource": "isolated full-body poses redrawn as individual animation frames",
        "frameSize": {"width": FRAME_SIZE[0], "height": FRAME_SIZE[1]},
        "motions": [],
    }

    directional_gifs = pack_directional_walks(manifest)
    for motion, filename in SHEETS.items():
        source = SOURCE_ROOT / filename
        if not source.is_file():
            raise SystemExit(f"missing source strip: {source}")
        atlas = Image.open(source).convert("RGBA")
        poses = isolate_pose_components(atlas, filename)
        frames = [normalize_pose(pose) for pose in poses]

        frame_folder = FRAME_ROOT / motion
        frame_folder.mkdir(parents=True, exist_ok=True)
        for frame_index, frame in enumerate(frames):
            frame.save(frame_folder / f"frame-{frame_index:02d}.png", optimize=True)

        gif_path = OUTPUT_ROOT / f"{motion}.gif"
        save_gif(frames, gif_path, FPS[motion])
        manifest["motions"].append(
            {
                "id": motion,
                "source": f"sheets/{filename}",
                "frames": len(frames),
                "fps": FPS[motion],
                "gif": f"gif/{motion}.gif",
                "pngFrames": f"frames/{motion}/",
            }
        )

    (ASSET_ROOT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    total_frames = sum(
        sum(direction["frames"] for direction in motion["directions"])
        if motion.get("directional")
        else motion["frames"]
        for motion in manifest["motions"]
    )
    gif_count = directional_gifs + len(SHEETS)
    print(f"Packed {gif_count} GIFs and {total_frames} isolated PNG frames under {ASSET_ROOT}")


if __name__ == "__main__":
    main()
