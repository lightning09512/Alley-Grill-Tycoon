# QA ghi chú — player-owner-cook-turn-v1

- Base nhận diện: `generated-8dir-v1-final/frames/s_idle-frame-0.png` của chủ quán hiện tại.
- Ảnh tham chiếu của người dùng chỉ dùng để định hướng cảnh nấu và ngọn lửa; không sao chép nhân vật hay giao diện trong ảnh.
- `cook_idle`: best-effort; 4 frame, loop 4 fps. Nhân vật quay về bếp, có chuyển động khuấy nhẹ và lửa bếp nhấp nháy.
- `turn_to_player`: best-effort; 4 frame, quay từ lưng sang nhìn người chơi.
- `turn_back_to_stove`: best-effort; 4 frame, quay lại tư thế nấu.
- `sprite-gen inspect`: không có lỗi hoặc cảnh báo. Đã xem atlas và contact sheet; khung trong suốt, nhân vật không bị cắt và pivot chân ổn định.
- GIF vòng lặp `chef_cooking_turn_loop.gif` dùng 22 lượt chọn frame; các frame trùng được bộ ghép gộp thành 20 frame GIF. Thời gian mỗi lượt mặc định là 200 ms.
- Giới hạn: hình bếp/chảo/lửa đang nằm chung trong sprite được sinh và vị trí của cụm bếp lệch nhẹ giữa các tư thế quay. GIF phù hợp làm preview; nếu tích hợp vào game nơi bếp đã vẽ riêng thì cần tách bếp/lửa thành layer riêng.