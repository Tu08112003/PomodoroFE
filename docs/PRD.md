# Pomodoro Frontend PRD

## 1. Product overview

Pomodoro là một workspace web cá nhân hóa giúp người dùng tập trung, học tập và thư giãn thông qua Pomodoro, âm thanh môi trường, hình nền và YouTube lo-fi.

Frontend được xây dựng bằng Next.js 14 App Router và có thể xuất bản dưới dạng static export. Sản phẩm hỗ trợ hai chế độ:

- **Anonymous mode:** sử dụng ngay không cần tài khoản hoặc backend khả dụng.
- **Authenticated mode:** đăng nhập tùy chọn để đồng bộ một số dữ liệu cá nhân với Pomodoro Backend.

## 2. Product objectives

- Cung cấp trải nghiệm zero-friction cho người dùng anonymous.
- Tạo không gian tập trung gồm timer, âm thanh, hình nền, YouTube và todo.
- Hỗ trợ chuyển đổi giao diện Việt/Anh.
- Giữ dữ liệu anonymous trong browser và cung cấp cloud sync khi người dùng đăng nhập.
- Bảo vệ thông tin xác thực: access token không được lưu trong LocalStorage; refresh token chỉ do backend quản lý bằng HttpOnly cookie.
- Duy trì giao diện Glassmorphism và Zen Mode ít xao nhãng.

## 3. User modes and user flows

### 3.1. Anonymous flow

1. Người dùng mở frontend và bắt đầu sử dụng workspace.
2. Todos, custom wallpapers và lựa chọn ngôn ngữ được giữ trong browser theo phạm vi LocalStorage tương ứng; saved YouTube tracks chỉ tồn tại trong runtime ở anonymous mode.
3. Pomodoro, mixer và các nội dung curated hoạt động không phụ thuộc API.
4. Nếu backend không khả dụng, workspace vẫn dùng được ở mức local/static.

### 3.2. Authenticated flow

1. Người dùng mở Cloud workspace từ top bar.
2. Người dùng register hoặc login bằng email/password.
3. Frontend giữ access token trong memory và gửi refresh request với credentials để browser quản lý HttpOnly cookie.
4. Sau reload, frontend khôi phục session bằng refresh cookie rồi gọi profile hiện tại.
5. Todos, custom wallpapers và saved YouTube tracks được tải từ backend; dữ liệu local-only có thể được upload opportunistically.
6. Logout xóa trạng thái authenticated ở frontend và đưa workspace về anonymous mode.

Không có cơ chế conflict resolution tổng quát giữa local và cloud; cloud sync ưu tiên khả năng sử dụng liên tục và đồng bộ các bản ghi local-only.

## 4. Functional requirements

### 4.1. Workspace core

- **Pomodoro:** Work, Short Break và Long Break; hiển thị tiến độ, số phiên hoàn thành và điều khiển play/pause/reset.
- **Zen Mode:** ẩn dock và các panel phụ để tập trung vào timer và background.
- **Ambient mixer:** tám ambient MP3 trong `public/audio/`, volume từng track, master volume, mute, stop all và các preset âm thanh.
- **Wallpaper Studio:** sáu curated image wallpapers; custom URL hỗ trợ ảnh/video, dimmer opacity và blur từ 0 đến 20px.
- **YouTube lo-fi:** curated stations, custom YouTube URL, YouTube nocookie iframe, play/pause, mute/unmute và loop theo video ID; âm lượng dùng native iframe controls.
- **Daily todos:** thêm, toggle, xóa, clear completed và hiển thị tiến độ.
- **Clock/date:** hiển thị thời gian và ngày hiện tại theo ngôn ngữ đang chọn.
- **Language:** chuyển đổi VI/EN và lưu lựa chọn ngôn ngữ trong LocalStorage.

### 4.2. Authentication

- Register với email, password và display name tùy chọn.
- Login với email/password.
- Khôi phục session sau reload.
- Logout và chuyển về anonymous mode.
- Hiển thị lỗi API ở mức phù hợp cho người dùng.
- Hiển thị trạng thái Cloud workspace là anonymous hoặc authenticated.

### 4.3. Cloud resources

| Resource | Anonymous mode | Authenticated mode |
|---|---|---|
| Todos | LocalStorage | Backend `/api/todos`, đồng bộ với dữ liệu local |
| Custom wallpapers | LocalStorage | Backend `/api/wallpapers` |
| Saved YouTube tracks | Runtime memory; anonymous stations không được persistence | Backend `/api/youtube-tracks` |
| Pomodoro state | React state/runtime local | Vẫn local, chưa có backend resource |
| Ambient mixer | Local MP3; track volume và `isPlaying` lưu LocalStorage, master controls runtime | Vẫn local, chưa có backend resource |
| Curated wallpapers/stations | Static bundle | Vẫn static |
| Dimmer/preferences UI | React state/runtime local | Chưa có backend resource |

Frontend không gửi `userId` trong payload resource; backend xác định owner từ access token.

### 4.4. Daily todo semantics

- Todo state có `lastResetDate` dạng `YYYY-MM-DD`.
- Phiên bản hiện tại tính ngày bằng UTC qua `toISOString()`.
- Khi ngày UTC thay đổi, task đã hoàn thành bị loại bỏ và task chưa hoàn thành được giữ lại.
- Kiểm tra reset khi khởi tạo hook và theo chu kỳ khoảng một phút khi app đang mở.
- Đây không phải cam kết reset theo local midnight của từng người dùng.

## 5. Non-goals

- Không bắt buộc người dùng đăng nhập để sử dụng workspace.
- Không biến frontend static thành một server-rendered backend hoặc kết nối trực tiếp tới MongoDB.
- Không lưu Pomodoro, mixer, curated catalog hoặc mọi preference UI lên backend khi backend chưa có resource tương ứng.
- Không cam kết offline queue bền vững, conflict resolution nâng cao hoặc merge theo phiên bản.
- Không coi cloud sync là điều kiện để dùng các tính năng local/static.

## 6. Persistence và security requirements

| Dữ liệu | Nơi lưu | Phạm vi/lifetime |
|---|---|---|
| Anonymous todos | LocalStorage | Theo browser/profile |
| Anonymous wallpapers | LocalStorage | Theo browser/profile |
| Anonymous stations | Không persistence; state chỉ trong runtime và storage key bị clear | Mất khi reload |
| Language choice | LocalStorage | Theo browser/profile |
| Access token | JavaScript memory | Mất khi reload |
| Refresh token | Backend HttpOnly cookie | Do browser/backend quản lý |
| Authenticated cloud resources | Backend MongoDB qua API | Theo user account |
| Pomodoro state | React state/browser runtime | Theo phiên app |
| Mixer track preferences | LocalStorage key `vibespace_sound_mixer_v2` (`volume`, `isPlaying`) | Theo browser/profile |
| Mixer master volume/mute | React state/browser runtime | Theo phiên app |

Acceptance requirements:

- Anonymous user dùng được app khi backend không khả dụng.
- Authenticated user khôi phục được session sau reload khi refresh cookie còn hợp lệ.
- Access token và refresh token không xuất hiện trong LocalStorage.
- Cloud resources chỉ hiển thị theo user hiện tại.
- Logout xóa trạng thái authenticated ở frontend.
- Cloud request lỗi không làm crash toàn bộ workspace.
- Daily todo reset tuân theo UTC date semantics nêu trên.
