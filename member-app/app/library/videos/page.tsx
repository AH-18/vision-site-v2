"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import FilterChip from "@/components/FilterChip";
import Card from "@/components/Card";
import { useEffect } from "react";
import { getAllTemplates, type Template } from "@/lib/templates";

const TYPE_FILTERS = [
  "All",
  "B-Roll",
  "Talking",
  "Carousel",
  "Voiceover",
  "Green Screen",
  "Vlog",
  "No Face",
  "Heavy Edit",
];
const STYLE_FILTERS = ["All", "Educational", "Nurturing", "Storytelling", "Entertaining"];

export default function LibraryVideosPage() {
  const [type, setType] = useState("All");
  const [style, setStyle] = useState("All");
  const [templates, setTemplates] = useState<Template[]>([]);

  // Pushed templates live in localStorage, so load client-side after mount.
  useEffect(() => {
    setTemplates(getAllTemplates());
  }, []);

  const filtered = templates.filter(
    (t) => (type === "All" || t.format === type) && (style === "All" || t.pillar === style)
  );

  return (
    <div>
      <PageHeader title="Content" gradientWord="Library" />

      <div className="space-y-4 px-6">
        <div>
          <span className="mb-2 block font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">
            Type
          </span>
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <FilterChip key={f} label={f} active={type === f} onClick={() => setType(f)} />
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">
            Style
          </span>
          <div className="flex flex-wrap gap-2">
            {STYLE_FILTERS.map((f) => (
              <FilterChip key={f} label={f} active={style === f} onClick={() => setStyle(f)} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 px-6">
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-3">
          {filtered.map((t) => (
            <Link key={t.id} href={`/library/videos/${t.id}`}>
              <Card className="flex flex-col gap-1.5 p-2">
                <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-gold">
                  {t.format}
                </span>
                <div className="aspect-[9/16] w-full rounded bg-grey-800" />
                <span className="font-display text-sm leading-tight">{t.title}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
