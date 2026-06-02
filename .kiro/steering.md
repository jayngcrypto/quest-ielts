# Quest IELTS — Project Steering Document

## Tổng quan sản phẩm
Web app học IELTS gamified dành cho người Việt Nam (16–35 tuổi).
Tagline: "Biến hành trình IELTS thành cuộc phiêu lưu."
Phong cách: Duolingo + Notion + RPG Adventure. Font Nunito. Pastel princess × Mario.

## Tech Stack đã quyết định
- **Framework**: Next.js 14 App Router + TypeScript
- **Styling**: Tailwind CSS v4 với custom design tokens (xem tailwind.config.ts)
- **Auth + DB**: Supabase (chưa setup — cần làm)
- **Animation**: Framer Motion (đã cài)
- **Deploy**: Vercel
- **Font**: Nunito (Google Fonts, weight 400/600/700/800/900)

## Design System — KHÔNG THAY ĐỔI

### Màu sắc (CSS variables prefix `q-`)
```
cream: #FFF8F0    (page background)
lav:   #EDE8FF    (surface / sidebar)
mint:  #E4F7F0
sky:   #E3F2FF
peach: #FFE8E0
yellow:#FFF3CC

purple:   #A78BFA  purple-d: #7C5CBF   (brand, primary CTA)
teal:     #34D399  teal-d:   #0F9E72   (success, zone vocab)
pink:     #F472B6  pink-d:   #BE3A85   (speaking zone)
blue:     #60A5FA  blue-d:   #1D6FBF   (listening zone)
amber:    #FBBF24  amber-d:  #B45309   (XP, stars, reading zone)
coral:    #FB7185  coral-d:  #BE1D3E   (streak, writing zone)

text:   #2D2040
text-2: #6B5F8A
text-3: #A99CC4
border: #E8E0F5
card:   #FFFFFF
```

### Border radius
- `rounded-pill` = 999px (buttons, badges)
- `rounded-3xl` = 20px (cards)
- `rounded-2xl` = 16px (inner elements)

### Typography
- Font: Nunito always
- Headings: font-black (900)
- Body: font-bold (700)
- Meta/label: font-extrabold (800) uppercase tracking-widest

### Ngôn ngữ UI: 100% tiếng Việt
Ví dụ đúng: "Nhiệm vụ hôm nay", "Tổng quan", "Bản đồ hành trình"
Ví dụ sai: "Daily Quest", "Dashboard", "Achievement"

## Cấu trúc project hiện tại
```
quest-ielts/
├── app/
│   ├── layout.tsx          ✅ done
│   ├── page.tsx            ✅ done (Landing Page)
│   └── globals.css         ✅ done
├── components/
│   ├── ui/
│   │   ├── Button.tsx      ✅ done
│   │   ├── Card.tsx        ✅ done
│   │   └── Badge.tsx       ✅ done
│   ├── game/
│   │   ├── XPBar.tsx       ✅ done
│   │   ├── LevelBadge.tsx  ✅ done
│   │   ├── StreakBadge.tsx  ✅ done
│   │   ├── ZoneCard.tsx    ✅ done
│   │   └── ZoneIllos.tsx   ✅ done (6 SVG illustrations)
│   ├── jay/
│   │   ├── JayAvatar.tsx   ✅ done
│   │   └── JayBubble.tsx   ✅ done (variants: banner/card/inline)
│   └── layout/
│       ├── Topbar.tsx      ✅ done
│       ├── Sidebar.tsx     ✅ done
│       └── AppShell.tsx    ✅ done
└── lib/
    ├── tokens.ts           ✅ done (ZONE_CONFIG, LEVEL_NAMES, XP helpers)
    └── utils.ts            ✅ done (cn())
```

## Pages cần code — theo thứ tự ưu tiên

### Priority 1 — Auth (cần trước mọi thứ)
**`app/(auth)/login/page.tsx`**
- Layout 2 cột: trái = purple panel với logo + features + testimonial, phải = form
- Form: email + password + nút đăng nhập
- Social: Google + Facebook buttons
- Link sang /register
- Khi submit: gọi Supabase `signInWithPassword`

**`app/(auth)/register/page.tsx`**
- Giống login layout
- Form: họ tên + email + password
- Jay hint bubble phía trên form: "Jay đang chờ bạn! Tạo tài khoản để Jay thiết kế lộ trình riêng nhé."
- Khi submit: gọi Supabase `signUp`

