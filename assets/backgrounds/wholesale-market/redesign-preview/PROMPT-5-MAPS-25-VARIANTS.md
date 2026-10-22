# Prompt bộ 5 map chợ × 5 thời điểm/thời tiết

Mục tiêu: tạo **25 ảnh nền riêng** (5 khu chợ × sáng, trưa, chiều, tối, mưa), không ghép thành sprite sheet. Người bán được vẽ trực tiếp vào nền, đứng sau quầy theo tỉ lệ chibi của NPC game. Bộ mới đã tạo ở `../redesign-v2/` và được nối vào `WholesaleMarketScene`.

## Ảnh tham chiếu

- **Phong cách nền game chính:** `assets/backgrounds/time-of-day/saigon-street-four-shops-afternoon.png` — chỉ dùng bảng màu, nét vẽ và không khí game. Không bê nhà phố/cảnh đường vào trong chợ.
- **Bố cục từng khu:** dùng ảnh `afternoon.png` tương ứng làm ảnh bố cục; giữ vị trí quầy trái/phải, chiều rộng lối đi và điểm tụ như ảnh gốc.
- **Phong cách nhân vật:** `assets/characters/saigon-market-shopper-front-customer.png`, `assets/characters/saigon-office-man-front-customer.png`, và `assets/characters/sprite-gen-walk/saigon-market-shopper-walk-16f.png`. Đây mới là mẫu phong cách đúng: NPC chibi nhỏ gọn, đầu lớn hơn thân, viền rõ, tô bóng mềm, chi tiết gọn. Không dùng bộ sprite người bán hiện tại làm mẫu phong cách.

## Prompt nền dùng chung

```text
Create ONE standalone portrait background image for the existing Vietnamese mobile game, Alley Grill Tycoon. This is one image in a set of 25 separate game backgrounds: five fixed market locations, each with five lighting/weather variants. Do not make a collage, contact sheet, sprite sheet, multiple panels, or a UI screenshot.

References: use the supplied market background as the exact composition/layout reference for this location; use the supplied main-game street background for the world-art palette and linework; use the supplied walking-NPC images as the mandatory character-style reference. Create new market seller designs appropriate for the stall, but render them like the small chibi pedestrians from the main game: same compact proportions, head-to-body ratio, silhouette, outline weight, soft shading and restrained facial details. Do not use the semi-realistic style of the current market-vendor sprites.

Draw a lively, welcoming Vietnamese wholesale market in the same 2D game world as the main game: warm rounded shapes, clean dark-brown outlines, clear readable silhouettes, rich but controlled tropical colors, charming everyday Saigon details. Keep the market background richly illustrated and keep people visibly in the same chibi sprite style as the walking NPC references. People should be simpler, smaller, and more compact than the detailed market goods. Not photorealistic, gritty, glossy 3D, or anime.

Match the supplied market composition exactly: portrait 9:16, straight-on view down the central aisle, same left/right stall arrangement, same perspective and vanishing point, same relative counter heights and canopy positions. Preserve one clear, unobstructed central walking lane. Keep the lower center visually quiet for the separately composited player basket and the bottom navigation icons.

Integrate two chibi game-style sellers into their own stalls. They stand behind the counters, at believable scale and depth; show head, shoulders, arms, and enough torso to read clearly. Let the counter and goods naturally hide the lower body at the waist. Make the point where each character meets the counter visually clear, with natural contact shadow. No floating, no pasted-on realistic figures, no legs cut across mid-thigh, no limbs showing through counters.

This output is the [LOCATION] map in [MOOD]. Change only lighting, weather, and small environmental reflections between mood variants; keep the camera, stall geometry, goods, seller designs, seller placement, and composition consistent across all five variants of this location.

Output: clean edge-to-edge game background art at the same portrait aspect ratio as the supplied map. No readable text, labels, shop names, logos, watermarks, HUD, buttons, arrows, player, hands, basket, or extra customers.
```

## Năm khu chợ

Với mỗi khu, nối prompt nền dùng chung với mô tả bên dưới và một biến thể ánh sáng ở phần kế tiếp. Đính kèm đúng ảnh bố cục và sprite người bán ghi trong cùng hàng.

| ID | Khu | Bố cục, người bán và hàng hóa |
|---|---|---|---|
| 01 | Rau củ, gia vị | Quầy trái: một chú bán trái cây và rau củ. Quầy phải: một cô bán gia vị. Trái cây, rau củ, ớt, tỏi và hũ lọ. Lối đi giữa thoáng. |
| 02 | Tạp hóa, quần áo | Quầy trái: một cô bán hàng tạp hóa. Quầy phải: một chú bán quần áo. Hàng khô, trứng, gạo; quần áo treo và gấp gọn. |
| 03 | Thịt, cá | Quầy trái: một cô bán thịt. Quầy phải: một chú bán cá. Thịt heo, bò, gà được bày sạch sẽ; cá và hải sản đặt trên đá. |
| 04 | Hải sản, rau xanh | Quầy trái: một cô bán hải sản. Quầy phải: một cô bán rau. Tôm, cua, nghêu, mực trên đá sạch; rau lá, rau củ và nấm. |
| 05 | Giày dép, túi xách | Quầy trái: một cô bán giày dép. Quầy phải: một chú bán túi xách. Giày bày theo đôi; túi xách treo và xếp trên kệ. |

## Năm biến thể ánh sáng

- **Sáng:** nắng sớm dịu, hơi xanh trong bóng râm, ánh vàng nhẹ ở đầu hẻm; không phủ sương.
- **Trưa:** trời sáng rõ, màu hàng hóa trung thực, bóng ngắn mềm; không cháy trắng.
- **Chiều:** ánh vàng ấm, bóng đổ dài nhưng mềm, không biến thành hoàng hôn đỏ rực.
- **Tối:** nền xanh tím dịu, đèn quầy vàng ấm soi rõ người bán và hàng; vẫn đọc rõ lối đi, không để nền chìm đen.
- **Mưa:** trời âm u mát, mặt nền ướt phản chiếu đèn và mái bạt vừa phải; không mưa trắng xóa, không đổi vị trí đồ vật.

## Tổ hợp tên 25 ảnh

| Khu | Sáng | Trưa | Chiều | Tối | Mưa |
|---|---|---|---|---|---|
| 01 rau củ–gia vị | `market-01-morning.png` | `market-01-noon.png` | `market-01-afternoon.png` | `market-01-night.png` | `market-01-rain.png` |
| 02 tạp hóa–quần áo | `market-02-morning.png` | `market-02-noon.png` | `market-02-afternoon.png` | `market-02-night.png` | `market-02-rain.png` |
| 03 thịt–cá | `market-03-morning.png` | `market-03-noon.png` | `market-03-afternoon.png` | `market-03-night.png` | `market-03-rain.png` |
| 04 hải sản–rau xanh | `market-04-morning.png` | `market-04-noon.png` | `market-04-afternoon.png` | `market-04-night.png` | `market-04-rain.png` |
| 05 giày dép–túi xách | `market-05-morning.png` | `market-05-noon.png` | `market-05-afternoon.png` | `market-05-night.png` | `market-05-rain.png` |

**Lưu ý khi tạo:** mỗi lần chạy tạo một ảnh duy nhất. Với từng khu, dùng một bản chiều làm ảnh gốc; tạo bốn mood còn lại bằng cách chỉnh ánh sáng/thời tiết trên chính ảnh gốc đó. Bộ `redesign-v2` hiện có đủ 25 tệp riêng và scene game đã trỏ sang bộ mới. Các map cũ được giữ nguyên để có thể khôi phục.

