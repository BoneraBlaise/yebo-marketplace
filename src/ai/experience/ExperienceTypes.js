/** YEBO Experience Services type constants — Phase 8F */

export const EXPERIENCE_ROLE = {
  CUSTOMER: "customer",
  VENDOR: "vendor",
  ORG_ADMIN: "organization_admin",
  PLATFORM_ADMIN: "platform_admin",
};

export const EXPERIENCE_SURFACE = {
  WEB: "web",
  MOBILE: "mobile",
  DESKTOP: "desktop",
  PUBLIC_API: "public_api",
};

export const CONTRACT_PROTOCOL = {
  REST: "rest",
  GRAPHQL: "graphql",
  RPC: "rpc",
};

export default { EXPERIENCE_ROLE, EXPERIENCE_SURFACE, CONTRACT_PROTOCOL };
