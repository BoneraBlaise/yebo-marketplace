import { createAgentManager } from "./AgentManager";

/** Main agent platform — final business layer before AI providers */
export class AgentPlatform {
  constructor(deps = {}) {
    this.manager = createAgentManager(deps);
    this.registry = this.manager.registry;
    this.router = this.manager.router;
    this.pipeline = this.manager.pipeline;
  }

  routeTask(input, options) {
    return this.manager.routeTask(input, options);
  }

  getAgent(id) {
    return this.manager.getAgent(id);
  }

  getAgents() {
    return this.manager.getAgents();
  }

  getAgentCapabilities(agentId) {
    return this.manager.getAgentCapabilities(agentId);
  }

  executeAgent(input, options = {}) {
    return this.manager.executeAgent(input, options);
  }

  getSnapshot() {
    return {
      agents: this.getAgents(),
      agentCount: this.getAgents().length,
      mock: true,
    };
  }
}

export const createAgentPlatform = (deps) => new AgentPlatform(deps);

export default AgentPlatform;
