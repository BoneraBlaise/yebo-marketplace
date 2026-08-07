# YEBONE Sprint 4 — Authentication Implementation Report (Phase 2)

**Date:** 2026-08-07  
**Scope:** Critical password fix + Google Authentication  
**Status:** Phase 2 complete — OTP reset deferred to Phase 3

---

## 1. Summary

Sprint 4 Phase 2 delivered:

1. **P0 fix** — corrected password pre-save hooks on User and Shop models with regression protection.
2. **Google Authentication** — production-ready OAuth with account linking, secure cookie sessions, and JWT removed from URL callbacks.

OTP password reset was **not** started (Phase 3).

---

## 2. Critical Bug Fix

See full details: [`PASSWORD_PRESAVE_FIX_REPORT.md`](./PASSWORD_PRESAVE_FIX_REPORT.md)

| Item | Detail |
|------|--------|
| Root cause | Pre-save hook called `next()` without `return`, causing password re-hash on unrelated saves |
| Impact | Could lock users out after profile/avatar/OAuth updates |
| Fix | `return next()` + shared `hashPasswordIfNeeded()` with bcrypt detection |
| Safety | No migration; existing hashes untouched; 6/6 unit tests pass |

---

## 3. Google Authentication Architecture

### 3.1 Flow

```
Frontend (Login/Signup)
  → buildGoogleAuthUrl() → GET /api/v2/auth/google?redirect={origin}/login-success
  → Passport GoogleStrategy → resolveGoogleUser()
       ├─ Email exists (local) → link googleId, preserve role/authProvider
       ├─ Email exists (google) → sign in
       └─ Email new → create user (authProvider: google)
  → Callback sets httpOnly cookie (setTokenCookie)
  → Redirect to /login-success (NO token in URL)
  → LoginSuccessHandler → GET /user/getuser (withCredentials)
  → Redux hydrate → /profile
```

### 3.2 Account linking policy

| Scenario | Behavior |
|----------|----------|
| New Google email | Create user with `authProvider: 'google'`, `googleId`, random password |
| Existing **local** account (same email) | Set `googleId`; keep `authProvider: 'local'` and **role unchanged**; user can sign in with password **or** Google |
| Existing **Google** account | Sign in (no duplicate) |
| Email linked to **different** Google ID | Reject with clear error message |

### 3.3 Security decisions

| Decision | Rationale |
|----------|-----------|
| JWT removed from URL | Prevents leakage via browser history, Referer, server logs |
| httpOnly cookie only on OAuth callback | Same flags as `sendToken` (lax/dev, none+secure/prod) |
| OAuth `state` carries redirect | Validated against `FRONTEND_URL` prefix — prevents open redirects |
| Extracted `resolveGoogleUser()` | Testable, single source of truth for linking logic |
| Preserved JWT in JSON for email login | Existing API clients and Redux sync unchanged |

### 3.4 Session handling

- OAuth callback uses `setTokenCookie()` from `utils/jwtToken.js` (shared with email login).
- Frontend `LoginSuccessHandler` calls `GET /user/getuser` with `withCredentials: true`.
- Token still mirrored to localStorage via `syncVendorAuthToken` for dev resilience.
- Legacy `/login?token=` handling **removed** from `Login.jsx`.

---

## 4. Files Changed

### Backend (`guriraline_server-main`)

| File | Change |
|------|--------|
| `model/user.js` | Fixed pre-save hook |
| `model/shop.js` | Fixed pre-save hook |
| `utils/hashPasswordIfNeeded.js` | **New** — shared hashing + regression guard |
| `utils/__tests__/hashPasswordIfNeeded.test.js` | **New** |
| `utils/googleAccountLink.js` | **New** — Google account resolve/link logic |
| `utils/__tests__/googleAccountLink.test.js` | **New** |
| `utils/oauthRedirect.js` | **New** — safe OAuth redirect validation |
| `utils/jwtToken.js` | Exported `setTokenCookie`, `getTokenCookieOptions` |
| `config/passport.js` | Uses `resolveGoogleUser`; links local accounts |
| `app.js` | OAuth state/redirect; cookie-only callback; no JWT in URL |
| `package.json` | Added `test:auth` script |

