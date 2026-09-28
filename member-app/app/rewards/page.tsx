import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";

// Placeholder data — swap for the real level system once it's defined.
const LEVEL = 2;
const LEVEL_LABEL = "Rising Creator";
const PROGRESS_PERCENT = 45;

const MILESTONES = [
  { id: 1, title: "First Post", unlocked: true },
  { id: 2, title: "5 Posts Streak", unlocked: true },
  { id: 3, title: "Viral Video", unlocked: false },
  { id: 4, title: "30-Day Streak", unlocked: false },
];

export default function RewardsPage() {
  return (
    <div>
      <PageHeader title="Your" gradientWord="Rewards" subtitle="Level & progress" />

      <div className="px-6">
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-grey-400">
                Level {LEVEL}
              </span>
              <h2 className="font-display text-2xl">{LEVEL_LABEL}</h2>
            </div>
            <span className="font-display text-3xl insta-gradient-text">{PROGRESS_PERCENT}%</span>
          </div>
          <div className="mt-4">
            <ProgressBar percent={PROGRESS_PERCENT} />
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="font-display text-xl">Level-Up Video</h2>
          <div className="mt-3 aspect-video w-full rounded bg-grey-800" />
        </Card>

        <h2 className="mb-3 font-display text-xl">Milestones</h2>
        <div className="grid grid-cols-2 gap-4">
          {MILESTONES.map((m) => (
            <Card
              key={m.id}
              className={`text-center ${m.unlocked ? "" : "opacity-40"}`}
            >
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-gold/35 bg-gold/5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#rewardsGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" />
                  <path d="m9 14-1.5 7L12 19l4.5 2L15 14" />
                </svg>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-300">
                {m.title}
              </span>
            </Card>
          ))}
        </div>
      </div>

      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="rewardsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#833AB4" />
            <stop offset="50%" stopColor="#E1306C" />
            <stop offset="100%" stopColor="#FCAF45" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
