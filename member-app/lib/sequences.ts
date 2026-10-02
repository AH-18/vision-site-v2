// Single source of truth for the 6 Sequences (goal-based content paths).
// Mirrors the sequence ids used in lib/brandProfile.ts's SEQUENCE_QUESTION_MAP
// so suggestions on a sequence's detail page stay tied to the right questions.

import type { SequenceId } from "./brandProfile";

export interface Sequence {
  id: SequenceId;
  title: string;
  goal: string;
  description: string;
}

export const SEQUENCES: Sequence[] = [
  {
    id: "first-8-posts",
    title: "Your First 8 Posts",
    goal: "Get started",
    description: "A curated starter set to post your first week without overthinking it.",
  },
  {
    id: "top-of-funnel",
    title: "Top of Funnel",
    goal: "Reach new people",
    description:
      "Hook-driven content built to get discovered by people who don't know you yet.",
  },
  {
    id: "middle-of-funnel",
    title: "Middle of Funnel",
    goal: "Build trust",
    description: "Nurture content that turns new followers into people who trust you.",
  },
  {
    id: "bottom-of-funnel",
    title: "Bottom of Funnel",
    goal: "Generate sales",
    description: "Sales-focused content for followers who are ready to buy.",
  },
  {
    id: "trial-reels",
    title: "Trial Reels",
    goal: "Attract your ideal follower",
    description: "Low-lift reels to test what resonates with your ideal audience.",
  },
  {
    id: "introduce-yourself",
    title: "Introduce Yourself",
    goal: "Put a face to the brand",
    description: "A couple of posts to introduce who you are and why you do this.",
  },
];

export function getSequenceById(id: string): Sequence | undefined {
  return SEQUENCES.find((s) => s.id === id);
}
