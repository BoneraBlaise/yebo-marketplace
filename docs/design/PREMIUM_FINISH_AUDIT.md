# Yebone Homepage — Premium Finish Audit (Sprint 1.6)

**Date:** 2026-08-06  
**Scope:** Post–Sprint 1 homepage — issue classification & implementation backlogs  
**Sources:** [`HOMEPAGE_VISUAL_QA_REPORT.md`](./HOMEPAGE_VISUAL_QA_REPORT.md) · [`HOMEPAGE_IMPLEMENTATION_PLAN.md`](./HOMEPAGE_IMPLEMENTATION_PLAN.md) · [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)  
**Rules:** Classification and planning only — **no code, no implementation, no commits**

---

## Purpose

Sprint 1 fixed homepage **structure**. Sprint 1.5 Visual QA proved many remaining gaps are **different problem types** mixed together. This audit separates:

- **What design/engineering must fix** (UI, UX, technical)
- **What real marketplace data and content will fix** (inventory, reviews, vendors, copy)

Mixing these causes teams to redesign around empty databases or seed data instead of fixing components.

---

## Classification Key

| Code | Category | Definition |
|------|----------|------------|
| **A** | Design Issue | Layout, spacing, typography, color, hierarchy, components |
| **B** | UX Issue | User flow, discoverability, interaction, navigation |
| **C** | Content Issue | Text, labels, descriptions, empty-state wording, microcopy |
| **D** | Demo Data Issue | Repeated vendors, missing reviews, empty flash, missing listings, test product names |
| **E** | Technical Issue | Performance, responsiveness, rendering, bugs, backend wiring |

**Severity:** Critical · High · Medium · Low  
**Effort:** XS (<1d) · S (1–2d) · M (3–5d) · L (1–2w) · XL (2w+)

---

# Master Issue Registry

Every finding from Visual QA, Implementation Plan (remaining items), and Design System violations — **one category each**.

---

## Header & Search

### ISS-001 — Triple navigation stack (utility + header + category strip)

| Field | Detail |
|-------|--------|
| **Root cause** | Global layout renders all nav layers on every page; homepage does not suppress category strip |
| **Category** | **B — UX** |
| **Production severity** | **High** |
| **User impact** | 140–180px consumed before content; cognitive overload (Hick’s Law) |
| **Business impact** | Higher bounce; delayed product discovery; mobile GMV loss |
| **Recommended fix** | Collapse category strip on `/` only; retain mega-menu in header |
| **Effort** | M |

### ISS-002 — 12+ category links in persistent nav strip

| Field | Detail |
|-------|--------|
| **Root cause** | `mainCategoryHierarchy` exposed as full horizontal strip site-wide |
| **Category** | **B — UX** |
| **Production severity** | **High** |
| **User impact** | Competes with homepage category grid and hub; decision paralysis |
| **Business impact** | Reduced focus on search and product rails |
| **Recommended fix** | Homepage: hide strip or show max 5 curated links + “More” |
| **Effort** | M |

### ISS-003 — Header icon density competes with search

| Field | Detail |
|-------|--------|
| **Root cause** | Nine action clusters in one row; equal visual weight |
| **Category** | **A — Design** |
| **Production severity** | **Medium** |
| **User impact** | Search not visually dominant; scan order unclear |
| **Business impact** | Lower search usage |
| **Recommended fix** | Design system: search 60% width; defer non-vendor icons |
| **Effort** | M |

### ISS-004 — Mobile header icons poor thumb reach

| Field | Detail |
|-------|--------|
| **Root cause** | Create/messages/notifications top-right on 390px |
| **Category** | **B — UX** |
| **Production severity** | **Medium** |
| **User impact** | One-hand use difficult |
| **Business impact** | Reduced engagement for mobile-first Africa audience |
| **Recommended fix** | Primary paths via bottom nav; max 4 header icons mobile |
| **Effort** | M |

### ISS-005 — Visual search / YEBO sparkle lack first-visit labels

| Field | Detail |
|-------|--------|
| **Root cause** | Icon-only controls without tooltip or onboarding hint |
| **Category** | **C — Content** (+ **B** interaction hint — classified **C** per copy/tooltip need) |
| **Production severity** | **Low** |
| **User impact** | First-time users don’t know what icons do |
| **Business impact** | Lower AI/search feature adoption |
| **Recommended fix** | Add aria + first-visit tooltips per Design System §11 |
| **Effort** | XS |

### ISS-006 — Search deprioritized on mobile (row 2 below icons)

| Field | Detail |
|-------|--------|
| **Root cause** | Header layout stacks icons before search on narrow viewports |
| **Category** | **A — Design** |
| **Production severity** | **Medium** |
| **User impact** | Marketplace search not above the fold on mobile |
| **Business impact** | Discovery friction |
| **Recommended fix** | Mobile: full-width search as primary row 2 element |
| **Effort** | S |

---

## Hero

### ISS-007 — Mobile hero consumes full viewport before products

| Field | Detail |
|-------|--------|
| **Root cause** | Hero + header + showcase stack vertically; compact padding still tall on 390px |
| **Category** | **A — Design** |
| **Production severity** | **High** |
| **User impact** | Products not visible within 5 seconds on phone |
| **Business impact** | Mobile bounce; contradicts marketplace-first IA |
| **Recommended fix** | Guest mobile: slim strip hero OR product peek above fold |
| **Effort** | M |

