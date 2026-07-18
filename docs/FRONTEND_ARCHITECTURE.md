# Yebone Frontend Architecture

**Status:** Permanent — frozen at `search-production-v1`  
**Canonical document:** This file is the single source of truth for all frontend architecture rules.

> Historical note: Content previously split across `docs/ARCHITECTURE.md` is consolidated here. Do not create parallel architecture documents.

---

## Core Philosophy

### Implement Once

Every page, flow, and feature is built **one time** in **one codebase**.

- No separate desktop/mobile web projects
- No parallel customer, vendor, or admin UI stacks in production
- No duplicate components for the same purpose

If a route exists in `src/App.js`, it is canonical.

### Responsive by Default

Every page must work at:

| Device | Min width | Tailwind |
|--------|-----------|----------|
| Mobile | 320px | default |
| Mobile large | 375px | `sm:` |
| Tablet | 768px | `md:` |
| Laptop | 1024px | `lg:` |
| Desktop | 1280px | `xl:` |
| Wide | 1440px+ | `2xl:` |

Use `src/design-system/responsive/useBreakpoint.js` for breakpoint logic — avoid scattered pixel checks.

---

## Folder Structure

```
src/
├── design-system/          # Tokens, global.css, shared components
├── components/
│   ├── ui/                 # PageMeta, ErrorState, Container, Button, Input
│   ├── Layout/             # AppLayout, headers, ErrorBoundary, SkipToContent
│   ├── Marketplace/        # Discovery filters, heroes, empty states
│   ├── Search/             # Search pagination, state views
│   ├── Home/               # Homepage sections, global search bar
│   ├── Dashboard/          # Shared dashboard shell
│   ├── Shop/               # Vendor business UI
│   ├── Admin/              # Admin business UI
│   └── ai/                 # AI shells — supplements, never replaces core pages
├── pages/                  # Thin route entry points
├── hooks/                  # useProductSearch, useSiteSearch, useBreakpoint
├── redux/                  # actions/, reducers/, store.js
├── lib/                    # Pure helpers (searchQuery, formatting)
├── config/                 # serverConfig, authStorage, setupApiClient
└── routes/                 # Route guards and route exports
```

---

## Routing

| Route | Page | Purpose |
|-------|------|---------|
| `/` | `HomePage` | Marketplace home |
| `/products` | `ProductsPage` | Category browse + filters |
| `/search` | `SearchPage` | Search results (wraps ProductsPage) |
| `/product/:id` | `ProductDetailsPage` | Product detail |
| Dashboard routes | `ShopRoutes`, `AdminRoutes` | Seller/admin shells |

Rules:

- Add routes in `src/App.js` and export pages from `src/routes/Routes.js`
- Do not mount archived stacks (`customer-ui/`, `vendor-ui/`, `admin-ui/`)
- Search uses `/search?search=` — global header submits here

---

## Redux Architecture

| Slice | Path | Role |
|-------|------|------|
| `products` | `redux/reducers/product.js` | Full catalog bootstrap (`allProducts`) |
| `search` | `redux/reducers/search.js` | Server search results, meta, loading, error |
| `order`, `user`, `seller`, etc. | `redux/reducers/` | Domain state |

Rules:

- API calls live in `redux/actions/` — avoid inline axios in pages
- Search actions: `redux/actions/search.js` → `GET /api/v2/search/*`
- Pages dispatch actions; components remain presentational

---

## Hooks Conventions

| Hook | Purpose |
|------|---------|
| `useProductSearch` | URL-synced server search with pagination |
| `useSiteSearch` | Global header typeahead + submit navigation |
| `useBreakpoint` | Responsive layout decisions |

Hooks must not duplicate query-building logic — use `src/lib/searchQuery.js`.

---

## API Layer

| Config | Path |
|--------|------|
| Base URL | `src/config/serverConfig.js` → `/api/v2` |
| Credentials | `axios.defaults.withCredentials = true` in `setupApiClient.js` |
| Search endpoints | `/search/products`, `/search/suggestions`, `/search/categories` |

