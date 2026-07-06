# YEBO Enterprise Knowledge Platform — Phase 7H (RAG-Ready)

**Public assistant:** YEBO  
**Internal layer:** YIP Knowledge Platform  
**Status:** Architecture only — mock documents, no vector DB, no embeddings, no live AI

The Enterprise Knowledge Platform is the **single knowledge source** for every future AI provider. No provider should access marketplace data directly — all knowledge flows through this layer.

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
Orchestration (AIOrchestrator)
    ↓
Knowledge Platform (KnowledgeEngine)
    ↓
Future AI Provider (OpenAI, Gemini, Claude, Local, Custom)
```

### Folder: `src/ai/knowledge/`

| Module | Role |
|--------|------|
| `KnowledgeEngine.js` | Main orchestrator — public API |
| `KnowledgeManager.js` | Lifecycle management |
| `KnowledgeRegistry.js` | Domain + document registry |
| `KnowledgeIndex.js` | Central query index for providers |
| `KnowledgeSearch.js` | Domain-specific search methods |
| `KnowledgePipeline.js` | Sources → normalize → relationships → rank → search |
| `KnowledgeRouter.js` | Query routing |
| `KnowledgeCache.js` | In-memory mock cache |
| `KnowledgeSources.js` | 20 domain modules |
| `KnowledgeFilters.js` | Domain, visibility, tag filters |
| `KnowledgeRanking.js` | Relevance ranking |
| `KnowledgeSnapshot.js` | Immutable snapshots for providers |
| `KnowledgeStatistics.js` | Corpus statistics |
| `KnowledgeContext.js` | Read-only upstream bind |
| `MockKnowledge.js` | Mock document corpus |
| `KnowledgeProvider.jsx` | Optional React provider |
| `KnowledgeHooks.js` | React hooks |

---

## Knowledge Domains

20 reusable domain modules, each exposing:

- `getDomainId()` · `getDocuments()` · `search(query)` · `getById(id)` · `getRelationships(id)`

| Domain | ID |
|--------|-----|
| Product | `product` |
| Vendor | `vendor` |
| Customer | `customer` |
| Order | `order` |
| Review | `review` |
| Category | `category` |
| Brand | `brand` |
| Fashion | `fashion` |
| Marketplace | `marketplace` |
| Commission | `commission` |
| Referral | `referral` |
| Shipping | `shipping` |
| Returns | `returns` |
| Policy | `policy` |
| FAQ | `faq` |
| Search | `search` |
| Flash Sale | `flash_sale` |
| Auction | `auction` |
| Event | `event` |
| Support | `support` |

---

## Knowledge Document

Every object shares one structure:

```js
{
  id, domain, title, summary, content,
  keywords, tags, relationships, metadata,
  lastUpdated, confidence, priority, visibility
}
```

Created via `createKnowledgeDocument()` in `KnowledgeHelpers.js`. Mock data only — no backend.

---

## Knowledge Relationships

Documents link across domains:

```
Product → Category → Brand → Vendor → Reviews
    ↓
Shipping → FAQ → Policy → Commission → Related Products
```

Resolved at query time via `resolveRelationships()` and enriched in `KnowledgePipeline`.

---

## Search Architecture

`KnowledgeSearch` exposes:

| Method | Domain |
|--------|--------|
| `search()` | All domains |
| `searchProducts()` | Product |
| `searchVendors()` | Vendor |
| `searchPolicies()` | Policy |
| `searchFAQ()` | FAQ |
| `searchMarketplace()` | Marketplace |
| `searchFashion()` | Fashion |
| `searchShipping()` | Shipping |
| `searchCommission()` | Commission |
| `searchEvents()` | Event |
| `searchAuctions()` | Auction |

Returns mock structured results with scores. Mock cache via `KnowledgeCache`.

---

## Knowledge Pipeline

```
Marketplace (mock sources)
    ↓
Knowledge Sources (domain modules)
    ↓
Normalization (query + filters)
    ↓
Relationships (cross-domain links)
    ↓
Ranking (relevance + priority)
    ↓
Search (structured results)
    ↓
Knowledge Result
```

---

## YIP Provider Integration

`YIPProvider` exposes (without breaking prior APIs):

| Method / Property | Returns |
|-------------------|---------|
| `knowledgeEngine` | KnowledgeEngine instance |
| `knowledgeRegistry` | KnowledgeRegistry instance |
| `knowledgeSearch` | KnowledgeSearch instance |
| `knowledgeSnapshot()` | Immutable snapshot |
| `searchKnowledge(query, options)` | Pipeline search results |
| `getKnowledge(id)` | Single document |
| `getKnowledgeDomains()` | Registered domains |

### React hooks

- `useKnowledgeSearch(query, options)`  
- `useKnowledgeDomains()`  
- `useKnowledgeSnapshot()`

---

## UI Consumption

No UI redesign. `YEBOKnowledgeHint` in the YEBO Assistant panel displays mock knowledge cards (domain count, top results).

---

## Future Integration Paths

### Vector Database

Replace `KnowledgeIndex` query with vector similarity search. Documents remain the same schema; index stores embedding references when added.

### Embeddings

Add `KnowledgeEmbeddings.js` module that calls orchestration adapters' `embeddings()` method. Pipeline stage: embed query → vector search → rank.

### RAG (Retrieval-Augmented Generation)

```
User query
    ↓
Knowledge Pipeline (retrieve top-k documents)
    ↓
Context assembly (relationships + upstream memory/decision/intelligence)
    ↓
Orchestration → AI Provider (with knowledge context injected)
    ↓
Grounded response
```

### AI Provider Integration

Providers receive knowledge via `knowledgeSnapshot()` and `searchKnowledge()` — never direct marketplace API access. Swap providers through orchestration without redesigning knowledge architecture.

---

## Constraints (unchanged)

- Redux, backend, APIs, database, routes, auth — not modified  
- Business, cart, checkout, payments, referral, commission — not modified  
- Memory Engine (7D) — not modified  
- Decision Engine (7E) — not modified  
- Intelligence Layer (7F) — not modified  
- Orchestration Layer (7G) — not modified  

Architecture and presentation wiring only.