### ISS-008 — Hero decorative noise (blur orbs, glass, floating UI)

| Field | Detail |
|-------|--------|
| **Root cause** | Marketing aesthetic applied at marketplace entry |
| **Category** | **A — Design** |
| **Production severity** | **Medium** |
| **User impact** | Visual complexity without transactional value |
| **Business impact** | Premium perception uneven vs product sections |
| **Recommended fix** | Reduce orbs; cap showcase width per Design System |
| **Effort** | S |

### ISS-009 — Redundant “Start Shopping” CTA above product rail

| Field | Detail |
|-------|--------|
| **Root cause** | Hero CTA duplicates immediate next section |
| **Category** | **B — UX** |
| **Production severity** | **Medium** |
| **User impact** | Split attention; extra tap path |
| **Business impact** | Diluted click concentration |
| **Recommended fix** | Guest: single hero CTA to `#discover-products` or remove secondary |
| **Effort** | XS |

### ISS-010 — Secondary CTA splits first-time shopper intent

| Field | Detail |
|-------|--------|
| **Root cause** | “Try AI Virtual Try-On” equal weight to shopping CTA |
| **Category** | **B — UX** |
| **Production severity** | **Medium** |
| **User impact** | New users unsure primary job |
| **Business impact** | Lower shopping path completion |
| **Recommended fix** | One primary + ghost secondary; or AI CTA inside YEBO band only |
| **Effort** | XS |

### ISS-011 — E2E/test product names in HeroAIShowcase

| Field | Detail |
|-------|--------|
| **Root cause** | Showcase wired to dev/test product pool in local environment |
| **Category** | **D — Demo Data** |
| **Production severity** | **High** (in staging/dev visible) |
| **User impact** | “E2E Unified Auth Product” destroys premium credibility |
| **Business impact** | Brand trust erosion |
| **Recommended fix** | Seed curated fashion products for showcase; filter test SKUs from public UI |
| **Effort** | S (data) + S (API filter) |

---

## Product Rails

### ISS-012 — “No reviews yet” on nearly every product card

| Field | Detail |
|-------|--------|
| **Root cause** | Catalog lacks review records; UI always renders review row |
| **Category** | **D — Demo Data** (missing reviews) · UI fix = Backlog A |
| **Production severity** | **High** |
| **User impact** | Trust void at purchase decision point |
| **Business impact** | Lower add-to-cart and conversion |
| **Recommended fix** | **Data:** seed/import reviews · **UI:** hide row when `reviewCount === 0` |
| **Effort** | D: L (ongoing) · UI: XS |

### ISS-013 — “0 sold” visible on cards with no sales history

| Field | Detail |
|-------|--------|
| **Root cause** | New listings + UI always shows sold count |
| **Category** | **D — Demo Data** |
| **Production severity** | **Medium** |
| **User impact** | Signals unpopular inventory |
| **Business impact** | Reduced click-through on new products |
| **Recommended fix** | Hide sold meta when 0; show when >0 |
| **Effort** | UI XS · populates with real sales automatically |

### ISS-014 — Flash Sale tab visible with empty inventory

| Field | Detail |
|-------|--------|
| **Root cause** | No active flash sales in database; tab always rendered |
| **Category** | **D — Demo Data** |
| **Production severity** | **High** |
| **User impact** | Broken urgency promise |
| **Business impact** | Flash GMV loss; credibility damage |
| **Recommended fix** | Seed active flash campaigns OR hide tab when `flashSales.length === 0` |
| **Effort** | D: S · UI: XS |

### ISS-015 — Flash empty state copy (“No products in this collection yet”)

| Field | Detail |
|-------|--------|
| **Root cause** | Generic empty state when tab clicked with no data |
| **Category** | **B — UX** (empty-state behavior when tab should be hidden) |
| **Production severity** | **Medium** |
| **User impact** | Dead-end after high-intent click |
| **Business impact** | Wasted clicks on urgency tab |
| **Recommended fix** | Hide tab (preferred) OR redirect to `/flash-sales` with merchandised fallback |
| **Effort** | XS |

### ISS-016 — Weak horizontal scroll affordance on product rail

| Field | Detail |
|-------|--------|
| **Root cause** | No peek, fade edge, or arrows on desktop rail |
| **Category** | **B — UX** |
| **Production severity** | **Medium** |
| **User impact** | Users don’t discover more products in rail |
| **Business impact** | Lower rail CTR and session depth |
| **Recommended fix** | 16px card peek + gradient fade + optional arrows ≥1024px |
| **Effort** | S |

### ISS-017 — ~1.4 cards visible on mobile rail

| Field | Detail |
|-------|--------|
| **Root cause** | Fixed rail card width without peek affordance |
| **Category** | **A — Design** |
| **Production severity** | **Medium** |
| **User impact** | Unclear that rail scrolls |
| **Business impact** | Fewer product impressions |
| **Recommended fix** | Adjust width + peek per Design System §5.5 |
| **Effort** | S |

### ISS-018 — Wishlist tap target below 44px

| Field | Detail |
|-------|--------|
| **Root cause** | ProductCard wishlist button ~36px |
| **Category** | **A — Design** (a11y sizing) |
| **Production severity** | **Medium** |
| **User impact** | Hard to tap; WCAG touch target fail |
| **Business impact** | Lower wishlist saves |
| **Recommended fix** | Min 44×44px hit area per Design System §23 |
| **Effort** | XS |

