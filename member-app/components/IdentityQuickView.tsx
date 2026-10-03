"use client";

import { useEffect, useState } from "react";
import { BRAND_QUESTIONS, type BrandProfileAnswers, loadBrandProfile } from "@/lib/brandProfile";

/**
 * Floating button + popover that lets the user glance at their saved
 * "My Identity" answers while editing a template's text/captions, without
 * leaving the page. Sits top-right, just under the TopBar's Settings/Profile
 * icons. Drop this into any page where that context is useful.
 */
export default function IdentityQuickView() {
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState<BrandProfileAnswers>({});

  // Read on mount — localStorage isn't available during server render.
  useEffect(() => {
    setBrand(loadBrandProfile());
  }, []);

  const answered = BRAND_QUESTIONS.filter((q) => brand[q.id]?.trim());

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="View My Identity"
        aria-expanded={open}
        className="fixed right-6 top-20 z-40 flex items-center gap-1.5 rounded-full border border-gold/60 bg-grey-950/90 px-3 py-2 text-gold shadow-[0_0_14px_rgba(225,48,108,0.35)] backdrop-blur transition-colors hover:border-gold hover:shadow-[0_0_20px_rgba(225,48,108,0.5)]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gold"
        >
          <path d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Z" />
          <path d="M9 21h6" />
        </svg>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
          My Identity
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end px-6 pt-32"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-panel insta-gradient-shadow h-fit max-h-[60vh] w-full max-w-xs overflow-y-auto rounded p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg">
                My <span className="insta-gradient-text">Identity</span>
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-grey-400 transition-colors hover:text-white"
              >
                ✕
              </button>
            </div>

            {answered.length > 0 ? (
              <div className="space-y-3">
                {answered.map((q) => (
                  <div key={q.id}>
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-grey-500">
                      {q.label}
                    </span>
                    <p className="mt-0.5 text-sm text-grey-200">{brand[q.id]}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-grey-300">
                You haven&apos;t filled in My Identity yet. Go to your Profile to add it.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
