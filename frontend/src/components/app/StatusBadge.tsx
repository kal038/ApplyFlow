import React from "react";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  Applied: "bg-blue-500/10 text-blue-600 dark:text-blue-300 ring-1 ring-blue-500/20",
  Interview: "bg-amber-500/10 text-amber-600 dark:text-amber-300 ring-1 ring-amber-500/20",
  Offer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/20",
  Rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/20",
  "Follow Up": "bg-purple-500/10 text-purple-600 dark:text-purple-300 ring-1 ring-purple-500/20",
  default: "bg-muted/40 text-muted-foreground ring-1 ring-border/40",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.default;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        "select-none backdrop-blur-sm",
        styles,
        className
      )}
    >
      {status}
    </span>
  );
}