Legacy: `GET /product/get-all-products` still loads bootstrap catalog on app start.

---

## Component Hierarchy

```
AppLayout / DashboardLayout
  └── Page (thin)
        └── Marketplace layout (Container, hero, filters)
              ├── CategoryFilterSidebar (desktop)
              ├── CategoryFilterDrawer (mobile)
              ├── MarketplaceSortSelect
              ├── SearchStateViews (loading/error/empty/retry)
              ├── ProductList
              └── SearchResultsPagination
```

Global search: `HomeHeader` → `useSiteSearch` → `/search`

---

## Responsive Strategy

- Desktop: sidebar filters (`cat-landing-layout__sidebar`)
- Mobile: filter drawer + `MarketplaceMobileFilterButton`
- One grid (`ProductList`) — no separate mobile/desktop result pages
- Touch targets ≥ 44px on mobile

Verify at: **320px, 375px, 768px, 1024px, 1440px**

---

## Design System

| Resource | Path |
|----------|------|
| Tokens | `src/design-system/tokens/index.js` |
| Components | `src/design-system/components/`, `src/components/ui/` |
| Classes | `yebone-*` (canonical), `home-*`, `pdp-*` (aliases) |
| Surfaces | `yebone-surface`, `yebone-glass`, `yebone-skeleton` |

Do not introduce one-off hex colors when a token exists.

---

## Loading / Error / Empty States

| State | Component |
|-------|-----------|
| Loading | `MarketplaceListingSkeleton`, `yebone-skeleton` |
| Error | `ErrorState` preset `network` + retry action |
| Empty | `MarketplaceEmptyState`, `CategoryEmptyState` |
| Search-specific | `SearchStateViews` |

Every search/results page must handle all four states including slow network retry.

---

## Naming Conventions

- Pages: `*Page.jsx` in `src/pages/`
- Hooks: `use*` in `src/hooks/`
- Actions: verb phrases in `redux/actions/`
- Marketplace components: `Marketplace*` or `Category*` prefix
- CSS: `yebone-*`, `marketplace-*`, `cat-landing-*`

---

## Reusable Marketplace Components

Do not rebuild — extend:

- `CategoryFilterSidebar`, `CategoryFilterDrawer`
- `MarketplaceActiveFilters`, `MarketplaceSortSelect`
- `MarketplaceEmptyState`, `MarketplaceListingSkeleton`
- `ProductList`, `HomeProductCard`
- `SearchResultsPagination`, `SearchStateViews`

---

## Future AI Integration Points

| UI | Path | Phase 7 rule |
|----|------|--------------|
| AI search banner | `components/ai/AISearchNatural.jsx` | Overlay on ProductsPage — do not replace search bar |
| AI components | `components/ai/` | Wire to SearchPlatform APIs |
| Admin AI | `AdminAICenter.jsx` | Dashboard extension only |

YEBO AI must call `/api/v2/search/*` — never duplicate client-side full-catalog filtering for production search.

---

## Legacy Compatibility Rules

- Bootstrap catalog via `getAllProducts()` on app load remains for non-search views
- Server search activates when URL contains search/filter params (`shouldUseServerSearch`)
- Archived UI folders must not be mounted in `App.js`
- Backend v2 API contracts preserved — frontend adapts via Redux actions only

---

## Anti-Patterns (Forbidden)

- Parallel search results pages (`DesktopSearch.jsx` + `MobileSearch.jsx`)
- Inline axios in page components for new features
- Client-side-only search when server params are present
- Mounting `customer-ui/` routes in production
- Duplicating filter sidebar markup outside Marketplace components

---

## Summary

**One app. One route tree. One design system. One search UI shell. Every screen size.**

All frontend work must comply with this document. Non-compliant UI must be consolidated before a phase is frozen.

See also: `docs/SEARCH.md` (backend), `docs/PHASE7_PREPARATION.md` (AI integration).
