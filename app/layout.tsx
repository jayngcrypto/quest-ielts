import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quest IELTS — Biến hành trình IELTS thành phiêu lưu",
  description: "Học IELTS theo lộ trình RPG, nhận XP mỗi ngày, lên cấp từng bước cùng Mentor Jay.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
