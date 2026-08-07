# Yebone Design System

**Version:** 1.0  
**Status:** Official — Single Source of Truth  
**Date:** 2026-08-06  
**Scope:** Entire Yebone platform — web, vendor portal, admin, messaging, checkout, and future native apps  
**Related documents:** [`HOMEPAGE_UX_AUDIT.md`](./HOMEPAGE_UX_AUDIT.md) · [`HOMEPAGE_IMPLEMENTATION_PLAN.md`](./HOMEPAGE_IMPLEMENTATION_PLAN.md)

---

## Document Purpose

This Design System defines the **permanent visual and UX foundation** of Yebone — a premium AI-powered multi-vertical marketplace spanning Shopping, Property, Mobility, Events, Auctions, and Flash Sales.

It is **not** a copy of Apple, Airbnb, Stripe, Shopify, Linear, or Notion. It synthesizes their best qualities into a **unique Yebone Design Language**:

| Influence | What Yebone adopts |
|-----------|-------------------|
| **Apple** | Spacing discipline, typography hierarchy, motion restraint, premium craft |
| **Airbnb** | Photo-first discovery, trust-after-proof, category exploration |
| **Stripe** | Consistency, form clarity, developer-grade token structure |
| **Shopify** | Marketplace patterns, collection rails, conversion-first layouts |
| **Linear** | Section budget, information density control, polish without noise |
| **Notion** | Simplicity, scannable content blocks, progressive disclosure |

**Rule:** No module may invent its own UI. Every page, portal, and future native screen must consume this system.

---

# 1. Design Principles

## 1.1 Clarity

Every screen answers one primary question within five seconds. Headlines state outcomes, not features. Labels are plain language. Icons always pair with text on first exposure. AI capabilities are explained concretely (“Find your size in 10 seconds”), never vaguely (“The future of commerce”).

**Application:** One primary CTA per viewport. Section titles describe user benefit. No competing “Trending” labels on the same page.

---

## 1.2 Consistency

One button system. One card system. One spacing scale. One typography hierarchy. Users learn Yebone once and navigate every vertical with zero re-learning.

**Application:** Product cards in browse, search, homepage rails, and vendor shops use the same component spec. Admin tables and customer lists share the same data presentation patterns.

---

## 1.3 Premium Feel

Premium is **restraint**, not decoration. Generous whitespace, confident typography, subtle shadows, and purposeful motion. Glass effects and gradients are accent tools — never default backgrounds.

**Application:** Maximum three promotional banners per page. No placeholder UI in production. No stat rows without verifiable data.

---

## 1.4 Speed

Speed is perceived and actual. Skeleton states appear instantly. Images lazy-load. Animations stay under 300ms for interactions. Pages feel lightweight — section budgets enforced (homepage ≤ 11 sections).

**Application:** Product grids render skeleton cards before data. No animation blocks input. Infinite scroll prefetches next page at 80% scroll.

---

## 1.5 Trust

Trust follows proof. Show products before trust claims. Verified badges only when verified. Sponsored content always labeled. Reviews link to real entities. Broken forms never ship.

**Application:** Verified vendor badge requires `isVerified === true`. Testimonials require API-backed reviews or are hidden. Newsletter must be functional or absent.

---

## 1.6 Accessibility

WCAG 2.1 AA minimum. Keyboard navigable. Screen reader tested. Touch targets ≥ 44×44px. Motion respects `prefers-reduced-motion`. Color never carries meaning alone.

**Application:** Focus rings on all interactive elements. ARIA labels on icon-only buttons. Contrast ratio ≥ 4.5:1 for body text.

---

## 1.7 Conversion-First

Marketplace screens optimize for discovery → consideration → transaction. Inventory appears early. CTAs repeat at predictable intervals. Personalization serves returning users first.

**Application:** Homepage product rails within first scroll. Auth users see “Continue browsing” above the fold. Checkout never introduces new visual patterns.

---

## 1.8 Mobile-First

Design for 390px first. Thumb-reachable primary actions. Bottom navigation for core paths. Desktop adds density — never different IA.

**Application:** Mobile grid: 2 columns. Desktop grid: up to 5 columns. Same section order on all breakpoints (compressed, not reordered).

---

## 1.9 Human-Centered

Technology (AI, virtual try-on, smart search) serves human goals: find, compare, trust, buy. AI is one entry point, not four sections. Errors explain what happened and what to do next.

**Application:** YEBO panel for AI interaction. Homepage gets one AI band. Empty states include helpful CTAs, not dead ends.

---

# 2. Color System

## 2.1 Brand Palette

| Token | Hex | CSS Variable | Role |
|-------|-----|--------------|------|
| **Primary** | `#29625d` | `--yebone-primary` | Primary actions, links, focus rings, brand accent |
| **Primary Dark** | `#1a4c47` | `--yebone-primary-dark` | Hover/pressed states, gradient endpoints |
| **Secondary** | `#1a4c47` | `--yebone-secondary` | Secondary brand surfaces, nav active states |
| **Accent (Gold)** | `#fed592` | `--yebone-accent` | Highlights, premium badges, AI indicators, decorative accents |
| **White** | `#ffffff` | `--yebone-white` | Card backgrounds, button text on primary |
| **Background** | `#F6F6F5` | `--yebone-bg` | Page background, app shell |
| **Foreground** | `#313131` | `--yebone-fg` | Primary text |

## 2.2 Semantic Colors

| Token | Hex | CSS Variable | When to Use |
|-------|-----|--------------|-------------|
| **Success** | `#15803d` | `--yebone-success` | Order confirmed, payment success, verification complete, positive trends |
| **Success Background** | `rgba(21,128,61,0.12)` | `--yebone-success-bg` | Success alert backgrounds, inline confirmation banners |
| **Warning** | `#b45309` | `--yebone-warning` | Low stock, expiring offers, pending review, non-blocking alerts |
| **Warning Background** | `rgba(180,83,9,0.12)` | `--yebone-warning-bg` | Warning alert backgrounds |
| **Danger** | `#b91c1c` | `--yebone-error` | Errors, destructive actions, failed payments, form validation |
| **Danger Background** | `rgba(185,28,28,0.12)` | `--yebone-error-bg` | Error alert backgrounds, invalid field highlights |
| **Info** | `#2563eb` | `--yebone-info` | Informational notices, tips, neutral system messages |
| **Info Background** | `rgba(37,99,235,0.12)` | `--yebone-info-bg` | Info alert backgrounds |

## 2.3 Surface & Structure Colors

| Token | Value | When to Use |
|-------|-------|-------------|
| **Surface 0** | `#ffffff` | Cards, modals, dropdowns, input backgrounds |
| **Surface 1** | `#F6F6F5` | Alternating section bands, page background |
| **Surface 2** | `#EEEDEC` | Nested containers, sidebar backgrounds |
| **Surface 3** | `#E5E4E3` | Disabled containers, dividers |
| **Border** | `#e5e7eb` | Card borders, input borders, dividers |
| **Border Strong** | `rgba(41,98,93,0.15)` | Emphasized card borders, marketplace product cards |
| **Muted** | `#6b7280` | Secondary text, placeholders, meta labels |
| **Muted Foreground** | `#9ca3af` | Disabled text, timestamps, tertiary info |
| **Overlay** | `rgba(0,0,0,0.50)` | Modal backdrop, drawer scrim |
| **Overlay Light** | `rgba(0,0,0,0.25)` | Non-blocking overlays, image gradients |

## 2.4 Text Colors

| Token | Value | When to Use |
|-------|-------|-------------|
| **Text Primary** | `#313131` | Headlines, body, prices, primary content |
| **Text Secondary** | `#6b7280` | Subtitles, descriptions, meta, captions |
| **Text Disabled** | `#d1d5db` | Disabled buttons, inactive tabs, unavailable options |
| **Text Inverse** | `#ffffff` | Text on primary buttons, dark banners, hero overlays |
| **Text Link** | `#29625d` | Inline links, text CTAs |
| **Text Link Hover** | `#1a4c47` | Link hover state |

## 2.5 Dark Mode (Future)

Dark mode is **planned** — tokens are reserved now to prevent redesign.

