# Prompt sửa gameplay và hình ảnh Alley Grill Tycoon

Bạn đang tiếp tục dự án game hiện có trong thư mục này: **Alley Grill Tycoon (Quán Nhậu Hẻm)**, game tycoon 2D lấy bối cảnh phố Sài Gòn. Hãy đọc code và asset hiện có rồi sửa trực tiếp vào dự án; không dựng một demo rời, không thay asset đã có bằng hình vẽ placeholder.

## Những lỗi phải sửa

- Cảnh quán cần hiển thị đủ tiến trình nâng cấp 12 cấp bằng ảnh phủ khớp với nền phố.
- Sprite nhân vật đi bộ chưa được dùng đúng; khách có thể xuất hiện hoặc đổi vị trí đột ngột.
- Góc nhìn đang quá gần, khách chưa thể hiện rõ là đi trên vỉa hè tới quán.
- Cảnh phố thiếu lớp xử lý màu/ánh sáng GPU và chuyển động môi trường.
- Bảng quản lý chiếm nhiều diện tích, làm map không còn là trọng tâm.

## Tài sản phải dùng

- Map phố: `assets/backgrounds/saigon-street-map-wide-concept.png`.
- Ảnh quán theo cấp: `public/assets/shop-stages/shop_01.webp` đến `shop_12.webp`, mỗi ảnh 860 × 520 px, trong suốt và đã có sẵn xe đẩy/bếp/bàn ghế cần thiết. Vẽ ảnh ở khung nguồn (700, 0, 860, 520) của nền 2172 × 724 bằng đúng scale và offset của nền. Khi thiếu ảnh, chỉ dùng placeholder ghi số cấp và tên file cần bổ sung; không tự giả lập ảnh quán.
- Khách đứng/chờ: các sprite chính diện trong `assets/characters/`.
- Khách và người qua đường đang đi: các sheet `*-walk-horizontal-concept.png`. Dùng frame trái/phải và animation walk đúng hướng; chân bám cùng đường vỉa hè.
- Không reset texture/frame hoặc gọi lại `play()` mỗi tick khi sprite vẫn đang chạy cùng animation; chỉ đổi clip khi đổi hướng/trạng thái. Cân tốc độ đi với nhịp gait cycle để chân không trượt hoặc giật.
- Hiệu ứng cây/lá: `assets/effects/saigon-foliage-wind-animation-atlas.png`.

## Camera và bố cục

- Game tràn toàn màn hình trên desktop, tablet và mobile; hỗ trợ đổi kích thước và fullscreen.
- Thu camera ra để thấy thêm phố hai bên, nhưng giữ mặt tiền ba gian của người chơi ở trung tâm. Nếu cần lấp vùng trống do tỷ lệ ảnh panorama, dùng lớp nền map phóng lớn và làm mờ phía sau; giữ map chính rõ nét phía trước.
- Tính cỡ map theo tỷ lệ khung hình: landscape ưu tiên thấy gần trọn panorama; portrait thu map theo chiều rộng thiết bị để còn thấy cửa hàng và hai phía phố. Không phóng map theo chiều cao điện thoại đến mức chỉ còn một cửa tiệm.
- Trên desktop, giữ dock quản lý gọn (tối đa khoảng 960 px); trên tablet/điện thoại, xếp theo chiều dọc nhưng giới hạn chiều cao và cho cuộn nếu cần. Map vẫn phải chiếm phần lớn màn hình.
- Người đi bộ và khách xếp hàng chỉ di chuyển dọc mặt vỉa hè. Không đi trên lòng đường, không xuyên qua quán.
- Giữ quán nhậu và đường đi của khách ở trung tâm gameplay, đủ chỗ cho nhiều khách.
- Bảng bán hàng/đơn hàng là một dock nhỏ, gọn ở cạnh dưới; dùng panel bán trong suốt, giảm padding và chiều cao. Không để các bảng che phần lớn map.

## Luồng khách bắt buộc

