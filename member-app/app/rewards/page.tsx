import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import { LEVELS, getLevelProgress } from "@/lib/levels";

export default function RewardsPage() {
  const { postsMade, currentLevel, nextLevel, percent } = getLevelProgress();

  return (
    <div>
      <PageHeader title="Your" gradientWord="Rewards" subtitle="Level & progress" />

      <div className="px-6">
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
        </Card>

        <Card className="mb-6">
          <h2 className="font-display text-xl">Level-Up Video</h2>
          <div className="mt-3 aspect-video w-full rounded bg-grey-800" />
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
