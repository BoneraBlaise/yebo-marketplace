# Yebone — Launch Blockers

**Review date:** August 6, 2026  
**Evidence:** Playwright audit `e2e/audit-screenshots/final-production-review/`  
**Rule:** No code proposals — problem, impact, evidence, affected areas, priority only.

---

## CRITICAL

### LB-C1 — Auth brand identity fracture (Guriraline logo vs YEBONE copy)

| Field | Detail |
|-------|--------|
| **Problem** | Login and sign-up cards render `Assests/Logo/logo.png` displaying **“Guriraline”** wordmark while page chrome, subtitles, and trust badges say **“YEBONE”** / **“YEBO AI”**. |
| **Impact** | Immediate trust erosion at account creation and return login; brand confusion in screenshots, press, and app-store listings; legal/trademark ambiguity if both names appear publicly. |
| **Evidence** | `desktop-1920-login.png`, `mobile-390-inbox.png`, `mobile-390-cart-legacy.png`, `desktop-1920-admin-dashboard.png`; component `src/components/Auth/AuthLayout.jsx` imports legacy logo; `src/components/Auth/AuthPageChrome.jsx` renders `MARKETPLACE_NAME` as YEBONE. |
| **Affected routes** | `/login`, `/sign-up`, `/checkout` (redirect), `/profile`, `/settings`, `/dashboard`, `/inbox`, `/admin/dashboard` (all redirect to login) |
| **Affected components** | `AuthLayout`, `AuthPageChrome`, `logo.png` asset |
| **Priority** | P1 — must fix before any public beta signup campaign |

---

### LB-C2 — E2E/seed catalog visible in customer browse grids

| Field | Detail |
|-------|--------|
| **Problem** | Product grids show **“E2E Unified Auth Product”**, **“Untitled Product”**, duplicate RWF 31,500 entries, and orange **“SAMPLE PRODUCT”** badges in the lower half of `/products`. |
| **Impact** | Marketplace perceived as unfinished/test environment; SEO and social sharing surface embarrassing titles; vendor credibility undermined when flagship shop leads with test SKUs. |
| **Evidence** | `mobile-390-products.png`, `desktop-1920-vendor-shop.png`; `src/utils/catalogQuality.js` deprioritizes but does not hide from `/products` grid per Sprint 3 report. |
| **Affected routes** | `/products`, `/shop/preview/:id`, `/search?q=phone` (partial) |
| **Affected components** | `ProductsPage`, `ProductCard`, vendor shop product grid |
| **Priority** | P1 — content/data gate for any external users |

---

### LB-C3 — Widespread broken or missing product images

| Field | Detail |
|-------|--------|
| **Problem** | Phone/accessory products render blank image areas or broken-image icons in grid, search, and PDP views. PDP main gallery and thumbnails empty for audited SKU. |
| **Impact** | Conversion collapse on product detail; returns and support burden; search results appear broken despite valid titles/prices. |
| **Evidence** | `mobile-390-product-detail.png`, `mobile-390-search.png`, `mobile-390-products.png` (top rows), `desktop-1920-vendor-shop.png` (first 7 cards); `src/utils/catalogQuality.js` `hasValidProductImage` exists but fallback not applied on all surfaces. |
| **Affected routes** | `/product/:id`, `/products`, `/search`, `/shop/preview/:id` |
| **Affected components** | `ProductCard`, `ProductDetailsPage`, image resolution utilities |
| **Priority** | P1 — blocks purchase confidence |

---

### LB-C4 — Authenticated commerce flows NOT VERIFIED

| Field | Detail |
|-------|--------|
| **Problem** | Guest audit could not access checkout UI, cart, wishlist, inbox threads, buyer dashboard, vendor dashboard, or admin panel — all redirect to `/login`. No credentials provided; no E2E auth session captured. |
| **Impact** | Unknown UX quality for revenue-critical paths; launch risk for payment failures, order confirmation, and support workflows. |
| **Evidence** | `audit-log.json` entries for `checkout`, `profile`, `inbox`, `dashboard`, `admin-dashboard` show `redirectedTo: "/login"`; `desktop-1920-checkout.png` shows login page. |
| **Affected routes** | `/checkout`, `/cart`, `/wishlist` (404), `/profile`, `/settings`, `/dashboard`, `/inbox`, `/admin/*` |
| **Affected components** | Entire authenticated surface — NOT VERIFIED |
| **Priority** | P1 — must verify before enabling transactions for beta users |

