/** Gemini env configuration — reads REACT_APP_GEMINI_API_KEY only */
export const getGeminiApiKey = () => {
  const key = process.env.REACT_APP_GEMINI_API_KEY;
  if (typeof key !== "string") return "";
  return key.trim();
};

export const isGeminiConfigured = () => Boolean(getGeminiApiKey());

export const logGeminiDebug = (message, debugMode = false) => {
  if (debugMode || process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info(`[YEBO Gemini] ${message}`);
  }
};

export default { getGeminiApiKey, isGeminiConfigured, logGeminiDebug };
