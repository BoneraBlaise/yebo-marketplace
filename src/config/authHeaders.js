import { getAuthToken, getSellerToken, restoreAuthSessionFromBackup } from "./authStorage";

const decodeJwtPayload = (token) => {
  try {
    const part = token.split(".")[1];
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

/**
 * Resolve a usable access token for API calls.
 * Prefers non-expired user token, then seller token, with localStorage backup restore.
 */
export const resolveAccessToken = ({ preferSeller = false } = {}) => {
  restoreAuthSessionFromBackup();

  const userToken = getAuthToken();
  const sellerToken = getSellerToken();

  const userValid = userToken && !isTokenExpired(userToken) ? userToken : null;
  const sellerValid = sellerToken && !isTokenExpired(sellerToken) ? sellerToken : null;

  if (preferSeller) {
    return sellerValid || userValid || null;
  }
  return userValid || sellerValid || null;
};

export const buildAuthHeaders = (options = {}) => {
  const token = resolveAccessToken(options);
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[authHeaders]", {
      preferSeller: Boolean(options.preferSeller),
      hasToken: Boolean(token),
      tokenPreview: token ? `${token.slice(0, 12)}…` : null,
      userCookie: Boolean(getAuthToken()),
      sellerCookie: Boolean(getSellerToken()),
    });
  }

  return headers;
};

export const assertAuthenticatedRequest = (options = {}) => {
  const token = resolveAccessToken(options);
  if (!token) {
    const error = new Error("Login required. Your session may have expired — please sign in again.");
    error.code = "AUTH_MISSING";
    error.status = 401;
    throw error;
  }
  return token;
};
