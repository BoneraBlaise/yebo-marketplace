# Yebone Project Progress Report

**Official Engineering Audit & Roadmap**  
**Generated:** 2026-07-11  
**Repository:** `BoneraBlaise/yebo-marketplace` (package: `yebone` v0.1.0)  
**Current HEAD:** `2806cd10e81545878ee1079d381420cd2ddbdaae` (`main`)  
**Stack:** React 18 · Create React App · Redux Toolkit · React Router v6 · Tailwind · Axios · Socket.IO  
**Backend (external):** Render REST API + Socket.IO (not in this repo)

---

## Executive Summary

Yebone is a **production-grade React SPA marketplace** with a fully wired customer, seller, and admin experience backed by a remote Guriraline API. The codebase contains **two architectural layers**:

1. **Production layer (live):** `App.js` + `components/` + `pages/` + `redux/` — 50+ routes, real API integration, payments, messaging, bids, flash sales, commission program.
2. **Next-generation layer (built, opt-in):** `application/`, `customer-ui/`, `vendor-ui/`, `admin-ui/`, `ai-experience-ui/`, `design-system/`, `ai/` — enterprise shells and YEBO AI platform (~300 modules) **not mounted in `App.js`**.

**Phase 9 is CLOSED.** Auth works on desktop and iPhone in dev/LAN. **Production frontend hosting is blocked** until GitHub Pages is enabled (`https://bonerabliaise.github.io/yebo-marketplace/` returns 404).

| Metric | Value |
|--------|-------|
| Git commits | 22 |
| Git tags | 17 (Phases 7G–8H.13.1, release candidate) |
| `src/components/` files | 301 |
| `src/pages/` files | 66 |
| `src/ai/` files | 303 |
| ESLint | 0 errors, 212 warnings |
| Production build | PASS (2.07 MB JS gzip) |
| Automated tests | 1 stale CRA test |

---

## Repository Architecture (Actual)

```
yebone/
├── public/              # Static assets, i18n (en/fr/rw), SEO, netlify.toml
├── docs/                # Architecture, phase reports, YEBO platform docs
├── src/
│   ├── App.js           # AUTHORITATIVE production router (50+ routes)
│   ├── index.js         # Bootstrap: setupApiClient, Redux, i18n, AIProvider
│   ├── setupProxy.js    # Dev-only API proxy (Phase 9)
│   ├── server.js        # Re-exports serverConfig
│   ├── config/          # Auth, API client, server URLs (Phase 9)
│   ├── redux/           # 9 slices, thunk actions
│   ├── routes/          # Route guards + lazy page exports
│   ├── pages/           # Route entry wrappers (66)
│   ├── components/      # Feature UI — Home, Marketplace, Auth, Shop, Admin, AI (301)
│   ├── design-system/   # Enterprise tokens, theme, brand engine (Phase 8G)
│   ├── application/     # Application shell, layout shells (Phase 8H.1)
│   ├── customer-ui/     # Opt-in customer portal — NOT wired to App.js
│   ├── vendor-ui/       # Opt-in vendor portal — NOT wired
│   ├── admin-ui/        # Opt-in admin portal — NOT wired
│   ├── ai-experience-ui/# Opt-in AI dashboard — NOT wired
│   ├── ai/              # YEBO Intelligence Platform (YIP) — 303 modules
│   ├── ui-polish/       # brandConstants, platform polish CSS
│   └── static/data.js   # Legacy categoriesData + static assets
```

**Critical rule:** `App.js` is the production router. Portal route modules export components but are commented/unmounted.

---

## Completed Phases (Detailed)

### Phase 0 — Initial Foundation
| Field | Detail |
|-------|--------|
| **Objective** | Bootstrap Guriraline/Yebone e-commerce SPA |
| **Git** | `6512cd3` Initial commit |
| **Implemented** | CRA scaffold, Redux, routing, shop/admin/customer flows, remote API wiring |
| **Status** | **Complete** (superseded by later phases) |

---

### Phase 2 — Product Details Page Polish
| Field | Detail |
|-------|--------|
| **Objective** | Premium PDP presentation |
| **Implemented** | Gallery, sticky purchase panel, variants, vendor info, reviews, Q&A, related products, AI preview section |
| **Key paths** | `components/Route/Products/ProductDetails.jsx`, `pages/ProductDetailsPage.jsx` |
| **API** | `GET /product/*`, `POST /product/create-new-review`, `POST /product/like-product` |
| **Auth** | Public view; purchase requires login at checkout |
| **Database** | None client-side; Render API |
| **UI/UX** | Premium PDP layout with `PageMeta`, JSON-LD |
| **Status** | **Complete** |
| **Dependencies** | `react-helmet`, `swiper`, existing Redux product slice |

