/** Agent plan structure — mock planning only */
export const createAgentPlan = ({
  goal,
  steps = [],
  requiredKnowledge = [],
  requiredDecisions = [],
  requiredIntelligence = [],
  expectedResponse = "",
}) => ({
  goal,
  steps,
  requiredKnowledge,
  requiredDecisions,
  requiredIntelligence,
  expectedResponse,
  mock: true,
  createdAt: new Date().toISOString(),
});

export default { createAgentPlan };
