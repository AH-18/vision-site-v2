// Single source of truth for content templates (the "videos" in Library).
// Structure mirrors the template-detail breakdown from the DFY Reels
// competitor analysis (claude/competitor-analysis-dfy-reels.md): Description,
// Composition Guide, suggested audios, Text-on-screen with [placeholders],
// Niche Examples, and Caption Outline variants.

export type TemplateFormat = "B-Roll" | "Talking" | "Carousel" | "Voiceover" | "Green Screen";
export type TemplatePillar = "Educational" | "Nurturing" | "Storytelling" | "Entertaining";

export interface Template {
  id: string;
  trendNumber: number;
  title: string;
  date: string;
  format: TemplateFormat;
  pillar: TemplatePillar;
  description: string;
  compositionGuide: string;
  suggestedAudio: string[];
  textOnScreen: string;
  nicheExamples: string[];
  captionVariants: string[];
  /** Surfaced in Home's "This Week's Viral Videos" rail. */
  trending?: boolean;
}

// Placeholder content — swap for real weekly drops once the content pipeline
// is wired up. Copy intentionally mirrors the DFY-Reels-style format (hook +
// bracketed placeholders) that the brand questionnaire answers are meant to fill.
export const TEMPLATES: Template[] = [
  {
    id: "trend-30",
    trendNumber: 30,
    title: "Trend #30",
    date: "Sep 30",
    format: "B-Roll",
    pillar: "Nurturing",
    description:
      "A slow-paced, aesthetic B-roll trend that pairs calm visuals with a relatable voiceover hook — works well for building trust with followers who already know you.",
    compositionGuide:
      "3-5 short clips (2-3 sec each) of you in your natural work environment. Keep the pacing slow and intentional — no fast cuts. End on a close-up reaction shot.",
    suggestedAudio: [
      "Trending audio — \"Soft Piano Loop\" (instagram.com/reel/placeholder1)",
      "Trending audio — \"Calm Vlog Type Beat\" (instagram.com/reel/placeholder2)",
      "Trending audio — \"Lo-fi Morning\" (instagram.com/reel/placeholder3)",
    ],
    textOnScreen:
      "pov: you're a [describe your ideal follower] who wants to [achieve result] without [disliked thing]",
    nicheExamples: [
      "instagram.com/reel/niche-example-1",
      "instagram.com/reel/niche-example-2",
      "instagram.com/reel/niche-example-3",
    ],
    captionVariants: [
      "This is for the [ideal follower] who's tired of [pain point]. Save this for later 📌",
      "If you've ever felt [pain point], this one's for you.",
      "Not financial advice, just [your niche] advice 😉",
    ],
    trending: true,
  },
  {
    id: "trend-29",
    trendNumber: 29,
    title: "Trend #29",
    date: "Sep 29",
    format: "Talking",
    pillar: "Educational",
    description:
      "A direct-to-camera breakdown trend — fast, punchy, and built to stop the scroll with a strong opening line before delivering value.",
    compositionGuide:
      "One continuous talking-head clip, 30-45 sec. Open with the hook line on screen within the first second. Use jump cuts every 3-4 sentences to keep pacing tight.",
    suggestedAudio: [
      "Original audio (your voice) — recommended",
      "Trending audio — \"Talking Head Beat\" (instagram.com/reel/placeholder4)",
    ],
    textOnScreen: "3 things nobody tells you about [your topic]",
    nicheExamples: [
      "instagram.com/reel/niche-example-4",
      "instagram.com/reel/niche-example-5",
    ],
    captionVariants: [
      "Number 2 is the one everyone gets wrong.",
      "Save this before you make this mistake.",
      "Which one surprised you most? 👇",
    ],
    trending: true,
  },
  {
    id: "trend-28",
    trendNumber: 28,
    title: "Trend #28",
    date: "Sep 28",
    format: "Carousel",
    pillar: "Storytelling",
    description:
      "A swipe-through carousel trend for walking followers through a before/after story — strong for building connection and credibility.",
    compositionGuide:
      "5-7 slides. Slide 1 = hook/before state. Middle slides = the turning point. Final slide = after state + soft CTA.",
    suggestedAudio: ["N/A — carousel post, caption-driven"],
    textOnScreen:
      "Before: [describe the struggle]. After: [describe the transformation].",
    nicheExamples: [
      "instagram.com/p/niche-example-6",
      "instagram.com/p/niche-example-7",
    ],
    captionVariants: [
      "I never thought I'd get here. Swipe to see what changed →",
      "This took me [timeframe] to figure out. Hope it saves you time.",
      "Tag someone who needs to see this.",
    ],
  },
  {
    id: "trend-27",
    trendNumber: 27,
    title: "Trend #27",
    date: "Sep 27",
    format: "B-Roll",
    pillar: "Entertaining",
    description:
      "A quick-cut, high-energy trend built for reach — leans on a trending sound and relatable humor rather than direct teaching.",
    compositionGuide:
      "4-6 quick clips synced to the beat drops of the trending audio. Keep it light and funny — this is a top-of-funnel discovery post, not a sales post.",
    suggestedAudio: [
      "Trending audio — \"Upbeat Viral Sound\" (instagram.com/reel/placeholder5)",
    ],
    textOnScreen: "me explaining [your niche] to anyone who'll listen",
    nicheExamples: [
      "instagram.com/reel/niche-example-8",
      "instagram.com/reel/niche-example-9",
      "instagram.com/reel/niche-example-10",
    ],
    captionVariants: [
      "No one asked but here we are 😂",
      "Send this to your [ideal follower] friend",
      "This is way too accurate",
    ],
  },
];

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTrendingTemplates(): Template[] {
  return TEMPLATES.filter((t) => t.trending);
}
