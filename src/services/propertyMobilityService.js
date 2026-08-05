import axios from "axios";
import { server } from "../config/serverConfig";
import {
  assertVendorSession,
  buildVendorAuthHeaders,
} from "../config/vendorSession";
import { restoreAuthSessionFromBackup } from "../config/authStorage";
import {
  isPropertyMobilityFeatureDisabled,
  resolvePropertyMobilityErrorMessage,
  logPropertyMobilityError,
} from "../components/PropertyMobility/propertyMobilityHelpers";

const BASE = `${server}/marketplace/property-mobility`;

export { isPropertyMobilityFeatureDisabled, resolvePropertyMobilityErrorMessage, logPropertyMobilityError };

export const fetchPropertyMobilityFeatures = async () => {
  const { data } = await axios.get(`${BASE}/features`);
  return data;
};

export const fetchPropertyMobilityAvailability = async () => {
  try {
    const response = await fetchPropertyMobilityFeatures();
    const payload = response?.data || response || {};
    const settings = payload.settings || payload;
    return {
      available: settings.enabled !== false,
      settings: payload,
      disabled: false,
    };
  } catch (error) {
    if (isPropertyMobilityFeatureDisabled(error)) {
      return { available: false, settings: {}, disabled: true };
    }
    return { available: true, settings: {}, disabled: false };
  }
};

const sanitizePropertySearchParams = (params = {}) => {
  const cleaned = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) return;
    if ((key === "verifiedOnly" || key === "featuredOnly") && value !== true) return;
    cleaned[key] = value;
  });
  return cleaned;
};

export const searchPropertyListings = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/search`, {
    params: sanitizePropertySearchParams(params),
  });
  return data;
};

export const fetchPublicListing = async (listingId) => {
  const { data } = await axios.get(`${BASE}/listings/${listingId}`);
  return data;
};

export const fetchAdminPropertyMobilityDashboard = async () => {
  const { data } = await axios.get(`${BASE}/admin/dashboard`, { withCredentials: true });
  return data;
};

export const fetchAdminPropertyListings = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/admin/listings`, { withCredentials: true, params });
  return data;
};

export const fetchAdminPropertyReports = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/admin/reports`, { withCredentials: true, params });
  return data;
};

export const moderateAdminListing = async (listingId, action, body = {}) => {
  const { data } = await axios.post(`${BASE}/admin/listings/${listingId}/${action}`, body, {
    withCredentials: true,
  });
  return data;
};

export const moderateAdminReport = async (reportId, status, adminNotes = "") => {
  const { data } = await axios.post(
    `${BASE}/admin/reports/${reportId}/status`,
    { status, adminNotes },
    { withCredentials: true }
  );
  return data;
};

export const updatePropertyMobilityConfiguration = async (payload) => {
  const { data } = await axios.put(`${BASE}/configuration`, payload, { withCredentials: true });
  return data;
};

export const fetchOwnerListings = async () => {
  const { data } = await axios.get(`${BASE}/owner/listings`, { withCredentials: true });
  return data;
};

export const createOwnerListing = async (payload) => {
  try {
    restoreAuthSessionFromBackup();
    assertVendorSession();

    const authHeaders = buildVendorAuthHeaders();
    console.info("[PropertyMobility] Creating listing", {
      category: payload.category,
      title: payload.title,
      photoCount: payload.photos?.length || 0,
      publish: payload.publish,
      hasAuthorization: Boolean(authHeaders.Authorization),
    });

    const { data } = await axios.post(`${BASE}/owner/listings`, payload, {
      withCredentials: true,
      headers: authHeaders,
    });
    console.info("[PropertyMobility] Listing created", {
      listingId: data?.data?.listingId,
      status: data?.data?.status,
    });
    return data;
  } catch (error) {
    logPropertyMobilityError("createOwnerListing", error, {
      category: payload?.category,
      photoCount: payload?.photos?.length,
    });
    throw error;
  }
};

export const updateOwnerListing = async (listingId, payload) => {
  const { data } = await axios.put(`${BASE}/owner/listings/${listingId}`, payload, { withCredentials: true });
  return data;
};

export const publishOwnerListing = async (listingId) => {
  const { data } = await axios.post(`${BASE}/owner/listings/${listingId}/publish`, {}, { withCredentials: true });
  return data;
};

export const pauseOwnerListing = async (listingId) => {
  const { data } = await axios.post(`${BASE}/owner/listings/${listingId}/pause`, {}, { withCredentials: true });
  return data;
};

export const deleteOwnerListing = async (listingId) => {
  const { data } = await axios.delete(`${BASE}/owner/listings/${listingId}`, { withCredentials: true });
  return data;
};

export const promoteOwnerListing = async (listingId, type) => {
  const { data } = await axios.post(`${BASE}/owner/listings/${listingId}/promote/${type}`, {}, { withCredentials: true });
  return data;
};

export const requestOwnerVerification = async (payload) => {
  const { data } = await axios.post(`${BASE}/owner/verification`, payload, { withCredentials: true });
  return data;
};

export const fetchOwnerVerification = async () => {
  const { data } = await axios.get(`${BASE}/owner/verification`, { withCredentials: true });
  return data;
};

export const fetchOwnerAgencies = async () => {
  const { data } = await axios.get(`${BASE}/owner/agencies`, { withCredentials: true });
  return data;
};

export const createOwnerAgency = async (payload) => {
  const { data } = await axios.post(`${BASE}/owner/agencies`, payload, { withCredentials: true });
  return data;
};

export const subscribeOwnerAgency = async (agencyId) => {
  const { data } = await axios.post(`${BASE}/owner/agencies/${agencyId}/subscribe`, {}, { withCredentials: true });
  return data;
};

export const fetchOwnerOffers = async () => {
  const { data } = await axios.get(`${BASE}/owner/offers`, { withCredentials: true });
  return data;
};

export const respondOwnerOffer = async (offerId, status) => {
  const { data } = await axios.post(`${BASE}/owner/offers/${offerId}/${status}`, {}, { withCredentials: true });
  return data;
};

export const submitPropertyOffer = async (payload) => {
  const { data } = await axios.post(`${BASE}/offers`, payload, { withCredentials: true });
  return data;
};

export const submitPropertyReport = async (payload) => {
  const { data } = await axios.post(`${BASE}/reports`, payload, { withCredentials: true });
  return data;
};

export const fetchPropertyMobilityConfiguration = async () => {
  const { data } = await axios.get(`${BASE}/configuration`, { withCredentials: true });
  return data;
};
