# Mobile UX & Image Stability Report

**Date:** 2026-08-06  
**Sprint:** Production UI stabilization (frontend only)  
**Database:** Not modified  
**Demo data:** Not created  

---

## Executive Summary

| Issue | Status |
|-------|--------|
| Broken product images | ✅ Fixed |
| iPhone Safari auto-zoom on inputs | ✅ Fixed |
| Horizontal scrolling | ✅ Fixed |
| Mobile layout stability (390–430px) | ✅ Verified |

**Playwright:** 35/35 tests passed (`e2e/tests/mobile-stability.spec.js`)

---

## Issue 1 — Broken Product Images

### Root cause

Cloudinary transform preset `e_trim:100` is **invalid syntax**. Cloudinary returns **HTTP 400** for URLs containing `e_trim:100`, while raw upload URLs and `e_trim` (without `:100`) return **HTTP 200**.

Affected presets in `src/utils/productImageUtils.js`:

| Preset | Before (broken) | After (fixed) |
|--------|-----------------|---------------|
| `card` | `e_trim:100,c_fit,w_480,h_600,...` | `e_trim,c_fit,w_480,h_600,...` |
| `thumb` | `e_trim:100,c_fit,w_144,h_144,...` | `e_trim,c_fit,w_144,h_144,...` |

Every product card, search result, and PDP gallery thumb using `optimizeProductImage()` with `card` or `thumb` presets was rendering a broken-image icon.

### Verification

| Check | Result |
|-------|--------|
| MongoDB image URLs | ✅ All 14 products have valid Cloudinary HTTPS URLs |
| Raw URLs (`/upload/v…/products/…`) | ✅ HTTP 200 |
| Optimized card URLs (after fix) | ✅ HTTP 200 for all 14 products |
| Homepage product cards in browser | ✅ All visible cards load (`naturalWidth > 0`) |

### Products with genuinely missing source images

**None.** All 14 production products have uploaded Cloudinary images in MongoDB. No placeholders were added.

### Files changed

| File | Change |
|------|--------|
| `src/utils/productImageUtils.js` | Fixed `e_trim:100` → `e_trim`; added `handleProductImageError()` fallback to raw URL |
| `src/components/Marketplace/ProductCard.jsx` | Added `onError` fallback to original upload URL |
| `src/components/Products/ProductGallery.jsx` | Added `onError` fallback on hero, thumb, lightbox |
| `src/components/Route/ProductCard/MobileProductCard.jsx` | Uses `resolveProductDisplayImage()` + `onError` fallback |

The `onError` handler reverts to the **original user upload URL** — never a placeholder.

---

## Issue 2 — iPhone Safari Zoom

### Root cause

Safari auto-zooms when a focused `<input>`, `<select>`, or `<textarea>` has computed `font-size` below **16px**. Several inputs used `0.875rem` (14px) or `0.8125rem` (13px), including:

- `.home-header__search-input` — 14px
- `.auth-floating-input` — 15px
- `.mc-nav__search-input` — 15px
- Dashboard/admin form inputs — 13–14px

### Fix

Global mobile rule in `src/ui-polish/responsivePolish.css`:

```css
@media (max-width: 900px) {
  input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]),
  select,
  textarea {
    font-size: 16px !important;
  }
}
```

### Verification

| Page / input | Computed font-size @ 390px |
|--------------|---------------------------|
| `/login` `.auth-floating-input` | ≥ 16px ✅ |
| `/` `.home-header__search-input` | ≥ 16px ✅ |

Covers: search, login, register, checkout, profile, vendor forms, admin forms.

---

## Issue 3 — Horizontal Scrolling

### Root cause

1. No global `overflow-x: hidden` on `html` / `body`
2. Mobile product rail (`.mpc-rail-wrap`) used `width: 100vw` + negative margin bleed pattern, which exceeds viewport width when a scrollbar is present

### Fix

