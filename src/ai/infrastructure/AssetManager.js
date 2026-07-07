import { ASSET_STATUS } from "./InfrastructureTypes";
import { logInfrastructureDiagnostics } from "./InfrastructureDiagnostics";

/** AI Asset Manager — Phase 8E */
export class AssetManager {
  constructor({ defaultTtlMs = null } = {}) {
    this.assets = new Map();
    this.defaultTtlMs = defaultTtlMs;
    this._counter = 0;
  }

  _nextId() {
    this._counter += 1;
    return `asset-${Date.now()}-${this._counter}`;
  }

  create({
    type,
    owner,
    organization = null,
    provider = null,
    feature = null,
    metadata = {},
    expiresAt = null,
    ttlMs = this.defaultTtlMs,
  } = {}) {
    const assetId = this._nextId();
    const createdAt = new Date().toISOString();
    const expiry = expiresAt || (ttlMs ? new Date(Date.now() + ttlMs).toISOString() : null);

    const asset = {
      assetId,
      type,
      owner,
      organization,
      createdAt,
      expiresAt: expiry,
      status: ASSET_STATUS.CREATED,
      provider,
      feature,
      metadata,
    };

    this.assets.set(assetId, asset);
    logInfrastructureDiagnostics("assets", { action: "create", assetId, type });
    return asset;
  }

  get(assetId) {
    return this.assets.get(assetId) || null;
  }

  update(assetId, patch = {}) {
    const asset = this.assets.get(assetId);
    if (!asset) return null;
    const updated = { ...asset, ...patch, assetId };
    this.assets.set(assetId, updated);
    return updated;
  }

  setStatus(assetId, status) {
    return this.update(assetId, { status });
  }

  list({ owner = null, organization = null, type = null, status = null } = {}) {
    let items = [...this.assets.values()];
    if (owner) items = items.filter((a) => a.owner === owner);
    if (organization) items = items.filter((a) => a.organization === organization);
    if (type) items = items.filter((a) => a.type === type);
    if (status) items = items.filter((a) => a.status === status);
    return items;
  }

  isExpired(assetId) {
    const asset = this.get(assetId);
    if (!asset?.expiresAt) return false;
    return Date.now() > new Date(asset.expiresAt).getTime();
  }

  snapshot() {
    return { count: this.assets.size };
  }
}

export const createAssetManager = (options) => new AssetManager(options);

export default AssetManager;