### Priority 2 — Onboarding
**`app/onboarding/page.tsx`**
- Wizard 4 bước, progress dots ở topbar
- Bước 1: Chọn mục tiêu (4 cards: Du học / Xin việc / Tốt nghiệp / Định cư) — multi-select
- Bước 2: Band hiện tại (5 options: 4.0/5.0/5.5/6.0/6.5+) — single select
- Bước 3: Band mục tiêu + Ngày thi dự kiến (dropdown/date picker)
- Bước 4: Jay chào mừng + preview lộ trình cá nhân
- Layout: trái = form/choices, phải = Jay card + roadmap preview
- Lưu vào Supabase bảng `user_profiles`

### Priority 3 — Dashboard (màn hình chính)
**`app/dashboard/page.tsx`**
- Dùng `AppShell` (sidebar + main)
- Main area chia 2 cột: content (2/3) + right panel (1/3)
- **Content:**
  - Greeting: "Chào buổi sáng, [tên]!" + ngày hôm nay
  - Stat chips: streak / level / XP (horizontal row)
  - JayBubble variant="banner" với message động từ DB
  - Section "Nhiệm vụ hôm nay": grid 2 cột, 4 QuestCard
  - Section "Streak tuần này": 7 circles Mon–Sun
- **Right panel:**
  - Band progress card (band hiện tại → mục tiêu, progress bar)
  - Skill bars (5 skills với màu riêng)
  - Recent achievements (3 items)

**QuestCard component** (tạo mới tại `components/game/QuestCard.tsx`):
```tsx
interface QuestCardProps {
  zone: ZoneId
  title: string
  duration: string  // "10 phút"
  xp: number
  progress: number  // 0-100
  status: "todo" | "in-progress" | "done" | "locked"
  onClick?: () => void
}
```

