import { cn } from "../../lib/utils";

/**
 * ErrorBanner — accessible, dismissible error message component.
 * Use instead of plain <p className="text-red-600"> for consistency.
 */
function ErrorBanner({ message, onDismiss, className }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-slideUp",
        className
      )}
    >
      <span className="mt-0.5 flex-shrink-0 text-red-500" aria-hidden="true">
        ⚠
      </span>
      <p className="flex-1 leading-relaxed">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="ml-auto flex-shrink-0 rounded-full p-0.5 text-red-400 transition hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

export { ErrorBanner };
