# Backend CORS Requirements (Phase 10)

The Yebone frontend is a static SPA. In production it calls the Guriraline API directly from the browser. The backend **must** whitelist the production frontend origin or all API requests return `403 CORS: Origin not allowed`.

## Verified blocker (2026-07-11)

| Origin | `GET /product/get-all-products` | `POST /user/login-user` |
|--------|--------------------------------|-------------------------|
| `http://localhost:3000` | Allowed | Allowed |
| `https://bonerabliaise.github.io` | **403** | **403** |
| `https://bonerabliaise.github.io/yebo-marketplace` | **403** | **403** |

Browsers send `Origin: https://bonerabliaise.github.io` (no path suffix).

## Required backend change

In `guriraline-server` CORS configuration (Render), add:

```
http://localhost:3000
https://bonerabliaise.github.io
```

Future custom domain (Phase 15):

```
https://www.yebone.com
https://yebone.com
```

## LAN development

LAN IPs are **not** whitelisted. Development uses `setupProxy.js` Origin rewrite — do not remove.

## Who can fix

Backend repository (`guriraline-server-7rac.onrender.com`) — **not in this frontend repo**.

Until CORS is updated, production login/API calls from GitHub Pages or Netlify will fail in the browser even when the frontend build is correct.