| Light Token | Dark Equivalent |
|-------------|-----------------|
| Background `#F6F6F5` | `#0f0f0f` |
| Surface 0 `#ffffff` | `#1a1a1a` |
| Surface 1 | `#141414` |
| Text Primary `#313131` | `#f5f5f5` |
| Text Secondary | `#a3a3a3` |
| Border | `rgba(255,255,255,0.08)` |
| Primary | `#3d8a82` (lightened for contrast) |
| Accent Gold | `#fed592` (unchanged — brand anchor) |

**Rule:** Never hardcode light-only colors in components. Always reference tokens.

## 2.6 Color Usage Rules

1. **Primary green** — buttons, active nav, links, focus rings. Never for large background fills except hero/campaign banners.
2. **Gold accent** — badges, AI indicators, premium highlights. Never for body text.
3. **Semantic colors** — status only. Never for decoration.
4. **Maximum two brand colors per component** — primary + accent OR primary + neutral.
5. **Gradients** — hero, campaign banners, AI showcase only. Not on cards or forms.
6. **Organization branding** — `BrandEngine` may override `--yebone-primary` and `--yebone-accent` for white-label vendors; semantic colors are fixed.

---

# 3. Typography System

## 3.1 Font Families

| Role | Family | Fallback | Usage |
|------|--------|----------|-------|
| **Display / Headings** | Poppins | sans-serif | H1–H4, hero, section titles, button text, prices |
| **Body / UI** | Roboto | sans-serif | Body, labels, captions, form text, table data |

**Rule:** Poppins for emphasis and hierarchy. Roboto for reading comfort. Never introduce a third font without design system approval.

## 3.2 Type Scale

| Token | Size | Line Height | Weight | Letter Spacing | Usage |
|-------|------|-------------|--------|----------------|-------|
| **Display** | 48–60px (responsive) | 1.1 | 700 | -0.02em | Hero headlines only — max one per page |
| **H1** | 36px / 2.25rem | 1.2 | 700 | -0.02em | Page titles (Product detail, Checkout, Dashboard home) |
| **H2** | 30px / 1.875rem | 1.25 | 600 | -0.01em | Section titles (“Trending Products”, “Shop by Category”) |
| **H3** | 24px / 1.5rem | 1.3 | 600 | 0 | Card group titles, modal titles, tab panel headers |
| **H4** | 20px / 1.25rem | 1.35 | 600 | 0 | Subsection titles, vendor shop names |
| **Body Large** | 18px / 1.125rem | 1.5 | 400 | 0 | Lead paragraphs, product descriptions (short) |
| **Body** | 16px / 1rem | 1.5 | 400 | 0 | Default body text, form inputs |
| **Small** | 14px / 0.875rem | 1.5 | 400 | 0 | Secondary descriptions, helper text |
| **Caption** | 12px / 0.75rem | 1.4 | 400 | 0.01em | Timestamps, meta, legal microcopy |
| **Button** | 14px / 0.875rem | 1 | 600 | 0.02em | All button labels |
| **Badge** | 11px / 0.6875rem | 1 | 600 | 0.04em | Status badges, promo labels — uppercase optional |
| **Price** | 14–16px | 1.2 | 700 | -0.02em | Product prices — tabular nums |
| **Price Large** | 24–30px | 1.1 | 700 | -0.02em | Product detail primary price |
| **Meta** | 11–12px | 1.3 | 500 | 0.02em | “X sold”, location, date — uppercase labels sparingly |

## 3.3 Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body, descriptions |
| Medium | 500 | Labels, meta, nav items |
| Semibold | 600 | Headings, buttons, card titles, badges |
| Bold | 700 | Display, prices, emphasis |

**Rule:** Never use more than two weights in one component. Never use semibold below 12px — use medium instead.

## 3.4 Hierarchy Rules

1. **One Display per page** — hero or landing moment only.
2. **Heading levels are semantic** — do not skip levels (H1 → H2 → H3).
3. **Section titles use H2** — consistent via `SectionTitle` component pattern.
4. **Card titles use H3 visually** — may render as `<h3>` or styled `<p>` depending on outline.
5. **Uniform emphasis = no emphasis** — if everything is semibold, nothing stands out.
6. **Minimum readable size** — 12px floor; 11px only for badges/meta with medium weight minimum.
7. **Line length** — body text max 65 characters per line on desktop; use container constraints.

---

# 4. 8pt Spacing System

All spacing derives from an **8px base unit**. Only the tokens below are permitted — no arbitrary values (e.g., `13px`, `22px`).

| Token | Value | Usage |
|-------|-------|-------|
| **space-1** | 4px | Icon-to-text gap, badge internal padding, tight inline spacing |
| **space-2** | 8px | Compact stack gap, chip padding, form field internal gap |
| **space-3** | 12px | Card body internal gap, list item padding, small button vertical padding |
| **space-4** | 16px | Default stack gap, card padding (mobile), grid gap (mobile), input padding |
| **space-5** | 20px | Medium component padding, rail peek offset |
| **space-6** | 24px | Card padding (desktop), section internal gap, grid gap (tablet) |
| **space-8** | 32px | Section title to content gap, large stack gap, grid gap (desktop) |
| **space-10** | 40px | Section padding (mobile), icon button size minimum |
| **space-12** | 48px | Section padding (tablet), hero internal gap |
| **space-16** | 64px | Section padding (desktop), major section breaks |
| **space-20** | 80px | Hero vertical padding (desktop, compact) |
| **space-24** | 96px | Hero vertical padding (desktop, full — use sparingly) |

## 4.1 Spacing Application Map

| Context | Token |
|---------|-------|
| Page horizontal margin (mobile) | space-4 (16px) |
| Page horizontal margin (tablet+) | space-6 (24px) |
| Between form fields | space-4 (16px) |
| Between form groups | space-6 (24px) |
| Card internal padding (mobile) | space-4 (16px) |
| Card internal padding (desktop) | space-6 (24px) |
| Section vertical padding (tight) | space-8 (32px) |
| Section vertical padding (default) | space-12–space-16 (48–64px) |
| Section vertical padding (emphasis) | space-16 (64px) max |
| Grid gap (product cards, mobile) | space-3–space-4 (12–16px) |
| Grid gap (product cards, desktop) | space-4–space-6 (16–24px) |
| Header height internal padding | space-3–space-4 (12–16px) |
| Bottom nav height | 56px (7 × 8pt) |
| Modal padding | space-6–space-8 (24–32px) |
| Toast margin from edge | space-4 (16px) |

**Rule:** If a design requires spacing not in this scale, round to the nearest token and document the exception.

---

# 5. Grid System

## 5.1 Breakpoints

| Name | Min Width | Target Devices |
|------|-----------|----------------|
| **Mobile S** | 390px | iPhone 14, standard mobile |
| **Mobile L** | 414px | iPhone Plus, large phones |
| **Tablet** | 768px | iPad portrait, small tablets |
| **Laptop** | 1024px | iPad landscape, small laptops |
| **Desktop** | 1280px | Standard desktop |
| **Desktop L** | 1440px | Large monitors |
| **Wide** | 1920px | Full HD, ultra-wide |

## 5.2 Container

| Breakpoint | Max Width | Horizontal Padding |
|------------|-----------|-------------------|
| Mobile | 100% | 16px |
| Tablet | 100% | 24px |
| Laptop+ | 1280px | 32px |
| Wide | 1440px | 32px |

Content never spans edge-to-edge beyond 1440px — center with auto margins.

## 5.3 Column Grid

| Breakpoint | Columns | Gutter | Product Grid Cols | Category Grid Cols |
|------------|---------|--------|-------------------|-------------------|
| 390px | 4 | 12px | 2 | 2 |
| 414px | 4 | 12px | 2 | 2 |
| 768px | 8 | 16px | 3 | 3 |
| 1024px | 12 | 24px | 3–4 | 4 |
| 1280px | 12 | 24px | 4 | 4–6 |
| 1440px | 12 | 24px | 4–5 | 6 |
| 1920px | 12 | 32px | 5 | 6 |

## 5.4 Section Spacing

