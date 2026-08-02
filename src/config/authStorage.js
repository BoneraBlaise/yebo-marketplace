import Cookies from "js-cookie";
import {
  backupAuthToken,
  backupSellerToken,
  clearAuthSessionBackup,
  getAuthTokenBackup,
  getSellerTokenBackup,
} from "./authSessionBackup";

const TOKEN_KEY = "token";
const SELLER_TOKEN_KEY = "seller_token";

const decodeJwtPayload = (token) => {
  try {
    const part = String(token).split(".")[1];
    if (!part) return null;
    return JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

export const isStoredTokenExpired = (token, skewMs = 30000) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now() + skewMs;
};

const readToken = (cookieKey, backupGetter, backupSetter) => {
  const fromCookie = Cookies.get(cookieKey);
  if (fromCookie && !isStoredTokenExpired(fromCookie)) return fromCookie;

  const backup = backupGetter();
  if (backup && !isStoredTokenExpired(backup)) {
    Cookies.set(cookieKey, backup, cookieOptions());
    return backup;
  }

  if (fromCookie && !backup) return fromCookie;
  return backup || fromCookie || null;
};

/** Always root path so cookies survive dev host/port changes on same origin */
const cookieOptions = () => ({
  expires: 90,
  path: "/",
  sameSite: "Lax",
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
});

export const getAuthToken = () => readToken(TOKEN_KEY, getAuthTokenBackup, backupAuthToken);

export const setAuthToken = (token) => {
  if (!token) return;
  Cookies.set(TOKEN_KEY, token, cookieOptions());
  backupAuthToken(token);
};

export const clearAuthToken = () => {
  Cookies.remove(TOKEN_KEY, { path: "/" });
};

export const getSellerToken = () => readToken(SELLER_TOKEN_KEY, getSellerTokenBackup, backupSellerToken);

export const setSellerToken = (token) => {
  if (!token) return;
  Cookies.set(SELLER_TOKEN_KEY, token, cookieOptions());
  backupSellerToken(token);
};

export const clearSellerToken = () => {
  Cookies.remove(SELLER_TOKEN_KEY, { path: "/" });
};

export const clearAuthSession = () => {
  clearAuthToken();
  clearSellerToken();
  clearAuthSessionBackup();
};

/** Restore cookies from localStorage backup (call on app boot or before protected API calls) */
export const restoreAuthSessionFromBackup = () => {
  const userBackup = getAuthTokenBackup();
  const sellerBackup = getSellerTokenBackup();
  const cookieUser = Cookies.get(TOKEN_KEY);
  const cookieSeller = Cookies.get(SELLER_TOKEN_KEY);

  if (userBackup && !isStoredTokenExpired(userBackup)) {
    if (!cookieUser || isStoredTokenExpired(cookieUser)) {
      Cookies.set(TOKEN_KEY, userBackup, cookieOptions());
    }
  }
  if (sellerBackup && !isStoredTokenExpired(sellerBackup)) {
    if (!cookieSeller || isStoredTokenExpired(cookieSeller)) {
      Cookies.set(SELLER_TOKEN_KEY, sellerBackup, cookieOptions());
    }
  }
};
