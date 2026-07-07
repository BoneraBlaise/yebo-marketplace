import { JOB_STATUS } from "./InfrastructureTypes";
import { logInfrastructureDiagnostics } from "./InfrastructureDiagnostics";

/** AI Cleanup Service — identifies cleanup candidates, does not auto-delete — Phase 8E */
export class CleanupService {
  constructor({
    assetManager = null,
    jobQueue = null,
    previewCacheManager = null,
  } = {}) {
    this.assets = assetManager;
    this.jobs = jobQueue;
    this.cache = previewCacheManager;
    this.orphanMetadata = [];
  }

  registerOrphanMetadata(entry) {
    this.orphanMetadata.push({
      ...entry,
      registeredAt: new Date().toISOString(),
    });
  }

  findExpiredCache() {
    if (!this.cache?.listExpired) return [];
    return this.cache.listExpired();
  }

  findExpiredAssets() {
    if (!this.assets?.list) return [];
    return this.assets
      .list()
      .filter((a) => this.assets.isExpired(a.assetId))
      .map((a) => ({ assetId: a.assetId, expiresAt: a.expiresAt, type: a.type }));
  }

  findOrphanJobs() {
    if (!this.jobs?.list) return [];
    const terminal = new Set([JOB_STATUS.COMPLETED, JOB_STATUS.FAILED, JOB_STATUS.CANCELLED]);
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return this.jobs
      .list()
      .filter((j) => terminal.has(j.status) && new Date(j.updatedAt).getTime() < cutoff)
      .map((j) => ({ id: j.id, status: j.status, updatedAt: j.updatedAt }));
  }

  findUnusedMetadata() {
    return [...this.orphanMetadata];
  }

  scan() {
    const report = {
      expiredCache: this.findExpiredCache(),
      expiredAssets: this.findExpiredAssets(),
      orphanJobs: this.findOrphanJobs(),
      unusedMetadata: this.findUnusedMetadata(),
      scannedAt: new Date().toISOString(),
    };

    logInfrastructureDiagnostics("cleanup", {
      expiredCache: report.expiredCache.length,
      expiredAssets: report.expiredAssets.length,
      orphanJobs: report.orphanJobs.length,
      unusedMetadata: report.unusedMetadata.length,
    });

    return report;
  }

  /** Cleanup API — returns items to remove; does not delete automatically */
  getCleanupPlan() {
    const scan = this.scan();
    return {
      ...scan,
      actions: [
        ...scan.expiredCache.map((c) => ({ type: "invalidate_cache", key: c.key })),
        ...scan.expiredAssets.map((a) => ({ type: "archive_asset", assetId: a.assetId })),
        ...scan.orphanJobs.map((j) => ({ type: "purge_job", jobId: j.id })),
        ...scan.unusedMetadata.map((m, i) => ({ type: "remove_metadata", index: i, id: m.id })),
      ],
    };
  }
}

export const createCleanupService = (options) => new CleanupService(options);

export default CleanupService;
