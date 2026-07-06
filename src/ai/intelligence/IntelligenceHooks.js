import React, { createContext, useContext } from "react";

export const IntelligenceReactContext = createContext(null);

export const useIntelligenceEngine = () => {
  const ctx = useContext(IntelligenceReactContext);
  return ctx;
};

export const useIntelligenceEngineOptional = () => useContext(IntelligenceReactContext);

export {
  useRankedRecommendations,
  useShoppingScore,
  useIntelligenceConfidence,
  useIntelligenceRecommendationReason,
  usePersonalization,
} from "../hooks/useIntelligence";

export default {
  useIntelligenceEngine,
  useIntelligenceEngineOptional,
};
