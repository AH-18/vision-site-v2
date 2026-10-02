"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import FilterChip from "@/components/FilterChip";
import Card from "@/components/Card";

// Placeholder data — swap for real template records once the DB is wired up.
const TYPE_FILTERS = ["All", "B-Roll", "Talking", "Carousel", "Voiceover", "Green Screen"];
const STYLE_FILTERS = ["All", "Educational", "Nurturing", "Storytelling", "Entertaining"];

const TEMPLATES = [
  { id: 1, type: "B-Roll", style: "Nurturing", title: "Trend #30", date: "Sep 30" },
  { id: 2, type: "Talking", style: "Educational", title: "Trend #29", date: "Sep 29" },
  { id: 3, type: "Carousel", style: "Storytelling", title: "Trend #28", date: "Sep 28" },
  { id: 4, type: "B-Roll", style: "Entertaining", title: "Trend #27", date: "Sep 27" },
];

export default function LibraryVideosPage() {
  const [type, setType] = useState("All");
  const [style, setStyle] = useState("All");

  const filtered = TEMPLATES.filter(
    (t) => (type === "All" || t.type === type) && (style === "All" || t.style === style)
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

      <div className="mt-6 grid grid-cols-2 gap-4 px-6">
        {filtered.map((t) => (
          <Card key={t.id} className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
              {t.type}
            </span>
            <div className="aspect-[9/16] w-full rounded bg-grey-800" />
            <span className="font-display text-lg">{t.title}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-grey-500">
              {t.date} · {t.style}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