### ISS-019 — Grid column mismatch (5 product vs 6 category)

| Field | Detail |
|-------|--------|
| **Root cause** | Independent grid configs per section |
| **Category** | **A — Design** |
| **Production severity** | **Low** |
| **User impact** | Subtle rhythm break |
| **Business impact** | Polish only |
| **Recommended fix** | Standardize breakpoints 2/3/4/5 per Design System §5 |
| **Effort** | S |

---

## Categories

### ISS-020 — Gray gradient placeholder category tiles

| Field | Detail |
|-------|--------|
| **Root cause** | `categoryPhotoMap` missing/broken URLs → `CATEGORY_FALLBACK_PHOTO` gray gradient |
| **Category** | **A — Design** (fallback visual) + **D** if photos never uploaded |
| **Production severity** | **High** |
| **User impact** | Homepage reads as wireframe/beta |
| **Business impact** | Category CTR loss |
| **Recommended fix** | **Design:** premium fallback pattern · **Data:** upload real category photography |
| **Effort** | A: S · D: M |

### ISS-021 — 16 category tiles on homepage

| Field | Detail |
|-------|--------|
| **Root cause** | Full taxonomy rendered on homepage |
| **Category** | **B — UX** |
| **Production severity** | **Medium** |
| **User impact** | Long scroll; fatigue before hub/vendors |
| **Business impact** | Lower completion to lower sections |
| **Recommended fix** | Curate 6–8 homepage categories + “Browse all” |
| **Effort** | S |

### ISS-022 — Triple category path (header strip + grid + hub)

| Field | Detail |
|-------|--------|
| **Root cause** | No single canonical category entry on homepage |
| **Category** | **B — UX** |
| **Production severity** | **High** |
| **User impact** | Redundant wayfinding; decision paralysis |
| **Business impact** | Session depth reduced |
| **Recommended fix** | Collapse to search + category grid (Implementation Plan) |
| **Effort** | M |

### ISS-023 — Category tile tap targets small on mobile

| Field | Detail |
|-------|--------|
| **Root cause** | Dense 2-col grid with small tiles |
| **Category** | **A — Design** |
| **Production severity** | **Medium** |
| **User impact** | Mis-taps |
| **Business impact** | Frustration; lower category clicks |
| **Recommended fix** | Min 44px touch height; increase tile padding |
| **Effort** | S |

---

## Marketplace Hub · Property · Mobility

### ISS-024 — Hub cards abstract (no listing photos)

| Field | Detail |
|-------|--------|
| **Root cause** | Hub designed as text/chip explainer, not discovery surface |
| **Category** | **A — Design** |
| **Production severity** | **Medium** |
| **User impact** | Property/mobility feel secondary vs shopping |
| **Business impact** | Vertical GMV underdeveloped |
| **Recommended fix** | Photo-first hub cards with 2–3 preview listings per vertical |
| **Effort** | L |

### ISS-025 — No property listing previews on homepage

| Field | Detail |
|-------|--------|
| **Root cause** | No property cards component on homepage; link-only chips |
| **Category** | **D — Demo Data** (no seeded property listings) + **A** (no UI slot) |
| **Production severity** | **High** |
| **User impact** | Property-intent users get no proof |
| **Business impact** | Property vertical leakage |
| **Recommended fix** | **Data:** seed property listings · **UI:** PropertyCard row in hub |
| **Effort** | D: M · UI: L |

### ISS-026 — No mobility/vehicle previews on homepage

| Field | Detail |
|-------|--------|
| **Root cause** | Same as ISS-025 for vehicles vertical |
| **Category** | **D — Demo Data** |
| **Production severity** | **High** |
| **User impact** | Vehicle browsers must leave homepage uninformed |
| **Business impact** | Mobility GMV loss |
| **Recommended fix** | Seed vehicle listings + MobilityCard previews |
| **Effort** | D: M · UI: L |

### ISS-027 — Shopping pillar under-linked (one chip vs many for property/mobility)

| Field | Detail |
|-------|--------|
| **Root cause** | IA imbalance in hub card chip counts |
| **Category** | **B — UX** |
| **Production severity** | **Low** |
| **User impact** | Shopping feels assumed; less exploration |
| **Business impact** | Minor |
| **Recommended fix** | Add top shopping subcategory chips |
| **Effort** | XS |

### ISS-028 — Hub repeats category wayfinding

| Field | Detail |
|-------|--------|
| **Root cause** | Hub placed after category grid with overlapping destinations |
| **Category** | **B — UX** |
| **Production severity** | **Medium** |
| **User impact** | Repetitive scroll |
| **Business impact** | Scroll fatigue |
| **Recommended fix** | Merge hub with categories OR move hub before categories |
| **Effort** | M |

---

## Campaign Banner · Flash · Growth Commerce

### ISS-029 — Generic campaign banner (teal block, no imagery)

| Field | Detail |
|-------|--------|
| **Root cause** | Default Growth Commerce template; no campaign creative uploaded |
| **Category** | **D — Demo Data** (no campaign assets) + **A** (template design) |
| **Production severity** | **Medium** |
| **User impact** | Ad blindness; doesn’t feel like real promotion |
| **Business impact** | Low campaign CTR |
| **Recommended fix** | **Data:** upload campaign image/copy · **UI:** Sprint 2 banner slots |
| **Effort** | D: S · UI: L (Sprint 2) |

