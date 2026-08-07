# Yebone Homepage — Visual QA Report (Step 1.5)

**Audit date:** 2026-08-06  
**Auditor role:** Senior Product Designer · Visual QA · Launch Readiness  
**Scope:** Post–Sprint 1 homepage (`/`) — visual quality only  
**Method:** Live UI capture at 6 viewports + full-page screenshots + accessibility tree cross-check  
**Benchmarks (quality level only):** Apple · Airbnb · Shopify · Stripe · Linear  
**Rules:** Audit only — no code, CSS, or implementation changes were made.

---

## Screenshot Archive

Full-page captures (header → footer) saved to:

```
e2e/audit-screenshots/homepage-visual-qa/
├── homepage-full-desktop-1920.png
├── homepage-full-desktop-1440.png
├── homepage-full-laptop-1280.png
├── homepage-full-tablet-768.png
├── homepage-full-mobile-390.png
└── homepage-full-mobile-414.png
```

**Capture environment:** `localhost:3000` · Frontend running · Playwright Chromium · `networkidle` + 2.5s settle  
**Session:** Unauthenticated guest (no Recently Viewed row — auth layout not captured in this set)

---

## Executive Summary

Sprint 1 materially improved **information hierarchy** and **scroll weight**. Products now appear within the first 1–2 viewports on desktop and tablet. The homepage no longer reads as an AI feature dump.

However, a Principal Designer reviewing this for worldwide launch would still flag it as **“premium ambition, marketplace incompleteness.”** The gap to Apple/Airbnb/Shopify/Stripe/Linear is not about copying their aesthetics — it is about **proof density, component finish, and navigation restraint**. Too many sections still show placeholders, duplicate entities, or implementation-facing copy. Visual craft on the hero and AI showcase exceeds craft on categories, vendors, and events — creating uneven premium perception.

**Estimated overall production readiness (visual):** **68 / 100** (up from ~55 pre–Sprint 1, target 82+ for launch)

---

# Section-by-Section Visual Review

---

## 1. Header & Global Search

| Field | Assessment |
|-------|------------|
| **Current purpose** | Global wayfinding, unified search, account/cart, vertical category shortcuts |
| **Strengths** | Search is prominent and correctly centered on desktop; logo clear; skip link present; category coverage matches multi-vertical positioning |
| **Weaknesses** | Three stacked navigation layers (utility bar + main header + category strip) consume ~140–180px before content; 12+ category links create noise; mobile stacks search below icon row — products pushed down |
| **Visual issues** | Icon density competes with search; category strip feels like a second homepage; active/hover states subtle |
| **Spacing issues** | Tight icon clusters on laptop; category strip padding adds height without value on homepage |
| **Typography issues** | Category nav links small (12–13px feel); utility bar competes with main header weight |
| **Hierarchy issues** | Search should be the undisputed primary control — currently shares tier with 6+ icons |
| **Conversion issues** | Hick’s Law — too many equal-weight entry points before first product |
| **Trust issues** | None critical in header itself |
| **Mobile issues** | Thumb reach poor for create/messages/notifications; search not full-width row 1 |
| **Desktop issues** | Category strip redundant with homepage category grid below |
| **Premium score** | **6.5 / 10** |
| **Recommendation** | **Improve** — collapse category strip on homepage; reduce icon count; search-first layout |

---

## 2. Hero

| Field | Assessment |
|-------|------------|
| **Current purpose** | Brand differentiation (AI try-on), primary conversion CTA |
| **Strengths** | Distinctive `HeroAIShowcase` — memorable, on-brand teal/gold; headline hierarchy clear; Sprint 1 compaction helps; two CTAs (better than three) |
| **Weaknesses** | Still full-viewport on mobile before products; marketing story precedes inventory on phone; “Start Shopping” redundant when product rail is immediately below |
| **Visual issues** | Blur orbs + glass + floating UI = high decorative noise; showcase panel reads “demo” not “live product” |
| **Spacing issues** | Improved but hero + header still = entire first screen on 390px |
| **Typography issues** | Display scale good; subcopy slightly long |
| **Hierarchy issues** | Hero wins over products on mobile — wrong for marketplace job |
| **Conversion issues** | Secondary CTA “Try AI Virtual Try-On” splits intent for first-time shoppers |
| **Trust issues** | Showcase uses generic product names (“E2E Unified Auth Product”) when wired to real data — feels internal |
| **Mobile issues** | Showcase stacks below copy — long scroll to products |
| **Desktop issues** | Strong; best visual moment on page |
| **Premium score** | **7.0 / 10** |
| **Recommendation** | **Improve** — guest mobile: consider slim strip hero or product peek above fold; keep showcase on desktop |

