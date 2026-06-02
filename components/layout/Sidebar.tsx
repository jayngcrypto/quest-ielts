"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import XPBar from "@/components/game/XPBar";
import { getProfile, getProgress } from "@/lib/supabase-db";
import { getLevelProgress, LEVEL_NAMES } from "@/lib/tokens";

const NAV_MAIN = [
  { href: "/dashboard", label: "Tổng quan",         icon: HomeIcon },
  { href: "/map",       label: "Bản đồ hành trình", icon: MapIcon },
  { href: "/quests",    label: "Nhiệm vụ hôm nay",  icon: QuestIcon },
];

const NAV_ZONES = [
  { href: "/vocabulary", label: "Đảo Từ Vựng",       color: "#0F9E72", Icon: VocabIcon },
  { href: "/listening",  label: "Thung Lũng Nghe",    color: "#1D6FBF", Icon: ListenIcon },
  { href: "/reading",    label: "Khu Rừng Đọc",       color: "#B45309", Icon: ReadIcon },
  { href: "/writing",    label: "Thành Phố Viết",     color: "#FB7185", Icon: WriteIcon },
  { href: "/speaking",   label: "Đấu Trường Nói",     color: "#BE3A85", Icon: LockIcon },
  { href: "/castle",     label: "Lâu Đài Mục Tiêu",   color: "#7C5CBF", Icon: CastleIcon },
];

const NAV_PERSONAL = [
  { href: "/achievements", label: "Thành tích", icon: TrophyIcon },
  { href: "/stats",        label: "Thống kê",   icon: ChartIcon },
  { href: "/profile",      label: "Hồ sơ",      icon: UserIcon },
];

export default function Sidebar() {
  const path = usePathname();
  const [displayName, setDisplayName] = useState("...");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelName, setLevelName] = useState("Người mới");

  useEffect(() => {
    async function load() {
      const [profile, progress] = await Promise.all([getProfile(), getProgress()]);
      if (profile) {
        setDisplayName(profile.display_name || "Bạn");
      }
      if (progress) {
        setXp(progress.xp);
        const { level: lvl } = getLevelProgress(progress.xp);
        setLevel(lvl);
        setLevelName(LEVEL_NAMES[lvl] || "Người mới");
      }
    }
    load();
  }, []);

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="w-[220px] flex-shrink-0 bg-q-card border-r-[2px] border-q-border flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2 border-b-2 border-q-border">
        <div className="w-8 h-8 bg-q-purple rounded-[10px] border-2 border-q-purple-d flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden>
            <polygon points="11,2 20,8 17,19 5,19 2,8" fill="white" opacity=".9"/>
            <polygon points="11,2 20,8 11,12" fill="white" opacity=".5"/>
          </svg>
        </div>
        <span className="text-base font-black text-q-text">Quest IELTS</span>
      </div>

      {/* User mini card */}
      <div className="mx-3 mt-3 mb-1 bg-q-lav border-2 border-q-border rounded-2xl p-3 flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-q-purple border-2 border-q-purple-d flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-q-text truncate">{displayName}</div>
          <div className="text-[11px] font-bold text-q-purple-d truncate">Cấp {level} · {levelName}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {NAV_MAIN.map(({ href, label, icon: Icon }) => (
          <NavItem key={href} href={href} label={label} active={path === href} Icon={Icon} />
        ))}

        <SectionLabel>Kỹ năng</SectionLabel>
        {NAV_ZONES.map(({ href, label, color, Icon }) => (
          <NavItem key={href} href={href} label={label} active={path === href}
            color={color} Icon={Icon} />
        ))}

        <SectionLabel>Cá nhân</SectionLabel>
        {NAV_PERSONAL.map(({ href, label, icon: Icon }) => (
          <NavItem key={href} href={href} label={label} active={path === href} Icon={Icon} />
        ))}
      </nav>

      {/* XP Box */}
      <div className="mx-3 mb-4 bg-q-yellow border-2 border-q-amber rounded-2xl p-3">
        <div className="text-[11px] font-extrabold text-q-amber-d mb-2 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M6 1L7.5 4.5H11L8.5 7L9.5 11L6 9L2.5 11L3.5 7L1 4.5H4.5L6 1Z"
              fill="#FBBF24" stroke="#B45309" strokeWidth=".8"/>
          </svg>
          XP hôm nay
        </div>
        <XPBar xp={xp} size="sm" />
      </div>
    </aside>
  );
}

