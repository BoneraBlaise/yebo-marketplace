/** Structured mock agent responses */
export const createAgentResponse = ({
  agentId,
  taskType,
  summary,
  content,
  steps = [],
  knowledgeUsed = [],
  decisionsUsed = [],
  intelligenceUsed = [],
  confidence = 82,
  collaborators = [],
}) => ({
  agentId,
  taskType,
  summary,
  content,
  steps,
  knowledgeUsed,
  decisionsUsed,
  intelligenceUsed,
  confidence,
  collaborators,
  mock: true,
  timestamp: new Date().toISOString(),
});

export default { createAgentResponse };