---

## 3. Search (Header Entry)

| Field | Assessment |
|-------|------------|
| **Current purpose** | Universal discovery — products, property, mobility, events |
| **Strengths** | Correct marketplace pattern; placeholder text is descriptive; visual search + YEBO sparkle signal capability |
| **Weaknesses** | Icons inside field lack first-visit labels; discovery panel not visible in static audit; duplicates “search” concept in YEBO band below |
| **Visual issues** | Search field styling consistent with design system |
| **Spacing issues** | Adequate on desktop; cramped on mobile in header row |
| **Typography issues** | Placeholder readable |
| **Hierarchy issues** | Good on desktop; secondary on mobile |
| **Conversion issues** | Strong when used — but visually deprioritized on mobile |
| **Trust issues** | N/A |
| **Mobile issues** | Should be row 2 full-width (partially is) |
| **Desktop issues** | Good |
| **Premium score** | **7.5 / 10** |
| **Recommendation** | **Keep** + **Improve** tooltips / first-visit hints |

---

## 4. Discover Products (Product Rails)

| Field | Assessment |
|-------|------------|
| **Current purpose** | Primary inventory proof — trending, new, flash, recommended/for you |
| **Strengths** | **Best ecommerce section on page**; early placement post–Sprint 1; unified `ProductCard`; tab pattern reduces vertical sprawl; horizontal rail appropriate for mobile |
| **Weaknesses** | “No reviews yet” on nearly every card erodes trust; flash tab empty state with no fallback merchandising; horizontal scroll affordance weak (no peek/fade/ arrows on desktop); auth “For You” not visible in guest screenshots |
| **Visual issues** | Cards consistent; rail card width fixed — ~1.4 cards visible on mobile |
| **Spacing issues** | Section title + tabs + rail well balanced after compact padding |
| **Typography issues** | Section title strong; tab chips readable |
| **Hierarchy issues** | Correctly elevated — should remain #1 content priority |
| **Conversion issues** | High — direct path to PDP; wishlist/cart on hover work |
| **Trust issues** | Empty star rows hurt; “0 sold” visible on cards |
| **Mobile issues** | Tab wrap/scroll OK; need clearer swipe hint |
| **Desktop issues** | Could show 5th column peek at 1440px+ |
| **Premium score** | **7.5 / 10** |
| **Recommendation** | **Keep** + **Improve** reviews display, flash fallback, scroll affordance |

---

## 5. Shop by Category

| Field | Assessment |
|-------|------------|
| **Current purpose** | Taxonomy entry — fashion, tech, home, etc. |
| **Strengths** | Clear grid; overlay titles readable; photo map when images load |
| **Weaknesses** | Many tiles render as **gray gradient placeholders** — reads unfinished; 16 categories = long grid; third category path on page (header strip + this grid) |
| **Visual issues** | Inconsistent imagery — some photos, many fallbacks; gradient overlay formulaic |
| **Spacing issues** | Grid gap acceptable; section feels long on mobile |
| **Typography issues** | White on gradient OK; small on mobile tiles |
| **Hierarchy issues** | Correctly after products; could merge with hub |
| **Conversion issues** | Good for browsers; weak visual appeal reduces clicks |
| **Trust issues** | Placeholder tiles signal “site not fully stocked” |
| **Mobile issues** | 2-column grid dense; small tap targets on some tiles |
| **Desktop issues** | 6-column at wide — acceptable |
| **Premium score** | **6.0 / 10** |
| **Recommendation** | **Improve** — real photography required; reduce to 8 curated categories on homepage |

---

## 6. Marketplace Hub (Shopping · Property · Mobility)

