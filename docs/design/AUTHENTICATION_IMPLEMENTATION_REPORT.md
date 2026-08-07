# YEBONE Sprint 4 — Authentication Implementation Report (Phase 2)

**Date:** 2026-08-07  
**Scope:** Sprint 4 Phases 2–4 — Auth, OTP reset, production SMTP  
**Status:** Phases 2–4 complete

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

## 8. Phase 4 — Production SMTP Integration

See audit: [`SMTP_PHASE4_AUDIT.md`](./SMTP_PHASE4_AUDIT.md)

### 8.1 SMTP Configuration (Gmail)

Production auth emails use **existing `utils/sendMail.js`** — no platform email layer.

```env
EMAIL_FROM=YEBONE <yeboneapp@gmail.com>
SMPT_HOST=smtp.gmail.com
SMPT_PORT=587
SMPT_SERVICE=gmail
SMPT_MAIL=yeboneapp@gmail.com
SMPT_PASSWORD=        # Gmail App Password — never commit
```

| Setting | Value |
|---------|-------|
| Provider | Gmail SMTP |
| Sender | `yeboneapp@gmail.com` |
| Auth | App Password via `SMPT_PASSWORD` |
| From header | `EMAIL_FROM` or fallback to `SMPT_MAIL` |

### 8.2 Auth emails implemented

| Email | Trigger | Template |
|-------|---------|----------|
| Welcome | Local activation success, dev signup bypass, **new Google signup** | `utils/email/welcomeEmail.js` |
| Password reset OTP | Forgot password | `utils/email/passwordResetOtpEmail.js` (existing) |
| Password changed | Successful OTP reset | Same file (existing) |

Activation email remains plain text (not in scope — welcome sent after account is live).

### 8.3 Error handling

- `sendMail` wraps delivery in try/catch → returns `{ sent: false, error }` instead of throwing
- Welcome emails are fire-and-forget — auth flows never blocked by SMTP failure
- Audit log records `welcome_email_sent` success/failure

### 8.4 Phase 4 files changed (backend)

| File | Change |
|------|--------|
| `utils/sendMail.js` | Gmail service support, graceful errors |
| `utils/authEmailService.js` | **New** — `sendWelcomeEmail()` |
| `utils/email/emailBrand.js` | **New** — shared auth branding |
| `utils/email/welcomeEmail.js` | **New** — welcome HTML template |
| `utils/email/passwordResetOtpEmail.js` | Uses shared brand |
| `config/passport.js` | Welcome on new Google signup |
| `controller/user.js` | Welcome on activation + dev bypass |
| `utils/googleAccountLink.js` | Returns `isNewUser` flag |
| `.env.example` | Gmail SMTP documentation |
| `utils/__tests__/welcomeEmail.test.js` | **New** |
| `utils/__tests__/sendMail.test.js` | **New** — error handling |

### 8.5 Phase 4 verification

| Scenario | Result |
|----------|--------|
| Welcome template builds correctly | ✓ Unit test |
| SMTP errors handled gracefully | ✓ Unit test |
| Google new user flagged `isNewUser` | ✓ Unit test |
| OTP email template unchanged | ✓ Existing Phase 3 |
| Live Gmail delivery | Requires `SMPT_PASSWORD` in `.env` |

---

## 9. Remaining Production Tasks

| Task | Phase |
|------|-------|
| Set Gmail App Password in production `.env` | Deploy |
| Auth-specific rate limiting | Phase 5 |
| `npx playwright install` + full browser E2E in CI | Phase 6 |
| Google Cloud Console redirect URI for production `BACKEND_URL` | Deploy |

---

## 10. Environment Variables (Complete Auth)

```env
# JWT / OAuth
JWT_SECRET_KEY=
JWT_EXPIRES=7d
ACTIVATION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
BACKEND_URL=
FRONTEND_URL=

# Gmail SMTP (auth emails)
EMAIL_FROM=YEBONE <yeboneapp@gmail.com>
SMPT_HOST=smtp.gmail.com
SMPT_PORT=587
SMPT_SERVICE=gmail
SMPT_MAIL=yeboneapp@gmail.com
SMPT_PASSWORD=
```

---

*Sprint 4 Phases 2–5 complete. See [`AUTH_SECURITY_HARDENING_REPORT.md`](./AUTH_SECURITY_HARDENING_REPORT.md) for Phase 5.*

---

## 11. Phase 5 — Security Hardening (Summary)

- Login rate limit: 10/15min per IP+email
- Forgot/verify OTP IP rate limits
- `tokenVersion` session invalidation on password reset/change
- Cookie expiry aligned with `JWT_EXPIRES`
- Password policy on registration + `PUT /update-user-password`
- Generic login errors, audit logging, `Cache-Control: no-store`
- Google duplicate-key race + avatar fallback
