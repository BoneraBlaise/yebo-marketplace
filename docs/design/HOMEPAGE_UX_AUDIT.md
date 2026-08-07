# Yebone Homepage — UX/UI Design Audit

**Audit date:** 2026-08-06  
**Auditor role:** Principal Product Designer / Senior UX Architect / Design Systems Lead  
**Scope:** Full homepage (`/`) — header through footer  
**Method:** Live UI review (localhost:3000), component architecture analysis, accessibility tree inspection  
**Standard:** Apple · Airbnb · Stripe · Linear · Notion · Shopify launch bar  

**Important:** This document is audit-only. No code, CSS, or layout changes were made.

---

## Executive Summary

The Yebone homepage demonstrates **ambition and visual craft** — a coherent brand palette (teal + gold), glass surfaces, motion accents, and a genuinely differentiated AI try-on narrative. However, it currently reads as a **feature showcase** rather than a **conversion-optimized marketplace entry point**.

The primary structural issue is **section proliferation without hierarchy**: products, AI capabilities, trust signals, and marketing blocks compete at equal visual weight across a very long scroll. A first-time visitor must pass through hero marketing, trust strip, marketplace pillars, optional growth-commerce grids, categories, tabbed product rails, **four distinct AI regions**, events, vendors, testimonials, recently viewed, and newsletter before reaching the footer.

World-class marketplaces (Shopify storefront templates, Airbnb discovery, Apple product pages) obey a simple rule: **one primary job per viewport**, with secondary stories deferred. Yebone’s homepage attempts approximately **twelve primary jobs**.

The unified `ProductCard` (recent polish) is a strong foundation. The homepage has not yet fully benefited from that restraint — flash-sale rails, growth-commerce grids, and AI placeholder modules still introduce visual and cognitive variance.

---

## Homepage Section Order (Current)

| # | Section | Component |
|---|---------|-----------|
| 0 | Global header + category nav | `HomeHeader` + `Navbar` (layout shell) |
| 1 | Hero | `HomeHero` + `HeroAIShowcase` |
| 2 | Trust / feature strip | `HomeFeatureStrip` |
| 3 | Marketplace pillars | `HomeMarketplaceHub` |
| 4 | Growth commerce (conditional) | `HomeGrowthCommerce` |
| 5 | Shop by category | `HomeCategories` |
| 6 | Discover products (tabbed rail) | `HomeProductRails` |
| 7 | AI experience block | `HomeAIExperience` |
| 8 | Ask YEBO / AI discovery | `HomeAIDiscovery` |
| 9 | Shopping assistants grid | `AIShoppingAssistants` |
| 10 | AI Picks | `HomeAIPicks` |
| 11 | Events (banner or section) | `HomeEventsBanner` / `HomeEventsSection` |
| 12 | Verified vendors | `HomeVerifiedVendors` |
| 13 | Testimonials | `HomeReviews` |
| 14 | Continue browsing (auth) | `HomeRecentlyViewed` |
| 15 | Newsletter | `HomeNewsletter` |
| 16 | Footer | `HomeFooter` |

---

## Section-by-Section Review

---

### 0. Global Header & Secondary Navigation

#### Purpose
Primary wayfinding, search entry, account actions, seller tools, and vertical category shortcuts.

#### Strengths
- Unified search supports products, property, mobility, and events — appropriate for a multi-vertical marketplace.
- Create button, messages, and notifications are discoverable for authenticated vendors.
- Search discovery panel (recent + trending) follows Airbnb/Amazon patterns.
- Skip-to-content link present for accessibility.
- Country and language switchers signal international intent.

#### Weaknesses
- **High action density** on desktop: logo, categories, search, visual search, YEBO sparkle, My Shop, messages, notifications, create, profile — nine interactive clusters in one row.
- Secondary **category nav strip** (Shopping, Property, Mobility, Computers, etc.) duplicates wayfinding already available via Categories mega-menu and homepage sections below.
- Mobile compacts further but still stacks search below a crowded icon row — thumb reach and scan order suffer.

#### UX Issues
- Competing entry points to the same destinations (header categories vs nav strip vs homepage category grid).
- Visual search and YEBO sparkle icons inside the search field lack explanatory labels for first-time users.
- Create button meaning differs by auth state (vendor menu vs seller onboarding) — correct behavior, but no persistent textual cue on mobile.

#### Visual Issues
- Header height grows substantially when category nav is visible — reduces above-the-fold product visibility on laptop viewports.
- Icon buttons are well-sized post-recent polish (40px create) but still visually compete with search, the most important control.

#### Information Architecture Issues
- Header tries to be **global app shell** and **homepage wayfinding** simultaneously.
- Category nav strip is persistent on all pages — on homepage it adds redundancy with `HomeCategories` and `HomeMarketplaceHub`.

