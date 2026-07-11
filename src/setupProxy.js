const { createProxyMiddleware } = require("http-proxy-middleware");

const API_TARGET =
  process.env.REACT_APP_PROXY_TARGET ||
  "https://guriraline-server-7rac.onrender.com";

console.info("[setupProxy] loaded by react-scripts");
console.info("[setupProxy] browser -> /api/* ->", API_TARGET);

module.exports = function setupProxy(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: API_TARGET,
      changeOrigin: true,
      secure: true,
      logLevel: "info",
      onProxyReq: (proxyReq, req) => {
        // Render backend only allows Origin http://localhost:3000.
        // Rewrite outbound Origin so LAN dev traffic is accepted.
        proxyReq.setHeader("origin", "http://localhost:3000");
        proxyReq.removeHeader("referer");

        if (process.env.NODE_ENV === "development") {
          console.info(
            "[setupProxy] forwarding",
            req.method,
            req.url,
            "->",
            API_TARGET + req.url,
            "(origin rewritten to http://localhost:3000)"
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