| Field | Assessment |
|-------|------------|
| **Current purpose** | Multi-vertical positioning with deep links |
| **Strengths** | Clear three-pillar IA; chip links for property/mobility; icon gradients on-brand |
| **Weaknesses** | Abstract white cards — not photo-first (Airbnb benchmark); shopping pillar only one chip; no live listing previews or counts; repeats category wayfinding |
| **Visual issues** | Cards feel like documentation blocks, not discovery surfaces |
| **Spacing issues** | Three tall cards = significant scroll on mobile |
| **Typography issues** | Adequate; descriptions generic |
| **Hierarchy issues** | Should not compete with product rail — currently OK order |
| **Conversion issues** | Property/mobility users must self-navigate without visual proof |
| **Trust issues** | No verified listing badges or sample photos |
| **Mobile issues** | Stacked cards long; chips wrap well |
| **Desktop issues** | 3-column layout clean |
| **Premium score** | **6.5 / 10** |
| **Recommendation** | **Improve** — add listing thumbnails; **Merge** partially with category explorer |

---

## 7. Property (Homepage Exposure)

| Field | Assessment |
|-------|------------|
| **Current purpose** | Entry to property vertical via hub chips + header nav |
| **Strengths** | Links correct (`/property-mobility?listingType=property`); chip labels clear |
| **Weaknesses** | **No property cards on homepage** — vertical is link-only; no photos, prices, or locations |
| **Visual issues** | N/A — underrepresented |
| **Spacing issues** | N/A |
| **Typography issues** | N/A |
| **Hierarchy issues** | Equal vertical in copy but not in visual weight |
| **Conversion issues** | Property-intent users get no homepage proof |
| **Trust issues** | Cannot assess listing quality from homepage |
| **Mobile issues** | Chips tappable |
| **Desktop issues** | Chips tappable |
| **Premium score** | **5.0 / 10** |
| **Recommendation** | **Improve** — 2–3 property preview cards in hub (Sprint 2+) |

---

## 8. Mobility (Homepage Exposure)

| Field | Assessment |
|-------|------------|
| **Current purpose** | Entry to vehicles vertical via hub + header |
| **Strengths** | Same as property — IA present |
| **Weaknesses** | Same as property — no vehicle imagery on homepage |
| **Visual issues** | Underrepresented |
| **Premium score** | **5.0 / 10** |
| **Recommendation** | **Improve** — vehicle preview cards with photo, price, year |

---

## 9. Flash Sales (Product Rail Tab + Campaign Banner)

| Field | Assessment |
|-------|------------|
| **Current purpose** | Urgency merchandising — flash tab + growth commerce banner |
| **Strengths** | Unified `ProductCard` with Flash badge (when data exists); dedicated tab; `/flash-sales` escape hatch |
| **Weaknesses** | **Empty state** in audit capture (“No products in this collection yet”) — dead end; campaign banner generic green block; no countdown strip |
| **Visual issues** | Banner is functional not emotional; no flash urgency visual language when empty |
| **Spacing issues** | Banner compact — good |
| **Typography issues** | “CAMPAIGN SPOTLIGHT” uppercase OK |
| **Hierarchy issues** | Banner between hub and vendors — reasonable |
| **Conversion issues** | Empty flash tab wastes high-intent click |
| **Trust issues** | Promising flash sale then showing nothing damages credibility |
| **Mobile issues** | Tab accessible |
| **Desktop issues** | Tab accessible |
| **Premium score** | **5.5 / 10** |
| **Recommendation** | **Improve** — hide flash tab when empty; add countdown on cards when live |

---

## 10. Growth Commerce Campaign Banner

| Field | Assessment |
|-------|------------|
| **Current purpose** | Admin-driven campaign spotlight |
| **Strengths** | Sprint 1 correctly removed duplicate product grids; single banner slot |
| **Weaknesses** | Full-width teal gradient with generic “Shop the latest deals” — not differentiated; no campaign imagery; visually loud vs product cards |
| **Visual issues** | Reads as default template, not real campaign |
| **Premium score** | **6.0 / 10** |
| **Recommendation** | **Improve** in Sprint 2 banner system — image + copy split |

---

## 11. Verified Vendors

