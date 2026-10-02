import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";
import { LEVELS, getLevelProgress } from "@/lib/levels";

export default function RewardsPage() {
  const { postsMade, currentLevel, nextLevel, percent } = getLevelProgress();

  return (
    <div>
      <PageHeader title="Your" gradientWord="Rewards" subtitle="Level & progress" />

      <div className="px-6">
        <Card className="mb-6">
          <h2 className="font-display text-xl">How To Win Rewards</h2>
          <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="aspect-video w-full max-w-md rounded bg-grey-800" />
            <div>
              <p className="font-display text-2xl">Post. Level Up. Repeat.</p>
              <ul className="mt-3 space-y-2 text-sm text-grey-200">
                <li>🎁 Free months</li>
                <li>📣 Story shoutouts</li>
                <li>🤝 Free community access</li>
                <li>📞 1:1 call with Vision</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-grey-400">
                {currentLevel ? `Level ${currentLevel.level}` : "Not Started"}
              </span>
              <h2 className="font-display text-2xl">
                {currentLevel ? currentLevel.title : "Post To Begin"}
              </h2>
            </div>
            <span className="font-display text-3xl insta-gradient-text">
              {postsMade} posts
            </span>
          </div>
          <div className="mt-4">
            <ProgressBar percent={percent} />
          </div>
          {nextLevel && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
              {nextLevel.postsRequired - postsMade} posts to &quot;{nextLevel.title}&quot;
            </p>
          )}
          <Link
            href="/submit-post"
            className="mx-auto mt-4 block w-full max-w-sm rounded-full border-2 border-gold bg-transparent py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-white transition-all duration-200 hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(225,48,108,0.45)] active:scale-95 active:bg-gold/20"
          >
            Submit Your Post
          </Link>
        </Card>

        <h2 className="mb-3 font-display text-xl">Levels</h2>
        <div className="space-y-3">
          {LEVELS.map((l) => {
            const unlocked = postsMade >= l.postsRequired;
            return (
              <Card
                key={l.level}
                className={`flex items-center gap-4 py-4 ${unlocked ? "" : "opacity-50"}`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-display text-lg ${
                    unlocked
                      ? "border-gold/50 insta-gradient-text"
                      : "border-grey-700 text-grey-500"
                  }`}
                >
                  {l.level}
                </div>
                <div>
                  <p className="text-sm text-grey-100">{l.title}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
                    Your first {l.postsRequired} posts
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
