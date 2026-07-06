import { detectTaskType } from "./AgentTasks";
import { agentEvents, AGENT_EVENT } from "./AgentEvents";

/** Routes user requests to the best business agent */
export class AgentRouter {
  constructor({ registry, config }) {
    this.registry = registry;
    this.config = config;
  }

  route(input, options = {}) {
    const taskType = options.taskType || detectTaskType(input);
    const candidates = this.registry.findByTask(taskType);
    const agent = options.agentId
      ? this.registry.get(options.agentId)
      : candidates[0] || this.registry.get("shopping");

    agentEvents.emit(AGENT_EVENT.ROUTED, { agentId: agent?.id, taskType, input });
    return { agent, taskType, input };
  }
}

export const createAgentRouter = (deps) => new AgentRouter(deps);

export default AgentRouter;
