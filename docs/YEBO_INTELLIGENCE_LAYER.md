# YEBO Intelligence Layer — Phase 7F

**Public assistant:** YEBO  
**Internal layer:** YIP Intelligence Engine  
**Status:** Architecture only — mock signals, scores, and explanations; no live AI providers

The Intelligence Layer transforms memory and decisions into **ranked, personalized, explainable** shopping intelligence. It sits above the Memory Engine (7D) and Decision Engine (7E) without modifying them.

---

## Architecture

```
Memory (YEBOMemoryEngine)
        ↓
Decision (DecisionEngine)
        ↓
Intelligence (YEBOIntelligenceEngine)
        ↓
YEBO UI (YEBOIntelligenceHint + existing components)
```

### Folder: `src/ai/intelligence/`

| Module | Role |
|--------|------|
| `YEBOIntelligenceEngine.js` | Main orchestrator — wires pipeline, exposes public API |
| `RecommendationPipeline.js` | End-to-end flow: signals → rank → personalize → score → confidence |
| `RecommendationSignals.js` | Derives signals from memory snapshot |
| `MockSignals.js` | Mock signal builders for dev/demo |
| `RankingEngine.js` | Multi-factor ranking (views, wishlist, cart, affinity, etc.) |
| `PersonalizationEngine.js` | User profile from memory (categories, brands, budget, region) |
| `ShoppingScoreEngine.js` | Reusable scores (purchase likelihood, trend, urgency, etc.) |
| `ConfidenceEngine.js` | Explainable confidence (score, reason, evidence, signals) |
| `RecommendationRanker.js` | Applies weights and sorts candidates |
| `RecommendationExplainer.js` | Answers why this / why now / why vendor / size / color / bundle |
| `RecommendationWeights.js` | Scope-aware weight profiles (e.g. 40% preference, 20% wishlist) |
| `RecommendationRegistry.js` | Strategy registry |
| `RecommendationStrategies.js` | Per-scope recommendation strategies |
| `UserIntentAnalyzer.js` | Mock intent from memory + scope |
| `VendorInsightsEngine.js` | Vendor dashboard intelligence |
| `AdminInsightsEngine.js` | Admin dashboard intelligence |
| `IntelligenceContext.js` | Read-only bind to memory + decision |
| `IntelligenceProvider.jsx` | Optional React provider (YIPProvider wires by default) |
| `IntelligenceHooks.js` | React hooks + context |
| `IntelligenceTypes.js` | Signal and score type constants |
| `IntelligenceHelpers.js` | Normalization, sorting, ID helpers |

Phase 7C modules (`YIPShoppingIntelligence`, `yipMockData.js`) remain unchanged for legacy mock search.

---

## Pipeline

```
Memory snapshot
      ↓
Signals (RecommendationSignals + MockSignals)
      ↓
Ranking (RankingEngine)
      ↓
Personalization (PersonalizationEngine)
      ↓
Scoring (ShoppingScoreEngine)
      ↓
Confidence (ConfidenceEngine)
      ↓
Recommendation (RecommendationRanker + Explainer)
      ↓
YEBO UI
```

Each stage is pure, mock, and deterministic — suitable for UI wiring and future ML swap-in.

---

## Ranking

`RankingEngine` supports mock ranking based on:

| Signal | Description |
|--------|-------------|
| Recent views | Session browsing history |
| Wishlist | Saved items affinity |
| Cart | In-cart product signals |
| Category affinity | Preferred categories from memory |
| Brand affinity | Preferred brands |
| Vendor affinity | Favorite vendors |
| Popularity | Platform-wide mock popularity |
| Trending | Seasonal/trend mock boost |
| Seasonality | Time-based relevance |
| Inventory | Stock urgency (lower stock → higher urgency score) |
| Discount | Deal attractiveness |
| Price range | Budget fit |
| Rating | Product rating mock |
| Review count | Social proof mock |
| Customer similarity | Collaborative-filter mock |

Returns sorted candidates with composite scores.

---

## Personalization

`PersonalizationEngine` builds a mock user profile from memory:

- Preferred categories, brands, colors, sizes  
- Budget range and shopping frequency  
- Favorite vendors and interests  
- Language, region, currency  

Exposed via `getPersonalization()` on YIPProvider.