---

### Phase 2 Final — Global Design System Consolidation
| Field | Detail |
|-------|--------|
| **Objective** | Unify visual language under Yebone tokens |
| **Implemented** | `yebone-*` Tailwind prefix, CSS variables in `App.css`, `design-system/` tokens |
| **Key paths** | `src/design-system/`, `tailwind.config.js`, `src/App.css` |
| **Status** | **Complete** (extended in Phase 8G) |

---

### Phase 3 — Cart & Checkout Premium Experience
| Field | Detail |
|-------|--------|
| **Objective** | Premium cart/checkout presentation |
| **Implemented** | Cart coupons, tax/shipping summary, recommendations, branded empty states, checkout order summary |
| **Key paths** | `components/Route/Cart/Cart.jsx`, `components/Checkout/*`, `pages/CheckoutPage.jsx` |
| **Business rules** | Cart in `localStorage` via Redux; referral products tracked in `localStorage.referralProducts` |
| **API** | `POST /order/create-order`, commission tracking |
| **Payments** | Stripe, PayPal, Paystack UI (`components/Payment/Payment.jsx`) — Stripe key placeholder |
| **Status** | **Complete but needs polish** (payment keys not production-configured) |
| **Dependencies** | `@stripe/react-stripe-js`, `@paypal/react-paypal-js`, `react-paystack` |

---

### Phase 4 — Marketplace Discovery Experience
| Field | Detail |
|-------|--------|
| **Objective** | Premium product discovery, search, filters |
| **Implemented** | `ProductsPage` with filters, AI search banner, popular searches, product rails |
| **Key paths** | `pages/ProductsPage.jsx`, `components/Marketplace/*` |
| **API** | `GET /product/get-all-products` via Redux |
| **Status** | **Complete** (extended in 8H.13.x) |

---

### Phase 5A — Premium Authentication Experience
| Field | Detail |
|-------|--------|
| **Objective** | Presentation-only auth upgrade |
| **Implemented** | `AuthLayout`, `AuthFloatingInput`, `AuthGoogleButton`, `AuthDivider`, `AuthPageChrome`, theme toggle |
| **Key paths** | `src/components/Auth/` (8 files), `Login.jsx`, `Signup.jsx`, `ForgotPassword.js`, `ResetPassword.js` |
| **Auth logic** | Unchanged business rules; presentation only |
| **Status** | **Complete** |

---

### Phase 5B — Premium Customer Dashboard
| Field | Detail |
|-------|--------|
| **Objective** | Customer profile/dashboard polish |
| **Implemented** | `DashboardLayout` mode=customer, profile sections, orders, addresses |
| **Key paths** | `components/Dashboard/*`, `pages/ProfilePage.jsx` |
| **API** | User profile CRUD via `redux/actions/user.js` |
| **Status** | **Complete** |

---

### Phase 5C — Premium Vendor Platform
| Field | Detail |
|-------|--------|
| **Objective** | Seller dashboard presentation |
| **Implemented** | Shop dashboard, product/event/flashsale/bid CRUD UIs, orders, refunds, withdraw, messages |
| **Key paths** | `components/Shop/*`, `routes/ShopRoutes`, `SellerProtectedRoute` |
| **API** | Full shop domain endpoints (20+ paths) |
| **Auth** | `seller_token` cookie, `SellerProtectedRoute` |
| **Status** | **Complete** |

---

### Phase 5D — Premium Admin Platform
| Field | Detail |
|-------|--------|
| **Objective** | Admin control center presentation |
| **Implemented** | Admin dashboard, users, sellers, orders, products, events, withdraw requests |
| **Key paths** | `components/Admin/*`, `routes/AdminRoutes`, `ProtectedAdminRoute` |
| **Auth** | `user.role === "Admin"` gate |
| **Status** | **Complete** |

---

### Phase 6 — Production Readiness (Release Candidate)
| Field | Detail |
|-------|--------|
| **Objective** | SEO, accessibility, error handling, documentation — no business logic changes |
| **Git** | `d97235b` · tag `v1.0.0-release-candidate` |
| **Implemented** | `PageMeta`, `ErrorState`, `ErrorBoundary`, `SkipToContent`, `NotFoundPage`, `ForbiddenPage`, route guard loaders |
| **Key paths** | `docs/RELEASE_CANDIDATE_REPORT.md`, `docs/ARCHITECTURE.md` |
| **Score** | 88/100 per RC report |
| **Status** | **Complete** |
| **Gaps noted in RC** | No route code-splitting (−5), ~30 pages need PageMeta (−4), no E2E tests (−3) |

