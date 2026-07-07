import { mergeInfrastructureConfig } from "./InfrastructureConfig";
import { createAssetManager } from "./AssetManager";
import { createStorageManager } from "./StorageManager";
import { createJobQueue } from "./JobQueue";
import { createHistoryService } from "./HistoryService";
import { createNotificationHooks } from "./NotificationHooks";
import { createLifecycleManager } from "./LifecycleManager";
import { createPreviewCacheManager } from "./PreviewCacheManager";
import { createAssetAccessControl } from "./AssetAccessControl";
import { createCleanupService } from "./CleanupService";
import { LIFECYCLE_STATE, HISTORY_SCOPE } from "./InfrastructureTypes";
import { logInfrastructureDiagnostics } from "./InfrastructureDiagnostics";

/** YEBO AI Infrastructure — main orchestrator — Phase 8E */
export class InfrastructureEngine {
  constructor({ config = null, commercePreviewCache = null } = {}) {
    this.config = mergeInfrastructureConfig(config);

    this.assets = createAssetManager({ defaultTtlMs: this.config.assetDefaultTtlMs });
    this.storage = createStorageManager({
      config: this.config,
      activeProvider: this.config.storageProvider,
    });
    this.jobs = createJobQueue({ maxRetries: this.config.jobMaxRetries });
    this.history = createHistoryService({ pageSize: this.config.historyPageSize });
    this.notifications = createNotificationHooks();
    this.lifecycle = createLifecycleManager();
    this.previewCache = createPreviewCacheManager({
      ttlMs: this.config.previewCacheTtlMs,
      commerceCache: commercePreviewCache,
    });
    this.access = createAssetAccessControl();
    this.cleanup = createCleanupService({
      assetManager: this.assets,
      jobQueue: this.jobs,
      previewCacheManager: this.previewCache,
    });

    this._initialized = false;
  }

  initialize() {
    this._initialized = true;
    logInfrastructureDiagnostics("infrastructure", { action: "initialized" });
    return this.getSnapshot();
  }

  createAsset(params) {
    const asset = this.assets.create(params);
    this.lifecycle.init(asset.assetId, LIFECYCLE_STATE.CREATED);
    this.access.setPolicy(asset.assetId, {
      owner: params.owner,
      organization: params.organization,
      vendor: params.metadata?.vendorId || null,
    });
    this.history.record({
      scope: HISTORY_SCOPE.GENERATION,
      actorId: params.owner,
      organizationId: params.organization,
      feature: params.feature,
      action: "asset_created",
      metadata: { assetId: asset.assetId, type: params.type },
    });
    return asset;
  }

  enqueueJob(params) {
    const job = this.jobs.enqueue(params);
    if (params.entityId) {
      this.lifecycle.transition(params.entityId, LIFECYCLE_STATE.QUEUED);
    }
    this.notifications.emitAll({ type: "job_enqueued", jobId: job.id });
    this.history.record({
      scope: HISTORY_SCOPE.GENERATION,
      action: "job_enqueued",
      metadata: { jobId: job.id, type: params.type },
    });
    return job;
  }

  lookupPreviewCache(params) {
    const result = this.previewCache.lookup(params);
    if (result.hit && params.entityId) {
      this.lifecycle.transition(params.entityId, LIFECYCLE_STATE.CACHED);
    }
    return result;
  }

  getSnapshot() {
    return {
      initialized: this._initialized,
      assets: this.assets.snapshot(),
      storage: { activeProvider: this.storage.activeProviderId, providers: this.storage.listProviders() },
      jobs: this.jobs.snapshot(),
      previewCache: this.previewCache.snapshot(),
      cleanup: this.cleanup.scan(),
    };
  }
}

export const createInfrastructureEngine = (options) => new InfrastructureEngine(options);

export default InfrastructureEngine;
