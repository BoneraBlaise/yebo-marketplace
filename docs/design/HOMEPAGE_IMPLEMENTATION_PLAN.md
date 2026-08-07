# Yebone Homepage — Senior Product Design Implementation Plan

**Document type:** Pre-implementation design & product specification  
**Date:** 2026-08-06  
**Author role:** Principal Product Designer · UX Research · CRO · Marketplace Strategy  
**Source of truth:** [`HOMEPAGE_UX_AUDIT.md`](./HOMEPAGE_UX_AUDIT.md)  
**Scope:** Homepage (`/`) — header through footer  
**Status:** Planning only — **no code, CSS, or implementation in this phase**

---

## Positioning Statement

Yebone is a **premium multi-vertical marketplace** (Shopping · Property · Mobility · Events · Auctions) — not an Apple marketing site. The quality bar is **Airbnb × Shopify × Etsy** for discovery and conversion, with **Apple-level spacing, typography, and craft** applied to marketplace patterns: inventory-first, trust-after-proof, restrained hero, strategic merchandising.

---

# 1. Executive Summary

### Current Homepage Strengths

| Strength | Evidence |
|----------|----------|
| **Brand differentiation** | AI virtual try-on (`HeroAIShowcase`), teal + gold palette, glass surfaces — memorable and on-brand |
| **Unified product card foundation** | `ProductCard` used across rails, growth commerce, AI picks — recent polish is the right direction |
| **Best-in-class discovery pattern (buried)** | `HomeProductRails` tabbed collections + horizontal rail + “View all” matches Nike/Shopify patterns |
| **Multi-vertical IA** | `HomeMarketplaceHub` clearly communicates Shopping · Property · Mobility |
| **Search UX** | Header search with recent/trending discovery panel — Airbnb/Amazon analog |
| **Trust architecture (concept)** | Verified vendors, feature strip, testimonials — correct ingredients, wrong order |
| **Performance-conscious engineering** | Lazy-loaded sections, skeleton states, conditional growth commerce |
| **Responsive maturity** | Mobile accordion footer, compact header variants, swipe rails |

### Current Homepage Weaknesses

| Weakness | Impact |
|----------|--------|
| **Products buried 4–6 viewports below fold** | Core marketplace job fails for first-time visitors |
| **4+ separate AI regions** | Cognitive overload; no canonical AI entry point |
| **Placeholder/mock UI in production paths** | Newsletter “UI preview only,” assistant placeholders, static trending chips — trust erosion |
| **Duplicate product collections** | Growth commerce grids + product rails + AI discovery + AI Picks show overlapping SKUs |
| **Flash sale card breaks design system** | `HomeFlashSaleCard` vs unified `ProductCard` |
| **Severe scroll fatigue** | ~12–18 viewport heights (guest); mobile users rarely reach vendors, newsletter, testimonials |
| **Quadruple category navigation** | Header mega-menu + nav strip + hub chips + category grid |
| **Trust before inventory** | Feature strip and hero stats claim trust before user sees products |
| **Personalization placed too late** | `HomeRecentlyViewed` near footer for auth users |

### Current Production Readiness

| Dimension | Score (Audit) | Production verdict |
|-----------|---------------|-------------------|
| Visual Design | 7.5 / 10 | Strong craft; inconsistent section templates |
| UX | 6.0 / 10 | Not launch-ready — structural IA issues |
| Information Architecture | 5.5 / 10 | Story-first, not marketplace-first |
| Trust & Credibility | 6.0 / 10 | Undermined by visible placeholders |
| Conversion | 5.5 / 10 | Weak path to transaction |
| Performance Perception | 7.0 / 10 | Good skeletons; page length hurts perceived speed |
| Premium Feel | 7.0 / 10 | Ambition visible; restraint missing |
| **Overall** | **63 / 100** | **~55% production-ready** |

**Gate criteria not met for public launch:**
- Mock/placeholder surfaces visible to end users
- Product discovery not within first scroll
- Non-functional newsletter capture
- Non-interactive AI assistant grid shipped on homepage

### Estimated UX Score After Redesign

| Phase | Scope | Projected Overall |
|-------|-------|-------------------|
| P1–P3 (IA + AI collapse + placeholder removal) | Core structural fixes | **74 / 100** |
| P4–P7 (banner system + card unification + scroll reduction) | Merchandising + consistency | **78 / 100** |
| P8–P10 (personalization + trust authenticity + polish) | Returning users + credibility | **82 / 100** |

**Target:** 78–82 / 100 — competitive with premium marketplace launch bar (Shopify Plus storefront, Etsy homepage, Airbnb discovery entry).

---

# 2. Section-by-Section Plan

Each section follows audit findings. **No code** — product and design specifications only.

---

## 0. Global Header & Secondary Navigation

| Field | Detail |
|-------|--------|
| **Current purpose** | Primary wayfinding, unified search (products/property/mobility/events), account actions, vendor create, category shortcuts |
| **Problems** | Nine interactive clusters on desktop; category nav strip duplicates mega-menu + homepage sections; visual search and YEBO sparkle lack first-visit labels; header height reduces above-fold product visibility |
| **Recommended changes** | (1) Collapse or hide secondary category nav strip on homepage only. (2) Reduce icon-only clusters — add tooltips or micro-labels on first visit. (3) Establish search as visual anchor (60% row width on desktop). (4) Defer “My Shop” behind profile for non-vendors. |
| **Reason** | Hick’s Law — four category paths on one page paralyze orientation; marketplace homepages lead with search + cart, not nav proliferation |
| **Expected UX impact** | High — faster orientation, more vertical space for content |
| **Expected conversion impact** | Medium-high — search is primary conversion entry; decluttering increases usage |
| **Complexity** | Medium |
| **Risk** | Medium — power users may miss nav strip; mitigate with hub section below fold |
| **Files/components likely affected** | `HomeHeader.jsx`, `MobileCategoriesPanel.jsx`, `mobileCategoriesNav.css`, layout shell (`Header.jsx`), `NavigationConfig.js`, `mainCategoryHierarchy.js` |

---

## 1. Hero (`HomeHero` + `HeroAIShowcase`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Brand promise, AI try-on differentiation, vertical CTAs |
| **Problems** | Three equal-weight CTAs; stat row (“100% Confidence”) reads as filler; generous padding pushes products far below fold; “Try AI Now” anchor weak (scrolls through marketing first) |
| **Recommended changes** | (1) **One primary CTA:** “Start Shopping” → `/products`. (2) **One secondary CTA:** “Try AI Virtual Try-On” OR “Browse Property” — not both. (3) Remove stat row or replace with verifiable metric (e.g., “12,000+ products” when true). (4) Reduce vertical padding ~30%. (5) Keep `HeroAIShowcase` as brand anchor — it is the differentiation moment. |
| **Reason** | Stripe/Shopify heroes maintain single conversion spine; stats without proof damage premium credibility |
| **Expected UX impact** | High — clearer intent, shorter path to inventory |
| **Expected conversion impact** | Medium-high — click concentration on shopping path |
| **Complexity** | Low |
| **Risk** | Low |
| **Files/components likely affected** | `HomeHero.jsx`, `HeroAIShowcase.jsx`, `home.css` |

