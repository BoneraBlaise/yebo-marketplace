import React from "react";
import { useSelector } from "react-redux";
import { useMarketplaceMode } from "../../context/MarketplaceModeContext";

const MarketplaceModeSwitch = ({ className = "" }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { mode, switchToCustomerMode, switchToSellerMode } = useMarketplaceMode();

  if (!isAuthenticated || !isSeller) return null;

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-gray-200 dark:border-gray-700 p-0.5 text-xs font-medium ${className}`}
      role="group"
      aria-label="Marketplace mode"
    >
      <button
        type="button"
        className={`px-3 py-1.5 rounded-lg transition ${
          mode === "customer" ? "bg-yebone-primary text-white" : "text-gray-600 dark:text-gray-300"
        }`}
        onClick={switchToCustomerMode}
      >
        Customer
      </button>
      <button
        type="button"
        className={`px-3 py-1.5 rounded-lg transition ${
          mode === "seller" ? "bg-yebone-primary text-white" : "text-gray-600 dark:text-gray-300"
        }`}
        onClick={switchToSellerMode}
      >
        Seller
      </button>
    </div>
  );
};

export default MarketplaceModeSwitch;
