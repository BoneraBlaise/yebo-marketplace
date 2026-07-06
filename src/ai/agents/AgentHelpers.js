import { createAgentPlan } from "./AgentPlans";
import { createAgentResponse } from "./AgentResponses";

export const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const buildMockPlan = (agent, taskType, input) =>
  createAgentPlan({
    goal: `${agent.name}: handle ${taskType}`,
    steps: [
      "Understand user request",
      "Query knowledge platform",
      "Apply decision + intelligence context",
      "Execute mock business logic",
      "Summarize response",
    ],
    requiredKnowledge: agent.supportedDomains || [],
    requiredDecisions: ["recommendation", "priority"],
    requiredIntelligence: ["ranking", "personalization"],
    expectedResponse: `Mock ${agent.name} response for: ${(input || "").slice(0, 60)}`,
  });

export const buildMockResponse = (agent, taskType, input, bridges = {}) =>
  createAgentResponse({
    agentId: agent.id,
    taskType,
    summary: `[${agent.name}] Mock task completed`,
    content: `${agent.name} would handle "${taskType}" — ${(input || "request").slice(0, 80)}. No live AI was invoked.`,
    steps: ["understand", "plan", "knowledge", "decision", "intelligence", "execute", "respond"],
    knowledgeUsed: bridges.knowledge?.results?.slice?.(0, 2).map((k) => k.title) || [],
    decisionsUsed: bridges.decisions?.slice?.(0, 1).map((d) => d.title) || [],
    intelligenceUsed: bridges.intelligence?.slice?.(0, 1).map((i) => i.title) || [],
    confidence: 75 + Math.floor(Math.random() * 20),
  });

export default { delay, buildMockPlan, buildMockResponse };