---

## 2. Trust / Feature Strip (`HomeFeatureStrip`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Quick trust signals — payments, delivery, AI try-on, returns, verified vendors |
| **Problems** | Appears before product evidence; claims without linked proof; duplicates testimonials and vendor section; awkward 2+2+1 mobile grid |
| **Recommended changes** | **Move** below first product row OR merge into compact footer trust bar. Reduce from five pillars to three on homepage (Secure checkout · Fast delivery · Verified sellers). Link each to policy/support page. |
| **Reason** | Airbnb/Amazon place trust after user sees inventory — “proof then promise” |
| **Expected UX impact** | Medium — better trust timing, less pre-product noise |
| **Expected conversion impact** | Medium — trust lands when purchase intent forms |
| **Complexity** | Low |
| **Risk** | Low |
| **Files/components likely affected** | `HomeFeatureStrip.jsx`, `HomePage.jsx` (order), `home.css` |

---

## 3. Marketplace Hub (`HomeMarketplaceHub`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Introduce Shopping · Property · Mobility pillars with deep links and sub-category chips |
| **Problems** | Repeats hero copy; three large cards before products; shopping pillar under-served (one chip); abstract cards vs photo-first (Airbnb) |
| **Recommended changes** | (1) **Move** below first product row. (2) Add listing preview thumbnails or live counts per vertical. (3) Merge partially with category exploration — vertical tabs: Shop · Property · Mobility · Events. (4) Shorten copy — remove “everything in one place” repetition. |
| **Reason** | Multi-vertical positioning is valuable but must not block shopping momentum |
| **Expected UX impact** | Medium-high — vertical discovery without scroll penalty |
| **Expected conversion impact** | Medium — property/mobility leads preserved; shopping path unblocked |
| **Complexity** | Medium |
| **Risk** | Low |
| **Files/components likely affected** | `HomeMarketplaceHub.jsx`, `HomePage.jsx`, `homeMarketplaceCategories.js` |

---

## 4. Growth Commerce (`HomeGrowthCommerce`)

| Field | Detail |
|-------|--------|
| **Current purpose** | API-driven merchandising — banners, flash sale, featured/trending/new/best sellers, top vendors |
| **Problems** | Up to 8 blocks when enabled; duplicates product rails; campaign hero reintroduces large marketing band; top vendors text-only placeholder; fixed `SECTION_ORDER` in code |
| **Recommended changes** | (1) **Reframe as Banner + Feed engine** — not independent product grids. (2) Product grids feed **Product Rails tabs** via API, not separate sections. (3) Retain only: hero banner slot, campaign banner slot, flash sale data source. (4) Admin-configurable slot priority (see §4 Banner Strategy). (5) Hide top vendors until real vendor cards render. |
| **Reason** | Shopify Sections model — ops controls merchandising without duplicating UI patterns |
| **Expected UX impact** | Very high — eliminates largest duplication source |
| **Expected conversion impact** | High — campaigns visible without scroll multiplication |
| **Complexity** | High |
| **Risk** | Medium — requires backend/API contract for slot-based banners |
| **Files/components likely affected** | `HomeGrowthCommerce.jsx`, `growthCommerceService.js`, backend homepage config endpoints, `HomePage.jsx` |

---

## 5. Shop by Category (`HomeCategories`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Visual category grid for main shopping taxonomy |
| **Problems** | Third/fourth category nav pattern; appears late; no subcategory depth signal |
| **Recommended changes** | (1) **Move** immediately after first product row (guest) or after Recently Viewed (auth). (2) Show 6–8 top categories max on homepage; “Browse all” for remainder. (3) Add subtle product count or “2.4k items” when data available. (4) Do not duplicate header mega-menu categories 1:1 — curate homepage set. |
| **Reason** | Category grids belong early in discovery funnel — Etsy/Amazon pattern |
| **Expected UX impact** | High — faster category entry |
| **Expected conversion impact** | High — category browsers convert when reachable |
| **Complexity** | Low |
| **Risk** | Low |
| **Files/components likely affected** | `HomeCategories.jsx`, `HomeCategoryCard.jsx`, `homeCategories.css`, `categoryPhotoMap.js`, `HomePage.jsx` |

---

## 6. Discover Products — Tabbed Rails (`HomeProductRails`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Primary product discovery — Trending, New Arrivals, Popular, Flash Sale, Recommended |
| **Problems** | Buried below marketing; flash tab uses different card; five tabs on mobile; Recommended overlaps AI Picks; no URL persistence |
| **Recommended changes** | (1) **Move to position #2** (guest) or #3 (auth, after Recently Viewed). (2) Reduce to **4 tabs:** Trending · New · Flash Sale · For You (auth-gated). (3) Unify flash presentation on `ProductCard` + countdown badge overlay. (4) Merge Recommended + AI Picks into “For You.” (5) Optional: deep-link tabs (`/?collection=trending`). |
| **Reason** | This is the canonical ecommerce block — audit identifies it as best section on page |
| **Expected UX impact** | Very high — immediate inventory proof |
| **Expected conversion impact** | Very high — direct GMV lever |
| **Complexity** | Medium |
| **Risk** | Low |
| **Files/components likely affected** | `HomeProductRails.jsx`, `MarketplaceCardRail.jsx`, `HomeFlashSaleCard.jsx` (deprecate or wrap), `homeProductFilters.js`, `ProductCard.jsx`, `HomePage.jsx` |

---

## 7. AI Experience (`HomeAIExperience`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Explain four AI capabilities; embed `AISearch`; link to AI Picks |
| **Problems** | Fourth AI block; vague copy; feature cards non-clickable; overlaps header YEBO sparkle |
| **Recommended changes** | **Merge** into single “YEBO Intelligence” band (see §3 hierarchy): `AISearch` input + virtual try-on CTA + “Open YEBO” panel link. Remove four-feature grid. One sentence value prop: concrete outcome (“Find your size in 10 seconds”). |
| **Reason** | One AI story — Apple Intelligence marketing uses single surface, not four |
| **Expected UX impact** | Very high — removes redundancy |
| **Expected conversion impact** | Medium — AI drives differentiation, not direct cart adds |
| **Complexity** | Medium |
| **Risk** | Low |
| **Files/components likely affected** | `HomeAIExperience.jsx`, `AISearch.jsx`, `AISection.jsx`, `HomePage.jsx` |

---

## 8. Ask YEBO / AI Discovery (`HomeAIDiscovery`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Personalized YEBO surface — memory, trending, recommendations, proactive banners |
| **Problems** | Largest UX liability; mock/static data; 10+ sub-modules; duplicates header search discovery; “Trending” label proliferation |
| **Recommended changes** | **Remove from public homepage.** Relocate to: (1) YEBO slide-out panel (header sparkle), (2) authenticated account home / dashboard. Optionally retain **one** “Ask YEBO anything” card inside merged AI band — no product grid, no static chips. |
| **Reason** | Belongs in product UI (panel/account), not marketing homepage — reduces scroll ~2 viewports |
| **Expected UX impact** | Very high — largest single scroll reduction |
| **Expected conversion impact** | Medium — returning users get personalization in panel, not buried |
| **Complexity** | Medium |
| **Risk** | Medium — ensure panel absorbs relocated functionality |
| **Files/components likely affected** | `HomeAIDiscovery.jsx`, YEBO panel components, `HomePage.jsx`, `AIRecommendations.jsx` |

