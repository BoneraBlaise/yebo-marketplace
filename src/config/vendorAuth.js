/**
 * @deprecated Import from ./vendorSession instead.
 * Re-exports for backward-compatible imports.
 */
export {
  resolveVendorToken,
  buildVendorAuthHeaders,
  assertVendorSession,
  assertVendorAuthenticated,
  hasValidVendorToken,
  isVendorSessionReady,
  syncVendorAuthToken,
  isTokenExpired,
} from "./vendorSession";
