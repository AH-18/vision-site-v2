"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <path d="M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10" />
    ),
  },
  {
    href: "/library",
    label: "Library",
    icon: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    ),
  },
  {
    href: "/courses",
    label: "Courses",
    icon: (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ),
  },
  {
    href: "/rewards",
    label: "Rewards",
    icon: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="m9 14-1.5 7L12 19l4.5 2L15 14" />
      </>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-grey-800 bg-grey-950/95 backdrop-blur">
      <ul className="mx-auto flex max-w-lg items-center justify-between px-6 py-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 px-3"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={active ? "url(#navGrad)" : "currentColor"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={active ? "" : "text-grey-400"}
                >
                  {item.icon}
                </svg>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.15em] ${
                    active ? "insta-gradient-text" : "text-grey-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* shared gradient def for active nav icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#833AB4" />
            <stop offset="25%" stopColor="#C13584" />
            <stop offset="50%" stopColor="#E1306C" />
            <stop offset="65%" stopColor="#FD1D1D" />
            <stop offset="80%" stopColor="#F77737" />
            <stop offset="100%" stopColor="#FCAF45" />
          </linearGradient>
        </defs>
      </svg>
    </nav>
  );
}