---

## 9. Shopping Assistants (`AIShoppingAssistants`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Six assistant persona placeholders |
| **Problems** | Subtitle admits “presentation placeholders”; non-interactive; duplicates AI Experience |
| **Recommended changes** | **Remove entirely** from homepage until interactive. If needed pre-launch, single card in YEBO panel: “Shopping assistant — coming soon.” |
| **Reason** | Dead-end UI actively frustrates users and signals incomplete product |
| **Expected UX impact** | High — removes dead-end scroll section |
| **Expected conversion impact** | Low direct; high trust indirect |
| **Complexity** | Low |
| **Risk** | Low |
| **Files/components likely affected** | `AIShoppingAssistants.jsx`, `HomePage.jsx` |

---

## 10. AI Picks (`HomeAIPicks`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Curated “AI Picks for you” product grid |
| **Problems** | Third recommendation block; badge fatigue; overlaps Recommended tab; late placement |
| **Recommended changes** | **Merge** into Product Rails as auth-gated **“For You”** default tab. Remove standalone section. Show only when personalization signal exists (history, prefs); else hide tab. |
| **Reason** | One recommendation surface — Amazon “Inspired by your browsing” is a row, not a section |
| **Expected UX impact** | High — cleaner IA |
| **Expected conversion impact** | Medium-high for returning users |
| **Complexity** | Medium |
| **Risk** | Low |
| **Files/components likely affected** | `HomeAIPicks.jsx`, `homeAIPicksFilters.js`, `HomeProductRails.jsx`, `HomePage.jsx` |

---

## 11. Events (`HomeEventsBanner` / `HomeEventsSection`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Promote events vertical — fashion weeks, festivals, vendor showcases |
| **Problems** | Desktop banner decorative (no dates/venues); 320–420px min-height; breakpoint split at 900px unexplained; late placement |
| **Recommended changes** | (1) Replace mosaic with **2–3 real event cards** (photo, date, venue, price). (2) Reduce max height (see §4 Event Banner). (3) **Move** into Marketplace Hub as fourth vertical tab OR slot after hub. (4) Unify desktop/mobile — same card component, responsive layout. |
| **Reason** | Events are equal vertical — deserve hub linkage, not orphaned late banner |
| **Expected UX impact** | Medium |
| **Expected conversion impact** | Medium — events vertical GMV |
| **Complexity** | Medium |
| **Risk** | Low |
| **Files/components likely affected** | `HomeEventsBanner.jsx`, `HomeEventsSection.jsx`, `HomePage.jsx`, Events API/components |

---

## 12. Verified Vendors (`HomeVerifiedVendors`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Trust + seller discovery — featured grid + browse rail |
| **Problems** | Late placement (after AI fatigue); subtitle exposes implementation detail; sparse when `isVerified` flag missing |
| **Recommended changes** | (1) **Move** to post-products, pre-AI band. (2) Single featured row (4 vendors) + “Browse all shops” CTA. (3) Remove implementation copy. (4) Merge with growth commerce “top vendors” when both exist — one vendor surface. |
| **Reason** | Trust after inventory — Airbnb Superhost pattern |
| **Expected UX impact** | Medium-high |
| **Expected conversion impact** | Medium — shop discovery, repeat purchase |
| **Complexity** | Low |
| **Risk** | Low |
| **Files/components likely affected** | `HomeVerifiedVendors.jsx`, `MarketplaceVendorCard` (if exists), `HomePage.jsx` |

---

## 13. Testimonials (`HomeReviews`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Social proof — three shopper quotes |
| **Problems** | Hardcoded; no photos/links; all five-star; very late; redundant with trust strip |
| **Recommended changes** | **Option A:** Remove until real review API integrated. **Option B:** Single rotating quote in hero or post-product trust micro-band with link to product reviewed. **Option C:** Aggregate star rating near product rails (“4.8 from 12,400 reviews”) when data exists. |
| **Reason** | Fake social proof worse than none — Stripe uses logos and metrics |
| **Expected UX impact** | Medium (trust authenticity) |
| **Expected conversion impact** | Medium when real; negative when detected as template |
| **Complexity** | Medium (if wired to reviews API) |
| **Risk** | Low if removed; Medium if integrated |
| **Files/components likely affected** | `HomeReviews.jsx`, `HomePage.jsx`, reviews API/service |

---

## 14. Continue Browsing (`HomeRecentlyViewed`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Auth users resume from cookie/local history |
| **Problems** | Near footer; duplicates `YEBOContinueShopping` inside AI Discovery |
| **Recommended changes** | (1) **Move to position #1 content block** for authenticated users (immediately after compact hero or replace hero with slim greeting). (2) Remove duplicate from AI Discovery relocation. (3) Title: “Continue where you left off” — Amazon pattern. |
| **Reason** | Highest-intent content for returning users must be above the fold |
| **Expected UX impact** | Very high (returning users) |
| **Expected conversion impact** | Very high — session recovery |
| **Complexity** | Low |
| **Risk** | Low |
| **Files/components likely affected** | `HomeRecentlyViewed.jsx`, `RecentlyViewed` component, `HomePage.jsx` |

---

## 15. Newsletter (`HomeNewsletter`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Email capture — deals, AI updates, vendor launches |
| **Problems** | Toast says “UI preview only”; generic value prop; bottom placement after scroll fatigue |
| **Recommended changes** | (1) **Wire backend** OR remove standalone section until functional. (2) If kept: add incentive (“10% off first order”). (3) Consider **footer-only capture** to reduce section count. (4) Never show non-functional submit in production. |
| **Reason** | Broken forms damage trust more than missing forms |
| **Expected UX impact** | Medium |
| **Expected conversion impact** | Medium (list growth) |
| **Complexity** | Medium (backend) / Low (remove) |
| **Risk** | Low |
| **Files/components likely affected** | `HomeNewsletter.jsx`, newsletter API, `HomeFooter.jsx`, `HomePage.jsx` |

---

## 16. Footer (`HomeFooter`)

| Field | Detail |
|-------|--------|
| **Current purpose** | Legal, support, shop links, brand, social |
| **Problems** | Some links duplicate paths (`Press`/`Investors` → `/about`); social buttons non-linked placeholders |
| **Recommended changes** | (1) Wire real social URLs or hide icons. (2) Unique destinations per link. (3) Optional: compact email capture merged here. (4) Keep mobile accordion — recent polish win. |
| **Reason** | Footer is terminal trust surface — placeholders feel unfinished |
| **Expected UX impact** | Low-medium |
| **Expected conversion impact** | Low |
| **Complexity** | Low |
| **Risk** | Low |
| **Files/components likely affected** | `HomeFooter.jsx`, `Footer.jsx`, `home.css` |

---

