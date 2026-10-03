import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import IdentityQuickView from "@/components/IdentityQuickView";
import { getTemplateById } from "@/lib/templates";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = getTemplateById(id);

  if (!template) notFound();

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
            {template.nicheExamples.map((example, i) => (
              <li key={i} className="text-sm text-grey-200">
                🔗 {example}
              </li>
            ))}
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