#### Verdict: **Improve**
- Reduce duplicate category surfaces.
- Consider collapsing secondary nav on homepage or merging with hub section.
- Keep header; do not remove search or account actions.

---

### 1. Hero (`HomeHero` + `HeroAIShowcase`)

#### Purpose
Communicate brand promise (AI-powered African marketplace), primary CTAs, and visual proof of virtual try-on differentiation.

#### Strengths
- Clear headline hierarchy: “Shop Smarter” + gradient subline “Try Before You Buy.”
- `HeroAIShowcase` is distinctive — before/after panels, scan corners, confidence meter — memorable and on-brand.
- Three verticals referenced in copy (Shopping · Property · Mobility).
- Responsive two-column layout on desktop; showcase collapses gracefully.
- Primary CTA “Start Shopping” is visually dominant.

#### Weaknesses
- **Three equal-weight CTAs** (Start Shopping, Browse Property, Try AI Now) dilute focus — Apple/Stripe typically offer one primary + one secondary max above the fold.
- Stat row (“AI / Fashion First / 100% Confidence”) reads as marketing filler rather than proof — undermines premium credibility.
- Hero vertical padding (`py-16` → `py-28`) is generous; combined with header, **first product card is far below fold**.
- Showcase animations (float, pulse, scan line) are decorative — risk feeling “demo-ware” if try-on is not instantly available to all categories.

#### UX Issues
- “Try AI Now” anchor jumps to `#ai-experience` — user must scroll through trust strip and marketplace hub first; weak immediate payoff.
- Property CTA deep-links correctly but splits user intent before establishing shopping habit.

#### Visual Issues
- Strong craft, but **visual complexity rivals Apple marketing pages while lacking their single-message restraint**.
- Blur orbs + glass + gradients + floating product chips = high visual noise for a marketplace homepage (contrast: Shopify Dawn theme hero simplicity).

#### Information Architecture Issues
- Hero sells **platform story**; user likely arrived to **browse products** — mismatch with conversion-first ecommerce norms.

#### Verdict: **Improve**
- Keep hero and showcase as brand anchor.
- Reduce CTAs, tighten copy, move stats or replace with real social proof.
- Do not remove — this is the brand moment.

---

### 2. Trust / Feature Strip (`HomeFeatureStrip`)

#### Purpose
Quick trust signals: secure payments, delivery, AI try-on, returns, verified vendors.

#### Strengths
- Scannable icon + title + description pattern (Shopify trust bar analog).
- Five pillars cover key purchase anxieties.
- Compact vertical footprint (`home-section--tight`).

#### Weaknesses
- Appears **before any product evidence** — user has not yet seen inventory.
- “100% protected checkout” and “Trusted sellers only” are claims without linked proof on homepage.
- On mobile, 2-column grid wraps five items awkwardly (2+2+1).

#### UX Issues
- Trust strip would land stronger **after first product interaction** or adjacent to checkout paths.
- Competes with hero trust narrative (already mentions AI, Africa, verified ecosystem).

#### Visual Issues
- Visually lighter than hero — good — but another horizontal band breaking scroll rhythm.

#### Information Architecture Issues
- Duplicates messages later in testimonials and verified vendors sections.

#### Verdict: **Move** (later in page) or **Merge** with footer trust / vendor section

---

### 3. Marketplace Hub (`HomeMarketplaceHub`)

#### Purpose
Introduce three vertical pillars: Shopping, Property & Real Estate, Vehicles & Mobility with deep links and sub-category chips.

#### Strengths
- Excellent **information scent** for multi-vertical positioning — clearer than generic “marketplace” copy.
- Card layout with gradient icons is readable and tappable.
- Sub-category pills (Apartments, Cars, etc.) enable fast vertical entry — Airbnb-style exploration.

#### Weaknesses
- **Repeats hero messaging** (“everything in one place”) almost verbatim.
- Three large cards consume significant scroll before products.
- Shopping pillar only gets one chip (“Browse products”) while property/mobility get many — imbalanced.

#### UX Issues
- User who clicked “Start Shopping” in hero lands here again conceptually — feels like looping introduction.
- No live listing counts or preview thumbnails — abstract cards vs. Airbnb’s photo-first category entry.

#### Visual Issues
- Cards use generic white/gray surfaces — slightly disconnected from premium hero glass aesthetic.
- Shadow/hover treatment is mild — fine, but not memorable.

#### Information Architecture Issues
- Strong IA for **platform explanation**, weak for **shopping momentum**.
- Should either merge with hero or sit below first product row.

#### Verdict: **Improve** + **Move** (below first product collection)

---

### 4. Growth Commerce (`HomeGrowthCommerce`)

#### Purpose
Dynamic merchandising from Growth Commerce API — campaign banners, flash sale, featured/trending/new/best sellers grids, top vendors.

