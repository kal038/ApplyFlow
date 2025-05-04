import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { JobTable } from "@/components/app/JobTable";
import { useNavigate } from "react-router-dom";
export function LandingPage() {
    const navigate = useNavigate();
    const demoJobs = [
        {
            job_id: "demo-1",
            company: "Acme Corp",
            title: "Full Stack Developer",
            status: "Interview",
            applied_date: "2025-05-01",
            notes: "Application submitted",
        },
        {
            job_id: "demo-2",
            company: "TechStart Inc",
            title: "Frontend Engineer",
            status: "Applied",
            applied_date: "2025-04-28",
            notes: "Interview Scheduled",
        },
        {
            job_id: "demo-3",
            company: "Data Systems",
            title: "Software Engineer",
            status: "Follow Up",
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
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[50vh] text-center px-4", children: [_jsx("h1", { className: "text-4xl md:text-6xl font-bold mb-6", children: "Track Your Job Search Journey" }), _jsx("p", { className: "text-lg md:text-xl text-muted-foreground mb-8 max-w-[600px]", children: "Organize applications, track progress, take action, and land your dream job with ApplyFlow" }), _jsx(Button, { size: "lg", className: "text-lg px-8", onClick: () => navigate("/signup"), children: "Sign Up Free" })] }), _jsx("div", { className: "w-full max-w-[1200px] px-4 -mt-6", children: _jsx(JobTable, { jobs: demoJobs, onEdit: () => { }, onDelete: () => { }, isDemo: true }) })] }));
}
