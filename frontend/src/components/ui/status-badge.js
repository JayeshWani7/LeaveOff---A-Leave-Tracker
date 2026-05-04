import { Badge } from "./badge";

/**
 * STATUS_MAP defines badge variant + dot color for each leave request status.
 * Rejected → red, Approved → brand green, Pending → amber, others → slate.
 */
const STATUS_MAP = {
  Approved: { variant: "default", dot: "bg-brand" },
  Rejected: { variant: "red", dot: "bg-red-500" },
  Pending: { variant: "amber", dot: "bg-amber-500" },
};

function StatusBadge({ status, className }) {
  const normalized = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "Pending";
  const { variant = "slate", dot = "bg-slate-400" } =
    STATUS_MAP[normalized] || {};
  return (
    <Badge variant={variant} className={`inline-flex items-center gap-1.5 ${className || ""}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {normalized}
    </Badge>
  );
}

export { StatusBadge };

