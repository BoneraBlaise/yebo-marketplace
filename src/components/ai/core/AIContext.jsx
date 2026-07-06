/**
 * Backward-compatible bridge to YIP (Yebone Intelligence Platform).
 * UI components import from here; logic lives in src/ai/.
 */
export {
  YIPProvider as AIProvider,
  useYIP as useAI,
  useYIPOptional as useAIOptional,
} from "../../../ai/core/YIPProvider";
