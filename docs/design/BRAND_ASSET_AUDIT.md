# Yebone — Brand Asset Discovery Audit

**Audit date:** August 6, 2026  
**Scope:** Frontend repository `guriraline_app-main` — discovery only  
**Rules:** No code changes, no file moves, no deletions, no renames

---

## Executive Summary

Yebone has **partial brand infrastructure** (text constants, a reusable logo component, and a runtime BrandEngine) but **does not have a centralized Brand Asset System** for image files. Logo and icon files are **scattered**, **duplicated**, and **imported inconsistently**. The most critical finding: **auth surfaces use a different logo file than the public header/footer**, and the auth PNG still renders the legacy **“Guriraline”** wordmark while copy says **“YEBONE”**.

### Recommendation: **B — Existing system exists but should be cleaned up**

| Option | Verdict |
|--------|---------|
| A. System is good — reuse as-is | ❌ Not supported by evidence |
| **B. System exists but needs cleanup** | ✅ **Selected** |
| C. No system — create one later | ❌ Overstated; foundations exist |

**Justification:** `brandConstants.js`, `YeboneLogo.jsx`, and `BrandEngine`/`BrandProvider` are reusable foundations, but image assets live in a misspelled `src/Assests/` folder with four logo PNG variants (only two referenced), a separate legacy auth PNG, seven+ public icon files with conflicting manifests, and unused CRA boilerplate (`src/logo.svg`). Cleanup and consolidation — not greenfield creation — is the correct path.

---

## Step 1 — Repository Scan Summary

Searches performed for: `logo`, `brand`, `favicon`, `icon`, `svg`, `png`, `apple-touch`, `manifest`, `og-image`, `twitter-image`, `yebone`, `guriraline`.

| Term | Primary locations |
|------|-------------------|
| Logo files | `src/Assests/Logo/*.png`, `public/favicon.svg`, `public/logo192.png`, `public/logo512.png` |
| Brand text | `src/ui-polish/brandConstants.js` |
| Brand runtime | `src/design-system/brand/BrandEngine.js`, `BrandProvider.jsx` |
| Logo component | `src/components/Home/YeboneLogo.jsx` |
| Favicon / PWA | `public/index.html`, `public/manifest.json`, `public/site.webmanifest` |
| OG / Twitter | `public/index.html`, `src/components/ui/PageMeta.jsx` |
| Guriraline (legacy) | Auth logo PNG (visual); config URLs (`serverConfig.js`); docs only in source text |
| Email templates | **None found** in frontend `src/` |

---

## Step 2 — Brand Asset Inventory

### Logo PNG files (`src/Assests/Logo/`)

| File | Type | Size (bytes) | Used? | Import count | Imported by |
|------|------|-------------|-------|--------------|-------------|
| `logo.png` | PNG | 3,631 | ✅ Yes | **2** | `AuthLayout.jsx`, `Assests/index.js` (barrel) |
| `logomobile.png` | PNG | 11,551 | ✅ Yes | **1** | `YeboneLogo.jsx` |
| `logo1.png` | PNG | 25,075 | ❌ No | **0** | — |
| `logo23.png` | PNG | 9,164 | ❌ No | **0** | — |

**Duplicate versions:** Four PNGs in the same folder; only two are referenced. Visual audit (production review screenshots) confirms `logo.png` displays **“Guriraline”** text; `logomobile.png` is used as icon-only mark with **“Yebone”** rendered as separate JSX text in `YeboneLogo.jsx`.

### Other image assets in `src/Assests/`

| File | Type | Size | Used? | Import count | Imported by |
|------|------|------|-------|--------------|-------------|
| `hero.png` | PNG | 450,903 | ⚠ Indirect | **1** (barrel only) | `Assests/index.js` — **barrel not imported elsewhere** |
| `laptop.png` | PNG | 38,483 | ❌ No | **0** | — |
| `animations/*.json` | Lottie | — | ✅ Yes | **1** | `OrderSuccessPage.jsx` |

### Public root icons & manifests (`public/`)

| File | Type | Size | Used? | Referenced by |
|------|------|------|-------|---------------|
| `favicon.svg` | SVG (embedded PNG) | 73,969 | ✅ Yes | `index.html`, `manifest.json`, `PageMeta.jsx` default OG |
| `favicon.ico` | ICO | 15,086 | ⚠ Possibly | Browsers may auto-request; **not linked in `index.html`** |
| `favicon-96x96.png` | PNG | 5,211 | ❌ No | **0 code references** |
| `apple-touch-icon.png` | PNG | 10,776 | ⚠ Partial | File exists; **`index.html` links `favicon.svg` for apple-touch** |
| `logo192.png` | PNG | 11,717 | ❌ No | **0 code references** (CRA default) |
| `logo512.png` | PNG | 36,676 | ❌ No | **0 code references** (CRA default) |
| `Icon - White.svg` | SVG | 4,089 | ❌ No | **0 code references** |
| `manifest.json` | JSON | — | ✅ Yes | `index.html` — icons: `favicon.svg` only |
| `site.webmanifest` | JSON | — | ⚠ Orphan | References **`/web-app-manifest-192x192.png`** and **`/web-app-manifest-512x512.png`** — **files do not exist on disk**; **not linked in `index.html`** |

