import {
  createCustomerDTO,
  createPreviewDTO,
  createHistoryDTO,
  createJobDTO,
  createAssetDTO,
} from "./ExperienceDTOs";
import { buildPreviewViewModel, buildHistoryViewModel } from "./ViewModels";
import { logExperienceDiagnostics } from "./ExperienceDiagnostics";

/** Customer Experience Service — Phase 8F */
export class CustomerExperienceService {
  constructor({ infrastructure = null, commerce = null, permissions = null } = {}) {
    this.infrastructure = infrastructure;
    this.commerce = commerce;
    this.permissions = permissions;
    this.sessions = new Map();
  }

  _check(permission, userId) {
    return this.permissions?.check({
      role: "customer",
      permission,
      userId,
    }) || { allowed: true };
  }

  createPreviewSession({ userId, ai_preview_type, productId, inputs = {} } = {}) {
    this._check("preview:read", userId);
    const sessionId = `session-${Date.now()}`;
    const session = createPreviewDTO({
      sessionId,
      ai_preview_type,
      progress: 0,
      status: "created",
      metadata: { productId, inputs, userId },
    });
    this.sessions.set(sessionId, session);

    if (this.commerce?.previewOrchestrator) {
      const orchestration = this.commerce.previewOrchestrator.orchestrate({
        vendorId: "customer",
        ai_preview_type,
        productId,
        inputs,
      });
      session.status = orchestration.ok ? "orchestrated" : "failed";
      session.metadata.orchestration = orchestration;
    }

    logExperienceDiagnostics("service", { service: "customer", action: "createPreviewSession", sessionId });
    return session;
  }

  getPreviewSessions(userId) {
    this._check("preview:read", userId);
    const sessions = [...this.sessions.values()].filter(
      (s) => s.metadata?.userId === userId
    );
    return createCustomerDTO({ userId, previewSessions: sessions });
  }

  getPreviewProgress(sessionId, userId) {
    this._check("preview:read", userId);
    const session = this.sessions.get(sessionId) || createPreviewDTO({ sessionId, status: "unknown" });

    if (this.infrastructure?.jobs) {
      const jobs = this.infrastructure.jobs.list();
      const related = jobs.find((j) => j.metadata?.sessionId === sessionId);
      if (related) {
        session.progress = related.progress;
        session.status = related.status;
      }
    }

    const dto = createPreviewDTO(session);
    logExperienceDiagnostics("dto", { type: "preview", sessionId });
    return { dto, viewModel: buildPreviewViewModel(dto) };
  }

  getPreviewHistory(userId, options = {}) {
    this._check("preview:history", userId);
    const history = this.infrastructure?.history?.getPreviewHistory(options)
      || { items: [], pagination: {} };
    const dto = createHistoryDTO(history);
    logExperienceDiagnostics("dto", { type: "history", count: dto.items.length });
    return { dto, viewModel: buildHistoryViewModel(dto) };
  }

  getGeneratedAssets(userId) {
    this._check("asset:read", userId);
    const assets = (this.infrastructure?.assets?.list({ owner: userId }) || []).map((a) =>
      createAssetDTO({
        assetId: a.assetId,
        assetType: a.type,
        owner: a.owner,
        organization: a.organization,
        status: a.status,
        provider: a.provider,
        feature: a.feature,
        metadata: a.metadata,
      })
    );
    return createCustomerDTO({ userId, assets });
  }

  getJobStatus(jobId, userId) {
    this._check("job:read", userId);
    const job = this.infrastructure?.jobs?.get(jobId);
    const dto = job
      ? createJobDTO(job)
      : createJobDTO({ id: jobId, type: "unknown", status: "not_found" });
    return dto;
  }

  getAssetDownload(assetId, userId) {
    this._check("asset:download", userId);
    const access = this.infrastructure?.access?.canAccess({ assetId, userId, role: "customer" });
    if (access && !access.allowed) return { ok: false, error: access.reason };

    const asset = this.infrastructure?.assets?.get(assetId);
    return {
      ok: Boolean(asset),
      assetId,
      downloadUrl: asset ? `/api/assets/${assetId}/download` : null,
      metadata: asset?.metadata || {},
    };
  }

  getAssetSharing(assetId, userId) {
    this._check("asset:read", userId);
    const asset = this.infrastructure?.assets?.get(assetId);
    return {
      assetId,
      shareable: Boolean(asset),
      sharing: {
        link: asset ? `/share/preview/${assetId}` : null,
        expiresAt: asset?.expiresAt || null,
        owner: asset?.owner || null,
      },
    };
  }
}

export const createCustomerExperienceService = (options) => new CustomerExperienceService(options);

export default CustomerExperienceService;
