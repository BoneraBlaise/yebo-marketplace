import React from "react";
import { Badge } from "../ui";
import { getOrderStatusVariant } from "./orderStatus";

const OrderItemsList = ({ items = [], className = "" }) => {
  if (!items.length) {
    return <p className="text-sm text-gray-500">No items in this order.</p>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => {
        const imageUrl = item?.images?.[0]?.url;
        const price = item.discountPrice || item.price || item.originalPrice;

        return (
          <div
            key={`${item._id || index}-${index}`}
            className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            <div className="w-full sm:w-20 h-40 sm:h-20 rounded-xl overflow-hidden bg-yebone-light-gray shrink-0">
              {imageUrl ? (
                <img src={imageUrl} alt={item.name || "Product"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full yebone-skeleton" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold dark:text-white">{item.name}</p>
              <p className="text-yebone-primary font-medium mt-1 text-sm sm:text-base">
                RWF {price} x {item.qty || 1}
              </p>
              {item.shop?.name && (
                <p className="text-xs text-gray-500 mt-1">Seller: {item.shop.name}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const OrderStatusBadge = ({ status }) => (
  <Badge variant={getOrderStatusVariant(status)}>{status || "Unknown"}</Badge>
);

export default OrderItemsList;
