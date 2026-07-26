# Yebone / Guriraline — Project Status

**Last updated:** 2026-07-26 (Phase 15 enterprise certification)  
**Enterprise tag:** `phase15-enterprise-certification-v1`  
**Authoritative snapshot for resuming work**

---

## Current Phase

| Item | Value |
|------|-------|
| **Completed milestone** | **Phase 15 — Marketplace Communication & Commerce Engine** |
| **Status** | **Enterprise Certified & Frozen** |
| **Next task** | Phase 16 (TBD — see product roadmap) |

---

## Phase 15 Deliverables

### Backend (`marketplace/communication/`)

- Product-scoped conversations (extend `Conversation` / `Messages` models)
- Offers: create, counter, accept, reject, expire
- Negotiated checkout bridge → `OrderPricingService.repriceFromOffer()` + `OrderService.createOrders({ negotiatedOffer })`
- In-app notifications + Web Push (VAPID when configured)
- Socket.IO on main server (`:5000`)
- Order status hooks → buyer/seller notifications
- Buyer delivery confirmation endpoint
- **Redis-backed distributed rate limiting** with in-memory fallback

### Frontend

- `communicationService.js` — unified API client
- `MessagingCenter` — responsive buyer/seller inbox (mobile / tablet / desktop)
- Real `NotificationsPanel` (replaces mocks)
- Product contact → communication API
- Checkout from accepted offer (`/checkout?offerId=&token=`)
- Buyer “Confirm delivery received” on order details
- **Playwright E2E suite** (`e2e/` — 7 test suites)

### API base

`/api/v2/marketplace/communication/*`

---

## Repository State

| | Frontend | Backend |
|---|----------|---------|
| **Repo** | `guriraline_app-main` | `guriraline_server-main` |
| **Phase 15 tag** | `phase15-marketplace-communication-v1` | `phase15-marketplace-communication-v1` |
| **Acceptance tag** | `phase15-production-acceptance-v1` | `phase15-production-acceptance-v1` |
| **Enterprise tag** | `phase15-enterprise-certification-v1` | `phase15-enterprise-certification-v1` |

---

## Frozen Modules (Do Not Rewrite)

- Payment Foundation
- Marketplace Core (extended via communication module only)
- Orders core (extended: negotiated offer path, hooks)
- Property & Mobility, YEBO AI, Trust & Buyer Protection, Control Centers

---

## Certification

| Report | Score |
|--------|-------|
| Production acceptance | **9.4/10** — `docs/PHASE_15_PRODUCTION_ACCEPTANCE.md` |
| Enterprise certification | **9.7/10** — `docs/PHASE_15_ENTERPRISE_CERTIFICATION.md` |

---

## Enterprise Configuration

```env
COMMUNICATION_RATE_LIMIT_ENABLED=true
REDIS_URL=redis://...
COMMUNICATION_RATE_LIMIT_WINDOW_MS=60000
COMMUNICATION_RATE_LIMIT_MAX=30
COMMUNICATION_CRON_SECRET=your-strong-secret
```

## E2E Testing

```bash
npm run test:e2e              # full suite (requires credentials + stack)
npm run test:e2e:regression   # health + page smoke (CI default)
```

See `e2e/.env.e2e.example` for required credentials.

---

## Known Limitations

- Full communication E2E requires buyer/seller test accounts and running stack
- Web Push requires VAPID keys in backend env
- Offer expiry sweep: cron endpoint (not bundled)
- Legacy `/conversation` REST routes remain for backward compatibility

---

## Local Dev

- Frontend: `http://localhost:3000`
- Backend + Socket: `http://localhost:5000`
- Set `REACT_APP_SOCKET_URL=http://localhost:5000` if proxy/socket mismatch
