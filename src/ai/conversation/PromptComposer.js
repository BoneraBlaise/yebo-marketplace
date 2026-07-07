import { createPromptContext } from "./PromptContext";
import { createSystemPromptManager } from "./SystemPromptManager";
import { logPromptDiagnostics } from "./PromptDiagnostics";

/** Central prompt assembly — no provider calls */
export class PromptComposer {
  constructor({ systemPromptManager = null } = {}) {
    this.systemPromptManager = systemPromptManager || createSystemPromptManager();
    this.lastPromptContext = null;
  }

  compose({ input = "", context = {} } = {}) {
    const startedAt = Date.now();
    const userMessage = String(input || "");
    const history = context.history || [];

    const system = this.systemPromptManager.loadSystemPrompt({
      provider: context.provider,
      organization: context.metadata,
    });

    const memoryBlocks = context.memory ? [context.memory] : [];
    const knowledgeBlocks = context.knowledge ? [context.knowledge] : [];

    const promptContext = createPromptContext({
      system,
      conversation: context.conversation || null,
      history,
      memory: context.memory ?? null,
      knowledge: context.knowledge ?? null,
      user: userMessage,
      provider: context.provider ?? null,
      metadata: {
        ...(context.metadata || {}),
        historyCount: history.length,
        memoryBlockCount: memoryBlocks.length,
        knowledgeBlockCount: knowledgeBlocks.length,
        composedAt: new Date().toISOString(),
      },
    });

    const historyLines = history.map((message) => `${message.role}: ${message.content}`);
    const assembledText = [
      system.instruction,
      ...historyLines,
      memoryBlocks.length ? "[memory-context]" : null,
      knowledgeBlocks.length ? "[knowledge-context]" : null,
      userMessage,
    ]
      .filter(Boolean)
      .join("\n\n");

    const elapsedMs = Date.now() - startedAt;
    logPromptDiagnostics({
      promptSize: assembledText.length,
      historyCount: history.length,
      memoryBlocks: memoryBlocks.length,
      knowledgeBlocks: knowledgeBlocks.length,
      provider: context.provider?.id || null,
      elapsedMs,
    });

    this.lastPromptContext = promptContext;

    return {
      promptContext,
      assembledText,
      /** Provider input format unchanged — raw user message only */
      input: userMessage,
      enriched: false,
    };
  }
}

export const createPromptComposer = (options) => new PromptComposer(options);

export default PromptComposer;
