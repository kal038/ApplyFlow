import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Job, JobStatus } from "@/types";

/*
Used for adding and editing job entries in the Job Table.
This modal is displayed when the user clicks on the "Add Job" or "Edit" button.
*/

interface JobFormModalProps {
  job: Partial<Job>;
  onSave: (job: Partial<Job>) => void;
  onCancel: () => void;
}

export function JobFormModal({ job, onSave, onCancel }: JobFormModalProps) {
  const [formData, setFormData] = useState<Partial<Job>>(job);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Define available job statuses
  const statuses: JobStatus[] = [
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
    "Wishlisted",
    "Archived",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {job.job_id ? "Edit Job" : "Add New Job"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={formData.company || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Position Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status || "Applied"}
              onChange={handleChange}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applied_date">Applied Date</Label>
            <Input
              id="applied_date"
              name="applied_date"
              type="date"
              value={formData.applied_date || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {job.job_id ? "Update Job" : "Add Job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
