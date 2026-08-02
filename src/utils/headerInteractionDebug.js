const isDev = process.env.NODE_ENV !== "production";

export const logHeaderInteractionFailure = (element, reason, detail) => {
  const message = `[Header] ${element} failed: ${reason}`;
  if (isDev) {
    console.warn(message, detail ?? "");
  } else {
    console.error(message);
  }
};

export const logAuthFailure = (context, error) => {
  const message = `[Auth] ${context} failed`;
  if (isDev) {
    console.warn(message, error?.message || error);
  } else {
    console.error(message);
  }
};

export const wrapHeaderHandler = (element, handler) => {
  if (typeof handler !== "function") {
    logHeaderInteractionFailure(element, "missing_handler");
    return () => logHeaderInteractionFailure(element, "dead_click");
  }
  return (...args) => {
    try {
      return handler(...args);
    } catch (error) {
      logHeaderInteractionFailure(element, error?.message || "handler_error", error);
      return undefined;
    }
  };
};
