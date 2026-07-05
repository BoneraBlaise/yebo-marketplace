# Yebone Frontend — Release Candidate Documentation

## Architecture Overview

The Yebone frontend is a React SPA (Create React App) with Redux state, React Router v6, Tailwind CSS, and a shared presentation design system.

### Layer model

| Layer | Location | Purpose |
|-------|----------|---------|
| Design tokens | `src/design-system/` | Colors, typography, spacing, motion, `global.css` |
| UI primitives | `src/components/ui/` | Button, Card, Badge, Input, PageMeta, ErrorState, Container |
| Feature modules | `src/components/{Home,Marketplace,Auth,Dashboard,...}/` | Page-specific presentation |
| Pages | `src/pages/` | Route entry points (thin wrappers) |
| Redux | `src/redux/` | State & actions (unchanged in Phase 6) |
| Routes | `src/routes/`, `src/App.js` | Route definitions & guards |

### Dashboard architecture (shared)

All dashboards reuse `DashboardLayout` with mode variants:

- **Customer:** `mode="customer"` + `DashboardSidebar`
- **Vendor:** `VendorDashboardLayout` → `mode="vendor"` + `VendorSidebar`
- **Admin:** `AdminDashboardLayout` → `mode="admin"` + `AdminSidebar` + `AdminTopbar`

Shared components: `DashboardStatCard`, `DashboardEmptyState`, `VendorTableSection`, `dashboard.css`

## Folder structure

```
src/
├── design-system/       # Tokens + global.css
├── components/
│   ├── ui/              # Shared UI + PageMeta + ErrorState
│   ├── Dashboard/       # Layout, sidebars, admin/vendor panels
│   ├── Home/            # Homepage sections
│   ├── Marketplace/     # Discovery pages
│   ├── Auth/            # Login/signup presentation
│   ├── Admin/           # Admin business components
│   └── Shop/            # Vendor business components
├── pages/               # Route pages
├── redux/               # State (do not modify without backend coordination)
└── routes/              # Route guards
```

## Design system

- **Classes:** `yebone-*` (canonical), `home-*`, `pdp-*` (aliases)
- **Surfaces:** `yebone-surface`, `yebone-glass`, `yebone-card-lift`
- **Skeletons:** `yebone-skeleton` (unified shimmer)
- **Motion:** `yebone-fade-up`, reduced-motion respected globally

Import chain: `App.css` → `design-system/global.css`, `dashboard.css`, `marketplace.css`, `auth.css`

## Reusable components (Phase 6 additions)

| Component | Path | Use |
|-----------|------|-----|
| `PageMeta` | `components/ui/PageMeta.jsx` | SEO: title, OG, Twitter, canonical, JSON-LD, noindex |
| `ErrorState` | `components/ui/ErrorState.jsx` | 404, 403, 500, offline, network presets |
| `ErrorBoundary` | `components/Layout/ErrorBoundary.jsx` | Runtime crash recovery |
| `SkipToContent` | `components/Layout/SkipToContent.jsx` | Keyboard a11y skip link |
| `NotFoundPage` | `pages/NotFoundPage.jsx` | Catch-all 404 route |
| `ForbiddenPage` | `pages/ForbiddenPage.jsx` | Admin access denied UI |

## Future AI integration points

Placeholder components in `src/components/ai/` and admin `AdminAICenter.jsx` — wire backend when ready. No API changes required for UI shell.

## Deployment checklist

- [ ] Set production API URL in environment config
- [ ] Verify `public/_redirects` (Netlify) or `.htaccess` (Apache) SPA fallback
- [ ] Confirm `robots.txt` and `sitemap.xml` match production domain
- [ ] Run `npm run build` — verify exit 0
- [ ] Smoke test: home, products, PDP, cart, checkout, login, dashboards
- [ ] Verify HTTPS and cookie credentials for API
- [ ] Configure CDN cache for static assets

## Developer onboarding

1. `npm install`
2. `npm start` — dev server
3. `npm run build` — production bundle
4. Read `README.md` for brand tokens
5. Use `PageMeta` for new pages; use `DashboardLayout` for new dashboard sections
6. **Do not** duplicate layout shells — extend existing dashboard architecture

## Production readiness score

See `docs/RELEASE_CANDIDATE_REPORT.md` for the full Phase 6 audit.
