/** Prompt compression for context windows — Phase 8C */

export const compressText = (text = "", maxLength = 2000) => {
  const str = String(text || "");
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
};

export const compressObject = (obj, maxLength = 1500) => {
  if (!obj) return null;
  const serialized = JSON.stringify(obj);
  if (serialized.length <= maxLength) return obj;

  if (Array.isArray(obj)) {
    return obj.slice(0, Math.max(1, Math.floor(maxLength / 100)));
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj).slice(0, 5);
    return Object.fromEntries(entries);
  }

  return compressText(serialized, maxLength);
};

export class PromptCompressor {
  compress(context = {}) {
    return {
      ...context,
      memory: compressObject(context.memory),
      knowledge: compressObject(context.knowledge),
      reasoning: compressObject(context.reasoning),
    };
  }
}

export const createPromptCompressor = () => new PromptCompressor();

export default PromptCompressor;
