import axios from "axios";
import { appOrigin, server } from "./serverConfig";
import { clearAuthSession } from "./authStorage";

export const buildGoogleAuthUrl = () => {
  const redirect = `${appOrigin}/login-success`;
  const params = new URLSearchParams({ redirect });
  return `${server}/auth/google?${params.toString()}`;
};

export const logoutUser = async () => {
  try {
    await axios.get(`${server}/user/logout`, { withCredentials: true });
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
  } finally {
    clearAuthSession();
  }
};

export const getAuthErrorMessage = (error, fallback = "Request failed") => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallback;
};

export const formatAxiosErrorDetails = (error) => ({
  message: error?.message ?? null,
  code: error?.code ?? null,
  responseStatus: error?.response?.status ?? null,
  responseData: error?.response?.data ?? null,
  requestUrl: error?.config?.url ?? null,
  requestMethod: error?.config?.method ?? null,
  hasResponse: Boolean(error?.response),
  hasRequest: Boolean(error?.request),
});

export const describeAxiosFailure = (error) => {
  const details = formatAxiosErrorDetails(error);
  const parts = [
    details.message,
    details.code ? `code=${details.code}` : null,
    details.requestMethod && details.requestUrl
      ? `${String(details.requestMethod).toUpperCase()} ${details.requestUrl}`
      : null,
    details.responseStatus ? `status=${details.responseStatus}` : "status=none",
    details.responseData?.message ? `api=${details.responseData.message}` : null,
  ].filter(Boolean);
  return parts.join(" | ");
};
