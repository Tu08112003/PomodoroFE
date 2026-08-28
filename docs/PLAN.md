# PLAN.md - Kế hoạch Triển khai Dự án Pomodoro (Chi tiết Tasks - Next.js)

## Quy trình Tổng quát (Pipeline Workflow)
Dự án tuân thủ nghiêm ngặt lộ trình 4 bước chuẩn:
1. **Planning:** Xác lập yêu cầu (PRD), Kiến trúc (TECH_ARCHITECTURE) và Kế hoạch chi tiết (PLAN).
2. **Design (Google Stitch):** Tạo giao diện UI, layout và Design System bằng Google Stitch MCP.
3. **Download Design từ Stitch:** Trích xuất HTML/CSS, Design Tokens & Mockups từ Stitch.
4. **Code (Convert Design to Next.js Component):** Xây dựng ứng dụng Next.js hoàn chỉnh với đầy đủ tương tác và logic kinh doanh.

---

## Danh sách Tasks Chi tiết Theo Giai đoạn (Work Breakdown Structure)

### Giai đoạn 1: Planning & Khởi tạo Bộ khung Dự án (Project Setup)
- [x] **Task 1.1:** Đọc và chốt các tài liệu `docs/PRD.md`, `docs/TECH_ARCHITECTURE.md`, `docs/PLAN.md`.
- [x] **Task 1.2:** Khởi tạo cấu trúc dự án Next.js App Router + TypeScript (`package.json`, `next.config.mjs`, `tsconfig.json`).
- [x] **Task 1.3:** Cài đặt các thư viện bổ trợ (`tailwindcss`, `@tailwindcss/postcss`, `lucide-react`, `framer-motion`, `canvas-confetti`).
- [x] **Task 1.4:** Thiết lập Tailwind CSS v4 và global CSS cho các hiệu ứng Glassmorphism (`backdrop-blur`, border mờ và nền frosted); các panel hiện chủ yếu dùng Tailwind utility classes trực tiếp.
- [x] **Task 1.5:** Khởi tạo cây thư mục thực tế của ứng dụng (`src/app/`, `src/components/`, `src/context/`, `src/hooks/`, `src/services/`, `src/types/`, `src/data/`, `src/i18n/`).
- [x] **Task 1.6:** Chuẩn bị tài nguyên tĩnh ban đầu gồm 8 file audio ambient MP3 trong `public/audio/` và danh sách hình nền mặc định trong `src/data/presets.ts`).

---

### Giai đoạn 2: UI Design via Google Stitch (Stitch MCP)
- [x] **Task 2.1:** Soạn thảo tài liệu `DESIGN.md` quy định Design Tokens (Glassmorphism palette, Typography, Frosted glass cards, Spacing, Animation).
- [x] **Task 2.2:** Khởi tạo project Pomodoro trên Stitch MCP server (`projects/9048666022125309703`).
- [x] **Task 2.3:** Thiết kế Screen 1: Layout Tổng thể Workspace (Background layer, Frosted Glass Containers, Dimmer Overlay).
- [x] **Task 2.4:** Thiết kế Screen 2: Central Pomodoro Focus Timer UI (Số đếm lớn, Circular progress indicator, Control buttons, Zen Mode entry).
- [x] **Task 2.5:** Thiết kế Screen 3: Navigation Dock linh hoạt (Floating dock với các icon thủy tinh chuyển đổi panels).
- [x] **Task 2.6:** Thiết kế Screen 4: YouTube Lo-fi Music Player Panel (Station selector cards, form dán URL, trạng thái player và native iframe controls).
- [x] **Task 2.7:** Thiết kế Screen 5: Ambient Mixer Panel (Grid 8 audio cards, Volume sliders, Toggle switches, Presets bar).
- [x] **Task 2.8:** Thiết kế Screen 6: Wallpaper Studio Panel (6 ảnh curated, Custom URL cho ảnh/video, Dimmer/Blur sliders).
- [x] **Task 2.9:** Thiết kế Screen 7: Daily Todo List Panel (Task input form, Checklist items, Progress bar, Daily Reset notification badge).
- [x] **Task 2.10:** Xuất và áp dụng Design System chính thức qua Stitch MCP.

---

