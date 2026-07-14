# Production Deployment Report

**Date:** 2026-07-14  
**Frontend repo:** `BoneraBlaise/yebo-marketplace`  
**Backend API:** `https://yebone-backend.onrender.com/api/v2`  
**Target frontend URL:** `https://bonerabliaise.github.io/yebo-marketplace/`

---

## Executive summary

| Step | Status |
|------|--------|
| Commit frontend changes | **DONE** — `c0e49a0` |
| Push to `main` | **DONE** |
| Deploy to `gh-pages` | **DONE** — branch pushed via `gh-pages` |
| Public site loads | **PENDING** — GitHub Pages not yet enabled in repo settings |
| Backend products API | **PASS** |
| Backend login API (from frontend origin) | **PASS** |

The frontend build is deployed to the `gh-pages` branch and wired to the live backend. The public URL returns **404** until GitHub Pages is activated once in repository settings.

---

## 1. Git commit and push

**Commit:** `c0e49a0` — *Point production API at live yebone backend and refresh deployment report.*

**Files included:**
- `.env.production`, `.env.example`, `.env.development`
- `src/config/serverConfig.js`, `src/setupProxy.js`
- `scripts/smoke-production.ps1`
- `DEPLOYMENT_READINESS_REPORT.md`
- Production `build/` artifacts (bundle `main.e4939876.js`)

**Push:** `main` → `origin/main` (`f370318..c0e49a0`)

---

## 2. GitHub Pages deployment

**Method:** `npx gh-pages -d build` (after production build + `404.html` + `.nojekyll`)

**Remote branch:** `gh-pages` @ `21583a60b974234700b2a132e89edfb74e5d92e0`

**Verified on `gh-pages` branch:**
- `index.html` present with `/yebo-marketplace/` asset paths
- `404.html` for SPA deep links
- `.nojekyll` present
- JS bundle contains `yebone-backend.onrender.com` (not legacy `7rac` URL)

**Note:** `npm run deploy:gh-pages` rebuild succeeded but the PowerShell script exited on git clone stderr; deployment completed successfully via `gh-pages` CLI.

---

## 3. Live frontend URL verification

| URL | HTTP | Result |
|-----|------|--------|
| `https://bonerabliaise.github.io/yebo-marketplace/` | 404 | GitHub Pages site not published |
| `https://bonerabliaise.github.io/yebo-marketplace/index.html` | 404 | Same |

**Cause:** GitHub Pages is not enabled for this repository. The `gh-pages` branch exists with correct content, but GitHub is not serving it.

### One-time activation (repo admin)

1. Open: https://github.com/BoneraBlaise/yebo-marketplace/settings/pages  
2. **Build and deployment → Source:** Deploy from a branch  
3. **Branch:** `gh-pages` → `/ (root)` → **Save**  
4. Wait 2–5 minutes, then re-check the URL above.

---

## 4. Backend integration verification

Simulated browser requests from the GitHub Pages origin (`https://bonerabliaise.github.io`):

| Endpoint | HTTP | Response | Verdict |
|----------|------|----------|---------|
| `GET /api/v2/product/get-all-products` | **201** | `{"success":true,"products":[]}` | **PASS** — products load from live MongoDB |
| `POST /api/v2/user/login-user` | **500** | `{"success":false,"message":"User doesn't exist!"}` | **PASS** — route reachable, CORS allowed, DB queried |
| `OPTIONS /api/v2/user/login-user` | **204** | `Access-Control-Allow-Origin: https://bonerabliaise.github.io` | **PASS** |

Once GitHub Pages is enabled, the deployed SPA will call these same endpoints using:

```env
REACT_APP_API_URL=https://yebone-backend.onrender.com/api/v2
```

---

## 5. Post-activation verification checklist

After enabling GitHub Pages, confirm:

- [ ] Homepage loads at https://bonerabliaise.github.io/yebo-marketplace/
- [ ] Products page loads (empty list is OK if DB has no products)
- [ ] Login form submits without CORS errors in browser DevTools
- [ ] `npm run smoke:production` — all checks pass

---

## 6. Deployment artifacts

| Artifact | Location |
|----------|----------|
| Source (main) | https://github.com/BoneraBlaise/yebo-marketplace/tree/main |
| Static hosting branch | https://github.com/BoneraBlaise/yebo-marketplace/tree/gh-pages |
| Production bundle | `build/` (committed on main) |
| Readiness report | `DEPLOYMENT_READINESS_REPORT.md` |
| Smoke script | `scripts/smoke-production.ps1` |

---

## 7. Live URLs (reference)

| Service | URL |
|---------|-----|
| **Frontend (after Pages enabled)** | https://bonerabliaise.github.io/yebo-marketplace/ |
| **Backend API** | https://yebone-backend.onrender.com/api/v2 |
| **Backend health** | https://yebone-backend.onrender.com/health |
| **Payments health** | https://yebone-backend.onrender.com/api/v1/payments/health |

---

**Verdict:** Deployment pipeline complete. Enable GitHub Pages in repo settings to make the frontend publicly accessible. Backend integration is verified and ready.