### Unused CRA boilerplate

| File | Type | Used? |
|------|------|-------|
| `src/logo.svg` | SVG (React logo, `#61DAFB`) | ❌ **0 imports** — default Create React App artifact |

---

## Step 3 — Branding Folder Structure

### Directories that exist

| Path | Exists? | Purpose |
|------|---------|---------|
| `src/assets/` | ❌ No | Standard CRA path not used |
| `src/Assests/` | ✅ Yes (typo) | De facto image bucket: logos, hero, animations |
| `src/Assests/Logo/` | ✅ Yes | Logo PNG variants |
| `src/assets/brand/` | ❌ No | — |
| `src/design-system/` | ✅ Yes | Design tokens, components, **brand engine** (runtime theming — not static files) |
| `src/design-system/brand/` | ✅ Yes | `BrandEngine.js`, `BrandProvider.jsx` — **CSS variables / org theming**, not asset storage |
| `src/branding/` | ❌ No | — |
| `src/ui-polish/` | ✅ Yes | **`brandConstants.js`** — marketplace name, tagline, copy strings |
| `public/` | ✅ Yes | Static favicon, manifest, OG defaults |
| `public/icons/` | ❌ No | Icons live in `public/` root |
| `public/images/` | ❌ No | — |

### Centralized systems (non-file)

| Module | Role | Asset files? |
|--------|------|--------------|
| `src/ui-polish/brandConstants.js` | Single source for **text** brand (`MARKETPLACE_NAME = "YEBONE"`) | No |
| `src/components/Home/YeboneLogo.jsx` | Canonical **UI logo component** (icon PNG + “Yebone” text) | Imports `logomobile.png` directly |
| `src/design-system/brand/BrandEngine.js` | Runtime `--yebone-primary`, optional `--yebone-brand-logo` CSS var | Accepts logo **URL string**, no bundled assets |
| `src/Assests/index.js` | Asset barrel exporting `YeboneLogo` (misnamed — exports PNG path) + hero aliases | **Not imported by any file** |

**Conclusion:** Text branding is centralized; **image branding is not**.

---

## Step 4 — Logo Usage Audit

| Surface | Component | Asset used | Import / reference path |
|---------|-----------|------------|-------------------------|
| **Header** (all public routes) | `HomeHeader.jsx` → `YeboneLogo` | `logomobile.png` + JSX “Yebone” | `../../Assests/Logo/logomobile.png` |
| **Footer** (all public routes) | `HomeFooter.jsx` → `YeboneLogo` | Same | via `YeboneLogo.jsx` |
| **Login** | `Login.jsx` → `AuthLayout` | `logo.png` (Guriraline wordmark) | `../../Assests/Logo/logo.png` |
| **Sign up** | `Signup.jsx` → `AuthLayout` | Same | Same |
| **Forgot password** | `ForgotPassword.js` → `AuthLayout` | Same | Same |
| **Reset password** | `ResetPassword.js` → `AuthLayout` | Same | Same |
| **Auth page chrome** | `AuthPageChrome.jsx` | Text only: `MARKETPLACE_NAME` | `brandConstants.js` — no image |
| **Shop login** (`/shop-login`) | `ShopLogin.jsx` | **No logo** — text “Shop sign in” only | — |
| **Dashboard sidebar** | `DashboardSidebar.jsx` | **No logo** — nav items only | — |
| **Vendor sidebar** | `VendorSidebar.jsx` | **No logo** | — |
| **Admin** | Admin routes | **No logo component found** — text/constants only | `AI_POWERED_BY` from `brandConstants` |
| **Loading / Suspense** | `Loader.jsx` | **Text only** “Yebone” + tagline | No image |
| **Favicon** | `public/index.html` | `favicon.svg` | `%PUBLIC_URL%/favicon.svg` |
| **PWA manifest (active)** | `public/manifest.json` | `favicon.svg` | `"src": "favicon.svg"` |
| **PWA manifest (orphan)** | `public/site.webmanifest` | Missing PNGs | `/web-app-manifest-192x192.png`, `/web-app-manifest-512x512.png` |
| **Open Graph (default)** | `index.html`, `PageMeta.jsx` | `favicon.svg` | `/favicon.svg` |
| **Twitter card** | `PageMeta.jsx` | Same as OG | `twitter:image` → favicon |
| **Product PDP OG** | `ProductDetailsPage.jsx` | Product image or fallback `/favicon.svg` | Dynamic |
| **Emails** | — | **NOT FOUND** in frontend repo | — |
| **Vendor white-label** | `BrandEngine` / `useBrand()` | Optional `brand.logo` URL at runtime | `VendorPageShell`, `StoreSettings` — **no default logo file** |

