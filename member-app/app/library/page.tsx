import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default function LibraryPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col">
      <PageHeader title="Content" gradientWord="Library" />

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="grid w-full max-w-xs grid-cols-2 gap-5">
          <Link
            href="/library/videos"
            className="glass-panel insta-gradient-shadow flex aspect-square max-h-40 flex-col items-center justify-center text-center transition-transform duration-200 hover:-translate-y-1"
          >
            <span className="font-display text-2xl">Videos</span>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-grey-400">
              Browse templates
            </span>
          </Link>

          <Link
            href="/sequences"
            className="glass-panel insta-gradient-shadow flex aspect-square max-h-40 flex-col items-center justify-center text-center transition-transform duration-200 hover:-translate-y-1"
          >
            <span className="font-display text-2xl">Sequences</span>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-grey-400">
              Pick a goal
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
