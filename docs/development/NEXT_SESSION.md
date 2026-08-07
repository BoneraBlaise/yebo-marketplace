# Tomorrow Start Plan — 2026-08-06

> **Checkpoint:** `docs/development/CHECKPOINT_2026-08-05.md`  
> **Project state:** `docs/development/PROJECT_STATE.md`

## Exact Next Priority

**Run full E2E verification on live stack, then polish PM Agencies/Offers tabs to match Listings card UI.**

Marketplace UI polish (unified ProductCard, responsive grid, header create menu) is **complete**. No further card unification work needed unless regressions are found in E2E.

## Files to Open First

1. `e2e/tests/08-vendor-auth-unified.spec.js` — confirm auth still green
2. `e2e/tests/09-global-marketplace-search.spec.js` — unified search
3. `src/pages/OwnerPropertyMobilityPage.jsx` — Agencies/Offers tabs still table-based
4. `src/components/seller-experience/CreateListingWizard.jsx` — AI description wiring target
5. `src/components/Marketplace/ProductCard.jsx` — canonical card (verify no regressions)

## First Task to Execute

```bash
# Terminal 1 — Backend
cd guriraline_server-main/guriraline_server-main
npm run dev

# Terminal 2 — Frontend
cd guriraline_app-main/guriraline_app-main
git pull origin main
npm start

# Terminal 3 — E2E (install browsers if needed)
npx playwright install
npx playwright test e2e/tests/08-vendor-auth-unified.spec.js e2e/tests/09-global-marketplace-search.spec.js
```

Fix any failures before new feature work.

## Dependencies

- MongoDB running; E2E credentials in `e2e/.env.e2e.local` (see `e2e/.env.e2e.example`)
- Backend `.env` with JWT, Cloudinary, Mongo URI (do not commit)
- Frontend proxy to `localhost:5000`

## Blockers

- None code-side if servers start cleanly
- Playwright browsers may need `npx playwright install`
- 15 PM listings in `pending_review` — approve via admin for inventory depth testing

## Recommended Implementation Order

1. **Verify** — E2E suite on live servers (30 min)
2. **Polish** — Agencies/Offers tabs on `OwnerPropertyMobilityPage` (2–3 hrs)
3. **AI** — Wire `CreateListingWizard` description to `POST /ai/service` (1–2 hrs)
4. **SEO** — Dynamic sitemap script for published listings (2 hrs)
5. **Search UX** — Hide recommendation rails on empty search results (30 min)
6. **Admin** — Moderation queue UX (filter chips, bulk actions) (optional)

## Handoff Anchor

All work through 2026-08-05 is committed and pushed to `origin/main`.  
Resume from **E2E verification**, then **Agencies/Offers UI parity**.

**Completed today (do not redo):**
- Unified ProductCard across marketplace
- Responsive grid 2/3/4/5
- Header "+" button 40×40px + vendor create menu
- Shopping + search compact headers
- Property & Mobility browse/detail polish
- CRIT-1 property browse + CRIT-2 cart redirect
