import Cookies from "js-cookie";

const TOKEN_KEY = "token";
const SELLER_TOKEN_KEY = "seller_token";

const cookiePath = () => {
  const publicUrl = process.env.PUBLIC_URL || "/";
  if (!publicUrl || publicUrl === "/") return "/";
  return publicUrl.replace(/\/$/, "") || "/";
};

const cookieOptions = () => ({
  expires: 90,
  path: cookiePath(),
  sameSite: "Lax",
  secure:
    typeof window !== "undefined" && window.location.protocol === "https:",
});

export const getAuthToken = () => Cookies.get(TOKEN_KEY) || null;

export const setAuthToken = (token) => {
  if (!token) return;
  Cookies.set(TOKEN_KEY, token, cookieOptions());
};

export const clearAuthToken = () => {
  Cookies.remove(TOKEN_KEY, { path: cookiePath() });
};

export const getSellerToken = () => Cookies.get(SELLER_TOKEN_KEY) || null;

export const setSellerToken = (token) => {
  if (!token) return;
  Cookies.set(SELLER_TOKEN_KEY, token, cookieOptions());
};

export const clearSellerToken = () => {
  Cookies.remove(SELLER_TOKEN_KEY, { path: cookiePath() });
};

export const clearAuthSession = () => {
  clearAuthToken();
  clearSellerToken();
};
