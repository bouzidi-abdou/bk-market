import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cairo, Unbounded } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import SmoothScroll from "@/components/smooth-scroll";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const display = Unbounded({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display-en",
});

export const metadata: Metadata = {
  title: "BK MARKET — سوقك الرقمي الفاخر",
  description:
    "BK MARKET — متجر رقمي فاخر: فيزات وبطاقات هدايا، اشتراكات بريميوم لكل المنصات المشهورة، حسابات قديمة نادرة، نيترو وبوستات، وخدمات برمجة وتصميم احترافية. توصيل فوري ودفع آمن.",
  icons: [{ url: "https://c.top4top.io/p_3891uufxn1.png" }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${display.variable} font-sans antialiased bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <Providers>
          <SmoothScroll />
          <Navbar />
          <main className="relative">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
