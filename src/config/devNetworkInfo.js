import { getRuntimeApiDiagnostics } from "./serverConfig";

export const logDevNetworkInfo = () => {
  if (process.env.NODE_ENV !== "development") return;

  const port = process.env.PORT || 3000;
  const diagnostics = getRuntimeApiDiagnostics();

  console.info("[Yebone Dev] Local URL: http://localhost:" + port);
  console.info(
    "[Yebone Dev] Phone testing: open http://<your-pc-lan-ip>:" +
      port +
      " on the same Wi-Fi network."
  );
  console.info("[Yebone Dev] API URL:", diagnostics.server);
  console.info("[Yebone Dev] Dev proxy active:", diagnostics.usingDevProxy);
  console.info(
    "[Yebone Dev] API requests are proxied through the dev server to avoid CORS on LAN devices."
  );
};