### ISS-030 — No flash countdown on product cards

| Field | Detail |
|-------|--------|
| **Root cause** | Flash unified to ProductCard without countdown variant |
| **Category** | **A — Design** |
| **Production severity** | **Medium** (when flash data exists) |
| **User impact** | Reduced urgency signaling |
| **Business impact** | Lower flash conversion |
| **Recommended fix** | ProductCard flash variant with countdown badge |
| **Effort** | M |

---

## Verified Vendors

### ISS-031 — Same vendor (YEBONE) repeated in featured + browse

| Field | Detail |
|-------|--------|
| **Root cause** | Only one verified vendor in product pool / dedup logic missing |
| **Category** | **D — Demo Data** |
| **Production severity** | **Critical** |
| **User impact** | Looks like bug; fake marketplace |
| **Business impact** | Vendor discovery useless; ad product undermined |
| **Recommended fix** | Seed multiple verified vendors; dedupe by `shop._id` in UI |
| **Effort** | D: M · UI: XS |

### ISS-032 — Vendor card gray banner placeholders

| Field | Detail |
|-------|--------|
| **Root cause** | Shops lack uploaded banner images |
| **Category** | **D — Demo Data** |
| **Production severity** | **High** |
| **User impact** | Trust section looks cheap |
| **Business impact** | Low shop visit rate |
| **Recommended fix** | Vendors upload shop banners; fallback to branded gradient not gray |
| **Effort** | D: M · A: S (fallback design) |

### ISS-033 — Implementation copy in vendor subtitle

| Field | Detail |
|-------|--------|
| **Root cause** | Dev note left in production string: “four at a time on mobile” |
| **Category** | **C — Content** |
| **Production severity** | **High** |
| **User impact** | Signals unfinished product |
| **Business impact** | Trust erosion |
| **Recommended fix** | Replace with user-facing copy: “Discover trusted sellers across Africa” |
| **Effort** | XS |

### ISS-034 — Two SectionTitles in one vendor section

| Field | Detail |
|-------|--------|
| **Root cause** | Featured + browse share one section with duplicate headings |
| **Category** | **A — Design** |
| **Production severity** | **Low** |
| **User impact** | Section feels long and repetitive |
| **Business impact** | Minor scroll cost |
| **Recommended fix** | Single title + sub-rows OR tabs (Featured / Browse) |
| **Effort** | S |

### ISS-035 — Vendor swipe rail affordance unclear

| Field | Detail |
|-------|--------|
| **Root cause** | Same rail pattern as products without peek/fade |
| **Category** | **B — UX** |
| **Production severity** | **Medium** |
| **User impact** | Users miss additional vendors |
| **Business impact** | Lower shop discovery |
| **Recommended fix** | Scroll peek + “Swipe for more” microcopy |
| **Effort** | S |

---

## YEBO Intelligence

### ISS-036 — “Powered by YIP” internal jargon

| Field | Detail |
|-------|--------|
| **Root cause** | Engineering codename in user-facing microcopy |
| **Category** | **C — Content** |
| **Production severity** | **High** |
| **User impact** | Confusion; unprofessional |
| **Business impact** | AI differentiation weakened |
| **Recommended fix** | “Powered by YEBO” or remove line |
| **Effort** | XS |

### ISS-037 — AISearch readonly input feels non-functional

| Field | Detail |
|-------|--------|
| **Root cause** | Input opens panel on focus but cannot accept typed text inline |
| **Category** | **B — UX** |
| **Production severity** | **Medium** |
| **User impact** | Users think search is broken |
| **Business impact** | Lower AI engagement |
| **Recommended fix** | Allow typing OR clearer “Tap to ask YEBO” placeholder + cursor affordance |
| **Effort** | S |

### ISS-038 — Duplicate AI/search entry (header sparkle + YEBO band)

| Field | Detail |
|-------|--------|
| **Root cause** | Two canonical AI surfaces without differentiated jobs |
| **Category** | **B — UX** |
| **Production severity** | **Medium** |
| **User impact** | Unclear which AI entry to use |
| **Business impact** | Split AI usage metrics |
| **Recommended fix** | Header = quick panel; band = discovery/education only |
| **Effort** | S |

### ISS-039 — Badge stacking (gold + green + glass)

| Field | Detail |
|-------|--------|
| **Root cause** | Multiple badge types in one section |
| **Category** | **A — Design** |
| **Production severity** | **Low** |
| **User impact** | Visual noise |
| **Business impact** | Premium feel diluted |
| **Recommended fix** | Max 1 badge per section per Design System |
| **Effort** | XS |

### ISS-040 — Prompt chips reuse product tab styling

| Field | Detail |
|-------|--------|
| **Root cause** | Shared `home-tab` class without semantic distinction |
| **Category** | **A — Design** |
| **Production severity** | **Low** |
| **User impact** | Tabs vs prompts visually ambiguous |
| **Business impact** | Minor |
| **Recommended fix** | Distinct chip variant for AI prompts |
| **Effort** | XS |

---

## Events

### ISS-041 — Events desktop banner decorative (no real events)

| Field | Detail |
|-------|--------|
| **Root cause** | `HomeEventsBanner` uses static mosaic chips, not API-driven events |
| **Category** | **D — Demo Data** |
| **Production severity** | **High** |
| **User impact** | Fabricated experiences; no dates/venues/prices |
| **Business impact** | Events vertical dead on homepage |
| **Recommended fix** | Seed upcoming events OR hide section until ≥1 event |
| **Effort** | D: M · UI: M |

