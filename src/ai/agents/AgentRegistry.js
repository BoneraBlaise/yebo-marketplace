import { MOCK_BUSINESS_AGENTS } from "./MockAgents";
import { agentEvents, AGENT_EVENT } from "./AgentEvents";
import { getAgentCapabilities } from "./AgentCapabilities";

/** Registry of business capability agents */
export class AgentRegistry {
  constructor() {
    this.agents = new Map();
    this._seed();
  }

  _seed() {
    MOCK_BUSINESS_AGENTS.forEach((agent) => this.register(agent));
  }

  register(agent) {
    this.agents.set(agent.id, agent);
    agentEvents.emit(AGENT_EVENT.REGISTERED, { agentId: agent.id });
    return agent;
  }

  get(id) {
    return this.agents.get(id) || null;
  }

  list() {
    return [...this.agents.values()].map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      capabilities: getAgentCapabilities(a.id),
      priority: a.priority,
      supportedTasks: a.supportedTasks,
      supportedDomains: a.supportedDomains,
      status: a.status,
      collaborators: a.collaborators,
    }));
  }

  findByTask(taskType) {
    return [...this.agents.values()]
      .filter((a) => a.supportedTasks.includes(taskType))
      .sort((a, b) => b.priority - a.priority);
  }
}

export const createAgentRegistry = () => new AgentRegistry();

export default AgentRegistry;
