# Prompt: tán cây và cờ chuyển động, bám đúng map

## Ảnh tham chiếu

Dùng `assets/backgrounds/time-of-day/saigon-street-four-shops-afternoon.png` làm ảnh chuẩn. Giữ nguyên bố cục, góc nhìn, màu sắc và nét vẽ của map phố Sài Gòn.

## Prompt tạo lớp cây

Tách riêng các cụm tán lá đang có ở hai mép phố thành nhiều lớp PNG nền trong suốt để ghép trở lại đúng lên chính những cây đó. Mỗi cụm có lớp cành phía sau, lớp lá chính và một vài nhánh/lá phía trước để tạo chiều sâu. Giữ nguyên hình dáng và vị trí gốc của cây; các lớp phải chồng khít với tán cây gốc, không được xuất hiện trên mái, cửa sổ, biển hiệu, mái hiên hoặc khoảng trời trống. Không tự thêm nhánh nhỏ lơ lửng giữa mặt tiền.

Các lớp lá phải có màu vàng xanh, lá xanh đậm và hoa vàng cùng ánh sáng chiều như ảnh gốc. Chuyển động gió rất nhẹ: phần gốc bám cố định vào thân cây; ngọn cành và mép lá lay chậm, lệch pha nhẹ giữa các lớp. Không làm cả bụi cây trượt đi cùng nhau.

## Prompt tạo lớp cờ

Tách riêng phần vải cờ Việt Nam ở ban công cửa hàng bên phải. Giữ cột cờ nguyên vị trí và gắn mép trái của vải vào đúng cột trong map. Tạo các khung vải phấp phới nhẹ từ mép cột ra mép ngoài; ngôi sao vàng đi theo mặt vải, không đứng yên hoặc tách rời. Giữ đúng đỏ cờ, ngôi sao vàng và nét vẽ của ảnh nền.

## Đầu ra cần có

- Các PNG có nền trong suốt, đúng kích thước map `2172 × 1280`, đặt trùng tọa độ gốc khi ghép lên map.
- Một ảnh nền sạch cho mỗi layer được tách, không còn bóng đôi của tán cây hoặc lá cờ tĩnh phía dưới.
- Sprite sheet tuần hoàn, các khung cùng kích thước và cùng điểm neo; khung cuối nối mượt với khung đầu.
- Tệp ghi rõ tọa độ điểm neo và vùng đặt từng lớp trên map.

## Tránh

- Không đổi hoặc vẽ lại cửa hàng, chữ, người, đường, trời hay đồ vật khác.
- Không dùng pixel art hoặc cây/cành từ phong cách khác.
- Không để cành, lá hoặc cờ trôi khỏi cây/cột; không thêm bóng hay nền riêng.
- Không che biển hiệu, cửa sổ, mái hiên hoặc chi tiết quan trọng của cửa hàng.

Ghi chú tích hợp hiện tại: game dùng `assets/effects/saigon-tree-canopy-depth-layer-v1.png` làm bốn lớp lá nhỏ ở hai mép tán, mỗi lớp có điểm neo và nhịp lay riêng. Tán lá và lá cờ gốc cũng được làm gió lay bằng displacement map trên ảnh nền; không dùng atlas pixel-art cũ cho cành/cờ.
