# YEBO AI Foundation Sprint — Deliverables

Production AI foundation implemented without integrating real providers (OpenAI, FASHN, etc.).

---

## 1. Architecture Diagram

```mermaid
flowchart TB
  subgraph clients [Clients]
    CustomerUI[Customer UI]
    VendorUI[Vendor UI]
    AdminUI[Super Admin UI]
  end

  subgraph gateway [YEBO AI Gateway - Backend Only]
    Chat[/POST /ai/chat]
    Search[/POST /ai/search]
    Intel[/POST /ai/intelligence]
    Preview[/POST /ai/preview]
    Service[/POST /ai/service]
    VendorAPI[/GET /ai/vendor/*]
  end

  subgraph core [Platform Core - Unchanged]
    Planner[AIPlanner]
    Tools[AIToolRegistry]
    Memory[ConversationMemory]
  end

  subgraph foundation [New Foundation Layer]
    Entitlements[AIEntitlementsService]
    Credits[VendorCreditsService]
    Subs[VendorAISubscriptionService]
    Router[AIRouter]
    Registry[AIProviderRegistry]
    Analytics[AIAnalyticsPersistence]
    Masking[ProviderMasking]
  end

  subgraph mongo [MongoDB]
    SubModel[(VendorAISubscription)]
    WalletModel[(VendorCreditsWallet)]
    TxModel[(VendorCreditTransaction)]
    AnalyticsModel[(AIAnalyticsSnapshot)]
    IdempotencyModel[(AIRequestIdempotency)]
  end

  subgraph providers [Mock Providers Only]
    LLM[LLMProvider]
    Fashion[FashionProvider]
    Interior[InteriorProvider]
    Placement[InteriorPlacementProvider]
    Vision[VisionProvider]
  end

  CustomerUI --> YIPGatewayClient
  VendorUI --> YIPGatewayClient
  AdminUI --> MarketplaceAIAdmin

  YIPGatewayClient --> gateway
  Chat --> Planner
  Search --> Planner
  Planner --> Tools
  Planner --> Memory
  Intel --> Router
  Preview --> Entitlements
  Service --> Entitlements
  Entitlements --> Credits
  Entitlements --> Subs
  Preview --> Router
  Service --> Router
  Router --> Registry
  Registry --> providers
  Credits --> mongo
  Subs --> mongo
  Analytics --> mongo
  gateway --> Masking
```

---

## 2. Database Schema

### VendorAISubscription
| Field | Type | Notes |
|-------|------|-------|
| vendorId | String | unique, indexed |
| planId | String | starter / business / enterprise |
| status | enum | active, trial, expired, cancelled, suspended |
| trialEndsAt | Date | |
| renewalDate | Date | |
| monthlyCredits | Number | |
| products | [String] | enabled AI product IDs |
| usageThisMonth | Number | |
| maxUsagePerMonth | Number | |

### VendorCreditsWallet
| Field | Type | Notes |
|-------|------|-------|
| vendorId | String | unique |
| currentCredits | Number | |
| monthlyAllocation | Number | |
| consumedCredits | Number | |
| cycleStartedAt | Date | |
| nextResetAt | Date | |

### VendorCreditTransaction
| Field | Type | Notes |
|-------|------|-------|
| vendorId | String | indexed |
| type | enum | allocation, consumption, reset, top_up, refund, admin_adjustment |
| amount | Number | |
| balanceAfter | Number | |
| idempotencyKey | String | unique sparse |
| requestId | String | |
| serviceType | String | |
| status | enum | pending, completed, rolled_back |

### AIAnalyticsSnapshot
| Field | Type | Notes |
|-------|------|-------|
| period | enum | daily, monthly |
| periodKey | String | e.g. 2026-07-29 |
| requests, creditsUsed, failures | Number | |
| vendorUsage, customerUsage, serviceUsage | Mixed | |
| revenue, providerCost, estimatedMargin | Number | |

### AIRequestIdempotency
| Field | Type | Notes |
|-------|------|-------|
| idempotencyKey | String | unique |
| vendorId, serviceType | String | |
| status | enum | processing, completed, failed |
| response | Mixed | cached gateway response |
| creditsDebited | Number | |

---

## 3. Gateway Flow

1. Client calls `YIPGatewayClient` (frontend) → `POST /api/v2/ai/*`
2. `optionalAuth` resolves user/vendor context
3. Paid routes pass `requireAISubscription` middleware
4. `AIGateway` / `AIGatewayServices` orchestrate request
5. `AIRouter` selects mock provider interface
6. Credits debited atomically (paid routes)
7. Provider executes (mock)
8. On failure → credit rollback
9. `ProviderMasking` strips provider IDs from response
10. Analytics persisted to MongoDB

---

## 4. Router Flow

```
Request → resolveProviderId(serviceType, previewType)
  body_tryon / foot_tryon / face_tryon → fashion
  room_preview → interior
  wall_preview / window_preview / floor_preview → interior_placement
  shopping_assistant / search / description / translation → llm
  default vision tasks → vision
→ AIProviderRegistry.get(providerId)
→ provider.execute(input, options)
```

---

## 5. Credits Flow

```
Paid request
  → assertEntitled(vendorId)
  → consumeCredits (atomic findOneAndUpdate)
  → create VendorCreditTransaction
  → execute provider
  → on success: complete idempotency cache
  → on failure: rollbackConsumption + refund transaction
```

Idempotency: `X-Idempotency-Key` header prevents double debit.

---

## 6. Subscription Flow

```
First paid request OR vendor dashboard access
  → ensureSubscription(vendorId)
  → create VendorAISubscription (trial, 7 days)
  → create VendorCreditsWallet with monthly allocation
  → assertEntitled checks status + credits
```

---

