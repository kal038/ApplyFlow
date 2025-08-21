import React from "react";
import type { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash } from "lucide-react";

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
  return (
    <div className="bg-card border rounded-md p-4 flex flex-col justify-between shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(v) => onToggleSelect?.(job.job_id, !!v)}
            disabled={isDemo}
            className="translate-y-0"
            aria-label={`Select ${job.company} - ${job.title}`}
          />
          <div>
            <h3 className="font-semibold text-sm">{job.company}</h3>
            <p className="text-sm text-muted-foreground">{job.title}</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                {job.status}
              </span>
              <span className="text-muted-foreground">{job.applied_date}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(job)}
            disabled={isDemo}
          >
            <span className="sr-only">Edit</span>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(job.job_id)}
            disabled={isDemo}
            className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
          >
            <span className="sr-only">Delete</span>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {job.notes ? (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
          {job.notes}
        </p>
      ) : null}
    </div>
  );
}