1. Khi khách mới xuất hiện, tạo họ ngoài mép màn hình trên cùng đường vỉa hè; không đặt thẳng vào hàng.
2. Cho nhân vật đi bộ liên tục tới vị trí xếp hàng bằng animation trái/phải và nội suy vị trí theo thời gian. Không gán thẳng tọa độ đích gây dịch chuyển.
3. Trong lúc đang đi, không cho thao tác ráp đơn và chưa chạy đồng hồ chờ của khách.
4. Khi tới vị trí, đổi sang sprite chính diện/đứng chờ, hiện tên và món gọi, sau đó mới bật các nút nguyên liệu.
5. Khi người trước được phục vụ, cho khách kế tiếp bước tới vị trí quầy bằng animation; chỉ mở đơn tiếp theo sau khi họ tới.
6. Khách mua xong đi bộ rời khỏi khung hình; khách hết kiên nhẫn cũng đi bộ rời đi theo hướng khác. Khi người chơi chủ động đóng ca, khách còn lại cũng rời đi bằng animation. Chỉ xóa sprite sau khi hoàn tất đường đi.
7. Nhân vật nền cũng tiếp tục đi lại khi chưa mở ca để phố không thành ảnh tĩnh.

## Hình ảnh và shader

- Dùng Phaser 4 filter/shader chạy trên WebGL để xử lý màu ngày–hoàng hôn–đêm; nội suy màu, độ sáng và vignette nhẹ theo thời gian. Không dựa riêng vào một hình chữ nhật tối phủ toàn cảnh để giả làm shader.
- Giữ màu ấm, dễ nhìn; hiệu ứng phải nhẹ, không làm mờ map chính hoặc làm giảm độ rõ của sprite.
- Duy trì chuyển động mây/chim/lá/cây và hơi nóng từ quầy. Mưa chỉ bật các hiệu ứng mưa khi trạng thái thời tiết là mưa.
- Có phương án suy giảm nhẹ khi thiết bị không hỗ trợ WebGL filter; gameplay vẫn chạy được.

## Tiến trình cửa hàng

- Dùng đủ 12 ảnh phủ để nâng từ quầy vỉa hè lên quán nhậu nhiều gian và thương hiệu lớn.
- Cấp hiển thị trên UI phải khớp frame đang thấy. Nút nâng cấp và giá phải chạy hết cấp 1–12; không còn giới hạn cấp 3.
- Lưu cấp mới trong tiến trình hiện có; bản lưu cũ cấp 1–3 vẫn phải tải được.
- Giữ vòng chơi hiện tại: mở ca, khách đi tới, ráp đúng nguyên liệu, nhận tiền Việt Nam, đóng ca, nhập hàng và nâng cấp. Số tiền được lưu theo nghìn đồng; giá và khoản thu chi hiển thị thành đồng (ví dụ `35.000đ`).

## Hoàn tất

- Sửa trực tiếp các file hiện tại, cập nhật `AI_PROMPT.md` nếu thiết kế thay đổi.
- Không thêm sprite tạm bằng hình khối để thay các ảnh có sẵn.
- Không để khách dịch chuyển tức thời ở bất kỳ bước vào hàng, tiến lên quầy hay rời đi nào.
- Chỉ kết luận đã kiểm tra build/game nếu thực sự đã chạy bước kiểm tra tương ứng.

## Phát triển môi trường phố sống động

Khi tiếp tục làm shader, chu kỳ ngày–đêm, ánh sáng, bóng mây, gió, cây, chim hoặc mưa, hãy đọc thêm prompt chi tiết tại [`prompts/saigon-living-street-world-polish.md`](prompts/saigon-living-street-world-polish.md). Dùng các atlas môi trường đã có, giữ khoảng trời/mặt đường hợp lý theo ảnh map, và kiểm tra trực tiếp cả ánh sáng ban ngày, đêm lẫn mưa trên nhiều tỷ lệ màn hình.
