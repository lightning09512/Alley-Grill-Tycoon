# Staff roster sprite pack v1

Đây là gói asset mới, chưa được nối vào game và không thay sprite đang dùng. Các hàng chuyển động dùng pipeline component-row của `sprite-gen`, ô 160×300, chân neo đáy, nền alpha trong suốt.

## Đã tạo

- Mai Linh: phục vụ, nghỉ mệt, rảnh.
- Quang Tín: thu ngân, nghỉ mệt, rảnh.
- Tấn Huy: chặt rau bằng dao phay lớn; dùng lại các animation nghỉ/rảnh đang có ở `kitchen-prep-staff-v2`. Ảnh `chopped-vegetables.png` là lớp riêng đặt trên thớt của map khi đang sơ chế.
- Cô Hạnh: nấu, nghỉ mệt, rảnh.
- Đầu bếp nam mới: nấu ở bếp thứ hai, nghỉ mệt, rảnh; tạo hình khác Tấn Huy, Cô Hạnh và chủ quán.
- An Nhiên: đón khách, nghỉ mệt, rảnh.
- 30 ảnh món PNG gắn ID công thức để hiển thị trên quầy ra món; nhân viên phục vụ có thể lấy món rồi mang đến đúng bàn.

Mỗi vòng trạng thái làm việc/nghỉ/rảnh có 4 frame. Các GIF lặp và có nền trong suốt; sprite sheet alpha và manifest runtime được đặt cạnh từng run.

## Chưa có trong gói

- Chưa tích hợp vào GameStore hay scene bếp/phòng ăn.
- Chưa sinh bộ đi bộ 8 hướng cho từng nhân viên. Đã có prompt 8 hướng trong `prompts/staff-sprite-prompts.md`; cần tạo anchor riêng từng hướng rồi QA walk row trước khi dùng.
- Animation đầu bếp có một cảnh báo tự động về độ khác silhouette giữa các frame do nhấc spatula; đã xem contact sheet, nhận diện và pivot vẫn nhất quán. Các run còn lại qua inspect không có warning.

## Thư mục chính

- `manifest.json`: mapping nhân viên, state và asset.
- `generation-report.md`: kết quả và giới hạn QA của bộ asset.
- `prompts/staff-sprite-prompts.md`: prompt tạo sprite và quy cách hàng/frame.
- `prompts/staff-system-implementation-prompt.md`: prompt sẵn dùng để nối vòng làm việc, nghỉ thật, nâng cấp và phục vụ món trong game.
- `preview-staff-roster-v1.png`, `preview-kitchen-team-v1.png`: preview các frame trên nền caro.
- `assets/interior-v2/food/kitchen-pass-v1/manifest.json`: mapping 30 món theo recipe ID; ảnh ở cùng thư mục.
