/** Returns true only when explicit local AI fallback is enabled (dev tooling). */
export function isLocalAIFallbackEnabled() {
  return process.env.REACT_APP_AI_GATEWAY_FALLBACK === "true";
}

export default isLocalAIFallbackEnabled;
