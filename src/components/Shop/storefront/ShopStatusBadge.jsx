import React from "react";
import { SHOP_STATUS_LABELS } from "../../../utils/shopStorefrontUtils";

const ShopStatusBadge = ({ status = "open", className = "" }) => {
  const config = SHOP_STATUS_LABELS[status] || SHOP_STATUS_LABELS.open;

  return (
    <span
      className={`shop-hero__status shop-hero__status--${config.tone} ${className}`}
      role="status"
      aria-label={`Shop is ${config.label.toLowerCase()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
      {config.label}
    </span>
  );
};

export default ShopStatusBadge;