#### Strengths
- Data-driven sections enable ops/marketing control without deploys — Shopify Sections analog.
- Uses unified `ProductCard` in grids — consistent with recent design system work.
- Conditional rendering avoids empty states when API unavailable.

#### Weaknesses
- When enabled, can inject **up to 8 separate blocks** (hero banner, campaign banner, flash sale, featured, trending, new arrivals, best sellers, top vendors).
- **Directly duplicates** `HomeProductRails` tabs (Trending, New Arrivals, Flash Sale, Recommended).
- Campaign hero banner reintroduces **large gradient marketing hero** — contradicts recent browse-page simplification philosophy.
- Top vendors section is text-only placeholder (“Discover trusted sellers…”) with no vendor cards.

#### UX Issues
- User sees “Trending Products” grid here AND “Trending” tab in rails below — cognitive duplication.
- Section order from API (`SECTION_ORDER`) is fixed in code — marketing cannot prioritize “products first” without engineering.

#### Visual Issues
- Campaign spotlight uses full-width gradient banner — visually shouts louder than product grids.
- Grid breakpoints (2/3/4 cols) differ from unified marketplace grid spec (2/3/4/5) — subtle inconsistency.

#### Information Architecture Issues
- This section blurs **homepage** vs **merchandising landing page** boundaries.
- Should be consolidated into a single “collections” framework shared with category pages.

#### Verdict: **Merge** with Product Rails / category collections OR **Move** behind first curated row; **Improve** top vendors to render real cards or hide

---

### 5. Shop by Category (`HomeCategories`)

#### Purpose
Visual category grid for main shopping taxonomy (Fashion, Tech, Home, etc.).

#### Strengths
- Clear “Shop by category” title with helpful subtitle.
- Dedicated category card component with imagery — appropriate ecommerce pattern.
- “Browse full marketplace” escape hatch at bottom.

#### Weaknesses
- Appears **after** hub and possibly multiple product grids — late for primary discovery job.
- Category grid competes with header mega-menu and nav strip.
- No indication of depth (subcategories) on cards.

#### UX Issues
- Mobile grid density not audited live but category-first users must scroll past marketing blocks.

#### Visual Issues
- Generally consistent with home surfaces (`home-surface-0`).
- Category cards are smaller visual anchors than hero/hub — correct hierarchy, but late placement undermines utility.

#### Information Architecture Issues
- Third category navigation pattern on one page (header, nav strip, this grid).

#### Verdict: **Keep** — but **Move** higher (immediately after first product row or integrated into hub)

---

### 6. Discover Products — Tabbed Rails (`HomeProductRails`)

#### Purpose
Primary product discovery with tabs: Trending, New Arrivals, Popular, Flash Sale, Recommended; horizontal carousel + “View all.”

#### Strengths
- **Best-in-class section on the homepage** for ecommerce job-to-be-done.
- Tab pattern reduces vertical sprawl vs. separate sections per collection (Notion/Linear-style segmented content).
- Uses `MarketplaceCardRail` — appropriate horizontal scan on mobile.
- Unified `ProductCard` for all tabs except flash — mostly consistent.
- Loading skeletons and empty state handled.

#### Weaknesses
- Still positioned **below** hub, growth commerce, and categories — not true above-the-fold discovery.
- **Flash Sale tab uses `HomeFlashSaleCard`** — different dimensions, typography, and styling vs unified ProductCard — breaks design system cohesion.
- Five tabs may be one too many on mobile (horizontal scroll chips help but add decision cost).
- “Recommended” tab filters `featured` flag — overlaps semantically with AI Picks and growth commerce “Featured Products.”

#### UX Issues
- Rail shows ~2–5 cards visible; user may not realize horizontal scroll affordance.
- Tab state resets on navigation away — expected, but no URL persistence for shareable collection views.

#### Visual Issues
- Section title + tabs + rail + CTA is well-structured.
- `home-surface-1` alternation provides rhythm — good.

#### Information Architecture Issues
- Should be **the canonical product discovery block** — other product sections should feed into or defer to this pattern.

#### Verdict: **Keep** — **Improve** flash card parity; **Move** upward in page order

---

### 7. AI Experience (`HomeAIExperience`)

#### Purpose
Explain four AI capabilities; embed `AISearch` input; link down-page to AI Picks.

#### Strengths
- Clear feature grid (Search, Try-On, Recommendations, Assistant).
- AISearch component provides immediate interaction — Stripe-like “try the product” embedding.
- Section id `ai-experience` enables hero anchor navigation.
- Visual emphasis (`home-section--emphasis`) appropriate for differentiation story.

#### Weaknesses
- **Fourth major AI block** on a page that already has AI hero, AI discovery, assistants, and AI picks.
- Copy (“The future of African e-commerce”) is grand but vague — Notion/Linear favor concrete outcomes.
- “Explore AI Picks below” link requires more scrolling — weak funnel.