### ISS-042 — Events desktop vs mobile different components

| Field | Detail |
|-------|--------|
| **Root cause** | `isBannerVisible` breakpoint at 900px switches components |
| **Category** | **E — Technical** (responsive architecture) |
| **Production severity** | **Medium** |
| **User impact** | Inconsistent experience across devices |
| **Business impact** | QA burden; brand inconsistency |
| **Recommended fix** | Single responsive EventCard component |
| **Effort** | M |

### ISS-043 — Events section low information density for height

| Field | Detail |
|-------|--------|
| **Root cause** | Large banner area with minimal content |
| **Category** | **A — Design** |
| **Production severity** | **Medium** |
| **User impact** | Scroll cost without value |
| **Business impact** | Lower section reach |
| **Recommended fix** | Compact event card row (max 180px) |
| **Effort** | S (partially done Sprint 1) |

### ISS-044 — Events CTA intent ambiguous (“Explore events” vs vendor register on mobile)

| Field | Detail |
|-------|--------|
| **Root cause** | Mobile `HomeEventsSection` may surface vendor-oriented CTA |
| **Category** | **C — Content** |
| **Production severity** | **Medium** |
| **User impact** | Wrong audience for shopper homepage |
| **Business impact** | Events ticket GMV loss |
| **Recommended fix** | Shopper-first CTA: “Browse events” |
| **Effort** | XS |

---

## Trust · Newsletter · Footer

### ISS-045 — Trust strip claims without proof links

| Field | Detail |
|-------|--------|
| **Root cause** | Static icons; no links to policies/status |
| **Category** | **C — Content** |
| **Production severity** | **Medium** |
| **User impact** | Claims feel like marketing |
| **Business impact** | Trust not verifiable |
| **Recommended fix** | Link each pillar to `/shipping`, `/returns`, `/privacy`, etc. |
| **Effort** | S |

### ISS-046 — Trust strip 2+2+1 wrap on mobile

| Field | Detail |
|-------|--------|
| **Root cause** | Five items in 2-col grid |
| **Category** | **A — Design** |
| **Production severity** | **Low** |
| **User impact** | Awkward orphan item |
| **Business impact** | Minor |
| **Recommended fix** | Reduce to 3 pillars OR horizontal scroll strip |
| **Effort** | S |

### ISS-047 — Newsletter gold button breaks design system

| Field | Detail |
|-------|--------|
| **Root cause** | Custom gold CTA not using `--yebone-primary` token |
| **Category** | **A — Design** |
| **Production severity** | **Medium** |
| **User impact** | Inconsistent button language |
| **Business impact** | Premium polish gap |
| **Recommended fix** | Use primary or accent token per Design System §8 |
| **Effort** | XS |

### ISS-048 — Newsletter backend not wired

| Field | Detail |
|-------|--------|
| **Root cause** | Frontend-only toast; no subscribe API connected |
| **Category** | **E — Technical** |
| **Production severity** | **High** |
| **User impact** | Submit appears to work but doesn’t persist |
| **Business impact** | Email LTV loss; trust damage on retry |
| **Recommended fix** | Wire API OR hide form until backend ready (Design System §1.5) |
| **Effort** | M |

### ISS-049 — Newsletter weak value proposition

| Field | Detail |
|-------|--------|
| **Root cause** | Generic “exclusive deals” copy; no incentive |
| **Category** | **C — Content** |
| **Production severity** | **Medium** |
| **User impact** | Low motivation to subscribe |
| **Business impact** | List growth limited |
| **Recommended fix** | Specific incentive: “10% off first order” when valid |
| **Effort** | XS |

### ISS-050 — Newsletter section padding heavy (`--emphasis`)

| Field | Detail |
|-------|--------|
| **Root cause** | Emphasis modifier on single-field form |
| **Category** | **A — Design** |
| **Production severity** | **Low** |
| **User impact** | Disproportionate vertical space |
| **Business impact** | Scroll fatigue |
| **Recommended fix** | Use `--compact` or merge into footer |
| **Effort** | XS |

### ISS-051 — Footer social buttons non-linked placeholders

| Field | Detail |
|-------|--------|
| **Root cause** | `<button>` without href; URLs not configured |
| **Category** | **C — Content** (+ **E** if intentional stub) — classified **C** |
| **Production severity** | **Medium** |
| **User impact** | Dead-end taps |
| **Business impact** | Brand/social proof gap |
| **Recommended fix** | Wire real social URLs or hide icons |
| **Effort** | XS |

### ISS-052 — Footer duplicate routes (Press/Investors → /about)

| Field | Detail |
|-------|--------|
| **Root cause** | Placeholder routing in footer config |
| **Category** | **C — Content** |
| **Production severity** | **Low** |
| **User impact** | Feels unfinished |
| **Business impact** | Minor trust |
| **Recommended fix** | Unique pages or remove links |
| **Effort** | XS |

---

## Cross-Cutting · Technical · Accessibility

### ISS-053 — Card system inconsistency (product vs category vs vendor vs event)

| Field | Detail |
|-------|--------|
| **Root cause** | Multiple card dialects on one page; Design System §9 not fully adopted |
| **Category** | **A — Design** |
| **Production severity** | **High** |
| **User impact** | Uneven premium perception |
| **Business impact** | Brand coherence |
| **Recommended fix** | Align all homepage cards to Design System specs |
| **Effort** | L |

