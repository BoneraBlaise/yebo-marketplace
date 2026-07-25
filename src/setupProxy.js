const { createProxyMiddleware } = require("http-proxy-middleware");

const LOCAL_BACKEND_DEFAULT = "http://localhost:5000";
const FORBIDDEN_DEV_HOST_PATTERN = /onrender\.com|github\.io/i;

const API_TARGET =
  process.env.REACT_APP_PROXY_TARGET ||
  LOCAL_BACKEND_DEFAULT;

if (
  process.env.NODE_ENV === "development" &&
  FORBIDDEN_DEV_HOST_PATTERN.test(API_TARGET)
) {
  throw new Error(
    `[setupProxy] Development must use the local backend (${LOCAL_BACKEND_DEFAULT}). ` +
      `Current REACT_APP_PROXY_TARGET=${API_TARGET}. ` +
      "Update .env.development or .env.development.local."
  );
}

console.info("[setupProxy] loaded by react-scripts");
console.info("[setupProxy] browser -> /api/* ->", API_TARGET);

module.exports = function setupProxy(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: API_TARGET,
      changeOrigin: true,
      secure: API_TARGET.startsWith("https"),
      logLevel: "info",
      onProxyReq: (proxyReq, req) => {
        if (process.env.NODE_ENV === "development") {
          proxyReq.setHeader("origin", "http://localhost:3000");
          proxyReq.removeHeader("referer");
          console.info(
            "[setupProxy] forwarding",
            req.method,
            req.url,
            "->",
            API_TARGET + req.url
          );
        }
      },
      onProxyRes: (proxyRes, req) => {
        if (process.env.NODE_ENV === "development") {
          console.info(
            "[setupProxy] response",
            req.method,
            req.url,
            "status=",
            proxyRes.statusCode
          );
        }
      },
    })
  );
};
