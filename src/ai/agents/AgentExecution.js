import { agentEvents, AGENT_EVENT } from "./AgentEvents";

/** Mock agent execution lifecycle */
export class AgentExecution {
  run(agent, taskType, input, bridges, config) {
    agentEvents.emit(AGENT_EVENT.EXECUTING, { agentId: agent.id, taskType });

    agent.initialize();
    const understanding = agent.understand(input, taskType);
    const plan = config.planningEnabled ? agent.plan(input, taskType) : null;
    const reasoning = agent.reason(bridges);
    const execution = agent.execute(input, taskType, bridges);
    const summary = agent.summarize(execution);
    const response = agent.respond(execution);

    agentEvents.emit(AGENT_EVENT.COMPLETED, { agentId: agent.id, taskType });

    return {
      agentId: agent.id,
      agentName: agent.name,
      taskType,
      understanding,
      plan,
      reasoning,
      execution,
      summary,
      response,
      knowledgeUsed: execution.knowledgeUsed,
      decisionsUsed: execution.decisionsUsed,
      intelligenceUsed: execution.intelligenceUsed,
      confidence: execution.confidence,
      steps: execution.steps,
      mock: true,
    };
  }
}

export const createAgentExecution = () => new AgentExecution();

export default AgentExecution;