| Field | Assessment |
|-------|------------|
| **Current purpose** | Trust + shop discovery |
| **Strengths** | Verified badge visible; two-tier featured + browse structure; vendor cards distinct from product cards |
| **Weaknesses** | **Same vendor (YEBONE) repeated** across featured + browse — looks like bug; gray banner placeholders in vendor cards; subtitle exposes implementation (“four at a time on mobile”); two SectionTitles in one section feels long |
| **Visual issues** | Placeholder shop banners; low visual variety |
| **Spacing issues** | Featured grid + browse rail = heavy section |
| **Typography issues** | “Top rated · 20 products” OK |
| **Hierarchy issues** | Correctly after products — trust timing improved |
| **Conversion issues** | Repetition reduces discovery value |
| **Trust issues** | One shop repeated undermines “marketplace of vendors” narrative |
| **Mobile issues** | Swipe rail affordance unclear |
| **Desktop issues** | Featured 3-col OK |
| **Premium score** | **6.0 / 10** |
| **Recommendation** | **Improve** — dedupe vendors, real shop imagery, remove dev copy |

---

## 12. YEBO Intelligence (Merged AI Band)

| Field | Assessment |
|-------|------------|
| **Current purpose** | Single AI entry — search, try-on, recommendations, panel CTA |
| **Strengths** | **Major Sprint 1 win** — one band vs four sections; AISearch interactive; quick prompts useful; layout clean on desktop |
| **Weaknesses** | Readonly search input feels non-functional; “Powered by YIP” is internal jargon; duplicate AI/search story vs header sparkle; gold badge + green badge + glass = badge stacking |
| **Visual issues** | Highlight cards slightly generic; prompt chips use same style as product tabs |
| **Spacing issues** | Well balanced — compact section works |
| **Typography issues** | Title clear; microcopy too technical |
| **Hierarchy issues** | Correctly late — differentiation after inventory |
| **Conversion issues** | Opens panel — good; “See picks →” jumps to #discover-products (OK) |
| **Trust issues** | “YIP” means nothing to shoppers |
| **Mobile issues** | Stacks cleanly; Open YEBO button full-width would help |
| **Desktop issues** | Two-column layout polished |
| **Premium score** | **7.0 / 10** |
| **Recommendation** | **Keep** + **Improve** copy, reduce badges, make search feel live |

---

## 13. Events

| Field | Assessment |
|-------|------------|
| **Current purpose** | Promote events vertical |
| **Strengths** | Reduced height post–Sprint 1; CTA to `/events`; mosaic concept distinctive |
| **Weaknesses** | Desktop banner **decorative chips without dates/venues/photos**; mobile switches to different component (`HomeEventsSection`) — inconsistent; “Register as vendor” CTA may wrong intent (vs “Browse events”) |
| **Visual issues** | Floating labeled chips feel like wireframe; background orbs add noise without content |
| **Spacing issues** | Improved height; still large for low information density |
| **Typography issues** | Title strong; chip labels tiny (11px) |
| **Hierarchy issues** | OK placement post-vendors |
| **Conversion issues** | Low — no event to click |
| **Trust issues** | Decorative events feel fabricated |
| **Mobile issues** | Different UX path >900px vs ≤900px |
| **Desktop issues** | Mosaic pretty but hollow |
| **Premium score** | **5.5 / 10** |
| **Recommendation** | **Improve** — real event cards with photo, date, price; unify responsive component |

---

## 14. Trust / Feature Strip

| Field | Assessment |
|-------|------------|
| **Current purpose** | Secure payments, delivery, AI try-on, returns, verified vendors |
| **Strengths** | **Correct timing post–Sprint 1** (after products); scannable icons; compact `--tight` section |
| **Weaknesses** | Claims without proof links; 2+2+1 wrap awkward on mobile; duplicates vendor section message |
| **Visual issues** | Light band — fine; icons consistent |
| **Spacing issues** | Good — tight |
| **Typography issues** | Small desc text OK |
| **Hierarchy issues** | Appropriate secondary band |
| **Conversion issues** | Low direct impact |
| **Trust issues** | Generic claims — Stripe would link to docs/status |
| **Premium score** | **6.5 / 10** |
| **Recommendation** | **Keep** + **Improve** — link to policies; reduce to 3 pillars |

