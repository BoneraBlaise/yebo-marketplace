# Hotfix — Mobile Header Responsive Regression

**Date:** August 6, 2026  
**Priority:** Urgent  
**Introduced in:** Sprint 2 (`home.css` homepage header calm mode)

---

## Summary

Sprint 2 added a mobile CSS override for `.home-header--home .home-header__search-row` that broke the established flex-wrap mobile header layout. On viewports around **414px** (and intermittently near **390px** when authenticated), the search row stayed on the same line as the logo and action icons instead of wrapping to full width, causing horizontal overflow and a split header appearance.

---

## Root Cause

**File:** `src/components/Home/home.css`  
**Rule (Sprint 2, broken):**

```css
@media (max-width: 1023px) {
  .home-header--home .home-header__search-row {
    flex: 1;           /* ← BUG: overrides flex: 1 1 100% */
    min-width: 0;
  }
}
```

The mobile header layout depends on this existing rule (Phase 8H.6):

```css
@media (max-width: 1023px) {
  .home-header__search-row {
    order: 4;
    flex: 1 1 100%;   /* forces search to its own full-width row */
    max-width: 100%;
  }
}
```

Setting `flex: 1` on the homepage variant resolves to `flex: 1 1 0%`, which:

1. Removed the `100%` flex-basis that triggers row wrap
2. Kept the search bar on the **same row** as logo + action icons
3. Squeezed the search row to ~**37px** at 414px
4. Pushed `.home-header__search-input` and `.home-header__search-actions` **79px past the viewport** (scrollWidth **493px** vs innerWidth **414px**)

### Measured before fix (Playwright @ 414px)

| Metric | Value |
|--------|-------|
| `document.documentElement.scrollWidth` | **493px** |
| `window.innerWidth` | 414px |
| `.home-header__search-row` flex | `1 1 0%` |
| `.home-header__search-row` width | **37px** |
| Primary overflow offenders | `.home-header__search-input`, `.home-header__search-actions` |

### Symptoms explained

| Symptom | Cause |
|---------|-------|
| Header split into two groups | Logo/actions row 1; crushed search inline instead of row 2 |
| Search pushed to the right | `flex: 1 1 0%` with `margin-left: auto` on actions |
| Horizontal scrolling | Search shell/input extended to 493px |
| White area on the right | Content wider than viewport |
| Hero off-center | Page shifted horizontally |

---

## Fix

**Restored full-width wrap behavior for homepage mobile search row:**

```css
@media (max-width: 1023px) {
  .home-header--home .home-header__search-row {
    flex: 1 1 100%;
    max-width: 100%;
    min-width: 0;
  }
}
```

**Defensive rail containment** (prevents arrow bleed on edge breakpoints):

```css
.mpc-rail-wrap {
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
}
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/Home/home.css` | Fixed `.home-header--home .home-header__search-row` flex on mobile |
| `src/components/Marketplace/cards/marketplaceCards.css` | Added `max-width` / `overflow` guard on `.mpc-rail-wrap` |

No JSX or component structure changes required.

---

## Before / After

### Before (Sprint 2 regression @ 414px)

- Reference screenshot: `e2e/audit-screenshots/sprint-2/mobile-414-home-top.png`
- Search inline with header icons; content overflows viewport
- `scrollWidth: 493`, `searchRowWidth: 37px`

### After (hotfix @ 414px)

- Screenshot: `e2e/audit-screenshots/hotfix-mobile-header/mobile-414-header-after.png`
- Search on dedicated full-width row below logo/actions
- `scrollWidth: 414`, `searchRowWidth: 348px`

### After (hotfix @ 390px)

- Screenshot: `e2e/audit-screenshots/hotfix-mobile-header/mobile-390-header-after.png`
- `scrollWidth: 390`, `searchRowWidth: 326px`

---

## Verification Results

Automated check: `e2e/capture-hotfix-verification.js`  
Results JSON: `e2e/audit-screenshots/hotfix-mobile-header/verification.json`

| Viewport | scrollWidth | innerWidth | Overflow | searchRow flex | searchRow width | Hero aligned |
|----------|-------------|------------|----------|----------------|-----------------|--------------|
| iPhone 12 (390px) | 390 | 390 | **No** | `1 1 100%` | 326px | Yes |
| iPhone Plus (414px) | 414 | 414 | **No** | `1 1 100%` | 348px | Yes |
| Tablet (768px) | 768 | 768 | **No** | `1 1 100%` | 656px | Yes |
| Desktop (1280px) | 1280 | 1280 | **No** | `1 1 auto` | N/A (display: contents) | Yes |

### Screenshots (after fix)

| Viewport | Path |
|----------|------|
| 390px | `e2e/audit-screenshots/hotfix-mobile-header/mobile-390-header-after.png` |
| 414px | `e2e/audit-screenshots/hotfix-mobile-header/mobile-414-header-after.png` |
| 768px | `e2e/audit-screenshots/hotfix-mobile-header/tablet-768-header-after.png` |
| 1280px | `e2e/audit-screenshots/hotfix-mobile-header/desktop-1280-header-after.png` |

---

## Status

**Horizontal overflow eliminated** on all tested viewports. Mobile header restored to:

- Full viewport width (no page-level horizontal scroll)
- Search bar on its own row at full width
- Logo + actions on the row above
- Hero content aligned to viewport left edge (standard mobile layout)

---

*Hotfix verified via Playwright + browser DevTools. Sprint 3 work should not resume until this fix is deployed.*
