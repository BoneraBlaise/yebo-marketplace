import axios from "axios";
import { server } from "../config/serverConfig";

const BASE = `${server}/marketplace/integration`;

export const fetchPlatformConfiguration = async () => {
  const { data } = await axios.get(`${BASE}/platform-configuration`, { withCredentials: true });
  return data;
};

export const updatePlatformConfigurationSection = async (section, values, reason = "") => {
  const { data } = await axios.put(
    `${BASE}/platform-configuration/section/${section}`,
    { values, reason: reason || null },
    { withCredentials: true }
  );
  return data;
};

export const publishPlatformConfiguration = async (reason = "", sections = null) => {
  const { data } = await axios.post(
    `${BASE}/platform-configuration/publish`,
    { reason: reason || null, sections },
    { withCredentials: true }
  );
  return data;
};

export const fetchConfigurationWorkflow = async () => {
  const { data } = await axios.get(`${BASE}/platform-configuration/workflow`, { withCredentials: true });
  return data;
};

export const saveDeliveryDraft = async (settings, reason = "") => {
  const { data } = await axios.put(
    `${BASE}/configuration/draft/delivery`,
    { settings, reason: reason || null },
    { withCredentials: true }
  );
  return data;
};

export const publishModuleConfiguration = async (module, reason = "") => {
  const { data } = await axios.post(
    `${BASE}/configuration/publish/${module}`,
    { reason: reason || null },
    { withCredentials: true }
  );
  return data;
};

export const fetchConfigurationHistory = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/configuration-history`, {
    withCredentials: true,
    params,
  });
  return data;
};

export const rollbackConfiguration = async (historyId, reason = "") => {
  const { data } = await axios.post(
    `${BASE}/configuration-history/${historyId}/rollback`,
    { reason: reason || null, note: reason || null },
    { withCredentials: true }
  );
  return data;
};

export const runConfigurationSimulation = async (type, input = {}) => {
  const { data } = await axios.post(
    `${BASE}/configuration/simulate`,
    { type, input },
    { withCredentials: true }
  );
  return data;
};

export const fetchRuntimeFeatureFlags = async () => {
  const { data } = await axios.get(`${BASE}/runtime-feature-flags`, { withCredentials: true });
  return data;
};

export const updateRuntimeFeatureFlags = async (runtimeFeatures, reason = "", publish = false) => {
  const { data } = await axios.put(
    `${BASE}/runtime-feature-flags`,
    { runtimeFeatures, reason: reason || null, publish },
    { withCredentials: true }
  );
  return data;
};

export const fetchPlatformConfigurationAudit = async (limit = 50) => {
  const { data } = await axios.get(`${BASE}/platform-configuration/audit`, {
    withCredentials: true,
    params: { limit },
  });
  return data;
};

export const upsertPlatformBanner = async (banner, reason = "") => {
  const { data } = await axios.post(
    `${BASE}/platform-configuration/banners`,
    { ...banner, reason: reason || null },
    { withCredentials: true }
  );
  return data;
};

export const deletePlatformBanner = async (id, reason = "") => {
  const { data } = await axios.delete(`${BASE}/platform-configuration/banners/${id}`, {
    withCredentials: true,
    data: { reason: reason || null },
  });
  return data;
};

export const fetchPublicAiProducts = async () => {
  const { data } = await axios.get(`${BASE}/platform-configuration/public/ai-products`);
  return data;
};

export const fetchPublicBanners = async (type = null) => {
  const { data } = await axios.get(`${BASE}/platform-configuration/public/banners`, {
    params: type ? { type } : undefined,
  });
  return data;
};

export const fetchAiAdminProducts = async () => {
  const { data } = await axios.get(`${server}/marketplace/ai/admin/products`, {
    withCredentials: true,
  });
  return data;
};

export const updateAiAdminProducts = async (aiProducts, reason = "") => {
  const { data } = await axios.put(
    `${server}/marketplace/ai/admin/products`,
    { aiProducts, reason: reason || null },
    { withCredentials: true }
  );
  return data;
};

export const fetchReferralAdminDashboard = async () => {
  const { data } = await axios.get(`${server}/marketplace/growth/referral/admin/dashboard`, {
    withCredentials: true,
  });
  return data;
};

export const updateReferralCodeAction = async (id, action) => {
  const { data } = await axios.post(
    `${server}/marketplace/growth/referral/admin/codes/${id}/${action}`,
    {},
    { withCredentials: true }
  );
  return data;
};

export const fetchCommissionHistory = async (limit = 100) => {
  const { data } = await axios.get(`${server}/marketplace/growth/commission-history`, {
    withCredentials: true,
    params: { limit },
  });
  return data;
};