### Import map (logo-related)

```
logomobile.png
  └── YeboneLogo.jsx (1)
        ├── HomeHeader.jsx (1)
        └── HomeFooter.jsx (1)

logo.png
  ├── AuthLayout.jsx (1)
  └── Assests/index.js (1) → UNUSED barrel export

brandConstants.js (text only)
  ├── AuthPageChrome.jsx
  ├── AuthLayout.jsx (alt text only)
  ├── Login.jsx, Signup.jsx, ForgotPassword.js, ResetPassword.js
  ├── HomeFooter.jsx (copyright text inline)
  ├── PageMeta.jsx (SITE_NAME = "Yebone" — separate constant)
  └── 10+ customer/vendor/admin views (copy only)

favicon.svg
  ├── public/index.html (icon, apple-touch, og:image)
  ├── public/manifest.json
  └── PageMeta.jsx / ProductDetailsPage.jsx (OG fallback)
```

---

## Step 5 — Brand Consistency Findings

### Duplicate logo files

| Issue | Evidence |
|-------|----------|
| Two active logo PNGs for same product | `logo.png` (auth) vs `logomobile.png` (header/footer) |
| Two unused logo PNGs | `logo1.png`, `logo23.png` — zero imports |
| CRA legacy PNGs | `logo192.png`, `logo512.png` — zero imports |
| Default React SVG | `src/logo.svg` — unused |

### Old Guriraline assets

| Issue | Evidence |
|-------|----------|
| Auth logo PNG renders “Guriraline” | Playwright: `desktop-1920-login.png`; file `src/Assests/Logo/logo.png` |
| Alt text says YEBONE but image does not | `AuthLayout.jsx`: `alt={MARKETPLACE_NAME}` with Guriraline PNG |
| Legacy hostname in config (not visual) | `serverConfig.js`: `guriraline-socket-awo9.onrender.com` |

### Unused logos / icons

- `logo1.png`, `logo23.png`, `laptop.png`, `hero.png` (via unused barrel), `src/logo.svg`
- `favicon.ico`, `favicon-96x96.png`, `apple-touch-icon.png`, `logo192.png`, `logo512.png`, `Icon - White.svg`
- `site.webmanifest` (not linked; points to missing files)

### Multiple favicon / manifest versions

| File | Linked in HTML? | Icons defined |
|------|-----------------|---------------|
| `manifest.json` | ✅ Yes | `favicon.svg` only |
| `site.webmanifest` | ❌ No | Missing 192/512 PNG paths |
| `favicon.svg` | ✅ Yes | Primary |
| `favicon.ico` | ❌ No | Orphan |
| `apple-touch-icon.png` | ❌ No (SVG used instead) | Orphan file |

### Hardcoded image paths

| Path | Location |
|------|----------|
| `../../Assests/Logo/logomobile.png` | `YeboneLogo.jsx` |
| `../../Assests/Logo/logo.png` | `AuthLayout.jsx` |
| `/favicon.svg` | `PageMeta.jsx`, `index.html`, `ProductDetailsPage.jsx` |
| `https://via.placeholder.com/*` | Not brand — but `ShopHero.jsx`, `ShopReviewsSection.jsx` avatar fallbacks |
| Freepik URL background | `ShopLogin.jsx` — external stock photo, no brand mark |

### Direct imports vs shared source

| Pattern | Status |
|---------|--------|
| Text brand | ✅ Centralized in `brandConstants.js` |
| UI logo component | ⚠ Partial — `YeboneLogo` shared for header/footer only |
| Auth logo | ❌ **Direct import** of different PNG in `AuthLayout.jsx` — bypasses `YeboneLogo` |
| Favicon / OG | ⚠ Hardcoded `/favicon.svg` in multiple places — no shared constant |
| BrandEngine logo URL | ⚠ Infrastructure exists but **no default logo wired** at app root (`index.js` does not mount `DesignSystemProvider`) |

### Naming inconsistency

- Folder spelled **`Assests`** (typo for Assets)
- Barrel exports PNG as `YeboneLogo` while component is also named `YeboneLogo` — confusing overlap
- `PageMeta.jsx` uses `SITE_NAME = "Yebone"` (mixed case) vs `MARKETPLACE_NAME = "YEBONE"` (uppercase)

---

## Step 6 — Recommendation Detail

### Why not A (good as-is)

- Auth and public surfaces use **different logo files** with **different brand names** (Guriraline vs Yebone)
- **Seven orphan icon files** in `public/`
- **Broken `site.webmanifest`** references
- **No single import path** for logo assets
- **`Assests/index.js` barrel is dead code**