#### UX Issues
- Users may confuse this section with actual YEBO panel (header sparkle also opens AI).
- Feature cards are not clickable — missed opportunity for progressive disclosure.

#### Visual Issues
- Two-column layout with sticky search on desktop is polished.
- Gold badge + four cards + search = **high content density** for a single section.

#### Information Architecture Issues
- Overlaps heavily with sections 8–10; should be **one AI surface** with tabs or accordion.

#### Verdict: **Merge** with HomeAIDiscovery / header YEBO entry; **Improve** copy specificity

---

### 8. Ask YEBO / AI Discovery (`HomeAIDiscovery`)

#### Purpose
YEBO intelligence surface: welcome back, decision hints, proactive suggestions, continue shopping, trending searches, insights, AI product recommendations.

#### Strengths
- Rich vision of personalized commerce — memory, continuity, proactive banners.
- Chip-based prompts are scannable.
- Product recommendations use unified ProductCard in grid — good.
- Authenticated memory components (`YEBOWelcomeBack`, `YEBOContinueShopping`) add real utility when wired.

#### Weaknesses
- **Largest UX liability on the homepage.** Subtitle explicitly references “mock recommendations via YIP” — if visible or inferable, destroys trust.
- Stacked modules (welcome, decision hint, intelligence hint, proactive banner, cross-page continuity, continue shopping, reminders, ask card, trending, suggestions, recently searched, insights, product grid) = **mini-app inside homepage**.
- Placeholder data (`TRENDING_SEARCHES`, `SMART_SUGGESTIONS`, `RECENTLY_SEARCHED` from static arrays) — reads as fake when not personalized.
- Duplicates search discovery already in header dropdown.

#### UX Issues
- Overwhelming for returning users let alone first-time visitors.
- Multiple “Trending” labels across page cause disorientation (matches E2E strict-mode failure with 10 “Trending” matches).
- Section competes with messaging/inbox for “continue where you left off.”

#### Visual Issues
- Many small cards with similar glass styling — **low hierarchy among sub-blocks**.
- `home-section--compact !pt-0` stacking feels cramped relative to surrounding airy sections.

#### Information Architecture Issues
- Belongs in **YEBO panel / account home**, not public marketing homepage.
- Product recommendations here duplicate rails, growth commerce, and AI Picks.

#### Verdict: **Remove** from public homepage (relocate to authenticated dashboard or YEBO panel) OR ** radically Simplify** to single “Ask YEBO” card

---

### 9. Shopping Assistants (`AIShoppingAssistants`)

#### Purpose
Grid of six assistant personas (budget, gift, size, style, best, trending) — future feature placeholders.

#### Strengths
- Clear iconography and tags.
- Compact grid works on mobile (2 columns).

#### Weaknesses
- Subtitle states **“presentation placeholders ready for future integration”** — should never ship to production homepage.
- Cards are `cursor-default` — non-interactive dead ends.
- Conceptually duplicates AI Experience feature cards and YEBO chat.

#### UX Issues
- User taps nothing happens — frustration.
- Six similar cards without differentiation in outcome.

#### Visual Issues
- Repetitive gradient icon squares — visual monotony.
- Another AI-labeled section fatigues scroll.

#### Information Architecture Issues
- Feature preview belongs in **marketing site / changelog**, not core homepage.

#### Verdict: **Remove** until interactive OR **Merge** into single AI entry point

---

### 10. AI Picks (`HomeAIPicks`)

#### Purpose
Curated product grid labeled “AI Picks for you” — fashion/beauty/lifestyle prioritization.

#### Strengths
- Clean section with badge + title + 4-product grid.
- Uses unified ProductCard — consistent.
- Skeleton loading state when insufficient data.

#### Weaknesses
- **Third product recommendation block** after rails and AI Discovery grid.
- “AI Powered” badge overused — badge fatigue.
- Logic (`getAIPicksProducts`) opaque to user — no explanation of why picks matter.
- Overlaps “Recommended” tab in rails.

#### UX Issues
- Without true personalization, picks are indistinguishable from trending — trust erosion if labeled “AI.”

#### Visual Issues
- Section is visually clean — one of the tighter blocks.
- Placement late in page reduces impact.

#### Information Architecture Issues
- Should merge with Product Rails as a tab or personalized row at top (authenticated).

#### Verdict: **Merge** into Product Rails as “For You” tab (auth-gated) OR **Move** immediately below hero for returning users only

---

### 11. Events (`HomeEventsBanner` / `HomeEventsSection`)

#### Purpose
Promote marketplace events vertical — fashion weeks, festivals, vendor showcases.

#### Strengths
- Visually striking banner on desktop — emotional break from product grids.
- Clear CTA to `/events`.
- Mobile variant (`HomeEventsSection`) embeds live `Events` component — more functional.

