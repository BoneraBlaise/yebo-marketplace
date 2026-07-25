const trimSlash = (value = "") => String(value).replace(/\/$/, "");

const LOCAL_API_SUFFIX = "/api/v2";
const LOCAL_BACKEND_DEFAULT = "http://localhost:5000";
const LOCAL_SOCKET_DEFAULT = "http://localhost:4000";
const LOCAL_APP_ORIGIN_DEFAULT = "http://localhost:3000";

const PRODUCTION_API_DEFAULT = "https://yebone-backend.onrender.com/api/v2";
const PRODUCTION_SOCKET_DEFAULT = "https://guriraline-socket-awo9.onrender.com";

const FORBIDDEN_DEV_HOST_PATTERN = /onrender\.com|github\.io/i;

const resolveDevApiUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${LOCAL_API_SUFFIX}`;
  }
  return LOCAL_API_SUFFIX;
};

const resolveDevSocketUrl = () =>
  trimSlash(process.env.REACT_APP_SOCKET_URL) || LOCAL_SOCKET_DEFAULT;

const resolveDevAppOrigin = () =>
  trimSlash(process.env.REACT_APP_APP_URL) ||
  (typeof window !== "undefined" ? window.location.origin : LOCAL_APP_ORIGIN_DEFAULT);

export const server =
  process.env.NODE_ENV === "development"
    ? resolveDevApiUrl()
    : trimSlash(process.env.REACT_APP_API_URL) || PRODUCTION_API_DEFAULT;

export const socketUrl =
  process.env.NODE_ENV === "development"
    ? resolveDevSocketUrl()
    : trimSlash(process.env.REACT_APP_SOCKET_URL) || PRODUCTION_SOCKET_DEFAULT;

export const appOrigin =
  process.env.NODE_ENV === "development"
    ? resolveDevAppOrigin()
    : trimSlash(process.env.REACT_APP_APP_URL) ||
      (typeof window !== "undefined" ? window.location.origin : LOCAL_APP_ORIGIN_DEFAULT);

export const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
export const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () =>
  Boolean(supabaseUrl && supabaseAnonKey);

export const isForbiddenDevelopmentHost = (value = "") =>
  FORBIDDEN_DEV_HOST_PATTERN.test(String(value));

export const assertLocalDevelopmentConfig = () => {
  if (process.env.NODE_ENV !== "development") {
    return { ok: true, issues: [] };
  }

  const issues = [];
  const proxyTarget = process.env.REACT_APP_PROXY_TARGET || LOCAL_BACKEND_DEFAULT;

  if (isForbiddenDevelopmentHost(proxyTarget)) {
    issues.push(
      `REACT_APP_PROXY_TARGET must not point to production (${proxyTarget}). Use ${LOCAL_BACKEND_DEFAULT}.`
    );
  }

  if (process.env.REACT_APP_API_URL && isForbiddenDevelopmentHost(process.env.REACT_APP_API_URL)) {
    issues.push(
      "REACT_APP_API_URL is set to a production host in development. Remove it or use .env.production only."
    );
  }

  if (process.env.REACT_APP_APP_URL && isForbiddenDevelopmentHost(process.env.REACT_APP_APP_URL)) {
    issues.push(
      "REACT_APP_APP_URL must be localhost in development (http://localhost:3000)."
    );
  }

  if (process.env.REACT_APP_SOCKET_URL && isForbiddenDevelopmentHost(process.env.REACT_APP_SOCKET_URL)) {
    issues.push(
      `REACT_APP_SOCKET_URL must be local in development (${LOCAL_SOCKET_DEFAULT}).`
    );
  }

  const publicUrl = process.env.PUBLIC_URL;
  if (publicUrl && publicUrl !== "/" && /yebo-marketplace|github\.io/i.test(publicUrl)) {
    issues.push(
      `PUBLIC_URL must be empty for local development (current: ${publicUrl}). ` +
        "Set PUBLIC_URL= in .env.development so http://localhost:3000 loads the app."
    );
  }

  if (typeof window !== "undefined") {
    if (isForbiddenDevelopmentHost(window.location.origin)) {
      issues.push("Frontend is running on a production origin during development.");
    }
    if (isForbiddenDevelopmentHost(server)) {
      issues.push(`Resolved API URL points to production: ${server}`);
    }
  }

  if (issues.length > 0) {
    const message = `[Yebone Dev] Localhost isolation check failed:\n- ${issues.join("\n- ")}`;
    throw new Error(message);
  }

  return { ok: true, issues: [] };
};

export const getRuntimeApiDiagnostics = () => ({
  nodeEnv: process.env.NODE_ENV,
  server,
  appOrigin,
  socketUrl,
  proxyTarget: process.env.REACT_APP_PROXY_TARGET || LOCAL_BACKEND_DEFAULT,
  usingDevProxy: process.env.NODE_ENV === "development",
  configuredApiUrl: process.env.REACT_APP_API_URL || null,
  localhostOnly:
    process.env.NODE_ENV === "development" &&
    !isForbiddenDevelopmentHost(server) &&
    !isForbiddenDevelopmentHost(appOrigin) &&
    !isForbiddenDevelopmentHost(process.env.REACT_APP_PROXY_TARGET || LOCAL_BACKEND_DEFAULT),
});
