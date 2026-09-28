export default function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-grey-800">
      <div
        className="h-full insta-gradient-bg transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
