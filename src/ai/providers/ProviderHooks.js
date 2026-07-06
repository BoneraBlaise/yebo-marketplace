import { useMemo, useCallback, useSyncExternalStore } from "react";
import { getProviderFactory } from "./ProviderFactory";
import { sdkProviderEvents, SDK_PROVIDER_EVENT } from "./ProviderEvents";

const subscribe = (cb) => {
  const events = [
    SDK_PROVIDER_EVENT.INITIALIZED,
    SDK_PROVIDER_EVENT.CHAT,
    SDK_PROVIDER_EVENT.STREAM_COMPLETE,
    SDK_PROVIDER_EVENT.HEALTH,
    SDK_PROVIDER_EVENT.USAGE,
  ];
  const unsubs = events.map((e) => sdkProviderEvents.on(e, cb));
  return () => unsubs.forEach((u) => u());
};

const getSnapshot = () => getProviderFactory().getSnapshot();

/** React hooks for provider SDK — presentation layer */
export const useProviderSDK = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const factory = useMemo(() => getProviderFactory(), []);

  const getProvider = useCallback((id) => factory.getProvider(id), [factory]);
  const switchProvider = useCallback((id) => factory.switchProvider(id), [factory]);

  return {
    ...snapshot,
    factory,
    getProvider,
    switchProvider,
    providerHealth: factory.getHealthMonitor(),
    providerUsage: factory.getUsageTracker(),
    providerConfiguration: factory.getConfiguration(),
  };
};

export const useActiveProvider = () => {
  const { activeProvider, factory } = useProviderSDK();
  return useMemo(
    () => ({
      id: activeProvider,
      instance: factory.getActiveProvider(),
    }),
    [activeProvider, factory]
  );
};

export default useProviderSDK;
