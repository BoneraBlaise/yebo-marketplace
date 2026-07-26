const BACKEND_URL = process.env.E2E_BACKEND_URL || "http://127.0.0.1:5000";
const API_BASE = `${BACKEND_URL}/api/v2`;

function hasCommunicationCredentials() {
  return Boolean(
    process.env.E2E_BUYER_EMAIL &&
      process.env.E2E_BUYER_PASSWORD &&
      process.env.E2E_SELLER_EMAIL &&
      process.env.E2E_SELLER_PASSWORD
  );
}

async function parseJsonResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text || "{}");
  } catch {
    return { raw: text };
  }
}

async function apiRequest(path, { method = "GET", token, body, headers = {} } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await parseJsonResponse(res);
  return { status: res.status, ok: res.ok, json };
}

async function loginUser(email, password) {
  const res = await apiRequest("/user/login-user", {
    method: "POST",
    body: { email, password },
  });
  if (!res.ok) {
    throw new Error(`Buyer login failed (${res.status}): ${JSON.stringify(res.json)}`);
  }
  return {
    token: res.json.token,
    user: res.json.user,
  };
}

async function loginSeller(email, password) {
  const res = await apiRequest("/shop/login-shop", {
    method: "POST",
    body: { email, password },
  });
  if (!res.ok) {
    throw new Error(`Seller login failed (${res.status}): ${JSON.stringify(res.json)}`);
  }
  return {
    token: res.json.token,
    seller: res.json.user,
  };
}

async function getFirstProduct(token) {
  if (process.env.E2E_PRODUCT_ID) {
    const res = await apiRequest(`/product/get-product/${process.env.E2E_PRODUCT_ID}`, { token });
    if (res.ok) return res.json.product || res.json.data || res.json;
  }

  const res = await apiRequest("/product/get-all-products");
  const products = res.json?.products || res.json?.data || [];
  const product = products.find((p) => p?._id && p?.shopId);
  if (!product) throw new Error("No product available for E2E communication tests");
  return product;
}

module.exports = {
  API_BASE,
  BACKEND_URL,
  hasCommunicationCredentials,
  apiRequest,
  loginUser,
  loginSeller,
  getFirstProduct,
};
