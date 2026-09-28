import type { Metadata } from "next";
import { Bebas_Neue, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["200", "300", "400"],
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VISION® — Member Platform",
  description: "We see what you can't.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${inter.variable} ${spaceMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <TopBar />
        <main className="flex-1 pb-20 pt-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
