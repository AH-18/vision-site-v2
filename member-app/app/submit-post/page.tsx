"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { SEQUENCES } from "@/lib/sequences";
import { getLevelProgress } from "@/lib/levels";

export default function SubmitPostPage() {
  const { currentLevel, nextLevel } = getLevelProgress();
  const [link, setLink] = useState("");
  const [template, setTemplate] = useState("");

  return (
    <div className="px-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/rewards"
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-grey-700 text-grey-300 transition-colors hover:border-gold hover:text-white"
        >
          &lt;
        </Link>
        <h1 className="font-display text-3xl tracking-wide">
          Share Your <span className="insta-gradient-text">Post</span> With Us
        </h1>
      </div>

      <Card className="mb-6 border-l-2 border-l-gold">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-grey-300">
          {currentLevel ? `Level ${currentLevel.level}` : "No Level"}
        </span>
        <p className="mt-1 text-base text-grey-200">
          {nextLevel
            ? `Share your first post to unlock "${nextLevel.title}"`
            : "You've unlocked every level — keep posting."}
        </p>
      </Card>

      <Card className="mb-4">
        <label className="mb-3 flex items-center gap-2 font-display text-2xl text-white">
          Instagram Post Link <span className="text-gold">🔗</span>
        </label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://www.instagram.com/reel/"
          className="w-full rounded border border-grey-700 bg-black px-4 py-3 text-base text-grey-100 placeholder:text-grey-500 focus:border-gold focus:outline-none"
        />
        <p className="mt-2 text-sm text-grey-400">
          Make sure your post is public so we can view it.
        </p>
      </Card>

      <Card className="mb-8">
        <label className="mb-3 block font-display text-2xl text-white">
          Choose The Template That You Used
        </label>
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="w-full rounded border border-grey-700 bg-black px-4 py-3 text-base text-grey-100 focus:border-gold focus:outline-none"
        >
          <option value="" className="bg-black text-grey-400">
            Select the template you used
          </option>
          {SEQUENCES.map((s) => (
            <option key={s.id} value={s.id} className="bg-black text-grey-100">
              {s.title}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-grey-400">
          Please allow 5-7 business days for your submission to be reviewed.
        </p>
      </Card>

      <button className="mx-auto mb-6 block w-full max-w-sm rounded-full border-2 border-gold bg-transparent py-3 text-center font-mono text-sm uppercase tracking-[0.2em] text-white transition-all duration-200 hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(225,48,108,0.45)] active:scale-95 active:bg-gold/20">
        Submit Post
      </button>
    </div>
  );
}