| Section Type | Vertical Padding |
|--------------|------------------|
| Tight (trust strip, announcement) | 32px |
| Default (product rails, categories) | 48–64px |
| Emphasis (newsletter, AI band) | 64px max |
| Hero (compact) | 64–80px |
| Hero (full — homepage only) | 80–96px max |

## 5.5 Card Spacing in Grids

- **Product cards:** 12px gap mobile, 16px tablet, 16–24px desktop.
- **Vendor cards:** 16px gap all breakpoints.
- **Property/Mobility cards:** 16px mobile, 24px desktop — photo-first, taller cards.
- **Horizontal rails:** Fixed card width with 16px gap; show 16px peek of next card for scroll affordance.

---

# 6. Radius System

| Token | Value | Usage |
|-------|-------|-------|
| **radius-none** | 0 | Tables, full-bleed images |
| **radius-sm** | 6px / 0.375rem | Chips, small badges, inline tags |
| **radius-md** | 8px / 0.5rem | Inputs, buttons (small), thumbnails |
| **radius-lg** | 12px / 0.75rem | Product cards, category cards, dropdowns |
| **radius-xl** | 16px / 1rem | Cards, modals, panels, large buttons |
| **radius-2xl** | 20px / 1.25rem | Feature cards, hero inner panels, glass surfaces |
| **radius-3xl** | 24px | Hero banners, campaign banners |
| **radius-full** | 9999px | Avatars, pills, toggle switches, circular icon buttons |

## 6.1 Component Radius Map

| Component | Radius |
|-----------|--------|
| Buttons | radius-xl (16px) |
| Product cards | radius-lg (12px) |
| Property/Mobility cards | radius-xl (16px) |
| Inputs | radius-xl (16px) |
| Dialogs / Modals | radius-2xl (20px) |
| Badges | radius-full |
| Images in cards | radius-lg top; match card radius |
| Hero banners | radius-3xl (24px) |
| Toast | radius-lg (12px) |
| Bottom sheet | radius-2xl top corners only |

---

# 7. Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| **shadow-none** | none | Flat lists, inline elements |
| **shadow-sm** | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift — inputs at rest, chips |
| **shadow-md** | `0 4px 12px rgba(41,98,93,0.08)` | Default cards, dropdowns — `shadow-yebo` |
| **shadow-lg** | `0 10px 25px rgba(41,98,93,0.12)` | Modals, elevated panels — `shadow-yebo-lg` |
| **shadow-xl** | `0 20px 40px rgba(41,98,93,0.15)` | Floating elements, hero showcase |
| **shadow-hover** | `0 12px 36px -10px rgba(41,98,93,0.18)` | Product card hover |
| **shadow-gold** | `0 4px 14px rgba(254,213,146,0.25)` | Premium/AI accent glow — sparingly |
| **shadow-sticky** | `0 2px 8px rgba(0,0,0,0.06)` | Sticky header, bottom nav |
| **shadow-modal** | `0 24px 48px rgba(0,0,0,0.16)` | Modal content on overlay |
| **shadow-dropdown** | `0 8px 24px rgba(0,0,0,0.10)` | Search overlay, mega menu, popover |

## 7.1 Shadow Rules

1. Cards at rest use **shadow-md** — never shadow-lg.
2. Hover adds **shadow-hover** + 4px translateY — via `yebone-card-lift`.
3. Modals use **shadow-modal** on content; **overlay** handles backdrop.
4. Dark mode increases shadow opacity — same tokens, adjusted alpha.
5. Never stack multiple shadow levels on one element.

---

# 8. Button System

## 8.1 Variants

| Variant | Background | Text | Border | When to Use |
|---------|------------|------|--------|-------------|
| **Primary** | Primary green | White | None | Main action — one per viewport (Add to cart, Checkout, Publish) |
| **Secondary** | Surface 0 / gray-100 | Text primary | 1px border | Alternative actions (Save draft, View details) |
| **Outline** | Transparent | Primary green | 2px primary | Tertiary emphasis (Learn more, Filter) |
| **Ghost** | Transparent | Text primary | None | Inline actions, nav, cancel, low emphasis |
| **Danger** | Danger red | White | None | Destructive (Delete, Cancel order, Remove) |
| **Success** | Success green | White | None | Confirm completion (Mark delivered, Approve) |
| **Link** | Transparent | Primary green | None | Inline text actions, “View all”, breadcrumbs |

## 8.2 Sizes

| Size | Height | Horizontal Padding | Font Size | Icon Size | Usage |
|------|--------|-------------------|-----------|-----------|-------|
| **Small** | 32px | 12px | 12px | 16px | Tables, compact toolbars, chips |
| **Medium** | 40px | 16px | 14px | 20px | Default — forms, cards, modals |
| **Large** | 48px | 24px | 16px | 24px | Hero CTAs, checkout primary, mobile full-width |

## 8.3 Icon Button

| Size | Dimensions | Icon | Usage |
|------|------------|------|-------|
| Small | 32×32px | 16px | Inline actions, table rows |
| Medium | 40×40px | 20px | Header actions, card overlays |
| Large | 48×48px | 24px | FAB, primary mobile actions |

**Rule:** Icon buttons always require `aria-label`. Tooltip on desktop for first exposure.

## 8.4 FAB (Floating Action Button)

- Size: 56×56px
- Position: bottom-right, 16px from edge; above bottom nav on mobile (72px from bottom)
- Variant: Primary only
- Usage: Create listing (vendor), Compose message — max one FAB per screen

## 8.5 States

| State | Behavior |
|-------|----------|
| **Default** | Base variant styling |
| **Hover** | Primary → primary-dark; lift 1px (`yebone-btn-lift`); shadow-md |
| **Pressed / Active** | scale(0.98); primary-dark background |
| **Focus** | 2px focus ring, primary at 40% opacity, 2px offset |
| **Disabled** | 50% opacity; cursor not-allowed; no hover |
| **Loading** | Spinner 16px inline; label remains; disabled interaction |

## 8.6 Button Rules

1. One primary button per viewport/ modal.
2. Destructive actions use Danger variant — never Primary.
3. Full-width buttons on mobile for primary checkout/auth actions.
4. Button text is verb-first: “Add to cart”, not “Cart”.
5. No custom button styling outside this system.

---

# 9. Card System

One card language across all verticals. Cards share: radius-lg, shadow-md, hover lift, consistent internal spacing.

## 9.1 Product Card

| Property | Specification |
|----------|---------------|
| **Image ratio** | 4:5 (marketplace); 1:1 (compact/grid alternate) |
| **Image fit** | cover |
| **Border** | 1px border-strong |
| **Radius** | radius-lg (12px) |
| **Padding (body)** | 10–12px |
| **Title** | 13px semibold, 2-line clamp, H3 semantic |
| **Price** | 14px bold, primary color, tabular nums |
| **Old price** | 12px, muted, line-through |
| **Ratings** | Stars + count; hidden when count = 0 |
| **Verified badge** | 11px, primary, icon + “Verified” |
| **Sold count** | 11px meta |
| **Promo badge** | Top-left overlay, radius-sm, max 1 badge |
| **Wishlist** | Top-right, 40×40px tap target |
| **Hover (desktop)** | lift 4px, reveal cart + quick view actions |
| **Mobile** | No hover; wishlist always visible; tap → product detail |
| **CTA** | Implicit (card tap); optional quick-add on hover |
| **Flash variant** | Same card + countdown badge top-right + “Flash Sale” badge top-left |
| **Sold out** | Dimmed image + overlay label |

## 9.2 Property Card

| Property | Specification |
|----------|---------------|
| **Image ratio** | 16:10 or 3:2 — photo-first |
| **Height** | Taller than product — image 60% of card |
| **Title** | H4 — property name / address line 1 |
| **Subtitle** | Small — neighborhood, city |
| **Price** | Price Large — “RWF X / month” or sale price |
| **Meta chips** | Beds · Baths · m² — chip row below price |
| **Badges** | Verified agent, Featured, New listing |
| **Hover** | Image scale 1.04, lift |

## 9.3 Mobility Card

| Property | Specification |
|----------|---------------|
| **Image ratio** | 16:10 |
| **Title** | H4 — Make Model Year |
| **Subtitle** | Mileage · Fuel · Transmission |
| **Price** | Price Large |
| **Badges** | Verified dealer, Certified |
| **Meta** | Location chip |