---

## HIGH

### LB-H1 — Legacy marketplace URLs return 404

| Field | Detail |
|-------|--------|
| **Problem** | Common URL patterns `/vendors`, `/categories`, `/property`, `/mobility`, `/wishlist`, `/auth/login` resolve to 404. Actual routes differ (`/shop/preview/:id`, `/property-mobility`, `/login`). |
| **Impact** | Broken inbound links, email campaigns, and SEO; user dead-ends from bookmarks and external integrations. |
| **Evidence** | `mobile-390-vendors-legacy.png`, `audit-log.json` — `is404: true` for legacy routes across all 6 viewports; `src/App.js` route definitions. |
| **Affected routes** | Legacy paths listed above |
| **Affected components** | Router configuration, 404 page |
| **Priority** | P2 — before marketing or partner integrations |

---

### LB-H2 — Events vertical exposes E2E test events with broken images

| Field | Detail |
|-------|--------|
| **Problem** | `/events` lists **“E2E API Event”** and **“E2E Unified Auth Event”** (3 results) with broken image placeholders. Homepage events section shows empty state — inconsistent filtering. |
| **Impact** | Events vertical unusable for real attendees; brand damage if events are marketed; inconsistency between homepage curation and events page. |
| **Evidence** | `mobile-390-events.png`, `mobile-390-home.png`; `src/components/Events/Events.jsx` filters demo on homepage but events page still loads API data. |
| **Affected routes** | `/events`, `/` (events section) |
| **Affected components** | `Events`, `EventCard` |
| **Priority** | P2 |

---

### LB-H3 — No guest cart experience; `/cart` redirects to login

| Field | Detail |
|-------|--------|
| **Problem** | `/cart` redirects to `/checkout` then `/login` for guests. No cart preview or item count persistence observable without auth. |
| **Impact** | Standard e-commerce expectation violated; abandoned-cart recovery impossible for guests; friction before signup. |
| **Evidence** | `mobile-390-cart-legacy.png` (login screen); `src/App.js` `<Route path="/cart" element={<Navigate to="/checkout" replace />} />`. |
| **Affected routes** | `/cart`, `/checkout` |
| **Affected components** | Cart routing, checkout gate |
| **Priority** | P2 — evaluate for beta (guest cart vs forced login) |

---

### LB-H4 — YEBO AI floating assistant hidden below 1024px

| Field | Detail |
|-------|--------|
| **Problem** | `GlobalAIFab` uses `ai-fab--desktop-only` class; CSS hides FAB at `max-width: 1023px`. Mobile/tablet users lack persistent AI entry except homepage inline section. |
| **Impact** | AI-first positioning undermined on mobile-first African market; inconsistent AI access across routes. |
| **Evidence** | `src/components/ai/GlobalAIFab.jsx`, `src/components/ai/core/ai.css` lines 163–167; homepage has inline “Open YEBO assistant” (`mobile-390-home.png`) but other routes — NOT VERIFIED for mobile AI access. |
| **Affected routes** | All routes on mobile/tablet |
| **Affected components** | `GlobalAIFab`, `AIPanel` |
| **Priority** | P2 |

---

### LB-H5 — Vendor shop social proof at zero with test inventory leading sort

| Field | Detail |
|-------|--------|
| **Problem** | Flagship YEBONE vendor shop shows **0 Followers, 0 Favorites, 0 Views, --- Rating** while grid leads with E2E/broken-image products. |
| **Impact** | Verified seller badge contradicted by empty social proof; first vendor impression is low trust. |
| **Evidence** | `desktop-1920-vendor-shop.png` |
| **Affected routes** | `/shop/preview/:id` |
| **Affected components** | Shop hero stats, product sort/grid |
| **Priority** | P2 |

---

## MEDIUM

### LB-M1 — `via.placeholder.com` fallbacks in vendor storefront components

| Field | Detail |
|-------|--------|
| **Problem** | Shop hero avatar and review avatars fall back to `https://via.placeholder.com/*` — external dependency, off-brand, may fail or block in production CSP. |
| **Impact** | Broken avatars in reviews; third-party URL in production DOM. |
| **Evidence** | Grep: `src/components/Shop/storefront/ShopHero.jsx:52`, `ShopReviewsSection.jsx:52` |
| **Affected routes** | `/shop/preview/:id` (when avatar missing) |
| **Affected components** | `ShopHero`, `ShopReviewsSection` |
| **Priority** | P3 |

