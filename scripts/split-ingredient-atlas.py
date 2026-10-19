from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/ingredients/ingredients-sprite-sheet.png"
OUTPUT = ROOT / "public/assets/ingredients/individual"
PADDING = 4
ALPHA_EDGE_DISTANCE = 12

# Bounds were measured around each isolated opaque sprite in the source atlas.
# The bounding boxes overlap for some neighbors, so each crop is also masked to
# its nearest opaque sprite before saving.
SPRITES = [
    ("pork-belly.png", (20, 44, 143, 127)),
    ("beef-slices.png", (173, 50, 147, 116)),
    ("beef-shank.png", (334, 48, 136, 118)),
    ("chicken.png", (482, 42, 172, 130)),
    ("chicken-wings.png", (659, 46, 146, 127)),
    ("chicken-feet.png", (816, 45, 158, 128)),
    ("chicken-cartilage.png", (984, 54, 144, 117)),
    ("pork-ribs.png", (1136, 48, 163, 125)),
    ("ground-pork.png", (1304, 53, 143, 109)),
    ("dried-beef.png", (1454, 44, 149, 127)),
    ("shrimp.png", (20, 198, 146, 137)),
    ("squid.png", (171, 184, 147, 158)),
    ("clams.png", (327, 199, 152, 130)),
    ("field-crab.png", (488, 197, 150, 137)),
    ("goby.png", (647, 193, 166, 141)),
    ("octopus.png", (815, 189, 164, 151)),
    ("sea-snail.png", (985, 195, 162, 145)),
    ("corn.png", (1155, 193, 136, 146)),
    ("mixed-mushrooms.png", (1300, 187, 153, 152)),
    ("hotpot-greens.png", (1456, 191, 148, 145)),
    ("side-vegetables.png", (17, 348, 157, 154)),
    ("la-e.png", (178, 352, 162, 148)),
    ("bamboo-shoots.png", (345, 343, 142, 159)),
    ("onion.png", (503, 352, 128, 147)),
    ("pineapple.png", (671, 337, 103, 168)),
    ("tomato.png", (799, 359, 155, 141)),
    ("la-giang.png", (959, 349, 163, 155)),
    ("la-lot.png", (1131, 350, 161, 141)),
    ("okra.png", (1301, 363, 159, 133)),
    ("lemongrass.png", (1463, 348, 141, 155)),
    ("garlic.png", (20, 517, 147, 139)),
    ("water-spinach.png", (179, 507, 176, 159)),
    ("green-mango.png", (358, 514, 139, 145)),
    ("aromatic-herbs.png", (502, 503, 165, 161)),
    ("scallions.png", (664, 505, 162, 164)),
    ("potatoes.png", (812, 523, 158, 133)),
    ("rau-ram.png", (968, 510, 173, 150)),
    ("mixed-roots.png", (1140, 506, 167, 157)),
    ("leafy-greens.png", (1308, 502, 155, 157)),
    ("chicken-eggs.png", (1462, 520, 142, 131)),
    ("quail-eggs.png", (21, 674, 151, 121)),
    ("tofu.png", (182, 673, 146, 122)),
    ("rice.png", (335, 669, 146, 125)),
    ("bun.png", (487, 675, 152, 118)),
    ("noodles.png", (645, 676, 157, 118)),
    ("glass-noodles.png", (808, 671, 161, 123)),
    ("rice-paper.png", (979, 671, 153, 124)),
    ("peanuts.png", (1145, 673, 165, 122)),
    ("avocado.png", (1311, 668, 153, 132)),
    ("honey.png", (1490, 665, 96, 130)),
    ("vinegar.png", (49, 803, 66, 141)),
    ("tamarind.png", (144, 807, 191, 134)),
    ("cooking-oil.png", (369, 803, 64, 143)),
    ("marinade.png", (512, 804, 99, 141)),
    ("thai-hotpot-spice.png", (671, 805, 98, 140)),
    ("satay.png", (829, 804, 99, 141)),
    ("chili-salt.png", (992, 809, 120, 130)),
    ("roasted-salt.png", (1166, 809, 118, 131)),
    ("salad-dressing.png", (1355, 803, 65, 143)),
    ("stir-fry-sauce.png", (1499, 803, 65, 144)),
]


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    alpha = np.asarray(source.getchannel("A"))
    count, labels, stats, centroids = cv2.connectedComponentsWithStats(
        (alpha >= 32).astype(np.uint8), 8
    )
    valid_labels = [label for label in range(1, count) if stats[label, cv2.CC_STAT_AREA] > 1000]
    if len(valid_labels) != len(SPRITES):
        raise RuntimeError(f"Expected {len(SPRITES)} sprites, found {len(valid_labels)}")

    seed_mask = np.isin(labels, valid_labels)
    distances, nearest = distance_transform_edt(~seed_mask, return_indices=True)
    nearest_labels = labels[nearest[0], nearest[1]]

    OUTPUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    assigned_labels: set[int] = set()

    for filename, (x, y, width, height) in SPRITES:
        center_x = x + width / 2
        center_y = y + height / 2
        label = min(
            valid_labels,
            key=lambda candidate: (
                (centroids[candidate][0] - center_x) ** 2
                + (centroids[candidate][1] - center_y) ** 2
            ),
        )
        if label in assigned_labels:
            raise RuntimeError(f"Two asset bounds matched the same sprite: {filename}")
        assigned_labels.add(label)

        owned = (nearest_labels == label) & (distances <= ALPHA_EDGE_DISTANCE) & (alpha > 0)
        ys, xs = np.nonzero(owned)
        if not len(xs):
            raise RuntimeError(f"No pixels found for {filename}")
        left = max(0, int(xs.min()) - PADDING)
        top = max(0, int(ys.min()) - PADDING)
        right = min(source.width, int(xs.max()) + 1 + PADDING)
        bottom = min(source.height, int(ys.max()) + 1 + PADDING)
        crop = source.crop((left, top, right, bottom))
        crop_alpha = Image.fromarray(
            np.where(
                owned[top:bottom, left:right],
                alpha[top:bottom, left:right],
                0,
            ).astype(np.uint8)
        )
        crop.putalpha(crop_alpha)
        crop.save(OUTPUT / filename, optimize=True)
        manifest.append(
            {
                "file": filename,
                "source_bounds": [
                    int(xs.min()),
                    int(ys.min()),
                    int(xs.max()) + 1,
                    int(ys.max()) + 1,
                ],
                "crop_bounds": [left, top, right, bottom],
                "size": list(crop.size),
            }
        )

    (OUTPUT / "manifest.json").write_text(
        json.dumps(
            {
                "source": "../ingredients-sprite-sheet.png",
                "count": len(manifest),
                "padding": PADDING,
                "assets": manifest,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
