"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Brain, Megaphone, FileVideo,
  BarChart2, Users, Crosshair, LineChart, Eye, Settings, LogOut, Menu, X,
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
  const router   = useRouter();
  const [email, setEmail] = useState("");
  const [open, setOpen]   = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = email ? email[0].toUpperCase() : "?";

  const sidebarStyle: React.CSSProperties = isMobile ? {
    width: "240px",
    flexShrink: 0,
    background: "#111111",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 100,
    transform: open ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.25s ease",
  } : {
    width: "240px",
    flexShrink: 0,
    background: "#111111",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    position: "sticky",
    top: 0,
  };

  return (
    <>
      {/* Mobile hamburger button */}
      {isMobile && (
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            position: "fixed",
            top: 14,
            left: 14,
            zIndex: 101,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--gold)",
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: 2,
          }}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}

      {/* Backdrop */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 99,
          }}
        />
      )}

      <aside style={sidebarStyle}>
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
              <Link key={href} href={href} onClick={() => setOpen(false)} style={{
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
        <div style={{ padding: "16px 22px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold-dim)", border: "1.5px solid var(--gold-border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-bebas)", fontSize: 16, color: "var(--gold)", flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email || "..."}</div>
              <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, letterSpacing: "0.1em", color: "var(--text-3)", textTransform: "uppercase", marginTop: 2 }}>Vision Agency</div>
            </div>
            <button onClick={handleLogout} title="Log out" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 4, display: "flex", alignItems: "center", flexShrink: 0 }}>
              <LogOut size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}


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
  const router   = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = email ? email[0].toUpperCase() : "?";

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
      <div style={{ padding: "16px 22px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold-dim)", border: "1.5px solid var(--gold-border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-bebas)", fontSize: 16, color: "var(--gold)", flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email || "..."}</div>
            <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, letterSpacing: "0.1em", color: "var(--text-3)", textTransform: "uppercase", marginTop: 2 }}>Vision Agency</div>
          </div>
          <button onClick={handleLogout} title="Log out" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 4, display: "flex", alignItems: "center", flexShrink: 0 }}>
            <LogOut size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  );
}
