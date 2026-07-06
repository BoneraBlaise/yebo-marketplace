/** Bridge Phase 7G orchestration to Phase 8A.1 Provider SDK — extend only */
import { getProviderFactory } from "../providers/ProviderFactory";

export const connectOrchestrationToSDK = (orchestrator, config = {}) => {
  const factory = getProviderFactory();
  if (!factory._initialized) {
    factory.initialize();
  }

  orchestrator.sdkFactory = factory;
  orchestrator.getSDKProvider = (id) => factory.getProvider(id);
  orchestrator.getSDKSnapshot = () => factory.getSnapshot();

  const originalSwitch = orchestrator.switchProvider.bind(orchestrator);
  orchestrator.switchProvider = (id) => {
    const result = originalSwitch(id);
    try {
      factory.switchProvider(id);
    } catch {
      /* SDK may not know orchestration-only ids */
    }
    return result;
  };

  return orchestrator;
};

export default connectOrchestrationToSDK;
