import React, { createContext, useContext, useMemo, useEffect } from "react";
import { createProviderFactory } from "./ProviderFactory";
import { mergeProviderConfig } from "./ProviderConfig";

const ProviderSDKContext = createContext(null);

/** Optional React context for Provider SDK — extends YIP, does not replace it */
export const ProviderSDKProvider = ({ children, config = {} }) => {
  const factory = useMemo(
    () => createProviderFactory(mergeProviderConfig(config)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    factory.initialize();
    return () => {
      factory.shutdown();
    };
  }, [factory]);

  const value = useMemo(
    () => ({
      providerFactory: factory,
      providerRegistry: factory.registry,
      providerHealth: factory.getHealthMonitor(),
      providerUsage: factory.getUsageTracker(),
      providerConfiguration: factory.getConfiguration(),
      getProvider: (id) => factory.getProvider(id),
      switchProvider: (id) => factory.switchProvider(id),
    }),
    [factory]
  );

  return (
    <ProviderSDKContext.Provider value={value}>{children}</ProviderSDKContext.Provider>
  );
};

export const useProviderSDKContext = () => useContext(ProviderSDKContext);

export default ProviderSDKProvider;
