# Báo cáo tạo sprite nhân viên v1

## Kết quả

- Đã tạo 16 vòng animation mới bằng sprite-gen và Codex image rows, mỗi vòng 4 frame, nền alpha trong suốt.
- Bốn nhân viên hiện có: Mai Linh (phục vụ), Quang Tín (thu ngân), Cô Hạnh (nấu), An Nhiên (đón khách). Mỗi người có một vòng làm việc đúng vai trò, một vòng nghỉ mệt và một vòng rảnh.
- Hai nhân vật bếp: Tấn Huy có vòng chặt rau bằng dao phay lớn; đầu bếp nam mới có vòng nấu ở bếp thứ hai, nghỉ và rảnh. Tấn Huy có thêm ba GIF idle/rest sẵn từ v2 được tham chiếu lại, không tạo bản trùng.
- Có 30 ảnh PNG theo mã món để dùng ở quầy ra món. Hai sheet món hiện có được tách theo ô; mẹt nướng đặc biệt được dùng lại; trứng nướng mỡ hành được tạo ảnh riêng. Ảnh rau củ đã cắt là asset riêng để phủ lên thớt khi Tấn Huy đang làm.

## QA

- Các hàng mới đều có đúng 4 frame, GIF loop và báo nền trong suốt.
- `sprite-gen inspect` không báo lỗi cho các run. Năm run không có warning.
- Run của Cô Hạnh báo độ tương đồng silhouette thấp ở hàng `work_cook` vì tư thế nhấc spatula tạo thay đổi lớn ở cánh tay; đã xem từng frame qua contact sheet, thấy cùng nhận diện, chân neo ổn định và chu kỳ trở về tư thế đầu.
- Đã xem preview của toàn bộ nhân viên và ảnh món trên nền caro để kiểm tra bố cục, alpha và tên món.

## Giới hạn hiện tại

- Đây là candidate asset pack. Không sửa code game và chưa bật các GIF trong gameplay.
- Các hàng đi bộ 8 hướng chưa sinh; prompt và quy trình anchor đã có trong `prompts/staff-sprite-prompts.md`. Không dùng flip để giả hướng.
- Luồng nghỉ thật, giảm tốc độ theo thể lực, trả lương/nâng cấp và chuyển ảnh món từ quầy sang khay rồi lên bàn nằm trong `prompts/staff-system-implementation-prompt.md`, chưa được triển khai.