---

### Phase 7D — YEBO Memory Engine
| Field | Detail |
|-------|--------|
| **Objective** | Session memory architecture for YEBO AI |
| **Git** | `673ae06` |
| **Implemented** | `YEBOMemoryEngine`, mock memory data, legacy `YIPMemory` bridge |
| **Key paths** | `src/ai/memory/` (20+ files), `docs/YEBO_MEMORY_ENGINE.md` |
| **API** | Client-side only; no backend persistence |
| **Status** | **Complete** (mock data; production persistence not built) |
| **Dependencies** | Internal YIP types |

---

### Phase 7E — YEBO Decision Engine
| Field | Detail |
|-------|--------|
| **Objective** | Decision recommendations architecture |
| **Implemented** | `DecisionEngine`, admin/customer/vendor decision modules, mock decisions |
| **Key paths** | `src/ai/decision/`, `docs/YEBO_DECISION_ENGINE.md` |
| **Status** | **Complete** (mock-only decisions) |

---

### Phase 7F — YEBO Intelligence Layer
| Field | Detail |
|-------|--------|
| **Objective** | Signals, scores, explanations |
| **Git** | `17036bd` (circular import hotfix) |
| **Implemented** | `IntelligenceEngine`, `ConfidenceEngine`, `MockSignals` |
| **Key paths** | `src/ai/intelligence/`, `docs/YEBO_INTELLIGENCE_LAYER.md` |
| **Status** | **Complete** (mock signals) |

---

### Phase 7G — YEBO AI Orchestration Layer
| Field | Detail |
|-------|--------|
| **Objective** | Provider routing, fallback, health |
| **Git** | `3c71d71` · tag `v1.0.0-phase-7g` |
| **Implemented** | `ProviderOrchestrator`, `ProviderFallback`, `ProviderRegistry` |
| **Key paths** | `src/ai/orchestration/`, `docs/YEBO_AI_ORCHESTRATION.md` |
| **Status** | **Complete** (mixed mock/live config remains) |

---

### Phase 7H — Enterprise Knowledge Platform
| Field | Detail |
|-------|--------|
| **Objective** | RAG-ready knowledge architecture |
| **Implemented** | `KnowledgeEngine`, retrieval, ranking, mock documents |
| **Key paths** | `src/ai/knowledge/`, `docs/YEBO_ENTERPRISE_KNOWLEDGE_PLATFORM.md` |
| **Status** | **Complete** (no vector DB connected) |

---

### Phase 7I — YEBO Autonomous Agent Platform
| Field | Detail |
|-------|--------|
| **Objective** | Agent execution pipeline |
| **Git** | `a04886e`, `d428df4` · tags `v1.0.0-phase-7i`, `v1.0.0-phase-7i-hotfix` |
| **Implemented** | `AgentPipeline`, `AgentPlans`, `AgentTasks`, `MockAgents` |
| **Key paths** | `src/ai/agents/`, `docs/YEBO_AGENT_PLATFORM.md` |
| **Status** | **Complete** (mock execution) |

---

### Phase 8A.1 — AI Provider SDK Foundation
| Field | Detail |
|-------|--------|
| **Objective** | Provider adapter contract |
| **Git** | `e11f5f0` · tag `v1.0.0-phase-8a1` |
| **Implemented** | `ProviderFactory`, `MockAdapter`, `GeminiProvider`, provider registry |
| **Key paths** | `src/ai/providers/`, `docs/YEBO_PROVIDER_SDK.md` |
| **Status** | **Complete** |

---

### Phase 8A.2 — Gemini Live Integration
| Field | Detail |
|-------|--------|
| **Objective** | Live Gemini provider |
| **Git** | `64a86de`, `b140e6b` · tags `v1.0.0-phase-8a2-pre`, `v1.0.0-phase-8a2-final` |
| **Implemented** | `GeminiClient`, `GeminiConfig`, `REACT_APP_GEMINI_API_KEY` |
| **Status** | **Complete** (requires env key for live mode) |

---

### Phase 8A.3 — OpenRouter Integration
| Field | Detail |
|-------|--------|
| **Objective** | OpenRouter provider |
| **Git** | `9020d9e` · tag `v1.0.0-phase-8a3-final` |
| **Implemented** | `OpenRouterClient`, `OpenRouterProvider`, `REACT_APP_OPENROUTER_API_KEY` |
| **Status** | **Complete** (requires env key; mock fallback active without key) |

---

