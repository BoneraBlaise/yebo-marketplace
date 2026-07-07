import { JOB_STATUS } from "./InfrastructureTypes";
import { logInfrastructureDiagnostics } from "./InfrastructureDiagnostics";

/** AI Job Queue — infrastructure only, no workers — Phase 8E */
export class JobQueue {
  constructor({ maxRetries = 3 } = {}) {
    this.jobs = new Map();
    this.maxRetries = maxRetries;
    this._counter = 0;
  }

  _nextId() {
    this._counter += 1;
    return `job-${Date.now()}-${this._counter}`;
  }

  enqueue({ type, payload = {}, priority = 0, metadata = {} } = {}) {
    const id = this._nextId();
    const job = {
      id,
      type,
      payload,
      priority,
      metadata,
      status: JOB_STATUS.QUEUED,
      progress: 0,
      retryCount: 0,
      maxRetries: this.maxRetries,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      error: null,
    };
    this.jobs.set(id, job);
    logInfrastructureDiagnostics("jobs", { action: "enqueue", id, type, priority });
    return job;
  }

  get(id) {
    return this.jobs.get(id) || null;
  }

  list({ status = null } = {}) {
    let items = [...this.jobs.values()].sort((a, b) => b.priority - a.priority);
    if (status) items = items.filter((j) => j.status === status);
    return items;
  }

  markRunning(id, progress = 0) {
    const job = this.jobs.get(id);
    if (!job) return null;
    job.status = JOB_STATUS.RUNNING;
    job.progress = progress;
    job.startedAt = job.startedAt || new Date().toISOString();
    job.updatedAt = new Date().toISOString();
    return job;
  }

  updateProgress(id, progress) {
    const job = this.jobs.get(id);
    if (!job) return null;
    job.progress = Math.min(100, Math.max(0, progress));
    job.updatedAt = new Date().toISOString();
    return job;
  }

  markCompleted(id, result = null) {
    const job = this.jobs.get(id);
    if (!job) return null;
    job.status = JOB_STATUS.COMPLETED;
    job.progress = 100;
    job.result = result;
    job.completedAt = new Date().toISOString();
    job.updatedAt = job.completedAt;
    logInfrastructureDiagnostics("jobs", { action: "completed", id });
    return job;
  }

  markFailed(id, error = "failed") {
    const job = this.jobs.get(id);
    if (!job) return null;
    job.status = JOB_STATUS.FAILED;
    job.error = typeof error === "string" ? error : error?.message || "failed";
    job.updatedAt = new Date().toISOString();
    logInfrastructureDiagnostics("jobs", { action: "failed", id, error: job.error });
    return job;
  }

  cancel(id) {
    const job = this.jobs.get(id);
    if (!job) return null;
    job.status = JOB_STATUS.CANCELLED;
    job.updatedAt = new Date().toISOString();
    logInfrastructureDiagnostics("jobs", { action: "cancelled", id });
    return job;
  }

  retry(id) {
    const job = this.jobs.get(id);
    if (!job) return null;
    if (job.retryCount >= job.maxRetries) {
      return { ok: false, error: "max_retries_reached", job };
    }
    job.retryCount += 1;
    job.status = JOB_STATUS.QUEUED;
    job.progress = 0;
    job.error = null;
    job.updatedAt = new Date().toISOString();
    logInfrastructureDiagnostics("jobs", { action: "retry", id, retryCount: job.retryCount });
    return { ok: true, job };
  }

  snapshot() {
    const jobs = [...this.jobs.values()];
    return {
      total: jobs.length,
      queued: jobs.filter((j) => j.status === JOB_STATUS.QUEUED).length,
      running: jobs.filter((j) => j.status === JOB_STATUS.RUNNING).length,
      completed: jobs.filter((j) => j.status === JOB_STATUS.COMPLETED).length,
      failed: jobs.filter((j) => j.status === JOB_STATUS.FAILED).length,
    };
  }
}

export const createJobQueue = (options) => new JobQueue(options);

export default JobQueue;
