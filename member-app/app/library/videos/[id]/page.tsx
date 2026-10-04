"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import IdentityQuickView from "@/components/IdentityQuickView";
import { getAllTemplates, type Template } from "@/lib/templates";

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null | undefined>(undefined);

  // Pushed templates (from the Review GUI) live in localStorage, so look the
  // template up client-side after mount rather than as a server component.
  useEffect(() => {
    setTemplate(getAllTemplates().find((t) => t.id === id) ?? null);
  }, [id]);

  if (template === undefined) return null;

  if (template === null) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-sm text-grey-300">Couldn&apos;t find that template.</p>
        <Link href="/library/videos" className="mt-3 inline-block text-sm text-gold underline">
          Back to Videos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <IdentityQuickView />

      <PageHeader
        title={template.title}
        subtitle={`${template.format} · ${template.pillar} · ${template.date}`}
      />

      <div className="space-y-5 px-6 pb-6">
        {/* Preview */}
        <div className="mx-auto aspect-[9/16] w-full max-w-[220px] rounded bg-grey-800" />

        <Card>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
            Description
          </span>
          <p className="mt-2 text-sm text-grey-200">{template.description}</p>
        </Card>

        <Card>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
            Composition Guide
          </span>
          <p className="mt-2 text-sm text-grey-200">{template.compositionGuide}</p>
        </Card>

        <Card>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
            Suggested Audio
          </span>
          <ul className="mt-2 space-y-1.5">
            {template.suggestedAudio.map((audio, i) => (
              <li key={i} className="text-sm text-grey-200">
                🎵 {audio}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
            Text On Screen
          </span>
          <p className="mt-2 border border-grey-700 bg-black/40 p-3 font-mono text-sm leading-relaxed text-grey-100">
            {template.textOnScreen}
          </p>
        </Card>

        <Card>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
            Niche Examples
          </span>
          <ul className="mt-2 space-y-1.5">
            {template.nicheExamples.map((example, i) => {
              const isLink = /^https?:\/\//.test(example);
              return (
                <li key={i} className="text-sm text-grey-200">
                  {isLink ? (
                    <a
                      href={example}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold underline decoration-dotted underline-offset-4 transition-colors hover:text-white"
                    >
                      🔗 View example reel ↗
                    </a>
                  ) : (
                    <>🔗 {example}</>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
            Caption Outline
          </span>
          <div className="mt-2 space-y-3">
            {template.captionVariants.map((caption, i) => (
              <p key={i} className="text-sm text-grey-200">
                {caption}
              </p>
            ))}
          </div>
        </Card>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            className="flex-1 border border-grey-700 py-3 font-mono text-xs uppercase tracking-[0.2em] text-grey-200 transition-colors hover:border-gold/50"
          >
            Edit Prompt
          </button>
          <button
            type="button"
            className="flex-1 rounded-full border border-gold/60 bg-grey-950/90 py-3 font-mono text-xs uppercase tracking-[0.2em] text-gold shadow-[0_0_14px_rgba(225,48,108,0.35)] backdrop-blur transition-colors hover:border-gold hover:shadow-[0_0_20px_rgba(225,48,108,0.5)]"
          >
            Quick Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
