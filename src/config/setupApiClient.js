import axios from "axios";
import { getTokenForIdentity } from "./communicationIdentity";
import { restoreAuthSessionFromBackup } from "./authStorage";
import { resolveVendorToken } from "./vendorSession";

const isCommunicationApiPath = (url = "") =>
  String(url).includes("/marketplace/communication");

/** All routes that require vendor authentication — single JWT pipeline */
const isVendorApiPath = (url = "") => {
  const path = String(url);
  if (path.includes("/marketplace/") && path.includes("/owner/")) return true;
  if (path.includes("/create-product")) return true;
  if (path.includes("/create-event") || path.includes("/event/create-event")) return true;
  if (path.includes("/create-flashsale")) return true;
  if (path.includes("/create-coupon")) return true;
  if (path.includes("/create-bid")) return true;
  if (path.includes("/create-withdraw")) return true;
  if (path.includes("/marketplace/growth-commerce/vendor/")) return true;
  if (path.includes("/marketplace/seller-operations/vendor/")) return true;
  if (path.includes("/shop/") && !isPublicShopPath(path)) return true;
  return false;
};

const isPublicShopPath = (url = "") => {
  const publicSegments = [
    "/shop/login-shop",
    "/shop/create-shop",
    "/shop/resume-session",
    "/shop/activation/",
    "/shop/get-shop-info/",
    "/shop/get-shop-info",
    "/follow",
    "/favorite",
  ];
  return publicSegments.some((segment) => url.includes(segment));
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
    restoreAuthSessionFromBackup();

    if (isCommunicationApiPath(requestUrl) && config.communicationIdentity) {
      const token = getTokenForIdentity(config.communicationIdentity);
      if (token) attachAuthorization(config, token);
      return config;
    }

    if (isVendorApiPath(requestUrl)) {
      attachAuthorization(config, resolveVendorToken());
      return config;
    }

    attachAuthorization(config, resolveVendorToken());
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
