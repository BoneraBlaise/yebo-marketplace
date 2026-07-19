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
