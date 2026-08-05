/**
 * Single vendor authentication source of truth.
 *
 * Rule: isVendorReady === true ONLY when ALL of:
 *   1. Valid readable user JWT (cookie `token`)
 *   2. Redux user.isAuthenticated
 *   3. Redux seller.isSeller (linked Shop profile)
 *
 * No module may gate vendor ops differently.
 */
import {
  getAuthToken,
  restoreAuthSessionFromBackup,
  setAuthToken,
} from "./authStorage";

const decodeJwtPayload = (token) => {
  try {
    const part = String(token).split(".")[1];
    if (!part) return null;
    return JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token, skewMs = 30000) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now() + skewMs;
};

/** Sync readable token after login or getuser — keeps js-cookie in sync with HttpOnly session */
export const syncVendorAuthToken = (token) => {
  if (!token || isTokenExpired(token)) return false;
  setAuthToken(token);
  return true;
};

/** Resolve the single vendor JWT used for ALL marketplace operations */
export const resolveVendorToken = () => {
  restoreAuthSessionFromBackup();
  const token = getAuthToken();
  if (!token || isTokenExpired(token)) return null;
  return token;
};

export const hasValidVendorToken = () => Boolean(resolveVendorToken());

export const buildVendorAuthHeaders = () => {
  const token = resolveVendorToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const assertVendorSession = () => {
  const token = resolveVendorToken();
  if (!token) {
    const error = new Error("Login required. Your session may have expired — please sign in again.");
    error.code = "AUTH_MISSING";
    error.status = 401;
    throw error;
  }
  return token;
};

/**
 * Unified vendor-ready check — use in hooks, routes, and wizards.
 * @param {{ isAuthenticated?: boolean, isVendor?: boolean }} redux
 */
export const isVendorSessionReady = (redux = {}) => {
  const isAuthenticated = Boolean(redux.isAuthenticated);
  const isVendor = Boolean(redux.isVendor);
  const hasToken = hasValidVendorToken();
  return isAuthenticated && isVendor && hasToken;
};

/** @deprecated Use assertVendorSession */
export const assertVendorAuthenticated = assertVendorSession;