---

## 15. Newsletter

| Field | Assessment |
|-------|------------|
| **Current purpose** | Email capture |
| **Strengths** | Glass card premium treatment; single field; privacy microcopy |
| **Weaknesses** | **Gold subscribe button breaks primary green CTA system**; no incentive; backend still not wired (toast only); `--emphasis` padding still heavy |
| **Visual issues** | Gradient card nice; button color inconsistent with rest of page |
| **Spacing issues** | Large section for one input |
| **Typography issues** | Heading good |
| **Conversion issues** | Weak value prop |
| **Trust issues** | Submit without real backend — user may discover on retry |
| **Premium score** | **6.0 / 10** |
| **Recommendation** | **Improve** — align button to design system; wire backend or hide |

---

## 16. Footer

| Field | Assessment |
|-------|------------|
| **Current purpose** | Legal, support, shop links, brand |
| **Strengths** | Dark footer contrast good; accordion on mobile; four-column IA clear |
| **Weaknesses** | Social buttons non-linked placeholders; duplicate routes (`Press`/`Investors` → about); shop links repeat header |
| **Visual issues** | Clean, muted — appropriate |
| **Spacing issues** | Long on mobile with accordions — acceptable |
| **Premium score** | **7.0 / 10** |
| **Recommendation** | **Keep** + **Improve** social links |

---

# Homepage Holistic Evaluation

| Dimension | Assessment | Score |
|-----------|------------|-------|
| **Visual hierarchy** | Improved — products early; hero still dominates mobile fold | 7.0 |
| **Information hierarchy** | Logical post–Sprint 1; category/hub redundancy remains | 7.5 |
| **Consistency** | Product cards unified; category/vendor/event cards diverge | 6.5 |
| **Whitespace** | Better rhythm; still airy in hero/newsletter vs dense in AI chips | 7.0 |
| **Alignment** | Container alignment good; vendor placeholders misaligned visually | 7.5 |
| **Grid** | Product rail 5-col desktop OK; category 6-col vs product 5-col mismatch | 6.5 |
| **Cards** | ProductCard strong; category/vendor/event weak | 7.0 |
| **Buttons** | Primary green consistent except newsletter gold | 7.0 |
| **Badges** | Verified, Flash, AI gold — OK; too many badge types on page | 6.5 |
| **Animations** | Showcase float/pulse — decorative; no reduced-motion audit visible | 6.5 |
| **Scrolling** | ~40% lighter — still 8–10 viewports guest | 7.5 |
| **Reading flow** | Clear top-to-bottom story; hub/vendor/AI mid-page slows scan | 7.0 |
| **Conversion flow** | Products → categories → PDP path clear; flash empty breaks flow | 7.0 |
| **Marketplace discovery** | Products early ✓; property/mobility/events under-visualized | 6.5 |
| **Trust** | Verified vendors present; no reviews, repeated vendor, placeholder tiles hurt | 6.0 |
| **Professional appearance** | Above average startup; below tier-1 marketplace | 7.0 |
| **Premium feeling** | Hero/AI polished; categories/vendors/events drag perception | 6.5 |

---

# Quality Benchmark Question

**What is still preventing Yebone from feeling equally premium to Apple, Airbnb, Shopify, Stripe, or Linear?**

| Benchmark | Quality bar | Yebone gap |
|-----------|-------------|------------|
| **Apple** | One message, perfect spacing, no placeholders | Hero still competes with products on mobile; decorative UI without live proof |
| **Airbnb** | Photo-first discovery, trust through real listings | Property/events/vendors lack real imagery; category tiles often gray |
| **Shopify** | Storefront converts in one scroll; inventory is hero | Closer after Sprint 1 — but flash empty + review voids break storefront feel |
| **Stripe** | Every claim backed; no internal jargon | “YIP”, “four at a time on mobile”, E2E product names visible |
| **Linear** | Ruthless section budget; nothing repeated | Category nav ×3; vendor duplication; hub + categories overlap |

