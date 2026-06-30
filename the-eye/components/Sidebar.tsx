"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Brain, Megaphone, FileVideo,
  BarChart2, Users, Crosshair, LineChart, Eye, Settings,
} from "lucide-react";

const NAV = [
  { label: "Overview",    href: "/",           icon: LayoutDashboard },
  { label: "Brain",       href: "/brain",       icon: Brain },
  { label: "Marketing",   href: "/marketing",   icon: Megaphone },
  { label: "Content",     href: "/content",     icon: FileVideo },
  { label: "Campaigns",   href: "/campaigns",   icon: BarChart2 },
  { label: "Customers",   href: "/customers",   icon: Users },
  { label: "Competitors", href: "/competitors", icon: Crosshair },
  { label: "Analytics",   href: "/analytics",   icon: LineChart },
  { label: "The Eye",     href: "/the-eye",     icon: Eye },
  { label: "Settings",    href: "/settings",    icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "240px",
      flexShrink: 0,
      background: "#111111",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
    }}>

      {/* Logo */}
      <div style={{ padding: "28px 24px 22px", borderBottom: "1px solid var(--border)" }}>
        <div style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "26px",
          letterSpacing: "0.2em",
          color: "var(--gold)",
          lineHeight: 1,
        }}>
          THE EYE
        </div>
        <div style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          marginTop: "6px",
        }}>
          Vision Agency
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "11px 22px",
              textDecoration: "none",
              fontFamily: "var(--font-space-mono)",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: active ? "var(--gold)" : "var(--text-2)",
              background: active ? "var(--gold-dim)" : "transparent",
              borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
              fontWeight: active ? 700 : 400,
            }}>
              <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "18px 22px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "var(--gold-dim)",
            border: "1.5px solid var(--gold-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-bebas)",
            fontSize: "16px",
            color: "var(--gold)",
            letterSpacing: "0.05em",
          }}>S</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>Sabbah</div>
            <div style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-3)", textTransform: "uppercase" }}>Vision Agency</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
