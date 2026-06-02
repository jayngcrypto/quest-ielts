import Topbar from "@/components/layout/Topbar";
import JayBubble from "@/components/jay/JayBubble";
import { VocabIllo, ListenIllo, ReadIllo, WriteIllo, SpeakIllo, CastleIllo } from "@/components/game/ZoneIllos";
import Link from "next/link";

const ZONES = [
  { id:"vocabulary", name:"Đảo Từ Vựng",    skill:"Vocabulary", border:"#34D399", bg:"#E4F7F0", colorD:"#0F9E72", Illo:VocabIllo  },
  { id:"listening",  name:"Thung Lũng Nghe", skill:"Listening",  border:"#60A5FA", bg:"#E3F2FF", colorD:"#1D6FBF", Illo:ListenIllo },
  { id:"reading",    name:"Khu Rừng Đọc",    skill:"Reading",    border:"#FBBF24", bg:"#FFF3CC", colorD:"#B45309", Illo:ReadIllo   },
  { id:"writing",    name:"Thành Phố Viết",  skill:"Writing",    border:"#FB7185", bg:"#FFE8E0", colorD:"#BE1D3E", Illo:WriteIllo  },
  { id:"speaking",   name:"Đấu Trường Nói",  skill:"Speaking",   border:"#F472B6", bg:"#FBEAF0", colorD:"#BE3A85", Illo:SpeakIllo  },
  { id:"castle",     name:"Lâu Đài Mục Tiêu",skill:"Final Boss", border:"#A78BFA", bg:"#EDE8FF", colorD:"#7C5CBF", Illo:CastleIllo },
];

const FEATS = [
  { icon:"map",    bg:"#EDE8FF", border:"#A78BFA", title:"Bản đồ hành trình RPG",   desc:"6 khu vực, mỗi khu vực là một kỹ năng IELTS. Mở khoá dần dần — cảm giác như leo cột mốc trong game phiêu lưu." },
  { icon:"star",   bg:"#FFF3CC", border:"#FBBF24", title:"Hệ thống XP & Level",      desc:"Mỗi bài hoàn thành = nhận XP. Tích đủ XP để lên cấp, mở khoá thử thách mới và nhận badge đặc biệt." },
  { icon:"person", bg:"#E4F7F0", border:"#34D399", title:"AI chấm Writing & Speaking", desc:"Viết essay hoặc nói — AI chấm điểm theo 4 tiêu chí IELTS, sửa lỗi và gợi ý cải thiện ngay lập tức." },
  { icon:"check",  bg:"#E3F2FF", border:"#60A5FA", title:"Nhiệm vụ hằng ngày",       desc:"3–5 nhiệm vụ ngắn mỗi ngày, thiết kế để không bao giờ quá tải. Học 15 phút mỗi ngày đủ để tiến bộ rõ rệt." },
  { icon:"flame",  bg:"#FFE8E0", border:"#FB7185", title:"Streak & Chuỗi ngày",      desc:"Giữ streak để nhân đôi XP. Phá streak = mất bonus — vừa đủ để tạo động lực học đều đặn mỗi ngày." },
  { icon:"trophy", bg:"#FBEAF0", border:"#F472B6", title:"Thành tích & Badge",       desc:"Mở khoá badge đặc biệt tại mỗi cột mốc. Mỗi thành tích là bằng chứng hành trình bạn đã đi qua." },
];

