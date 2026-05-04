import { Badge } from "./badge";

const STATUS_VARIANTS = {
  Approved: "default",
  Rejected: "slate",
  Pending: "amber",
};

function StatusBadge({ status, className }) {
  const normalized = status || "Pending";
  const variant = STATUS_VARIANTS[normalized] || "slate";
  return (
    <Badge variant={variant} className={className}>
      {normalized}
    </Badge>
  );
}

export { StatusBadge };
