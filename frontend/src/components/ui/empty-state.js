import { cn } from "../../lib/utils";

/**
 * EmptyState — shown when a list or section has no data.
 *
 * Props:
 *   icon        – optional emoji or JSX icon element
 *   title       – required short headline
 *   description – optional supporting text
 *   action      – optional JSX (e.g. a Button) rendered below the text
 *   className   – additional wrapper classes
 */
function EmptyState({ icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-ink/10 bg-white/50 px-6 py-10 text-center animate-fadeIn",
        className
      )}
    >
      {icon ? (
        <span className="mb-4 text-3xl" aria-hidden="true">
          {icon}
        </span>
      ) : (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink/5 text-xl" aria-hidden="true">
          📭
        </span>
      )}
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-2 max-w-xs text-xs leading-relaxed text-ink/60">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export { EmptyState };

