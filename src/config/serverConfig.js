const trimSlash = (value = "") => String(value).replace(/\/$/, "");

const REMOTE_API_DEFAULT =
  "https://yebone-backend.onrender.com/api/v2";

const REMOTE_SOCKET_DEFAULT =
  "https://guriraline-socket-awo9.onrender.com";

const resolveDevApiUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/v2`;
  }
  return "/api/v2";
};

export const server =
  process.env.NODE_ENV === "development"
    ? resolveDevApiUrl()
    : trimSlash(process.env.REACT_APP_API_URL) || REMOTE_API_DEFAULT;

export const socketUrl =
  trimSlash(process.env.REACT_APP_SOCKET_URL) || REMOTE_SOCKET_DEFAULT;

export const appOrigin =
  trimSlash(process.env.REACT_APP_APP_URL) ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
export const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () =>
  Boolean(supabaseUrl && supabaseAnonKey);

export const getRuntimeApiDiagnostics = () => ({
  nodeEnv: process.env.NODE_ENV,
  server,
  appOrigin,
  socketUrl,
  usingDevProxy: process.env.NODE_ENV === "development",
  configuredApiUrl: process.env.REACT_APP_API_URL || null,
});
