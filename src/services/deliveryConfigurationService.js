import axios from "axios";
import { server } from "../config/serverConfig";

const BASE = `${server}/marketplace/delivery`;

export const fetchDeliveryConfiguration = async () => {
  const { data } = await axios.get(`${BASE}/configuration`, { withCredentials: true });
  return data;
};

export const updateDeliveryConfiguration = async (settings, reason = "") => {
  const { data } = await axios.put(
    `${BASE}/configuration`,
    { settings, reason: reason || null },
    { withCredentials: true }
  );
  return data;
};

export const fetchDeliveryAuditHistory = async (limit = 50) => {
  const { data } = await axios.get(`${BASE}/configuration/audit`, {
    withCredentials: true,
    params: { limit },
  });
  return data;
};

export const fetchDeliveryCheckoutOptions = async () => {
  const { data } = await axios.get(`${BASE}/checkout-options`);
  return data;
};

export const fetchDeliveryFeatures = async () => {
  const { data } = await axios.get(`${BASE}/features`);
  return data;
};