**Core answer:** Yebone has **premium surfaces** but not a **premium marketplace body**. Tier-1 products feel premium because every pixel proves real inventory, real sellers, and real outcomes. Yebone still shows too many placeholders, duplicates, and template blocks between excellent hero craft and the footer.

---

# TOP 20 REMAINING PREMIUM GAPS

| Rank | Description | Why it hurts UX | Why it hurts conversion | Business impact | Effort | Priority |
|------|-------------|-----------------|-------------------------|-----------------|--------|----------|
| **P1** | Header triple-nav + 12 category links | Cognitive overload before content | Delays product clicks | High bounce | Medium | **P1** |
| **P2** | Category grid gray placeholder tiles | Looks unfinished / beta | Reduces category CTR | Category GMV loss | Medium | **P1** |
| **P3** | “No reviews yet” on every product card | Trust void at point of decision | Low add-to-cart confidence | GMV | Low–Med | **P1** |
| **P4** | Flash Sale tab empty with no fallback | Broken promise on urgency tab | Wasted high-intent clicks | Flash GMV | Low | **P1** |
| **P5** | Same vendor repeated in vendor section | Looks broken; fake marketplace | Shop discovery useless | Vendor ad revenue | Low | **P1** |
| **P6** | Mobile hero consumes full viewport before products | Inventory not visible in 5 seconds | Mobile bounce | Mobile GMV | Medium | **P1** |
| **P7** | Events section decorative — no real events | Half-promise experiential vertical | Events vertical dead on homepage | Events GMV | Medium | **P2** |
| **P8** | Property/mobility link-only — no preview cards | Verticals invisible | Property/mobility leakage | Vertical GMV | Medium | **P2** |
| **P9** | Implementation copy in UI (“four at a time on mobile”, “YIP”) | Signals internal/beta product | Trust erosion | Brand | Low | **P2** |
| **P10** | Newsletter gold button + unwired backend | Design system break; broken submit | Email LTV loss | Marketing | Low–Med | **P2** |
| **P11** | Campaign banner generic teal block | Ad blindness | Campaign CTR low | Ad revenue | Med (S2) | **P2** |
| **P12** | Product rail horizontal scroll affordance weak | Users miss more products | Lower rail CTR | GMV | Low | **P2** |
| **P13** | Hub + category + header — triple category paths | Redundant wayfinding | Decision paralysis | Session depth | Medium | **P2** |
| **P14** | Vendor card gray banner placeholders | Cheapens trust section | Low shop visits | Vendor GMV | Medium | **P2** |
| **P15** | Auth Recently Viewed not in guest audit — guest vs auth parity | Inconsistent first impression | Returning user value hidden in capture | Retention | Done/S1 | **P3** |
| **P16** | AI search readonly — feels fake | Users expect typing | Low AI engagement | Differentiation | Low | **P3** |
| **P17** | Grid column mismatch (5 product vs 6 category) | Subtle visual rhythm break | None direct | Polish | Low | **P3** |
| **P18** | Footer social placeholders | Unfinished terminal trust | Low social proof | Brand | Low | **P3** |
| **P19** | Decorative animations without reduced-motion gate | A11y + motion sensitivity | N/A | Compliance | Low | **P3** |
| **P20** | E2E/test product names visible in hero showcase | Internal QA data public | Premium credibility hit | Brand | Low | **P3** |

---

# VISUAL SCORECARD

| Dimension | Score (0–10) | Notes |
|-----------|--------------|-------|
| **Visual Design** | **7.0** | Strong hero/AI; weak category/vendor/event finish |
| **Typography** | **7.0** | Hierarchy OK; too much 11px meta; Poppins/Roboto mix controlled |
| **Spacing** | **7.5** | Sprint 1 improvement real; newsletter/hero still heavy on mobile |
| **Hierarchy** | **7.5** | Products early; header/hero still compete on mobile |
| **Cards** | **6.5** | ProductCard good; category/vendor/event cards lag |
| **Buttons** | **7.0** | Primary system OK; newsletter gold outlier |
| **Marketplace Discovery** | **7.0** | Products fixed; verticals under-visualized |
| **Trust** | **6.0** | No reviews, vendor dup, placeholders, generic claims |
| **Mobile** | **6.5** | Long hero; dense header; good rail |
| **Desktop** | **7.5** | Best experience; wide grid balanced |
| **Animations** | **6.5** | Decorative; showcase strong; motion budget unclear |
| **Consistency** | **6.5** | Multiple card dialects; events desktop/mobile split |
| **Premium Feel** | **6.5** | Uneven — premium hero, mid-market body |
| **Accessibility** | **6.5** | Skip link, aria on rails; small text, motion concerns |
| **Overall Production Readiness** | **6.8** | Soft launch possible; worldwide launch not yet |