### Giai đoạn 3: Download & Trích xuất Design từ Stitch
- [x] **Task 3.1:** Trích xuất HTML/CSS gốc và component mockups từ các màn hình trên Stitch.
- [x] **Task 3.2:** Quy đổi các thuộc tính thiết kế từ Stitch thành CSS Variables & Tailwind Utility Tokens tương thích với Next.js trong `src/app/globals.css`.
- [x] **Task 3.3:** Thu thập và phân loại toàn bộ SVG icons, màu sắc, bóng mờ và hiệu ứng glassmorphism vào codebase.

---

### 💻 Giai đoạn 4: Code Implementation - Next.js Component Conversion

#### 4.1. Core Layout & Navigation Framework
- [x] **Task 4.1.1:** Xây dựng Next.js App Router Root Layout (`src/app/layout.tsx`) và `src/app/page.tsx`.
- [x] **Task 4.1.2:** Xây dựng component `BackgroundLayer` hỗ trợ rendering linh hoạt Ảnh tĩnh HD, Live Video Loop (`loop autoplay muted`), và Custom URL.
- [x] **Task 4.1.3:** Xây dựng lớp dimmer điều khiển độ tối bằng opacity của overlay `bg-slate-950` và độ mờ nền (Backdrop Blur 0-20px).
- [x] **Task 4.1.4:** Xây dựng `NavigationDock` dạng thanh công cụ nổi Glassmorphism với icon chuyển đổi panels và công tắc `Zen Mode`.

#### 4.2. Central Pomodoro Focus Timer
- [x] **Task 4.2.1:** Viết custom hook `usePomodoro` quản lý đếm ngược và chuyển đổi giữa Work (25m), Short Break (5m), Long Break (15m); hook có API nội bộ cho settings nhưng chưa được expose thành UI tùy chỉnh số phút.
- [x] **Task 4.2.2:** Xây dựng component `PomodoroTimer` với font số lớn, vòng tròn tiến độ (Circular SVG Progress), nút Play/Pause/Reset.
- [x] **Task 4.2.3:** Tích hợp âm thanh thông báo chuông từ external URL khi kết thúc session đếm giờ.
- [x] **Task 4.2.4:** Xây dựng tính năng `Zen Mode`: 1-click ẩn toàn bộ Dock & Widgets xung quanh để chỉ giữ lại Đồng hồ và Hình nền thư giãn.

#### 4.3. YouTube Lo-fi Music Player
- [x] **Task 4.3.1:** Viết component `YouTubePlayerPanel` với raw `youtube-nocookie.com` iframe embed và query parameters cần thiết.
- [x] **Task 4.3.2:** Hiển thị 3 Lofi Station tuyển chọn: 1 A.M Study Session, Chillhop Essentials và Code-Fi.
- [x] **Task 4.3.3:** Tích hợp ô dán URL YouTube chỉ tự động trích xuất `videoId` 11 ký tự và lặp lại theo video ID; chưa hỗ trợ `playlistId`.
- [x] **Task 4.3.4:** Tích hợp nút Play/Pause, Mute/Unmute và thông tin track đang phát; âm lượng trong native iframe controls, chưa có Volume Slider riêng của app.

#### 4.4. Ambient White Noise Mixer
- [x] **Task 4.4.1:** Viết custom hook `useAudioMixer` sử dụng HTML5 Audio và 8 file ambient MP3 lưu trong `public/audio/`.
- [x] **Task 4.4.2:** Xây dựng component `AmbientMixerPanel` với 8 âm thanh môi trường (Mưa rào, Sấm chớp, Lửa trại, Gió rừng, Sóng biển, Chim hót, Đêm rừng, Dòng suối).
- [x] **Task 4.4.3:** Tích hợp thanh trượt âm lượng có dải màu Sky Blue lấp đầy tiến độ, công tắc Toggle từng kênh và Master Volume control / Master Mute / Tắt hết.
- [x] **Task 4.4.4:** Tích hợp bộ Sound Presets gợi ý nhanh ("Mưa Ấm Cúng", "Đêm Cắm Trại", "Bờ Biển & Suối").

#### 4.5. Wallpaper Studio
- [x] **Task 4.5.1:** Xây dựng component `WallpaperPickerPanel` với 6 ảnh curated và form Custom URL cho ảnh/video; không có upload, custom gallery preview hiện dùng ảnh.
- [x] **Task 4.5.2:** Tích hợp bảng tinh chỉnh dimmer bằng opacity overlay và blur (0px-20px) với dải màu Indigo trực tiếp.

