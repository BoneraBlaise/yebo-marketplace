import axios from "axios";
import { getTokenForIdentity } from "./communicationIdentity";
import { getAuthToken, getSellerToken, restoreAuthSessionFromBackup } from "./authStorage";
import { isTokenExpired } from "./authHeaders";

const isCommunicationApiPath = (url = "") =>
  String(url).includes("/marketplace/communication");

const isSellerApiPath = (url = "") => {
  const path = String(url);
  if (!path.includes("/shop/")) return false;
  const userAuthPaths = [
    "/shop/login-shop",
    "/shop/create-shop",
    "/shop/resume-session",
    "/shop/activation/",
    "/shop/get-shop-info/",
    "/shop/get-shop-info",
    "/follow",
    "/favorite",
  ];
  return !userAuthPaths.some((segment) => path.includes(segment));
};

const isMarketplaceOwnerPath = (url = "") => {
  const path = String(url);
  return path.includes("/marketplace/") && path.includes("/owner/");
};

const isSellerProtectedPath = (url = "") => {
  const path = String(url);
  if (isSellerApiPath(path)) return true;
  return (
    path.includes("/create-product") ||
    path.includes("/create-event") ||
    path.includes("/event/create-event")
  );
};

const pickUserToken = () => {
  restoreAuthSessionFromBackup();
  const token = getAuthToken();
  if (!token) return null;
  if (isTokenExpired(token)) return null;
  return token;
};

const pickSellerToken = () => {
  restoreAuthSessionFromBackup();
  const token = getSellerToken();
  if (!token) return null;
  if (isTokenExpired(token)) return null;
  return token;
};

const attachAuthorization = (config, token) => {
  if (!token) return;
  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${token}`;
};

export const setupApiClient = () => {
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common.Accept = "application/json";
  axios.defaults.headers.post["Content-Type"] = "application/json";

  axios.interceptors.request.use((config) => {
    const requestUrl = config.url || "";

    if (isCommunicationApiPath(requestUrl) && config.communicationIdentity) {
      const token = getTokenForIdentity(config.communicationIdentity);
      if (token) attachAuthorization(config, token);
      return config;
    }

    if (isSellerProtectedPath(requestUrl)) {
      const sellerToken = pickSellerToken();
      const userToken = pickUserToken();
      attachAuthorization(config, sellerToken || userToken);
      return config;
    }

    if (isMarketplaceOwnerPath(requestUrl)) {
      const userToken = pickUserToken();
      const sellerToken = pickSellerToken();
      attachAuthorization(config, userToken || sellerToken);
      return config;
    }

    if (isSellerApiPath(requestUrl)) {
      attachAuthorization(config, pickSellerToken() || pickUserToken());
    } else {
      attachAuthorization(config, pickUserToken());
    }

    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        error.authExpired = true;
        if (process.env.NODE_ENV !== "production") {
          console.warn("[setupApiClient] 401", {
            url: error.config?.url,
            hadAuthorization: Boolean(error.config?.headers?.Authorization),
          });
        }
      }
      return Promise.reject(error);
    }
  );
};