### Why not C (no system)

- `brandConstants.js` already centralizes copy
- `YeboneLogo.jsx` is the de facto standard for chrome
- `BrandEngine` supports org-level logo URL and CSS variables for vendor white-label
- Consolidation builds on existing modules — does not require inventing architecture from zero

### Why B (cleanup)

The **scaffolding exists**; **asset discipline does not**. A cleanup pass should:

1. Unify auth + chrome on one logo asset strategy (via `YeboneLogo` or equivalent)
2. Retire Guriraline PNG and unused variants (`logo1`, `logo23`)
3. Pick one manifest + one favicon set; remove or fix orphans
4. Document canonical paths without necessarily renaming `Assests/` yet (rename = implementation)

---

## Step 7 — Recommended Architecture (Documentation Only)

**Target state** — for a future implementation sprint, not this audit:

```
src/
  ui-polish/
    brandConstants.js          # Text: names, taglines, copy (KEEP)
  components/
    brand/
      YeboneLogo.jsx           # Single logo component (MOVE/refactor from Home/)
      index.js                 # export { YeboneLogo, BRAND_ASSETS }
  Assests/                     # Or rename → assets/brand/ (future)
    brand/
      logo-icon.png            # Icon mark only (current logomobile.png)
      logo-lockup.svg          # Optional full lockup for auth/print
      og-default.png           # 1200×630 social share (not favicon)
  design-system/brand/         # Runtime theming (KEEP)
public/
  favicon.svg
  favicon.ico                  # If kept, link explicitly
  apple-touch-icon.png         # If kept, link explicitly
  manifest.json                # Single manifest, all icon sizes listed
```

**Import rule (future):** Components import from `@/components/brand` or `brandConstants` — never deep-path into `Assests/Logo/` directly except the brand module itself.

---

## Migration Plan (Documentation Only — Do Not Execute)

### Phase 1 — Auth brand fix (P1, highest business impact)

1. Replace `AuthLayout` logo source with same strategy as `YeboneLogo` (icon + text, or new Yebone lockup PNG)
2. Remove dependency on Guriraline `logo.png` for customer-facing auth
3. Verify login, sign-up, forgot/reset password at 390px and 1920px

### Phase 2 — Asset deduplication (P2)

1. Audit visually: `logo1.png`, `logo23.png` — archive if redundant
2. Delete or gitignore unused CRA files: `src/logo.svg`, `logo192.png`, `logo512.png` (after confirming build)
3. Either link or remove: `favicon.ico`, `apple-touch-icon.png`, `favicon-96x96.png`, `Icon - White.svg`
4. Fix or remove `site.webmanifest`; consolidate into `manifest.json` with 192/512 entries

### Phase 3 — Import centralization (P2)

1. Wire `AuthLayout` to use `YeboneLogo` (with `showLogo` prop) instead of raw `<img>`
2. Add `BRAND_OG_IMAGE` constant next to `MARKETPLACE_NAME` in `brandConstants.js`
3. Update `PageMeta.jsx` to import from `brandConstants` (eliminate duplicate `SITE_NAME`)
4. Evaluate mounting `DesignSystemProvider` at root with default `brand.logo` path

### Phase 4 — Folder hygiene (P3)

1. Rename `Assests` → `assets` (single commit, update all imports) — optional spelling fix
2. Move logo PNGs to `assets/brand/`
3. Populate `Assests/index.js` or replace with explicit `assets/brand/index.js`
4. Add `docs/design/BRAND_ASSETS.md` manifest listing canonical files (operational doc)

### Phase 5 — Gaps outside frontend (P3)

1. Email templates — **NOT FOUND** in this repo; verify backend/mail service for Guriraline branding
2. OG image — replace favicon-as-OG with dedicated 1200×630 asset for social sharing
3. Admin/vendor dashboard — optional logo in sidebar for parity with public chrome

---

## Appendix A — Files Not Verified Visually

| Item | Note |
|------|------|
| Exact pixel content of `logomobile.png` | Assumed icon-only per `YeboneLogo.jsx` comment; not hex-dumped |
| `favicon.svg` embedded PNG content | Large base64 SVG; used as brand icon in browser tab |
| Backend email logos | Out of repo scope |

---

## Appendix B — Quick Reference Counts

| Metric | Count |
|--------|-------|
| Logo PNG files on disk | 4 |
| Logo PNG files imported | 2 |
| Unused logo PNG files | 2 |
| Public icon/manifest files | 9 |
| Orphan public icon files | 6+ |
| Components displaying logo image | 2 paths (YeboneLogo + AuthLayout) |
| Central text brand module | 1 (`brandConstants.js`) |
| Email templates in frontend | 0 |

---

*End of Brand Asset Discovery Audit — no files were modified.*
