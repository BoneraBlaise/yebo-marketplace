# YEBO Decision Engine — Phase 7E

**Public assistant:** YEBO  
**Internal layer:** YIP Decision Engine  
**Status:** Architecture only — mock decisions, no AI providers

The Decision Engine sits between Memory, Context, Decision, and YEBO UI. It decides **what** to recommend and **why** — using mock structured data until real providers connect through YIP.

---

## Architecture

```
Memory (YEBOMemoryEngine)
        ↓
Context (DecisionContext + YIPContextEngine)
        ↓
Decision (DecisionEngine + Rules + Reasoning)
        ↓
YEBO UI (YEBODecisionHint + existing components)
```

### Folder: `src/ai/decision/`

| Module | Role |
|--------|------|
| `DecisionEngine.js` | Main orchestrator |
| `DecisionContext.js` | Binds memory + page scope |
| `DecisionRegistry.js` | Provider registry (shopping, vendor, admin, future AI) |
| `DecisionRules.js` | Reusable rule definitions |
| `DecisionReasoning.js` | Mock "Because you..." explanations |
| `RecommendationEngine.js` | Base product/category/brand recommendations |
| `ShoppingDecisionEngine.js` | Cart, checkout, search, bundles, etc. |
| `VendorDecisionEngine.js` | Vendor dashboard decisions |
| `AdminDecisionEngine.js` | Admin platform decisions |
| `DecisionEvents.js` | Pub/sub |
| `DecisionTypes.js` | Decision object schema |
| `DecisionHelpers.js` | `createDecision()`, sorting |

---

## Decision Object

Every recommendation follows one structure:

```js
{
  id, type, title, description,
  confidence, reason, priority,
  source, action, metadata
}
```

Created via `createDecision()` in `DecisionHelpers.js`.

---

## Decision Flow

1. **Memory seed** — `YEBOMemoryEngine.seedMockSession()` on app load  
2. **Scope activation** — page or hook calls `getRecommendations(scope)`  
3. **Rule evaluation** — `getActiveRules(memorySnapshot)`  
4. **Reasoning** — `DecisionReasoning.fromRule()` generates explanation  
5. **Decision emit** — `DecisionEvents.emit(GENERATED)`  
6. **UI render** — `YEBODecisionHint` displays top decision  

---

## Registry

| Provider ID | Status |
|-------------|--------|
| `shopping` | Active |
| `vendor` | Active |
| `admin` | Active |
| `future-openai` | Planned |
| `future-gemini` | Planned |
| `future-local-model` | Planned |

---

## Rules (architecture)

Recently viewed · Frequently viewed · Wishlist · Cart · Budget · Favorite brands · Favorite colors · Preferred size · Trending · Popular · Vendor reputation · Stock · Season · Location

---

## YIP Provider API

```jsx
const {
  decisionEngine,
  decisionContext,
  getRecommendations,
  getDecisionReason,
  getDecisionSnapshot,
} = useYIP(); // or useAI()
```

### Hooks

- `useShoppingDecision(scope)`
- `useVendorDecision()`
- `useAdminDecision()`
- `useRecommendation(scope)`
- `useDecisionReason(decisionId)`

---

## UI Integration (additive only)

`YEBODecisionHint` connected to:

- Homepage (`HomeAIDiscovery`)
- Search (`AISearchNatural` — via scope)
- Product (`ProductAISections`)
- Cart (`YEBOCartIntelligence`)
- Checkout (`YEBOCheckoutIntelligence`)
- YEBO Panel (`YEBOPanelIntelligence`)
- Continue Shopping (`YEBOContinueShopping`)
- Customer / Vendor / Admin dashboards (memory sections)

No page redesign. Existing components unchanged except additive hints.

---

## Future AI Provider Integration

1. Implement decision provider adapter (same pattern as `MockAdapter`)  
2. Register in `DecisionRegistry` with status `active`  
3. Replace mock generators inside `ShoppingDecisionEngine` methods  
4. Pass `memory.getSnapshot()` + `decisionContext.getSnapshot()` to provider  
5. Map provider output to `createDecision()` objects  

**No UI, Redux, route, or business logic changes required.**
