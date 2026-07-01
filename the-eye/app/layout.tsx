import type { Metadata } from "next";
import { Inter, Space_Mono, Bebas_Neue } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "The Eye — Vision Agency",
  description: "Your strategic business intelligence partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable} ${bebasNeue.variable} h-full antialiased`}>
      <body className="h-full flex overflow-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto" style={{ paddingTop: "var(--mobile-top, 0)" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
