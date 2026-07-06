import { useMemo } from "react";
import { useYIPOptional } from "./useYIP";
import { SHOPPING_SCOPES } from "../memory/YEBOShoppingContext";

export const useRecommendation = (scope = SHOPPING_SCOPES.HOMEPAGE) => {
  const yip = useYIPOptional();
  return useMemo(() => {
    if (!yip?.getRecommendations) return [];
    return yip.getRecommendations(scope);
  }, [yip, scope]);
};

export default useRecommendation;