**`src/ui-polish/responsivePolish.css`**

```css
html { overflow-x: hidden; }
body { overflow-x: hidden; max-width: 100%; }
#root { overflow-x: clip; max-width: 100%; }
```

Extended page-level clipping to: `.home-page`, `.dashboard-page`, `.marketplace-page`, `.product-details-page`, `.auth-page`, `.checkout-page`, `.profile-hub`, `.property-mobility-page`

**`src/components/Marketplace/cards/marketplaceCards.css`**

Replaced `100vw` full-bleed rail with `width: 100%` (no negative viewport margins).

### Verification

Playwright checked `document.documentElement.scrollWidth <= clientWidth` on 7 pages × 4 viewports = **28 combinations — all passed**.

---

## Issue 4 — Mobile Layout Stability

### Viewports tested

390, 393, 414, 430 px

### Pages tested

| Page | Path |
|------|------|
| Homepage | `/` |
| Products | `/products` |
| Search | `/search?search=phone` |
| Login | `/login` |
| Register | `/sign-up` |
| Property/Mobility | `/property-mobility` |
| Vendor preview | `/shop/preview/6a64e98ddcdc9f592fe0d774` |

### Results

| Requirement | Status |
|-------------|--------|
| No horizontal overflow | ✅ |
| No layout-induced zoom | ✅ (16px inputs) |
| No fatal console errors | ✅ |
| Product images load | ✅ |
| Cards not clipped by overflow bug | ✅ |
| Professional spacing preserved | ✅ |

### Screenshots

**Location:** `e2e/audit-screenshots/mobile-stability/`

28 PNG files (7 pages × 4 viewports):

```
homepage-{390,393,414,430}.png
products-{390,393,414,430}.png
search-{390,393,414,430}.png
login-{390,393,414,430}.png
sign-up-{390,393,414,430}.png
property-{390,393,414,430}.png
vendor-{390,393,414,430}.png
```

---

## Playwright Test Results

**Spec:** `e2e/tests/mobile-stability.spec.js`

| Suite | Tests | Result |
|-------|------:|--------|
| Product Images — optimized URLs | 1 | ✅ Pass |
| Product Images — homepage render | 1 | ✅ Pass |
| Safari Zoom Prevention | 1 | ✅ Pass |
| No Horizontal Scroll | 28 | ✅ Pass |
| Screenshots | 4 | ✅ Pass |

**Total: 35/35 passed**

---

## Remaining Issues

| Item | Severity | Notes |
|------|----------|-------|
| Dark mode header pseudo-element uses `100vw` | Low | Clipped by `html/body overflow-x: hidden`; no scroll observed |
| TensorFlow.js duplicate kernel warnings | Low | Dev/HMR noise only; not user-facing |
| Auth journey E2E suites skipped | N/A | Requires `e2e/.env.e2e.local` credentials |
| Category fallback photos (non-product) | N/A | `resolveCategoryPhoto()` still used for category tiles without uploaded images — not applied to product cards per requirement |

---

## Before / After Summary

| Symptom | Before | After |
|---------|--------|-------|
| Product card images | Broken icon (Cloudinary 400) | Uploaded product photos display |
| Search tap on iPhone | Safari zooms page | Stable — 16px input |
| Mobile horizontal scroll | Occasional on homepage rails | No overflow on tested pages |
| PDP gallery thumbs | Broken (same transform bug) | Load correctly |

---

## Files Modified (frontend only)

```
src/utils/productImageUtils.js
src/components/Marketplace/ProductCard.jsx
src/components/Products/ProductGallery.jsx
src/components/Route/ProductCard/MobileProductCard.jsx
src/ui-polish/responsivePolish.css
src/components/Marketplace/cards/marketplaceCards.css
e2e/tests/mobile-stability.spec.js (verification)
```

No database changes. No business logic changes. No placeholder images introduced.

---

*Report generated as part of the Mobile UX & Image Stability sprint.*
