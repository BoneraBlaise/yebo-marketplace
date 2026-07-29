import axios from "axios";
import { server } from "../../config/serverConfig";
import { getAuthToken, getSellerToken } from "../../config/authStorage";

const buildHeaders = (options = {}) => {
  const headers = { Accept: "application/json", "Content-Type": "application/json" };
  const token = options.vendor ? getSellerToken() : getAuthToken();
  const fallback = getAuthToken();
  const authToken = token || fallback;
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  if (options.idempotencyKey) headers["X-Idempotency-Key"] = options.idempotencyKey;
  return headers;
};

/** Backend AI gateway client — sole production transport for YEBO AI */
export const YIPGatewayClient = {
  async chat(message, options = {}) {
    const { data } = await axios.post(
      `${server}/ai/chat`,
      {
        message,
        sessionId: options.sessionId || null,
        scope: options.scope || "chat",
        stream: options.stream === true,
        region: options.region,
        language: options.language,
        confirmActionId: options.confirmActionId || null,
        cancelActionId: options.cancelActionId || null,
        actionChecksum: options.actionChecksum || null,
      },
      { headers: buildHeaders(), withCredentials: true }
    );
    return data;
  },

  async confirmAction({ confirmActionId, sessionId, actionChecksum, message = "confirm" } = {}) {
    return this.chat(message, { sessionId, confirmActionId, actionChecksum });
  },

  async cancelAction({ cancelActionId, sessionId, message = "cancel" } = {}) {
    return this.chat(message, { sessionId, cancelActionId });
  },

  async search(query, options = {}) {
    const { data } = await axios.post(
      `${server}/ai/search`,
      {
        query,
        sessionId: options.sessionId || null,
      },
      { headers: buildHeaders(), withCredentials: true }
    );
    return data;
  },

  async searchByImage({ image, imageUrl, imageBase64, vendorId } = {}) {
    const { data } = await axios.post(
      `${server}/ai/search/image`,
      { image, imageUrl, imageBase64, vendorId },
      { headers: buildHeaders(), withCredentials: true }
    );
    return data;
  },

  async intelligence(mode, body = {}, options = {}) {
    const { data } = await axios.post(
      `${server}/ai/intelligence`,
      { mode, ...body },
      { headers: buildHeaders(), withCredentials: true, ...options }
    );
    return data;
  },

  async preview({ ai_preview_type, productId, vendorId, customerId, inputs = {}, idempotencyKey = null } = {}) {
    const { data } = await axios.post(
      `${server}/ai/preview`,
      { ai_preview_type, productId, vendorId, customerId, inputs, idempotencyKey },
      {
        headers: buildHeaders({ vendor: true, idempotencyKey }),
        withCredentials: true,
      }
    );
    return data;
  },

  async getPreviewSession(sessionId) {
    const { data } = await axios.get(`${server}/ai/preview/${sessionId}`, {
      headers: buildHeaders(),
      withCredentials: true,
    });
    return data;
  },

  async getPreviewResult(sessionId) {
    const { data } = await axios.get(`${server}/ai/preview/${sessionId}/result`, {
      headers: buildHeaders(),
      withCredentials: true,
    });
    return data;
  },

  async cancelPreview(sessionId) {
    const { data } = await axios.post(
      `${server}/ai/preview/${sessionId}/cancel`,
      {},
      { headers: buildHeaders(), withCredentials: true }
    );
    return data;
  },

  async service({ serviceType, input, vendorId, idempotencyKey = null, options = {} } = {}) {
    const { data } = await axios.post(
      `${server}/ai/service`,
      { serviceType, input, vendorId, idempotencyKey, options },
      {
        headers: buildHeaders({ vendor: true, idempotencyKey }),
        withCredentials: true,
      }
    );
    return data;
  },

  async getVendorDashboard() {
    const { data } = await axios.get(`${server}/ai/vendor/dashboard`, {
      headers: buildHeaders({ vendor: true }),
      withCredentials: true,
    });
    return data;
  },

  async getVendorCredits() {
    const { data } = await axios.get(`${server}/ai/vendor/credits`, {
      headers: buildHeaders({ vendor: true }),
      withCredentials: true,
    });
    return data;
  },

  async getVendorSubscription() {
    const { data } = await axios.get(`${server}/ai/vendor/subscription`, {
      headers: buildHeaders({ vendor: true }),
      withCredentials: true,
    });
    return data;
  },

  async listCustomerPreviews() {
    const { data } = await axios.get(`${server}/ai/customer/previews`, {
      headers: buildHeaders(),
      withCredentials: true,
    });
    return data;
  },

  async getAdminAnalytics(period = "daily") {
    const base = server.replace(/\/api\/v2\/?$/, "");
    const { data } = await axios.get(`${base}/api/v2/marketplace/ai/admin/analytics?period=${period}`, {
      headers: buildHeaders(),
      withCredentials: true,
    });
    return data;
  },

  async adjustAdminCredits({ vendorId, amount, reason } = {}) {
    const base = server.replace(/\/api\/v2\/?$/, "");
    const { data } = await axios.post(
      `${base}/api/v2/marketplace/ai/admin/credits/adjust`,
      { vendorId, amount, reason },
      { headers: buildHeaders(), withCredentials: true }
    );
    return data;
  },

  async health() {
    const base = server.replace(/\/api\/v2\/?$/, "");
    const { data } = await axios.get(`${base}/api/v2/marketplace/ai/health`, {
      headers: buildHeaders(),
      withCredentials: true,
    });
    return data;
  },

  async *streamChat(message, options = {}) {
    const response = await this.chat(message, { ...options, stream: false });
    const text = response?.data?.message || "";
    const words = String(text).split(" ");
    for (const word of words) {
      yield `${word} `;
    }
    return response;
  },
};

export default YIPGatewayClient;