### ISS-054 — Decorative animations without `prefers-reduced-motion`

| Field | Detail |
|-------|--------|
| **Root cause** | Hero showcase float/pulse/scan not gated |
| **Category** | **E — Technical** |
| **Production severity** | **Medium** |
| **User impact** | Motion sensitivity; a11y fail |
| **Business impact** | Compliance risk |
| **Recommended fix** | Gate animations per Design System §13.4 |
| **Effort** | S |

### ISS-055 — 11px meta text overused (badges, chips, events)

| Field | Detail |
|-------|--------|
| **Root cause** | Below Design System 12px floor for body meta |
| **Category** | **A — Design** |
| **Production severity** | **Medium** |
| **User impact** | Readability issues; a11y |
| **Business impact** | Excludes low-vision users |
| **Recommended fix** | Enforce 12px minimum; badges only at 11px semibold |
| **Effort** | S |

### ISS-056 — Homepage still 8–10 viewports (guest)

| Field | Detail |
|-------|--------|
| **Root cause** | Section count + hub + categories + vendors + events |
| **Category** | **B — UX** |
| **Production severity** | **Medium** |
| **User impact** | Scroll fatigue vs 6–8 target |
| **Business impact** | Lower newsletter/footer reach |
| **Recommended fix** | Further merge hub/categories; footer-only newsletter |
| **Effort** | M |

### ISS-057 — Auth vs guest homepage not parity-tested in QA capture

| Field | Detail |
|-------|--------|
| **Root cause** | Visual QA screenshots guest-only |
| **Category** | **E — Technical** (QA process) |
| **Production severity** | **Low** |
| **User impact** | Returning user layout unverified in audit |
| **Business impact** | Retention UX risk |
| **Recommended fix** | Capture auth screenshot set (Recently Viewed + For You) |
| **Effort** | XS |

### ISS-058 — Lazy sections cause layout shift on slow network

| Field | Detail |
|-------|--------|
| **Root cause** | Suspense fallbacks differ from final section height |
| **Category** | **E — Technical** |
| **Production severity** | **Low** |
| **User impact** | Content jump on load |
| **Business impact** | Perceived performance |
| **Recommended fix** | Skeleton heights match section templates |
| **Effort** | S |

### ISS-059 — Duplicate “Trending” labels across page (header footer links + rails)

| Field | Detail |
|-------|--------|
| **Root cause** | Same label in nav, rails tab, footer — acceptable but dense |
| **Category** | **B — UX** |
| **Production severity** | **Low** |
| **User impact** | Mild disorientation |
| **Business impact** | Minor |
| **Recommended fix** | Ensure one primary “Trending” surface is canonical |
| **Effort** | XS |

### ISS-060 — Design System: placeholder UI in production paths

| Field | Detail |
|-------|--------|
| **Root cause** | Governance not enforced pre-launch |
| **Category** | **E — Technical** (process/governance) |
| **Production severity** | **High** |
| **User impact** | Beta perception |
| **Business impact** | Launch blocker |
| **Recommended fix** | PR checklist from Design System §28 |
| **Effort** | S (process) |

---

# Summary by Category

| Category | Count | Examples |
|----------|-------|----------|
| **A — Design** | 18 | Gray category fallback, newsletter gold button, grid mismatch, hero noise |
| **B — UX** | 17 | Header triple-nav, scroll affordance, triple category paths, empty flash UX |
| **C — Content** | 8 | YIP jargon, vendor dev copy, trust links, footer placeholders |
| **D — Demo Data** | 12 | No reviews, repeated vendor, empty flash, test product names, no events |
| **E — Technical** | 5 | Newsletter API, reduced-motion, responsive events split, lazy CLS |
| **Total** | **60** | |

---

# BACKLOG A — Production UI/UX Improvements Only

**Rule:** No demo-data seeding in this backlog. UI must handle empty/missing data gracefully.

