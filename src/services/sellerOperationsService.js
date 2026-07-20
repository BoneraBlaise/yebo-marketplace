import axios from "axios";
import { server } from "../config/serverConfig";
import {
  isSellerOperationsFeatureDisabled,
  resolveSellerOperationsErrorMessage,
} from "../components/SellerOperations/sellerOperationsHelpers";

const BASE = `${server}/marketplace/seller-operations`;

export { isSellerOperationsFeatureDisabled, resolveSellerOperationsErrorMessage };

export const fetchSellerOperationsFeatures = async () => {
  const { data } = await axios.get(`${BASE}/features`);
  return data;
};

export const fetchSellerOperationsAvailability = async () => {
  try {
    const response = await fetchSellerOperationsFeatures();
    const settings = response?.data || response || {};
    const toggles = Object.entries(settings).filter(([key]) => key !== "enabled");
    const hasEnabledFeature =
      settings.enabled !== false && toggles.some(([, value]) => value?.enabled !== false);
    return { available: hasEnabledFeature, settings, disabled: false };
  } catch (error) {
    if (isSellerOperationsFeatureDisabled(error)) {
      return { available: false, settings: {}, disabled: true };
    }
    return { available: true, settings: {}, disabled: false };
  }
};

export const fetchAdminSellerOperationsDashboard = async () => {
  const { data } = await axios.get(`${BASE}/admin/dashboard`, { withCredentials: true });
  return data;
};

export const fetchAdminInventory = async () => {
  const { data } = await axios.get(`${BASE}/admin/inventory`, { withCredentials: true });
  return data;
};

export const fetchAdminSuppliers = async () => {
  const { data } = await axios.get(`${BASE}/admin/suppliers`, { withCredentials: true });
  return data;
};

export const fetchAdminPurchaseOrders = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/admin/purchase-orders`, { withCredentials: true, params });
  return data;
};

export const fetchAdminReturns = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/admin/returns`, { withCredentials: true, params });
  return data;
};

export const fetchVendorInventory = async () => {
  const { data } = await axios.get(`${BASE}/vendor/inventory`, { withCredentials: true });
  return data;
};

export const adjustVendorInventory = async (productId, payload) => {
  const { data } = await axios.post(`${BASE}/vendor/inventory/${productId}/adjust`, payload, {
    withCredentials: true,
  });
  return data;
};

export const updateVendorInventoryThresholds = async (productId, payload) => {
  const { data } = await axios.put(`${BASE}/vendor/inventory/${productId}/thresholds`, payload, {
    withCredentials: true,
  });
  return data;
};

export const fetchVendorAlerts = async () => {
  const { data } = await axios.get(`${BASE}/vendor/alerts`, { withCredentials: true });
  return data;
};

export const fetchVendorSuppliers = async () => {
  const { data } = await axios.get(`${BASE}/vendor/suppliers`, { withCredentials: true });
  return data;
};

export const createVendorSupplier = async (payload) => {
  const { data } = await axios.post(`${BASE}/vendor/suppliers`, payload, { withCredentials: true });
  return data;
};

export const fetchVendorPurchaseOrders = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/vendor/purchase-orders`, { withCredentials: true, params });
  return data;
};

export const createVendorPurchaseOrder = async (payload) => {
  const { data } = await axios.post(`${BASE}/vendor/purchase-orders`, payload, { withCredentials: true });
  return data;
};

export const receiveVendorPurchaseOrder = async (purchaseOrderId, receipts) => {
  const { data } = await axios.post(
    `${BASE}/vendor/purchase-orders/${purchaseOrderId}/receive`,
    { receipts },
    { withCredentials: true }
  );
  return data;
};

export const fetchVendorStockMovements = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/vendor/stock-movements`, { withCredentials: true, params });
  return data;
};

export const fetchVendorReturns = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/vendor/returns`, { withCredentials: true, params });
  return data;
};

export const createVendorReturn = async (payload) => {
  const { data } = await axios.post(`${BASE}/vendor/returns`, payload, { withCredentials: true });
  return data;
};

export const updateVendorReturnStatus = async (returnId, status) => {
  const { data } = await axios.post(
    `${BASE}/vendor/returns/${returnId}/status`,
    { status },
    { withCredentials: true }
  );
  return data;
};

export const importVendorBulkCsv = async (csv, type = "stock") => {
  const { data } = await axios.post(`${BASE}/vendor/bulk/import`, { csv, type }, { withCredentials: true });
  return data;
};

export const exportVendorBulkCsv = async (type = "stock") => {
  const { data } = await axios.get(`${BASE}/vendor/bulk/export`, { withCredentials: true, params: { type } });
  return data;
};

export const assignVendorSku = async (productId, sku) => {
  const { data } = await axios.post(`${BASE}/vendor/sku`, { productId, sku }, { withCredentials: true });
  return data;
};

export const fetchVendorSellerDashboard = async () => {
  const { data } = await axios.get(`${BASE}/vendor/dashboard`, { withCredentials: true });
  return data;
};
