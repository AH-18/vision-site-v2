// Single source of truth for the rewards/level system.
// Both the Home page's progress card and the Rewards page read from here,
// so they can never drift out of sync.

export const LEVELS = [
  { level: 1, postsRequired: 6, title: "Welcome To The League" },
  { level: 2, postsRequired: 10, title: "1 Month Free" },
  { level: 3, postsRequired: 20, title: "Shoutout On Story" },
  { level: 4, postsRequired: 50, title: "1 Month In Community Free" },
  { level: 5, postsRequired: 80, title: "30-Min Call With Vision" },
] as const;

// Placeholder — swap for the user's real post count once tracking is wired up.
export const POSTS_MADE = 8;

export function getLevelProgress(postsMade: number = POSTS_MADE) {
  const currentLevelIndex = [...LEVELS].reverse().findIndex((l) => postsMade >= l.postsRequired);
  const currentLevel =
    currentLevelIndex === -1 ? null : LEVELS[LEVELS.length - 1 - currentLevelIndex];
  const nextLevel = LEVELS.find((l) => postsMade < l.postsRequired) ?? null;
  const prevThreshold = currentLevel ? currentLevel.postsRequired : 0;
  const percent = nextLevel
    ? Math.round(((postsMade - prevThreshold) / (nextLevel.postsRequired - prevThreshold)) * 100)
    : 100;

  return { postsMade, currentLevel, nextLevel, percent };
}