function NavItem({ href, label, active, color, locked, Icon }: {
  href: string; label: string; active?: boolean;
  color?: string; locked?: boolean; Icon: React.FC<{ size?: number }>;
}) {
  return (
    <Link href={locked ? "#" : href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold no-underline transition-colors mb-0.5",
        active
          ? "bg-q-lav text-q-purple-d border-2 border-q-border"
          : "text-q-text-2 hover:bg-q-lav border-2 border-transparent",
        locked && "opacity-50 cursor-not-allowed"
      )}
    >
      <Icon size={17} />
      <span className="truncate" style={color ? { color } : {}}>{label}</span>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-extrabold text-q-text-3 tracking-widest uppercase px-3 py-2 mt-1">
      {children}
    </div>
  );
}

// ---- inline icon components ----
function HomeIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7L9 2L16 7V16H12V12H6V16H2V7Z"/></svg>;
}
function MapIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1,4 7,2 11,4 17,2 17,14 11,16 7,14 1,16"/><line x1="7" y1="2" x2="7" y2="14"/><line x1="11" y1="4" x2="11" y2="16"/></svg>;
}
function QuestIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="14" height="14" rx="3"/><path d="M6 9L8 11L12 7"/></svg>;
}
function TrophyIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2H13V9C13 11.8 11.2 13 9 13C6.8 13 5 11.8 5 9V2Z"/><path d="M5 5H2V7C2 8.7 3.3 10 5 10"/><path d="M13 5H16V7C16 8.7 14.7 10 13 10"/><line x1="9" y1="13" x2="9" y2="16"/><line x1="6" y1="16" x2="12" y2="16"/></svg>;
}
function ChartIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="10" width="3" height="6" rx="1"/><rect x="7" y="6" width="3" height="10" rx="1"/><rect x="12" y="2" width="3" height="14" rx="1"/></svg>;
}
function UserIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="6" r="3"/><path d="M3 16C3 13.2 5.7 11 9 11C12.3 11 15 13.2 15 16"/></svg>;
}
function VocabIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="#0F9E72" strokeWidth="2" strokeLinecap="round"><polygon points="9,2 16,14 2,14" fill="none"/><circle cx="9" cy="11" r="1.5" fill="#0F9E72"/></svg>;
}
function ListenIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="#1D6FBF" strokeWidth="2" strokeLinecap="round"><path d="M3 9C3 5.7 5.7 3 9 3C12.3 3 15 5.7 15 9V12"/><path d="M3 12C3 12 1 12 1 10V9C1 8 2 8 2 8"/><path d="M15 12C15 12 17 12 17 10V9C17 8 16 8 16 8"/></svg>;
}
function ReadIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round"><path d="M2 4C2 4 5 3 9 3C13 3 16 4 16 4V15C16 15 13 14 9 14C5 14 2 15 2 15V4Z"/><line x1="9" y1="3" x2="9" y2="14"/></svg>;
}
function DictIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="#BE1D3E" strokeWidth="2" strokeLinecap="round"><rect x="3" y="2" width="12" height="14" rx="2"/><path d="M7 6H11M7 9H11M7 12H9"/></svg>;
}
function WriteIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="#FB7185" strokeWidth="2" strokeLinecap="round"><path d="M2 16L6 15L15 6L12 3L3 12L2 16Z"/><path d="M12 3L15 6"/></svg>;
}
function LockIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="8" width="10" height="8" rx="2"/><path d="M6 8V6C6 3.8 7.8 2 10 2C12 2 14 3.8 14 6V8"/></svg>;
}
function CastleIcon({ size = 17 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="#7C5CBF" strokeWidth="2" strokeLinecap="round"><path d="M3 16V8L5 6V3H7V6L9 4L11 6V3H13V6L15 8V16H3Z"/><rect x="7" y="12" width="4" height="4"/></svg>;
}
