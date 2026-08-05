# Tomorrow Start Plan — 2026-08-06

## Exact Next Priority

**Run full E2E verification on live stack, then polish PM Agencies/Offers tabs to match Listings card UI.**

## Files to Open First

1. `e2e/tests/08-vendor-auth-unified.spec.js` — confirm auth still green
2. `e2e/tests/09-global-marketplace-search.spec.js` — new unified search
3. `src/pages/OwnerPropertyMobilityPage.jsx` — Agencies/Offers tabs still table-based
4. `src/components/seller-experience/CreateListingWizard.jsx` — AI description wiring target

## First Task to Execute

```bash
# Terminal 1 — Backend
cd guriraline_server-main/guriraline_server-main
npm run dev

# Terminal 2 — Frontend
cd guriraline_app-main/guriraline_app-main
npm start

# Terminal 3 — E2E
npx playwright test e2e/tests/08-vendor-auth-unified.spec.js e2e/tests/09-global-marketplace-search.spec.js
```

Fix any failures before new feature work.

## Dependencies

- MongoDB running with vendor test account (`bonbreizy@gmail.com` / shop configured)
- Backend `.env` with JWT, Cloudinary, Mongo URI (do not commit)
- Frontend proxy to `localhost:5000`

## Blockers

- None code-side if servers start cleanly
- Mobile success modal visibility — re-capture in Playwright if still failing

## Recommended Implementation Order

1. **Verify** — E2E suite on live servers (30 min)
2. **Polish** — Agencies/Offers tabs on `OwnerPropertyMobilityPage` (2–3 hrs)
3. **AI** — Wire `CreateListingWizard` description to `POST /ai/service` (1–2 hrs)
4. **SEO** — Dynamic sitemap script for published listings (2 hrs)
5. **Admin** — Moderation queue UX (filter chips, bulk actions) (optional)

## Handoff Anchor

All today's work is committed and pushed to `origin/main` on both repos.  
Resume from **E2E verification**, then **Agencies/Offers UI parity** with the redesigned Listings tab.
