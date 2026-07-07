import React, { useState } from "react";
import { Card, Tabs, Button, Progress, EmptyState } from "../../../design-system/components";
import { AIJobCard, AIQueueCard } from "../../../design-system/ai";
import { useAIExperiencePlatform } from "../../hooks/useAIExperiencePlatform";
import { sanitizeJob } from "../../utils/providerTransparency";
import { AIStatusBadge, YEBOAIBrand } from "../status/AIStatusComponents";
import { logAIExperienceDiagnostics } from "../../diagnostics/AIExperienceDiagnostics";

const JOB_TABS = ["all", "queued", "running", "completed", "failed", "cancelled"];

export const PreviewJobsPanel = ({ userId = "demo-user" }) => {
  const [tab, setTab] = useState("all");
  const { getJobs } = useAIExperiencePlatform(userId);
  const jobs = getJobs().map(sanitizeJob);

  logAIExperienceDiagnostics("jobs", { count: jobs.length, tab });

  const filtered = tab === "all" ? jobs : jobs.filter((j) => j.status === tab);

  return (
    <section aria-label="Preview jobs">
      <Tabs tabs={JOB_TABS.map((t) => ({ id: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} active={tab} onChange={setTab} />
      <div className="mt-4 space-y-3">
        <AIQueueCard queued={jobs.filter((j) => j.status === "queued").length} running={jobs.filter((j) => j.status === "running").length} />
        {filtered.length ? filtered.map((job) => (
          <Card key={job.id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium">Job {job.id?.slice(0, 8) || "—"}</p>
                <YEBOAIBrand />
              </div>
              <AIStatusBadge status={job.status === "running" ? "processing" : job.status} />
            </div>
            <Progress value={job.progress || 0} />
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="ghost" aria-label="Retry job">Retry</Button>
              <Button size="sm" variant="ghost" aria-label="Cancel job">Cancel</Button>
            </div>
          </Card>
        )) : (
          <EmptyState title="No jobs" description="Preview jobs will appear here when you start a preview." />
        )}
        {!filtered.length && jobs.length === 0 && <AIJobCard jobId="—" status="idle" progress={0} />}
      </div>
    </section>
  );
};

export default PreviewJobsPanel;
