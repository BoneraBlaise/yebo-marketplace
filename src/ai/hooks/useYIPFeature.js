import { useYIP } from "./useYIP";
import { YIPConfig } from "../config/yipConfig";

export const useYIPFeature = (featureId) => {
  const yip = useYIP();
  const feature = yip.registry.get(featureId);
  const flagKey = featureId === "assistant" ? "ai-assistant" : `ai-${featureId}`;
  const enabled = YIPConfig.isFeatureEnabled(flagKey) || yip.registry.isEnabled(featureId);
  return { feature, enabled, registry: yip.registry };
};

export default useYIPFeature;
