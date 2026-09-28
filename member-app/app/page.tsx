import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";

// Placeholder data — swap for real records once the DB is wired up.
const OTHER_SEQUENCES = [
  { id: 1, title: "Top of Funnel" },
  { id: 2, title: "Middle of Funnel" },
  { id: 3, title: "Bottom of Funnel" },
  { id: 4, title: "Introduce Yourself" },
];

const VIRAL_VIDEOS = [
  { id: 1, title: "Viral Video #1" },
  { id: 2, title: "Viral Video #2" },
  { id: 3, title: "Viral Video #3" },
];

const USERS_TO_WATCH = [
  { id: 1, name: "Creator One", handle: "@creator_one" },
  { id: 2, name: "Creator Two", handle: "@creator_two" },
  { id: 3, name: "Creator Three", handle: "@creator_three" },
];

export default function HomePage() {
  return (
    <div className="px-6">
      <PageHeader title="Welcome Back," gradientWord="Creator" />

      {/* 1. Track progress */}
      <Card className="mb-6">
        <h2 className="font-display text-2xl">Your Progress</h2>
        <div className="mt-3">
          <ProgressBar percent={45} />
        </div>
        <p className="mt-2 text-sm text-grey-300">Level 2 · Rising Creator</p>
      </Card>

      {/* 2. This week's highlights */}
      <section className="mb-6">
        <h2 className="mb-3 font-display text-2xl">This Week&apos;s Highlights</h2>
        <Card>
          <p className="text-sm text-grey-300">Highlights placeholder</p>
        </Card>
      </section>

      {/* 3. Suggested sequence, based on level choice */}
      <section className="mb-6">
        <h2 className="mb-3 font-display text-2xl">
          Suggested <span className="insta-gradient-text">Sequence</span>
        </h2>
        <Card>
          <p className="text-sm text-grey-300">Based on your level & choice — placeholder</p>
        </Card>
      </section>

      {/* 4. Other sequences */}
      <section className="mb-6">
        <h2 className="mb-3 font-display text-2xl">Other Sequences</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {OTHER_SEQUENCES.map((s) => (
            <Card key={s.id} className="w-40 shrink-0">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-grey-200">
                {s.title}
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. This week's viral videos */}
      <section className="mb-6">
        <h2 className="mb-3 font-display text-2xl">This Week&apos;s Viral Videos</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {VIRAL_VIDEOS.map((v) => (
            <Card key={v.id} className="w-32 shrink-0 p-0 overflow-hidden">
              <div className="aspect-[9/16] w-full bg-grey-800" />
              <span className="block px-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-grey-300">
                {v.title}
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. Users to watch */}
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
