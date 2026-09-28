"use client";

export default function FilterChip({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
        active
          ? "border-transparent text-white insta-gradient-bg"
          : "border-grey-700 text-grey-300 hover:border-gold/50 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
