import Link from "next/link";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import { getLevelProgress } from "@/lib/levels";
import { SEQUENCES } from "@/lib/sequences";
import { getTrendingTemplates } from "@/lib/templates";

// Placeholder data — swap for real records once the DB is wired up.
const VIRAL_VIDEOS = getTrendingTemplates();

const USERS_TO_WATCH = [
  { id: 1, name: "Creator One", handle: "@creator_one" },
  { id: 2, name: "Creator Two", handle: "@creator_two" },
  { id: 3, name: "Creator Three", handle: "@creator_three" },
];

// Placeholder pick — real logic (level/quiz-based) comes later.
const SUGGESTED_SEQUENCE = SEQUENCES[0];
const OTHER_SEQUENCES = SEQUENCES.filter((s) => s.id !== SUGGESTED_SEQUENCE.id);

export default function HomePage() {
  const { postsMade, currentLevel, nextLevel, percent } = getLevelProgress();

  return (
    <div className="px-6">
      <PageHeader title="Welcome Back," gradientWord="Creator" />

      {/* 1. Track progress — same source as the Rewards page */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Your Progress</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-grey-400">
            {currentLevel ? `Level ${currentLevel.level}` : "Not Started"}
          </span>
        </div>
        <div className="mt-3">
          <ProgressBar percent={percent} />
        </div>
        <p className="mt-2 text-sm text-grey-300">
          {currentLevel ? currentLevel.title : "Post To Begin"}
          {nextLevel && (
            <span className="text-grey-500">
              {" "}
              · {nextLevel.postsRequired - postsMade} posts to &quot;{nextLevel.title}&quot;
            </span>
          )}
        </p>
      </Card>

      {/* 2. This week's highlights */}
      <section className="mb-6">
        <h2 className="mb-3 font-display text-2xl">This Week&apos;s Highlights</h2>
        <Card>
          <p className="text-sm text-grey-300">Highlights placeholder</p>
        </Card>
      </section>

      {/* 3. This week's viral videos */}
      <section className="mb-6">
        <h2 className="mb-3 font-display text-2xl">This Week&apos;s Viral Videos</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {VIRAL_VIDEOS.map((v) => (
            <Link key={v.id} href={`/library/videos/${v.id}`}>
              <Card className="w-32 shrink-0 p-0 overflow-hidden">
                <div className="aspect-[9/16] w-full bg-grey-800" />
                <span className="block px-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-grey-300">
                  {v.title}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Suggested sequence, based on level choice */}
      <section className="mb-6">
        <h2 className="mb-3 font-display text-2xl">
          Suggested <span className="insta-gradient-text">Sequence</span>
        </h2>
        <Link href={`/sequences/${SUGGESTED_SEQUENCE.id}`}>
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">{SUGGESTED_SEQUENCE.title}</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
                {SUGGESTED_SEQUENCE.goal}
              </span>
            </div>
            <p className="mt-2 text-sm text-grey-300">{SUGGESTED_SEQUENCE.description}</p>
          </Card>
        </Link>
      </section>

      {/* 5. Other sequences */}
      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl">Other Sequences</h2>
          <Link
            href="/sequences"
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-400"
          >
            View All
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {OTHER_SEQUENCES.map((s) => (
            <Link key={s.id} href={`/sequences/${s.id}`}>
              <Card className="flex aspect-square w-40 shrink-0 items-center justify-center text-center">
                <span className="font-display text-xl leading-tight text-grey-100">
                  {s.title}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Users to watch (unchanged position) */}
      <section className="mb-6">
        <h2 className="mb-3 font-display text-2xl">Users To Watch</h2>
        <div className="space-y-3">
          {USERS_TO_WATCH.map((u) => (
            <Card key={u.id} className="flex items-center gap-4 py-3">
              <div className="h-11 w-11 shrink-0 rounded-full border border-gold/40 bg-grey-800" />
              <div>
                <p className="text-sm text-grey-100">{u.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
                  {u.handle}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
