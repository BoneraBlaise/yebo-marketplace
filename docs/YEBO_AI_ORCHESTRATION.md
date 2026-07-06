# YEBO AI Orchestration Layer — Phase 7G

**Public assistant:** YEBO  
**Internal layer:** YIP AI Orchestrator  
**Status:** Architecture only — mock providers, no live API calls

The AI Orchestration Layer sits above Memory, Decision, and Intelligence. It provides provider-agnostic routing so YEBO can switch AI backends without changing UI or business logic.

---

## Architecture

```
YEBO UI
    ↓
Memory (YEBOMemoryEngine)
    ↓
Decision (DecisionEngine)
    ↓
Intelligence (YEBOIntelligenceEngine)
    ↓
AI Orchestrator (AIOrchestrator)
    ↓
Provider Selection → Provider Adapter → Mock Response
```

### Folder: `src/ai/orchestration/`

| Module | Role |
|--------|------|
| `AIOrchestrator.js` | Main orchestrator — pipeline + public API |
| `ProviderManager.js` | Adapter lifecycle + routing |
| `ProviderRegistry.js` | Provider metadata registry |
| `ProviderSelector.js` | Selection strategies (auto, manual, fastest, etc.) |
| `ProviderFallback.js` | Automatic failover chain |
| `ProviderHealth.js` | Mock health monitor |
| `ProviderRouter.js` | Request routing (in ProviderManager.js) |
| `ProviderCapabilities.js` | Capability profiles per provider |
| `ProviderPriority.js` | Priority + fallback chain order |
| `ProviderConfig.js` | Single config object |
| `ProviderContext.js` | Read-only bind to upstream engines |
| `MockProviders.js` | Mock adapters (OpenAI, Gemini, Claude, Local, Custom) |
| `ProviderEvents.js` | Pub/sub for provider lifecycle |
| `ProviderProvider.jsx` | Optional React provider |
| `ProviderHooks.js` | React context + hook re-exports |

---

## Provider Lifecycle

1. **Register** — `ProviderRegistry` seeds all mock providers with metadata  
2. **Initialize** — `ProviderManager.initializeAll()` calls `adapter.initialize()`  
3. **Health check** — `ProviderHealth` tracks status per provider  
4. **Select** — `ProviderSelector` picks provider by strategy  
5. **Route** — `ProviderRouter` sends request to adapter  
6. **Fallback** — if unavailable, `ProviderFallback` walks the chain  
7. **Shutdown** — `adapter.shutdown()` on teardown (mock no-op)

---

## Supported Providers (Mock Adapters)

Each adapter implements:

- `initialize()` · `chat()` · `stream()` · `embeddings()` · `vision()` · `moderation()` · `health()` · `capabilities()` · `shutdown()`

| Provider | Default health | Priority |
|----------|----------------|----------|
| OpenAI | Unavailable | 90 |
| Claude | Healthy | 85 |
| Gemini | Degraded | 80 |
| Local | Healthy | 60 |
| Custom | Offline | 40 |
| Mock | Healthy | 10 |

---

## Selection Logic

Strategies in `ProviderSelector`:

| Strategy | Behavior |
|----------|----------|
| Auto | Uses `preferredProvider` from config |
| Manual / Preferred | Explicit provider id |
| Fastest | Prefers local, then first usable |
| Cheapest | Local if usable, else mock |
| Highest Quality | Highest priority usable provider |
| Local Only | Local or mock |

Configuration via single object:

```js
{
  preferredProvider: "mock",
  fallbackEnabled: true,
  streamingEnabled: false,
  localModelEnabled: true,
  offlineMode: false,
  selectionStrategy: "auto",
}
```

---

## Fallback Logic

Default chain (`ProviderPriority.FALLBACK_CHAIN`):

```
OpenAI → Gemini → Claude → Local → Mock
```

When `fallbackEnabled` is true, `ProviderFallback.resolve()` walks the chain and emits `provider:fallback` events. Mock provider is the terminal fallback.

---

## Health Monitoring

`ProviderHealth` tracks mock statuses:

| Status | Meaning |
|--------|---------|
| `healthy` | Provider usable |
| `degraded` | Usable with reduced quality |
| `unavailable` | Temporarily down — skipped in routing |
| `offline` | Not configured — skipped |

Exposed via `getProviderHealth()` on YIPProvider.

---

## YIP Provider Integration

`YIPProvider` exposes (without breaking prior APIs):

| Method / Property | Returns |
|-------------------|---------|
| `orchestrator` | AIOrchestrator instance |
| `providerManager` | ProviderManager instance |
| `providerRegistry` | ProviderRegistry instance |
| `currentProvider` | Active provider metadata + health |
| `switchProvider(id)` | Switches provider (presentation) |
| `getAvailableProviders()` | All registered providers |
| `getProviderHealth(id?)` | Health snapshot |

### React hooks

- `useCurrentProvider()`  
- `useAvailableProviders()`  
- `useProviderHealth(id)`

---

## UI Consumption

No UI redesign. `YEBOProviderStatus` in the YEBO Assistant panel shows:

- Current provider name and health  
- Capability chips (stream, vision, embed, reason)  
- Provider switch buttons (presentation only)

---

## Future API Integration

1. Replace `MockOrchestrationAdapter` with real SDK wrappers in `src/ai/providers/`  
2. Wire `ProviderHealth` to live ping endpoints  
3. Map API keys through `ProviderConfig` (when env vars are added)  
4. Enable `stream()` with real token streaming  
5. Register production providers in `ProviderRegistry` alongside mock  

Memory, Decision, and Intelligence engines remain upstream context sources — orchestration consumes their snapshots read-only.

---

## Constraints (unchanged)

- Redux, backend, APIs, routes, auth — not modified  
- Business, cart, checkout, payments, referral, commission — not modified  
- Memory Engine (7D) — not modified  
- Decision Engine (7E) — not modified  
- Intelligence Layer (7F) — not modified  

Architecture and presentation wiring only.
