# DESIGN.md - Pomodoro Design Reference

## 1. Visual Identity & Atmosphere
Pomodoro là không gian làm việc tập trung cá nhân hoá với phong cách **Glassmorphism mờ sang trọng** trên nền các khung cảnh thiên nhiên, vũ trụ và phòng chill lofi. `VibeSpace` chỉ còn là tiền tố trong một số storage key nội bộ, không phải tên hiển thị chính thức.

Các token dưới đây là design reference. Implementation hiện tại phân bổ style qua global CSS và Tailwind utility classes, chưa có một design-token layer tập trung.

### Fundamental Design Tokens
- **Background Slate:** Tailwind `bg-slate-950` (runtime background)
- **Glass Card Fill:** `rgba(15, 23, 42, 0.75)` trong `.glass-panel`
- **Glass Border:** `1px solid rgba(255, 255, 255, 0.12)` trong `.glass-panel`
- **Primary Accent:** Violet theo mode timer và các control tương ứng
- **Secondary Accent:** Sky theo mode timer và các control tương ứng
- **Text Main:** Tailwind slate-50 / white classes
- **Text Muted:** Tailwind slate-400 / slate-500 classes

`.glass-panel` hiện chỉ cung cấp nền, `backdrop-filter: blur(20px) saturate(180%)` và border. Radius, inner glow, shadow và hover fill của các panel được khai báo riêng bằng Tailwind classes; `.glass-panel` không phải selector được các panel chính sử dụng thống nhất.

---

## 2. Typography
- Root layout tải biến font Plus Jakarta Sans và JetBrains Mono.
- **UI & Controls:** sử dụng Tailwind `font-sans` hiện tại; chưa có mapping CSS tập trung bảo đảm luôn trỏ tới Plus Jakarta Sans.
- **Pomodoro Digital Clock:** sử dụng Tailwind `font-mono` hiện tại; JetBrains Mono là font variable được load nhưng chưa có mapping CSS tập trung.

---

## 3. UI Component Specifications

### 3.1. Glass Card Container (`.glass-panel`)
- `backdrop-filter: blur(20px) saturate(180%);`
- `background: rgba(15, 23, 42, 0.75);`
- `border: 1px solid rgba(255, 255, 255, 0.12);`
- Radius, inner glow, shadow và hover fill không được định nghĩa trong selector này.
- Các panel thực tế chủ yếu kết hợp Tailwind classes như `bg-slate-900/85`, `rounded-2xl`, `shadow-2xl` và `backdrop-blur-2xl`.

### 3.2. Floating Dock Navigation
- Vị trí: Cố định giữa cạnh dưới màn hình (`bottom-6 left-1/2 -translate-x-1/2`).
- Dock thực tế dùng Tailwind classes với `backdrop-blur-2xl`, nền slate trong suốt, border trắng mờ và dạng pill; không có selector CSS `.glass-dock` riêng.
- Icon tương tác có hiệu ứng tooltips và active glow dot phía dưới.

### 3.3. Central Pomodoro Clock
- Đặt tại trung tâm vị trí màn hình.
- Timer dùng Tailwind `font-mono` cỡ chữ lớn (`text-6xl`/`text-7xl`) và drop shadow.
- Thanh progress ring là SVG stroke đổi theo mode (violet, sky hoặc indigo), không phải một gradient Violet-Cyan cố định.

---

## 4. Layout Architecture
- **Layer 0 (Background):** Curated static images; custom URL có thể phát ảnh hoặc video HTML5 khi được chọn.
- **Layer 1 (Dimmer Overlay):** Overlay `bg-slate-950` với opacity điều chỉnh được và backdrop-blur.
- **Layer 2 (Workspace Canvas):** 
  - Top Bar (Clock, Status, Zen Toggle)
  - Center Zone (Pomodoro Timer)
  - Floating Dock (Bottom)
  - Slide-over / Popup Glass Panels (YouTube Music, Sound Mixer, Wallpaper Studio, Todo List)
