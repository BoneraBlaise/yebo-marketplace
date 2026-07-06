import { useMemo } from "react";
import { useYIPOptional } from "./useYIP";
import { SHOPPING_SCOPES } from "../memory/YEBOShoppingContext";

export const useShoppingDecision = (scope = SHOPPING_SCOPES.HOMEPAGE) => {
  const yip = useYIPOptional();
  return useMemo(() => {
    if (!yip?.decisionEngine) return { decisions: [], top: null, reason: null };
    const decisions = yip.getRecommendations(scope);
    const top = yip.decisionEngine.getTopDecision(scope);
    return {
      decisions,
      top,
      reason: top ? yip.getDecisionReason(top.id) : null,
    };
  }, [yip, scope]);
};

export default useShoppingDecision;
