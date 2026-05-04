import { cn } from "../../lib/utils";

function EmptyState({ title, description, className }) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-ink/10 bg-white/60 p-6 text-center", className)}>
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description ? <p className="mt-2 text-xs text-ink/60">{description}</p> : null}
    </div>
  );
}

export { EmptyState };
