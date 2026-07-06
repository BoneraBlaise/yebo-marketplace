/** OpenRouter env configuration — reads REACT_APP_OPENROUTER_API_KEY only */
export const getOpenRouterApiKey = () => {
  const key = process.env.REACT_APP_OPENROUTER_API_KEY;
  if (typeof key !== "string") return "";
  return key.trim();
};

export const isOpenRouterConfigured = () => Boolean(getOpenRouterApiKey());

export const logOpenRouterDebug = (message, meta = {}) => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info(`[YEBO OpenRouter] ${message}`, Object.keys(meta).length ? meta : "");
  }
};

export default { getOpenRouterApiKey, isOpenRouterConfigured, logOpenRouterDebug };
