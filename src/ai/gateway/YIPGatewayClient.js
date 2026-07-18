import axios from "axios";
import { server } from "../../config/serverConfig";
import { getAuthToken } from "../../config/authStorage";

const buildHeaders = () => {
  const headers = { Accept: "application/json", "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

/** Backend AI gateway client — sole transport for YEBO AI (Phase 7.1) */
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
      },
      { headers: buildHeaders(), withCredentials: true }
    );
    return data;
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
