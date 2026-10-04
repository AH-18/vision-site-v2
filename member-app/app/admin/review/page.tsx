"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import { loadScrapedVideos, type ScrapedVideo } from "@/lib/scrapedVideos";

function formatViews(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
}

const STATUS_LABEL: Record<ScrapedVideo["status"], string> = {
  pending_review: "Pending Review",
  pushed: "Pushed Live",
  rejected: "Rejected",
};

export default function ReviewInboxPage() {
  const [videos, setVideos] = useState<ScrapedVideo[]>([]);

  useEffect(() => {
    setVideos(loadScrapedVideos());
  }, []);

  const pending = videos.filter((v) => v.status === "pending_review");
  const reviewed = videos
    .filter((v) => v.status !== "pending_review")
    .sort((a, b) => (a.scrapedAt < b.scrapedAt ? 1 : -1));

  return (
    <div>
      <PageHeader
        title="Scrape"
        gradientWord="Review"
        subtitle="Staff only · not linked from member navigation"
      />

      <div className="space-y-3 px-6 pb-4">
        <h2 className="font-display text-xl">
          Pending{" "}
          <span className="font-mono text-sm text-grey-500">({pending.length})</span>
        </h2>

        {pending.length === 0 ? (
          <Card>
            <p className="text-sm text-grey-300">
              Nothing waiting on review. New scrapes land here once the daily n8n → Apify job is
              wired up — for now this list is seeded with mock data.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((v) => (
              <Link key={v.id} href={`/admin/review/${v.id}`}>
                <Card className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
                        {v.account}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
                        · {formatViews(v.views)} views · {v.scrapedAt}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-sm text-grey-200">{v.caption}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs uppercase tracking-[0.15em] text-grey-400">
                    Review →
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {reviewed.length > 0 && (
        <div className="space-y-3 px-6 pb-6">
          <h2 className="font-display text-xl text-grey-300">Recently Reviewed</h2>
          <div className="space-y-2">
            {reviewed.map((v) => (
              <Card key={v.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
                    {v.account} · {formatViews(v.views)} views
                  </span>
                  <p className="mt-1 truncate text-sm text-grey-300">{v.caption}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.15em] ${
                      v.status === "pushed" ? "text-gold" : "text-grey-500"
                    }`}
                  >
                    {STATUS_LABEL[v.status]}
                  </span>
                  {v.status === "pushed" && v.pushedTemplateId && (
                    <Link
                      href={`/library/videos/${v.pushedTemplateId}`}
                      className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-400 underline"
                    >
                      View live
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
