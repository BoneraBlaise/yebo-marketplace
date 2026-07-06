import { YIP_PUBLIC_NAME } from "../config/yipConfig";

/** @typedef {import('../types').YIPErrorCode} YIPErrorCode */
/** @typedef {import('../types').YIPError} YIPError */

export const YIP_ERROR = {
  PROVIDER_UNAVAILABLE: "provider_unavailable",
  RATE_LIMIT: "rate_limit",
  TIMEOUT: "timeout",
  NETWORK: "network",
  UNKNOWN: "unknown",
};

const ERROR_CATALOG = {
  [YIP_ERROR.PROVIDER_UNAVAILABLE]: {
    title: "Provider unavailable",
    message: `${YIP_PUBLIC_NAME} is in preview mode. Connect a YIP provider when ready.`,
    recoverable: true,
  },
  [YIP_ERROR.RATE_LIMIT]: {
    title: "Rate limit reached",
    message: "Too many requests. Please try again shortly.",
    recoverable: true,
  },
  [YIP_ERROR.TIMEOUT]: {
    title: "Request timed out",
    message: `${YIP_PUBLIC_NAME} took too long to respond. Try again.`,
    recoverable: true,
  },
  [YIP_ERROR.NETWORK]: {
    title: "Network error",
    message: "Check your connection and try again.",
    recoverable: true,
  },
  [YIP_ERROR.UNKNOWN]: {
    title: "Something went wrong",
    message: "An unexpected error occurred.",
    recoverable: false,
  },
};

export const createYIPError = (code, overrides = {}) => ({
  code,
  ...ERROR_CATALOG[code],
  ...overrides,
});

export const normalizeError = (err) => {
  if (err?.code && ERROR_CATALOG[err.code]) return createYIPError(err.code, err);
  return createYIPError(YIP_ERROR.UNKNOWN, { message: err?.message });
};

export default createYIPError;
