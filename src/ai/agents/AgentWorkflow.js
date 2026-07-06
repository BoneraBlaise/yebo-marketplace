import { agentEvents, AGENT_EVENT } from "./AgentEvents";

/** Agent collaboration chains — architecture only */
export const COLLABORATION_CHAINS = {
  shopping_flow: ["shopping", "fashion", "recommendation", "checkout"],
  vendor_flow: ["vendor", "inventory", "pricing"],
  marketing_flow: ["marketing", "analytics"],
  referral_flow: ["referral", "commission"],
};

export class AgentWorkflow {
  constructor({ registry, config }) {
    this.registry = registry;
    this.config = config;
  }

  resolveCollaborators(agent) {
    if (!this.config.collaborationEnabled) return [];
    return (agent.collaborators || [])
      .slice(0, this.config.maxCollaborators)
      .map((id) => this.registry.get(id))
      .filter(Boolean);
  }

  runCollaboration(primaryAgent, taskType, input, context, executeFn) {
    const collaborators = this.resolveCollaborators(primaryAgent);
    const chain = [primaryAgent, ...collaborators];

    agentEvents.emit(AGENT_EVENT.COLLABORATION, {
      primary: primaryAgent.id,
      chain: chain.map((a) => a.id),
    });

    const results = [];
    for (const agent of chain) {
      const bridges = context.buildBridges(input);
      const result = executeFn(agent, taskType, input, bridges);
      results.push({ agentId: agent.id, result });
    }

    return {
      primary: results[0],
      collaborators: results.slice(1),
      chain: chain.map((a) => a.name),
      mock: true,
    };
  }
}

export const createAgentWorkflow = (deps) => new AgentWorkflow(deps);

export default AgentWorkflow;