# 3. Homepage Hierarchy Redesign

## Design Principle

**Job 1:** Browse and buy (products).  
**Job 2:** Explore verticals (property, mobility, events).  
**Job 3:** Understand differentiation (AI try-on).  
**Job 4:** Trust and return (vendors, reviews, newsletter).

Premium marketplaces invert current Yebone order: **inventory within first viewport**, story compressed, personalization first for returning users.

---

## Recommended Order — Guest (Unauthenticated)

| # | Section | Rationale (User Psychology) |
|---|---------|----------------------------|
| 0 | **Header** (search-forward) | Persistent orientation; search = highest-intent action (Amazon) |
| 1 | **Compact Hero** (brand + 1 CTA) | 3-second brand hook — not a landing page |
| 2 | **Admin Hero Banner Slot** (optional, max 1) | Revenue without blocking products — slim campaign strip if active |
| 3 | **Product Rails — Trending** (default tab) | **Immediate inventory proof** — “this marketplace is alive” |
| 4 | **Shop by Category** (curated 6–8) | Branching discovery for browsers who think in categories (Etsy) |
| 5 | **Marketplace Hub** (Shop · Property · Mobility · Events) | Vertical expansion after shopping habit established |
| 6 | **Campaign Banner Slot** (inline, optional) | Mid-funnel merchandising — user engaged, not bounced |
| 7 | **Verified Vendors** (one row) | Trust **after** seeing products and sellers’ inventory |
| 8 | **Product Rails secondary exposure** OR Flash Sale banner slot | Urgency/deals when data exists — not duplicate grid |
| 9 | **Single YEBO Band** (search + try-on CTA) | Differentiation once user trusts marketplace |
| 10 | **Events** (real cards, compact) | Vertical upsell — emotional break from product grids |
| 11 | **Trust micro-band** (3 icons OR one testimonial) | Consolidated social proof — not five separate blocks |
| 12 | **Newsletter** (if functional) OR footer capture only | Low commitment ask at end of value delivery |
| 13 | **Footer** | Terminal navigation |

**Estimated viewports (guest):** 6–8 (down from 12–18) — **~45% scroll reduction**.

---

## Recommended Order — Authenticated (Returning User)

| # | Section | Rationale |
|---|---------|-----------|
| 0 | Header | Same |
| 1 | **Continue Browsing / Recently Viewed** | **Highest intent first** — Amazon “Pick up where you left off” |
| 2 | **Product Rails — “For You”** (default tab) | Personalized inventory immediately |
| 3 | Compact Hero OR slim welcome strip (“Welcome back, {name}”) | Brand optional — user already knows platform |
| 4–13 | Guest arc (compressed) | Skip redundant hero if Recently Viewed populated; suppress empty sections |

**Why auth differs:** Returning users skip acquisition narrative. Personalization is the hero. Guest users need inventory proof before story.

---

## Why This Order Works

1. **Conversion psychology:** Users decide “is there something for me?” in <5 seconds — product rails answer that.
2. **Trust sequencing:** Claims after evidence (products → vendors → testimonials).
3. **Banner discipline:** Max 2–3 banner slots per session (hero + mid + optional flash) — revenue without clutter.
4. **AI restraint:** One band, not four — differentiation without fatigue.
5. **Vertical balance:** Hub after shopping momentum — property/mobility users self-select without blocking shoppers.

---

# 4. Banner Strategy

## System Overview

Design a **slot-based banner engine** (admin-controlled via Growth Commerce API) with:

- **Fixed slot positions** on homepage — not unlimited injection
- **Priority queue** per slot — highest revenue campaign wins
- **Frequency caps** — same user does not see >3 promotional banners per visit
- **Premium constraints** — max combined banner height ≤ 35% of any viewport
- **Unified `HomeBanner` component** — variants via props, not separate implementations

### Global Rules

| Rule | Value |
|------|-------|
| Max active banners per page load | **3** (hero + 1 inline + 1 contextual) |
| Max auto-rotating banners | **1** (hero slot only) |
| Default dismissible | Announcement only |
| Animation | Subtle fade/slide; respect `prefers-reduced-motion` |
| Empty slot behavior | Collapse — no placeholder height |

---

## Banner Type Specifications

### 1. Hero Banner

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Primary campaign spotlight — seasonal sale, brand partnership, platform moment |
| **Ideal placement** | Slot #2 — immediately below compact hero, above product rails |
| **Desktop size** | Full container width × **120–160px** height (slim) OR **280–320px** (rich image) |
| **Tablet size** | Full width × **100–140px** slim / **220–260px** rich |
| **Mobile size** | Full width × **88–120px** slim / **180–220px** rich |
| **Max recommended height** | **320px** desktop; **220px** mobile |
| **Dismissible** | No |
| **Auto-rotating** | Optional — max **3** slides, **6s** interval, pause on hover/focus |
| **Recommended frequency** | Always-on when campaign active; **1 campaign at a time** |
| **Priority level** | P1 (highest) |
| **Revenue opportunity** | **Very high** — premium above-fold inventory; CPM/CPC for featured campaigns |

---

