import axios from "axios";
import { getAuthToken, getSellerToken } from "./authStorage";

const isSellerApiPath = (url = "") => {
  const path = String(url);
  return path.includes("/shop/") && !path.includes("/shop/login-shop");
};

export const setupApiClient = () => {
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common.Accept = "application/json";
  axios.defaults.headers.post["Content-Type"] = "application/json";

  axios.interceptors.request.use((config) => {
    const requestUrl = config.url || "";
    const sellerToken = getSellerToken();
    const userToken = getAuthToken();

    if (isSellerApiPath(requestUrl) && sellerToken) {
      config.headers.Authorization = `Bearer ${sellerToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        error.authExpired = true;
      }
      return Promise.reject(error);
    }
  );
};