---

## Scoring

`ShoppingScoreEngine` produces reusable scores (all mock):

| Score type | Use |
|------------|-----|
| Purchase likelihood | Conversion propensity |
| Discovery score | Exploration / new category fit |
| Bundle score | Cross-sell potential |
| Fashion match | Style/color/size alignment |
| Trend score | Trending alignment |
| Price value | Value-for-money |
| Urgency | Inventory / time sensitivity |
| Customer fit | Profile match |
| Vendor quality | Vendor trust mock |

Exposed via `getShoppingScore(type, scope)`.

---

## Confidence

`ConfidenceEngine` returns explainable confidence objects:

```js
{
  score,      // 0–100
  reason,     // Human-readable summary
  evidence,   // Supporting mock facts
  signalsUsed // Which signals contributed
}
```

**Never fabricates live AI output** — all values derive from mock signals and memory.

Exposed via `getConfidence(recommendationId, scope)`.

---

## Multi-Factor Recommendations

Default weight profile (`RecommendationWeights.js`):

| Factor | Weight |
|--------|--------|
| Preference | 40% |
| Wishlist | 20% |
| Trending | 15% |
| Budget | 10% |
| Reviews | 10% |
| Vendor quality | 5% |

Scope-specific overrides via `getWeightsForScope()`.

---

## Explainability

`RecommendationExplainer` answers for every recommendation:

- **Why this?** — Primary match reason  
- **Why now?** — Timing / urgency  
- **Why this vendor?** — Vendor affinity or quality  
- **Why this size?** — Size preference from memory  
- **Why this color?** — Color preference from memory  
- **Why this bundle?** — Bundle / cross-sell logic  

Exposed via `getRecommendationReason(recommendationId)`.

---

## YIP Provider Integration

`YIPProvider` (`src/ai/core/YIPProvider.jsx`) extends without breaking prior APIs:

| Method | Returns |
|--------|---------|
| `intelligenceEngine` | Engine instance |
| `getRankedRecommendations(scope)` | Ranked list with scores |
| `getShoppingScore(type, scope)` | Single score object |
| `getConfidence(id, scope)` | Confidence breakdown |
| `getRecommendationReason(id)` | Explainability payload |
| `getPersonalization()` | User profile context |
| `getIntelligenceSnapshot()` | Debug snapshot |

Existing exports preserved: `memoryEngine`, `decisionEngine`, `intelligence` (Phase 7C), `getRecommendations()`, etc.

### React hooks

`src/ai/hooks/useIntelligence.js`:

- `useRankedRecommendations(scope)`  
- `useShoppingScore(type, scope)`  
- `useIntelligenceConfidence(id, scope)`  
- `useIntelligenceRecommendationReason(id)`  
- `usePersonalization()`

---

## UI Consumption

No UI redesign. `YEBOIntelligenceHint` (`src/components/ai/intelligence/YEBOIntelligenceHint.jsx`) surfaces top ranked item + explainability on existing surfaces:

| Surface | Scope |
|---------|-------|
| Homepage | `homepage` |
| Search | `search` |
| Product | `product` |
| Cart | `cart` |
| Checkout | `checkout` |
| Customer dashboard | `dashboard` |
| Vendor dashboard | `vendor` |
| Admin dashboard | `admin` |
| YEBO Assistant panel | `homepage` |

---

## Future ML Integration

The Intelligence Layer is designed for provider swap-in:

1. **Signals** — Replace `MockSignals` with real feature store / event stream  
2. **Ranking** — Plug collaborative filtering or embedding similarity  
3. **Personalization** — Sync from CRM / purchase history API  
4. **Scoring** — Train conversion models; map outputs to `SCORE_TYPE`  
5. **Confidence** — Calibrated probabilities from model + SHAP/LIME  
6. **Registry** — Register ML providers alongside mock in `RecommendationRegistry`  

Memory and Decision engines remain the upstream context source; Intelligence consumes their snapshots read-only.

---

## Constraints (unchanged)

- Redux — not modified  
- Backend / APIs — not modified  
- Routes / auth — not modified  
- Business, cart, checkout, payments, referral, commission logic — not modified  
- Memory Engine (7D) — not modified  
- Decision Engine (7E) — not modified  

Architecture and presentation wiring only.