### Phase 8B.1–8B.3 — Enterprise Conversation Core
| Field | Detail |
|-------|--------|
| **Objective** | Conversation state, context builder, prompt composer |
| **Git** | `3b8a413`, `e20e498`, `e55c1bd` · tags `v1.0.0-phase-8b1`–`8b3` |
| **Implemented** | `ConversationEngine`, `ContextBuilder`, `PromptComposer`, `RequestAssembler` |
| **Key paths** | `src/ai/conversation/`, `src/ai/prompts/` |
| **Status** | **Complete** |

---

### Phase 8D — YEBO AI Commerce Platform
| Field | Detail |
|-------|--------|
| **Objective** | AI-driven commerce recommendations |
| **Git** | `a738265` · tag `v1.0.0-phase-8d` |
| **Implemented** | `CapabilityEngine`, `RecommendationEngine`, `ProviderSelectionLayer` |
| **Key paths** | `src/ai/commerce/` |
| **Status** | **Complete** (rule-driven; not connected to live product catalog server-side) |

---

### Phase 8E–8H.3 — AI Infrastructure, Design System & Experience UI
| Field | Detail |
|-------|--------|
| **Objective** | Enterprise design system + portal shells + AI experience UI |
| **Git** | `fbd1c36` · tag `v1.0.0-phase-8h3` |
| **Implemented** | `design-system/` (27 files), `application/` shell, `customer-ui/`, `vendor-ui/`, `admin-ui/`, `ai-experience-ui/` |
| **Auth** | Shells use same Redux when wired; currently mock data in portal pages |
| **Status** | **Complete but needs integration** (portals not mounted in App.js) |

---

### Phase 8H.4–8H.8 — Global Layout & Unified Cards
| Field | Detail |
|-------|--------|
| **Objective** | Single Header/Footer, navigation polish, marketplace cards |
| **Git** | `0334df8` · tag `v1.0.0-phase-8h8` |
| **Implemented** | `AppLayout`, `HomeHeader`/`HomeFooter` as global chrome, `MarketplaceCard*` system |
| **Key paths** | `components/Layout/AppLayout.jsx`, `components/Marketplace/cards/` |
| **Status** | **Complete** |

---

### Phase 8H.12 — Responsive Header & Navigation
| Field | Detail |
|-------|--------|
| **Objective** | Mobile/desktop header parity |
| **Git** | `73e2406` · tag `v1.0.0-phase-8h12` |
| **Implemented** | `HomeHeader`, `BottomNav`, `DropDown`, mega-menu, mobile overlays |
| **Status** | **Complete** |

---

### Phase 8H.13 / 8H.13.1 — Category Landing & Discovery
| Field | Detail |
|-------|--------|
| **Objective** | 16 main categories, subcategory chips, category landing pages |
| **Git** | `1e5efc7`, `e65c9d0` · tags `v1.0.0-phase-8h13`, `v1.0.0-phase-8h13-1` |
| **Implemented** | `mainCategoryHierarchy.js` (16 MAIN_CATEGORIES), `CategoryLandingHero`, filters, chips, `categoryPhotoMap.js` |
| **Categories** | Electronics, Phones, Computers, Fashion, Beauty, Home & Furniture, Groceries, Automotive, Sports & Outdoors, Books, Baby, Pets, Health, Office & School, Gaming, Cameras |
| **Key paths** | `components/Home/mainCategoryHierarchy.js`, `components/Marketplace/categoryLanding/` |
| **Business rules** | Category chips filter `categoriesData` titles; URL query params on `/products` |
| **Status** | **Complete** |

---

### Phase 8I.1 — Production UI & Brand Consistency (Transcript)
| Field | Detail |
|-------|--------|
| **Objective** | Final brand alignment across all surfaces |
| **Implemented** | `brandConstants.js`, `AuthPageChrome`, landing sections, trust copy, YEBONE naming |
| **Key paths** | `src/ui-polish/brandConstants.js`, Auth pages, landing components |
| **Status** | **Complete but needs polish** (~30 pages still need PageMeta per RC) |

---

### Phase 9 — Authentication Stabilization
| Field | Detail |
|-------|--------|
| **Objective** | Fix auth transport for localhost + LAN/mobile dev; stabilize login/logout/session |
| **Git** | `2806cd1` |
| **Implemented** | `src/config/` (authStorage, setupApiClient, authService, serverConfig), `setupProxy.js` with Origin rewrite, `.env.development`, `.npmrc`, logout helpers, axios Bearer injection, safe error handling |
| **Auth status** | Cookie JWT (`token`, `seller_token`) → Bearer header; `withCredentials`; Google OAuth via backend redirect |
| **API status** | Dev: same-origin proxy → Render API; Prod: direct Render API |
| **Verified** | Desktop + iPhone login (user confirmed); lint 0 errors; build pass |
| **Status** | **Complete** |
| **Blocked downstream** | Production GitHub Pages URL not live |
| **Dependencies** | `http-proxy-middleware`, `js-cookie`, `axios` |

