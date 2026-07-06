import { useMemo } from "react";
import { useYIPOptional } from "./useYIP";
import { SHOPPING_SCOPES } from "../memory/YEBOShoppingContext";
import { SCORE_TYPE } from "../intelligence/IntelligenceTypes";

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

export const useRankedRecommendations = (scope = "homepage") => {
  const yip = useYIPOptional();
  const mapped = SCOPE_MAP[scope] || scope;
  return useMemo(() => {
    if (!yip?.getRankedRecommendations) return [];
    return yip.getRankedRecommendations(mapped);
  }, [yip, mapped]);
};

export const useShoppingScore = (type = SCORE_TYPE.PURCHASE_LIKELIHOOD, scope = "homepage") => {
  const yip = useYIPOptional();
  const mapped = SCOPE_MAP[scope] || scope;
  return useMemo(() => {
    if (!yip?.getShoppingScore) return null;
    return yip.getShoppingScore(type, mapped);
  }, [yip, type, mapped]);
};

export const useIntelligenceConfidence = (recommendationId, scope = "homepage") => {
  const yip = useYIPOptional();
  const mapped = SCOPE_MAP[scope] || scope;
  return useMemo(() => {
    if (!recommendationId || !yip?.getConfidence) return null;
    return yip.getConfidence(recommendationId, mapped);
  }, [yip, recommendationId, mapped]);
};

export const useIntelligenceRecommendationReason = (recommendationId) => {
  const yip = useYIPOptional();
  return useMemo(() => {
    if (!recommendationId || !yip?.getRecommendationReason) return null;
    return yip.getRecommendationReason(recommendationId);
  }, [yip, recommendationId]);
};

export const usePersonalization = () => {
  const yip = useYIPOptional();
  return useMemo(() => yip?.getPersonalization?.() || null, [yip]);
};

export default {
  useRankedRecommendations,
  useShoppingScore,
  useIntelligenceConfidence,
  useIntelligenceRecommendationReason,
  usePersonalization,
};
