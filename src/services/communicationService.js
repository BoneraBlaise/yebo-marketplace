import axios from "axios";
import { COMMUNICATION_IDENTITY } from "../config/communicationIdentity";
import { server } from "../config/serverConfig";

const BASE = `${server}/marketplace/communication`;

let activeCommunicationIdentity = COMMUNICATION_IDENTITY.BUYER;

export const setActiveCommunicationIdentity = (identity) => {
  activeCommunicationIdentity =
    identity === COMMUNICATION_IDENTITY.SELLER
      ? COMMUNICATION_IDENTITY.SELLER
      : COMMUNICATION_IDENTITY.BUYER;
};

export const getActiveCommunicationIdentity = () => activeCommunicationIdentity;

export const runWithCommunicationIdentity = async (identity, fn) => {
  const previous = activeCommunicationIdentity;
  setActiveCommunicationIdentity(identity);
  try {
    return await fn();
  } finally {
    activeCommunicationIdentity = previous;
  }
};

const withAuth = (config = {}) => ({
  ...config,
  withCredentials: true,
  communicationIdentity: getActiveCommunicationIdentity(),
});

export const fetchConversations = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/conversations`, withAuth({ params }));
  return data?.data || [];
};

export const fetchArchivedConversations = async () => {
  const { data } = await axios.get(`${BASE}/conversations/archived`, withAuth());
  return data?.data || [];
};

export const fetchConversationUnreadCount = async () => {
  const { data } = await axios.get(`${BASE}/conversations/unread-count`, withAuth());
  return data?.data?.count || 0;
};

export const fetchConversation = async (conversationId) => {
  const { data } = await axios.get(`${BASE}/conversations/${conversationId}`, withAuth());
  return data?.data;
};

export const fetchMessages = async (conversationId) => {
  const { data } = await axios.get(`${BASE}/conversations/${conversationId}/messages`, withAuth());
  return data?.data || [];
};

export const startProductConversation = async (payload) => {
  return runWithCommunicationIdentity(COMMUNICATION_IDENTITY.BUYER, async () => {
    const { data } = await axios.post(`${BASE}/conversations/product`, payload, withAuth());
    return data?.data;
  });
};

export const startListingConversation = async (payload) => {
  return runWithCommunicationIdentity(COMMUNICATION_IDENTITY.BUYER, async () => {
    const { data } = await axios.post(`${BASE}/conversations/listing`, payload, withAuth());
    return data?.data;
  });
};

export const sendConversationMessage = async (conversationId, payload) => {
  const { data } = await axios.post(`${BASE}/conversations/${conversationId}/messages`, payload, withAuth());
  return data?.data;
};

export const archiveConversation = async (conversationId) => {
  const { data } = await axios.put(`${BASE}/conversations/${conversationId}/archive`, {}, withAuth());
  return data?.data;
};

export const unarchiveConversation = async (conversationId) => {
  const { data } = await axios.put(`${BASE}/conversations/${conversationId}/unarchive`, {}, withAuth());
  return data?.data;
};

export const createProductOffer = async (payload) => {
  const { data } = await axios.post(`${BASE}/offers`, payload, withAuth());
  return data?.data;
};

export const counterProductOffer = async (offerId, payload) => {
  const { data } = await axios.post(`${BASE}/offers/${offerId}/counter`, payload, withAuth());
  return data?.data;
};

export const respondToProductOffer = async (offerId, status) => {
  const { data } = await axios.post(`${BASE}/offers/${offerId}/${status}`, {}, withAuth());
  return data?.data;
};

export const fetchOffer = async (offerId) => {
  const { data } = await axios.get(`${BASE}/offers/${offerId}`, withAuth());
  return data?.data;
};

export const fetchOfferHistory = async (conversationId) => {
  const { data } = await axios.get(`${BASE}/conversations/${conversationId}/offers`, withAuth());
  return data?.data || [];
};

export const fetchNegotiatedCheckout = async ({ offerId, token }) => {
  const { data } = await axios.get(`${BASE}/checkout/negotiated`, withAuth({
    params: { offerId, token },
  }));
  return data?.data;
};

export const fetchNotifications = async (params = {}) => {
  const { data } = await axios.get(`${BASE}/notifications`, withAuth({ params }));
  return data?.data || { items: [], unreadCount: 0 };
};

export const fetchNotificationUnreadCount = async () => {
  const { data } = await axios.get(`${BASE}/notifications/unread-count`, withAuth());
  return data?.data?.count || 0;
};

export const markNotificationRead = async (notificationId) => {
  const { data } = await axios.put(`${BASE}/notifications/${notificationId}/read`, {}, withAuth());
  return data?.data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await axios.put(`${BASE}/notifications/read-all`, {}, withAuth());
  return data;
};

export const savePushSubscription = async (subscription) => {
  const { data } = await axios.post(`${BASE}/push/subscribe`, { subscription }, withAuth());
  return data;
};

export const fetchVapidPublicKey = async () => {
  const { data } = await axios.get(`${BASE}/push/vapid-public-key`);
  return data?.data?.publicKey || null;
};

export const confirmOrderDelivery = async (orderId) => {
  const { data } = await axios.put(`${BASE}/orders/${orderId}/confirm-delivery`, {}, withAuth());
  return data?.data;
};