---

## 1. Completed — Fully Implemented & Verified

| Area | Evidence |
|------|----------|
| **Customer marketplace** | Home, products, PDP, cart, checkout, wishlist, bids, flash sales, events, FAQ, legal pages |
| **Seller platform** | Shop login, dashboard, CRUD products/events/flashsales/bids, orders, refunds, withdraw, inbox |
| **Admin platform** | User/seller/order/product/event management, withdraw approval |
| **Authentication** | Login, signup, logout, session load, Google OAuth redirect, seller auth, route guards |
| **Redux state** | 9 slices wired to API actions |
| **Realtime messaging** | Socket.IO in `UserInbox`, `DashboardMessages` |
| **Commission/referral** | `ReferralContext`, commission dashboard, share links |
| **i18n** | `en`, `fr`, `rw` locales in `public/locales/` |
| **Global layout** | `AppLayout` + single Header/Footer |
| **16-category hierarchy** | `mainCategoryHierarchy.js` + landing components |
| **YEBO AI platform architecture** | 303 modules, globally mounted `AIProvider` + `GlobalAIFab` |
| **Design system foundation** | Tokens, theme engine, brand engine, 11 `ui/` primitives |
| **SEO/error infrastructure** | PageMeta, ErrorBoundary, 404/403 pages |
| **Dev LAN/mobile testing** | `setupProxy.js`, `.env.development`, Origin rewrite |
| **Production build** | `npm run build` succeeds |

---

## 2. Partially Completed

| Feature | What exists | What's missing | Status |
|---------|-------------|----------------|--------|
| **Production hosting** | `gh-pages` branch pushed (`aee99a37`) | GitHub Pages not enabled; URL 404 | **Blocked** |
| **Portal UIs** | `customer-ui/`, `vendor-ui/`, `admin-ui/` fully built | Not wired to `App.js`; uses mock data | **Partial** |
| **AI live providers** | Gemini + OpenRouter adapters | Mixed mock/live config; keys client-side; `ai-search`/`ai-tryon` disabled | **Partial** |
| **Payments** | Stripe/PayPal/Paystack UI | `your-publishable-key-here` placeholder | **Partial** |
| **SEO coverage** | PageMeta on key pages | ~30 pages still without PageMeta (per RC) | **Partial** |
| **Supabase** | Env vars + `isSupabaseConfigured()` | `enabled: false` in infrastructure config | **Partial** |
| **Performance** | Lazy sections on HomePage | No route-level code splitting; 2.07 MB JS bundle | **Partial** |
| **Testing** | CRA test scaffold | 1 stale test; no E2E/integration suite | **Partial** |
| **Production domain** | `yebone.com` in sitemap/robots | DNS not resolving | **Partial** |
| **Backend CORS** | `localhost:3000` whitelisted | LAN IPs + GitHub Pages origin not whitelisted | **Partial** |
| **AI ↔ marketplace data** | Client-side YIP hooks | AI not routed through Guriraline API | **Partial** |

---

## 3. Not Started

| Item | Notes |
|------|-------|
| **E2E test suite** | Playwright/Cypress — flagged in Phase 6 RC |
| **Route-level code splitting** | All routes in `App.js` — flagged in RC |
| **Vector DB / RAG production** | Architecture only in `ai/knowledge/` |
| **AI try-on / visual search** | Feature flags disabled in `yipConfig.js` |
| **Server-side AI proxy** | API keys exposed client-side if set |
| **Supabase production integration** | Placeholder only |
| **Production monitoring** | No Sentry/Datadog integration |
| **CDN / asset optimization pipeline** | Manual build only |
| **Backend CORS for all production origins** | Requires `guriraline-server` repo change |
| **Automated CI/CD** | No `.github/workflows/` |
| **Portal → production migration plan** | Shells built; cutover not executed |
| **Multi-tenant org branding (live)** | `BrandEngine` exists; not wired to tenant API |

---

## 4. Technical Debt

### Duplicated logic
- **Dual category systems:** `mainCategoryHierarchy.js` (16 categories) vs legacy `categoriesData` in `static/data.js` — both used in different contexts
- **Dual AI entry points:** `components/ai/core/AIContext.jsx` re-exports `ai/core/YIPProvider`; deprecated `AIService.js` still present
- **Dual layout systems:** Legacy `DashboardLayout` (production) vs `application/` shells (portals)
- **Legacy memory bridge:** `YEBOMemoryEngine.legacy` wraps old `YIPMemory` API

