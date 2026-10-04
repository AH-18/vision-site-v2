"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import {
  getScrapedVideoById,
  updateScrapedVideoStatus,
  type ScrapedVideo,
} from "@/lib/scrapedVideos";
import {
  pushTemplate,
  getAllTemplates,
  type Template,
  type TemplateFormat,
  type TemplatePillar,
} from "@/lib/templates";

const FORMATS: TemplateFormat[] = ["B-Roll", "Talking", "Carousel", "Voiceover", "Green Screen"];
const PILLARS: TemplatePillar[] = ["Educational", "Nurturing", "Storytelling", "Entertaining"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function linesToList(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function ReviewVideoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [video, setVideo] = useState<ScrapedVideo | null | undefined>(undefined);

  // Template fields the reviewer writes up.
  const [format, setFormat] = useState<TemplateFormat>("Talking");
  const [pillar, setPillar] = useState<TemplatePillar>("Educational");
  const [description, setDescription] = useState("");
  const [compositionGuide, setCompositionGuide] = useState("");
  const [suggestedAudio, setSuggestedAudio] = useState("");
  const [textOnScreen, setTextOnScreen] = useState("");
  const [nicheExamples, setNicheExamples] = useState("");
  const [captionVariants, setCaptionVariants] = useState("");

  // Readiness checklist — all three required before Approve & Push unlocks.
  const [linksChecked, setLinksChecked] = useState(false);
  const [textChecked, setTextChecked] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);

  useEffect(() => {
    const v = getScrapedVideoById(id) ?? null;
    setVideo(v);
    if (v) {
      setSuggestedAudio(v.audio ?? "");
      setNicheExamples(v.videoUrl);
    }
  }, [id]);

  if (video === undefined) return null;

  if (video === null) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-sm text-grey-300">Couldn&apos;t find that scraped video.</p>
        <Link href="/admin/review" className="mt-3 inline-block text-sm text-gold underline">
          Back to Review
        </Link>
      </div>
    );
  }

  if (video.status !== "pending_review") {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-sm text-grey-300">
          This one&apos;s already been {video.status === "pushed" ? "pushed live" : "rejected"}.
        </p>
        <Link href="/admin/review" className="mt-3 inline-block text-sm text-gold underline">
          Back to Review
        </Link>
      </div>
    );
  }

  const readyToPush =
    linksChecked &&
    textChecked &&
    photoReady &&
    description.trim() &&
    compositionGuide.trim() &&
    textOnScreen.trim();

  function handleReject() {
    updateScrapedVideoStatus(id, "rejected");
    router.push("/admin/review");
  }

  function handleApprove() {
    if (!readyToPush || !video) return;

    const existing = getAllTemplates();
    const nextTrendNumber = Math.max(0, ...existing.map((t) => t.trendNumber)) + 1;
    const title = `Trend #${nextTrendNumber}`;
    const templateId = `${slugify(title)}-${video.id}`;

    const template: Template = {
      id: templateId,
      trendNumber: nextTrendNumber,
      title,
      date: video.scrapedAt,
      format,
      pillar,
      description: description.trim(),
      compositionGuide: compositionGuide.trim(),
      suggestedAudio: linesToList(suggestedAudio),
      textOnScreen: textOnScreen.trim(),
      nicheExamples: linesToList(nicheExamples),
      captionVariants: linesToList(captionVariants),
      trending: false,
    };

    pushTemplate(template);
    updateScrapedVideoStatus(id, "pushed", templateId);
    router.push("/admin/review");
  }

  return (
    <div>
      <PageHeader title="Review" gradientWord="Video" subtitle={video.account} />

      <div className="space-y-5 px-6 pb-24">
        <Card>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
            Scraped Data
          </span>
          <div className="mt-2 space-y-1.5 text-sm text-grey-200">
            <p>
              <span className="text-grey-500">Account:</span> {video.account}
            </p>
            <p>
              <span className="text-grey-500">Views:</span> {video.views.toLocaleString()}
            </p>
            <p>
              <span className="text-grey-500">Caption:</span> {video.caption}
            </p>
            {video.audio && (
              <p>
                <span className="text-grey-500">Audio:</span> {video.audio}
              </p>
            )}
            <p>
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline decoration-dotted underline-offset-4 hover:text-white"
              >
                🔗 Open original reel ↗
              </a>
            </p>
          </div>
        </Card>

        <Card>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
            Template Write-Up
          </span>

          <div className="space-y-4">
            <div className="flex gap-3">
              <label className="flex-1 text-xs text-grey-400">
                Format
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as TemplateFormat)}
                  className="mt-1 w-full border border-grey-700 bg-black/40 p-2 text-sm text-grey-100"
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex-1 text-xs text-grey-400">
                Pillar
                <select
                  value={pillar}
                  onChange={(e) => setPillar(e.target.value as TemplatePillar)}
                  className="mt-1 w-full border border-grey-700 bg-black/40 p-2 text-sm text-grey-100"
                >
                  {PILLARS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-xs text-grey-400">
              Description — why this trend works
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full border border-grey-700 bg-black/40 p-2 text-sm text-grey-100"
              />
            </label>

            <label className="block text-xs text-grey-400">
              Composition Guide — literal shooting instructions
              <textarea
                value={compositionGuide}
                onChange={(e) => setCompositionGuide(e.target.value)}
                rows={3}
                className="mt-1 w-full border border-grey-700 bg-black/40 p-2 text-sm text-grey-100"
              />
            </label>

            <label className="block text-xs text-grey-400">
              Suggested Audio — one per line
              <textarea
                value={suggestedAudio}
                onChange={(e) => setSuggestedAudio(e.target.value)}
                rows={2}
                className="mt-1 w-full border border-grey-700 bg-black/40 p-2 font-mono text-sm text-grey-100"
              />
            </label>

            <label className="block text-xs text-grey-400">
              Text On Screen — use [bracketed placeholders]
              <textarea
                value={textOnScreen}
                onChange={(e) => setTextOnScreen(e.target.value)}
                rows={2}
                className="mt-1 w-full border border-grey-700 bg-black/40 p-2 font-mono text-sm text-grey-100"
              />
            </label>

            <label className="block text-xs text-grey-400">
              Niche Examples — one link per line
              <textarea
                value={nicheExamples}
                onChange={(e) => setNicheExamples(e.target.value)}
                rows={2}
                className="mt-1 w-full border border-grey-700 bg-black/40 p-2 font-mono text-sm text-grey-100"
              />
            </label>

            <label className="block text-xs text-grey-400">
              Caption Outline — one variant per line
              <textarea
                value={captionVariants}
                onChange={(e) => setCaptionVariants(e.target.value)}
                rows={3}
                className="mt-1 w-full border border-grey-700 bg-black/40 p-2 text-sm text-grey-100"
              />
            </label>
          </div>
        </Card>

        <Card>
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
            Before It Can Be Pushed
          </span>
          <div className="space-y-2.5">
            <label className="flex items-center gap-2.5 text-sm text-grey-200">
              <input
                type="checkbox"
                checked={linksChecked}
                onChange={(e) => setLinksChecked(e.target.checked)}
                className="h-4 w-4 accent-gold"
              />
              Attached links work
            </label>
            <label className="flex items-center gap-2.5 text-sm text-grey-200">
              <input
                type="checkbox"
                checked={textChecked}
                onChange={(e) => setTextChecked(e.target.checked)}
                className="h-4 w-4 accent-gold"
              />
              Attached text has no typos
            </label>
            <label className="flex items-center gap-2.5 text-sm text-grey-200">
              <input
                type="checkbox"
                checked={photoReady}
                onChange={(e) => setPhotoReady(e.target.checked)}
                className="h-4 w-4 accent-gold"
              />
              Post photo is ready
            </label>
          </div>
        </Card>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleReject}
            className="flex-1 border border-grey-700 py-3 font-mono text-xs uppercase tracking-[0.2em] text-grey-200 transition-colors hover:border-red-500/50 hover:text-red-400"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={!readyToPush}
            className="flex-1 rounded-full border border-gold/60 bg-grey-950/90 py-3 font-mono text-xs uppercase tracking-[0.2em] text-gold shadow-[0_0_14px_rgba(225,48,108,0.35)] backdrop-blur transition-colors hover:border-gold hover:shadow-[0_0_20px_rgba(225,48,108,0.5)] disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
