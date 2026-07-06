import { createAgentExecution } from "./AgentExecution";

/** Agent pipeline — route → knowledge → decision → intelligence → execute */
export class AgentPipeline {
  constructor({ router, workflow, execution, context, config }) {
    this.router = router;
    this.workflow = workflow;
    this.execution = execution;
    this.context = context;
    this.config = config;
  }

  process(input, options = {}) {
    const { agent, taskType } = this.router.route(input, options);
    if (!agent) return { error: "No agent available", mock: true };

    const executeFn = (a, tt, inp, bridges) =>
      this.execution.run(a, tt, inp, bridges, this.config);

    if (this.config.collaborationEnabled && options.collaborate !== false) {
      const collaboration = this.workflow.runCollaboration(
        agent,
        taskType,
        input,
        this.context,
        executeFn
      );
      return {
        ...collaboration.primary.result,
        collaboration,
        pipeline: ["route", "knowledge", "decision", "intelligence", "execute", "respond"],
        mock: true,
      };
    }

    const bridges = this.context.buildBridges(input);
    const result = this.execution.run(agent, taskType, input, bridges, this.config);
    return {
      ...result,
      pipeline: ["route", "knowledge", "decision", "intelligence", "execute", "respond"],
      mock: true,
    };
  }
}

export const createAgentPipeline = (deps) => new AgentPipeline(deps);

export default AgentPipeline;
