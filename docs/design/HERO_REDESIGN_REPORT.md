# YEBONE Hero Redesign — Premium AI Hero Report

**Date:** 2026-08-06  
**Sprint:** Restore premium split Hero (Apple / Shopify / Linear direction)  
**Backend / database:** Not modified  

---

## Summary

The homepage Hero was restored to a **luxury split layout** inspired by the original YEBONE concept: left copy (45%) + right visual (55%). The busy Virtual Try-On showcase block (bordered shell, metric boxes, duplicate copy) was removed. The result is a minimal, elegant, premium ecommerce landing hero with AI differentiation — not a dashboard.

**Playwright:** 12/12 passed (`e2e/tests/hero-redesign.spec.js`)

---

## Before

| Aspect | Previous state (interim Virtual Try-On showcase) |
|--------|--------------------------------------------------|
| Structure | Hero copy stacked **above** a separate bordered showcase section |
| Layout | Two-column showcase **inside** a large rounded shell |
| Copy | Duplicate AI messaging (hero + showcase headings) |
| Metrics | AI Match % animation + “Excellent” confidence cards |
| Cards | Up to **5** floating product cards |
| Visual noise | Glass shell, pulse ring, shimmer, glow orbs, metric boxes |
| Headline | “Shop Smarter. **Discover More.**” |
| CTAs | Start Shopping / Browse collections |
| Trust | None in hero |
| Feel | Feature demo / dashboard-like |

**Reference screenshots (before):** `e2e/audit-screenshots/ai-tryon-premium/`  
See also: `docs/design/AI_TRYON_PREMIUM_REPORT.md`

---

## After

| Aspect | New state |
|--------|-----------|
| Structure | **Single unified hero** — 45% copy / 55% visual at `≥1024px` |
| Left column | AI badge, headline, description, CTAs, customer trust |
| Headline | **Shop Smarter.** / **Try Before You Buy.** |
| Description | “Discover products across Africa with AI-powered virtual try-on.” |
| Primary CTA | **Shop Now** → `/products` |
| Secondary CTA | **Try AI Now** → `/ai-experience` |
| Trust row | ★★★★★ **4.9/5** — Trusted by thousands. |
| Right column | Premium fashion model (`object-fit: contain`, head never cropped) |
| Floating cards | **Max 4**, live AI-compatible products, glassmorphism, clickable PDP links |
| AI story | Subtle curved SVG line + **“See it on you”** fade animation |
| Removed | Bordered shell, metrics, duplicate showcase copy, 5th card, cartoon/demo chrome |
| Feel | Luxury minimal — Stripe / Linear restraint with YEBONE brand color |

---

## Layout

