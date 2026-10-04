import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default function ReviewHubPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col">
      <PageHeader
        title="Scrape"
        gradientWord="Review"
        subtitle="Staff only · not linked from member navigation"
      />
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="grid w-full max-w-xs grid-cols-2 gap-5">
          <Link
            href="/admin/review/queue"
            className="glass-panel insta-gradient-shadow flex aspect-square max-h-40 flex-col items-center justify-center text-center transition-transform duration-200 hover:-translate-y-1"
          >
            <span className="font-display text-2xl">Scraped</span>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-grey-400">
              From Apify
            </span>
          </Link>
          <Link
            href="/admin/review/new"
            className="glass-panel insta-gradient-shadow flex aspect-square max-h-40 flex-col items-center justify-center text-center transition-transform duration-200 hover:-translate-y-1"
          >
            <span className="font-display text-2xl">Add</span>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-grey-400">
              Manually
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
