// Single source of truth for the "My Identity" brand questionnaire (lives
// inline on the Profile page). Answers here are reused as contextual,
// sequence-specific suggestions when the user works through a Sequence (Top
// of Funnel, Middle of Funnel, etc.) — each sequence only pulls the subset of
// questions mapped to it below, never all of them at once. Full spec:
// claude/profile-questionnaire.md in the project docs.
//
// Every question is optional — an empty box is fine. getAnswersForSequence()
// below simply skips anything left blank.

export type SequenceId =
  | "first-8-posts"
  | "top-of-funnel"
  | "middle-of-funnel"
  | "bottom-of-funnel"
  | "trial-reels"
  | "introduce-yourself";

export type BrandQuestionId =
  | "brandNiche"
  | "differentiator"
  | "idealFollower"
  | "painPoint"
  | "coreOffer"
  | "result"
  | "proof"
  | "originStory"
  | "beforeAfter"
  | "audienceLanguage"
  | "brandVoice";

export interface BrandQuestion {
  id: BrandQuestionId;
  label: string;
  prompt: string;
  placeholder: string;
}

export const BRAND_QUESTIONS: BrandQuestion[] = [
  {
    id: "brandNiche",
    label: "Brand & Niche",
    prompt: "What is your brand name and what do you do — one sentence?",
    placeholder: "e.g. Vision — I help coaches turn Instagram into client pipeline.",
  },
  {
    id: "differentiator",
    label: "What Makes You Different",
    prompt: "What makes you different from every competitor in your space?",
    placeholder: "e.g. I've actually run the strategy myself, not just taught it.",
  },
  {
    id: "idealFollower",
    label: "Ideal Follower",
    prompt: "Describe your ideal follower — age, gender, situation.",
    placeholder: "e.g. Women 28-40, early-stage coaches, overwhelmed by content.",
  },
  {
    id: "painPoint",
    label: "Their Biggest Pain Point",
    prompt: "What is their single biggest pain point that you could help them with?",
    placeholder: "e.g. They post constantly but it never turns into clients.",
  },
  {
    id: "coreOffer",
    label: "Core Offer",
    prompt: "What is your core offer?",
    placeholder: "e.g. A 12-week 1:1 coaching program.",
  },
  {
    id: "result",
    label: "Result / Transformation",
    prompt: "What specific result or transformation does it deliver to the client?",
    placeholder: "e.g. 3-5 qualified leads a week within 90 days.",
  },
  {
    id: "proof",
    label: "Proof",
    prompt: "Do you have testimonials or case studies?",
    placeholder: '"Booked 4 calls in my first week" — Sarah K.',
  },
  {
    id: "originStory",
    label: "Origin Story",
    prompt: "What's your origin story — how did you get into this?",
    placeholder: "e.g. I burned out in corporate and found freedom building my own audience.",
  },
  {
    id: "beforeAfter",
    label: "Before & After",
    prompt: "What's the moment that changed everything — your \"before vs after\"?",
    placeholder:
      "e.g. Before: posting randomly with no plan. After: fully booked from Instagram alone.",
  },
  {
    id: "audienceLanguage",
    label: "Audience's Words",
    prompt: "What words or phrases does your audience use most when talking about this topic?",
    placeholder: "e.g. \"burnt out\", \"imposter syndrome\", \"stuck at 500 followers\"",
  },
  {
    id: "brandVoice",
    label: "Brand Voice",
    prompt: "What's your personal brand voice — words to use, words to avoid?",
    placeholder: "e.g. Use: direct, no-fluff, punchy. Avoid: corporate jargon, \"game-changer\".",
  },
];

// Which questions surface as suggestions inside each Sequence.
export const SEQUENCE_QUESTION_MAP: Record<SequenceId, BrandQuestionId[]> = {
  "first-8-posts": [
    "brandNiche",
    "differentiator",
    "idealFollower",
    "painPoint",
    "result",
    "audienceLanguage",
    "brandVoice",
  ],
  "top-of-funnel": [
    "brandNiche",
    "idealFollower",
    "painPoint",
    "result",
    "beforeAfter",
    "audienceLanguage",
    "brandVoice",
  ],
  "middle-of-funnel": [
    "brandNiche",
    "differentiator",
    "result",
    "proof",
    "originStory",
    "beforeAfter",
    "brandVoice",
  ],
  "bottom-of-funnel": ["brandNiche", "coreOffer", "result", "proof", "brandVoice"],
  "trial-reels": ["brandNiche", "idealFollower", "painPoint", "audienceLanguage", "brandVoice"],
  "introduce-yourself": [
    "brandNiche",
    "differentiator",
    "originStory",
    "beforeAfter",
    "brandVoice",
  ],
};

export type BrandProfileAnswers = Partial<Record<BrandQuestionId, string>>;

/** The questions (full objects, in order) relevant to one sequence. */
export function getQuestionsForSequence(sequenceId: SequenceId): BrandQuestion[] {
  const ids = SEQUENCE_QUESTION_MAP[sequenceId] ?? [];
  return BRAND_QUESTIONS.filter((q) => ids.includes(q.id));
}

/** The user's saved answers, filtered down to just the ones a sequence needs. Blanks are skipped. */
export function getAnswersForSequence(
  sequenceId: SequenceId,
  answers: BrandProfileAnswers
): { question: BrandQuestion; answer: string }[] {
  return getQuestionsForSequence(sequenceId)
    .map((question) => ({ question, answer: answers[question.id]?.trim() ?? "" }))
    .filter((entry) => entry.answer.length > 0);
}

// Placeholder persistence until accounts/DB are wired up (Postgres + Auth.js
// per the tech-stack doc). Swap these two functions for real API calls once
// that lands — nothing else in the app should need to change.
const STORAGE_KEY = "vision_brand_profile";

export function loadBrandProfile(): BrandProfileAnswers {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveBrandProfile(answers: BrandProfileAnswers) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // localStorage unavailable (private mode, etc.) — fail silently, not fatal.
  }
}
