# Homepage Category Refinement Report

**Date:** 2026-08-06  
**Sprint:** Production homepage category grid refinement  
**Database:** Not modified  
**Business logic:** Unchanged (`MAIN_CATEGORIES` preserved for product filtering, mobile nav, category landing)

---

## Summary

The homepage “Shop by category” grid now displays **exactly 15 curated categories** in a fixed production order. Removed categories remain in the system for browse/navigation elsewhere but no longer appear on the homepage grid.

**Playwright:** 13/13 passed (`e2e/tests/homepage-categories.spec.js`)

---

## Categories Before (16 on homepage)

Sourced from `MAIN_CATEGORIES` via `homeMarketplaceCategories.js`:

| # | Category |
|---|----------|
| 1 | Electronics |
| 2 | Phones |
| 3 | Computers |
| 4 | Fashion |
| 5 | Beauty |
| 6 | Home & Furniture |
| 7 | Groceries |
| 8 | Automotive |
| 9 | Sports & Outdoors |
| 10 | Books |
| 11 | Baby |
| 12 | Pets |
| 13 | Health |
| 14 | Office & School |
| 15 | Gaming |
| 16 | Cameras |

---

## Categories After (15 on homepage)

Curated list in `HOME_DISPLAY_CATEGORIES` (`homeMarketplaceCategories.js`):

| # | Category | Navigation |
|---|----------|------------|
| 1 | Phones | `/products?category=Phones` |
| 2 | Electronics | `/products?category=Electronics` |
| 3 | Computers | `/products?category=Computers` |
| 4 | Fashion | `/products?category=Fashion` |
| 5 | Beauty | `/products?category=Beauty` |
| 6 | Home & Furniture | `/products?category=Home+%26+Furniture` |
| 7 | **Property** | `/property-mobility?listingType=property` |
| 8 | **Mobility** | `/property-mobility?listingType=vehicle` |
| 9 | Baby | `/products?category=Baby` |
| 10 | Gaming | `/products?category=Gaming` |
| 11 | Cameras | `/products?category=Cameras` |
| 12 | **Sports Wear** | `/products?search=sports+wear` |
| 13 | **Sports Accessories** | `/products?search=sports+accessories` |
| 14 | **School Materials** | `/products?category=Office+%26+School` |
| 15 | Groceries | `/products?category=Groceries` |

---

## Removed from Homepage (still in system)

| Category | Status |
|----------|--------|
| Health | Removed from homepage grid; remains in `MAIN_CATEGORIES` |
| Pets | Removed from homepage grid; remains in `MAIN_CATEGORIES` |
| Books | Removed from homepage grid; remains in `MAIN_CATEGORIES` |
| Office & School | Removed from grid; surfaced as **School Materials** |
| Automotive | Removed from grid; replaced by **Mobility** |
| Sports & Outdoors | Split into **Sports Wear** + **Sports Accessories** on homepage |

---

## New / Renamed Homepage Categories

### Property
- Represents: houses, apartments, land, commercial property
- Links to property-mobility hub
- Cover image: Unsplash real-estate photograph

### Mobility
- Represents: cars, motorcycles, bicycles, car parts, car accessories
- Links to vehicle listings hub
- Replaces Automotive on homepage only

### Sports Wear / Sports Accessories
- Split from former “Sports & Outdoors” homepage tile
- Search-based product discovery (no `MAIN_CATEGORIES` change)

### School Materials
- Display label for school/office supplies
- Routes to existing Office & School product filter

---

## Category Images

Several legacy Unsplash photo IDs returned **HTTP 404**. Updated working URLs in `categoryPhotoMap.js`:

| Category | Fix |
|----------|-----|
| Beauty | Updated to working makeup photo |
| Baby | Updated to working nursery photo |
| Cameras | Updated to working mirrorless camera photo |
| Property | New dedicated real-estate photo |
| Mobility | Verified working vehicle photo |
| Sports Wear | Sports/fitness lifestyle photo |
| Sports Accessories | Gym equipment photo |
| School Materials | Books/learning photo |

All **15** homepage category cards load with `naturalWidth > 0` — no broken-image icons.

Existing card style preserved: 1:1 aspect ratio, gradient overlay, Poppins title typography, hover lift on desktop.

---

## Responsive Verification

### Mobile (390, 393, 414, 430 px)

| Check | Result |
|-------|--------|
| 15 categories visible | ✅ |
| No horizontal overflow | ✅ |
| Images load | ✅ |
| Cards not clipped | ✅ |

### Desktop (768, 1024, 1280, 1440 px)

| Check | Result |
|-------|--------|
| 6-column grid at ≥1024px | ✅ |
| 4-column grid at 768px | ✅ |
| No horizontal overflow | ✅ |
| Professional spacing | ✅ |

### Navigation

| Category | Result |
|----------|--------|
| Property → property hub | ✅ |
| Mobility → vehicle hub | ✅ |

---

## Screenshots

**Location:** `e2e/audit-screenshots/homepage-categories/`

### Mobile
- `categories-mobile-390.png`
- `categories-mobile-393.png`
- `categories-mobile-414.png`
- `categories-mobile-430.png`

### Desktop
- `categories-desktop-768.png`
- `categories-desktop-1024.png`
- `categories-desktop-1280.png`
- `categories-desktop-1440.png`

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/Home/homeMarketplaceCategories.js` | Curated `HOME_DISPLAY_CATEGORIES` (15 items) |
| `src/components/Home/HomeCategories.jsx` | Uses `category.href`; updated subtitle |
| `src/components/Home/categoryPhotoMap.js` | New category photos + fixed 404 URLs |
| `src/components/Home/mainCategoryHierarchy.js` | Comment only — `MAIN_CATEGORIES` unchanged |
| `e2e/tests/homepage-categories.spec.js` | Verification spec |

---

## Playwright Results

| Test | Result |
|------|--------|
| Displays exactly 15 target categories | ✅ |
| Removed categories not on grid | ✅ |
| All category images load | ✅ |
| Mobile overflow (4 viewports) | ✅ |
| Desktop overflow (4 viewports) | ✅ |
| Property navigation | ✅ |
| Mobility navigation | ✅ |

**Total: 13/13 passed**

---

*Homepage category section is production-ready. No database or business logic changes.*
