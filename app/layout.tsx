import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quest IELTS — Biến hành trình IELTS thành phiêu lưu",
  description: "Học IELTS theo lộ trình RPG, nhận XP mỗi ngày, lên cấp từng bước cùng Mentor Jay. Miễn phí. Dành riêng cho người Việt.",
  metadataBase: new URL("https://quest-ielts.vercel.app"),
  openGraph: {
    title: "Quest IELTS — Biến hành trình IELTS thành phiêu lưu",
    description: "Học IELTS theo lộ trình RPG, nhận XP mỗi ngày, lên cấp từng bước. AI chấm Writing & Speaking. Miễn phí.",
    url: "https://quest-ielts.vercel.app",
    siteName: "Quest IELTS",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quest IELTS — Biến hành trình IELTS thành phiêu lưu",
    description: "Học IELTS gamified dành cho người Việt. RPG lộ trình, XP, AI chấm điểm. Miễn phí!",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
