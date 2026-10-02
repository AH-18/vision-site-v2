import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import { SEQUENCES } from "@/lib/sequences";

export default function SequencesPage() {
  return (
    <div>
      <PageHeader title="Your" gradientWord="Sequences" subtitle="Pick a goal to work toward" />

      <div className="space-y-3 px-6">
        {SEQUENCES.map((seq) => (
          <Link key={seq.id} href={`/sequences/${seq.id}`}>
            <Card className="py-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl">{seq.title}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
                  {seq.goal}
                </span>
              </div>
              <p className="mt-2 text-sm text-grey-300">{seq.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
