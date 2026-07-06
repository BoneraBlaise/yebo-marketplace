# YIP — Yebone Intelligence Platform

**Public assistant:** YEBO  
**Internal platform:** YIP (Yebone Intelligence Platform)

YIP is the permanent, provider-independent AI foundation for Yebone. All AI capabilities — search, recommendations, try-on, vendor insights, admin analytics — plug into YIP without changing pages, Redux, or business logic.

---

## Architecture Overview

```
src/ai/
├── config/          # Central configuration & feature flags
├── core/            # Provider, session, conversation, registry, events
├── providers/       # Adapter interfaces (Mock, OpenAI, Gemini, Claude, Local)
├── prompts/         # Prompt template library (architecture only)
├── memory/          # Session memory (conversation, cart, wishlist, etc.)
├── context/         # Scoped context engine per surface
├── hooks/           # useYIP, useYIPContext, useYIPFeature, useYIPStreaming
├── components/      # YEBOErrorState, YIPStreamingIndicator
├── utils/           # Errors, streaming, analytics
└── types/           # JSDoc type definitions
```

UI lives in `src/components/ai/` and consumes YIP through a thin bridge (`AIProvider` = `YIPProvider`).

---

## Provider System

Applications **never** import OpenAI, Gemini, or Claude SDKs directly.

| Adapter | Status | Purpose |
|---------|--------|---------|
| `MockAdapter` | Active (default) | Presentation preview, local dev |
| `OpenAIAdapter` | Interface only | Future OpenAI integration |
| `GeminiAdapter` | Interface only | Future Google Gemini |
| `ClaudeAdapter` | Interface only | Future Anthropic Claude |
| `LocalAdapter` | Interface only | Future on-device models |

Switch providers via config:

```js
import { YIPConfig } from 'src/ai';

YIPConfig.set({ provider: 'mock', mockMode: true });
```

Use `createProviderAdapter(id)` from `src/ai/providers` — never instantiate SDK clients in UI code.

---

## Prompt Library

`YIPPromptLibrary` registers template stubs for:

- Shopping, Recommendations, Comparison, Outfit
- Vendor, Admin, Search, Support, Product Summary

Templates define `id`, `category`, `variables`, and `template: null` until real prompts are authored. Render via `YIPPromptLibrary.render(id, variables)` when ready.

---

## Memory

`YIPMemory` stores in-session context (legacy facade). **Phase 7D** adds the full **YEBO Memory Engine** — see [`docs/YEBO_MEMORY_ENGINE.md`](./YEBO_MEMORY_ENGINE.md).

- Conversation history
- Visited products
- Recent searches
- Wishlist / cart context
- Recently viewed
- Customer preferences
- Shopping scope & cross-page continuity

Access via `useYEBOMemory()` or `useYIP().memoryEngine`. Future: persist to backend without UI changes.

---

## Context Engine

`YIPContextEngine` builds scoped payloads for:

| Scope | Surface |
|-------|---------|
| `homepage` | Home |
| `search` | Products / search |
| `product` | Product details |
| `cart` | Cart drawer |
| `checkout` | Checkout |
| `customer-dashboard` | Profile |
| `vendor-dashboard` | Seller dashboard |
| `admin-dashboard` | Admin |
| `mobile` | Future mobile app |

```js
const { setActiveContext } = useYIP();
setActiveContext('product', { productId: '123', category: 'Fashion' });
```

---

## Feature Registry

`YIPRegistry` registers future modules:

Search, Recommendations, Try-On, Stylist, Assistant, Vendor Insights, Admin Insights, Fraud, Image Search, Voice.

Status: `planned` | `beta` | `active` | `disabled`

---

## Configuration

`YIPConfig` centralizes:

- Provider, model, temperature, streaming
- Language, region, environment
- Feature flags (`ai-search`, `ai-assistant`, etc.)
- Mock mode (default: `true`)

---

## Events & Analytics

- `YIPEvents` — pub/sub for session, messages, streaming, errors
- `YIPAnalytics` — in-memory event buffer (searches, assistant, try-on, vendor/admin insights)

Future: pipe `YIPAnalytics.getEvents()` to backend.

---

## Error Handling

`createYIPError(code)` supports:

- `provider_unavailable`
- `rate_limit`
- `timeout`
- `network`
- `unknown`

UI: `<YEBOErrorState error={lastError} onRetry={...} />`

---

## Streaming

Architecture prepared via:

- `adapter.stream()` async generator (MockAdapter simulates word chunks)
- `consumeStream()` utility
- `useYIPStreaming()` hook
- `YIPStreamingIndicator` component

Enable with `YIPConfig.set({ streaming: true, featureFlags: { 'ai-streaming': true } })`.

---

## Future Integration Guide

1. Implement adapter `connect()` and `complete()` with real API (keep interface).
2. Set `YIPConfig.set({ provider: 'openai', mockMode: false })`.
3. Add prompt strings to `prompts/templates/`.
4. Wire `YIPAnalytics` to your backend.
5. Optionally persist `YIPMemory` server-side.

**No page or Redux changes required.**

---

## UI Bridge

```jsx
// App.js
import { AIProvider, GlobalAIFab } from './components/ai';

<AIProvider>  {/* wraps YIPProvider */}
  <Routes ... />
  <GlobalAIFab />
</AIProvider>
```

Direct YIP access:

```jsx
import { useYIP, YIP_SCOPES } from 'src/ai';
```

---

## Naming

| Context | Name |
|---------|------|
| User-facing assistant | **YEBO** |
| Internal platform | **YIP** |
| Tagline | Powered by YIP |

Examples: "Ask YEBO", "YEBO is thinking...", "YEBO recommends...", "Chat with YEBO"
