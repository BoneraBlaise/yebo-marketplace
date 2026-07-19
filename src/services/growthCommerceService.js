import axios from "axios";
import { server } from "../config/serverConfig";
import {
  isGrowthCommerceFeatureDisabled,
  resolveGrowthCommerceErrorMessage,
} from "../components/GrowthCommerce/growthCommerceHelpers";

const BASE = `${server}/marketplace/growth-commerce`;

export { isGrowthCommerceFeatureDisabled, resolveGrowthCommerceErrorMessage };

export const fetchGrowthCommerceFeatures = async () => {
  const { data } = await axios.get(`${BASE}/features`);
  return data;
};

export const fetchGrowthCommerceAvailability = async () => {
  try {
    const response = await fetchGrowthCommerceFeatures();
    const settings = response?.data || response || {};
    const toggles = Object.entries(settings).filter(([key]) => key !== "enabled");
    const hasEnabledFeature =
      settings.enabled !== false &&
      toggles.some(([, value]) => value?.enabled !== false);
    return { available: hasEnabledFeature, settings, disabled: false };
  } catch (error) {
    if (isGrowthCommerceFeatureDisabled(error)) {
      return { available: false, settings: {}, disabled: true };
    }
    return { available: true, settings: {}, disabled: false };
  }
};

export const fetchPublicHomepage = async () => {
  const { data } = await axios.get(`${BASE}/homepage`);
  return data?.data || data;
};

export const fetchGrowthCommerceConfiguration = async () => {
  const { data } = await axios.get(`${BASE}/configuration`, { withCredentials: true });
  return data;
};

export const updateGrowthCommerceConfiguration = async (settings) => {
  const { data } = await axios.put(`${BASE}/configuration`, { settings }, { withCredentials: true });
  return data;
};

export const fetchAdminHomepageSections = async () => {
  const { data } = await axios.get(`${BASE}/admin/homepage`, { withCredentials: true });
  return data;
};

export const updateAdminHomepageSections = async (sections) => {
  const { data } = await axios.put(`${BASE}/admin/homepage`, { sections }, { withCredentials: true });
  return data;
};

export const fetchAdminMarketingDashboard = async () => {
  const { data } = await axios.get(`${BASE}/admin/dashboard`, { withCredentials: true });
  return data;
};

export const fetchAdminCampaigns = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/admin/campaigns`, {
    withCredentials: true,
    params,
  });
  return data;
};

export const fetchAdminAmbassadors = async () => {
  const { data } = await axios.get(`${BASE}/admin/ambassadors`, { withCredentials: true });
  return data;
};

export const upsertAdminAmbassador = async (userId, payload) => {
  const { data } = await axios.put(`${BASE}/admin/ambassadors/${userId}`, payload, {
    withCredentials: true,
  });
  return data;
};

export const fetchVendorCampaigns = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/vendor/campaigns`, {
    withCredentials: true,
    params,
  });
  return data;
};

export const createVendorCampaign = async (payload) => {
  const { data } = await axios.post(`${BASE}/vendor/campaigns`, payload, { withCredentials: true });
  return data;
};

export const updateVendorCampaign = async (campaignId, payload) => {
  const { data } = await axios.put(`${BASE}/vendor/campaigns/${campaignId}`, payload, {
    withCredentials: true,
  });
  return data;
};

export const updateVendorCampaignStatus = async (campaignId, status) => {
  const { data } = await axios.post(
    `${BASE}/vendor/campaigns/${campaignId}/status`,
    { status },
    { withCredentials: true }
  );
  return data;
};

export const duplicateVendorCampaign = async (campaignId) => {
  const { data } = await axios.post(
    `${BASE}/vendor/campaigns/${campaignId}/duplicate`,
    {},
    { withCredentials: true }
  );
  return data;
};

export const fetchVendorMarketingDashboard = async () => {
  const { data } = await axios.get(`${BASE}/vendor/dashboard`, { withCredentials: true });
  return data;
};

export const validateGrowthCommercePromotion = async (input) => {
  const { data } = await axios.post(`${BASE}/promotions/validate`, input);
  return data?.data || data;
};

export const fetchAffiliateDashboard = async () => {
  const { data } = await axios.get(`${BASE}/affiliate/dashboard`, { withCredentials: true });
  return data;
};

export const generateAffiliateLink = async (payload) => {
  const { data } = await axios.post(`${BASE}/affiliate/link`, payload, { withCredentials: true });
  return data;
};

export const upsertAmbassadorProfile = async (payload) => {
  const { data } = await axios.post(`${BASE}/ambassador/profile`, payload, { withCredentials: true });
  return data;
};

export const assignAmbassadorCampaign = async (campaignId) => {
  const { data } = await axios.post(
    `${BASE}/ambassador/campaigns/${campaignId}/assign`,
    {},
    { withCredentials: true }
  );
  return data;
};

export const fetchGrowthCommerceRecommendations = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/ai/recommendations`, { params });
  return data?.data || data;
};

export const runCampaignAutomation = async () => {
  const { data } = await axios.post(`${BASE}/automation/run`, {}, { withCredentials: true });
  return data;
};

export const recordCampaignMetric = async (campaignId, metric, amount = 1) => {
  const { data } = await axios.post(`${BASE}/campaigns/${campaignId}/metrics/${metric}`, { amount });
  return data;
};