#### Weaknesses
- Desktop banner is **decorative** — mosaic chips with labels but no dates, venues, or real events.
- Large min-height (320–420px) for marketing without transactional value.
- Breakpoint switch at 900px (`isBannerVisible`) creates ** materially different UX** desktop vs mobile without clear rationale.

#### UX Issues
- Events appear after exhaustive product/AI content — users interested in events may have bounced.
- Mobile section loads full Events list — potentially heavy insertion near page bottom.

#### Visual Issues
- Animated floating chips are delightful but feel **Airbnb Experiences teaser without photos** — half promise.

#### Information Architecture Issues
- Events are a vertical equal to Property/Mobility — deserve hub-level linkage (already in header) more than late banner.

#### Verdict: **Improve** — use real event cards; **Move** higher or into Marketplace Hub; **Simplify** desktop banner height

---

### 12. Verified Vendors (`HomeVerifiedVendors`)

#### Purpose
Trust + discovery of sellers — featured grid and browse swipe rail.

#### Strengths
- **Strong trust-building section** — verified badge, shop previews, product counts.
- Two-tier structure (featured vs browse) mirrors Airbnb Superhost pattern.
- Uses dedicated `MarketplaceVendorCard` — appropriate component separation from ProductCard.
- Skeleton loading states.

#### Weaknesses
- Late placement — after AI fatigue.
- “Browse all verified vendors” subtitle mentions “four at a time on mobile” — **implementation detail exposed to user**.
- Depends on `isVerified` flag in product data — may show sparse results.

#### UX Issues
- Swipe rail affordance may be unclear (same class of issue as product rails).

#### Visual Issues
- `home-surface-2` background provides good separation.
- Vendor cards are visually distinct from product cards — correct.

#### Information Architecture Issues
- Overlaps “Top Vendors” from growth commerce (when enabled).
- Could link to dedicated `/shops` discovery if exists.

#### Verdict: **Keep** — **Move** earlier (post-products, pre-AI) — **Improve** copy

---

### 13. Testimonials (`HomeReviews`)

#### Purpose
Social proof — three shopper quotes from Africa.

#### Strengths
- Clean three-column card layout on desktop.
- Star ratings + avatar initials + location — standard trust pattern.
- Quotes reference real differentiators (AI try-on, verified sellers, local brands).

#### Weaknesses
- **Static hardcoded testimonials** — no photos, no links to reviews, no verification.
- Sophisticated users recognize templated social proof (Stripe/Apple use real logos and metrics instead).
- All five-star — lacks authenticity nuance.

#### UX Issues
- Placed very late — many users never scroll here.
- Does not connect to product or vendor entities.

#### Visual Issues
- Cards match home surface system — cohesive.
- Typography in quotes is readable.

#### Information Architecture Issues
- Redundant with feature strip trust claims and vendor section.

#### Verdict: **Improve** with real reviews OR **Merge** into hero/trust strip as rotating quote; consider **Remove** until authentic data exists

---

### 14. Continue Browsing (`HomeRecentlyViewed`)

#### Purpose
Authenticated users resume product discovery from cookie/local history.

#### Strengths
- Correctly **auth-gated** — avoids clutter for guests.
- Clear “Continue browsing” title — Shopify/Amazon pattern.
- Reuses `RecentlyViewed` component — engineering consistency.

#### Weaknesses
- Also appears inside `HomeAIDiscovery` via `YEBOContinueShopping` — duplication for auth users.
- Placed after testimonials — **far too late** for high-intent return visits.

#### UX Issues
- Returning users must scroll past entire marketing stack to reach personal history.

#### Visual Issues
- Compact section variant — appropriate.

#### Information Architecture Issues
- Should be **first product-adjacent section** for authenticated users (after hero or immediately after header).

#### Verdict: **Keep** — **Move** to top (personalized homepage row)

---

### 15. Newsletter (`HomeNewsletter`)

#### Purpose
Email capture for deals, AI updates, vendor launches.

#### Strengths
- Glass card treatment is visually premium.
- Single-field form — low friction.
- Privacy microcopy (“No spam. Unsubscribe anytime.”).

#### Weaknesses
- Submit shows toast **“UI preview only”** — if triggered in production, **actively damages trust**.
- Appears at absolute bottom — standard but low conversion placement without preceding value recap.
- Value proposition generic — not differentiated from any ecommerce site.

#### UX Issues
- No incentive articulated (discount, early access) — weak motivation.
- Users fatigued by long scroll may ignore entirely.

#### Visual Issues
- Emphasis section styling makes it feel important — good visual weight.
- Gold CTA button aligns with brand.

#### Information Architecture Issues
- Fine as footer-adjacent capture; could also live in footer only.

#### Verdict: **Improve** — wire backend or remove until functional; consider **Merge** with footer

---

### 16. Footer (`HomeFooter`)

