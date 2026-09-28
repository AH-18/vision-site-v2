export default function PageHeader({
  title,
  gradientWord,
  subtitle,
}: {
  title: string;
  gradientWord?: string;
  subtitle?: string;
}) {
  return (
    <div className="px-6 pt-2 pb-6">
      <h1 className="font-display text-4xl tracking-wide">
        {title} {gradientWord && <span className="insta-gradient-text">{gradientWord}</span>}
      </h1>
      {subtitle && (
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-grey-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
