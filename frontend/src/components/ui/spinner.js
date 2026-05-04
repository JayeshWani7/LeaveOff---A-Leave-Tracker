import { cn } from "../../lib/utils";

const sizeClasses = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-6 w-6 border-2",
  xl: "h-8 w-8 border-[3px]",
};

/**
 * Spinner — loading indicator component.
 *
 * Props:
 *   size     – "xs" | "sm" (default) | "md" | "lg" | "xl"
 *   label    – optional descriptive text shown next to spinner
 *   overlay  – if true, renders a centred overlay inside the nearest
 *              relative-positioned ancestor; use for card-level loading
 *   className – extra classes for the wrapper
 */
function Spinner({ className, label, size = "sm", overlay = false }) {
  const ring = (
    <span
      className={cn(
        "animate-spin rounded-full border-ink/20 border-t-brand",
        sizeClasses[size] || sizeClasses.sm
      )}
      aria-hidden="true"
    />
  );

  if (overlay) {
    return (
      <div
        role="status"
        aria-label={label || "Loading"}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/70 backdrop-blur-sm"
      >
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-ink/20 border-t-brand" />
        {label ? (
          <span className="text-sm text-ink/60">{label}</span>
        ) : null}
      </div>
    );
  }

  return (
    <span
      role="status"
      aria-label={label || "Loading"}
      className={cn("inline-flex items-center gap-2", className)}
    >
      {ring}
      {label ? <span className="text-sm text-ink/70">{label}</span> : null}
    </span>
  );
}

export { Spinner };

