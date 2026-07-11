# Production Go-Live Checklist

Complete these two steps to unblock live verification. Phase 11 must not start until both pass.

---

## Step 1 — Enable GitHub Pages (repo admin, ~2 minutes)

1. Open: **https://github.com/BoneraBlaise/yebo-marketplace/settings/pages**
2. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` → `/ (root)` → **Save**
3. Wait 2–5 minutes for the first publish.
4. Confirm: **https://bonerabliaise.github.io/yebo-marketplace/** returns HTTP 200 (not 404).

### Redeploy frontend (after `main` updates)

```bash
npm run deploy:gh-pages
```

This rebuilds, copies `404.html` for SPA refresh, and pushes to `gh-pages`.

---

## Step 2 — Backend CORS whitelist (backend repo / Render, ~5 minutes)

The Guriraline API blocks browser requests from GitHub Pages today.

**Required origin to allow:**

```
https://bonerabliaise.github.io
```

Browsers send this exact value (no `/yebo-marketplace` path).

### Express.js example (`guriraline-server`)

Find the CORS middleware (often `app.js` or `server.js`) and ensure allowed origins include:

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://bonerabliaise.github.io",
  // future:
  // "https://www.yebone.com",
  // "https://yebone.com",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: Origin not allowed"));
      }
    },
    credentials: true,
  })
);
```

Redeploy the backend on Render after changing CORS.

### Verify CORS (run locally after backend deploy)

```bash
npm run smoke:production
```

The two **WARN** lines for GitHub Pages origin should become **PASS**.

Or manually:

```powershell
$headers = @{ Origin = "https://bonerabliaise.github.io"; Accept = "application/json" }
Invoke-WebRequest -Uri "https://guriraline-server-7rac.onrender.com/api/v2/product/get-all-products" -Headers $headers -UseBasicParsing
```

Expected: **HTTP 201** (not 403).

---

## Step 3 — Live browser verification

After Steps 1 and 2:

| Check | URL / action |
|-------|----------------|
| Homepage | https://bonerabliaise.github.io/yebo-marketplace/ |
| Login | Use real credentials; no `CORS: Origin not allowed` in Network tab |
| Logout | Profile menu → logout; token cleared |
| Refresh | Reload page; session restored via `loadUser` |
| Products API | Network tab: `get-all-products` returns 201 |

---

## Current status

| Item | Status |
|------|--------|
| Phase 10 commits on `main` | Pushed (`bc2f38a`) |
| `gh-pages` branch | Redeploy after script fix |
| GitHub Pages enabled | **You must enable in Settings** |
| Backend CORS | **You must update `guriraline-server`** |

See also: `docs/BACKEND_CORS_REQUIREMENTS.md`, `docs/DEPLOYMENT.md`, `docs/PHASE_10_REPORT.md`.
