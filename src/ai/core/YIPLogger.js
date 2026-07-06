/** Dev-friendly logger — no external services. */

const LOG_PREFIX = "[YIP]";

export const YIPLogger = {
  debug: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(LOG_PREFIX, ...args);
    }
  },
  info: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.info(LOG_PREFIX, ...args);
    }
  },
  warn: (...args) => console.warn(LOG_PREFIX, ...args),
  error: (...args) => console.error(LOG_PREFIX, ...args),
};

export default YIPLogger;
