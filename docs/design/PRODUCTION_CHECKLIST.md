# Yebone — Production Checklist

**Review date:** August 6, 2026  
**Purpose:** Pre-launch verification gate — check each item before expanding beyond constrained public beta  
**Legend:** ✅ Verified · ⚠ Partial · ❌ Failed · ⬜ NOT VERIFIED

---

## 1. Brand & Trust

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 1.1 | Single brand name across all surfaces | ❌ | Guriraline logo on auth; YEBONE in copy (`desktop-1920-login.png`) |
| 1.2 | Logo asset matches MARKETPLACE_NAME | ❌ | `AuthLayout.jsx` → `logo.png` shows Guriraline |
| 1.3 | Favicon and OG tags use Yebone branding | ⬜ | NOT VERIFIED in this audit |
| 1.4 | Footer copyright year consistent | ⚠ | Dynamic year on most pages; flash sales shows 2024 |
| 1.5 | Trust badges accurate (verified sellers, secure login) | ⚠ | Badges present; undermined by test catalog |
| 1.6 | No third-party placeholder URLs in production DOM | ❌ | `via.placeholder.com` in ShopHero, ShopReviewsSection |

---

## 2. Catalog & Content

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 2.1 | No E2E/test product names in browse grids | ❌ | E2E Unified Auth Product visible (`mobile-390-products.png`) |
| 2.2 | No untitled/blank-name products visible | ❌ | Untitled Product entries in grid |
| 2.3 | Product images render on grid, search, PDP | ❌ | Blank/broken on phone category (`mobile-390-product-detail.png`) |
| 2.4 | Demo events filtered from `/events` | ❌ | E2E API Event listed (`mobile-390-events.png`) |
| 2.5 | Homepage showcase curated | ⚠ | Demo deprioritized on `/products`; homepage cleaner |
| 2.6 | Vendor shop sort puts quality listings first | ❌ | E2E products lead grid (`desktop-1920-vendor-shop.png`) |
| 2.7 | Property/mobility minimum viable inventory | ❌ | 1 listing only |
| 2.8 | Flash sales populated or nav hidden | ⚠ | Empty state only (`desktop-1920-flash-sales.png`) |

---

## 3. Routes & Navigation

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 3.1 | All marketing URLs resolve (no 404) | ❌ | 6 legacy paths 404 (`audit-log.json`) |
| 3.2 | `/cart` accessible or redirects gracefully | ⚠ | Redirects to login — no guest cart |
| 3.3 | `/auth/login` alias to `/login` | ❌ | 404 |
| 3.4 | Product detail URL pattern documented | ✅ | `/product/:id` verified |
| 3.5 | Vendor URL pattern documented | ✅ | `/shop/preview/:id` verified |
| 3.6 | Property routes unified | ✅ | `/property-mobility` + listing detail |
| 3.7 | 404 page branded with recovery CTA | ✅ | `mobile-390-vendors-legacy.png` |
| 3.8 | No horizontal scroll all breakpoints | ✅ | 180/180 scrollOk |

---

## 4. Responsive & Layout

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 4.1 | Mobile header no overflow (390/414) | ✅ | Sprint 3 + final audit pass |
| 4.2 | Product rail mobile utilization | ✅ | ~93% post rail optimization |
| 4.3 | Tablet layout (768) functional | ✅ | All routes scrollOk |
| 4.4 | Desktop wide (1920) grid alignment | ✅ | Verified on home, products, vendor |
| 4.5 | Footer accordion on mobile | ✅ | Visible on all mobile captures |
| 4.6 | Search dropdown usable on mobile | ⬜ | NOT VERIFIED (dropdown not opened in audit) |

---

## 5. Search & Discovery

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 5.1 | Global search returns results | ✅ | 3 phone results (`mobile-390-search.png`) |
| 5.2 | Vertical empty states (events, property) | ✅ | Dual CTAs on search page |
| 5.3 | Filter chips and sort functional appearance | ✅ | Products page filters render |
| 5.4 | Category browse via query param | ✅ | `/products?category=Fashion` 200 |
| 5.5 | Search dropdown loading/empty states | ⬜ | NOT VERIFIED in Playwright capture |

---

## 6. Authentication & Accounts

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 6.1 | Login page renders | ✅ | `/login` 200 |
| 6.2 | Sign-up page renders | ✅ | `/sign-up` 200 |
| 6.3 | Google SSO button present | ✅ | Visible in login captures |
| 6.4 | Forgot password flow | ⬜ | NOT VERIFIED |
| 6.5 | Protected routes redirect correctly | ✅ | Profile/dashboard → login |
| 6.6 | Auth brand consistency | ❌ | LB-C1 |

---

## 7. Commerce (NOT VERIFIED — Auth Required)

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 7.1 | Add to cart from PDP | ⬜ | NOT VERIFIED |
| 7.2 | Checkout multi-step flow | ⬜ | NOT VERIFIED |
| 7.3 | Payment integration (sandbox) | ⬜ | NOT VERIFIED |
| 7.4 | Order confirmation page | ⬜ | NOT VERIFIED |
| 7.5 | Guest vs authenticated cart policy | ⬜ | NOT VERIFIED |
| 7.6 | Wishlist add/remove | ⬜ | Route 404 at `/wishlist` |

