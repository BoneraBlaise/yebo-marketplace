# Yebone / Guriraline — Project Status

**Last updated:** 2026-07-17 (Phase 15 complete)  
**Authoritative snapshot for resuming work**

---

## Current Phase

| Item | Value |
|------|-------|
| **Completed milestone** | **Phase 15 — Marketplace Communication & Commerce Engine** |
| **Status** | **Frozen** |
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

### Frontend

- `communicationService.js` — unified API client
- `MessagingCenter` — responsive buyer/seller inbox (mobile / tablet / desktop)
- Real `NotificationsPanel` (replaces mocks)
- Product contact → communication API
- Checkout from accepted offer (`/checkout?offerId=&token=`)
- Buyer “Confirm delivery received” on order details

### API base

`/api/v2/marketplace/communication/*`

---

## Repository State

| | Frontend | Backend |
|---|----------|---------|
| **Repo** | `guriraline_app-main` | `guriraline_server-main` |
| **Phase 15 tag** | `phase15-marketplace-communication-v1` | `phase15-marketplace-communication-v1` |

---

## Frozen Modules (Do Not Rewrite)

- Payment Foundation
- Marketplace Core (extended via communication module only)
- Orders core (extended: negotiated offer path, hooks)
- Property & Mobility, YEBO AI, Trust & Buyer Protection, Control Centers

---

## Known Limitations

- Web Push requires `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` in backend env
- Offer expiry sweep: `POST /communication/offers/expire-due` (cron not bundled)
- Legacy `/conversation` REST routes remain for backward compatibility; new UI uses v2 communication API

---

## Local Dev

- Frontend: `http://localhost:3000`
- Backend + Socket: `http://localhost:5000`
- Set `REACT_APP_SOCKET_URL=http://localhost:5000` if proxy/socket mismatch