### TODOs / FIXMEs / HACKs
- **0 explicit TODO/FIXME/HACK** markers in `src/` (grep verified)

### Temporary / mock implementations
- Portal pages use `mockCustomerData`, `mockVendorData`, `mockAdminData`
- AI intelligence/decision/knowledge layers use mock signals and documents
- `ProviderConfig.js` defaults: `preferredProvider: "mock"`, `mockMode: true` (conflicts with `yipConfig.js`)
- Stripe publishable key: `"your-publishable-key-here"`
- HomeHeader notification badge: presentation-only unread count

### Hardcoded values
- Render API: `guriraline-server-7rac.onrender.com` (default in `serverConfig.js`, `setupProxy.js`)
- Socket: `guriraline-socket-awo9.onrender.com`
- Google Analytics: `G-M3HYHLZ70H` in `App.js`
- OpenRouter referer: `http://localhost:3000`
- Many CDN image URLs in `static/data.js` and `categoryPhotoMap.js`

### Missing tests
- Only `src/App.test.js` (stale CRA default)
- No component, integration, or E2E tests
- No API contract tests

### Missing validations
- Payment forms lack production key validation
- Some shop forms use loose equality (`!=` in `DashboardMessages.jsx`)

### Performance issues
- **2.07 MB JS gzip** — significantly over recommended
- No route-level `React.lazy` in `App.js` (only HomePage sections and portal routes)
- `ml5`, `@tensorflow/tfjs` in dependencies — heavy, usage unclear
- Browserslist data 17 months old

### Security improvements needed
- AI API keys in client env vars (`REACT_APP_GEMINI_API_KEY`, `REACT_APP_OPENROUTER_API_KEY`)
- Backend CORS too restrictive for LAN/production origins
- `target="_blank"` without `rel="noreferrer"` in `ProductsPage.jsx`
- Cookie tokens in `js-cookie` (acceptable with `SameSite=Lax`; ensure HTTPS in prod)

### Accessibility improvements
- Phase 6 added skip link, focus-visible, landmarks — good baseline
- ~30 pages lack consistent `PageMeta` + landmark audit
- Some forms missing full ARIA audit

### Scalability concerns
- Monolithic JS bundle
- Client-side AI orchestration won't scale with traffic
- No service worker / offline strategy beyond CRA default
- Redux cart in `localStorage` only (no server cart sync)

---

## Stable Systems — DO NOT MODIFY

These are production-verified or architecturally finalized. **Phase 10+ must extend, not replace.**

### Stable modules
| Module | Path | Reason |
|--------|------|--------|
| Redux store | `src/redux/store.js` + 9 reducers | All features depend on slice shapes |
| Guriraline API client | `src/config/setupApiClient.js`, `serverConfig.js` | Phase 9 verified transport |
| Auth storage | `src/config/authStorage.js` | Cookie contract with backend |
| Production router | `src/App.js` | 50+ routes in production use |
| Route guards | `ProtectedRoute`, `SellerProtectedRoute`, `ProtectedAdminRoute` | Auth gates verified |
| Global layout | `AppLayout`, `HomeHeader`, `HomeFooter` | Single chrome architecture (8H.4+) |
| Category hierarchy | `mainCategoryHierarchy.js` | 16-category system finalized (8H.13.1) |
| Marketplace cards | `components/Marketplace/cards/*` | Unified card system (8H.8) |
| Auth presentation | `components/Auth/*` | Phase 5A + 8I.1 chrome |
| UI primitives | `components/ui/*` (11 components) | Shared across all surfaces |
| Brand constants | `ui-polish/brandConstants.js` | YEBONE/YEBO naming locked |
| YIP platform core | `src/ai/index.js`, `ai/core/YIPProvider.jsx` | 300+ module exports; downstream depends on API |
| Design tokens | `design-system/tokens/`, `global.css` | Phase 8G enterprise system |

### Stable APIs (backend contract — do not change frontend paths)
All `${server}/…` endpoints in `redux/actions/` and components. Key groups:
- `/user/*`, `/shop/*`, `/product/*`, `/order/*`, `/bids/*`, `/flashsale/*`, `/event/*`, `/conversation/*`, `/message/*`, `/commission/*`, `/withdraw/*`, `/coupon/*`

