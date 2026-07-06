import { useMemo } from "react";
import { useYIPOptional } from "./useYIP";
import { SHOPPING_SCOPES } from "../memory/YEBOShoppingContext";

export const useVendorDecision = () => {
  const yip = useYIPOptional();
  return useMemo(() => {
    if (!yip?.decisionEngine) return { decisions: [], top: null };
    const decisions = yip.getRecommendations(SHOPPING_SCOPES.VENDOR_DASHBOARD);
    return { decisions, top: yip.decisionEngine.getTopDecision(SHOPPING_SCOPES.VENDOR_DASHBOARD) };
  }, [yip]);
};

export default useVendorDecision;
