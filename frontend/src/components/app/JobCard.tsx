import React from "react";
import type { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job_id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (job_id: string, selected: boolean) => void;
  isDemo?: boolean;
}

export function JobCard({
  job,
  onEdit,
  onDelete,
  isSelected = false,
  onToggleSelect,
  isDemo = false,
}: JobCardProps) {
  const initials =
    (job.company || "?")
      .split(/\s+/)
      .slice(0, 2)
      .map(p => p[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card/60 backdrop-blur-sm",
        "shadow-sm hover:shadow-md transition-all duration-200",
        "outline outline-0 outline-primary/30 focus-within:outline-2",
        isSelected && "ring-2 ring-primary/60"
      )}
    >
      {/* top accent bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl bg-gradient-to-r from-primary/60 via-primary/30 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start gap-3 p-4 pb-3">
        <div className="flex flex-col items-center gap-2 pt-0.5">
          <Checkbox
            checked={isSelected}
            onCheckedChange={v => onToggleSelect?.(job.job_id, !!v)}
            disabled={isDemo}
            className="data-[state=checked]:bg-primary"
            aria-label={`Select ${job.company} - ${job.title}`}
          />
          <div
            className={cn(
              "h-10 w-10 rounded-lg bg-gradient-to-br from-muted to-muted/60 text-xs",
              "flex items-center justify-center font-semibold text-muted-foreground ring-1 ring-border/50"
            )}
          >
            {initials}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <h3 className="font-semibold text-sm leading-tight truncate">
                {job.company}
              </h3>
              <p className="text-[13px] text-muted-foreground truncate">
                {job.title}
              </p>
            </div>
            <StatusBadge status={job.status} />
          </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground/90">
              {job.applied_date && (
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  Applied {job.applied_date}
                </span>
              )}
              {/* placeholder for future tags/metadata */}
              {job.status && (
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  {job.status}
                </span>
              )}
            </div>

          {job.notes ? (
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {job.notes}
            </p>
          ) : null}
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(job)}
            disabled={isDemo}
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <span className="sr-only">Edit</span>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(job.job_id)}
            disabled={isDemo}
            className="h-7 w-7 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 dark:hover:bg-red-500/20"
          >
            <span className="sr-only">Delete</span>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* subtle footer zone (future metrics) */}
      <div className="mt-auto flex items-center justify-between px-4 py-2 border-t bg-muted/20 rounded-b-xl">
        <span className="text-[11px] text-muted-foreground">
          ID: {job.job_id.slice(0, 8)}
        </span>
        <span className="text-[11px] text-muted-foreground">
          Updated {/* placeholder; supply updated date if available */}
        </span>
      </div>
    </div>
  );
}
