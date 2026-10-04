"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import { addManualScrapedVideo } from "@/lib/scrapedVideos";

export default function AddManualVideoPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const canContinue = account.trim() && videoUrl.trim();

  function handleContinue() {
    if (!canContinue) return;
    const video = addManualScrapedVideo({
      account: account.trim().startsWith("@") ? account.trim() : `@${account.trim()}`,
      videoUrl: videoUrl.trim(),
    });
    router.push(`/admin/review/${video.id}`);
  }

  return (
    <div>
      <PageHeader
        title="Add"
        gradientWord="Manually"
        subtitle="For a video your team found, not the scraper"
      />

      <div className="space-y-5 px-6 pb-6">
        <Card>
          <p className="text-sm text-grey-300">
            Drop in the link and the creator it&apos;s from — you&apos;ll fill in the rest of the
            template write-up (description, composition guide, captions, etc.) on the next page,
            same as any scraped video.
          </p>
        </Card>

        <Card>
          <div className="space-y-4">
            <label className="block text-xs text-grey-400">
              Creator / Account
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="@creator.handle"
                className="mt-1 w-full border border-grey-700 bg-black/40 p-2 font-mono text-sm text-grey-100"
              />
            </label>

            <label className="block text-xs text-grey-400">
              Video Link
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                className="mt-1 w-full border border-grey-700 bg-black/40 p-2 font-mono text-sm text-grey-100"
              />
            </label>
          </div>
        </Card>

        <div className="flex gap-3 pt-1">
          <Link
            href="/admin/review"
            className="flex-1 border border-grey-700 py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-grey-200 transition-colors hover:border-gold/50"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="flex-1 rounded-full border border-gold/60 bg-grey-950/90 py-3 font-mono text-xs uppercase tracking-[0.2em] text-gold shadow-[0_0_14px_rgba(225,48,108,0.35)] backdrop-blur transition-colors hover:border-gold hover:shadow-[0_0_20px_rgba(225,48,108,0.5)] disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