## 9.4 Event Card

| Property | Specification |
|----------|---------------|
| **Image ratio** | 16:9 |
| **Title** | H4 — event name |
| **Subtitle** | Date · Venue · City |
| **Price** | From RWF X / Free |
| **Badges** | Live, Upcoming, Sold out |
| **CTA** | “Get tickets” ghost link |

## 9.5 Auction Card

| Property | Specification |
|----------|---------------|
| **Extends** | Product or Mobility card base |
| **Badges** | “Auction”, “Live”, “Ending soon” |
| **Price** | Current bid (not discount price) |
| **Meta** | Countdown timer, bid count |
| **CTA** | “Place bid” |

## 9.6 Flash Sale Card

**Uses Product Card with flash variant** — not a separate card dialect.

- Countdown badge (top-right)
- “Flash Sale” promo badge (top-left)
- Flash price in primary color
- Stock urgency: “X left” meta

## 9.7 Vendor Card

| Property | Specification |
|----------|---------------|
| **Image ratio** | 1:1 avatar/shop logo + 3 product preview thumbnails |
| **Title** | H4 — shop name |
| **Subtitle** | Category · product count |
| **Badges** | Verified, Premium, Featured |
| **Meta** | Rating + review count |
| **CTA** | “Visit shop” |

## 9.8 Collection Card

| Property | Specification |
|----------|---------------|
| **Image ratio** | 4:3 or 1:1 |
| **Title** | H3 — collection name |
| **Subtitle** | Product count |
| **Overlay** | Gradient bottom for text legibility |

## 9.9 Category Card

| Property | Specification |
|----------|---------------|
| **Image ratio** | 1:1 |
| **Size** | Smaller than product — grid tile |
| **Title** | H4 centered or below image |
| **Optional** | Item count subtitle |

## 9.10 AI Card

| Property | Specification |
|----------|---------------|
| **Usage** | YEBO suggestions, insight cards — not product cards |
| **Radius** | radius-2xl |
| **Background** | Surface 0 with primary/5 tint OR glass |
| **Icon** | 36×36px primary/10 background |
| **Title** | H4 |
| **Body** | Small |
| **Max density** | 3 AI cards per row desktop; 1–2 mobile |

## 9.11 News / Content Card

| Property | Specification |
|----------|---------------|
| **Image ratio** | 16:9 |
| **Title** | H4, 2-line clamp |
| **Meta** | Date · source |
| **Usage** | Blog, vendor announcements — not homepage primary |

## 9.12 Banner Card

See §12 Banner System — banners are not cards but share radius and shadow tokens.

## 9.13 Loading Skeleton Card

| Property | Specification |
|----------|---------------|
| **Animation** | Shimmer gradient, 1.8s loop |
| **Shape** | Matches target card proportions |
| **Colors** | Primary/6% → accent/14% → primary/6% |
| **Reduced motion** | Static muted fill, no shimmer |

---

# 10. Form System

## 10.1 Input Anatomy

Every form field includes: Label → Input → Helper text OR Error message.

| Element | Specification |
|---------|---------------|
| **Label** | Small, medium weight, above field, 8px gap |
| **Required indicator** | Red asterisk after label |
| **Input height** | 40px (medium), 48px (large) |
| **Input padding** | 16px horizontal |
| **Input radius** | radius-xl (16px) |
| **Input border** | 1px border; 2px primary on focus |
| **Placeholder** | Muted foreground, never as sole label |

## 10.2 Input Types

| Type | Height | Notes |
|------|--------|-------|
| Text | 40px | Default |
| Textarea | Min 96px | Resizable vertical only |
| Select / Dropdown | 40px | Chevron icon right |
| Search | 40–48px | Search icon left; clear button when filled |
| Date Picker | 40px | Calendar icon; native or custom picker |
| Checkbox | 20×20px | 44×44px tap target with label |
| Radio | 20×20px | 44×44px tap target with label |
| Toggle | 40×20px track | Primary when on |
| Segmented Control | 40px | Mutually exclusive options; radius-xl container |

## 10.3 Validation States

| State | Border | Message | Icon |
|-------|--------|---------|------|
| **Default** | Border | Helper text (optional), muted | None |
| **Focus** | 2px primary | — | — |
| **Error** | 2px danger | Error message below, danger color, role="alert" | Error icon optional |
| **Success** | 1px success | Success helper (optional) | Check icon optional |
| **Disabled** | Border muted | Text disabled | — |

## 10.4 Form Layout Rules

1. Single column on mobile — always.
2. Two columns on desktop only for short related fields (City + Postal).
3. Submit button full-width on mobile; right-aligned on desktop.
4. Inline validation on blur; submit validation on submit.
5. Error summary at top of long forms (checkout, vendor onboarding).

---

# 11. Navigation System

## 11.1 Header (Global)

| Property | Specification |
|----------|---------------|
| **Height** | 56px mobile, 64px desktop (+ optional 40px category strip) |
| **Background** | Surface 0, shadow-sticky on scroll |
| **Layout** | Logo left · Search center (60% desktop) · Actions right |
| **Actions max** | 5 visible icons mobile, 7 desktop |
| **Search** | Primary element — unified across verticals |
| **Z-index** | 1100 (sticky) |

## 11.2 Bottom Navigation (Mobile)

| Property | Specification |
|----------|---------------|
| **Height** | 56px + safe area |
| **Items** | 4–5 max: Home · Search/Shop · Cart · Messages · Profile |
| **Active state** | Primary color icon + label |
| **Z-index** | 1100 |
| **Visibility** | Mobile/tablet only; hidden ≥1024px |

## 11.3 Sidebar (Dashboard)

| Property | Specification |
|----------|---------------|
| **Width** | 280px expanded, 64px collapsed |
| **Usage** | Vendor dashboard, admin dashboard, settings |
| **Background** | Surface 0 or Surface 1 |
| **Items** | Icon + label; grouped sections with 24px gap |

## 11.4 Breadcrumb

- Body small, muted
- Separator: `/` or chevron
- Current page: text primary, not linked
- Max 4 levels visible; truncate middle on mobile

## 11.5 Tabs

| Property | Specification |
|----------|---------------|
| **Height** | 40px |
| **Active indicator** | 2px bottom border, primary |
| **Overflow** | Horizontal scroll on mobile with peek |
| **Max tabs** | 5 per tab bar — consolidate if more needed |

## 11.6 Mega Menu

- Trigger: header category nav
- Width: full container
- Layout: 3–4 columns of links + featured image
- Close: click outside, Escape key
- Animation: fade 150ms

## 11.7 Search Overlay

- Full-width dropdown below search input
- Sections: Recent · Trending · Suggestions
- Keyboard: arrow navigation, Enter to select
- Z-index: 1000

## 11.8 Drawer

| Property | Specification |
|----------|---------------|
| **Width** | 320px mobile, 384px desktop |
| **Side** | Right default; left for filters |
| **Scrim** | Overlay 50% |
| **Z-index** | 1300 |
| **Usage** | Filters, YEBO panel, mobile nav |

---

# 12. Banner System

Admin-controlled promotional slots. **Revenue without clutter.**

## 12.1 Global Banner Rules

| Rule | Value |
|------|-------|
| **Max banners per page** | **3** (announcement + hero + 1 inline) |
| **Max combined banner height** | 35% of viewport |
| **Max auto-rotating banners** | 1 (hero slot) |
| **Frequency cap** | Same campaign max 1× per session per slot |
| **Sponsored label** | Required on vendor/category sponsored banners |
| **Empty slot** | Collapses — zero height, no placeholder |
| **Priority resolution** | P0 Announcement → P1 Seasonal/Hero → P2 Campaign/Flash → P3 Category/Vendor → P4 Vertical |

## 12.2 Banner Types

### Hero Banner

| Attribute | Value |
|-----------|-------|
| **Purpose** | Primary campaign spotlight |
| **Placement** | Below compact hero, above product rails |
| **Desktop** | Full container × 120–320px |
| **Tablet** | Full width × 100–260px |
| **Mobile** | Full width × 88–220px |
| **Animation** | Optional fade carousel, 6s, max 3 slides, pause on hover |
| **Rotation** | Optional |
| **Dismiss** | No |
| **Priority** | P1 |
| **Revenue** | Very high — premium above-fold |

