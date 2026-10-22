# Sprite Mai Linh — prompt thiết kế lại

Thiết kế lại trọn bộ sprite nhân viên phục vụ Mai Linh cho game quản lý quán ăn.

## Ảnh tham chiếu bắt buộc
- Dùng ảnh sprite Mai Linh hiện tại làm chuẩn nhận diện: giữ gương mặt, tóc, trang phục và màu sắc đặc trưng.
- Dùng ảnh map phòng ăn và map bếp làm chuẩn phối cảnh, hướng camera, ánh sáng, phong cách và kích thước nhân vật trong game.
- Dùng các sprite nhân viên khác trong game làm chuẩn về nét vẽ và mức độ chi tiết.

## Phối cảnh và tỉ lệ
- Vẽ đúng góc nhìn 3/4 từ trên xuống của map; không chuyển sang góc nhìn ngang hoặc ảnh minh họa đứng nền trống.
- Nhân vật phải có kích thước hợp với lối đi, bàn ghế và nhân viên hiện có ở mức zoom trong game. Không quá nhỏ, quá to hoặc có nhiều khoảng trống trong mỗi khung.
- Giữ cùng tỉ lệ cơ thể, độ cao, vị trí chân và điểm đặt chân ở mọi hướng, động tác và khung hình.
- Mai Linh đi thẳng tự nhiên, không khom lưng, không cúi người khi đi.
- Khi nhìn theo hướng khác, phải vẽ đúng hướng mặt, thân, tay và chân theo phối cảnh. Không lật gương một hướng để giả thành hướng đối diện.

## Bố cục file
- Xuất mỗi loại chuyển động thành một sprite sheet PNG riêng, nền trong suốt.
- Mỗi ô có kích thước bằng nhau, nhân vật nằm giữa ô và chân giữ đúng cùng một đường chuẩn.
- Xếp 8 hướng theo thứ tự hàng: Nam, Tây Nam, Tây, Tây Bắc, Bắc, Đông Bắc, Đông, Đông Nam.
- Thứ tự khung hình chạy từ trái sang phải; các vòng lặp phải nối mượt từ khung cuối về khung đầu.
- Không ghi tên hướng, chữ, số, chú thích hoặc đường kẻ lên hình.

## Các sprite cần tạo
1. Đi bộ tay không: đủ 8 hướng, 12 khung mỗi hướng. Bước chân rõ, thân người giữ thăng bằng.
2. Đi bộ bưng khay: đủ 8 hướng, 12 khung mỗi hướng. Hai tay giữ khay chắc; bước chân có trọng lượng, khay chỉ nhún nhẹ.
3. Đứng chờ: đủ 8 hướng, 8 khung mỗi hướng. Thở nhẹ, chớp mắt hoặc đổi ánh nhìn rất ít.
4. Hỏi và ghi món: đủ hướng để Mai Linh luôn quay về phía khách; 10–12 khung. Cử chỉ lịch sự, tự nhiên, có thể dùng sổ ghi món nhỏ.
5. Lấy món tại quầy giao món trong bếp: tạo các hướng nhân vật cần dùng theo đúng vị trí quầy trên map; với tay lấy món rồi đặt lên khay. Tư thế phải hướng vào quầy.
6. Đặt món lên bàn: đủ 8 hướng, 12 khung mỗi hướng. Mai Linh cúi tay vừa đủ để đặt món, không làm mất bàn hoặc che khách.
7. Nghỉ mệt: đủ 8 hướng, 8 khung mỗi hướng. Lau mồ hôi hoặc thả lỏng vai, không đổi vị trí chân.
8. Làm biếng xem điện thoại: đủ 8 hướng, 8 khung mỗi hướng. Nhìn điện thoại trong tay, cử động nhẹ và không di chuyển khỏi chỗ đứng.

## Khay và món ăn
- Sprite bưng khay phải luôn có một đĩa món ăn minh họa nhìn thấy rõ, không để khay trống.
- Món chỉ cần mang tính tượng trưng: một đĩa thức ăn màu sắc dễ nhận ra, có món nướng, rau ăn kèm và chén nước chấm nhỏ; không cần khớp với món cụ thể trong order.
- Khay và đĩa phải giữ nguyên hình dáng, màu sắc, vị trí tương đối với hai tay trong toàn bộ 12 khung và cả 8 hướng.
- Món trên khay là hình minh họa của sprite. Đĩa món chính xác trên bàn sẽ do game hiển thị bằng ảnh món riêng.

## Ràng buộc khớp map
- Đường đi của nhân vật phải phù hợp lối trống giữa bếp và bàn ăn; không vẽ tư thế xuyên qua bàn, ghế, quầy hoặc tường.
- Khi lấy món, Mai Linh phải quay vào quầy giao món. Khi hỏi hoặc phục vụ, phải quay về phía khách/bàn.
- Giữ chân làm điểm neo để game sắp xếp nhân vật trước hoặc sau bàn ghế theo map.
- Tay, khay và món ăn không được cắt khỏi khung, xuyên qua người hoặc che mặt.

## Không được có
- Nền, sàn, map, bàn ghế, quầy bếp, UI, bong bóng thoại, chữ hoặc hiệu ứng bay quanh người.
- Khay trống ở trạng thái bưng món.
- Tư thế vừa đi vừa khom, trượt chân, đổi chiều cao, đổi quần áo hoặc đổi diện mạo giữa các khung.
- Mỗi hàng sai số khung, ô lệch kích thước hoặc nhân vật thay đổi tỉ lệ giữa các hướng.

## Tốc độ gợi ý khi chạy trong game
- Đi bộ và bưng khay: 6–8 FPS.
- Đứng chờ, nghỉ mệt và xem điện thoại: 3–4 FPS.
- Hỏi món, lấy món và đặt món: 6–8 FPS.
- Số khung hình trong sheet và FPS phát là hai thông số riêng; giữ đủ số khung đã chỉ định, không rút bớt khung.