### 2. Campaign Banner

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Mid-funnel promotion — category sale, vendor collab, coupon code |
| **Ideal placement** | Slot after Marketplace Hub or between product collections (#6) |
| **Desktop size** | Container × **96–128px** (horizontal strip) or **50/50 split** 160px |
| **Tablet size** | Full width × **88–112px** |
| **Mobile size** | Full width × **80–96px** |
| **Max recommended height** | **160px** |
| **Dismissible** | No |
| **Auto-rotating** | No |
| **Recommended frequency** | **1 per scroll session**; rotate weekly |
| **Priority level** | P2 |
| **Revenue opportunity** | **High** — targeted category/vendor sponsorship |

---

### 3. Category Banner

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Drive traffic to specific taxonomy (Fashion Week, Tech Deals) |
| **Ideal placement** | Adjacent to Shop by Category section OR as first category tile (featured) |
| **Desktop size** | **280×140px** card OR full-width **112px** strip |
| **Tablet size** | **240×120px** or full-width **96px** |
| **Mobile size** | Full width × **80px** strip OR replaces one category tile |
| **Max recommended height** | **140px** |
| **Dismissible** | No |
| **Auto-rotating** | No |
| **Recommended frequency** | **1** category feature at a time |
| **Priority level** | P3 |
| **Revenue opportunity** | **Medium-high** — category sponsors |

---

### 4. Seasonal Banner

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Holiday/event commerce (Ramadan, Christmas, Back to School, Kigali Fashion Week) |
| **Ideal placement** | Hero slot OR replaces hero banner during season peak |
| **Desktop size** | Full width × **160–240px** (themed imagery) |
| **Tablet size** | Full width × **140–200px** |
| **Mobile size** | Full width × **120–160px** |
| **Max recommended height** | **240px** |
| **Dismissible** | No |
| **Auto-rotating** | Optional — seasonal carousel max 2 slides |
| **Recommended frequency** | Season-bound; auto-expire by date |
| **Priority level** | P1 during season; suppressed otherwise |
| **Revenue opportunity** | **Very high** — seasonal GMV spikes |

---

### 5. Vendor Sponsored Banner

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Paid placement for verified vendors — shop spotlight |
| **Ideal placement** | Within or above Verified Vendors section |
| **Desktop size** | **600×120px** or vendor card **+20%** scale featured slot |
| **Tablet size** | Full width × **100px** |
| **Mobile size** | Full width × **88px** |
| **Max recommended height** | **120px** |
| **Dismissible** | No |
| **Auto-rotating** | Optional — max 4 vendors, 8s interval |
| **Recommended frequency** | **1–2** sponsored slots; label “Sponsored” (transparency) |
| **Priority level** | P3 |
| **Revenue opportunity** | **High** — direct vendor ad product |

---

### 6. Flash Sale Banner

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Urgency — countdown, limited stock, time-bound deals |
| **Ideal placement** | Above Flash Sale tab content OR inline strip before rails when tab active |
| **Desktop size** | Full width × **72–96px** countdown strip |
| **Tablet size** | Full width × **64–88px** |
| **Mobile size** | Full width × **56–72px** |
| **Max recommended height** | **96px** |
| **Dismissible** | No |
| **Auto-rotating** | No — live countdown |
| **Recommended frequency** | Only when flash sale active |
| **Priority level** | P2 |
| **Revenue opportunity** | **Very high** — conversion urgency |

---

### 7. Property Banner

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Promote listings vertical — apartments, land, commercial |
| **Ideal placement** | Marketplace Hub Property tab OR dedicated slot after hub |
| **Desktop size** | **50/50 image + copy** — **200px** height |
| **Tablet size** | Stacked — **180px** |
| **Mobile size** | **160px** card |
| **Max recommended height** | **200px** |
| **Dismissible** | No |
| **Auto-rotating** | Optional — 3 featured listings |
| **Recommended frequency** | **1** property feature; rotate daily |
| **Priority level** | P4 |
| **Revenue opportunity** | **Medium** — listing promotion fees |

---

### 8. Mobility Banner

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Vehicles — cars, motorcycles, fleet |
| **Ideal placement** | Marketplace Hub Mobility tab OR paired with Property slot |
| **Desktop size** | Same as Property — **200px** |
| **Tablet size** | **180px** |
| **Mobile size** | **160px** |
| **Max recommended height** | **200px** |
| **Dismissible** | No |
| **Auto-rotating** | Optional — 3 vehicles |
| **Recommended frequency** | **1** mobility feature |
| **Priority level** | P4 |
| **Revenue opportunity** | **Medium** — dealer sponsorship |

---

### 9. Event Banner

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Fashion weeks, festivals, vendor showcases, ticketed events |
| **Ideal placement** | Events section / Hub Events tab — **not** standalone 420px mosaic |
| **Desktop size** | **3-card row** — each card **280×160px** |
| **Tablet size** | **2-card row** — **240×140px** |
| **Mobile size** | Horizontal scroll cards **260×140px** |
| **Max recommended height** | **180px** (down from current 320–420px) |
| **Dismissible** | No |
| **Auto-rotating** | No — use real event cards |
| **Recommended frequency** | Show when ≥1 upcoming event |
| **Priority level** | P4 |
| **Revenue opportunity** | **Medium** — event promotion, ticket affiliate |

---

### 10. Announcement Banner

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Platform notices — shipping delays, new feature, policy update |
| **Ideal placement** | **Above header** (global) OR thin strip below header |
| **Desktop size** | Full width × **40–48px** |
| **Tablet size** | Full width × **40–48px** |
| **Mobile size** | Full width × **36–44px** |
| **Max recommended height** | **48px** |
| **Dismissible** | **Yes** — cookie/localStorage 7-day suppress |
| **Auto-rotating** | No |
| **Recommended frequency** | Only critical announcements |
| **Priority level** | P0 (system) — overrides hero when active |
| **Revenue opportunity** | **None** — UX/trust |

---

## Banner Priority Matrix (Conflict Resolution)

When multiple campaigns compete for one slot:

1. **Announcement** (P0) — always wins if critical  
2. **Seasonal / Hero** (P1) — revenue peak  
3. **Campaign / Flash Sale** (P2)  
4. **Category / Vendor Sponsored** (P3)  
5. **Property / Mobility / Event** (P4) — vertical, shown in hub context  

## Anti-Clutter Guardrails

- Never stack two full-width banners adjacent without product content between  
- Sponsored content always labeled  
- Admin dashboard shows **“homepage weight score”** — warn if >3 banners active  
- A/B test banner vs no-banner on conversion before expanding inventory  

---

# 5. Marketplace Discovery

## Current State Assessment

| Discovery Type | Appears Early Enough? | Current Location | Verdict |
|----------------|----------------------|------------------|---------|
| **Products (general)** | ❌ No — 4–6 viewports down | `HomeProductRails` | **Move up — P1** |
| **Property** | ⚠️ Partial — hero CTA + hub, no listings | Hero, Hub | Add preview cards in hub |
| **Mobility** | ⚠️ Partial — same as property | Hero, Hub | Add preview cards in hub |
| **Events** | ❌ No — near page bottom | `HomeEventsBanner` | Move to hub; real cards |
| **Auctions** | ❌ Not on homepage | Header/search only | Add hub chip or rail tab if inventory exists |
| **Flash Sales** | ⚠️ Late + duplicate | Rails tab + Growth Commerce | Unify; optional banner strip |
| **AI recommendations** | ❌ Over-exposed, late | 4 AI sections | Merge to “For You” tab |
| **Recent searches** | ✅ Header dropdown | `HomeHeader` search panel | Keep; remove duplicate from AI Discovery |
| **Trending searches** | ⚠️ Duplicated | Header + AI Discovery static | Header only |
| **Recommended products** | ⚠️ 3× duplication | Rails, AI Discovery, AI Picks | Single “For You” surface |
| **Frequently bought together** | ❌ Not on homepage | Product page only | Optional rail tab when API ready — defer P8 |

## Ideal Discovery Flow

```
┌─────────────────────────────────────────────────────────────┐
│  SEARCH (header) — universal entry for all verticals        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PERSONALIZED ROW (auth) / TRENDING RAIL (guest)            │
│  → Immediate proof of inventory                             │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Category │   │ Vertical │   │  Deals   │
        │  Grid    │   │   Hub    │   │  Banner  │
        └──────────┘   └──────────┘   └──────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PRODUCT RAILS (tabs): Trending · New · Flash · For You     │
│  → Canonical collection browser                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  TRUST + VERTICAL DEPTH (vendors, events, property/mobility)│
└─────────────────────────────────────────────────────────────┘
```

**Principle:** One front door (search) + one product surface (rails) + one vertical explorer (hub). Everything else feeds these three.

---

# 6. Scroll Experience

## Scroll Fatigue Analysis

| Metric | Current | Target |
|--------|---------|--------|
| Estimated viewports (guest) | 12–18 | 6–8 |
| Estimated viewports (auth) | 13–19 | 7–9 |
| Sections count | 15+ | 9–11 |
| AI-dedicated viewports | ~4 | ~0.5 (one band) |
| Product-first viewport | #6+ | #2–3 |

## Sections That Feel Repetitive

| Repetition | Sections Involved | Action |
|------------|-------------------|--------|
| “Trending” label | Product rails, AI Discovery, header search, growth commerce | **One trending surface** |
| Category entry | Header nav, mega-menu, hub chips, category grid | **Collapse to 2 paths:** search + category grid |
| Product recommendations | Rails, Growth commerce, AI Discovery, AI Picks | **Merge to rails** |
| Trust claims | Feature strip, hero stats, testimonials, vendors | **Merge to post-product trust band** |
| AI story | Hero, AI Experience, AI Discovery, Assistants, AI Picks | **Merge to one band + header panel** |
| Continue shopping | Recently Viewed, YEBOContinueShopping | **One location — top for auth** |

## Merge Recommendations

| Merge | Result |
|-------|--------|
| HomeAIExperience + AIShoppingAssistants + AI Picks CTA | Single **YEBO Band** |
| HomeAIDiscovery product grid + HomeAIPicks | **Product Rails “For You” tab** |
| HomeFeatureStrip + HomeReviews (when real) | **Trust micro-band** |
| HomeMarketplaceHub + Events entry | **Unified vertical hub** |
| Growth commerce product grids + HomeProductRails | **API-fed tabs** |

## Remove from Homepage Scroll

- `AIShoppingAssistants` (entire section)
- `HomeAIDiscovery` (majority — relocate to panel)
- Growth commerce duplicate grids
- Hero stat row
- Testimonials (until authentic)

## Move Up

- `HomeProductRails` → #2–3
- `HomeCategories` → #4
- `HomeRecentlyViewed` → #1 (auth)

## Move Down

- `HomeFeatureStrip` → post-products
- `HomeAIExperience` → post-vendors (merged)
- `HomeNewsletter` → footer-only optional

**Target feeling:** Lighter, faster, more premium — user reaches footer in 6–8 swipes on mobile, not 15+.

---

# 7. Product Card System

Review of unified `ProductCard` (`src/components/Marketplace/ProductCard.jsx`).

**Audit baseline:** Strong foundation from recent marketplace polish. List **improvements only**.

| Element | Production Quality? | Improvement Required |
|---------|--------------------|-----------------------|
| **Image ratio** | ✅ Mostly — `ypc__media` consistent | Enforce **4:5 or 1:1** site-wide; flash card uses 4:5 separately — unify |
| **Price** | ✅ Clear RWF formatting | Show **discount %** badge when `hasDiscount` — optional P3 |
| **Title** | ✅ 2-line clamp | Verify **min-height** for grid alignment when titles vary |
| **Ratings** | ✅ Via `ProductCardReviews` | Hide row when `reviewCount === 0` — avoid empty stars |
| **Verified badge** | ✅ Present | Ensure badge only when `shop.isVerified === true` — no false positives |
| **Wishlist** | ✅ Functional | Increase tap target to **44×44px** on mobile |
| **Hover** | ✅ Actions reveal on desktop | Add `prefers-reduced-motion` — disable scale transitions |
| **Spacing** | ✅ `ypc__body` structured | Match flash card body padding to `ypc` tokens |
| **CTA** | ✅ Cart + quick view on hover | On mobile, expose **one-tap add** without hover — cart icon persistent optional P3 |
| **Mobile layout** | ✅ Responsive | Rail card width should match browse grid — audit **260px vs fluid** in rails |
| **Desktop layout** | ✅ Grid-ready | Ensure 5-column breakpoint at 1440px+ matches `ProductsPage` |
| **Promo badge** | ✅ Growth commerce badge | Extend for **Flash Sale** countdown overlay when unified |
| **Sold out state** | ✅ Dimmed image + label | Good — keep |
| **Flash sale variant** | ❌ Separate component | **Deprecate `HomeFlashSaleCard`** — extend `ProductCard` with `variant="flash"` props: countdown, flash price, stock urgency |

**Homepage-specific:** Flash tab is the only break in design system cohesion — fixing this is P5.

---

# 8. Mobile Experience

Breakpoints reviewed: **390px** (iPhone 14), **414px** (Plus), **768px** (iPad portrait).

## Findings & Recommendations

| Area | Issue | Recommendation |
|------|-------|----------------|
| **Thumb reach** | Header icons (create, messages, notifications) in top-right — hard one-hand reach on 390px | Move primary action (**cart**) to bottom nav if not present; reduce header icons to 4 max visible |
| **Spacing** | Hero + header + nav strip = **entire first screen** without products | Collapse nav strip on homepage; compact hero |
| **Tap targets** | Wishlist ~36px; some chips <44px | Minimum **44×44px** touch targets per WCAG |
| **Header** | Crowded icon row above search | Search full-width row 2; icons single row max 5 |
| **Search** | Strong — discovery panel works | Keep; add first-visit hint for visual search icon |
| **Filters** | N/A on homepage | — |
| **Cards** | Rail cards ~260px fixed — ~1.4 visible | Show **peek** of next card (16px) for scroll affordance |
| **Footer** | Accordion — good | Keep; reduce link count in each accordion |
| **Scroll** | 15+ sections — severe fatigue | Implement §3 hierarchy — target 6–8 viewports |
| **Bottom navigation** | `BottomNav.jsx` adds second nav layer | Ensure homepage primary paths (Shop, Search, Cart, Profile) in bottom nav; avoid duplicating header categories |
| **Banner behavior** | Events banner 420px+ on desktop; different component ≤900px | Unified responsive banner component; max **220px** mobile height |

## Mobile-First Priority

1. Product rails in first scroll  
2. Collapse header/nav  
3. Auth Recently Viewed at top  
4. Bottom nav alignment with conversion paths  

---

# 9. Desktop Experience

Breakpoints reviewed: **1024px**, **1280px**, **1440px**, **1920px**.

## Findings & Recommendations

| Area | Issue | Recommendation |
|------|-------|----------------|
| **Grid** | Growth commerce 2/3/4 cols vs marketplace 2/3/4/5 | Standardize on **2/3/4/5** breakpoints |
| **White space** | Hero py-28 excessive at 1440px+ | Cap hero max-width content; reduce vertical padding at xl |
| **Hover** | Product card actions good | Vendor cards — match hover lift `home-card-lift` |
| **Alignment** | Section titles consistent via `SectionTitle` | Migrate growth commerce + AI sections to same primitive |
| **Mouse interactions** | Rail horizontal scroll lacks visible scrollbar | Subtle fade edge + arrow buttons at 1024px+ |
| **Banner usage** | Full gradient campaign blocks shout louder than products | Slim strips per §4; image-left/copy-right at 1280px+ |
| **Hero** | Two-column works | Cap showcase width — don't exceed 50% viewport |
| **Footer** | 4-column — good | Wire social links |
| **Sidebar behavior** | No homepage sidebar — correct | Category exploration via header mega-menu only on desktop |

## Wide Screen (1920px)

- Container max-width **1280px** or **1440px** — avoid edge-to-edge product stretch  
- Banner imagery art-directed for 16:9 crop at wide breakpoints  

---

# 10. Conversion Optimization

For each major section — strategic assessment.

| Section | Conversion Value | Business Value | User Value | Verdict | Why |
|---------|-----------------|----------------|------------|---------|-----|
| **Header / Search** | Very High | High | Very High | **Keep + Improve** | Primary entry to catalog |
| **Hero** | Medium | High (brand) | Medium | **Improve** | Compress; single CTA — story supports but doesn't convert alone |
| **Feature Strip** | Low | Medium | Medium | **Move/Merge** | Trust before proof converts poorly |
| **Marketplace Hub** | Medium | High (vertical GMV) | High | **Keep + Move** | Multi-vertical strategy — after products |
| **Growth Commerce** | High | Very High | Medium | **Improve** | Revenue engine — must not duplicate rails |
| **Categories** | High | High | High | **Keep + Move** | Category browsers convert |
| **Product Rails** | Very High | Very High | Very High | **Keep + Move Up** | Core conversion surface |
| **AI Experience** | Low-Med | High (differentiation) | Medium | **Merge** | One band — reduces bounce from confusion |
| **AI Discovery** | Low | Medium | Low (public) | **Remove** | Mock data hurts trust |
| **Shopping Assistants** | None | Low | Negative | **Remove** | Dead ends |
| **AI Picks** | Medium | Medium | Medium | **Merge** | Into For You tab |
| **Events** | Medium | Medium | Medium | **Improve + Move** | Vertical revenue — needs real content |
| **Verified Vendors** | Medium | High | High | **Keep + Move** | Shop discovery drives repeat GMV |
| **Testimonials** | Low | Low | Low (fake) | **Remove/Improve** | Fake quotes counterproductive |
| **Recently Viewed** | Very High (auth) | Very High | Very High | **Keep + Move Up** | Session recovery |
| **Newsletter** | Medium | High (LTV) | Low-Med | **Improve/Remove** | Broken = trust damage |
| **Footer** | Low | Medium | Medium | **Keep** | Terminal navigation |

---

# 11. Production Priority Roadmap

## P1 — Product Discovery Above the Fold

| Field | Detail |
|-------|--------|
| **Description** | Reorder homepage: compact hero → product rails (Trending) as first content block |
| **Business impact** | Very High — GMV, session depth, bounce reduction |
| **UX impact** | Very High — answers “is there something for me?” in 5 seconds |
| **Estimated effort** | 3–5 days |
| **Dependencies** | None — IA change in `HomePage.jsx` |
| **Risk** | Low |

---

## P2 — Collapse AI Sections into One

| Field | Detail |
|-------|--------|
| **Description** | Remove AIShoppingAssistants, strip HomeAIDiscovery from homepage, merge AI Experience + AI Picks into single YEBO band + rails “For You” tab |
| **Business impact** | High — clearer differentiation story |
| **UX impact** | Very High — ~2 viewport scroll reduction |
| **Estimated effort** | 5–8 days |
| **Dependencies** | YEBO panel must absorb relocated discovery |
| **Risk** | Medium |

---

## P3 — Remove All Placeholder/Mock Production UI

| Field | Detail |
|-------|--------|
| **Description** | Remove newsletter “UI preview only,” assistant placeholder copy, static trending in AI Discovery, hero stat filler |
| **Business impact** | High — trust = conversion |
| **UX impact** | Very High — premium credibility |
| **Estimated effort** | 2–3 days |
| **Dependencies** | Newsletter backend OR hide form |
| **Risk** | Low |

---

## P4 — Unified Product Collection System

| Field | Detail |
|-------|--------|
| **Description** | Growth commerce feeds Product Rails tabs; eliminate duplicate grids |
| **Business impact** | High — ops agility without UX cost |
| **UX impact** | High — single discovery mental model |
| **Estimated effort** | 8–12 days |
| **Dependencies** | Growth Commerce API tab mapping |
| **Risk** | Medium |

---

## P5 — Unify Flash Sale on ProductCard

| Field | Detail |
|-------|--------|
| **Description** | Deprecate `HomeFlashSaleCard`; extend `ProductCard` with flash variant (countdown badge, flash price) |
| **Business impact** | Medium — consistent merchandising |
| **UX impact** | High — design system coherence on flagship page |
| **Estimated effort** | 3–5 days |
| **Dependencies** | P4 optional |
| **Risk** | Low |

---

## P6 — Banner Slot System (Admin-Controlled)

| Field | Detail |
|-------|--------|
| **Description** | Implement slot-based banner engine per §4; refactor `HomeGrowthCommerce` to slot renderer |
| **Business impact** | Very High — ad revenue, campaign ROI |
| **UX impact** | Medium — revenue without clutter if guardrails enforced |
| **Estimated effort** | 10–15 days |
| **Dependencies** | Backend admin config, priority queue |
| **Risk** | Medium — overload if guardrails skipped |

---

## P7 — Homepage Scroll Reduction (~40%)

| Field | Detail |
|-------|--------|
| **Description** | Execute merges/removals from §6; target 6–8 viewports |
| **Business impact** | High — mobile retention, lower section reach |
| **UX impact** | Very High |
| **Estimated effort** | 5–7 days (overlaps P1/P2) |
| **Dependencies** | P1, P2 |
| **Risk** | Low |

---

## P8 — Personalized Homepage for Auth Users

| Field | Detail |
|-------|--------|
| **Description** | Recently Viewed first; “For You” default tab; optional slim welcome strip |
| **Business impact** | Very High — returning user GMV |
| **UX impact** | Very High |
| **Estimated effort** | 4–6 days |
| **Dependencies** | P1, P2, P4 |
| **Risk** | Low |

---

## P9 — Header & Category Navigation Simplification

| Field | Detail |
|-------|--------|
| **Description** | Hide category nav strip on homepage; reduce duplicate paths to two |
| **Business impact** | Medium |
| **UX impact** | High |
| **Estimated effort** | 3–5 days |
| **Dependencies** | P1 (categories moved up) |
| **Risk** | Medium — wayfinding change |

---

## P10 — Authentic Trust & Newsletter Wiring

| Field | Detail |
|-------|--------|
| **Description** | Real testimonials OR remove; wire newsletter API; aggregate review score near rails |
| **Business impact** | Medium-High — LTV, trust |
| **UX impact** | Medium |
| **Estimated effort** | 5–10 days |
| **Dependencies** | Reviews API, email service |
| **Risk** | Low |

---

### Suggested Implementation Sequence

```
P3 → P1 → P5 → P2 → P7 → P8 → P4 → P6 → P9 → P10
```

Quick wins first (placeholder removal, reorder), then structural (AI collapse), then revenue (banners), then polish (trust).

---

# 12. Files Likely Affected

**Do not modify in this phase.** Identification for engineering scoping.

## Pages & Layout

| File | Expected Change |
|------|-----------------|
| `src/pages/HomePage.jsx` | Section reorder, conditional auth layout, remove sections |
| `src/App.js` | Route unchanged; possible layout props |
| `src/components/Layout/Header.jsx` | Re-export only |
| `src/components/Layout/Footer.jsx` | Re-export only |
| `src/components/Layout/BottomNav.jsx` | Thumb reach alignment |

## Home Components

| File | Expected Change |
|------|-----------------|
| `src/components/Home/HomeHero.jsx` | CTA reduction, padding |
| `src/components/Home/HeroAIShowcase.jsx` | Minor layout caps |
| `src/components/Home/HomeFeatureStrip.jsx` | Move/merge, reduce pillars |
| `src/components/Home/HomeMarketplaceHub.jsx` | Move, thumbnails, hub tabs |
| `src/components/Home/HomeGrowthCommerce.jsx` | Refactor to banner slot engine |
| `src/components/Home/HomeCategories.jsx` | Move, curated set |
| `src/components/Home/HomeCategoryCard.jsx` | Optional count badges |
| `src/components/Home/HomeProductRails.jsx` | Move up, tab reduction, For You |
| `src/components/Home/HomeFlashSaleCard.jsx` | Deprecate → ProductCard variant |
| `src/components/Home/HomeAIExperience.jsx` | Merge to YEBO band |
| `src/components/Home/HomeAIPicks.jsx` | Merge into rails |
| `src/components/Home/HomeEventsBanner.jsx` | Replace with real event cards |
| `src/components/Home/HomeEventsSection.jsx` | Unify with banner |
| `src/components/Home/HomeVerifiedVendors.jsx` | Move, simplify copy |
| `src/components/Home/HomeReviews.jsx` | Remove or wire API |
| `src/components/Home/HomeRecentlyViewed.jsx` | Move to top (auth) |
| `src/components/Home/HomeNewsletter.jsx` | Wire or remove |
| `src/components/Home/HomeFooter.jsx` | Social links, optional email |
| `src/components/Home/HomeHeader.jsx` | Nav strip collapse, search priority |
| `src/components/Home/HomeProductCard.jsx` | Legacy — audit if still used |
| `src/components/Home/index.js` | Export updates |

## Home Styles & Config

| File | Expected Change |
|------|-----------------|
| `src/components/Home/home.css` | Section order tokens, banner slots, spacing |
| `src/components/Home/homeCategories.css` | Grid adjustments |
| `src/components/Home/mobileCategoriesNav.css` | Homepage collapse |
| `src/components/Home/homeProductFilters.js` | Tab config |
| `src/components/Home/homeAIPicksFilters.js` | Merge into rails |
| `src/components/Home/homeMarketplaceCategories.js` | Hub data |
| `src/components/Home/mainCategoryHierarchy.js` | Nav simplification |
| `src/components/Home/categoryPhotoMap.js` | Category imagery |

## AI Components

| File | Expected Change |
|------|-----------------|
| `src/components/ai/sections/HomeAIDiscovery.jsx` | Remove from homepage |
| `src/components/ai/sections/AIShoppingAssistants.jsx` | Remove from homepage |
| `src/components/ai/AISearch.jsx` | YEBO band embed |
| `src/components/ai/primitives/AISection.jsx` | Merge styling |
| `src/components/ai/AIRecommendations.jsx` | Relocate to panel |

## Marketplace & Shared UI

| File | Expected Change |
|------|-----------------|
| `src/components/Marketplace/ProductCard.jsx` | Flash variant, mobile tap targets |
| `src/components/Marketplace/cards/MarketplaceCardRail.jsx` | Scroll affordance, peek |
| `src/components/ui/SectionTitle.jsx` | Consistency adoption |
| `src/components/Route/ProductCard/productCard.css` | Flash badge, motion gating |
| `src/components/Route/ProductCard/ProductCardReviews.jsx` | Hide empty state |

## Services & Backend

| File | Expected Change |
|------|-----------------|
| `src/services/growthCommerceService.js` | Slot-based API |
| Backend homepage config endpoints | Banner priority, slot assignment |
| Newsletter API | Subscribe endpoint |

## New Components (Likely)

| Proposed File | Purpose |
|---------------|---------|
| `src/components/Home/HomeBannerSlot.jsx` | Unified banner renderer |
| `src/components/Home/bannerTypes.js` | Banner variant config |
| `src/components/Home/HomeYeboneBand.jsx` | Merged AI surface |
| `src/components/Home/HomeTrustBand.jsx` | Merged trust strip |

---

# 13. Final Verdict

## Is the homepage already production-ready?

**No.** The homepage is visually ambitious and differentiates Yebone meaningfully (AI try-on, multi-vertical, unified product card direction), but it fails marketplace launch gates on structure, trust, and conversion path.

## Production readiness percentage

| State | Percentage | Rationale |
|-------|------------|-----------|
| **Today** | **~55%** | Strong visual foundation (7.5/10) undermined by IA (5.5/10), conversion (5.5/10), and placeholder trust issues |
| **After P1–P3** | **~70%** | Inventory-first, AI collapsed, placeholders removed — soft launch viable |
| **After P1–P7** | **~80%** | Banner discipline, scroll reduction, card unification — public launch viable |
| **After full plan (P1–P10)** | **~88%** | Personalized auth experience, authentic trust, newsletter wired — competitive premium marketplace |

## Would this homepage feel competitive with premium marketplaces?

**Today:** Partially. Visual craft approaches premium (Etsy-level polish in places), but **behavior and IA lag** Shopify/Amazon/Etsy launch standards. A discerning user scrolling past four AI sections and mock UI will not perceive Apple-quality attention to detail — they will perceive an ambitious beta.

**After implementing this plan:** **Yes, with qualification.** At 78–82 UX score, Yebone would:

- Surface products within first scroll — **matching Amazon/Etsy entry behavior**
- Maintain AI try-on differentiation in **one restrained band** — not Apple marketing, but Shopify Plus customization
- Support **admin-controlled campaigns** via banner slots — Etsy/Amazon ad model without homepage clutter
- Deliver **personalized return experience** — Amazon “continue shopping” parity
- Preserve **premium spacing and typography** — Apple craft applied to marketplace patterns, not Apple page structure

**Remaining gap vs. tier-1 at 88%:** Live social proof at scale, frequently-bought-together, auction/property/mobility listing previews on homepage, and performance metrics (LCP on hero imagery) — address in Phase 2 post-launch iteration.

---

## Success Metrics (Post-Implementation)

| Metric | Baseline (est.) | Target |
|--------|-----------------|--------|
| Bounce rate (homepage) | High | −15–25% |
| Product click-through (homepage) | Low | +40–60% |
| Scroll depth to product rails | Viewport 6+ | Viewport 1–2 |
| Auth session recovery clicks | Near zero | +30% on Recently Viewed |
| Banner CTR (when live) | N/A | 2–4% |
| Homepage UX score | 63/100 | 78–82/100 |

---

## Document Control

| Field | Value |
|-------|-------|
| **Next step** | Design/engineering review → approve P1–P3 for sprint |
| **Blocked on** | Newsletter backend decision; Growth Commerce slot API spec |
| **Out of scope** | Category pages, product detail, checkout — homepage only |

---

*End of implementation plan. Derived from [`HOMEPAGE_UX_AUDIT.md`](./HOMEPAGE_UX_AUDIT.md). No code changes in this phase.*