### Campaign Banner

| Attribute | Value |
|-----------|-------|
| **Purpose** | Mid-funnel category/vendor sale |
| **Placement** | After marketplace hub or between collections |
| **Desktop** | Full container × 96–160px |
| **Tablet** | Full width × 88–112px |
| **Mobile** | Full width × 80–96px |
| **Animation** | Subtle fade-in on scroll (optional) |
| **Dismiss** | No |
| **Priority** | P2 |
| **Revenue** | High |

### Flash Sale Banner

| Attribute | Value |
|-----------|-------|
| **Purpose** | Urgency countdown strip |
| **Placement** | Above flash sale tab/rail content |
| **Desktop** | Full width × 72–96px |
| **Tablet** | 64–88px |
| **Mobile** | 56–72px |
| **Animation** | Live countdown only — no decorative motion |
| **Dismiss** | No |
| **Priority** | P2 |
| **Revenue** | Very high |

### Vendor Banner (Sponsored)

| Attribute | Value |
|-----------|-------|
| **Purpose** | Paid vendor shop spotlight |
| **Placement** | Verified vendors section or inline |
| **Desktop** | 600×120px or featured vendor card |
| **Tablet** | Full width × 100px |
| **Mobile** | Full width × 88px |
| **Dismiss** | No |
| **Label** | “Sponsored” required |
| **Priority** | P3 |
| **Revenue** | High — vendor ad product |

### Property Banner

| Attribute | Value |
|-----------|-------|
| **Purpose** | Featured listings vertical |
| **Placement** | Marketplace hub Property tab |
| **Desktop** | 50/50 image + copy, 200px |
| **Mobile** | 160px stacked |
| **Priority** | P4 |
| **Revenue** | Medium — listing promotion |

### Mobility Banner

| Attribute | Value |
|-----------|-------|
| **Purpose** | Featured vehicles |
| **Placement** | Marketplace hub Mobility tab |
| **Sizes** | Same as Property |
| **Priority** | P4 |
| **Revenue** | Medium |

### Event Banner

| Attribute | Value |
|-----------|-------|
| **Purpose** | Upcoming events promotion |
| **Placement** | Events section / hub tab |
| **Desktop** | 3-card row × 280×160px each |
| **Mobile** | Horizontal scroll 260×140px |
| **Max height** | 180px |
| **Priority** | P4 |
| **Revenue** | Medium |

### Category Banner

| Attribute | Value |
|-----------|-------|
| **Purpose** | Category sponsor or seasonal category push |
| **Placement** | Adjacent to category grid |
| **Desktop** | 280×140px or full-width 112px strip |
| **Priority** | P3 |
| **Revenue** | Medium-high |

### Announcement Banner

| Attribute | Value |
|-----------|-------|
| **Purpose** | Platform notices (shipping, policy, downtime) |
| **Placement** | Above header — global |
| **Desktop/Mobile** | Full width × 40–48px |
| **Dismiss** | **Yes** — 7-day suppress |
| **Priority** | P0 — overrides all |
| **Revenue** | None |

### Holiday / Seasonal Banner

| Attribute | Value |
|-----------|-------|
| **Purpose** | Seasonal commerce moments |
| **Placement** | Hero slot during season |
| **Desktop** | Full width × 160–240px |
| **Mobile** | 120–160px |
| **Rotation** | Max 2 slides |
| **Auto-expire** | By campaign end date |
| **Priority** | P1 (during season) |
| **Revenue** | Very high |

## 12.3 Anti-Overload Checklist

- [ ] ≤ 3 banners active on homepage
- [ ] ≥ 1 product section between any two banners
- [ ] Sponsored content labeled
- [ ] No banner exceeds max height for breakpoint
- [ ] Announcement is only top-strip banner
- [ ] Admin dashboard shows homepage weight score warning at 4+ banners

---

# 13. Animation System

## 13.1 Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| **instant** | 0ms | Reduced motion fallback |
| **fast** | 150ms | Hover, focus, micro-interactions |
| **normal** | 300ms | Card lift, tab switch, drawer open |
| **slow** | 500ms | Page section fade-in, modal enter |
| **slower** | 800ms | Hero showcase decorative only |

## 13.2 Easing

| Token | Curve | Usage |
|-------|-------|-------|
| **default** | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| **in** | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting |
| **out** | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| **spring** | `cubic-bezier(0.22, 1, 0.36, 1)` | Card lift, button press |

## 13.3 Animation Map

| Context | Duration | Easing | Notes |
|---------|----------|--------|-------|
| Button hover | fast | default | Background + lift |
| Card hover | normal | spring | translateY(-4px) + shadow |
| Modal open | normal | out | Fade + scale 0.95→1 |
| Drawer slide | normal | out | translateX |
| Tab indicator | fast | spring | ScaleX |
| Toast enter | fast | out | Slide up + fade |
| Skeleton shimmer | 1800ms | ease-in-out | Disable with reduced motion |
| Page section enter | slow | out | Fade-up 20px — homepage only, max 3 sections |
| Image load | normal | default | Opacity 0→1 |
| Accordion | normal | default | Max-height + opacity |

## 13.4 Reduced Motion

When `prefers-reduced-motion: reduce`:
- All durations → **instant**
- Shimmer skeletons → static fill
- Parallax, float, pulse, scan animations → **disabled**
- Scroll-triggered animations → disabled
- Functional animations (drawer, modal) → opacity only, no slide

---

# 14. Icons

## 14.1 Icon Library

**Primary:** React Icons (outline default, filled for active states).  
**Rule:** One icon library per platform. Do not mix custom SVG styles without design review.

## 14.2 Sizes

| Token | Size | Usage |
|-------|------|-------|
| **xs** | 12px | Inline meta, badge icons |
| **sm** | 16px | Button icons (small), input icons |
| **md** | 20px | Default UI icons, header actions |
| **lg** | 24px | Feature icons, empty states |
| **xl** | 32px | Hero feature icons |
| **2xl** | 48px | Empty state illustrations (icon-only) |

## 14.3 Style Rules

| Context | Style |
|---------|-------|
| Navigation | Outlined default; filled when active |
| Actions (cart, wishlist) | Outlined default; filled on active/wishlisted |
| Status | Filled with semantic color |
| Marketplace categories | Filled gradient backgrounds with white icon |

## 14.4 Icon Categories

| Category | Examples |
|----------|----------|
| **Navigation** | Home, Search, Cart, Profile, Menu, Chevron |
| **Actions** | Add, Edit, Delete, Share, Filter, Sort |
| **Status** | Verified, Warning, Error, Success, Info |
| **Marketplace** | Product, Property, Vehicle, Event, Auction, Flash |
| **AI** | Sparkle, Camera (visual search), Chat |
| **Commerce** | Cart, Wishlist, Tag, Truck, Credit card |

**Rule:** Icon-only buttons always include `aria-label`. Pair with text on primary navigation.

---

# 15. Empty States

Every empty state follows: **Illustration/Icon → Title → Description → CTA**.

| State | Title | Description | CTA |
|-------|-------|-------------|-----|
| **No Products** | “No products yet” | “Check back soon or browse other categories.” | Browse marketplace |
| **No Property** | “No listings found” | “Try adjusting your filters or search area.” | Clear filters |
| **No Events** | “No upcoming events” | “Events will appear here when scheduled.” | Explore marketplace |
| **No Messages** | “No messages yet” | “When you contact a seller, conversations appear here.” | Start shopping |
| **No Orders** | “No orders yet” | “Your purchase history will show here.” | Start shopping |
| **No Notifications** | “All caught up” | “You have no new notifications.” | — |
| **No Search Results** | “No results for ‘{query}’” | “Try different keywords or check spelling.” | Browse categories |
| **No Wishlist** | “Your wishlist is empty” | “Save items you love to find them later.” | Discover products |
| **No Cart** | “Your cart is empty” | “Add items to get started.” | Continue shopping |

## 15.1 Empty State Spec

