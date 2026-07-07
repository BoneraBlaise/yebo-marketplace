/** Standard Prompt Composition context — Phase 8B.3 */

export const createPromptContext = (partial = {}) => ({
  system: partial.system ?? null,
  conversation: partial.conversation ?? null,
  history: partial.history ?? [],
  memory: partial.memory ?? null,
  knowledge: partial.knowledge ?? null,
  user: partial.user ?? "",
  provider: partial.provider ?? null,
  metadata: partial.metadata ?? {},
});

export default createPromptContext;
