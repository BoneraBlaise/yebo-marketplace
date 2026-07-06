import { useMemo } from "react";
import { useYIPOptional } from "./useYIP";

export const useDecisionReason = (decisionId) => {
  const yip = useYIPOptional();
  return useMemo(() => {
    if (!decisionId || !yip?.getDecisionReason) return null;
    return yip.getDecisionReason(decisionId);
  }, [yip, decisionId]);
};

export default useDecisionReason;