| Property | Value |
|----------|-------|
| **Layout** | Centered, max-width 400px |
| **Icon/Illustration** | 48–64px, muted or primary/10 background |
| **Title** | H3 |
| **Description** | Small, text secondary, max 2 lines |
| **CTA** | Primary or Outline button, single action |
| **Padding** | 64px vertical minimum |

---

# 16. Loading States

| Type | Usage | Specification |
|------|-------|---------------|
| **Skeleton** | Cards, lists, rails, product grids | Match target layout proportions; shimmer animation |
| **Spinner** | Buttons, inline refresh, small areas | 16px (button), 24px (section), 32px (page) |
| **Progress bar** | File upload, checkout steps, AI processing | 4px height, primary fill, determinate when possible |
| **Button loading** | Form submit, add to cart | Inline spinner + label preserved |
| **Infinite scroll** | Product lists, messages | Spinner 24px at list bottom; skeleton for initial load |
| **Lazy images** | All card images | `loading="lazy"`; opacity fade-in on load; skeleton placeholder |

## 16.1 Rules

1. Skeleton appears within **100ms** of load start.
2. Never show blank white space where content will appear.
3. Loading message optional — skeleton preferred for layout stability.
4. Page-level loading: skeleton grid, not full-page spinner (except auth redirect).

---

# 17. Toast System

| Variant | Background | Icon | Usage |
|---------|------------|------|-------|
| **Success** | Success green | Check | Item added, order placed, saved |
| **Warning** | Warning amber | Alert | Low stock, session expiring |
| **Error** | Danger red | X | Failed action, network error |
| **Info** | Gray-800 / Surface inverse | Info | Neutral notices |

## 17.1 Toast Spec

| Property | Value |
|----------|-------|
| **Placement** | Bottom-right desktop; bottom-center mobile (above bottom nav) |
| **Z-index** | 1400 |
| **Duration** | 4s default; 8s for errors; persistent for actionable |
| **Animation** | Slide up + fade, 150ms |
| **Max width** | 360px |
| **Actions** | Optional text button (“Undo”, “View”) — max one action |
| **Stack** | Max 3 visible; newest on top |
| **Dismiss** | Swipe or × button |

**Rule:** Never use toast for “UI preview only” or debug messages in production.

---

# 18. Badges

| Badge | Color | Usage |
|-------|-------|-------|
| **Verified** | Primary + icon | Verified vendor, verified listing |
| **Premium** | Gold accent bg | Premium vendor tier |
| **Featured** | Primary/10 bg | Featured product/listing |
| **Sponsored** | Muted bg + “Sponsored” text | Paid placement — required |
| **Flash Sale** | Danger or gold | Time-limited deal |
| **Sold Out** | Gray | No stock |
| **Pending** | Warning | Awaiting approval, payment pending |
| **Live** | Success pulse dot | Live auction, live event |
| **Paused** | Muted | Inactive listing, paused auction |
| **Auction** | Primary outline | Auction listing |
| **New** | Success | New arrival (< 7 days) |
| **Discount** | Danger | “-20%” or “Sale” |
| **AI** | Gold + sparkle | AI-powered feature or pick |

## 18.1 Badge Spec

- Font: Badge token (11px semibold)
- Padding: 4px 8px
- Radius: radius-full
- Max **2 badges** visible per card — prioritize promo + status

---

# 19. Chips

| Type | Usage | Style |
|------|-------|-------|
| **Category** | Browse filters, homepage pills | Gray bg; primary when active |
| **Filter** | Applied filters with × remove | Primary/10 bg when active |
| **Property Type** | Apartment, House, Land | Outline default |
| **Vehicle Type** | SUV, Sedan, Motorcycle | Outline default |
| **Amenities** | Pool, Parking, WiFi | Small, removable |
| **Status** | Active, Draft, Archived | Semantic color bg |
| **Price** | “Under RWF 50k” | Filter chip |

## 19.1 Chip Spec

- Height: 32px
- Padding: 8px 12px
- Radius: radius-full
- Font: Small (14px) or Caption for compact
- Tap target: 44px minimum height on mobile (padding expands)

---

# 20. Search System

## 20.1 Search Bar

| Property | Value |
|----------|-------|
| **Height** | 40px mobile, 44–48px desktop |
| **Radius** | radius-xl |
| **Icons** | Search left; visual search + YEBO sparkle right (with labels on first visit) |
| **Placeholder** | “Search products, property, vehicles, events…” |
| **Scope** | Unified — results grouped by vertical |

## 20.2 Search Overlay Sections

| Section | Content |
|---------|---------|
| **Recent** | Last 5 searches (localStorage) |
| **Trending** | Platform trending queries (API) |
| **Suggestions** | Type-ahead matches |
| **Quick links** | Top categories |

## 20.3 Results Page

| Vertical | Result Card | Metadata shown |
|----------|-------------|----------------|
| **Products** | Product card compact | Price, rating |
| **Property** | Property card compact | Location, beds |
| **Mobility** | Mobility card compact | Year, mileage |
| **Events** | Event card compact | Date, venue |
| **AI Suggestions** | AI card | “Ask YEBO about {query}” |

## 20.4 Search Rules

1. One search entry point in header — not duplicated in page body.
2. Trending searches appear once (header overlay) — not in homepage body.
3. Empty results → Empty state with suggestions.
4. Search is keyboard-first: `/` shortcut focuses search on desktop.

---

# 21. Marketplace Standards

Every vertical feels like **one ecosystem**. Same tokens, same components, different content.

## 21.1 Product Pages (Browse, Search, Category)

- **Layout:** Sidebar filters (280px) + product grid desktop; drawer filters mobile
- **Grid:** 2/3/4/5 columns per breakpoint
- **Card:** Product Card (canonical)
- **Header:** Compact shop header — not marketing hero
- **Sort/Filter:** Chips + drawer
- **Pagination:** Infinite scroll or numbered — consistent per section

## 21.2 Product Detail Page

- **Gallery:** Left 60% desktop; swipe carousel mobile
- **Buy box:** Sticky right column desktop; bottom bar mobile (price + add to cart)
- **Trust:** Reviews, verified seller, return policy below fold
- **AI:** Try-on CTA in buy box — not separate hero

## 21.3 Property Pages

- **Card:** Property Card
- **Detail:** Photo gallery, map, amenities chips, agent card
- **Filters:** Location, price range, beds, property type
- **CTA:** “Contact agent” / “Schedule viewing”

## 21.4 Mobility Pages

- **Card:** Mobility Card
- **Detail:** Spec table, photo gallery, dealer card
- **Filters:** Make, model, year, price, fuel
- **CTA:** “Contact dealer” / “Request test drive”

## 21.5 Event Pages

- **Card:** Event Card
- **Detail:** Date, venue, map, ticket tiers
- **CTA:** “Get tickets”

## 21.6 Vendor / Shop Pages

- **Header:** Shop banner + logo + verified badge
- **Grid:** Product Card
- **Tabs:** Products · About · Reviews · Policies

## 21.7 Admin Pages

- **Layout:** Sidebar + top bar + content
- **Data:** DataTable with consistent pagination
- **Density:** Higher than customer UI — small buttons, compact tables
- **Colors:** Same tokens — no separate admin palette

## 21.8 Checkout

- **Steps:** Cart → Shipping → Payment → Confirmation
- **Layout:** Single column mobile; two column desktop (form + summary)
- **Trust:** Security icons, return policy link in summary
- **Buttons:** One primary per step — “Continue to payment”

## 21.9 Messaging

- **Layout:** Thread list + conversation panel
- **Bubbles:** Sent (primary bg) · Received (surface bg)
- **Input:** Fixed bottom, 48px min height
- **Empty:** Empty state spec

## 21.10 Cross-Platform Rule

If a pattern exists in the design system, **use it**. If it does not exist, **request it** — do not invent inline.

---

# 22. Responsive Rules

## 22.1 390px (Mobile S)

- 2-column product grid
- Full-width search row below header icons
- Bottom nav visible
- Single column forms
- Horizontal scroll rails with peek
- Banner max height: 220px (hero), 96px (inline)
- Typography: Display not used; H1 → 28px max

## 22.2 414px (Mobile L)

