import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../../server";
import { emitShopStatusUpdate } from "../../../hooks/useShopStorefront";
import { SHOP_STATUS_LABELS } from "../../../utils/shopStorefrontUtils";
import "./shopStorefront.css";

const STATUS_ORDER = ["open", "closed", "busy", "vacation"];

const ShopStatusToggle = ({ shopId, value = "open", onChange }) => {
  const [loading, setLoading] = useState(false);

  const handleSelect = async (status) => {
    if (status === value || loading) return;
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/shop/update-shop-status`,
        { businessStatus: status },
        { withCredentials: true }
      );
      onChange?.(data.businessStatus);
      emitShopStatusUpdate(shopId, data.businessStatus);
      toast.success(`Status set to ${SHOP_STATUS_LABELS[status]?.label || status}`);
    } catch {
      toast.error("Unable to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shop-status-toggle" role="group" aria-label="Business status">
      {STATUS_ORDER.map((status) => {
        const active = value === status;
        return (
          <button
            key={status}
            type="button"
            role="switch"
            aria-checked={active}
            disabled={loading}
            className={`shop-status-toggle__option shop-status-toggle__option--${status}${
              active ? " is-active" : ""
            }`}
            onClick={() => handleSelect(status)}
          >
            <span className="shop-status-toggle__knob" aria-hidden="true" />
            {SHOP_STATUS_LABELS[status].label}
          </button>
        );
      })}
    </div>
  );
};

export default ShopStatusToggle;