### Stable authentication flow
1. Login → `POST /user/login-user` → `setAuthToken(token)` cookie
2. App mount → `loadUser()` → `GET /user/getuser` with Bearer
3. Axios interceptor → attaches Bearer from cookie on every request
4. Logout → `GET /user/logout` + `clearAuthSession()`
5. Seller parallel flow with `seller_token`
6. Google → `${server}/auth/google?redirect=…` → `/login-success?token=`

### Stable routing
- Auth routes outside `AppLayout`: `/login`, `/sign-up`, `/shop-login`, etc.
- Public routes inside `AppLayout`
- Protected wrappers: `ProtectedRoute`, `SellerProtectedRoute`, `ProtectedAdminRoute`
- Catch-all `*` → `NotFoundPage`

### Stable branding
- **Marketplace:** YEBONE — `#29625d`, `#1a4c47`, `#fed592`
- **AI:** YEBO AI / YIP
- Tailwind: `yebone-*` prefix
- CSS vars: `--yebone-*`

### Stable reusable components
`Button`, `Card`, `Badge`, `Input`, `SearchBar`, `ProductCardShell`, `CategoryCard`, `SectionTitle`, `Container`, `PageMeta`, `ErrorState`, `AuthLayout`, `AuthFloatingInput`, `AuthGoogleButton`, `DashboardLayout`, `Loader`, `MarketplaceCardGrid`, `MarketplaceCardRail`

---

## Roadmap: Phases 10–15

> **Architectural mandate:** Every phase builds incrementally on the current codebase. No rewrites. No duplicate auth. No new router. No rebranding.

---

### Phase 10 — Production Hosting & Go-Live Hardening

| Field | Detail |
|-------|--------|
| **Objective** | Make the committed Phase 9 build accessible at a stable production URL with verified login/logout |
| **Scope** | GitHub Pages activation OR Netlify connect; `homepage` in `package.json`; production env vars; smoke tests; deployment runbook |
| **Deliverables** | Live URL; `docs/PHASE_10_RELEASE_REPORT.md`; production verification checklist pass; fix `npm run deploy` on Windows or document manual deploy |
| **Files affected** | `package.json`, `netlify.toml`, `.env.example`, `docs/DEPLOYMENT.md` (~5–8 files) |
| **Risks** | GitHub Pages subdirectory asset paths; backend CORS rejects production origin |
| **Dependencies** | GitHub repo admin access; backend team CORS whitelist for Pages URL |
| **Definition of Done** | Homepage HTTP 200; login + logout + refresh work on production URL; API health pass; zero CORS failures; Phase 9 blocker cleared |

**Explicitly NOT in scope:** UI redesign, auth rewrite, new features, portal wiring

---

### Phase 11 — Customer Portal Integration (Incremental)

| Field | Detail |
|-------|--------|
| **Objective** | Wire `customer-ui/` routes into `App.js` behind feature flag OR migrate individual pages to production paths |
| **Scope** | Mount `CustomerUIRoutes` at `/customer-ui/*` first (opt-in path); replace `mockCustomerData` with Redux selectors + existing API actions one page at a time |
| **Deliverables** | `/customer-ui` live with real product/cart/order data; migration matrix doc; no regression on `/products`, `/checkout` |
| **Files affected** | `App.js`, `customer-ui/pages/*`, `customer-ui/data/*` (~15–25 files) |
| **Risks** | Duplicate cart/checkout paths; mock → live data shape mismatches |
| **Dependencies** | Phase 10 production URL live |
| **Definition of Done** | Customer portal routes reachable; cart/checkout/orders use same Redux slices as production routes; mock data removed from integrated pages |

**Build on:** `customer-ui/`, existing Redux `cart`, `order`, `wishlist`, `user` slices, `ApplicationShell`

---

### Phase 12 — Vendor & Admin Portal Integration

| Field | Detail |
|-------|--------|
| **Objective** | Wire `vendor-ui/` and `admin-ui/` with live seller/admin API data |
| **Scope** | Mount portal routes; connect `vendor-ui` to shop Redux actions; connect `admin-ui` to admin actions; preserve existing `/dashboard` and `/admin/*` routes during transition |
| **Deliverables** | `/vendor-ui` and `/admin-ui` with real data; role gates preserved; side-by-side comparison with legacy dashboards |
| **Files affected** | `App.js`, `vendor-ui/*`, `admin-ui/*`, `application/layouts/*` (~20–35 files) |
| **Risks** | Admin role leakage; seller token scope; parallel dashboard confusion |
| **Dependencies** | Phase 11 portal pattern established |
| **Definition of Done** | Vendor portal shows live products/orders; admin portal shows live users/sellers; `ProtectedAdminRoute` / `SellerProtectedRoute` reused |

