import { useYIP } from "./useYIP";

export const useYIPContext = (scope, data) => {
  const yip = useYIP();
  return {
    context: yip.contextEngine.get(scope),
    setContext: () => yip.setActiveContext(scope, data),
    engine: yip.contextEngine,
  };
};

export default useYIPContext;
