import Link from "next/link";

function LogoGem() {
  return (
    <div className="w-9 h-9 bg-q-purple rounded-xl border-[2.5px] border-q-purple-d flex items-center justify-center flex-shrink-0">
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden>
        <polygon points="11,2 20,8 17,19 5,19 2,8" fill="white" opacity=".9"/>
        <polygon points="11,2 20,8 11,12" fill="white" opacity=".5"/>
      </svg>
    </div>
  );
}

export default function Topbar() {
  return (
    <header className="bg-q-card border-b-[2.5px] border-q-border px-12 py-3.5 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <LogoGem />
        <div>
          <div className="text-lg font-black text-q-text leading-none">Quest IELTS</div>
          <div className="text-[10px] font-bold text-q-text-3 mt-0.5">Biến hành trình IELTS thành phiêu lưu</div>
        </div>
      </Link>
      <nav className="flex items-center gap-1">
        <a href="#features" className="px-4 py-2 rounded-pill text-sm font-bold text-q-text-2 hover:bg-q-lav transition-colors no-underline">Tính năng</a>
        <a href="#zones" className="px-4 py-2 rounded-pill text-sm font-bold text-q-text-2 hover:bg-q-lav transition-colors no-underline">Khu vực</a>
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/login" className="px-4 py-2 rounded-pill text-sm font-bold text-q-text-2 hover:bg-q-lav transition-colors no-underline">Đăng nhập</Link>
        <Link href="/register" className="px-5 py-2.5 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 transition-opacity no-underline">Bắt đầu miễn phí →</Link>
      </div>
    </header>
  );
}
