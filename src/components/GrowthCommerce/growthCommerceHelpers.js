export const isGrowthCommerceFeatureDisabled = (error) => {
  const reason = error?.response?.data?.reason;
  return reason === "FEATURE_DISABLED" || error?.response?.status === 403;
};

export const resolveGrowthCommerceErrorMessage = (error, fallback = "Something went wrong") => {
  if (isGrowthCommerceFeatureDisabled(error)) {
    return "Growth Commerce is currently disabled on this marketplace.";
  }
  if (error?.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }
  if (!error?.response) {
    return "Network error. Check your connection and try again.";
  }
  return error?.response?.data?.message || fallback;
};