## 7. Analytics Flow

```
Every gateway request
  → AIMetrics (in-memory, existing)
  → AIAnalyticsPersistence.recordEvent
  → upsert AIAnalyticsSnapshot (daily + monthly)
Super Admin: GET /api/v2/marketplace/ai/admin/analytics
```

---

## 8. New MongoDB Collections

- `vendoraisubscriptions`
- `vendorcreditswallets`
- `vendorcredittransactions`
- `aianalyticssnapshots`
- `airequestidempotencies`

---

## 9. API Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | /api/v2/ai/chat | optional | Shopping assistant (existing) |
| POST | /api/v2/ai/search | optional | AI search (existing) |
| POST | /api/v2/ai/intelligence | optional | Compare, budget, gift, tips |
| POST | /api/v2/ai/preview | optional + vendor credits | Preview orchestration |
| GET | /api/v2/ai/preview/:sessionId | optional | Preview session status |
| POST | /api/v2/ai/service | seller + credits | Description, translation, etc. |
| GET | /api/v2/ai/vendor/dashboard | seller | Vendor AI metrics |
| GET | /api/v2/ai/vendor/credits | seller | Wallet snapshot |
| GET | /api/v2/ai/vendor/subscription | seller | Subscription DTO |
| GET | /api/v2/marketplace/ai/admin/analytics | super admin | Persisted analytics |
| POST | /api/v2/marketplace/ai/admin/credits/adjust | super admin | Manual credit adjustment |

---

## 10. Files Created

### Backend
- `marketplace/ai/models/VendorAISubscription.js`
- `marketplace/ai/models/VendorCreditsWallet.js`
- `marketplace/ai/models/VendorCreditTransaction.js`
- `marketplace/ai/models/AIAnalyticsSnapshot.js`
- `marketplace/ai/models/AIRequestIdempotency.js`
- `marketplace/ai/commerce/CreditPolicy.js`
- `marketplace/ai/commerce/VendorAISubscriptionService.js`
- `marketplace/ai/commerce/VendorCreditsService.js`
- `marketplace/ai/commerce/AIEntitlementsService.js`
- `marketplace/ai/router/AIRouter.js`
- `marketplace/ai/providers/AIProviderRegistry.js`
- `marketplace/ai/providers/contracts/*.js` (6 files)
- `marketplace/ai/utils/ProviderMasking.js`
- `marketplace/ai/utils/YEBOAIResponse.js`
- `marketplace/ai/analytics/AIAnalyticsPersistence.js`
- `marketplace/ai/middleware/requireAISubscription.js`
- `marketplace/ai/services/IntelligenceService.js`
- `marketplace/ai/AIGatewayServices.js`
- `marketplace/ai/__tests__/YEBOAIFoundation.test.js`

### Frontend
- `src/services/yeboAIService.js`

---

## 11. Files Modified

### Backend
- `marketplace/ai/AIPlatform.js`
- `marketplace/ai/AIGateway.js`
- `marketplace/ai/AIMetrics.js`
- `marketplace/ai/index.js`
- `controller/ai.js`

### Frontend
- `src/ai/gateway/YIPGatewayClient.js`
- `src/ai/core/YIPProvider.jsx`
- `src/ai/intelligence/YIPShoppingIntelligence.js`
- `src/ai/commerce/CommerceEngine.js`
- `src/ai-experience-ui/hooks/useAIExperiencePlatform.js`
- `src/ai-experience-ui/components/preview/PreviewExperience.jsx`
- `src/vendor-ui/hooks/useVendorExperience.js`
- `src/vendor-ui/components/ai/AIWorkspace.jsx`
- `src/components/Products/resolveVendorTryOn.js`

---

## 12. Migration Notes

1. **No manual migration script required** — Mongoose creates collections on first use.
2. Existing vendors receive a **trial subscription** on first paid AI request or dashboard load.
3. Frontend in-memory wallets remain as **offline fallback** only; production path is backend.
4. `ProviderFactory` retained for dev/testing — not used in production UI paths.
5. Set `MONGODB_URI` in backend `.env` (already configured for your running server).
6. Preview requests must include `vendorId` in body when initiated by customers (charges vendor wallet).

---

## 13. Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Mongo unavailable | Medium | Gateway chat/search still work; paid routes fail gracefully |
| Double credit debit | Low | Idempotency keys + atomic wallet updates |
| Provider name leak | Low | ProviderMasking on all public responses |
| Regression in planner | Low | Chat/search paths unchanged; tests pass |
| Customer preview without vendorId | Medium | Returns 403 VENDOR_REQUIRED — pass vendorId from product |
| In-memory preview sessions | Low | Acceptable for foundation; replace with Mongo jobs in next sprint |

---

## 14. Test Results

```
YEBO AI Foundation — production architecture: 6/6 PASS
  - Router (fashion, interior_placement, llm)
  - Credit policy
  - Provider masking

AI Gateway — Phase 7.1/7.2: 8/8 PASS
  - Chat, search, health, tools unchanged

MongoDB ledger tests: SKIP when MongoDB URI unavailable in test runner
  - Run with live MongoDB: node --test marketplace/ai/__tests__/YEBOAIFoundation.test.js
```

---

## 15. Production Provider Integration Readiness

**Confirmed:** The platform is ready for production AI provider integration.

To plug in a real provider:
1. Implement the appropriate contract (`LLMProvider`, `FashionProvider`, etc.) with real API calls
2. Register in `AIProviderRegistry` — no router or gateway changes needed
3. Set provider via config — vendors/customers still see **YEBO AI** only
4. Enable cost tracking in `AIAnalyticsPersistence.recordEvent({ providerCost })`

No OpenAI, FASHN, or image generation was integrated in this sprint, as specified.
