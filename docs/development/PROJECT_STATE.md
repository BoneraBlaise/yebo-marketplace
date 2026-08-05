# Yebone Project State — 2026-08-05

## Current Architecture Status

| Layer | Status |
|-------|--------|
| Marketplace Core | Stable, frozen patterns |
| Vendor Auth | **Unified** — single JWT via `vendorSession` / `authenticateVendor` |
| Product Catalog & Search | Production-ready (`SearchPlatform` v1) |
| Property & Mobility | Owner dashboard redesigned; admin moderation extended |
| Communication | Product + listing conversations; typing + images |
| Growth Commerce | Integrated enriched search |
| YEBO AI | Gateway live; wizard AI wiring pending |
| Payments | Phase 4 foundation (separate track) |

## Features Completed

- [x] Unified vendor authentication (frontend + backend)
- [x] Property/Mobility vendor dashboard card UI (Listings tab)
- [x] Listing publish success moderation UI
- [x] Global marketplace search (products, property, mobility, events)
- [x] Admin moderation workflow extensions + vendor notifications
- [x] Listing-scoped inbox conversations
- [x] Property detail page premium layout
- [x] Property SEO (meta, schema, sitemap static entries)
- [x] Property route code splitting

## Features Still Pending

- [ ] Agencies/Offers vendor tabs card redesign
- [ ] AI description generator in listing wizard
- [ ] Dynamic XML sitemap for published listings
- [ ] Full E2E regression with live servers (today's new specs)
- [ ] Native mobile app (Capacitor/React Native — not started)
- [ ] Shop search API consumer (`/search/shops` unused)
- [ ] PM legacy inbox bridge full merge with Communication platform

## Production Readiness

| Domain | % | Notes |
|--------|---|-------|
| E-commerce (products) | **88%** | Mature PDP, checkout, messaging |
| Vendor operations | **82%** | Unified auth; PM dashboard modernized |
| Property & Mobility | **75%** | Public detail improved; admin queue basic |
| Global search | **78%** | Unified UX; events client-filtered |
| Messaging | **80%** | Products + listings; typing/images added |
| SEO | **70%** | Product strong; property static sitemap only |
| AI | **65%** | Gateway live; property UX not fully wired |
| **Overall web production** | **~78%** | Ready for staged rollout with monitoring |

## Native App Readiness

| Item | % | Notes |
|------|---|-------|
| Responsive web UI | 85% | Bottom nav, mobile search, PM cards |
| PWA / manifest | Unknown | Not audited today |
| Capacitor wrapper | 0% | Not implemented |
| Push (web) | 70% | VAPID exists for communication |
| **Native app overall** | **~25%** | Web-first; native shell not started |

## Risks Before Production

1. **Dual messaging paths** — PM offer bridge vs Communication inbox for older threads
2. **No dynamic sitemap** — listing URLs may be under-indexed
3. **Admin moderation UI** — functional but not polished queue UX
4. **Build artifacts in git** — `build/` tracked; deploy should use CI build
5. **E2E coverage** — new tests not run against live stack this session
6. **MongoDB `needs_changes` status** — new enum value; existing listings unaffected but verify migration on prod DB

## Repository Locations

- **Frontend:** `guriraline_app-main/guriraline_app-main`
- **Backend:** `guriraline_server-main/guriraline_server-main`
- **Docs:** `docs/development/` (frontend repo)