---

### Phase 13 — AI Production Hardening

| Field | Detail |
|-------|--------|
| **Objective** | Unify mock/live AI config; secure provider keys; connect AI recommendations to live product catalog |
| **Scope** | Resolve `ProviderConfig` vs `yipConfig` conflict; enable `ai-search` behind flag; optional backend proxy for LLM keys; wire `RecommendationEngine` to Redux `products` |
| **Deliverables** | Single provider config source; env-based feature flags doc; AI panel uses live catalog titles/prices; no client-side key exposure in production build |
| **Files affected** | `ai/config/*`, `ai/providers/*`, `ai/commerce/*`, `components/ai/*` (~20–40 files) |
| **Risks** | API cost exposure; provider rate limits; bundle size increase |
| **Dependencies** | Production env management (Phase 10); optional backend proxy endpoint |
| **Definition of Done** | With keys set, assistant returns live LLM responses; without keys, graceful mock fallback; recommendations reference real product IDs |

**Do NOT:** Replace `YIPProvider`, `ai/` module structure, or `GlobalAIFab`

---

### Phase 14 — Quality, Performance & Test Coverage

| Field | Detail |
|-------|--------|
| **Objective** | Address Phase 6 RC gaps: code splitting, tests, lint cleanup, bundle diet |
| **Scope** | `React.lazy` for route components in `App.js`; Playwright E2E for auth + checkout smoke; reduce ESLint warnings; PageMeta on remaining pages; analyze `ml5`/`tfjs` usage |
| **Deliverables** | E2E suite in CI; route chunks < 500 KB initial; PageMeta on 100% public pages; ESLint warnings < 50 |
| **Files affected** | `App.js`, `routes/*`, `pages/*`, `package.json`, new `e2e/` folder (~30–50 files) |
| **Risks** | Lazy route regressions; test flakiness with Render cold starts |
| **Dependencies** | Phase 10 production URL for E2E target |
| **Definition of Done** | `npm run build` initial chunk < 1 MB gzip; E2E auth test passes in CI; RC score ≥ 95/100 |

---

### Phase 15 — Enterprise Scale & Operational Readiness

| Field | Detail |
|-------|--------|
| **Objective** | Production SaaS operational maturity: monitoring, CI/CD, domain, optional Supabase, runbooks |
| **Scope** | `yebone.com` DNS + SSL; GitHub Actions CI (lint/build/test); error monitoring; Supabase evaluation for analytics/flags only; deployment automation; incident runbook |
| **Deliverables** | CI pipeline; custom domain live; `docs/RUNBOOK.md`; monitoring dashboard; Supabase decision doc |
| **Files affected** | `.github/workflows/*`, `docs/*`, `public/sitemap.xml`, env config (~10–20 files) |
| **Risks** | Domain migration breaks OAuth redirect URLs; Supabase scope creep |
| **Dependencies** | Phases 10–14 complete |
| **Definition of Done** | `www.yebone.com` serves production build; CI green on every PR; on-call runbook exists; OAuth redirects updated for production domain |

---

## Phase 10 Entry Checklist (Immediate Next Steps)

Before writing Phase 10 code, confirm:

- [ ] GitHub Pages enabled on `gh-pages` branch
- [ ] `"homepage": "https://bonerabliaise.github.io/yebo-marketplace"` committed to `main`
- [ ] Production build uses `REACT_APP_API_URL` (Render API — no dev proxy)
- [ ] Backend CORS allows GitHub Pages origin
- [ ] Login/logout verified on live URL
- [ ] `docs/PHASE_9_RELEASE_REPORT.md` committed to `main`

---

## Appendix: Git Tag Inventory

| Tag | Phase |
|-----|-------|
| `v1.0.0-release-candidate` | 6 |
| `v1.0.0-phase-7g` | 7G |
| `v1.0.0-phase-7i` / `hotfix` | 7I |
| `v1.0.0-phase-8a1`–`8a3-final` | 8A |
| `v1.0.0-phase-8b1`–`8b3` | 8B |
| `v1.0.0-phase-8d` | 8D |
| `v1.0.0-phase-8h3` | 8E–8H.3 |
| `v1.0.0-phase-8h8` | 8H.4–8H.8 |
| `v1.0.0-phase-8h12` | 8H.12 |
| `v1.0.0-phase-8h13` / `8h13-1` | 8H.13 / 8H.13.1 |

**No tag yet for Phase 9** — recommend `v1.0.0-phase-9` at Phase 10 gate.

---

*This document is the authoritative engineering baseline for Phases 10–15. All future work must reference this audit before implementation.*
