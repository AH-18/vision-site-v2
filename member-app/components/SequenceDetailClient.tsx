"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import type { Sequence } from "@/lib/sequences";
import {
  type BrandProfileAnswers,
  getAnswersForSequence,
  loadBrandProfile,
} from "@/lib/brandProfile";

export default function SequenceDetailClient({ sequence }: { sequence: Sequence }) {
  const [brand, setBrand] = useState<BrandProfileAnswers>({});

  // Read on mount — localStorage isn't available during server render.
  useEffect(() => {
    setBrand(loadBrandProfile());
  }, []);

  const suggestions = getAnswersForSequence(sequence.id, brand);

  return (
    <div>
      <PageHeader title={sequence.title} subtitle={sequence.goal} />

      <div className="px-6">
        <Card className="mb-6">
          <p className="text-sm text-grey-300">{sequence.description}</p>
        </Card>

        {/* Suggestions — pulled from My Identity, scoped to only this sequence */}
        <h2 className="mb-3 font-display text-xl">
          Your <span className="insta-gradient-text">Suggestions</span>
        </h2>

        {suggestions.length > 0 ? (
          <div className="mb-6 space-y-3">
            {suggestions.map(({ question, answer }) => (
              <Card key={question.id} className="py-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
                  {question.label}
                </span>
                <p className="mt-1 text-sm text-grey-200">{answer}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mb-6">
            <p className="text-sm text-grey-300">
              Fill in your My Identity answers on your Profile to see suggestions tailored to
              this sequence.
            </p>
            <Link
              href="/profile"
              className="mt-4 block w-full insta-gradient-bg py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-white"
            >
              Go To Profile
            </Link>
          </Card>
        )}

        {/* Templates in this sequence — placeholder until template data is wired up */}
        <h2 className="mb-3 font-display text-xl">Templates</h2>
        <Card>
          <p className="text-sm text-grey-300">Template list placeholder — coming soon.</p>
        </Card>
      </div>
    </div>
  );
}
