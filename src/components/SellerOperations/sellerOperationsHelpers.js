export const isSellerOperationsFeatureDisabled = (error) => {
  const reason = error?.response?.data?.reason;
  return reason === "FEATURE_DISABLED" || error?.response?.status === 403;
};

export const resolveSellerOperationsErrorMessage = (error, fallback = "Something went wrong") => {
  if (isSellerOperationsFeatureDisabled(error)) {
    return "Seller Operations is currently disabled on this marketplace.";
  }
  if (error?.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }
  if (!error?.response) {
    return "Network error. Check your connection and try again.";
  }
  return error?.response?.data?.message || fallback;
};

export const formatStockStatus = (status) => {
  const labels = {
    healthy: "Healthy",
    low: "Low Stock",
    critical: "Critical",
    out_of_stock: "Out of Stock",
  };
  return labels[status] || status;
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(
    Number(value || 0)
  );
