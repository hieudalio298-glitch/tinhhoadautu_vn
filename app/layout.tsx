import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tinh Hoa Đầu Tư - Thông tin chứng khoán Việt Nam",
  description: "Cập nhật tin tức, phân tích và nhận định thị trường chứng khoán.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