### Priority 4 — World Map
**`app/map/page.tsx`**
- Dùng AppShell
- Main area: map canvas (bg #E8F4FF) + right detail panel
- Map canvas: grid 3×2 của 6 ZoneCard (dùng component có sẵn)
- Active zone có star badge góc trên phải
- Locked zones opacity 55%
- Right panel: khi click zone → hiện chi tiết (progress, danh sách lessons, nút "Tiếp tục học")
- Danh sách lessons: 3–5 items, mỗi item có số thứ tự, tên, XP, status

### Priority 5 — Nhiệm vụ hôm nay
**`app/quests/page.tsx`**
- Dùng AppShell
- Day summary: 3 stat cards (streak / hoàn thành / XP hôm nay)
- JayBubble với streak bonus message
- Danh sách QuestCard full width (4 items)
- Khi click quest → navigate to `/lesson/[id]`

### Priority 6 — Lesson Player
**`app/lesson/[id]/page.tsx`**
- Layout KHÔNG dùng Sidebar (fullscreen focus mode)
- Top bar: back button + lesson title + progress bar + hearts (5) + XP counter
- Layout 3 cột: vocab sidebar trái + main question + tips sidebar phải
- Main question area:
  - Question type badge (Chọn nghĩa đúng / Điền vào chỗ trống / v.v.)
  - Question prompt (text, highlighted word in purple bubble)
  - Context sentence (italic, purple bg)
  - 4 choice cards (A/B/C/D), click để select
  - Check button → hiện feedback bar (đúng: green, sai: red)
  - Feedback bar: icon + message + giải thích + nút "Câu tiếp"
- Left sidebar: danh sách từ đã học trong bài
- Right sidebar: Jay tip card + progress stats (đúng/sai counter)

### Priority 7 — Thành tích
**`app/achievements/page.tsx`**
- Dùng AppShell
- Progress tổng: "X / 48 huy hiệu" + progress bar
- JayBubble: nhắc badge gần mở khóa nhất
- Badge grid: responsive, mỗi badge có icon SVG + tên + rarity (Phổ thông/Hiếm/Huyền thoại)
- Locked badges: opacity 50%, icon khóa
- Badge rarities:
  - Phổ thông: amber bg
  - Hiếm: purple bg
  - Huyền thoại: pink bg

### Priority 8 — Thống kê
**`app/stats/page.tsx`**
- Dùng AppShell
- Layout 2 cột
- XP chart 7 ngày (bar chart đơn giản bằng div + CSS, không cần thư viện)
- Skill radar / bar list (5 skills)
- Streak calendar (month view, highlight ngày đã học)
- JayBubble: insight về kỹ năng yếu nhất

### Priority 9 — Hồ sơ
**`app/profile/page.tsx`**
- Dùng AppShell
- Profile hero: avatar + tên + level + goal tags
- Stats grid 3 cột: streak / XP / bài đã học
- Target cards: band hiện tại → band mục tiêu + progress
- Edit form: cập nhật tên, mục tiêu, ngày thi
- Nút đăng xuất (Supabase signOut)

## Supabase Setup

### Tables cần tạo
```sql
-- Users (tự động từ Supabase Auth)

create table user_profiles (
  id uuid references auth.users primary key,
  display_name text,
  goals text[],           -- ['study_abroad', 'work', 'graduate', 'immigration']
  current_band numeric(2,1),
  target_band numeric(2,1),
  exam_date date,
  created_at timestamptz default now()
);

create table user_progress (
  id uuid references auth.users primary key,
  xp_total int default 0,
  streak_days int default 0,
  last_active_date date,
  updated_at timestamptz default now()
);

create table user_quest_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  quest_id text,
  zone text,
  status text,            -- 'todo' | 'in_progress' | 'completed'
  xp_earned int default 0,
  completed_at timestamptz
);

create table daily_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  task_date date default current_date,
  tasks_total int default 4,
  tasks_done int default 0,
  streak_counted boolean default false
);

-- Row Level Security: enable on all tables
-- Policy: users can only read/write their own rows
```

### Environment variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase client setup
Tạo file `lib/supabase.ts`:
```ts
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

## Mock Data (dùng khi chưa có Supabase)
```ts
// lib/mock.ts
export const MOCK_USER = {
  name: "Minh Anh",
  xp: 1240,
  streakDays: 14,
  currentBand: 5.5,
  targetBand: 7.0,
  examDate: "2025-06-15",
}

export const MOCK_QUESTS = [
  { id:"q1", zone:"vocabulary", title:"20 từ vựng chủ đề môi trường", duration:"10 phút", xp:50,  progress:100, status:"done" },
  { id:"q2", zone:"listening",  title:"Nghe bài hội thoại giao tiếp", duration:"15 phút", xp:75,  progress:100, status:"done" },
  { id:"q3", zone:"reading",    title:"Đọc passage dạng matching",    duration:"20 phút", xp:100, progress:40,  status:"in-progress" },
  { id:"q4", zone:"writing",    title:"Viết Task 1 — biểu đồ cột",   duration:"30 phút", xp:120, progress:0,   status:"locked" },
]
```

## Jay Messages — nội dung mẫu
```ts
export const JAY_MESSAGES = {
  streak_7:    "Bạn vừa học 7 ngày liên tiếp! Tuyệt vời, tiếp tục nhé!",
  streak_14:   "14 ngày liên tiếp rồi! Bạn đang trong top 10% người học chăm nhất!",
  level_up:    "Chúc mừng lên cấp! Hành trình của bạn đang tiến triển rất tốt.",
  daily_start: "Hôm nay học gì? Jay đã chuẩn bị 4 nhiệm vụ cho bạn rồi nhé!",
  near_level:  "Chỉ còn [X] XP nữa là lên cấp. Làm thêm 1 bài nữa thôi!",
  weak_skill:  "Kỹ năng [X] đang thấp nhất. Jay gợi ý tập trung vào đây tuần này.",
}
```

## Deploy lên Vercel
```bash
# 1. Push lên GitHub
git init && git add . && git commit -m "init: Quest IELTS MVP"
gh repo create quest-ielts --private && git push -u origin main

# 2. Deploy
npx vercel --prod

# 3. Thêm env vars trên Vercel dashboard:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Conventions khi code
- Tất cả pages dùng `"use client"` nếu có state/event
- Server components cho pages không có interactivity
- Import paths dùng `@/` alias
- Tất cả text UI = tiếng Việt
- Màu sắc = dùng Tailwind class `text-q-*`, `bg-q-*`, `border-q-*`
- Không dùng inline style trừ khi dynamic (ví dụ width của progress bar)
- Rounded buttons = `rounded-pill`
- Cards = `rounded-3xl border-[2.5px] border-q-border`

## Thứ tự làm để ra MVP nhanh nhất
1. `npm install @supabase/supabase-js` + tạo `lib/supabase.ts`
2. Code Auth pages (login + register) với Supabase
3. Code Onboarding
4. Code Dashboard (dùng mock data trước, gắn Supabase sau)
5. Code World Map
6. Code Lesson Player
7. Code Quests page
8. Gắn Supabase data thật cho tất cả pages
9. Deploy Vercel
10. (Optional) Achievements + Stats + Profile