#### 4.6. Daily Todo List & Storage Reset Engine
- [x] **Task 4.6.1:** Dùng `useCloudTodos` để xử lý LocalStorage cho anonymous todos và phát hiện ngày mới bằng UTC `YYYY-MM-DD`.
- [x] **Task 4.6.2:** Lập trình cơ chế reset theo ngày UTC: tự động dọn dẹp các task đã xong và giữ lại task dở dang sang ngày mới.
- [x] **Task 4.6.3:** Xây dựng component `TodoListPanel` hỗ trợ Thêm mới, Đánh dấu hoàn thành (Toggle), Xoá task, cùng thanh tỉ lệ hoàn thành ("3/5 tasks completed").

#### 4.7. Multi-language Support (Đa ngôn ngữ VI/EN)
- [x] **Task 4.7.1:** Xây dựng `LanguageContext` và từ điển dịch thuật song ngữ (`src/i18n/translations.ts`).
- [x] **Task 4.7.2:** Tích hợp nút công tắc **VI / EN** trên TopBar lưu vết lựa chọn vào LocalStorage.

---

### Giai đoạn 5: Verification, Refinement & Delivery
- [x] **Task 5.1:** Kiểm thử tổng thể trải nghiệm UI/UX: Độ mượt của các lớp kính mờ Glassmorphism, hiệu ứng chuyển cảnh của panels.
- [x] **Task 5.2:** Kiểm thử hệ thống âm thanh: Đảm bảo âm thanh môi trường và nhạc YouTube phát song song không bị méo tiếng hay delay.
- [x] **Task 5.3:** Kiểm thử cơ chế Daily Reset của Todo List bằng cách kiểm tra timestamp UTC `YYYY-MM-DD`.
- [x] **Task 5.4:** Kiểm thử hiển thị responsive trên các kích thước màn hình (Desktop 1920x1080, Laptop 1366x768, Tablet 768px, Mobile 375px).
- [x] **Task 5.5:** Thực hiện Next.js production build bằng `npm run build`; repository hiện không có script `typecheck` riêng.
- [x] **Task 5.6:** Cập nhật tài liệu `PLAN.md`, đánh dấu các task hoàn thành và bàn giao dự án.

---

### Giai đoạn 6: Frontend–Backend Cloud Integration

- [x] **Task 6.1:** Thêm API client dùng `NEXT_PUBLIC_API_URL`, gửi credentials để browser quản lý refresh cookie HttpOnly.
- [x] **Task 6.2:** Thêm `AuthProvider` với anonymous mode mặc định, login/register/logout và khôi phục session sau reload.
- [x] **Task 6.3:** Giữ access token trong memory; không lưu access token hoặc refresh token vào LocalStorage.
- [x] **Task 6.4:** Đồng bộ todos, wallpaper custom và YouTube tracks qua backend khi authenticated; anonymous todos và custom wallpapers dùng LocalStorage, còn anonymous saved stations hiện chỉ tồn tại trong runtime và bị clear khi hook khởi tạo.
- [x] **Task 6.5:** Kết nối Cloud workspace vào top bar nhưng không thay đổi Pomodoro, mixer hoặc wallpaper preset curated hiện tại.
- [x] **Task 6.6:** Chạy Next.js production build bằng `npm run build`; không có script TypeScript check riêng.
- [ ] **Task 6.7:** Kiểm thử browser thực tế với backend MongoDB test riêng: register/login, reload, logout và CRUD cloud resources.
- [x] **Task 6.8:** Khởi tạo Git repository PomodoroFE, đẩy mã nguồn lên GitHub qua các branch tính năng, merge vào main và tuân thủ Conventional Commits.

#### Cấu hình chạy local

1. Khởi động backend tại `PomodoroBE` với `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` và `CORS_ORIGIN=http://localhost:3000`.
2. Tạo file `.env.local` tại root frontend từ mẫu `.env.example` nếu mẫu được cung cấp; mặc định API là `http://localhost:3001/api`.
3. Chạy frontend bằng `npm run dev` tại root repository `PomodoroFE`.
4. Không đưa MongoDB URI thật, password, JWT secret hoặc refresh token vào source control.

Frontend hỗ trợ hai chế độ: anonymous dùng LocalStorage cho todos và custom wallpapers, còn authenticated dùng cloud sync. Anonymous saved stations hiện chỉ tồn tại trong runtime; access token chỉ tồn tại trong memory; refresh token chỉ do backend lưu trong cookie HttpOnly. Pomodoro, audio mixer, curated stations/wallpapers và các preference UI chưa có resource backend nên vẫn hoạt động local/static.