```
Desktop (≥1024px)
┌─────────────────────────────────────────────────────────────┐
│  LEFT 45%                    │  RIGHT 55%                   │
│  ✨ AI Powered Experience    │     ╭─ See it on you          │
│  Shop Smarter.               │    ╱                          │
│  Try Before You Buy.         │   [Model photo — full head]   │
│  Description                 │        ◇ Jacket  ◇ Hoodie     │
│  [Shop Now] [Try AI Now]     │     ◇ Shoes      ◇ Activewear │
│  ★★★★★ 4.9/5 Trusted…       │                               │
└─────────────────────────────────────────────────────────────┘

Mobile (<1024px)
Copy stack → visual below (model + up to 3 cards visible)
```

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/Home/HomeHero.jsx` | Unified 45/55 premium grid; copy, CTAs, trust |
| `src/components/Home/HeroAIShowcase.jsx` | Visual-only: model, 4 cards, AI story line |
| `src/components/Home/heroAiShowcase.css` | Minimal premium styles (no shell/metrics) |
| `src/components/Home/home.css` | `.home-hero--premium` grid + trust row tokens |
| `src/utils/aiPreviewCatalog.js` | `pickDiverseAiPreviewProducts()` for varied labels |
| `e2e/tests/hero-redesign.spec.js` | Full verification + screenshots |
| `e2e/tests/ai-tryon-premium.spec.js` | Slim legacy alias (hero visual present) |

---

## Floating Product Cards

- **Source:** Live Redux catalog via `pickDiverseAiPreviewProducts()` (max 4)
- **Filter:** Same AI-compatible rules — phone accessories excluded
- **Interaction:** Each card is a `<Link>` to `/product/:id`
- **Badge:** AI Ready (glass pill)
- **Labels:** Hoodie, Jacket, Tee, Activewear, Shoes (diverse when catalog allows)

---

## Desktop Screenshots (After)

| Viewport | File |
|----------|------|
| 1024px | `e2e/audit-screenshots/hero-redesign/hero-1024.png` |
| 1280px | `e2e/audit-screenshots/hero-redesign/hero-1280.png` |
| 1440px | `e2e/audit-screenshots/hero-redesign/hero-1440.png` |
| 1920px | `e2e/audit-screenshots/hero-redesign/hero-1920.png` |

### Before (interim showcase) — same viewports for comparison

| Viewport | File |
|----------|------|
| 1280px | `e2e/audit-screenshots/ai-tryon-premium/ai-tryon-1280.png` |
| 1440px | `e2e/audit-screenshots/ai-tryon-premium/ai-tryon-1440.png` |
| 1920px | `e2e/audit-screenshots/ai-tryon-premium/ai-tryon-1920.png` |

---

## Mobile Screenshots (After)

| Viewport | File |
|----------|------|
| 390px | `e2e/audit-screenshots/hero-redesign/hero-390.png` |
| 414px | `e2e/audit-screenshots/hero-redesign/hero-414.png` |
| 768px | `e2e/audit-screenshots/hero-redesign/hero-768.png` |

### Before (interim showcase)

| Viewport | File |
|----------|------|
| 390px | `e2e/audit-screenshots/ai-tryon-premium/ai-tryon-390.png` |
| 414px | `e2e/audit-screenshots/ai-tryon-premium/ai-tryon-414.png` |

---

## Performance

| Check | Result |
|-------|--------|
| Lazy-load images | ✅ `loading="lazy"` + `decoding="async"` on model and card images |
| Fixed dimensions | ✅ `width`/`height` on images; stage uses `aspect-ratio: 4/5` |
| CLS | ✅ Reserved stage height via `min-height` + aspect ratio |
| Horizontal overflow | ✅ None at 390–1920px (Playwright verified) |
| Reduced motion | ✅ Float + story animations disabled when `prefers-reduced-motion` |

---

## Responsive Verification

| Viewport | Overflow | Screenshot | Playwright |
|----------|----------|------------|------------|
| 390px | ✅ | `hero-390.png` | ✅ |
| 414px | ✅ | `hero-414.png` | ✅ |
| 768px | ✅ | `hero-768.png` | ✅ |
| 1024px | ✅ | `hero-1024.png` | ✅ |
| 1280px | ✅ | `hero-1280.png` | ✅ |
| 1440px | ✅ | `hero-1440.png` | ✅ |
| 1920px | ✅ | `hero-1920.png` | ✅ |

---

## Accessibility

| Check | Result |
|-------|--------|
| Hero landmark | ✅ `aria-labelledby="home-hero-heading"` |
| Buttons / links | ✅ Shop Now, Try AI Now — keyboard focusable |
| Card links | ✅ Descriptive `aria-label` per product |
| Model alt | ✅ “Fashion model showcasing virtual try-on” |
| Product image alt | ✅ Product name on card images |
| Focus visible | ✅ `:focus-visible` outline on floating cards |

---

## Playwright Results

| Test | Result |
|------|--------|
| Premium headline, CTAs, trust row | ✅ |
| Busy shell + metrics removed | ✅ |
| AI story + model + ≤4 cards | ✅ |
| Cards link to product detail | ✅ |
| Images load, no overflow | ✅ |
| Responsive @ 7 viewports | ✅ |

**Total: 12/12 passed**

Run:

```bash
cd e2e
npx playwright test tests/hero-redesign.spec.js
```

---

## Design Rationale

The interim Virtual Try-On section optimized for **feature demonstration** (metrics, bordered container, duplicate CTAs). That competed with the hero instead of elevating it.

The restored direction follows premium ecommerce patterns:

- **One message per viewport** — shop smarter, try before you buy
- **Proof on the right** — model + live products, not statistics
- **Restraint** — four cards max, soft glass shadows, no dashboard chrome
- **Brand-native** — YEBONE green/gold accents without copying external UIs

The separate `#ai-experience` section lower on the page remains unchanged for users who want the full AI journey after browsing products.

---

*UI/UX only. No backend APIs, database, or demo products were added.*