- Same as 390px — scale images slightly larger
- Slightly more breathing room in card body (12px padding)

## 22.3 768px (Tablet)

- 3-column product grid
- Category nav may appear as strip
- Bottom nav visible
- Sidebar filters as drawer
- Banner max height: 260px hero

## 22.4 1024px (Laptop)

- 3–4 column grid
- Bottom nav hidden
- Sidebar filters inline (280px)
- Hover states enabled
- Rail arrow buttons visible

## 22.5 1280px (Desktop)

- 4-column product grid
- Container max-width 1280px
- Mega menu enabled
- Two-column forms where appropriate

## 22.6 1440px (Desktop L)

- 4–5 column product grid
- Container max-width 1440px
- Increased section padding (64px)

## 22.7 1920px (Wide)

- 5-column product grid max
- Content centered — no edge-to-edge stretch
- Hero imagery art-directed for 16:9
- Extra whitespace on margins — not extra columns beyond 5

---

# 23. Accessibility

| Requirement | Standard |
|-------------|----------|
| **Contrast** | WCAG 2.1 AA — 4.5:1 body text, 3:1 large text and UI components |
| **Keyboard** | All interactive elements focusable; logical tab order; Escape closes overlays |
| **Focus** | Visible focus ring — 2px primary, 2px offset; never `outline: none` without replacement |
| **ARIA** | Landmarks (`header`, `main`, `nav`, `footer`); `aria-label` on icon buttons; `role="alert"` on errors |
| **Screen readers** | Live regions for toasts; star ratings labeled; loading states use `aria-busy` |
| **Touch targets** | Minimum 44×44px on mobile |
| **Reduced motion** | See §13.4 — all decorative motion disabled |
| **Color blind** | Status never color-only — always icon + text |
| **Skip link** | “Skip to content” as first focusable element |
| **Forms** | Labels associated via `htmlFor`; errors linked via `aria-describedby` |

---

# 24. Performance Rules

| Rule | Target |
|------|--------|
| **Lazy loading** | All below-fold images; lazy-load homepage sections |
| **Image optimization** | WebP with fallback; responsive srcset; card size vs detail size variants |
| **Animation budget** | Max 3 simultaneous animations per viewport |
| **Bundle size** | Design system components tree-shakeable; no duplicate icon imports |
| **Rendering** | Skeleton before paint; avoid layout shift (reserve image aspect ratio) |
| **LCP target** | < 2.5s — hero image preloaded; critical CSS inline |
| **Fonts** | Preload Poppins 600 + Roboto 400; `font-display: swap` |

---

# 25. Component Inventory

Complete list of reusable components Yebone must use. **No page-local duplicates.**

## 25.1 Actions

Button · IconButton · FAB · Link · ButtonGroup

## 25.2 Cards

ProductCard · PropertyCard · MobilityCard · EventCard · AuctionCard · VendorCard · CollectionCard · CategoryCard · AICard · StatisticCard · KPICard

## 25.3 Forms

Input · Textarea · Select · SearchInput · Checkbox · Radio · Switch · Toggle · FormField · FormGroup · FormInput · FormSelect · FormTextarea · DatePicker · SegmentedControl

## 25.4 Navigation

Header · BottomNav · Sidebar · TopNav · Breadcrumbs · Tabs · MegaMenu · NavSearch · CommandPalette · Drawer · Sheet · ProfileMenu · OrganizationSwitcher · ThemeToggle

## 25.5 Feedback

Toast · Alert · Banner · Progress · Spinner · Skeleton · LoadingState · ErrorState · SuccessState · EmptyState

## 25.6 Overlays

Dialog · Modal · Popover · Dropdown · Menu · Tooltip · SearchOverlay

## 25.7 Data Display

DataTable · DataGrid · Pagination · Accordion · Badge · Chip · Avatar · Progress · List · ListItem

## 25.8 Marketplace

ProductCard (canonical) · MarketplaceCardRail · ProductCardSkeleton · ProductCardReviews · MarketplaceVendorCard · FilterDrawer · SortDropdown · PriceDisplay · RatingStars

## 25.9 Commerce

CartItem · CartSummary · CheckoutStep · OrderCard · PaymentMethod · ShippingForm

## 25.10 Content

SectionTitle · Container · Hero · BannerSlot · Newsletter · Reviews · Testimonial

## 25.11 AI

AISearch · AISection · AIInsightCard · YEBOPanel · YEBOBanner · AIProcessingNotification

## 25.12 Charts (Dashboard)

LineChart · BarChart · PieChart · KPIChart — admin/vendor only

## 25.13 Layouts

CustomerLayout · VendorLayout · AdminLayout · AuthLayout · SettingsLayout · DashboardLayout · ResponsiveLayout

## 25.14 Media

ImageGallery · ImageCarousel · LazyImage · VideoEmbed

## 25.15 Utilities

Container · Stack · Grid · Divider · Spacer · VisuallyHidden · FocusTrap

---

# 26. Design Tokens

Complete token registry. All implementation must reference these names.

## 26.1 Color Tokens

```
color.primary          #29625d
color.primaryDark      #1a4c47
color.secondary        #1a4c47
color.accent           #fed592
color.background       #F6F6F5
color.foreground       #313131
color.surface.0        #ffffff
color.surface.1        #F6F6F5
color.surface.2        #EEEDEC
color.surface.3        #E5E4E3
color.border           #e5e7eb
color.borderStrong     rgba(41,98,93,0.15)
color.muted            #6b7280
color.mutedForeground  #9ca3af
color.disabled         #d1d5db
color.success          #15803d
color.successBg        rgba(21,128,61,0.12)
color.warning          #b45309
color.warningBg        rgba(180,83,9,0.12)
color.error            #b91c1c
color.errorBg          rgba(185,28,28,0.12)
color.info             #2563eb
color.infoBg           rgba(37,99,235,0.12)
color.overlay          rgba(0,0,0,0.50)
color.overlayLight     rgba(0,0,0,0.25)
```

## 26.2 Typography Tokens

```
font.family.display    Poppins, sans-serif
font.family.body       Roboto, sans-serif
font.size.xs           0.75rem / 12px
font.size.sm           0.875rem / 14px
font.size.base         1rem / 16px
font.size.lg           1.125rem / 18px
font.size.xl           1.25rem / 20px
font.size.2xl          1.5rem / 24px
font.size.3xl          1.875rem / 30px
font.size.4xl          2.25rem / 36px
font.size.display      3rem–3.75rem (responsive)
font.weight.normal     400
font.weight.medium     500
font.weight.semibold   600
font.weight.bold       700
font.lineHeight.tight  1.25
font.lineHeight.normal 1.5
font.lineHeight.relaxed 1.625
```

## 26.3 Spacing Tokens

```
space.1   4px
space.2   8px
space.3   12px
space.4   16px
space.5   20px
space.6   24px
space.8   32px
space.10  40px
space.12  48px
space.16  64px
space.20  80px
space.24  96px
```

## 26.4 Radius Tokens

```
radius.none   0
radius.sm     6px
radius.md     8px
radius.lg     12px
radius.xl     16px
radius.2xl    20px
radius.3xl    24px
radius.full   9999px
```

## 26.5 Shadow Tokens

```
shadow.sm       0 1px 2px rgba(0,0,0,0.05)
shadow.md       0 4px 12px rgba(41,98,93,0.08)
shadow.lg       0 10px 25px rgba(41,98,93,0.12)
shadow.xl       0 20px 40px rgba(41,98,93,0.15)
shadow.hover    0 12px 36px -10px rgba(41,98,93,0.18)
shadow.gold     0 4px 14px rgba(254,213,146,0.25)
shadow.sticky   0 2px 8px rgba(0,0,0,0.06)
shadow.modal    0 24px 48px rgba(0,0,0,0.16)
shadow.dropdown 0 8px 24px rgba(0,0,0,0.10)
```

## 26.6 Motion Tokens

```
motion.duration.instant  0ms
motion.duration.fast     150ms
motion.duration.normal   300ms
motion.duration.slow     500ms
motion.duration.slower   800ms
motion.easing.default    cubic-bezier(0.4, 0, 0.2, 1)
motion.easing.in         cubic-bezier(0.4, 0, 1, 1)
motion.easing.out        cubic-bezier(0, 0, 0.2, 1)
motion.easing.spring     cubic-bezier(0.22, 1, 0.36, 1)
```

