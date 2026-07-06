import { useMemo } from "react";
import { useYIPOptional } from "./useYIP";

export const useCurrentProvider = () => {
  const yip = useYIPOptional();
  return useMemo(() => yip?.currentProvider ?? null, [yip]);
};

export const useAvailableProviders = () => {
  const yip = useYIPOptional();
  return useMemo(() => yip?.getAvailableProviders?.() ?? [], [yip]);
};

export const useProviderHealth = (providerId) => {
  const yip = useYIPOptional();
  return useMemo(() => {
    if (!yip?.getProviderHealth) return null;
    return yip.getProviderHealth(providerId);
  }, [yip, providerId]);
};

export default {
  useCurrentProvider,
  useAvailableProviders,
  useProviderHealth,
};
