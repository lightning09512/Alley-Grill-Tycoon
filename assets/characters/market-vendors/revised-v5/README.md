# NPC người bán chợ đầu mối — revised v5

Bộ sprite cho đủ bảy quầy mua nguyên liệu. Tạo bằng `sprite-gen` với Codex, bám theo ảnh tham chiếu Hàng Rong Mobile và mẫu cô bán rau đã duyệt. Nhân vật là người bán hàng Việt Nam trưởng thành, nét viền tay hơi không đều, màu lì, shading gọn, biểu cảm tỉnh và hơi hài. Tay buông tự nhiên; không nháy mắt, vẫy tay, tạo dáng bán hàng hay diễn động tác lớn.

## File cho mỗi NPC

Mỗi ID có ba đầu ra:

- `<id>.png` — hình đứng toàn thân, nền trong suốt, 1024×1536.
- `<id>-idle-atlas.png` — atlas ngang 4 khung, mỗi ô 1024×1536.
- `<id>-idle.gif` — idle loop trong suốt, 4 khung × 500 ms, lặp liên tục.
- `<id>-idle-manifest.json` — thông tin frame, timing và loop cho game.

| Quầy | NPC ID | Nhận diện |
|---|---|---|
| Thịt | `butcher-auntie` | Cô bán thịt mập, tóc muối tiêu xoăn ngắn, tạp dề đỏ gạch |
| Cá | `fishmonger-uncle` | Chú bán cá tóc muối tiêu, ria mép, tạp dề chống nước và ủng |
| Hải sản/cua ghẹ | `crab-seller-auntie` | Cô bán hải sản đội mũ vải xanh, tạp dề xanh và ủng |
| Rau củ | `vegetable-auntie` | Cô bán rau quấn khăn caro, áo xanh bạc màu, tạp dề xanh đậm |
| Trái cây | `fruit-uncle` | Chú bán trái cây dáng gầy, đội nón cũ, khăn vắt vai |
| Gia vị | `spice-auntie` | Cô bán gia vị đeo kính, áo hoa đỏ cũ, tạp dề nâu |
| Tạp hóa | `grocery-auntie` | Cô bán tạp hóa tóc ngắn, đeo kính, áo tím nhạt và tạp dề xanh |

## Chuyển động idle

Mỗi atlas dùng cùng một dáng đứng. Sprite-gen curation dịch toàn thân rất nhẹ theo chu kỳ `0, -6, -12, -6` pixel ở canvas 1024×1536 (khoảng 0–3 px khi nhân vật cao 350 px), ở 2 fps. Không đổi mặt, tay hay quần áo giữa các khung.

Prompt tạo ảnh nằm trong `prompts/`, log và báo cáo nền alpha nằm trong `reports/`. Bản nháp đầu của cô bán thịt được lưu trong `drafts/`; file chính là bản đã phân biệt tóc và gương mặt với cô bán rau.