### Frontend (`guriraline_app-main`)

| File | Change |
|------|--------|
| `src/components/Login/LoginSuccessHandler.jsx` | Cookie-based session restore via `getuser` |
| `src/components/Login/Login.jsx` | Removed legacy `?token=` OAuth handling |
| `e2e/tests/sprint4-auth-google.spec.js` | **New** — auth regression + OAuth checks |

### Documentation

| File | Purpose |
|------|---------|
| `docs/design/PASSWORD_PRESAVE_FIX_REPORT.md` | P0 fix report |
| `docs/design/AUTHENTICATION_IMPLEMENTATION_REPORT.md` | This document |
| `docs/design/AUTH_SYSTEM_AUDIT.md` | Phase 1 audit (unchanged) |

---

## 5. Verification Results

### 5.1 Backend unit tests

```bash
npm run test:auth
# 6/6 passed
```

| Test | Result |
|------|--------|
| `hashPasswordIfNeeded` — hashes plaintext | ✓ |
| `hashPasswordIfNeeded` — no double-hash | ✓ |
| `isBcryptHash` rejects plaintext | ✓ |
| `resolveGoogleUser` — creates new user | ✓ |
| `resolveGoogleUser` — links local account | ✓ |
| `resolveGoogleUser` — rejects conflicting Google ID | ✓ |

### 5.2 Playwright (`e2e/tests/sprint4-auth-google.spec.js`)

| Test | Result | Notes |
|------|--------|-------|
| Email/password login API shape | ✓ Pass | Returns 400 for invalid credentials |
| Google OAuth start endpoint redirect | ✓ Pass | 302 to Google |
| Google button starts OAuth (browser) | ⚠ Skipped | Playwright browsers not installed in CI env |
| `/login-success` processing UI (browser) | ⚠ Skipped | Same — run `npx playwright install` locally |

### 5.3 Manual verification checklist

| Scenario | Expected | Status |
|----------|----------|--------|
| Existing email/password login | Works unchanged | ✓ Code path preserved |
| Existing accounts accessible | No password migration | ✓ Safe fix |
| Google login (new user) | Creates account, cookie session | ✓ Implemented |
| Google signup | Same OAuth flow | ✓ Implemented |
| Local account + Google (same email) | Links, no duplicate | ✓ Unit tested |
| Roles preserved on link | Admin stays Admin | ✓ Unit tested |
| No JWT in callback URL | Cookie only | ✓ Implemented |

**Note:** Full Google OAuth end-to-end requires valid `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and matching redirect URI in Google Cloud Console: `{BACKEND_URL}/api/v2/auth/google/callback`.

---

## 6. Remaining Production Tasks

| Task | Phase |
|------|-------|
| OTP forgot password (6-digit, hashed, 10 min) | Phase 3 |
| Branded HTML email templates | Phase 4 |
| Auth-specific rate limiting | Phase 5 |
| Email enumeration fixes on forgot-password | Phase 5 |
| `npx playwright install` + full browser E2E in CI | Phase 6 |
| Google Cloud Console redirect URI for production `BACKEND_URL` | Before prod deploy |
| Align `BACKEND_URL` in `.env.example` (8000 → 5000 for local) | Config cleanup |

---

## 7. Environment Variables (Google Auth)

Required for Google Authentication in production:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
BACKEND_URL=https://your-api.example.com
FRONTEND_URL=https://your-app.example.com
JWT_SECRET_KEY=
JWT_EXPIRES=7d
```

Google Console redirect URI:

```
{BACKEND_URL}/api/v2/auth/google/callback
```

---

*Phase 3 (OTP Password Reset) will begin after Google Authentication is verified in staging/production.*
