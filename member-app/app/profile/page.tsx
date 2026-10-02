"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import {
  BRAND_QUESTIONS,
  type BrandProfileAnswers,
  type BrandQuestionId,
  loadBrandProfile,
  saveBrandProfile,
} from "@/lib/brandProfile";

export default function ProfilePage() {
  const [brand, setBrand] = useState<BrandProfileAnswers>({});
  // Per-question "do you know this yet?" toggle — only shown for questions
  // flagged allowUnknown. undefined = not chosen yet, true = Yes (show box),
  // false = Not Sure Yet (box hidden, answer stays blank).
  const [knows, setKnows] = useState<Partial<Record<BrandQuestionId, boolean>>>({});

  // Read saved answers on mount — localStorage isn't available during server render.
  useEffect(() => {
    const saved = loadBrandProfile();
    setBrand(saved);
    const initialKnows: Partial<Record<BrandQuestionId, boolean>> = {};
    BRAND_QUESTIONS.forEach((q) => {
      if (q.allowUnknown && saved[q.id]?.trim()) initialKnows[q.id] = true;
    });
    setKnows(initialKnows);
  }, []);

  function handleAnswerChange(id: BrandQuestionId, value: string) {
    setBrand((prev) => ({ ...prev, [id]: value }));
  }

  function handleKnowsChoice(id: BrandQuestionId, value: boolean) {
    setKnows((prev) => ({ ...prev, [id]: value }));
    if (!value) {
      // "Not Sure Yet" — clear any text so it's skipped by sequence suggestions.
      setBrand((prev) => ({ ...prev, [id]: "" }));
    }
  }

  function handleSave() {
    saveBrandProfile(brand);
  }

  return (
    <div>
      <PageHeader title="Your Profile" />

      <div className="px-6">
        <Card className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 rounded-full border-2 border-gold/50 bg-grey-800" />
          <div>
            <h2 className="font-display text-2xl">Creator Name</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-400">
              Level 2 · Rising Creator
            </span>
          </div>
        </Card>

        <div className="mt-6 space-y-3">
          {["Name", "Instagram Username", "Email", "About You"].map((field) => (
            <Card key={field} className="py-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
                {field}
              </span>
              <p className="mt-1 text-sm text-grey-200">—</p>
            </Card>
          ))}
        </div>

        {/* My Identity — powers the sequence-specific suggestions */}
        <div className="mt-6">
          <h2 className="font-display text-xl">
            My <span className="insta-gradient-text">Identity</span>
          </h2>
          <p className="mt-1 text-xs text-grey-500">
            This fills in the suggestions you&apos;ll see inside each Sequence — only the
            part that matters for that sequence.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {BRAND_QUESTIONS.map((q) => {
            const knowsThis = knows[q.id];
            const showBox = !q.allowUnknown || knowsThis === true;

            return (
              <Card key={q.id} className="py-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
                  {q.label}
                </span>
                <p className="mt-1 text-sm text-grey-200">{q.prompt}</p>

                {q.allowUnknown && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleKnowsChoice(q.id, true)}
                      className={`flex-1 border py-2 font-mono text-[10px] uppercase tracking-[0.15em] ${
                        knowsThis === true
                          ? "border-gold/60 insta-gradient-text"
                          : "border-grey-700 text-grey-400"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKnowsChoice(q.id, false)}
                      className={`flex-1 border py-2 font-mono text-[10px] uppercase tracking-[0.15em] ${
                        knowsThis === false
                          ? "border-gold/60 text-grey-100"
                          : "border-grey-700 text-grey-400"
                      }`}
                    >
                      Not Sure Yet
                    </button>
                  </div>
                )}

                {showBox && (
                  <textarea
                    value={brand[q.id] ?? ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    rows={3}
                    className="mt-3 w-full resize-none border border-grey-700 bg-black/40 p-3 text-sm text-grey-100 placeholder:text-grey-600 focus:border-gold/50 focus:outline-none"
                  />
                )}
              </Card>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full insta-gradient-bg py-3 font-mono text-xs uppercase tracking-[0.2em] text-white"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
