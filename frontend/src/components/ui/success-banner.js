import { cn } from "../../lib/utils";

/**
 * SuccessBanner — accessible success feedback component.
 */
function SuccessBanner({ message, onDismiss, className }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 animate-slideUp",
        className
      )}
    >
      <span className="mt-0.5 flex-shrink-0 text-emerald-500" aria-hidden="true">
        ✓
      </span>
      <p className="flex-1 leading-relaxed">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="ml-auto flex-shrink-0 rounded-full p-0.5 text-emerald-400 transition hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

export { SuccessBanner };
