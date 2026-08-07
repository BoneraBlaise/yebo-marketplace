# Yebone — Route Scorecard

**Review date:** August 6, 2026  
**Scoring:** 0–100 per dimension; **Status** is holistic production gate per route  
**Evidence:** `e2e/audit-screenshots/final-production-review/`

**Status key:** Excellent · Production Ready · Beta Ready · Needs Polish · Needs Work · Critical · NOT VERIFIED

---

## Primary Routes

| Route | UX | Visual | Mobile | Desktop | Trust | Production | Score | Status |
|-------|-----|--------|--------|---------|-------|------------|-------|--------|
| `/` | 82 | 80 | 85 | 84 | 72 | 78 | **80** | Beta Ready |
| `/products` | 74 | 70 | 76 | 75 | 58 | 65 | **70** | Needs Work |
| `/product/:id` | 76 | 68 | 74 | 75 | 62 | 66 | **70** | Needs Work |
| `/products?category=*` | 78 | 76 | 78 | 77 | 70 | 74 | **76** | Beta Ready |
| `/search` | 84 | 80 | 86 | 83 | 68 | 76 | **79** | Beta Ready |
| `/property-mobility` | 80 | 82 | 84 | 81 | 74 | 72 | **79** | Beta Ready |
| `/property-mobility/listing/:id` | 82 | 84 | 83 | 83 | 76 | 78 | **81** | Beta Ready |
| `/events` | 70 | 62 | 68 | 70 | 48 | 55 | **62** | Critical |
| `/shop/preview/:id` | 72 | 68 | 70 | 72 | 52 | 60 | **66** | Needs Work |
| `/flash-sales` | 78 | 80 | 76 | 79 | 70 | 68 | **75** | Needs Polish |
| `/best-selling` | 76 | 78 | 78 | 77 | 72 | 74 | **76** | Beta Ready |
| `/login` | 72 | 65 | 70 | 68 | 42 | 52 | **62** | Critical |
| `/sign-up` | 72 | 65 | 70 | 68 | 42 | 52 | **62** | Critical |
| `/about` | 78 | 80 | 78 | 80 | 76 | 76 | **78** | Beta Ready |
| `/faq` | 78 | 80 | 78 | 80 | 76 | 76 | **78** | Beta Ready |

---

## Auth-Gated Routes (Guest Audit — Redirect Only)

| Route | UX | Visual | Mobile | Desktop | Trust | Production | Score | Status |
|-------|-----|--------|--------|---------|-------|------------|-------|--------|
| `/checkout` | — | — | — | — | — | — | — | NOT VERIFIED |
| `/cart` | — | — | — | — | — | — | — | NOT VERIFIED (redirects login) |
| `/profile` | — | — | — | — | — | — | — | NOT VERIFIED |
| `/settings` | — | — | — | — | — | — | — | NOT VERIFIED |
| `/dashboard` | — | — | — | — | — | — | — | NOT VERIFIED |
| `/dashboard-orders` | — | — | — | — | — | — | — | NOT VERIFIED |
| `/inbox` / `/messages` | — | — | — | — | — | — | — | NOT VERIFIED |
| `/admin/dashboard` | — | — | — | — | — | — | — | NOT VERIFIED |
| `/notifications` | — | — | — | — | — | — | — | NOT VERIFIED |

*Guest session captured login redirect screenshots only (`desktop-1920-checkout.png`, `mobile-390-inbox.png`).*

---

## Legacy / Alias Routes

| Route | UX | Visual | Mobile | Desktop | Trust | Production | Score | Status |
|-------|-----|--------|--------|---------|-------|------------|-------|--------|
| `/vendors` | 75 | 78 | 76 | 78 | 60 | 58 | **71** | Needs Work (404) |
| `/categories` | 75 | 78 | 76 | 78 | 60 | 58 | **71** | Needs Work (404) |
| `/property` | 75 | 78 | 76 | 78 | 60 | 58 | **71** | Needs Work (404) |
| `/mobility` | 75 | 78 | 76 | 78 | 60 | 58 | **71** | Needs Work (404) |
| `/wishlist` | 75 | 78 | 76 | 78 | 60 | 58 | **71** | Needs Work (404) |
| `/auth/login` | 75 | 78 | 76 | 78 | 60 | 58 | **71** | Needs Work (404) |
| 404 page (invalid path) | 80 | 82 | 82 | 81 | 70 | 76 | **79** | Beta Ready |

*404 page UX is polished; score reflects recovery UI quality, not route availability.*

---

## AI / YEBO Surfaces

| Surface | UX | Visual | Mobile | Desktop | Trust | Production | Score | Status |
|---------|-----|--------|--------|---------|-------|------------|-------|--------|
| Homepage AI section | 80 | 82 | 78 | 84 | 74 | 76 | **79** | Beta Ready |
| Global YEBO FAB | — | — | — | — | — | — | — | NOT VERIFIED (desktop ≥1024 only by design) |
| YEBO Panel (drawer) | — | — | — | — | — | — | — | NOT VERIFIED |
| Admin AI (`/admin/ai`) | — | — | — | — | — | — | — | NOT VERIFIED |

---

## Score Methodology

| Dimension | Weighting basis |
|-----------|-----------------|
| **UX** | Task completion, empty states, filter clarity, recovery paths |
| **Visual** | Design system alignment, typography, spacing, imagery quality |
| **Mobile / Desktop** | Viewport-specific captures at 390/414 and 1920/1440 |
| **Trust** | Brand consistency, seller verification, social proof, data quality |
| **Production** | Holistic ship-readiness including content, not just CSS |
| **Score** | Weighted average: UX 25%, Visual 20%, Mobile 15%, Desktop 10%, Trust 20%, Production 10% |

---

## Route Highlights

**Strongest routes:** `/property-mobility/listing/:id` (81), `/search` (79), `/property-mobility` (79), homepage `/` (80).

**Weakest verified routes:** `/login`, `/sign-up`, `/events` (62 each — Critical status).

**Largest NOT VERIFIED gap:** Commerce and messaging stack — blocks Production Ready status for marketplace as a whole despite strong discovery UX.

---

## Overall Route Health

| Metric | Value |
|--------|-------|
| Routes fully verified (guest) | 15 |
| Routes NOT VERIFIED (auth) | 9 |
| Legacy 404 routes | 6 |
| Routes at Critical status | 3 |
| Routes at Beta Ready or above | 8 |
| Mean score (verified routes only) | **74** |