| ID | Priority | Issue | Category | Fix | Effort |
|----|----------|-------|----------|-----|--------|
| A-01 | **P1** | ISS-001 Collapse header category strip on homepage | B | Hide strip on `/` | M |
| A-02 | **P1** | ISS-007 Mobile hero height / product peek | A | Slim hero mobile guest | M |
| A-03 | **P1** | ISS-012 Hide review row when `reviewCount === 0` | A | ProductCardReviews conditional | XS |
| A-04 | **P1** | ISS-014 Hide Flash tab when no inventory | B | Conditional tab render | XS |
| A-05 | **P1** | ISS-015 Flash empty-state fallback UX | B | Hide tab or redirect | XS |
| A-06 | **P1** | ISS-031 Dedupe vendors in UI by shop ID | B | Unique filter in rail | XS |
| A-07 | **P1** | ISS-033 Remove vendor implementation copy | C | Copy replace | XS |
| A-08 | **P1** | ISS-036 Replace “Powered by YIP” | C | Copy replace | XS |
| A-09 | **P2** | ISS-002 Reduce category strip links | B | Curated subset | M |
| A-10 | **P2** | ISS-003 Search-forward header layout | A | Width + icon reduction | M |
| A-11 | **P2** | ISS-004 Mobile thumb reach | B | Bottom nav alignment | M |
| A-12 | **P2** | ISS-016 Product rail scroll peek/fade | B | MarketplaceCardRail | S |
| A-13 | **P2** | ISS-017 Mobile rail card width + peek | A | CSS token adjust | S |
| A-14 | **P2** | ISS-018 Wishlist 44px tap target | A | ProductCard | XS |
| A-15 | **P2** | ISS-020 Premium category fallback (when image missing) | A | Branded fallback not gray | S |
| A-16 | **P2** | ISS-021 Curate 6–8 homepage categories | B | Config slice | S |
| A-17 | **P2** | ISS-022 Single category entry path | B | IA collapse | M |
| A-18 | **P2** | ISS-024 Hub photo-first card redesign | A | Hub component | L |
| A-19 | **P2** | ISS-030 Flash countdown on ProductCard | A | Card variant | M |
| A-20 | **P2** | ISS-032 Vendor banner fallback design | A | Branded gradient | S |
| A-21 | **P2** | ISS-034 Consolidate vendor section titles | A | Single title/tabs | S |
| A-22 | **P2** | ISS-035 Vendor rail scroll affordance | B | Peek + copy | S |
| A-23 | **P2** | ISS-037 AISearch affordance clarity | B | Placeholder/typing UX | S |
| A-24 | **P2** | ISS-038 Differentiate header vs band AI entry | B | IA copy | S |
| A-25 | **P2** | ISS-039 Reduce badge stacking in YEBO band | A | One badge | XS |
| A-26 | **P2** | ISS-042 Unify events responsive component | E | Single EventCard | M |
| A-27 | **P2** | ISS-043 Events compact card layout | A | Height cap | S |
| A-28 | **P2** | ISS-045 Trust strip policy links | C | Link each pillar | S |
| A-29 | **P2** | ISS-046 Trust strip 3 pillars | A | Reduce items | S |
| A-30 | **P2** | ISS-047 Newsletter button design system | A | Primary token | XS |
| A-31 | **P2** | ISS-048 Newsletter hide until API wired | E | Conditional render | XS |
| A-32 | **P2** | ISS-050 Newsletter compact spacing | A | Section modifier | XS |
| A-33 | **P3** | ISS-005 Search icon first-visit tooltips | C | Tooltip/onboarding | XS |
| A-34 | **P3** | ISS-006 Mobile search layout | A | Header CSS | S |
| A-35 | **P3** | ISS-008 Reduce hero decorative noise | A | CSS/motion trim | S |
| A-36 | **P3** | ISS-009 Hero CTA deduplication | B | Single CTA | XS |
| A-37 | **P3** | ISS-010 Hero secondary CTA hierarchy | B | Ghost/defer AI CTA | XS |
| A-38 | **P3** | ISS-013 Hide “0 sold” when zero | A | ProductCard meta | XS |
| A-39 | **P3** | ISS-019 Grid column standardization | A | Shared breakpoints | S |
| A-40 | **P3** | ISS-023 Category mobile tap targets | A | Tile padding | S |
| A-41 | **P3** | ISS-027 Shopping hub chip balance | B | Add chips | XS |
| A-42 | **P3** | ISS-028 Hub/category merge or reorder | B | IA | M |
| A-43 | **P3** | ISS-040 Distinct AI prompt chip style | A | Chip variant | XS |
| A-44 | **P3** | ISS-044 Events shopper-first CTA copy | C | Copy fix | XS |
| A-45 | **P3** | ISS-049 Newsletter value prop copy | C | Incentive copy | XS |
| A-46 | **P3** | ISS-051 Footer social links or hide | C | URLs or remove | XS |
| A-47 | **P3** | ISS-052 Footer unique routes | C | Route map | XS |
| A-48 | **P3** | ISS-053 Card system alignment | A | Design System §9 | L |
| A-49 | **P3** | ISS-054 Reduced-motion gating | E | CSS/JS | S |
| A-50 | **P3** | ISS-055 12px meta text floor | A | Typography pass | S |
| A-51 | **P3** | ISS-056 Further scroll reduction | B | Merge newsletter/footer | M |
| A-52 | **P3** | ISS-058 Skeleton height matching | E | Fallback components | S |
| A-53 | **P3** | ISS-059 Trending label dedup | B | Copy audit | XS |
| A-54 | **P3** | ISS-060 Design System PR checklist | E | Governance | S |

**Backlog A total:** 54 items · **Estimated aggregate:** ~8–12 engineering weeks (parallelizable)

---

# BACKLOG B — Demo Data / Content Cleanup Only

**Rule:** No UI redesign in this backlog. Seed, import, configure, or write content.

