import { getRuntimeApiDiagnostics, assertLocalDevelopmentConfig } from "./serverConfig";

const printReady = (label, detail) => {
  console.info(`✓ ${label}${detail ? ` — ${detail}` : ""}`);
};

export const logDevNetworkInfo = () => {
  if (process.env.NODE_ENV !== "development") return;

  try {
    assertLocalDevelopmentConfig();
  } catch (error) {
    console.error(error.message);
    throw error;
  }

  const port = process.env.PORT || 3000;
  const diagnostics = getRuntimeApiDiagnostics();

  console.info("");
  console.info("========================================");
  console.info(" Yebone — Development Mode (localhost)");
  console.info("========================================");
  printReady("Frontend Ready", `http://localhost:${port}`);
  printReady("Local API Connected", diagnostics.server);
  printReady("Dev Proxy Active", diagnostics.proxyTarget);
  printReady("App Origin", diagnostics.appOrigin);
  printReady("Socket Target", diagnostics.socketUrl);
  printReady("Production Isolation", diagnostics.localhostOnly ? "enabled" : "disabled");
  console.info("");
  console.info(" API traffic is proxied to the local backend.");
  console.info(" No Render or GitHub Pages URLs are used in development.");
  console.info("========================================");
  console.info("");
};
