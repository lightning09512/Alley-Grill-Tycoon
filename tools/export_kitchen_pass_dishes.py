from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FOOD = ROOT / "assets" / "interior-v2" / "food"
OUT = FOOD / "kitchen-pass-v1"

SHEETS = {
    "hotpot-grill": {
        "path": FOOD / "food-spritesheet-hotpot-grill.png",
        "dishes": [
            ("thai-seafood-hotpot", "Lẩu Thái hải sản"),
            ("chicken-la-e-hotpot", "Lẩu gà lá é"),
            ("beef-vinegar-hotpot", "Lẩu bò nhúng giấm"),
            ("crab-beef-hotpot", "Lẩu riêu cua bắp bò"),
            ("goby-sour-leaf-hotpot", "Lẩu cá kèo lá giang"),
            ("mushroom-vegetable-hotpot", "Lẩu nấm rau củ"),
            ("pork-belly-skewers", "Xiên thịt ba chỉ nướng"),
            ("beef-betel-leaves", "Bò lá lốt"),
            ("chili-chicken-wings", "Cánh gà nướng muối ớt"),
            ("satay-chicken-feet", "Chân gà nướng sa tế"),
            ("satay-squid", "Mực nướng sa tế"),
            ("grilled-octopus", "Bạch tuộc nướng"),
            ("honey-pork-ribs", "Sườn non nướng mật ong"),
            ("scallion-okra", "Đậu bắp nướng mỡ hành"),
        ],
    },
    "snacks-rice": {
        "path": FOOD / "food-spritesheet-snacks-rice.png",
        "dishes": [
            ("lemongrass-fried-tofu", "Đậu hũ chiên sả"),
            ("salt-chicken-cartilage", "Sụn gà rang muối"),
            ("french-fries", "Khoai tây chiên"),
            ("spring-rolls", "Chả giò"),
            ("butter-garlic-snails", "Ốc hương xào bơ tỏi"),
            ("lemongrass-clams", "Nghêu hấp sả"),
            ("garlic-water-spinach", "Rau muống xào tỏi"),
            ("mango-dried-beef-salad", "Gỏi xoài khô bò"),
            ("boneless-chicken-feet-salad", "Gỏi chân gà rút xương"),
            ("butter-corn", "Bắp xào bơ"),
            ("tamarind-quail-eggs", "Trứng cút lộn xào me"),
            ("roasted-peanuts", "Đậu phộng rang"),
            ("seafood-fried-rice", "Cơm chiên hải sản"),
            ("beef-stir-fried-noodles", "Mì xào bò"),
        ],
    },
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, object] = {
        "version": 1,
        "purpose": "static images shown on the kitchen pass counter and serving tray",
        "format": "RGBA PNG; crops retain the source transparent padding",
        "recipes": {},
    }
    recipes: dict[str, dict[str, object]] = manifest["recipes"]  # type: ignore[assignment]

    for sheet_id, sheet_data in SHEETS.items():
        with Image.open(sheet_data["path"]).convert("RGBA") as sheet:
            cell_w, cell_h = sheet.width / 4, sheet.height / 4
            for cell, (recipe_id, name) in enumerate(sheet_data["dishes"]):
                col, row = cell % 4, cell // 4
                bounds = (
                    round(col * cell_w),
                    round(row * cell_h),
                    round((col + 1) * cell_w),
                    round((row + 1) * cell_h),
                )
                out_name = f"{recipe_id}.png"
                sheet.crop(bounds).save(OUT / out_name, format="PNG", optimize=True)
                recipes[recipe_id] = {
                    "name": name,
                    "asset": out_name,
                    "source": f"{sheet_data['path'].relative_to(ROOT).as_posix()}#cell-{cell}",
                    "gridCell": cell,
                    "sheet": sheet_id,
                    "generated": False,
                }

    special_platter = "special-grill-platter"
    shutil.copy2(FOOD / "mixed_grill_platter.png", OUT / f"{special_platter}.png")
    recipes[special_platter] = {
        "name": "Mẹt nướng đặc biệt",
        "asset": f"{special_platter}.png",
        "source": "assets/interior-v2/food/mixed_grill_platter.png",
        "generated": False,
    }
    recipes["scallion-grilled-eggs"] = {
        "name": "Trứng nướng mỡ hành",
        "asset": "scallion-grilled-eggs.png",
        "source": "Codex image generation; see prompts/scallion-grilled-eggs.txt",
        "generated": True,
        "status": "generated",
    }

    (OUT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Exported {len(recipes)} static dish images for the kitchen pass.")


if __name__ == "__main__":
    main()
