export const isPropertyMobilityFeatureDisabled = (error) => {
  const reason = error?.response?.data?.reason;
  return reason === "FEATURE_DISABLED" || error?.response?.status === 403;
};

const REASON_MESSAGES = {
  UNAUTHENTICATED: "Login required.",
  FORBIDDEN: "You don't have permission to perform this action.",
  FEATURE_DISABLED: "Property & Mobility is currently disabled on this marketplace.",
  VALIDATION_FAILED: null,
  LISTING_LIMIT_REACHED: "You've reached your agency listing limit.",
  NOT_FOUND: "Listing not found.",
  SERVER_ERROR: "Something went wrong on our end. Please try again.",
};

export const resolvePropertyMobilityErrorMessage = (error, fallback = "Something went wrong") => {
  if (!error) return fallback;

  if (isPropertyMobilityFeatureDisabled(error)) {
    return REASON_MESSAGES.FEATURE_DISABLED;
  }

  if (!error.response) {
    if (error.code === "ECONNABORTED") return "Request timed out. Check your connection and retry.";
    if (error.message?.includes("Network Error")) return "Network error. Check your connection and try again.";
    return error.message || "Network error. Check your connection and try again.";
  }

  const { status, data } = error.response;
  const reason = data?.reason;
  const serverMessage = data?.message;
  const firstFieldError = data?.errors?.[0]?.message;

  if (reason && REASON_MESSAGES[reason] !== undefined) {
    if (reason === "VALIDATION_FAILED") {
      return firstFieldError || serverMessage || "Please check your listing details.";
    }
    return REASON_MESSAGES[reason] || serverMessage || fallback;
  }

  if (status === 401) return "Login required.";
  if (status === 403) return serverMessage || "Database permission denied.";
  if (status === 413) return "Photos are too large. Try fewer or smaller images.";
  if (status === 400) return firstFieldError || serverMessage || "Please check your listing details.";
  if (status >= 500) return serverMessage || "Server error. Please try again shortly.";

  return serverMessage || fallback;
};

export const logPropertyMobilityError = (context, error, extra = {}) => {
  const payload = {
    context,
    message: error?.message,
    status: error?.response?.status,
    reason: error?.response?.data?.reason,
    responseMessage: error?.response?.data?.message,
    errors: error?.response?.data?.errors,
    stack: error?.stack,
    ...extra,
  };
  console.error(`[PropertyMobility] ${context} failed`, payload);
  if (error?.response?.data) {
    console.error("[PropertyMobility] Response body:", error.response.data);
  }
};

export const PROPERTY_CATEGORIES = [
  { value: "apartments", label: "Apartments", group: "property" },
  { value: "houses", label: "Houses", group: "property" },
  { value: "land", label: "Land", group: "property" },
  { value: "commercial_property", label: "Commercial Property", group: "property" },
];

export const MOBILITY_CATEGORIES = [
  { value: "cars", label: "Cars", group: "mobility" },
  { value: "motorcycles", label: "Motorcycles", group: "mobility" },
  { value: "trucks", label: "Trucks", group: "mobility" },
  { value: "bicycles", label: "Bicycles", group: "mobility" },
];

export const FUTURE_MOBILITY_CATEGORIES = [
  { value: "scooters", label: "Scooters", group: "mobility", disabled: true },
  { value: "boats", label: "Boats", group: "mobility", disabled: true },
];

export const LISTING_CATEGORIES = [...PROPERTY_CATEGORIES, ...MOBILITY_CATEGORIES];

export const CATEGORY_GROUPS = [
  { id: "property", label: "Property" },
  { id: "mobility", label: "Mobility" },
];

export const isPropertyCategory = (value) =>
  PROPERTY_CATEGORIES.some((item) => item.value === value);

export const isMobilityCategory = (value) =>
  MOBILITY_CATEGORIES.some((item) => item.value === value);

export const formatCategory = (value) =>
  LISTING_CATEGORIES.find((item) => item.value === value)?.label || value;

export const formatPrice = (value, currency = "RWF") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

/** Human-readable listing status for vendor dashboard */
export const LISTING_STATUS_META = {
  pending_review: { label: "Pending Review", emoji: "🟡", tone: "pending" },
  published: { label: "Live", emoji: "🟢", tone: "live" },
  approved: { label: "Live", emoji: "🟢", tone: "live" },
  rejected: { label: "Rejected", emoji: "🔴", tone: "rejected" },
  needs_changes: { label: "Needs Changes", emoji: "🟠", tone: "pending" },
  paused: { label: "Paused", emoji: "⚪", tone: "paused" },
  draft: { label: "Draft", emoji: "🔵", tone: "draft" },
  suspended: { label: "Suspended", emoji: "🔴", tone: "rejected" },
};

export const formatListingStatus = (status) => {
  const meta = LISTING_STATUS_META[status];
  if (!meta) return { label: String(status || "Unknown").replace(/_/g, " "), emoji: "", tone: "draft" };
  return meta;
};

export const formatListingLocation = (listing) => {
  const city = listing?.location?.city || listing?.city;
  const district = listing?.location?.district || listing?.district;
  return [district, city].filter(Boolean).join(", ") || "Location not set";
};

export const formatListingDate = (value) => {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return null;
  }
};

export const getListingThumbnail = (listing) =>
  listing?.photos?.[0] || listing?.images?.[0] || null;

export const canPublishListing = (status) =>
  status === "draft" || status === "paused";

export const canFeatureListing = (status) =>
  status === "published" || status === "approved";

export const canPauseListing = (status) =>
  status === "published" || status === "approved";