function FeatIcon({ name, bg, border }: { name:string; bg:string; border:string }) {
  const paths: Record<string,string> = {
    map:    "M1,4 7,2 11,4 17,2 17,14 11,16 7,14 1,16M7,2 7,14M11,4 11,16",
    star:   "M9,2 11,7 16,7.5 12.5,11 13.5,16 9,13.5 4.5,16 5.5,11 2,7.5 7,7 Z",
    person: "M9,8 A4,4 0 1 1 9,0 A4,4 0 1 1 9,8ZM2,18 C2,13 5,11 9,11 13,11 16,13 16,18",
    check:  "M2,9 7,14 16,5",
    flame:  "M9,1 C9,1 14,5 14,9.5 C14,12.5 11.8,15 9,15 C6.2,15 4,12.5 4,9.5 C4,7.5 5.5,5.5 6,4.5 C6,7 7.5,7.5 7.5,7.5 C7.5,7.5 9,5 9,1Z",
    trophy: "M5,2 H13 V9 C13,12 11,13.5 9,13.5 7,13.5 5,12 5,9 V2ZM5,5 H2 V7 C2,9 3.5,10 5,10 M13,5 H16 V7 C16,9 14.5,10 13,10 M9,13.5 V17 M6,17 H12",
  };
  return (
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border-[2.5px] flex-shrink-0"
      style={{ background:bg, borderColor:border }}>
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none"
        stroke={border === "#FBBF24" ? "#B45309" : border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[name]}/>
      </svg>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-q-cream min-h-screen font-nunito">
      <Topbar />

      {/* HERO — RPG style with sparkles */}
      <section className="grid grid-cols-2 min-h-[520px] items-center overflow-hidden relative sparkle-container">
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[15%] left-[5%] w-3 h-3 rounded-full bg-q-amber opacity-40 animate-float" style={{animationDelay:"0s"}}/>
          <div className="absolute top-[30%] right-[40%] w-2 h-2 rounded-full bg-q-purple opacity-30 animate-float" style={{animationDelay:"1s"}}/>
          <div className="absolute bottom-[25%] left-[20%] w-2.5 h-2.5 rounded-full bg-q-teal opacity-35 animate-float" style={{animationDelay:"0.5s"}}/>
          <div className="absolute top-[60%] left-[35%] w-2 h-2 rounded-full bg-q-pink opacity-25 animate-float-slow" style={{animationDelay:"1.5s"}}/>
        </div>

        <div className="px-14 py-14 relative z-10">
          <div className="inline-flex items-center gap-2 bg-q-yellow border-2 border-q-amber rounded-pill px-4 py-1.5 mb-6 animate-bounce-in">
            <svg width="14" height="14" viewBox="0 0 14 14" className="animate-wiggle"><polygon points="7,1 8.8,5.2 13.5,5.4 10,8.4 11.1,13 7,10.5 2.9,13 4,8.4 0.5,5.4 5.2,5.2" fill="#FBBF24"/></svg>
            <span className="text-xs font-extrabold text-q-amber-d">Nền tảng IELTS dành riêng cho người Việt</span>
          </div>
          <h1 className="text-5xl font-black text-q-text leading-[1.12] tracking-tight mb-4 animate-fade-up">
            Biến hành trình<br />
            <span className="rpg-gradient-text underline decoration-[#D8CCFF] underline-offset-[6px]">IELTS</span> thành<br />
            cuộc phiêu lưu.
          </h1>
          <p className="text-base text-q-text-2 leading-relaxed mb-8 max-w-md animate-fade-up" style={{animationDelay:"0.15s"}}>
            Học theo lộ trình RPG, nhận XP mỗi ngày, lên cấp từng bước.
            Không còn học khô khan — chỉ có niềm vui chinh phục band mục tiêu.
          </p>
          <div className="flex gap-3 mb-5 animate-fade-up" style={{animationDelay:"0.3s"}}>
            <Link href="/register"
              className="px-8 py-4 rounded-pill text-base font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:scale-105 transition-all duration-200 no-underline animate-glow">
              Bắt đầu hành trình →
            </Link>
          </div>
          <p className="text-xs font-bold text-q-text-3 flex items-center gap-2 animate-fade-up" style={{animationDelay:"0.45s"}}>
            <span className="w-2 h-2 rounded-full bg-q-teal inline-block animate-pulse-ring"/>
            Miễn phí · Không cần thẻ tín dụng · Bắt đầu ngay hôm nay
          </p>
        </div>

        {/* Hero right — visual icons floating */}
        <div className="bg-q-lav h-full flex items-center justify-center p-10 relative overflow-hidden border-l-[2.5px] border-q-border">
          {/* Background decorative circles */}
          <div className="absolute w-[280px] h-[280px] rounded-full border-[3px] border-q-purple/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-ring" />
          <div className="absolute w-[380px] h-[380px] rounded-full border-[2px] border-q-purple/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Floating zone icons in orbit */}
          <div className="relative w-[320px] h-[320px]">
            {/* Center gem */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-q-purple/10 border-[3px] border-q-purple rounded-full flex items-center justify-center animate-float-slow shadow-float">
              <svg width="36" height="36" viewBox="0 0 22 22" fill="none">
                <polygon points="11,2 20,8 17,19 5,19 2,8" fill="#A78BFA" opacity=".9"/>
                <polygon points="11,5 16,9 14,16 8,16 6,9" fill="white" opacity=".5"/>
              </svg>
            </div>

            {/* Orbiting icons */}
            <div className="absolute top-[5%] left-[50%] -translate-x-1/2 animate-float" style={{animationDelay:"0s"}}>
              <div className="w-14 h-14 rounded-2xl border-[2.5px] flex items-center justify-center shadow-float" style={{background:"#E4F7F0", borderColor:"#34D399"}}>
                <VocabIllo size={32}/>
              </div>
            </div>
            <div className="absolute top-[25%] right-[5%] animate-float" style={{animationDelay:"0.4s"}}>
              <div className="w-14 h-14 rounded-2xl border-[2.5px] flex items-center justify-center shadow-float" style={{background:"#E3F2FF", borderColor:"#60A5FA"}}>
                <ListenIllo size={32}/>
              </div>
            </div>
            <div className="absolute bottom-[25%] right-[5%] animate-float" style={{animationDelay:"0.8s"}}>
              <div className="w-14 h-14 rounded-2xl border-[2.5px] flex items-center justify-center shadow-float" style={{background:"#FFF3CC", borderColor:"#FBBF24"}}>
                <ReadIllo size={32}/>
              </div>
            </div>
            <div className="absolute bottom-[5%] left-[50%] -translate-x-1/2 animate-float" style={{animationDelay:"1.2s"}}>
              <div className="w-14 h-14 rounded-2xl border-[2.5px] flex items-center justify-center shadow-float" style={{background:"#FFE8E0", borderColor:"#FB7185"}}>
                <WriteIllo size={32}/>
              </div>
            </div>
            <div className="absolute bottom-[25%] left-[5%] animate-float" style={{animationDelay:"1.6s"}}>
              <div className="w-14 h-14 rounded-2xl border-[2.5px] flex items-center justify-center shadow-float" style={{background:"#FBEAF0", borderColor:"#F472B6"}}>
                <SpeakIllo size={32}/>
              </div>
            </div>
            <div className="absolute top-[25%] left-[5%] animate-float" style={{animationDelay:"2s"}}>
              <div className="w-14 h-14 rounded-2xl border-[2.5px] flex items-center justify-center shadow-float" style={{background:"#EDE8FF", borderColor:"#A78BFA"}}>
                <CastleIllo size={32}/>
              </div>
            </div>

            {/* XP badge floating */}
            <div className="absolute top-[12%] right-[15%] animate-float-slow" style={{animationDelay:"0.6s"}}>
              <div className="bg-q-card border-[2px] border-q-purple rounded-full px-3 py-1.5 shadow-float flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1L7.5 4.5H11L8.5 7L9.5 11L6 9L2.5 11L3.5 7L1 4.5H4.5L6 1Z" fill="#A78BFA"/></svg>
                <span className="text-[10px] font-extrabold text-q-purple-d">+50 XP</span>
              </div>
            </div>

            {/* Streak badge floating */}
            <div className="absolute bottom-[12%] left-[15%] animate-float-slow" style={{animationDelay:"1.4s"}}>
              <div className="bg-q-card border-[2px] border-q-pink rounded-full px-3 py-1.5 shadow-float flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1C6 1 9.5 4 9.5 6.5C9.5 8.5 7.9 10 6 10C4.1 10 2.5 8.5 2.5 6.5C2.5 5 3.8 3.5 4.2 3C4.2 4.5 5.3 5 5.3 5C5.3 5 6 3 6 1Z" fill="#FB7185"/></svg>
                <span className="text-[10px] font-extrabold text-q-pink-d">🔥 14</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JAY STRIP */}
      <JayBubble
        variant="banner"
        message="Chào mừng bạn đến Quest IELTS! Hành trình chinh phục band mục tiêu của bạn bắt đầu từ đây. Jay sẽ đồng hành mỗi ngày nhé!"
        className="mx-0 rounded-none border-x-0 border-t-0 border-b-[2.5px] !bg-q-yellow/40 !border-q-amber/30"
      />

      {/* FEATURES — with hover animations */}
      <section id="features" className="px-14 py-14 bg-q-card">
        <div className="text-[11px] font-extrabold text-q-purple-d tracking-widest uppercase mb-2">Tại sao chọn Quest IELTS?</div>
        <h2 className="text-3xl font-black text-q-text mb-10">Học đúng cách. Học đủ động lực. Học mỗi ngày.</h2>
        <div className="grid grid-cols-3 gap-5 animate-stagger">
          {FEATS.map(f => (
            <div key={f.title} className="bg-q-cream border-[2.5px] border-q-border rounded-3xl p-6 hover-lift cursor-default group">
              <div className="group-hover:animate-wiggle">
                <FeatIcon name={f.icon} bg={f.bg} border={f.border}/>
              </div>
              <div className="text-sm font-extrabold text-q-text mb-2">{f.title}</div>
              <div className="text-xs text-q-text-2 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ZONES — with RPG decorations */}
      <section id="zones" className="px-14 py-14 bg-q-lav relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-[11px] font-extrabold text-q-purple-d tracking-widest uppercase mb-2">6 Khu vực học tập</div>
          <h2 className="text-3xl font-black text-q-text mb-10">Hành trình từ cơ bản đến band 8+</h2>
          <div className="grid grid-cols-6 gap-4 animate-stagger">
            {ZONES.map(z => (
              <div key={z.id} className="rounded-3xl border-[2.5px] p-4 text-center hover-lift cursor-pointer group"
                style={{ background:z.bg, borderColor:z.border }}>
                <div className="flex justify-center mb-3 group-hover:animate-float"><z.Illo size={60}/></div>
                <div className="text-sm font-extrabold leading-tight" style={{color:z.colorD}}>{z.name}</div>
                <div className="text-xs font-bold mt-1 opacity-75" style={{color:z.colorD}}>{z.skill}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BOTTOM — with glow */}
      <section className="px-14 py-16 bg-q-card text-center relative sparkle-container">
        <div className="flex justify-center gap-8 mb-8">
          {[
            { Illo:VocabIllo, color:"#FBBF24", stroke:"#B45309", delay:"0s" },
            { Illo:SpeakIllo, color:"#F472B6", stroke:"#BE3A85", delay:"0.3s" },
            { Illo:ListenIllo,color:"#34D399", stroke:"#0F9E72", delay:"0.6s" },
          ].map(({ Illo, color, stroke, delay }, i) => (
            <div key={i} className="flex flex-col items-center gap-1 animate-float" style={{animationDelay:delay}}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-[3px] hover:scale-110 transition-transform duration-200"
                style={{background:color+"33", borderColor:stroke}}>
                <Illo size={44}/>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-4xl font-black text-q-text mb-3">Sẵn sàng bắt đầu hành trình?</h2>
        <p className="text-base text-q-text-2 mb-8">Miễn phí hoàn toàn. Không cần thẻ tín dụng. Chỉ cần quyết tâm.</p>
        <Link href="/register"
          className="inline-block px-12 py-4 rounded-pill text-lg font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:scale-105 transition-all duration-200 no-underline animate-glow">
          Bắt đầu hành trình ngay →
        </Link>
        <p className="text-xs text-q-text-3 font-bold mt-4">Không có quảng cáo · Không spam · Bảo mật thông tin cá nhân</p>
      </section>

      {/* FOOTER */}
      <footer className="bg-q-lav border-t-[2.5px] border-q-border px-14 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-q-purple rounded-[8px] border-2 border-q-purple-d flex items-center justify-center animate-float">
              <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                <polygon points="11,2 20,8 17,19 5,19 2,8" fill="white" opacity=".9"/>
              </svg>
            </div>
            <span className="text-sm font-black text-q-text">Quest IELTS</span>
          </div>
          <p className="text-xs font-bold text-q-text-2 text-center max-w-md">
            Nền tảng học IELTS gamified dành riêng cho người Việt. Học mỗi ngày, tiến bộ mỗi ngày. 
          </p>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-q-pink-d">
            <span>Made with</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="#F472B6" className="animate-float">
              <path d="M8 14S2 10 2 6.5C2 4 4 2.5 5.5 2.5C6.8 2.5 7.7 3.2 8 4C8.3 3.2 9.2 2.5 10.5 2.5C12 2.5 14 4 14 6.5C14 10 8 14 8 14Z"/>
            </svg>
            <span>by Jay</span>
          </div>
          <p className="text-[10px] font-bold text-q-text-3 mt-2">© 2026 Quest IELTS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