#### Purpose
Legal, support, shop links, brand statement, social placeholders.

#### Strengths
- Mobile accordion (`<details>`) reduces vertical sprawl — recent polish win.
- Four-column link taxonomy on desktop — scannable.
- Logo + brand slogan reinforcement.
- i18n on tagline.

#### Weaknesses
- Some links route to same paths (`Press`/`Investors` → `/about`) — feels unfinished.
- Social buttons are non-linked placeholders (`button` not `a`).
- Shop links duplicate header/nav destinations.

#### UX Issues
- Accordion interaction on mobile adds taps — acceptable tradeoff for length.

#### Visual Issues
- Muted palette appropriate for terminal section.
- Good separation from newsletter above.

#### Information Architecture Issues
- Solid baseline; no major IA flaws.

#### Verdict: **Keep** — **Improve** social links and unique destinations

---

## Cross-Cutting Review

### Visual Hierarchy
**Assessment:** Medium-high craft, medium-low clarity.  
Multiple sections use `SectionTitle` + badge + subtitle + grid at identical visual tier. The eye lacks a **single focal path** from hero → products → checkout. Apple-style hierarchy would assign: (1) search/shop, (2) one differentiated story (AI try-on), (3) everything else.

### Typography
**Assessment:** Good foundation via design-system `typography.hero`, `typography.heading`.  
Issues: mixed font stacks (`font-Poppins` sprinkled in AI sections vs system titles), uppercase micro-labels at many sizes (9px–11px) reduce readability, overuse of semibold at small sizes creates **uniform emphasis = no emphasis**.

### Spacing Consistency
**Assessment:** Reasonably systematic via `home-section`, `--tight`, `--compact`, `--emphasis` modifiers.  
However, alternating `home-surface-0/1/2/3` bands create zebra rhythm that ** elongates perceived scroll distance**. Some sections stack with `--compact !pt-0` creating uneven vertical breathing.

### White Space
**Assessment:** Hero and events banner use generous space; AI discovery section uses **insufficient internal whitespace** relative to component count. Net effect: simultaneously airy and cluttered in different zones.

### Card Consistency
**Assessment:** Product cards recently unified — strong.  
Remaining inconsistencies: `HomeFlashSaleCard`, vendor cards (intentionally different), AI `AICard`, marketing hub cards, events chips, testimonial cards — **six card dialects** on one page.

### CTA Placement
**Assessment:** CTAs distributed across hero (3), hub (3+), each product section (“View all”), AI links, events, newsletter — **no unified primary conversion spine**. Shopify homepage typically repeats one CTA (“Shop all”) at predictable intervals.

### Section Ordering
**Assessment:** Current order prioritizes **platform narrative before inventory**. World-class ecommerce homepages invert this: products within first viewport or first scroll; story second.

### Mobile Experience
**Assessment:** Responsive patterns exist (compact header, accordion footer, 2-col grids, swipe rails).  
Pain points: header + nav + hero consume **entire first screen** without products; AI sections stack into extremely long scroll; bottom nav (if present on mobile layout) adds another navigation layer — potential thumb-zone competition.

### Scroll Fatigue
**Assessment:** **Severe.** Estimated 12–18 full viewport heights for unauthenticated users depending on growth commerce enabled. Linear/Notion homepages typically ≤ 4–5 viewports before footer.

### Content Density
**Assessment:** AI cluster is hyper-dense; product sections moderate; trust/testimonial zones sparse. Imbalance creates **cognitive whiplash**.

### Trust Building
**Assessment:** Mixed signals. Verified vendors + feature strip + testimonials aim for trust, but placeholder AI, mock newsletter, and static quotes ** undermine credibility** for discerning users.

### Premium Perception
**Assessment:** Visual tokens (glass, gradients, motion) signal premium intent. Overuse of placeholders, duplicate sections, and marketing superlatives shift perception from **luxury restraint** to **startup feature dump**.

### Conversion Flow
**Assessment:** Weak direct path to transaction. User must discover products through multiple competing modules. No homepage exposure of deals with urgency, cart continuity, or session-based social proof (e.g., “X people viewing”).

### Accessibility
**Assessment:** Positives — skip link, aria labels on rails, star rating labels on reviews, search roles.  
Concerns — many icon-only header buttons rely on aria-label (good) but tooltips absent; small 9–10px text in showcase; motion animations without evident `prefers-reduced-motion` gating on float/pulse elements; heading level proliferation (many h2/h3) may flatten document outline.

### Design Consistency
**Assessment:** Brand colors and surface tokens consistent. **Section templates inconsistent** — some use `AISection`, others raw `section`, growth commerce inline styles differ from `SectionTitle` pattern.

---

# Homepage Score

