import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { useShoppingDecision } from "../../../ai/hooks/useShoppingDecision";
import { useVendorDecision } from "../../../ai/hooks/useVendorDecision";
import { useAdminDecision } from "../../../ai/hooks/useAdminDecision";
import { useDecisionReason } from "../../../ai/hooks/useDecisionReason";
import { SHOPPING_SCOPES } from "../../../ai/memory/YEBOShoppingContext";
import AICard from "../primitives/AICard";

const SCOPE_MAP = {
  homepage: SHOPPING_SCOPES.HOMEPAGE,
  search: SHOPPING_SCOPES.SEARCH,
  product: SHOPPING_SCOPES.PRODUCT,
  cart: SHOPPING_SCOPES.CART,
  checkout: SHOPPING_SCOPES.CHECKOUT,
  dashboard: SHOPPING_SCOPES.CUSTOMER_DASHBOARD,
  vendor: SHOPPING_SCOPES.VENDOR_DASHBOARD,
  admin: SHOPPING_SCOPES.ADMIN_DASHBOARD,
};

const useDecisionForSurface = (scope) => {
  const mapped = SCOPE_MAP[scope] || scope;
  const shopping = useShoppingDecision(
    scope === "vendor" || scope === "admin" ? SHOPPING_SCOPES.HOMEPAGE : mapped
  );
  const vendor = useVendorDecision();
  const admin = useAdminDecision();
  if (scope === "vendor") return vendor;
  if (scope === "admin") return admin;
  return shopping;
};

/** Exposes top mock decision to existing surfaces — no UI redesign. */
const YEBODecisionHint = ({ scope = "homepage", className, compact = false }) => {
  const { top } = useDecisionForSurface(scope);
  const reason = useDecisionReason(top?.id);

  if (!top) return null;

  if (compact) {
    return (
      <p className={`text-[11px] text-gray-500 ${className || ""}`}>
        <span className="font-semibold text-yebone-primary">YEBO:</span> {top.title}
        {reason && <span className="block mt-0.5 italic">{reason}</span>}
      </p>
    );
  }

  return (
    <AICard className={className} padding="sm" glass>
      <div className="flex items-start gap-2">
        <HiOutlineSparkles className="text-yebone-gold shrink-0 mt-0.5" size={16} />
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-yebone-primary mb-1">
            YEBO recommends
          </p>
          <p className="text-xs font-semibold dark:text-white">{top.title}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{top.description}</p>
          {reason && <p className="text-[10px] text-yebone-primary/80 mt-1 italic">{reason}</p>}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-yebone-primary rounded-full"
                style={{ width: `${top.confidence || 80}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-yebone-primary">{top.confidence}%</span>
          </div>
        </div>
      </div>
    </AICard>
  );
};

export default YEBODecisionHint;
