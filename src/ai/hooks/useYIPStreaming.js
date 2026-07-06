import { useYIP } from "./useYIP";

export const useYIPStreaming = () => {
  const { isStreaming, partialResponse, isTyping } = useYIP();
  return { isStreaming, partialResponse, isTyping };
};

export default useYIPStreaming;
