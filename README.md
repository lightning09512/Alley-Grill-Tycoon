# Alley Grill Tycoon (Quán Nhậu Hẻm)

Game quản lý quán nhậu ở phố Sài Gòn, dùng Phaser 4, TypeScript và Vite.

## Chạy trên máy

```bash
npm install
npm run dev
```

## Cách chơi

- Đặt tên quán rồi phục vụ liên tục. Ngoài phố, khách tự đến quầy; mở **Thực đơn** và chọn nguyên liệu theo đúng thứ tự.
- Ngoài phố, giữ nút mũi tên hoặc phím ←/→ (A/D) để nhân vật chạy. Qua mép trái phố sẽ sang khu nhà dân; qua mép phải khu quán sẽ sang chợ đầu mối. Vuốt ngang để xem map.
- Vào phòng ăn để khách tự chọn bàn. Chạm bàn để nhận đơn, vuốt trái sang bếp để nấu, vuốt phải trở lại để bưng món, thu tiền và dọn bàn.
- Kiếm tiền Việt Nam, danh tiếng và tiền boa; giá trị tiền trong game tính theo nghìn đồng, còn giá món và khoản thu chi hiển thị thành đồng. Nhập hàng, nâng quán qua 12 cấp và thuê phụ bếp.
- Cửa tiệm hiển thị kết quả 2 phút gần nhất mà không dừng lượt chơi. Nếu hết khả năng chế biến và thiếu tiền nhập hàng, Cửa hàng có nguyên liệu dự phòng để tiếp tục bán.
- Tiến trình được lưu trên thiết bị; phụ bếp tạo thu nhập ngoại tuyến có giới hạn.

## Tài liệu prompt

`AI_PROMPT.md` mô tả định hướng, luật chơi và số liệu mẫu để tiếp tục dùng với AI hỗ trợ code.

## Chạy thử trên Android bằng Android Studio

Game web được đóng gói thành ứng dụng Android bằng Capacitor. Cần Node.js 22 trở lên, Android Studio Otter 2025.2.1 trở lên và Android SDK.

```bash
npm install
npm run android:sync
npm run android:open
```

Android Studio sẽ mở thư mục `android/`. Chọn điện thoại hoặc emulator ở thanh công cụ rồi nhấn **Run**. Để chạy trên điện thoại thật, bật **Developer options** và **USB debugging**, cắm cáp USB, chấp nhận hộp thoại cho phép gỡ lỗi trên điện thoại rồi chọn thiết bị trong Android Studio.

Sau khi sửa game web, chạy lại `npm run android:sync` rồi nhấn **Run** trong Android Studio để cập nhật app trên điện thoại.
