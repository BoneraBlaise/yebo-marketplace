export const isPropertyMobilityFeatureDisabled = (error) => {
  const reason = error?.response?.data?.reason;
  return reason === "FEATURE_DISABLED" || error?.response?.status === 403;
};

export const resolvePropertyMobilityErrorMessage = (error, fallback = "Something went wrong") => {
  if (isPropertyMobilityFeatureDisabled(error)) {
    return "Property & Mobility is currently disabled on this marketplace.";
  }
  if (!error?.response) return "Network error. Check your connection and try again.";
  return error?.response?.data?.message || fallback;
};

export const LISTING_CATEGORIES = [
  { value: "apartments", label: "Apartments" },
  { value: "houses", label: "Houses" },
  { value: "land", label: "Land" },
  { value: "cars", label: "Cars" },
  { value: "commercial_property", label: "Commercial Property" },
];

export const formatCategory = (value) =>
  LISTING_CATEGORIES.find((item) => item.value === value)?.label || value;

export const formatPrice = (value) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(
    Number(value || 0)
  );
