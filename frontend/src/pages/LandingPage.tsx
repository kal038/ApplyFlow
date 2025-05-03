import { Button } from "@/components/ui/button";
import { JobTable } from "@/components/app/JobTable";
import type { Job } from "@/types";

export function LandingPage() {
  const demoJobs: Job[] = [
    {
      job_id: "demo-1",
      company: "Acme Corp",
      title: "Full Stack Developer",
      status: "Interview",
      applied_date: "2025-05-01",
      notes: "Second round scheduled",
    },
    {
      job_id: "demo-2",
      company: "TechStart Inc",
      title: "Frontend Engineer",
      status: "Applied",
      applied_date: "2025-04-28",
      notes: "Application submitted",
    },
    {
      job_id: "demo-3",
      company: "Data Systems",
      title: "Software Engineer",
      status: "Awaiting Offer",
      applied_date: "2025-04-15",
      notes: "Reviewing offer letter",
    },
    {
      job_id: "demo-4",
      company: "Metaphoric Inc",
      title: "Software Engineer",
      status: "Offer",
      applied_date: "2025-04-15",
      notes: "Reviewing offer letter",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero section */}
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Track Your Job Search Journey
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-[600px]">
          Organize applications, track progress, take action, and land your
          dream job with ApplyFlow
        </p>
        <Button size="lg" className="text-lg px-8">
          Sign Up Free
        </Button>
      </div>

      {/* Demo table section */}
      <div className="w-full max-w-[1200px] px-4 -mt-6">
        <JobTable
          jobs={demoJobs}
          onEdit={() => {}}
          onDelete={() => {}}
          isDemo={true}
        />
      </div>
    </div>
  );
}
