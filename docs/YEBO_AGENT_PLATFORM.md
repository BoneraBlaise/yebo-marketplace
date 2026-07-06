# YEBO Autonomous Agent Platform — Phase 7I

**Public assistant:** YEBO  
**Internal layer:** YIP Agent Platform  
**Status:** Architecture only — business capability agents, mock execution, no live AI

The Agent Platform is the **final business layer** before future AI providers. Agents represent **business capabilities**, not AI providers. No provider should access marketplace data directly — all flows go through Memory → Decision → Intelligence → Orchestration → Knowledge → **Agents** → Future AI Provider.

---

## Architecture

```
YEBO UI
    ↓
Memory → Decision → Intelligence → Orchestration → Knowledge
    ↓
Agent Platform (AgentPlatform)
    ↓
Future AI Provider (OpenAI, Gemini, Claude, Local, Custom)
```

### Folder: `src/ai/agents/`

| Module | Role |
|--------|------|
| `AgentPlatform.js` | Main orchestrator — public API |
| `AgentManager.js` | Lifecycle management |
| `AgentRegistry.js` | Business agent registry |
| `AgentRouter.js` | Task → best agent routing |
| `AgentPipeline.js` | Full execution pipeline |
| `AgentWorkflow.js` | Agent collaboration chains |
| `AgentExecution.js` | Mock execution lifecycle |
| `AgentContext.js` | Upstream layer bridges |
| `AgentMemoryBridge.js` | Read-only memory access |
| `AgentDecisionBridge.js` | Read-only decision access |
| `AgentIntelligenceBridge.js` | Read-only intelligence access |
| `AgentKnowledgeBridge.js` | Read-only knowledge access |
| `MockAgents.js` | 16 business capability agents |
| `AgentTasks.js` | Task type definitions + detection |
| `AgentPlans.js` | Planning structure |
| `AgentResponses.js` | Structured response schema |
| `AgentCapabilities.js` | Capability metadata |
| `AgentProvider.jsx` | Optional React provider |
| `AgentHooks.js` | React context + hooks |

---

## Business Agents

16 reusable agents, each exposing the same interface:

`initialize()` · `understand()` · `plan()` · `reason()` · `execute()` · `summarize()` · `respond()` · `health()` · `shutdown()`

| Agent | ID | Primary tasks |
|-------|-----|---------------|
| Shopping | `shopping` | Find product, improve cart |
| Fashion | `fashion` | Suggest outfit, size, color |
| Search | `search` | Find product, alternatives |
| Recommendation | `recommendation` | Bundles, budget, alternatives |
| Comparison | `comparison` | Compare products |
| Vendor | `vendor` | Recommend vendor, review store |
| Customer Support | `customer_support` | Track order, coupons |
| Admin | `admin` | Store review, inventory |
| Marketing | `marketing` | Marketing insights, coupons |
| Inventory | `inventory` | Stock analysis |
| Pricing | `pricing` | Budget, deals |
| Checkout | `checkout` | Optimize checkout |
| Wishlist | `wishlist` | Build wishlist |
| Commission | `commission` | Earnings guidance |
| Referral | `referral` | Referral program |
| Analytics | `analytics` | Metrics and insights |

---

## Task Routing

`AgentRouter` detects task type from user input via keyword matching (`detectTaskType`), then selects the highest-priority agent supporting that task.

Supported tasks include: find product, compare products, suggest outfit, recommend bundle, find alternative, recommend vendor/size/color/budget, build wishlist, improve cart, optimize checkout, suggest coupon, track order, analyze inventory, review store, marketing insight.

---

## Workflow

```
User Request
    ↓
Agent Router (task detection)
    ↓
Best Agent (+ collaborators)
    ↓
Knowledge Platform (via bridge)
    ↓
Decision + Intelligence (via bridges)
    ↓
Mock Execution (plan → reason → execute)
    ↓
Structured Response
```

---

## Agent Registry

Every agent registers:

- `id`, `name`, `description`
- `capabilities`, `priority`
- `supportedTasks`, `supportedDomains`
- `status`, `collaborators`

Future AI providers query agent output — never marketplace APIs directly.

---

## Collaboration

When `collaborationEnabled`, agents cooperate in chains:

| Chain | Agents |
|-------|--------|
| Shopping flow | Shopping → Fashion → Recommendation → Checkout |
| Vendor flow | Vendor → Inventory → Pricing |
| Marketing flow | Marketing → Analytics |
| Referral flow | Referral → Commission |

---

## Planning

Each agent produces a mock plan:

- **Goal** — task objective  
- **Plan** — execution steps  
- **Required Knowledge** — domain queries  
- **Required Decisions** — decision context needed  
- **Required Intelligence** — ranking/personalization needed  
- **Expected Response** — mock outcome description  

No real AI reasoning — structured mock only.

---

## YIP Provider Integration

`YIPProvider` exposes (without breaking prior APIs):

| Method / Property | Returns |
|-------------------|---------|
| `agentPlatform` | AgentPlatform instance |
| `agentRegistry` | AgentRegistry instance |
| `agentManager` | AgentManager instance |
| `routeTask(input, options)` | Routed agent + task type |
| `getAgent(id)` | Single agent |
| `getAgents()` | All registered agents |
| `getAgentCapabilities(id)` | Capability list |
| `executeAgent(input, options)` | Full execution result |

### React hooks

- `useAgents()`  
- `useAgentCapabilities(agentId)`  
- `useAgentExecution(input)`

---

## UI Consumption

No UI redesign. `YEBOAgentHint` in the YEBO Assistant panel shows:

- Current agent name and task type  
- Execution steps  
- Knowledge used  
- Confidence score  

---

## Future AI Integration

1. **Provider receives agent output** — structured plan + execution + knowledge context  
2. **No direct marketplace access** — providers consume agent responses only  
3. **Real reasoning** — replace mock `plan()` / `reason()` with orchestration adapter calls  
4. **Tool use** — agents become tool definitions for LLM function calling  
5. **Multi-agent** — collaboration chains map to agent handoff protocols  

The stack is designed so swapping mock execution for real AI requires no architectural redesign.

---

## Constraints (unchanged)

- Redux, backend, APIs, database, routes, auth — not modified  
- Business, cart, checkout, payments, referral, commission — not modified  
- Memory Engine (7D) — not modified  
- Decision Engine (7E) — not modified  
- Intelligence Layer (7F) — not modified  
- Orchestration Layer (7G) — not modified  
- Knowledge Platform (7H) — not modified  

Architecture and presentation wiring only.
