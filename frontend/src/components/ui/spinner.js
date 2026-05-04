import { cn } from "../../lib/utils";

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

function Spinner({ className, label, size = "sm" }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "animate-spin rounded-full border-2 border-ink/20 border-t-brand",
          sizeClasses[size] || sizeClasses.sm
        )}
        aria-hidden="true"
      />
      {label ? <span className="text-sm text-ink/70">{label}</span> : null}
    </span>
  );
}

export { Spinner };
