export type Language = 'vi' | 'en';

export const translations = {
  vi: {
    // App Header & Topbar
    appTitle: 'VibeSpace',
    zenMode: 'Chế Độ Zen',
    exitZenMode: 'Thoát Zen Mode',
    
    // Pomodoro Timer
    workTab: 'Làm Việc (25m)',
    shortBreakTab: 'Nghỉ Ngắn (5m)',
    longBreakTab: 'Nghỉ Dài (15m)',
    completedSessions: 'Phiên đã xong:',
    startFocus: 'Bắt Đầu Tập Trung',
    pauseFocus: 'Tạm Dừng',
    resetTimer: 'Đặt lại đồng hồ',
    zenModeTooltip: 'Chế Độ Zen Focus',

    // Navigation Dock Tooltips
    musicDock: 'YouTube Lo-Fi Music',
    mixerDock: 'White Noise Ambient Mixer',
    wallpaperDock: 'Wallpaper Studio & Dimmer',
    todoDock: 'Daily Todo List',
    zenDock: 'Chế Độ Zen (Ẩn Giao Diện)',

    // YouTube Player Panel
    youtubeTitle: 'YouTube Lo-Fi Radio',
    customLinkPlaceholder: 'Dán đường link YouTube...',
    playButton: 'Phát',
    featuredStations: {
      youtubeCustomStation: 'YouTube Tùy Chỉnh',
      defaultStation: 'Đài Lofi Nổi Bật',
      deleteStation: 'Xóa station'
    },
    openOnYoutube: 'Mở trên YouTube',
    invalidYoutubeUrl: 'Vui lòng nhập đường link YouTube hợp lệ!',
    unmuteNotice: 'Nhấp để bật âm thanh YouTube',

    // Ambient Mixer Panel
    mixerTitle: 'White Noise Ambient Mixer',
    stopAll: 'Tắt hết',
    vibePresets: 'Vibe Presets Gợi Ý',
    rainSound: 'Mưa Rào',
    thunderSound: 'Sấm Chớp Mờ',
    campfireSound: 'Lửa Trại',
    windSound: 'Gió Rừng',
    wavesSound: 'Sóng Biển',
    cafeSound: 'Quán Cà Phê',
    birdsSound: 'Chim Hót',
    cricketsSound: 'Đêm Rừng / Dế Mèn',
    keyboardSound: 'Gõ Phím Cơ',

    // Presets
    presetCozyRain: 'Mưa Ấm Cúng',
    presetNightCampfire: 'Đêm Cắm Trại',
    presetBeachCafe: 'Cà Phê Bờ Biển',

    // Wallpaper Studio Panel
    wallpaperTitle: 'Wallpaper Studio & Dimmer',
    dimmerOpacity: 'Độ Tối Nền (Dimmer):',
    dimmerBlur: 'Độ Mờ Nền (Blur):',
    customWallpaperSection: 'Dán URL Ảnh / Video Tùy Chỉnh',
    customUrlPlaceholder: 'Dán URL hình ảnh hoặc video...',
    saveButton: 'Lưu',
    imageType: 'Ảnh',
    videoType: 'Video',
    customGallery: 'Ảnh Nền Tùy Chỉnh',
    curatedGallery: 'Kho Ảnh Nền Mặc Định',
    deleteWallpaper: 'Xóa ảnh nền',

    // Daily Todo List Panel
    todoTitle: 'Daily Todo List',
    autoResetNotice: 'Tự động reset 00:00 hằng ngày',
    dateLabel: 'Ngày:',
    progressLabel: 'Tiến độ hoàn thành',
    addPlaceholder: 'Thêm công việc hằng ngày...',
    noTasks: 'Chưa có công việc nào. Hãy thêm công việc mới!',
    clearCompleted: 'Xóa các việc đã xong',

    // Authentication
    auth: {
      workspaceTitle: 'Không gian làm việc',
      close: 'Đóng',
      personalInfo: 'Thông tin cá nhân',
      logout: 'Đăng xuất',
      loginTitle: 'Chào mừng trở lại',
      registerTitle: 'Tạo tài khoản mới',
      loginSubtitle: 'Đăng nhập để đồng bộ dữ liệu của bạn',
      registerSubtitle: 'Đăng ký nhanh để bắt đầu đồng bộ dữ liệu',
      displayNamePlaceholder: 'Tên hiển thị',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Mật khẩu',
      loginSubmit: 'Đăng nhập & đồng bộ',
      registerSubmit: 'Tạo tài khoản',
      noAccountPrompt: 'Chưa có tài khoản?',
      registerAction: 'Đăng ký',
      hasAccountPrompt: 'Đã có tài khoản?',
      loginAction: 'Đăng nhập',
    },
  },
  en: {
    // App Header & Topbar
    appTitle: 'VibeSpace',
    zenMode: 'Zen Mode',
    exitZenMode: 'Exit Zen Mode',

    // Pomodoro Timer
    workTab: 'Focus (25m)',
    shortBreakTab: 'Short Break (5m)',
    longBreakTab: 'Long Break (15m)',
    completedSessions: 'Completed Sessions:',
    startFocus: 'Start Focus Session',
    pauseFocus: 'Pause',
    resetTimer: 'Reset Timer',
    zenModeTooltip: 'Zen Focus Mode',

    // Navigation Dock Tooltips
    musicDock: 'YouTube Lo-Fi Music',
    mixerDock: 'White Noise Ambient Mixer',
    wallpaperDock: 'Wallpaper Studio & Dimmer',
    todoDock: 'Daily Todo List',
    zenDock: 'Zen Mode (Hide UI)',

    // YouTube Player Panel
    youtubeTitle: 'YouTube Lo-Fi Radio',
    customLinkPlaceholder: 'Paste YouTube video link...',
    playButton: 'Play',
    featuredStations: {
      youtubeCustomStation: 'Featured YouTube Custom Station',
      defaultStation: 'Featured Lo-Fi Stations',
      deleteStation: 'Delete station',
    },
    openOnYoutube: 'Open on YouTube',
    invalidYoutubeUrl: 'Please enter a valid YouTube video link!',
    unmuteNotice: 'Click to enable YouTube audio',

    // Ambient Mixer Panel
    mixerTitle: 'White Noise Ambient Mixer',
    stopAll: 'Stop All',
    vibePresets: 'Suggested Vibe Presets',
    rainSound: 'Heavy Rain',
    thunderSound: 'Soft Thunder',
    campfireSound: 'Campfire',
    windSound: 'Forest Wind',
    wavesSound: 'Ocean Waves',
    cafeSound: 'Cafe Ambient',
    birdsSound: 'Bird Chirping',
    cricketsSound: 'Night Crickets',
    keyboardSound: 'Mechanical Keyboard',

    // Presets
    presetCozyRain: 'Cozy Rain',
    presetNightCampfire: 'Night Campfire',
    presetBeachCafe: 'Beach Cafe',

    // Wallpaper Studio Panel
    wallpaperTitle: 'Wallpaper Studio & Dimmer',
    dimmerOpacity: 'Background Darkening (Dimmer):',
    dimmerBlur: 'Background Blur:',
    customWallpaperSection: 'Paste Custom Image / Video URL',
    customUrlPlaceholder: 'Paste image or video URL...',
    saveButton: 'Save',
    imageType: 'Image',
    videoType: 'Video',
    customGallery: 'Custom Wallpapers',
    curatedGallery: 'Default Wallpapers Gallery',
    deleteWallpaper: 'Delete wallpaper',

    // Daily Todo List Panel
    todoTitle: 'Daily Todo List',
    autoResetNotice: 'Auto-resets at 00:00 midnight daily',
    dateLabel: 'Date:',
    progressLabel: 'Completion Progress',
    addPlaceholder: 'Add a daily task...',
    noTasks: 'No tasks yet. Add a new task above!',
    clearCompleted: 'Clear completed tasks',

    // Authentication
    auth: {
      workspaceTitle: 'Workspace',
      close: 'Close',
      personalInfo: 'Personal information',
      logout: 'Log out',
      loginTitle: 'Welcome back',
      registerTitle: 'Create a new account',
      loginSubtitle: 'Sign in to sync your data',
      registerSubtitle: 'Sign up quickly to start syncing your data',
      displayNamePlaceholder: 'Display name',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
      loginSubmit: 'Sign in & sync',
      registerSubmit: 'Create account',
      noAccountPrompt: "Don't have an account?",
      registerAction: 'Sign up',
      hasAccountPrompt: 'Already have an account?',
      loginAction: 'Sign in',
    },
  },
};
