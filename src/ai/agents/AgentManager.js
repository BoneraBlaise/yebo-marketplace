import { createAgentRegistry } from "./AgentRegistry";
import { createAgentRouter } from "./AgentRouter";
import { createAgentWorkflow } from "./AgentWorkflow";
import { createAgentExecution } from "./AgentExecution";
import { createAgentPipeline } from "./AgentPipeline";
import { AgentContext } from "./AgentContext";
import { mergeAgentConfig } from "./AgentConfig";
import { getAgentCapabilities } from "./AgentCapabilities";

/** Manages agent platform lifecycle */
export class AgentManager {
  constructor(deps = {}) {
    this.config = mergeAgentConfig(deps.config);
    this.registry = createAgentRegistry();
    this.context = new AgentContext(deps);
    this.router = createAgentRouter({ registry: this.registry, config: this.config });
    this.workflow = createAgentWorkflow({ registry: this.registry, config: this.config });
    this.execution = createAgentExecution();
    this.pipeline = createAgentPipeline({
      router: this.router,
      workflow: this.workflow,
      execution: this.execution,
      context: this.context,
      config: this.config,
    });
  }

  getAgent(id) {
    return this.registry.get(id);
  }

  getAgents() {
    return this.registry.list();
  }

  getAgentCapabilities(agentId) {
    const agent = agentId ? this.registry.get(agentId) : null;
    return agent ? getAgentCapabilities(agent.id) : getAgentCapabilities("shopping");
  }

  routeTask(input, options) {
    return this.router.route(input, options);
  }

  executeAgent(input, options) {
    return this.pipeline.process(input, options);
  }
}

export const createAgentManager = (deps) => new AgentManager(deps);

export default AgentManager;