| ID | Priority | Issue | Category | Fix | Effort |
|----|----------|-------|----------|-----|--------|
| B-01 | **P1** | ISS-012 Populate product reviews | D | Import/seed review records | L |
| B-02 | **P1** | ISS-031 Multiple unique verified vendors | D | Onboard 8–12 verified shops | M |
| B-03 | **P1** | ISS-011 Remove test product names from showcase pool | D | Curate showcase SKUs; filter E2E products | S |
| B-04 | **P1** | ISS-014 Active flash sale campaigns | D | Create 3–5 flash listings with end times | S |
| B-05 | **P2** | ISS-020 Real category photography | D | Upload images to `categoryPhotoMap` / CDN | M |
| B-06 | **P2** | ISS-025 Property listings seed | D | 6–10 property listings with photos | M |
| B-07 | **P2** | ISS-026 Mobility/vehicle listings seed | D | 6–10 vehicle listings with photos | M |
| B-08 | **P2** | ISS-029 Campaign banner creative | D | Upload campaign image + copy in Growth Commerce | S |
| B-09 | **P2** | ISS-032 Vendor shop banner uploads | D | Each vendor uploads hero banner | M |
| B-10 | **P2** | ISS-041 Upcoming marketplace events | D | 3+ real events with dates/venues/images | M |
| B-11 | **P2** | ISS-013 Sales history on popular SKUs | D | Organic over time OR seed sold counts | M |
| B-12 | **P3** | ISS-049 Newsletter incentive offer | C | Marketing defines offer + legal | XS |
| B-13 | **P3** | ISS-051 Footer social media URLs | C | Marketing provides links | XS |
| B-14 | **P3** | ISS-052 Footer page content (Press, Investors) | C | CMS/pages or remove | S |
| B-15 | **P3** | ISS-045 Trust strip link destinations | C | Legal pages live at URLs | S |
| B-16 | **P3** | Product catalog diversity | D | Reduce duplicate E2E SKUs in public catalog | M |
| B-17 | **P3** | Featured/recommended product flags | D | Merchandising sets `featured` on diverse SKUs | S |
| B-18 | **P3** | ISS-048 Newsletter API endpoint + ESP | E | Backend subscribe integration | M |

**Backlog B total:** 18 items · **Estimated aggregate:** ~4–6 weeks (content + ops + backend)

---

# What Disappears With Real Marketplace Data?

**Question:** If Yebone went live tomorrow with **real marketplace data** instead of demo data, which issues would disappear **automatically**?

## Would disappear or largely resolve (no UI work)

| Issue | Why it disappears |
|-------|-------------------|
| **ISS-012** “No reviews yet” on every card | Real reviews populate → stars and counts render |
| **ISS-013** “0 sold” everywhere | Sales accumulate → meaningful social proof |
| **ISS-014** Empty Flash Sale tab | Active campaigns → tab shows products |
| **ISS-031** Repeated YEBONE vendor | Multiple real vendors → natural variety |
| **ISS-032** Gray vendor banners | Vendors upload shop creatives |
| **ISS-011** E2E product names in showcase | Curated catalog replaces test SKUs |
| **ISS-041** Decorative events mosaic | Real events API → dates, photos, prices |
| **ISS-025** No property previews | **Partially** — needs listings **and** UI slots; data alone insufficient |
| **ISS-026** No mobility previews | **Partially** — same as property |
| **ISS-029** Generic campaign banner | Real campaign assets uploaded |
| **ISS-020** Gray category tiles | **Partially** — only if every category has photography uploaded |
| **B-16** Duplicate E2E products in catalog | Real catalog replaces test data |

## Would NOT disappear — still require UI/UX/engineering (Backlog A)

| Issue | Why data doesn’t fix it |
|-------|-------------------------|
| **ISS-001–002** Header triple-nav | Structural layout decision |
| **ISS-007** Mobile hero eats viewport | Design/layout choice |
| **ISS-016–017** Rail scroll affordance | Component UX |
| **ISS-022** Triple category paths | Information architecture |
| **ISS-024** Abstract hub cards | Design pattern — needs photo-first redesign |
| **ISS-033, ISS-036** Internal copy | Content fix in code regardless of data |
| **ISS-037** Readonly AISearch feel | Interaction design |
| **ISS-042** Events desktop/mobile split | Technical architecture |
| **ISS-047** Newsletter gold button | Design token violation |
| **ISS-048** Newsletter unwired backend | Technical integration |
| **ISS-053** Card system inconsistency | Design system adoption |
| **ISS-054** Reduced-motion | Technical a11y |
| **ISS-056** 8–10 viewport scroll | IA/section merge |

## Would improve but still need UI guardrails

Even with perfect data, production UI **must** handle empty states:

| Pattern | Required UI rule |
|---------|------------------|
| New product, zero reviews | Hide review row (Backlog A-03) |
| New product, zero sales | Hide sold count (Backlog A-38) |
| No flash sale this week | Hide flash tab (Backlog A-04) |
| Only 1 verified vendor | Show 1 — but dedupe featured/browse (A-06) |
| Category image CDN failure | Premium fallback, not gray (A-15) |
| Zero upcoming events | Hide events section |

---

## Estimated Premium Lift

| State | Visual QA Score | Notes |
|-------|-----------------|-------|
| **Today (Sprint 1 + demo data)** | 68 / 100 | Structure fixed; finish gaps mixed |
| **Backlog A only (UI/UX, still sparse data)** | ~74 / 100 | Professional empty states; cleaner IA |
| **Backlog B only (real data, current UI)** | ~76 / 100 | Trust improves; layout issues remain |
| **Backlog A + B complete** | ~82 / 100 | Launch-viable per Implementation Plan target |
| **+ Sprint 2 banners** | ~85 / 100 | Merchandising revenue without clutter |

---

## Recommended Execution Order

1. **Backlog A P1** (1 sprint) — UI guardrails + copy fixes + header collapse  
2. **Backlog B P1** (parallel ops) — vendors, reviews seed, flash campaigns, catalog cleanup  
3. **Backlog A P2** + **Backlog B P2** — discovery polish + vertical listing seeds  
4. **Sprint 2** — banner system (only after A P1 trust/placeholder guardrails)

---

*End of Premium Finish Audit. Documentation only — no implementation performed.*
