# Prompt triển khai hệ thống nhân viên và quầy ra món

Dùng prompt này khi yêu cầu agent nối bộ sprite mới vào game. Chỉ tham khảo vòng quản lý nhà hàng phổ biến; không sao chép giao diện, asset hoặc nội dung độc quyền của game khác.

---

Hãy hoàn thiện hệ thống nhân viên và quầy ra món trong repo game hiện có. Trước khi sửa, đọc `AGENTS.md`, cấu trúc scene và luồng `GameStore`, bếp, order, phòng ăn, kho và nhân viên. Mở rộng các hệ thống hiện có; không tạo store/luồng khách/luồng order song song.

## Asset đã có

- Danh sách vai trò, state, GIF và atlas: `assets/characters/staff-roster-v1/manifest.json`.
- Prompt và quy tắc anchor/pivot: `assets/characters/staff-roster-v1/prompts/staff-sprite-prompts.md`.
- Sprite đang chạy từng trạng thái nằm trong `run/exports/*.gif` và `run/sprite-sheet-alpha.png` ở thư mục của từng nhân viên.
- Ảnh món cho quầy ra món: `assets/interior-v2/food/kitchen-pass-v1/manifest.json`; tên asset theo recipe ID, ví dụ `{recipe-id}.png`.
- Tấn Huy dùng animation sơ chế mới ở `assets/characters/kitchen-prep-staff-v3/run/exports/chop_vegetables.gif`; đặt `chopped-vegetables.png` lên thớt có sẵn trên map trong lúc sơ chế. Không vẽ thêm thớt.
- Hai đầu bếp là Cô Hạnh và đầu bếp nam mới; bố trí ở hai station/bếp có sẵn khác nhau. Không tạo station, nồi hay lửa trùng asset của map.

## Hành vi theo vai trò

- Tấn Huy nhận việc sơ chế trong hàng bếp, di chuyển đến thớt hiện có, cắt rau theo thời gian kỹ năng/năng lượng, rồi trả nguyên liệu đã sơ chế đúng một lần. Khi không có việc, chọn idle; khi mệt phải nghỉ.
- Cô Hạnh và đầu bếp nam chia phiếu theo hai bếp hiện có. Mỗi món chỉ có một nhân viên nấu tại một thời điểm; nguyên liệu và chi phí bị trừ đúng một lần khi bắt đầu nấu. Khi đủ năng lượng, phát `work_cook`/`cook_stir`; món hoàn thành chuyển sang quầy ra món.
- Quầy ra món hiển thị ảnh PNG theo recipe ID. Đơn vị món ở quầy phải liên kết order, bàn và nhóm khách chính xác. Khi phục vụ lấy món, ảnh quầy biến mất và cùng ảnh được gắn vào khay nhân viên; sau khi món được đặt đúng bàn, ảnh chuyển sang trạng thái đang ăn trên mặt bàn. Không làm mất hoặc nhân đôi món khi chuyển trạng thái.
- Mai Linh nhận món sẵn sàng, mang từng món tới bàn của order, đặt món gọn trên bàn và tiếp tục món kế tiếp. Nếu không có nhân viên phục vụ, cho người chơi thao tác theo luồng hiện tại.
- Quang Tín thu đúng hóa đơn một lần, cộng doanh thu/tiền boa/danh tiếng một lần rồi chuyển nhóm sang rời quán.
- An Nhiên đón khách/hoạt động ở lối vào theo hệ thống khách hiện có; không sinh khách song song.

## Nghỉ, năng lượng và năng suất

- Thêm năng lượng/sức bền nhân viên vào nguồn trạng thái GameStore hiện có. Tác vụ làm giảm năng lượng theo thời gian; năng lượng thấp làm giảm tốc độ hoàn thành tác vụ theo một đường cong dễ hiểu, không tự ý sửa tốc độ di chuyển ngoài map.
- Nghỉ là trạng thái thật: nhân viên rời hàng việc và đi đến điểm nghỉ hợp lệ trên map, phát animation `rest_tired`, hồi năng lượng theo thời gian, sau đó quay lại hàng việc. Không cho nhân viên vừa nghỉ vừa hoàn tất công việc.
- `idle_lazy` chỉ dùng khi hàng việc trống và nhân viên chưa cần nghỉ; không được dùng khi còn tác vụ đang chờ.
- Giữ cách tương tác hiện có cho nhân viên chưa thuê. Khi thuê, họ tự nối tiếp đúng vai trò, nhưng không lặp thao tác người chơi vừa hoàn tất.
- Thêm nâng cấp nhân viên theo tiến triển hiện có, không mở thêm hệ thống tiền độc lập: cấp kỹ năng/đào tạo hoặc tăng lương có chi phí và hiệu quả rõ ràng. Ví dụ: tăng lương làm tăng năng suất/giảm thời gian tác vụ và tăng chi phí lương định kỳ; hiển thị trước chi phí, mức tăng và thời hạn áp dụng. Lưu tiến trình tương thích với save hiện tại.

## Trạng thái và di chuyển

- Dùng các state rõ ràng như `idle`, `work`, `rest_tired`, `idle_lazy`, `delivering`, `collecting_payment`; chỉ có một state chính cho một nhân viên tại một thời điểm.
- Dùng pathfinding/điểm đích theo map hiện có; đi vòng quanh bàn, khách, quầy và station. Không teleport, không đi xuyên vật thể và không thay đổi luồng ngoài phố.
- Khi 8 hướng chưa có asset, dùng fallback hiện tại của game và ghi rõ trong báo cáo; không lật sprite để giả hướng. Mỗi nhân viên phải dùng đúng ID có asset.

## Tính đúng và kiểm tra trực tiếp

- Một phiếu, món, tiền lương, năng lượng, tiền thanh toán và điểm danh tiếng chỉ được ghi nhận đúng một lần. Xử lý được hàng chờ, thiếu nguyên liệu, hết chỗ, nhân viên mệt và nhân viên bị người chơi giao tác vụ cùng lúc.
- Giữ điều hướng, bản đồ, camera, giao thông và UI ngoài phạm vi này.
- Chạy game, theo dõi một vòng đầy đủ: nhận order → sơ chế/nấu → món lên quầy → phục vụ lấy món → món tới bàn → khách ăn → thanh toán → dọn bàn. Kiểm tra cả lúc nhân viên nghỉ và lúc hết hàng việc; sửa lỗi hiển thị/trạng thái phát hiện được.
- Không thay asset đang dùng trước khi candidate mới được kiểm tra trong game. Báo cáo file đã đổi, cách chơi và các giới hạn còn lại.
