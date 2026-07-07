/** AI status types — Phase 8H.5 */

export const AI_STATUS = {
  IDLE: "idle",
  PREPARING: "preparing",
  QUEUED: "queued",
  PROCESSING: "processing",
  OPTIMIZING: "optimizing",
  SAVING: "saving",
  COMPLETED: "completed",
  FAILED: "failed",
  RETRYING: "retrying",
};

export const AI_STATUS_LABELS = {
  idle: "Idle",
  preparing: "Preparing",
  queued: "Queued",
  processing: "Processing",
  optimizing: "Optimizing",
  saving: "Saving",
  completed: "Completed",
  failed: "Failed",
  retrying: "Retrying",
};

export const AI_STATUS_VARIANT = {
  idle: "default",
  preparing: "default",
  queued: "warning",
  processing: "default",
  optimizing: "default",
  saving: "default",
  completed: "success",
  failed: "error",
  retrying: "warning",
};

export default AI_STATUS;
