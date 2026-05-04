import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-brand-soft text-brand-dark",
        amber: "bg-amber-100 text-amber-900",
        slate: "bg-slate-100 text-slate-700",
        red: "bg-red-100 text-red-700",
        rose: "bg-rose-100 text-rose-700",
        sky: "bg-sky-100 text-sky-700",
        violet: "bg-violet-100 text-violet-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