---

## 8. Messaging & Notifications (NOT VERIFIED)

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 8.1 | Inbox conversation list | ⬜ | Redirects to login |
| 8.2 | Message seller from PDP | ⬜ | NOT VERIFIED |
| 8.3 | Real-time socket connection | ⬜ | NOT VERIFIED |
| 8.4 | Notifications panel loading state | ⬜ | NOT VERIFIED |

---

## 9. AI / YEBO

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 9.1 | Homepage AI section renders | ✅ | `mobile-390-home.png` |
| 9.2 | YEBO FAB on desktop | ⬜ | NOT VERIFIED (capture failed) |
| 9.3 | YEBO FAB on mobile/tablet | ❌ | Hidden by CSS `max-width: 1023px` |
| 9.4 | AI panel conversation UX | ⬜ | NOT VERIFIED |
| 9.5 | Virtual try-on entry from PDP | ⚠ | Button visible; flow NOT VERIFIED |
| 9.6 | Dev/demo copy removed from AI | ⚠ | Sprint 3 claims done; runtime NOT VERIFIED |

---

## 10. Performance & SEO

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 10.1 | Lighthouse performance score ≥ 80 | ⬜ | NOT VERIFIED |
| 10.2 | LCP on homepage | ⬜ | NOT VERIFIED |
| 10.3 | Page titles unique per route | ✅ | Audit log shows distinct titles |
| 10.4 | Meta descriptions | ⬜ | NOT VERIFIED |
| 10.5 | Image lazy loading | ⬜ | NOT VERIFIED |
| 10.6 | Code splitting / lazy routes | ⚠ | Property detail lazy-loaded per App.js |

---

## 11. Accessibility

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 11.1 | FAB has aria-label | ✅ | `aria-label="Open YEBO Assistant"` in GlobalAIFab.jsx |
| 11.2 | Form inputs labeled on auth | ⚠ | Placeholder-only labels visible |
| 11.3 | Keyboard nav full audit | ⬜ | NOT VERIFIED |
| 11.4 | Color contrast WCAG AA | ⬜ | NOT VERIFIED |
| 11.5 | Screen reader audit | ⬜ | NOT VERIFIED |
| 11.6 | Alt text on product images | ⚠ | Broken images may still have alt from titles |

---

## 12. Security

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 12.1 | Auth routes use HTTPS in production | ⬜ | NOT VERIFIED (localhost audit) |
| 12.2 | Protected routes enforce auth | ✅ | Redirect observed |
| 12.3 | Admin routes gated | ✅ | Redirect to login |
| 12.4 | No secrets in client bundle | ⬜ | NOT VERIFIED |
| 12.5 | CSP blocks arbitrary placeholder domains | ⬜ | NOT VERIFIED |

---

## 13. Admin & Vendor Ops (NOT VERIFIED)

| # | Check | Status | Evidence / Notes |
|---|-------|--------|------------------|
| 13.1 | Admin dashboard | ⬜ | Redirects to login |
| 13.2 | Vendor seller dashboard | ⬜ | NOT VERIFIED |
| 13.3 | Product upload/management | ⬜ | NOT VERIFIED |
| 13.4 | Admin AI control center | ⬜ | NOT VERIFIED |

---

## Summary

| Category | ✅ | ⚠ | ❌ | ⬜ |
|----------|----|----|----|-----|
| Brand & Trust | 0 | 2 | 3 | 1 |
| Catalog & Content | 0 | 2 | 5 | 0 |
| Routes & Navigation | 4 | 1 | 2 | 0 |
| Responsive & Layout | 5 | 0 | 0 | 1 |
| Search & Discovery | 4 | 0 | 0 | 1 |
| Authentication | 4 | 0 | 1 | 1 |
| Commerce | 0 | 0 | 0 | 6 |
| Messaging | 0 | 0 | 0 | 4 |
| AI / YEBO | 1 | 1 | 1 | 3 |
| Performance & SEO | 1 | 1 | 0 | 4 |
| Accessibility | 1 | 2 | 0 | 3 |
| Security | 2 | 0 | 0 | 3 |
| Admin & Vendor | 0 | 0 | 0 | 4 |

**Beta-ready minimum:** All ❌ in Brand, Catalog, and Routes sections cleared + Commerce/Messaging sections majority ✅.

**Current beta-ready count:** **Not met** — 11 hard failures, 21 unverified items.

---

## Sign-off Checklist (For Re-Review)

- [ ] LB-C1 through LB-C4 resolved
- [ ] Authenticated Playwright suite pass (checkout, inbox, dashboard)
- [ ] Seed database replaced or filtered at API layer
- [ ] Legacy URL redirects deployed
- [ ] Lighthouse + axe audit attached
- [ ] Executive sign-off updated in `LAUNCH_DECISION.md`
