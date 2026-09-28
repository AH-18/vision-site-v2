import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-grey-800 bg-white/[0.02] p-6 transition-colors hover:border-gold/40 ${className}`}
    >
      {children}
    </div>
  );
}
