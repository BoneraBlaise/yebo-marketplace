import axios from "axios";
import { server } from "../config/serverConfig";

const BASE = `${server}/marketplace/trust-buyer-protection`;

export const isTrustFeatureDisabled = (error) =>
  error?.response?.status === 403 &&
  (error?.response?.data?.reason === "FEATURE_DISABLED" ||
    error?.response?.data?.feature);

export const resolveTrustErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.reason ||
  error?.message ||
  "Trust & Buyer Protection request failed";

export const fetchTrustFeatures = async () => {
  const { data } = await axios.get(`${BASE}/features`);
  return data;
};

export const fetchTrustAvailability = async () => {
  try {
    const response = await fetchTrustFeatures();
    const payload = response?.data || response || {};
    const settings = payload.settings || payload;
    return {
      available: settings.enabled !== false,
      settings: payload,
      disabled: false,
    };
  } catch (error) {
    if (isTrustFeatureDisabled(error)) {
      return { available: false, settings: {}, disabled: true };
    }
    return { available: true, settings: {}, disabled: false };
  }
};

export const fetchTrustConfiguration = async () => {
  const { data } = await axios.get(`${BASE}/configuration`, { withCredentials: true });
  return data;
};

export const updateTrustConfiguration = async (payload) => {
  const { data } = await axios.put(`${BASE}/configuration`, payload, { withCredentials: true });
  return data;
};

export const fetchAdminTrustDashboard = async () => {
  const { data } = await axios.get(`${BASE}/admin/dashboard`, { withCredentials: true });
  return data;
};

export const fetchAdminDisputes = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/admin/disputes`, { withCredentials: true, params });
  return data;
};

export const transitionAdminDispute = async (disputeId, payload) => {
  const { data } = await axios.post(`${BASE}/admin/disputes/${disputeId}/transition`, payload, {
    withCredentials: true,
  });
  return data;
};

export const fetchAdminEscrow = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/admin/escrow`, { withCredentials: true, params });
  return data;
};

export const transitionAdminEscrow = async (escrowId, payload) => {
  const { data } = await axios.post(`${BASE}/admin/escrow/${escrowId}/transition`, payload, {
    withCredentials: true,
  });
  return data;
};

export const fetchAdminVerifications = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/admin/verification`, { withCredentials: true, params });
  return data;
};

export const reviewAdminVerification = async (verificationId, decision) => {
  const { data } = await axios.post(
    `${BASE}/admin/verification/${verificationId}/review`,
    { decision },
    { withCredentials: true }
  );
  return data;
};

export const fetchAdminTrustScores = async () => {
  const { data } = await axios.get(`${BASE}/admin/trust-scores`, { withCredentials: true });
  return data;
};

export const fetchAdminFraudAlerts = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/admin/fraud-alerts`, { withCredentials: true, params });
  return data;
};

export const reviewAdminFraudAlert = async (alertId, status) => {
  const { data } = await axios.post(
    `${BASE}/admin/fraud-alerts/${alertId}/review`,
    { status },
    { withCredentials: true }
  );
  return data;
};

export const fetchAdminPolicies = async () => {
  const { data } = await axios.get(`${BASE}/admin/policies`, { withCredentials: true });
  return data;
};

export const updateAdminPolicies = async (payload) => {
  const { data } = await axios.put(`${BASE}/admin/policies`, payload, { withCredentials: true });
  return data;
};
