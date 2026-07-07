/** YEBO AI Infrastructure type constants — Phase 8E */

export const ASSET_TYPE = {
  PREVIEW_IMAGE: "preview_image",
  AI_VIDEO: "ai_video",
  BACKGROUND_IMAGE: "background_image",
  GENERATED_DOCUMENT: "generated_document",
};

export const ASSET_STATUS = {
  CREATED: "created",
  ACTIVE: "active",
  EXPIRED: "expired",
  ARCHIVED: "archived",
  DELETED: "deleted",
};

export const JOB_STATUS = {
  QUEUED: "queued",
  RUNNING: "running",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
};

export const LIFECYCLE_STATE = {
  CREATED: "created",
  QUEUED: "queued",
  RUNNING: "running",
  COMPLETED: "completed",
  CACHED: "cached",
  ARCHIVED: "archived",
  DELETED: "deleted",
};

export const STORAGE_PROVIDER = {
  LOCAL: "local",
  SUPABASE: "supabase",
  S3: "s3",
  R2: "r2",
  GCS: "gcs",
  AZURE: "azure",
};

export const NOTIFICATION_CHANNEL = {
  IN_APP: "in_app",
  EMAIL: "email",
  PUSH: "push",
  SMS: "sms",
  WEBHOOK: "webhook",
};

export const ACCESS_ROLE = {
  OWNER: "owner",
  VENDOR: "vendor",
  ORG_ADMIN: "organization_admin",
  CUSTOMER: "customer",
  ADMIN: "admin",
};

export const HISTORY_SCOPE = {
  CUSTOMER: "customer",
  VENDOR: "vendor",
  ORGANIZATION: "organization",
  PREVIEW: "preview",
  GENERATION: "generation",
};

export default {
  ASSET_TYPE,
  ASSET_STATUS,
  JOB_STATUS,
  LIFECYCLE_STATE,
  STORAGE_PROVIDER,
  NOTIFICATION_CHANNEL,
  ACCESS_ROLE,
  HISTORY_SCOPE,
};