---

### LB-M2 — Homepage category tiles missing imagery

| Field | Detail |
|-------|--------|
| **Problem** | Multiple “Shop by category” tiles show grey gradient placeholders with text-only labels (Beauty, Baby, Health, etc.) instead of category photography. |
| **Impact** | Visual rhythm breaks in discovery section; scannability reduced vs populated tiles. |
| **Evidence** | `desktop-1920-home.png` |
| **Affected routes** | `/` |
| **Affected components** | Category grid / `categoryPhotoMap` |
| **Priority** | P3 |

---

### LB-M3 — Flash sales empty with no active deals

| Field | Detail |
|-------|--------|
| **Problem** | `/flash-sales` renders polished empty state (“No Flash sales Found”) — no live deals. |
| **Impact** | Promotional nav item leads to dead inventory; acceptable if intentional, risky if marketed. |
| **Evidence** | `desktop-1920-flash-sales.png` |
| **Affected routes** | `/flash-sales` |
| **Affected components** | Flash sale listing |
| **Priority** | P3 — hide nav item or populate before campaign |

---

### LB-M4 — Property/mobility catalog depth (1 listing)

| Field | Detail |
|-------|--------|
| **Problem** | `/property-mobility` shows single listing (Radisson Blu hotel, US$109). Filters and UX polished but inventory thin. |
| **Impact** | Vertical appears non-viable; filter interaction leads to sparse results. |
| **Evidence** | `mobile-390-property-mobility.png`, `mobile-390-property-listing-detail.png` |
| **Affected routes** | `/property-mobility`, listing detail |
| **Affected components** | Property browse grid |
| **Priority** | P3 — content/supply issue |

---

### LB-M5 — Production socket default references legacy hostname

| Field | Detail |
|-------|--------|
| **Problem** | `src/config/serverConfig.js` default production socket URL contains `guriraline-socket-awo9.onrender.com`. |
| **Impact** | Real-time messaging/notifications may point to legacy infra in misconfigured deploy. |
| **Evidence** | Grep: `serverConfig.js:9` — NOT VERIFIED in runtime network tab during audit. |
| **Affected routes** | Messaging, notifications (NOT VERIFIED) |
| **Affected components** | Socket configuration |
| **Priority** | P3 — verify deploy config |

---

## LOW

### LB-L1 — Search placeholder truncation on narrow mobile

| Field | Detail |
|-------|--------|
| **Problem** | Header search placeholder truncates to “Search products, properti...” at 390px. |
| **Impact** | Minor readability loss; does not block task completion. |
| **Evidence** | `mobile-390-property-listing-detail.png`, multiple mobile captures |
| **Affected routes** | All mobile layouts with header search |
| **Affected components** | Header search input |
| **Priority** | P4 |

---

### LB-L2 — Property listing title casing inconsistency

| Field | Detail |
|-------|--------|
| **Problem** | Listing title renders “Radisson blu hotel” (lowercase “blu”). |
| **Impact** | Minor professionalism signal on detail page. |
| **Evidence** | `mobile-390-property-listing-detail.png` |
| **Affected routes** | `/property-mobility/listing/:id` |
| **Affected components** | Listing detail header |
| **Priority** | P5 — content fix |

---

### LB-L3 — Flash sales footer copyright shows static 2024

| Field | Detail |
|-------|--------|
| **Problem** | Flash sales page footer displays “© 2024 Yebone” while other pages use dynamic year (2026 during audit). |
| **Impact** | Minor consistency/trust signal. |
| **Evidence** | `desktop-1920-flash-sales.png` vs `mobile-390-events.png` (© 2026) |
| **Affected routes** | `/flash-sales` |
| **Affected components** | Flash sales layout footer — NOT VERIFIED which footer component |
| **Priority** | P5 |

---

## Blocker Summary Count

| Severity | Count |
|----------|-------|
| CRITICAL | 4 |
| HIGH | 5 |
| MEDIUM | 5 |
| LOW | 3 |

**Minimum for public beta exit:** Resolve all CRITICAL + HIGH blockers and verify authenticated E2E paths.
