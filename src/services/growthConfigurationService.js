import axios from "axios";
import { server } from "../config/serverConfig";

const BASE = `${server}/marketplace/growth`;

export const fetchGrowthConfiguration = async () => {
  const { data } = await axios.get(`${BASE}/configuration`, { withCredentials: true });
  return data;
};

export const updateGrowthConfiguration = async (payload, reason = "") => {
  const { data } = await axios.put(
    `${BASE}/configuration`,
    { ...payload, reason: reason || null },
    { withCredentials: true }
  );
  return data;
};

export const fetchGrowthAuditHistory = async (limit = 50) => {
  const { data } = await axios.get(`${BASE}/audit`, {
    withCredentials: true,
    params: { limit },
  });
  return data;
};

export const fetchGrowthFeatures = async () => {
  const { data } = await axios.get(`${BASE}/features`);
  return data;
};

export const validateGrowthCoupon = async (input) => {
  const { data } = await axios.post(`${BASE}/validate-coupon`, input);
  return data?.data || data;
};

export const validateGrowthPromotion = async (input) => {
  const { data } = await axios.post(`${BASE}/validate-promotion`, input);
  return data?.data || data;
};

export const createReferralAttribution = async (payload) => {
  const { data } = await axios.post(`${BASE}/referral/attribution`, payload);
  return data;
};

export const trackReferralClickApi = async (referralCode) => {
  const { data } = await axios.post(`${BASE}/referral/track-click`, { referralCode });
  return data;
};

export const fetchCommissionRules = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/commission-rules`, {
    withCredentials: true,
    params,
  });
  return data;
};

export const createCommissionRule = async (payload) => {
  const { data } = await axios.post(`${BASE}/commission-rules`, payload, { withCredentials: true });
  return data;
};

export const updateCommissionRule = async (id, payload) => {
  const { data } = await axios.put(`${BASE}/commission-rules/${id}`, payload, { withCredentials: true });
  return data;
};

export const deleteCommissionRule = async (id, reason = "") => {
  const { data } = await axios.delete(`${BASE}/commission-rules/${id}`, {
    withCredentials: true,
    data: { reason },
  });
  return data;
};

export const duplicateCommissionRule = async (id) => {
  const { data } = await axios.post(`${BASE}/commission-rules/${id}/duplicate`, {}, { withCredentials: true });
  return data;
};

export const archiveCommissionRule = async (id) => {
  const { data } = await axios.post(`${BASE}/commission-rules/${id}/archive`, {}, { withCredentials: true });
  return data;
};

export const restoreCommissionRule = async (id) => {
  const { data } = await axios.post(`${BASE}/commission-rules/${id}/restore`, {}, { withCredentials: true });
  return data;
};

export const bulkCommissionRuleAction = async (action, ids, reason = "") => {
  const { data } = await axios.post(
    `${BASE}/commission-rules/bulk/${action}`,
    { ids, reason },
    { withCredentials: true }
  );
  return data;
};

export const updateCommissionRulePriorities = async (priorities, reason = "") => {
  const { data } = await axios.put(
    `${BASE}/commission-rules/priorities`,
    { priorities, reason },
    { withCredentials: true }
  );
  return data;
};

export const simulateCommissionRule = async (payload) => {
  const { data } = await axios.post(`${BASE}/commission-rules/simulate`, payload, { withCredentials: true });
  return data;
};

export const fetchCommissionAnalytics = async () => {
  const { data } = await axios.get(`${BASE}/commission-analytics`, { withCredentials: true });
  return data;
};

export const fetchCouponStatistics = async () => {
  const { data } = await axios.get(`${BASE}/coupons/statistics`, { withCredentials: true });
  return data;
};

export const fetchCouponUsage = async (limit = 50) => {
  const { data } = await axios.get(`${BASE}/coupons/usage`, {
    withCredentials: true,
    params: { limit },
  });
  return data;
};
