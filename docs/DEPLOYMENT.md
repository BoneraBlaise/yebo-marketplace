# Yebone Frontend — Deployment Guide (Phase 10)

## Production targets

| Host | URL | Status |
|------|-----|--------|
| GitHub Pages | `https://bonerabliaise.github.io/yebo-marketplace/` | `gh-pages` branch deployed; enable Pages in repo Settings |
| Netlify | Connect `main` branch | `netlify.toml` configured |
| Custom domain | `www.yebone.com` | Phase 15 — DNS not live |

## Environment variables

### Production (`.env.production` — committed, no secrets)

```env
REACT_APP_API_URL=https://yebone-backend.onrender.com/api/v2
REACT_APP_SOCKET_URL=https://guriraline-socket-awo9.onrender.com
REACT_APP_APP_URL=https://bonerablaise.github.io/yebo-marketplace
```

CRA bakes these into the bundle at `npm run build`. Production builds **do not** use `setupProxy.js`.

### Development (`.env.development`)

Uses dev proxy via `setupProxy.js` and `HOST=0.0.0.0` for LAN testing.

### Optional (local only — never commit values)

- `REACT_APP_GEMINI_API_KEY`
- `REACT_APP_OPENROUTER_API_KEY`

## Build

```bash
npm run build
```

Output: `build/` with assets under `/yebo-marketplace/` (from `homepage` in `package.json`).

Router uses `basename={process.env.PUBLIC_URL}` in `App.js` for subdirectory hosting.

## Smoke test

```bash
npm run smoke:production
```

Checks API health, auth endpoints, CORS for production origin, and verifies build output exists.

## Deploy to GitHub Pages

### Option A — npm (may fail on Windows with `ENAMETOOLONG`)

```bash
npm run deploy
```

### Option B — PowerShell script (recommended on Windows)

```bash
npm run deploy:gh-pages
```

This script:

1. Runs `npm run build`
2. Copies `build/index.html` → `build/404.html` (SPA deep-link refresh)
3. Pushes to `gh-pages` branch via a short-path worktree (`C:\yebo-ghp`)

### Enable GitHub Pages

1. GitHub → **Settings → Pages**
2. Source: branch **`gh-pages`**, folder **`/ (root)`**
3. Wait 2–5 minutes for propagation

## Backend CORS (required)

Before production auth works, backend must whitelist `https://bonerabliaise.github.io`. See `docs/BACKEND_CORS_REQUIREMENTS.md`.

## Netlify deploy

1. Connect repository `BoneraBlaise/yebo-marketplace`
2. Build command: `npm run build`
3. Publish directory: `build`
4. Set env vars in Netlify UI (same as `.env.production`, with your Netlify URL as `REACT_APP_APP_URL`)
5. Add Netlify URL to backend CORS whitelist

## Verification checklist

- [ ] Homepage HTTP 200
- [ ] JS/CSS assets load (check Network tab — paths under `/yebo-marketplace/static/`)
- [ ] `GET /product/get-all-products` succeeds from browser (no CORS error)
- [ ] Login returns API response (not CORS 403)
- [ ] Logout clears session
- [ ] Page refresh restores session (`loadUser` + Bearer token)
- [ ] Cart persists after refresh (`localStorage.cartItems`)
