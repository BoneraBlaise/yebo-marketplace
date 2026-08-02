/** localStorage mirror for auth tokens — survives cookie path/host quirks in dev */
const USER_TOKEN_KEY = "yebone_auth_token_v1";
const SELLER_TOKEN_KEY = "yebone_seller_token_v1";

const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    /* ignore quota / private mode */
  }
};

export const backupAuthToken = (token) => safeSet(USER_TOKEN_KEY, token || null);
export const getAuthTokenBackup = () => safeGet(USER_TOKEN_KEY);
export const backupSellerToken = (token) => safeSet(SELLER_TOKEN_KEY, token || null);
export const getSellerTokenBackup = () => safeGet(SELLER_TOKEN_KEY);
export const clearAuthSessionBackup = () => {
  safeSet(USER_TOKEN_KEY, null);
  safeSet(SELLER_TOKEN_KEY, null);
};
