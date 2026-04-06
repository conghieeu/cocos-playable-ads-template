# ARDraw Playable Ad (Cocos Creator)

Dự án Playable Ad được phát triển trên nền tảng **Cocos Creator (v3.8.x)**. Dự án được tối ưu hóa cho quảng cáo tương tác (Playable Ads) dạng Super HTML, chứa các logic xử lý tương tác người dùng, hiệu ứng hình ảnh, và đáp ứng (responsive) trên nhiều kích thước màn hình thiết bị di động.

## Kiến trúc mã nguồn (Assets/Scripts)

Mã nguồn được tổ chức theo từng module chức năng tại `assets/Scripts/`:

### 1. `Core/` - Hệ thống cốt lõi
- `PlayableAdManager.ts` & `super_html_playable.ts`: Quản lý vòng đời và logic đặc thù cho Playable Ad.
- `CheckDevice.ts`: Phát hiện thiết bị (Android/iOS) và môi trường trình duyệt để tối ưu hóa Media.
- `EventHolder.ts`: Chứa và kích hoạt các mảng `EventHandler` tuỳ chỉnh.
- `NextStep.ts`: Điều phối luồng kịch bản khi người dùng hoàn thành một giai đoạn.

### 2. `Effects/` - Hiệu ứng & Animation
- `AnimationTrigger.ts` & `AnimationCtrl.ts`: Điều khiển component Animation (play clip, điều khiển qua index).
- `TweenOne.ts` & `TweenArray.ts`: Hệ thống xử lý hiệu ứng Tween linh hoạt cho đơn lẻ hoặc mảng các đối tượng.
- `OpacityReactor.ts`, `PositionLerpReactor.ts`, `ScaleReactor.ts`: Các component phản ứng linh hoạt với thay đổi thuộc tính đồ họa.
- `ShakeEffect.ts`: Tạo hiệu ứng rung lắc cho Camera hoặc Node.

### 3. `Interactions/` - Tương tác vật lý
- `TouchEventListener.ts`: Lắng nghe và xử lý các sự kiện chạm nền tảng.
- `NodeActions.ts`: Các hành động cơ bản cho Node như ẩn hiện, `destroyNode`.
- `SnapSlider.ts`: Thanh trượt hỗ trợ tự động khớp (snap) vào các điểm mốc.
- `TapToCount.ts`: Xử lý đếm tương tác chạm của người dùng.
- `VerticalStepMover.ts`: Di chuyển vật thể theo từng bước cố định trên trục dọc.

### 4. `Media/` - Âm thanh & Video
- `MediaAutoplayManager.ts`: Xử lý tự động phát Media để vượt qua các rào cản tương tác của trình duyệt di động.
- `VideoController.ts`: Điều khiển play/pause cho `VideoPlayer`.

### 5. `UI/` - Giao diện & Layout
- `AutoFitLayout.ts`, `LayoutAdjuster.ts`: Tự động căn chỉnh bố cục giao diện.
- `FullScreenNode.ts`, `FullScreenSize.ts`: Xử lý Node chiếm toàn bộ diện tích màn hình trên mọi tỉ lệ.
- `SliderThresholdTrigger.ts`: Kích hoạt sự kiện khi Slider vượt ngưỡng quy định.
- `EditBoxMaxLengthTrigger.ts`: Xử lý sự kiện khi nhập tối đa độ dài văn bản.

### 6. `Utils/` - Tiện ích
- `CooldownTimer.ts`: Quản lý thời gian hồi chiêu cho các hành động tương tác.

## Công nghệ sử dụng
- **Cocos Creator**: 3.8.8
- **Ngôn ngữ**: TypeScript
- **Target**: Playable Ad (Super HTML)

## Hướng dẫn 
- Mở dự án bằng Cocos Creator phiên bản 3.8.x.
- Các logic tương tác chủ yếu được kết nối qua cơ chế `EventHandler` trong Inspector để đảm bảo tính linh hoạt giữa Code và Design.
