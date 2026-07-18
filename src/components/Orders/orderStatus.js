export const ORDER_STATUS_VARIANTS = {
  Processing: "outline",
  "Transferred to delivery partner": "outline",
  Shipping: "outline",
  Received: "outline",
  "On the way": "outline",
  Delivered: "primary",
  "Processing refund": "gold",
  "Refund Success": "gold",
};

export const getOrderStatusVariant = (status = "") =>
  ORDER_STATUS_VARIANTS[status] || "muted";

export const getOrderStatusMessage = (status = "") => {
  if (!status) return "Loading order status...";
  if (status === "Processing") return "Your order is being processed by the seller.";
  if (status === "Transferred to delivery partner") {
    return "Your order is on the way to our delivery partner.";
  }
  if (status === "Shipping") return "Your order is with our delivery partner.";
  if (status === "Received") return "Your order is in your city.";
  if (status === "On the way") return "Our delivery partner is on the way.";
  if (status === "Delivered") return "Your order has been delivered.";
  if (status === "Processing refund") return "Your refund is being processed.";
  if (status === "Refund Success") return "Your refund was successful.";
  return status;
};

export const FULFILLMENT_STATUSES = [
  "Processing",
  "Transferred to delivery partner",
  "Shipping",
  "Received",
  "On the way",
  "Delivered",
];

export const REFUND_STATUSES = ["Processing refund", "Refund Success"];

export const getFulfillmentOptions = (currentStatus) => {
  const index = FULFILLMENT_STATUSES.indexOf(currentStatus);
  if (index === -1) return [...FULFILLMENT_STATUSES];
  return FULFILLMENT_STATUSES.slice(index);
};

export const getRefundOptions = (currentStatus) => {
  const index = REFUND_STATUSES.indexOf(currentStatus);
  if (index === -1) return [...REFUND_STATUSES];
  return REFUND_STATUSES.slice(index);
};

export const canCancelOrder = (status) => status === "Processing";

export const canRequestRefund = (status) => status === "Delivered";
