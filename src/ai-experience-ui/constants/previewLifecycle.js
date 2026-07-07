/** Preview lifecycle stages — Phase 8H.5 */

export const PREVIEW_LIFECYCLE = [
  { id: "ready", label: "Ready" },
  { id: "permission_check", label: "Permission Check" },
  { id: "subscription_check", label: "Subscription Check" },
  { id: "credits_check", label: "Credits Check" },
  { id: "job_created", label: "Job Created" },
  { id: "queued", label: "Queued" },
  { id: "running", label: "Running" },
  { id: "progress", label: "Progress" },
  { id: "completed", label: "Completed" },
  { id: "failed", label: "Failed" },
  { id: "retry", label: "Retry" },
  { id: "asset_stored", label: "Asset Stored" },
  { id: "history_updated", label: "History Updated" },
  { id: "analytics_updated", label: "Analytics Updated" },
];

export const mapStatusToLifecycleIndex = (status = "ready") => {
  const map = {
    created: 0, ready: 0, orchestrated: 4, queued: 5, running: 6, progress: 7,
    completed: 8, failed: 9, retry: 10, stored: 11,
  };
  return map[status] ?? 0;
};

export default PREVIEW_LIFECYCLE;
