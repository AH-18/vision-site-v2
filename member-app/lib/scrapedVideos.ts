// Scraped-video inbox for the staff Review GUI.
//
// In production this gets filled by the n8n -> Apify daily job described in
// claude/content-ops-workflow.md (n8n triggers Apify, Apify writes rows here).
// That pipeline isn't wired up yet, so this file seeds a handful of mock
// scraped videos on first load and persists review state (status, which
// account/filter pulled it in) in localStorage — same temporary pattern as
// lib/brandProfile.ts, until a real Postgres-backed scraped_videos table
// exists.

export type ScrapedVideoStatus = "pending_review" | "rejected" | "pushed";

export interface ScrapedVideo {
  id: string;
  account: string; // "@handle" the video was scraped from
  videoUrl: string;
  views: number;
  caption: string;
  audio?: string;
  scrapedAt: string;
  status: ScrapedVideoStatus;
  /** Set once this video has been pushed, so the review page can link to the live template. */
  pushedTemplateId?: string;
}

const STORAGE_KEY = "vision_scraped_videos";

// Mock data standing in for a real Apify pull — same shape n8n would write.
const SEED_VIDEOS: ScrapedVideo[] = [
  {
    id: "scrape-1",
    account: "@creator.sarah",
    videoUrl: "https://www.instagram.com/reels/DdSfBtSzIMo/",
    views: 412000,
    caption: "pov: you finally found a routine that actually sticks 🧘",
    audio: "Soft Piano Loop — trending audio",
    scrapedAt: "2026-10-04",
    status: "pending_review",
  },
  {
    id: "scrape-2",
    account: "@thecontentguy",
    videoUrl: "https://www.instagram.com/reel/placeholder-scrape-2/",
    views: 865000,
    caption: "3 things nobody tells you about starting a newsletter",
    audio: "Talking Head Beat",
    scrapedAt: "2026-10-04",
    status: "pending_review",
  },
  {
    id: "scrape-3",
    account: "@wellness.with.mia",
    videoUrl: "https://www.instagram.com/reel/placeholder-scrape-3/",
    views: 340000,
    caption: "before vs after: 6 months of showing up consistently",
    audio: "Lo-fi Morning",
    scrapedAt: "2026-10-03",
    status: "pending_review",
  },
  {
    id: "scrape-4",
    account: "@creator.sarah",
    videoUrl: "https://www.instagram.com/reel/placeholder-scrape-4/",
    views: 301000,
    caption: "me explaining my niche to literally anyone who'll listen 😂",
    audio: "Upbeat Viral Sound",
    scrapedAt: "2026-10-03",
    status: "pending_review",
  },
];

function isBrowser() {
  return typeof window !== "undefined";
}

/** Loads the scraped-video inbox, seeding it on first run. */
export function loadScrapedVideos(): ScrapedVideo[] {
  if (!isBrowser()) return SEED_VIDEOS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_VIDEOS));
      return SEED_VIDEOS;
    }
    return JSON.parse(raw) as ScrapedVideo[];
  } catch {
    return SEED_VIDEOS;
  }
}

function saveScrapedVideos(videos: ScrapedVideo[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch {
    // localStorage unavailable (private window, etc.) — fail silently, same as brandProfile.ts
  }
}

export function getScrapedVideoById(id: string): ScrapedVideo | undefined {
  return loadScrapedVideos().find((v) => v.id === id);
}

export function updateScrapedVideoStatus(
  id: string,
  status: ScrapedVideoStatus,
  pushedTemplateId?: string
) {
  const videos = loadScrapedVideos().map((v) =>
    v.id === id ? { ...v, status, pushedTemplateId } : v
  );
  saveScrapedVideos(videos);
}