| Dimension | Score |
|-----------|-------|
| **Visual Design** | **7.5 / 10** |
| **UX** | **6.0 / 10** |
| **Information Architecture** | **5.5 / 10** |
| **Trust & Credibility** | **6.0 / 10** |
| **Conversion** | **5.5 / 10** |
| **Performance Perception** | **7.0 / 10** |
| **Premium Feel** | **7.0 / 10** |
| **Apple-Level Polish** | **5.5 / 10** |
| **Overall** | **63 / 100** |

**Interpretation:** Strong visual ambition and meaningful differentiation (AI try-on, multi-vertical). Not yet at Apple/Shopify launch standard due to structural redundancy, scroll length, and placeholder-driven surfaces exposed to end users.

---

## Top 10 Highest Priority Problems

### P1 — Product discovery buried below marketing stack
**Why:** The homepage’s core job for most visitors is to browse and buy. Product rails appear after hero, trust strip, marketplace hub, optional growth commerce, and categories — often **4–6 viewport heights** down.  
**Impact if fixed:** **Very high** — direct lift to click-through, session depth, and GMV. Single highest-leverage IA change.

### P2 — AI section proliferation (4+ separate regions)
**Why:** HomeAIExperience, HomeAIDiscovery, AIShoppingAssistants, and HomeAIPicks repeat the same story with overlapping chips, badges, and product grids. Users cannot identify the canonical AI entry point (header sparkle vs embedded search vs discovery grid).  
**Impact if fixed:** **Very high** — reduced cognitive load, shorter page, clearer brand story, improved trust.

### P3 — Placeholder and mock content visible in production UI
**Why:** Copy references “mock recommendations,” “presentation placeholders,” newsletter “UI preview only,” static trending chips, and hardcoded testimonials. Discerning users infer incomplete product — damages credibility worse than omitting features.  
**Impact if fixed:** **Very high** — trust and premium perception; reduces bounce from skepticism.

### P4 — Duplicate product collection modules
**Why:** Growth commerce grids, product rails tabs, AI discovery recommendations, and AI Picks can all show similar SKUs under different labels (Trending, Featured, Recommended, AI Picks).  
**Impact if fixed:** **High** — cleaner IA, faster scroll-to-value, less maintenance burden.

### P5 — Flash sale card breaks unified ProductCard system
**Why:** Flash tab in rails uses `HomeFlashSaleCard` with distinct sizing and styling while rest of marketplace recently unified on `ProductCard`. Homepage is first impression of design system coherence.  
**Impact if fixed:** **High** — visual consistency across flagship entry point; reinforces recent polish investment.

### P6 — Excessive homepage scroll length
**Why:** 15+ sections for guests creates scroll fatigue; mobile users unlikely to reach vendors, testimonials, or newsletter. Engagement metrics typically cliff after 3–4 viewports.  
**Impact if fixed:** **High** — improved completion rates for lower sections; better mobile retention.

### P7 — Triple category navigation redundancy
**Why:** Header mega-menu + persistent category nav strip + homepage category grid + marketplace hub chips — four ways to same destinations increases decision paralysis (Hick’s Law).  
**Impact if fixed:** **Medium-high** — cleaner header, faster orientation, more screen for content.

### P8 — Hero CTA overload and weak stat row
**Why:** Three competing CTAs and abstract stats (“100% Confidence”) dilute hero focus; Apple-style pages maintain one primary action.  
**Impact if fixed:** **Medium** — improved click concentration on primary shopping path.

### P9 — Recently viewed and personalized content placed too late
**Why:** Auth users’ highest-intent content (“Continue browsing”) sits near footer; AI memory components duplicate this inside discovery section.  
**Impact if fixed:** **Medium-high** for returning users — session re-engagement and conversion recovery.

### P10 — Testimonials and trust strip lack authenticity signals
**Why:** Hardcoded quotes and generic trust claims without verifiable anchors (review count, logos, links) feel fabricated — counterproductive for trust goal.  
**Impact if fixed:** **Medium** — trust lift when real; risk reduction if removed until authentic.

---

## Sections to Remove

| Section | Rationale |
|---------|-----------|
| **AIShoppingAssistants** | Non-interactive placeholders; duplicates AI Experience; subtitle admits presentation-only |
| **HomeAIDiscovery (majority of sub-modules)** | Mock data stack; belongs in YEBO panel / account home; keep at most one entry card if needed |
| **Growth commerce duplicate grids** | When rails cover same collections — retain API-driven banner only OR rails, not both |
| **Hero stat row** | Low credibility metrics; adds noise without proof |
| **Testimonials (until real)** | Static quotes harm trust if detected as templates |

---

## Sections to Merge