## 26.7 Breakpoint Tokens

```
breakpoint.mobileS    390px
breakpoint.mobileL    414px
breakpoint.tablet     768px
breakpoint.laptop     1024px
breakpoint.desktop    1280px
breakpoint.desktopL   1440px
breakpoint.wide       1920px
```

## 26.8 Z-Index Tokens

```
zIndex.dropdown    1000
zIndex.sticky      1100
zIndex.modal       1300
zIndex.toast       1400
zIndex.tooltip     1500
```

## 26.9 Icon Size Tokens

```
icon.xs   12px
icon.sm   16px
icon.md   20px
icon.lg   24px
icon.xl   32px
icon.2xl  48px
```

## 26.10 Component Size Tokens

```
component.button.sm    32px
component.button.md    40px
component.button.lg    48px
component.input.md     40px
component.input.lg     48px
component.iconButton   40px
component.fab          56px
component.bottomNav    56px
component.sidebar      280px
```

## 26.11 Opacity Tokens

```
opacity.0     0
opacity.50    0.5
opacity.75    0.75
opacity.100   1
opacity.disabled 0.5
```

## 26.12 Border Tokens

```
border.width.thin     1px
border.width.medium   2px
border.width.focus    2px
border.style.solid    solid
border.style.dashed   dashed
```

## 26.13 CSS Variable Mapping

Web implementation maps tokens to CSS variables:

```
--yebone-primary
--yebone-primary-dark
--yebone-secondary
--yebone-accent
--yebone-bg
--yebone-fg
--yebone-radius
--yebone-shadow
```

Tailwind consumes via `yebone-*` prefix. Native apps consume via platform theme files generated from this registry.

---

# 27. Future Native App Mapping

This Design System is **platform-agnostic**. Native apps inherit tokens — not re-design screens.

## 27.1 Token Export Strategy

1. **Single JSON source** — all tokens in `design-tokens.json` exported from this spec.
2. **CI pipeline** generates platform theme files on build.
3. **No manual duplication** — native teams never hand-copy hex values.

## 27.2 Flutter

| Web Token | Flutter Mapping |
|-----------|-----------------|
| `color.primary` | `ThemeData.primaryColor` |
| `color.background` | `scaffoldBackgroundColor` |
| `font.family.display` | `textTheme.headline*` → Poppins via `google_fonts` |
| `font.family.body` | `textTheme.body*` → Roboto |
| `space.*` | `EdgeInsets` constants in `YeboneSpacing` class |
| `radius.*` | `BorderRadius.circular()` via `YeboneRadius` |
| `shadow.*` | `BoxShadow` via `YeboneElevation` |
| `motion.duration.*` | `Duration(milliseconds: ...)` in `YeboneMotion` |

**Components:** `YeboneButton`, `YeboneProductCard`, etc. — widget library mirroring §25 inventory.

## 27.3 React Native

| Web Token | RN Mapping |
|-----------|------------|
| Colors | `StyleSheet` theme object / NativeWind config |
| Typography | Theme `Text` variants |
| Spacing | Theme spacing constants |
| Shadows | iOS `shadow*` / Android `elevation` mapped from elevation tokens |
| Icons | Same React Icons or `react-native-vector-icons` equivalent |

**Shared logic:** React Native Web can share component code with web where architecture permits.

## 27.4 SwiftUI

| Web Token | SwiftUI Mapping |
|-----------|-----------------|
| Colors | `Color("YebonePrimary")` in Asset Catalog |
| Typography | `Font.custom("Poppins", size: ...)` via text styles |
| Spacing | `CGFloat` constants in `YeboneSpacing` enum |
| Radius | `RoundedRectangle(cornerRadius: ...)` |
| Motion | `.animation(.easeInOut(duration: ...))` |

## 27.5 Jetpack Compose

| Web Token | Compose Mapping |
|-----------|-----------------|
| Colors | `MaterialTheme(colorScheme = YeboneColorScheme)` |
| Typography | `MaterialTheme(typography = YeboneTypography)` |
| Spacing | `YeboneSpacing` object |
| Elevation | `CardDefaults.cardElevation()` mapped from shadow tokens |

## 27.6 Cross-Platform Rules

1. **Same hex values everywhere** — brand consistency.
2. **Same component names** — `ProductCard` is `ProductCard` on all platforms.
3. **Same spacing scale** — 8pt grid universal.
4. **Platform-native navigation patterns** — iOS tab bar, Android bottom nav, web header — but same items, same icons, same labels.
5. **Dark mode tokens pre-defined** — switch without redesign.

---

# 28. Design Governance

## 28.1 Non-Negotiable Rules

| # | Rule |
|---|------|
| 1 | **No page creates its own button.** Use `Button` from design system. |
| 2 | **No page creates its own card.** Use canonical card for vertical. |
| 3 | **No random spacing.** Only §4 tokens permitted. |
| 4 | **No random typography.** Only §3 scale permitted. |
| 5 | **No duplicate components.** If needed, extend design system — don't fork. |
| 6 | **No placeholder UI in production.** Remove or hide until functional. |
| 7 | **No new colors without token registration.** |
| 8 | **No more than 3 banners per page.** |
| 9 | **No more than one primary CTA per viewport.** |
| 10 | **All new screens reviewed against this document before merge.** |

## 28.2 Component Request Process

1. Designer/engineer identifies gap in §25 inventory.
2. Proposal added to design system backlog with token spec.
3. Design review approves API and visual spec.
4. Component built in `src/design-system/` — not in page folders.
5. Documented in this file's inventory.
6. Adopted by consuming pages in follow-up PR.

## 28.3 Deprecation Process

1. Mark component `deprecated` in export with migration path.
2. Allow one sprint for consumer migration.
3. Remove deprecated component.
4. Update §25 inventory.

## 28.4 Versioning

| Version | Meaning |
|---------|---------|
| **Major** | Breaking token or component API change |
| **Minor** | New component or token added |
| **Patch** | Bug fix, clarification, visual refinement |

Current version: **1.0** — initial official release.

## 28.5 Review Checklist (PR Gate)

- [ ] Uses design system tokens (no hardcoded hex/spacing)
- [ ] Uses canonical components (no inline card/button)
- [ ] Responsive across 390px–1920px
- [ ] Accessibility: focus, labels, contrast, touch targets
- [ ] Loading and empty states defined
- [ ] No placeholder/mock production UI
- [ ] Banner count ≤ 3 if applicable
- [ ] Motion respects reduced motion
- [ ] Dark mode tokens used (not light-only hardcodes)

## 28.6 Ownership

| Role | Responsibility |
|------|----------------|
| **Design System Lead** | Token registry, component inventory, governance |
| **Product Design** | New patterns, banner strategy, marketplace standards |
| **Engineering** | Implementation in `src/design-system/`, token export |
| **QA** | Visual regression, accessibility audit, responsive testing |

---

## Appendix A: Brand Quick Reference

| Element | Value |
|---------|-------|
| Primary | `#29625d` (Teal Green) |
| Accent | `#fed592` (Gold) |
| Display Font | Poppins |
| Body Font | Roboto |
| Base Unit | 8px |
| Product Image Ratio | 4:5 |
| Card Radius | 12px |
| Button Radius | 16px |
| Default Shadow | `shadow-md` |

## Appendix B: Related Implementation

| Document | Purpose |
|----------|---------|
| [`HOMEPAGE_UX_AUDIT.md`](./HOMEPAGE_UX_AUDIT.md) | Homepage audit findings |
| [`HOMEPAGE_IMPLEMENTATION_PLAN.md`](./HOMEPAGE_IMPLEMENTATION_PLAN.md) | Homepage redesign plan |
| `src/design-system/` | Engineering implementation (Phase 8G) |
| `src/design-system/docs/DESIGN_SYSTEM.md` | Developer quick-start (implementation-focused) |

---

*This document is the permanent visual and UX foundation of Yebone. All platform surfaces — current and future — must conform to it.*