**Weighted overall visual QA score: 68 / 100**

---

# BEFORE SPRINT 2 CHECKLIST

Must address before Sprint 2 banner/merchandising work begins:

- [ ] **P1** — Hide or collapse header category strip on homepage
- [ ] **P1** — Fix category tile imagery (no gray placeholder grid at scale)
- [ ] **P1** — Hide product review row when `reviewCount === 0`
- [ ] **P1** — Hide Flash Sale tab when no active flash inventory
- [ ] **P1** — Deduplicate vendor section (unique shops only)
- [ ] **P1** — Remove implementation-facing copy from vendor subtitle
- [ ] **P1** — Guest mobile: reduce hero height or show product peek above fold
- [ ] **P2** — Replace events decorative mosaic with real event cards OR hide section
- [ ] **P2** — Align newsletter CTA to primary design system token
- [ ] **P2** — Replace “YIP” / internal microcopy in YEBO band
- [ ] **P2** — Add horizontal scroll peek/fade on product rails
- [ ] **Document** — Capture **authenticated** screenshot set (Recently Viewed + For You tab)

Sprint 2 can proceed in parallel on banner slots **only after** P1 trust/placeholder issues are scheduled — banners on a placeholder homepage amplify clutter without fixing credibility.

---

# Principal Designer Review — Brutally Honest

*If reviewers from Apple, Airbnb, Shopify, Stripe, and Linear opened this homepage today, they would say:*

**Apple design lead:** “Your hero is trying to be us. Your storefront is trying to be Alibaba. Pick marketplace — the hero is still eating the first screen on phone. Also: why are there three navigation rows before I see a product I can buy?”

**Airbnb design lead:** “I see links to property and events but no photos of a single listing or experience. Premium marketplaces show inventory, not paragraphs. Your category grid looks like a wireframe — gray boxes are an instant ‘not ready.’”

**Shopify design lead:** “Product rails moved up — good. But every card says ‘No reviews yet’ and Flash Sale is empty. That’s a store with no social proof and no deals. I wouldn’t checkout.”

**Stripe design lead:** “‘Powered by YIP’ and ‘four at a time on mobile’ — you shipped internal copy. ‘100% protected checkout’ with no link reads as marketing, not compliance. Trust isn’t icons — it’s verifiable.”

**Linear design lead:** “You reduced sections — good. Still too many bands with the same job: categories in header, categories in grid, categories in hub. Cut until each section has one job. The repeated YEBONE vendor card looks like a data bug, not curation.”

**Unified verdict:** Sprint 1 fixed **structure**. It did not fix **finish**. The homepage would pass an internal demo. It would not pass a worldwide launch review. The path to premium is not more design — it is **real data, deduplicated surfaces, and removing everything that looks like placeholder or QA leakage**.

---

# Screenshot Summary

| File | Viewport | Key observations |
|------|----------|------------------|
| `homepage-full-desktop-1920.png` | 1920×1080 | Full IA visible; 5-col product rail; wide category grid; campaign banner; vendor duplication clear |
| `homepage-full-desktop-1440.png` | 1440×900 | Primary audit reference; balanced container; hero + products in ~1.5 viewports |
| `homepage-full-laptop-1280.png` | 1280×800 | Header density highest; tabs + rail fit well |
| `homepage-full-tablet-768.png` | 768×1024 | 2-col categories; hub stacks; events mosaic compressed |
| `homepage-full-mobile-390.png` | 390×844 | Hero dominates fold; bottom nav + FAB; long scroll ~8–9 screens |
| `homepage-full-mobile-414.png` | 414×896 | Same as 390 with slightly wider rail peek |

---

*End of Visual QA Report. Documentation only — no implementation performed.*
