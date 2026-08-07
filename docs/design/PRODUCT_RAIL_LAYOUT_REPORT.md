# Product Rail Layout Report

**Date:** August 6, 2026  
**Scope:** Horizontal product rail layout only — **no ProductCard or image rendering changes**

---

## Executive Summary

Mobile product rails felt narrow because cards lived inside a double-constrained container (`w-11/12` + `px-4`), leaving ~23% of the viewport unused. Cards were ~145px wide on a 390px screen.

The fix applies **mobile-only (≤767px)** CSS to `MarketplaceCardRail`: full-bleed breakout with 12px safe-area insets, tighter gap, and `2.02` visible-card math so **two cards fill ~93% of the viewport** with a small scroll peek.

**ProductCard internals, image rendering, Cloudinary, typography, and card height are unchanged.**

---

## Problem

| Issue | Impact |
|-------|--------|
| Container `w-11/12` + `px-4` gutter | Rail only ~325px wide on 390px viewport |
| `--mpc-rail-visible: 2.15` with 12px gap | Cards ~145px — felt small |
| No full-bleed rail on mobile | Large unused left/right margins |

---

## Solution (mobile only)

### CSS variables (≤767px)

| Token | Before | After |
|-------|--------|-------|
| `--mpc-rail-visible` | 2.15 | **2.02** (2 full cards + ~2% peek) |
| `--mpc-rail-gap` | 0.75rem (12px) | **0.5rem (8px)** |
| `--mpc-rail-edge-inset` | — | **max(12px, safe-area)** |

### Full-bleed rail wrap

```css
@media (max-width: 767px) {
  .mpc-rail-wrap {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-inline: var(--mpc-rail-edge-inset);
  }
}
```

Breaks the rail out of the centered `Container` while keeping **12px safe-area margins** — Apple / Nike / Shopify mobile pattern.

### Scroll snap

- `scroll-padding-inline` aligned to safe-area inset
- Card flex formula unchanged; only `--mpc-rail-visible` and gap tuned

### Tablet & desktop (≥768px)

**Unchanged** — verified metrics identical before/after at 768px and 1280px.

---

## Measurements

Playwright audit: `node e2e/capture-product-rail-layout-audit.js [before|after]`  
Surface: Homepage `#discover-products` rails

### Mobile 390px

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Rail wrap width | 325.5px | 390px (full viewport) | +19.8% |
| Outer rail padding | 0 (container absorbed) | 12px each side | Safe-area only |
| Card width | **145px** | **177.1px** | **+22.1%** |
| Gap between cards | 12px | 8px | −33% |
| Two cards + gap span | 301.9px | 362.3px | +20.0% |
| **Viewport utilization** | **77.4%** | **92.9%** | **+15.5 pts** |

### Mobile 414px

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Card width | 155.2px | 189px | +21.8% |
| Two cards + gap | 322.4px | 386px | +19.7% |
| **Viewport utilization** | **77.9%** | **93.2%** | **+15.3 pts** |

### Tablet 768px & desktop 1280px

| Viewport | Utilization before | Utilization after | Card width |
|----------|-------------------|-------------------|------------|
| 768px | 53.7% | 53.7% | 200.1px (same) |
| 1280px | 33.1% | 33.1% | 205.7px (same) |

*Lower utilization % on tablet/desktop is expected — more cards visible per viewport; card sizes unchanged.*

### Horizontal scroll regression

| Viewport | scrollWidth === innerWidth |
|----------|----------------------------|
| 390px | ✅ Pass |
| 414px | ✅ Pass |

---

## Before vs After Screenshots

| Viewport | Before | After |
|----------|--------|-------|
| Mobile 390 | `e2e/audit-screenshots/product-rail-layout/before/mobile-390-home-rails.png` | `e2e/audit-screenshots/product-rail-layout/after/mobile-390-home-rails.png` |
| Mobile 414 | `before/mobile-414-home-rails.png` | `after/mobile-414-home-rails.png` |
| Tablet 768 | `before/tablet-768-home-rails.png` | `after/tablet-768-home-rails.png` |
| Desktop 1280 | `before/desktop-1280-home-rails.png` | `after/desktop-1280-home-rails.png` |

Machine-readable metrics: `before/metrics.json`, `after/metrics.json`

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/Marketplace/cards/marketplaceCards.css` | Mobile rail bleed, gap, visible count, scroll padding |
| `src/components/Marketplace/cards/MarketplaceCardSkeleton.jsx` | Wrap skeleton rail in `mpc-rail-wrap` for loading parity |
| `e2e/capture-product-rail-layout-audit.js` | Layout measurement automation |
| `docs/design/PRODUCT_RAIL_LAYOUT_REPORT.md` | This document |

### Confirmed unchanged

- `ProductCard.jsx` — no edits
- `productCard.css` / image fit / Cloudinary
- Card height, typography, buttons, internal spacing
- Desktop & tablet rail layout (≥768px)
- Grid layouts (`/products`, `/best-selling`) — not rails

---

## Success Criteria

| Criterion | Status |
|-----------|--------|
| Exactly 2 cards visible on mobile | ✅ |
| ~90–95% viewport utilization | ✅ 92.9% (390), 93.2% (414) |
| Tiny next-card peek | ✅ ~2% via `--mpc-rail-visible: 2.02` |
| Safe-area margins 12–16px | ✅ 12px (`0.75rem`) |
| Cards feel bigger, not cards taller | ✅ +22% card width |
| No ProductCard / image changes | ✅ |
| Tablet/desktop unchanged | ✅ Verified |
| No horizontal overflow | ✅ |

---

## How to Re-verify

```bash
node e2e/capture-product-rail-layout-audit.js before   # baseline
node e2e/capture-product-rail-layout-audit.js after    # current
```

Target: mobile `viewportUtilizationPct` ≥ **92%**.

---

*Generated after mobile product rail layout optimization — August 6, 2026.*
