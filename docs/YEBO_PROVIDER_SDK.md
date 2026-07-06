# YEBO AI Provider SDK — Phase 8A.1

Architecture-only foundation for real AI provider integration in Phase 8A.2+.

## Overview

The Provider SDK lives under `src/ai/providers/` and prepares YEBO for Gemini, OpenAI, Claude, Fashion AI, and Local LLM adapters without real SDK imports, API keys, or network calls.

```
YIPProvider
├── Legacy adapters (Phase 7A) — chat panel complete/stream
├── AIOrchestrator (Phase 7G) — routing, fallback, mock pipeline
└── ProviderFactory (Phase 8A.1) — unified SDK lifecycle
    ├── ProviderRegistry
    ├── ProviderHealthMonitor
    ├── ProviderUsageTracker
    └── BaseProvider → Gemini | OpenAI | Claude | Fashion | Local
```

## Provider lifecycle

1. **initialize** — mock warm-up, emit `sdk:initialized`
2. **health** — returns `healthy | degraded | unavailable | offline`
3. **chat** — mock text response + token estimate
4. **stream** — `ProviderStream`: start → next → complete | cancel
5. **usage** — request count, tokens, cost, latency (mock)
6. **shutdown** — cancel active streams, mark offline

## BaseProvider interface

Every adapter extends `BaseProvider` and implements:

| Method | Purpose |
|--------|---------|
| `initialize()` | Mock setup |
| `chat(input)` | Text completion |
| `stream(input)` | Streaming controller |
| `embeddings(input)` | Mock vector |
| `vision(input)` | Mock image analysis |
| `generateImage(prompt)` | Mock image URL |
| `health()` | Status snapshot |
| `usage()` | Per-provider counters |
| `shutdown()` | Cleanup |

## Factory

```javascript
import { getProviderFactory, getProvider } from "./providers/providerFactory";

const factory = getProviderFactory();
await factory.initialize();

getProvider("gemini");
getProvider("openai");
getProvider("claude");
getProvider("fashion");
getProvider("local");
```

## Streaming

`ProviderStream` (mock): `start()` → `next()` → `complete()` | `cancel()`.

## Health

`ProviderHealthMonitor`: `healthy`, `degraded`, `unavailable`, `offline`.

## Usage tracking

Mock metrics: tokens, cost, latency, duration, request count, streaming status.

## Configuration

See `ProviderConfig.js` and `.env.example` for Phase 8A.2 key placeholders.

## YIP integration

`YIPProvider` exposes `providerFactory`, `providerHealth`, `providerUsage`, `providerConfiguration`, `getProvider()`, and syncs `switchProvider()` with orchestration via `OrchestrationSDKBridge.js`.

## Future integration (Phase 8A.2+)

Replace mock bodies inside provider adapters only — no architectural redesign. Add API keys from `.env.example` and wire real SDK calls in `GeminiProvider`, `OpenAIProvider`, etc.