| Merge | Into | Rationale |
|-------|------|-----------|
| HomeAIExperience + AIShoppingAssistants + AI Picks entry | **Single “YEBO” section** with search + 2 feature highlights | One AI story |
| HomeAIDiscovery product grid + HomeAIPicks | **Product Rails “For You” tab** | One recommendation surface |
| HomeFeatureStrip + HomeReviews (when real) | **Unified “Trust bar”** | Consolidate social proof |
| HomeMarketplaceHub + HomeCategories (partial) | **“Explore marketplace” module** with vertical tabs | Reduce redundant category UX |
| Growth commerce product grids | **HomeProductRails tabs** | API-driven tab content instead of separate sections |
| Newsletter + footer email (optional) | **Footer capture** | Reduce pre-footer section count |

---

## Sections to Reorder

**Recommended narrative arc (guest):**

1. Header (unchanged)
2. **Compact hero** (single primary CTA)
3. **Product rails** (Trending default) — immediate inventory proof
4. **Shop by category** OR marketplace hub (pick one primary explorer)
5. **Verified vendors** (trust after seeing products)
6. **Single AI differentiation block** (try-on + Ask YEBO)
7. **Events** (if real content)
8. **Testimonials** (if authentic)
9. Newsletter
10. Footer

**Recommended arc (authenticated):**

1. Header  
2. **Continue browsing / Recently viewed** (first personalized row)  
3. Product rails with **“For You”** default tab  
4. Remaining guest arc (compressed)

---

## Sections to Simplify

| Section | Simplification |
|---------|----------------|
| **Hero** | One primary + one secondary CTA; shorten vertical padding |
| **HomeMarketplaceHub** | Reduce chip count; add listing preview thumbnails |
| **HomeProductRails** | Four tabs max; unify flash card |
| **HomeAIExperience** | Remove feature grid; keep AISearch + one sentence |
| **HomeEventsBanner** | Replace mosaic with 2–3 real event cards |
| **HomeVerifiedVendors** | Single row; remove implementation subtitle |
| **Header** | Hide or collapse secondary category nav on homepage |

---

## Sections Already Excellent

| Section | Why it works |
|---------|--------------|
| **HomeProductRails (structure)** | Tabbed collections + horizontal rail + view-all — correct ecommerce pattern; best discovery UX on page |
| **HomeVerifiedVendors (concept)** | Two-tier featured + browse; strong trust/discovery hybrid |
| **HeroAIShowcase (visual)** | Memorable differentiation; premium motion and craft |
| **HomeFooter (mobile)** | Accordion pattern shows responsive IA maturity |
| **Unified ProductCard in grids** | Recent system work visible in rails, AI picks, growth commerce — correct direction |
| **Search header + discovery dropdown** | Matches best-in-class marketplace search UX |
| **Lazy-loaded section architecture** | Performance-conscious loading skeletons — good engineering UX pairing |

---

## If I Were Preparing This Homepage for a World-Class Launch, These Would Be the First Improvements I Would Approve

1. **Move product discovery above the fold** — Product rails (Trending) become the first content block after a tightened hero; no user should scroll past three marketing sections before seeing inventory.

2. **Collapse four AI sections into one** — A single “YEBO Intelligence” band: interactive search, virtual try-on link, and open-panel CTA; remove all placeholder assistant grids and mock discovery modules from the public homepage.

3. **Remove or hide every mock/placeholder surface** — Anything labeled preview, mock, or placeholder must not ship in production UI; silent removal beats exposed incompleteness.

4. **Establish one product collection system** — Product rails as canonical; growth commerce feeds tab data instead of spawning independent grids; AI Picks becomes authenticated tab not standalone section.

5. **Unify flash sale presentation** — Flash tab uses same ProductCard with badge overlay; eliminate visual dialect break.

6. **Cut homepage length by ~40%** — Remove shopping assistants, compress AI discovery, consolidate trust/testimonials, evaluate necessity of both hub AND category grid.

7. **Personalize above-the-fold for returning users** — Recently viewed / continue shopping becomes first row when authenticated.

8. **Reduce header wayfinding duplication** — One category exploration pattern on homepage; simplify persistent nav strip.

9. **Replace static testimonials or remove** — Real review integration with star aggregate near product rails, or defer section until data exists.

10. **Wire newsletter or remove** — Non-functional subscribe actively harms trust; footer-only capture until backend ready.

---

## Appendix: Benchmark References

| Pattern | Reference | Yebone current |
|---------|-----------|----------------|
| Product-first fold | Shopify Dawn, Amazon | Story-first fold |
| Single AI entry | Apple Intelligence marketing | 4+ AI sections |
| Tabbed collections | Nike.com homepage | Present but buried |
| Trust after products | Airbnb listings flow | Trust before products |
| Restrained hero CTAs | Stripe.com | Three equal CTAs |
| Personalized return row | Amazon “Pick up where you left off” | Bottom of page |
| Section budget | Linear.app (~4 sections) | ~15 sections |

---

*End of audit. Document intended for senior design/engineering handoff — implementation specs deliberately omitted per audit scope.*
