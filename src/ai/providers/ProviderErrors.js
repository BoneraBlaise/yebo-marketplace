/** Reusable provider SDK error classes — architecture only */

export class ProviderError extends Error {
  constructor(message, code = "PROVIDER_ERROR") {
    super(message);
    this.name = "ProviderError";
    this.code = code;
  }
}

export class AuthenticationError extends ProviderError {
  constructor(message = "Authentication failed — mock") {
    super(message, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends ProviderError {
  constructor(message = "Rate limit exceeded — mock") {
    super(message, "RATE_LIMIT_ERROR");
    this.name = "RateLimitError";
  }
}

export class TimeoutError extends ProviderError {
  constructor(message = "Request timed out — mock") {
    super(message, "TIMEOUT_ERROR");
    this.name = "TimeoutError";
  }
}

export class ProviderUnavailableError extends ProviderError {
  constructor(message = "Provider unavailable — mock") {
    super(message, "PROVIDER_UNAVAILABLE");
    this.name = "ProviderUnavailableError";
  }
}

export class StreamingError extends ProviderError {
  constructor(message = "Streaming error — mock") {
    super(message, "STREAMING_ERROR");
    this.name = "StreamingError";
  }
}

export class UnknownProviderError extends ProviderError {
  constructor(id) {
    super(`Unknown provider: ${id}`, "UNKNOWN_PROVIDER");
    this.name = "UnknownProviderError";
  }
}

export default {
  ProviderError,
  AuthenticationError,
  RateLimitError,
  TimeoutError,
  ProviderUnavailableError,
  StreamingError,
  UnknownProviderError,
};
