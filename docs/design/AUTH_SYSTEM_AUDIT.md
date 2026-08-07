# YEBONE Sprint 4 — Authentication System Audit

**Date:** 2026-08-07  
**Phase:** 1 — Audit only (no code changes)  
**Scope:** Frontend (`guriraline_app-main`) + Backend (`guriraline_server-main`)

---

## Executive Summary

YEBONE has a **functional MVP authentication stack**: email/password registration with activation, JWT sessions (cookie + Bearer), Passport Google OAuth, and a link-based password reset. It is **not production-hardened** for Sprint 4 goals.

| Area | Current state | Sprint 4 target |
|------|---------------|-----------------|
| Local login / signup | Works | Preserve |
| Google OAuth | Partial — rejects local-email collision | Link accounts by email, no duplicates |
| Forgot password | JWT link in plain-text email | 6-digit OTP, hashed, 10 min, max 5 attempts |
| Email | Plain text via legacy `sendMail.js` | Branded HTML templates (welcome, OTP, confirmation) |
| Security | Global rate limit only | Auth-specific brute-force + OTP protection |
| OTP | **Not implemented** | Full flow required |

**Highest-priority issues before new features:**

1. **Critical bug** — User/Shop pre-save password hook missing `return next()` can corrupt passwords on any save.
2. **Google OAuth** — JWT leaked in URL query string; local accounts blocked instead of linked.
3. **Password reset** — Broken UX locally (503 without SMTP); no OTP; email enumeration; dead schema fields.
4. **Dual email systems** — Platform mailer is placeholder-only; auth uses legacy plain-text sender.

---

## 1. Current Architecture

### 1.1 High-level diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  /login          → Login.jsx          → POST /user/login-user           │
│  /sign-up        → Signup.jsx         → POST /user/create-user          │
│  /activation/:t  → ActivationPage     → POST /user/activation           │
│  /forgot-password→ ForgotPassword.js  → POST /user/forgot-password      │
│  /reset-password/:token → ResetPassword → POST /user/reset-password     │
│  Google button   → redirect GET /auth/google → /login-success?token=…  │
│  App boot        → restoreAuthSessionFromBackup + GET /user/getuser     │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ /api/v2/* (dev proxy → :5000)
┌───────────────────────────────▼─────────────────────────────────────────┐
│                         BACKEND (Express)                                │
├─────────────────────────────────────────────────────────────────────────┤
│  User model (MongoDB)  │  bcrypt pre-save  │  JWT (JWT_SECRET_KEY)       │
│  Passport Google OAuth │  sendMail (SMTP)  │  isAuthenticated middleware │
│  Shop model (vendor)   │  separate creds   │  authenticateVendor         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Dual identity model

| Identity | Model | Auth mechanism | JWT payload |
|----------|-------|----------------|-------------|
| Buyer / general user | `User` | Email+password or Google | `{ id: user._id }` |
| Vendor / seller | `Shop` (separate password) | Shop login → resolves linked `User` by email | Same User JWT |

Roles on `User.role`: default `"user"`, also `"Admin"` (normalized via `PlatformAuthService`). Vendor access is derived from linked `Shop`, not a separate buyer JWT type.

### 1.3 Token delivery strategy

- **Backend:** Issues JWT in JSON body **and** sets `httpOnly` cookie `token` (`utils/jwtToken.js`).
- **Frontend:** `withCredentials: true` + mirrors token in readable cookie and `localStorage` backup (`authStorage.js`, `authSessionBackup.js`).
- **Axios:** Attaches `Authorization: Bearer <token>` via interceptor (`setupApiClient.js`).

**Mismatch:** Cookie expiry is hardcoded to **90 days** while JWT `expiresIn` comes from `JWT_EXPIRES` (default `7d`).

---

## 2. User Model

**File:** `guriraline_server-main/model/user.js`

| Field | Purpose |
|-------|---------|
| `name`, `email` | Required; email unique, lowercase, indexed |
| `password` | Required, min 4 chars, `select: false` |
| `phoneNumber`, `addresses[]` | Profile |
| `role` | Default `"user"` |
| `avatar` | Cloudinary `public_id` + `url` (both required) |
| `resetPasswordToken`, `resetPasswordTime` | **Defined but never read/written** |
| `googleId` | Unique sparse index |
| `authProvider` | `'local'` \| `'google'`, default `'local'` |
| `isCommissioner`, `commissionProgramId` | Commission program linkage |

**Password hashing:** `bcryptjs`, cost factor 10, in pre-save hook:

```javascript
userSchema.pre("save", async function (next){
  if(!this.isModified("password")){
    next();  // BUG: missing return — execution continues and re-hashes
  }
  this.password = await bcrypt.hash(this.password, 10);
});
```

**JWT methods:**

- `getJwtToken()` — signs `{ id: this._id }` with `JWT_SECRET_KEY`, `expiresIn: JWT_EXPIRES`
- `comparePassword()` — `bcrypt.compare`

**Shop model** (`model/shop.js`) mirrors bcrypt/JWT pattern with min password length 6 and the **same pre-save bug**.

---

## 3. Login Flow

### 3.1 Backend endpoints

| Route | Method | Handler | Notes |
|-------|--------|---------|-------|
| `/api/v2/user/login-user` | POST | `controller/user.js:148–182` | Email normalized; blocks `authProvider === 'google'` |
| `/api/v2/user/getuser` | GET | `controller/user.js:184–205` | `isAuthenticated`; returns user + fresh token |
| `/api/v2/user/logout` | GET | `controller/user.js:207–226` | Clears cookie (always `sameSite: none`, `secure: true`) |
| `/api/v2/user/login-success` | GET | `controller/user.js:504+` | Legacy query-token verify |
| `/api/v2/shop/login-shop` | POST | `controller/shop.js` | Shop password → User JWT |

### 3.2 Frontend flow

1. User submits `/login` → `Login.jsx`
2. `POST ${server}/user/login-user` with `{ email, password }`, `withCredentials: true`
3. On success: `syncVendorAuthToken(token)` → Redux `LoadUserSuccess` → `tryResumeSellerSession()` → `/profile`
4. On app boot: `restoreAuthSessionFromBackup()` + `loadUser()` → `GET /user/getuser`

**Gap:** No dedicated Redux thunks for login; components call axios directly.

---

## 4. Registration Flow

### 4.1 Backend

| Route | Method | Flow |
|-------|--------|------|
| `/api/v2/user/create-user` | POST | Validate → duplicate check → Cloudinary avatar → activation JWT (10m) → email link |
| `/api/v2/user/activation` | POST | Verify JWT (`ACTIVATION_SECRET`) → `User.create` → `sendToken` |
| `/api/v2/user/check-email` | POST | Returns `{ exists, authProvider }` |

**Dev bypass:** If SMTP not configured, `create-user` creates account immediately without email verification (`controller/user.js:67–73`). Shop registration has similar non-production auto-activation.

### 4.2 Frontend

1. `/sign-up` → `Signup.jsx` → `POST /user/create-user` with `{ name, email, password, avatar }`
2. Toast success; **no auto-login**
3. User clicks email link → `/activation/:activation_token` → `POST /user/activation`
4. Minimal activation UI (no redirect to login)

**Activation token payload:** Full user object (name, email, password, avatar) embedded in JWT — sensitive if leaked.

---

## 5. JWT Flow

### 5.1 Secrets and token types

| Secret | Used for | TTL |
|--------|----------|-----|
| `JWT_SECRET_KEY` | Session JWT (`{ id }`) | `JWT_EXPIRES` (e.g. `7d`) |
| `ACTIVATION_SECRET` | Registration activation + password reset link JWT | 10 minutes |

### 5.2 Middleware

**File:** `middleware/auth.js`

- Extracts token: `Authorization: Bearer` header **or** `req.cookies.token`
- `jwt.verify(token, JWT_SECRET_KEY)` → `User.findById(decoded.id)`
- `isAdmin(...roles)` — role check via `PlatformAuthService.normalizeRole`

**Gaps:**

- No token revocation / denylist on logout or password change
- No refresh tokens
- JWT verify errors can surface as 500 instead of uniform 401
- `update-user-info` looks up user by **body email**, not `req.user.id` — IDOR risk

---

## 6. Password Hashing

| Aspect | Implementation |
|--------|----------------|
| Library | `bcryptjs` (native `bcrypt` in package.json but unused) |
| Cost | 10 rounds |
| Min length | User: 4 chars; Shop: 6 chars |
| Reset update | `user.password = newPassword; await user.save()` — triggers pre-save hook |

**Critical bug:** Pre-save hook on User and Shop must use `return next()` when password is unmodified. Without it, any document save (profile update, avatar change) can re-hash an already-hashed password or hash `undefined`, permanently locking users out.

---

## 7. Email Utilities & SMTP

### 7.1 Active path (auth uses this)

**File:** `utils/sendMail.js`

- Nodemailer transporter from `SMPT_*` env vars (note typo: **SMPT**, not SMTP)
- Sends **plain text only** (`text: options.message`)
- Returns `{ skipped: true }` when SMTP not configured

**Guard:** `utils/isSmtpConfigured.js` — rejects empty, placeholder, and localhost hosts.

### 7.2 Platform email layer (unused by auth)

**Files:** `platform/email/EmailBootstrap.js`, `SMTPAdapterPlaceholder.js`, `ResendAdapterPlaceholder.js`

- `EMAIL_PROVIDER=placeholder` by default
- Templates registered: `welcome`, `password-reset` — **plain text placeholders**, not HTML
- Adapters return `{ status: "queued" }` without sending
- **Not wired** into auth controllers

### 7.3 Current auth emails

| Trigger | Subject | Format |
|---------|---------|--------|
| Registration | "Activate your account" | Plain text link |
| Forgot password | "Password Reset Request" | Plain text link |
| Password changed | **None** | — |
| Welcome (post-signup) | **None** (only activation) | — |

---

## 8. Environment Variables

From `guriraline_server-main/.env.example`:

| Variable | Required (prod) | Purpose |
|----------|-----------------|---------|
| `JWT_SECRET_KEY` | Yes | Session JWT sign/verify |
| `JWT_EXPIRES` | Yes | JWT TTL (e.g. `7d`) |
| `ACTIVATION_SECRET` | Yes | Activation + reset link JWT |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth |
| `BACKEND_URL` | Yes | OAuth callback base (`/api/v2/auth/google/callback`) |
| `FRONTEND_URL` | Yes | Redirects, reset links |
| `SMPT_HOST/PORT/SERVICE/MAIL/PASSWORD` | No* | Real email delivery |
| `EMAIL_PROVIDER` | No | Platform layer (`placeholder` default) |
| `EMAIL_FROM` | No | Sender address |
| `RESEND_API_KEY` | No | Resend (placeholder only) |
| `RATE_LIMIT_MAX` | No | Global limit (default 120/min) |

\*Required for password reset and activation in production; locally returns 503 for reset.

**Local dev note:** `.env.example` shows `BACKEND_URL=http://localhost:8000` but server runs on `5000` — OAuth callback must match actual backend port.

**Frontend:**

- `REACT_APP_API_URL` — production API base
- `REACT_APP_PROXY_TARGET` — dev proxy target (`.env.development`)

---

## 9. Google OAuth

### 9.1 Implementation status: **Partially implemented**

| Component | File | Status |
|-----------|------|--------|
| Passport Google strategy | `config/passport.js` | ✓ Wired |
| OAuth start | `app.js:88–93` `GET /api/v2/auth/google` | ✓ |
| OAuth callback | `app.js:95–128` `GET /api/v2/auth/google/callback` | ✓ |
| Frontend button | `AuthGoogleButton.jsx` on Login + Signup | ✓ |
| URL builder | `authService.js` → `buildGoogleAuthUrl()` | ✓ |
| Callback handler | `/login-success` → `LoginSuccessHandler.jsx` | ✓ |

### 9.2 Current strategy behavior (`config/passport.js`)

1. Find user by Google email
2. If exists with `authProvider: 'local'` → **reject** ("Email already registered")
3. If exists with `authProvider: 'google'` → sign in (does not update `googleId`)
4. If new → create user with `googleId`, `authProvider: 'google'`, random password, Google avatar
5. Callback sets cookie + redirects to `{FRONTEND_URL}/login?token={token}`

### 9.3 Gaps vs Sprint 4 requirements

| Requirement | Current | Required change |
|-------------|---------|-----------------|
| Sign in with Google | ✓ Works for Google-only accounts | Fix token delivery |
| Sign up with Google | ✓ Auto-creates user | Same |
| Link existing email accounts | ✗ Rejects local users | **Link** — set `googleId`, keep `authProvider` or support hybrid |
| Store Google provider info | Partial (`googleId`, `authProvider`) | Update `googleId` on return; optional refresh token storage |
| Preserve JWT/session | ✓ Uses `sendToken` pattern | Remove JWT from URL |
| Preserve roles | ✓ Default `user` | No change |

### 9.4 Security issues

- **JWT in URL query string** — leaks via browser history, Referer headers, server logs
- **Hardcoded cookie flags in callback** — `sameSite: "none"`, `secure: true` even in development (inconsistent with `jwtToken.js`)
- **No auth-specific rate limit** on OAuth routes
- Google-only users blocked from password login but **not** from forgot-password reset

---

## 10. Existing Reset-Password Flow

### 10.1 Current flow (link-based JWT, not OTP)

```
Forgot Password UI
  POST /user/forgot-password { email }
    → User.findOne
    → createToken(user)  // JWT with full user object, ACTIVATION_SECRET, 10m
    → Email plain-text link: FRONTEND_URL/reset-password/{token}
    → 503 if SMTP not configured

Reset Password UI (/reset-password/:token)
  POST /user/reset-password { token, newPassword }
    → jwt.verify(token, ACTIVATION_SECRET)
    → user.password = newPassword; user.save()
    → Redirect to /login
```

### 10.2 Why it is "broken" in practice

| Issue | Detail |
|-------|--------|
| Local dev blocked | SMTP unset → `503` on forgot-password; user never receives link |
| No OTP | Sprint requires 6-digit code, not URL token |
| Dead schema fields | `resetPasswordToken`, `resetPasswordTime` never used |
| Email enumeration | Unknown email → `404 "User not found"` vs known → `200` |
| Token over-disclosure | Reset JWT embeds full user object |
| Shared secret | Same `ACTIVATION_SECRET` for activation and reset |
| No session invalidation | Old JWTs remain valid after password change |
| Google users | Can reset to local password without linking policy |
| No confirmation email | User not notified after successful reset |
| Profile confusion | `ProfileContent.jsx` calls non-existent `PUT /user/update-user-password` → separate "Password update failed" UX bug |

### 10.3 Frontend UX gaps

- Forgot password: toast only, no "check your email" confirmation screen
- Reset page: no token pre-validation; error only on submit
- Hardcoded English (Login uses i18n; Forgot/Reset do not)
- No OTP input UI; `AuthLayoutShell` has unused `"register-verify"` variant

---

## 11. Rate Limiting & Security Posture

### 11.1 Current rate limiting

**File:** `platform/deployment/productionMiddleware.js`

- Global in-memory limit: `RATE_LIMIT_MAX` (default **120 req/min/IP**)
- Applied to **all routes** including auth
- Resets on server restart; accuracy depends on `trust proxy`

**No dedicated limits** on:

- `/login-user` (credential stuffing)
- `/create-user` (registration spam)
- `/forgot-password` (email bombing)
- `/reset-password` (token brute force)
- `/auth/google*`

### 11.2 Security checklist

| Control | Status |
|---------|--------|
| Password hashing (bcrypt) | ✓ (with pre-save bug) |
| HttpOnly cookies | ✓ |
| CORS configured | ✓ |
| Security headers (HSTS prod) | ✓ |
| Login brute-force protection | ✗ |
| Account lockout | ✗ |
| OTP attempt limiting | ✗ (no OTP) |
| Email enumeration prevention | ✗ |
| JWT denylist on reset/logout | ✗ |
| Auth-specific rate limits | ✗ |
| Strong password policy | ✗ (min 4 chars) |
| Input validation (centralized) | Partial |
| Public user info endpoint | `GET /user-info/:id` exposes full user — review |

---

## 12. Existing Issues Summary

### Critical

| # | Issue | Location |
|---|-------|----------|
| C1 | Pre-save password hook missing `return next()` | `model/user.js:91–97`, `model/shop.js` |
| C2 | JWT exposed in URL after Google OAuth | `app.js:121` |

### High

| # | Issue | Location |
|---|-------|----------|
| H1 | Google OAuth rejects instead of linking local accounts | `config/passport.js:37–40` |
| H2 | Password reset blocked without SMTP (503) | `controller/user.js:439–445` |
| H3 | Email enumeration on forgot-password | `controller/user.js:424–426` |
| H4 | `update-user-info` IDOR (body email vs `req.user.id`) | `controller/user.js:228–261` |
| H5 | No OTP reset flow at all | — |

### Medium

| # | Issue | Location |
|---|-------|----------|
| M1 | Cookie expiry (90d) ≠ JWT expiry (`JWT_EXPIRES`) | `utils/jwtToken.js:7` vs `model/user.js:102` |
| M2 | Weak password policy (min 4 chars) | `model/user.js:21` |
| M3 | Registration skips email verification when SMTP missing | `controller/user.js:67–73` |
| M4 | Plain-text emails only | `utils/sendMail.js` |
| M5 | Platform email layer not connected | `platform/email/*` |
| M6 | `streamifier` used but not imported — avatar update broken | `controller/user.js:314` |
| M7 | Logout cookie flags differ from login | `controller/user.js:212–217` |

### Low

| # | Issue | Location |
|---|-------|----------|
| L1 | Dead schema fields `resetPasswordToken`/`resetPasswordTime` | `model/user.js:67–68` |
| L2 | Duplicate Google callback handling (`/login?token` and `/login-success`) | `Login.jsx`, `LoginSuccessHandler.jsx` |
| L3 | No Google button on ShopLogin | `ShopLogin.jsx` |
| L4 | Passport serialize/deserialize unused (stateless OAuth) | `config/passport.js:12–25` |
| L5 | `BACKEND_URL` example port mismatch (8000 vs 5000) | `.env.example` |

---

## 13. Required Changes by Sprint Phase

### Phase 2 — Google Authentication

1. **Account linking:** When Google email matches existing local user, set `googleId`, allow Google sign-in (do not duplicate or reject).
2. **Token delivery:** Stop appending JWT to redirect URL; use httpOnly cookie only + frontend `loadUser()`.
3. **Align cookie flags** with environment (match `jwtToken.js` dev/prod logic in OAuth callback).
4. **Update returning Google users:** Refresh `googleId`/avatar if changed.
5. **Policy for hybrid accounts:** Allow password login after linking, or document Google-only.
6. **Fix pre-save hook** before any user document updates in OAuth flow.
7. **Rate limit** `/auth/google` and callback routes.

### Phase 3 — Forgot Password (OTP)

Replace link-based JWT reset entirely.

**New backend flow:**

```
POST /forgot-password { email }
  → Generate crypto.randomInt(100000, 999999)
  → Hash OTP with bcrypt → store in passwordResetOtpHash
  → Set passwordResetOtpExpires = now + 10m
  → Reset passwordResetOtpAttempts = 0
  → Send branded OTP email
  → Always return generic 200 (no enumeration)

POST /verify-reset-otp { email, otp }
  → Check expiry, attempts (< 5), bcrypt compare
  → Increment attempts on failure
  → Return short-lived reset session token on success

POST /reset-password { email, otp, newPassword }  // or use session token from verify step
  → Re-verify OTP (single-use)
  → Update password, clear OTP fields
  → Send password-changed confirmation email
  → Optional: invalidate existing JWTs
```

**Schema additions (User model):**

```javascript
passwordResetOtpHash: { type: String, select: false },
passwordResetOtpExpires: Date,
passwordResetOtpAttempts: { type: Number, default: 0 },
passwordResetRequestedAt: Date,
```

**Repurpose or remove** unused `resetPasswordToken` / `resetPasswordTime`.

**Frontend:**

- Multi-step: email → OTP entry → new password
- Resend timer, attempt feedback
- Routes: e.g. `/forgot-password`, `/forgot-password/verify`, `/forgot-password/reset`
- Wire `AuthLayoutShell` step progress

### Phase 4 — Email Templates

Create responsive HTML templates with YEBONE branding:

| Template | Trigger |
|----------|---------|
| Welcome | After successful registration/activation or Google signup |
| Password reset OTP | `forgot-password` |
| Password changed | Successful reset |

**Implementation options:**

- Extend `sendMail.js` to support `html` option, **or**
- Wire platform `Mailer` + `TemplateRegistry` with real SMTP/Resend adapter (preferred long-term)

Templates must use `EMAIL_FROM` / `SMPT_MAIL` sender; no hardcoded secrets.

### Phase 5 — Security

| Item | Action |
|------|--------|
| Auth rate limits | e.g. 10 login/min/IP, 3 OTP requests/hour/email, 5 verify attempts/OTP |
| Login brute-force | Track failed attempts per email+IP; temporary lockout |
| OTP brute-force | Max 5 attempts per OTP (Sprint requirement) |
| Email enumeration | Generic responses on forgot-password |
| JWT cookies | Align expiry, `sameSite`, `secure` across login/OAuth/logout |
| Password policy | Enforce min 8 chars on reset (align with frontend `AuthPasswordStrength`) |
| Validation | Centralize email/password validation |
| Session invalidation | Consider token version field on User incremented on password change |
| Fix IDOR | `update-user-info` must use `req.user.id` |
| Fix pre-save hook | `return next()` when password unmodified |

### Phase 6 — Testing

Manual + Playwright coverage:

- Local login / registration / activation
- Google login / signup
- Existing local account → Google link (same email)
- Forgot password → OTP email → verify → reset → login with new password
- Wrong OTP, expired OTP, max attempts exceeded
- Rate limit responses
- SMTP failure handling (graceful error, no secret leak)

### Phase 7 — Documentation

Produce `AUTHENTICATION_IMPLEMENTATION_REPORT.md` after implementation.

---

## 14. Security Considerations for Production

1. **Never mock authentication** — all flows must hit real backend endpoints.
2. **Never hardcode secrets** — all keys from env; document in `.env.example` only.
3. **OTP storage** — store bcrypt hash only; never log or return OTP in API responses.
4. **OTP entropy** — 6-digit numeric (900,000 possibilities) acceptable with 10-min expiry + 5-attempt cap + rate limits.
5. **Google OAuth redirect URI** — must exactly match Google Console: `{BACKEND_URL}/api/v2/auth/google/callback`.
6. **HTTPS required** in production for `sameSite: none` cookies.
7. **SMTP credentials** — use app-specific passwords; validate with `isSmtpConfigured()` before promising email delivery.
8. **Shared ACTIVATION_SECRET** — stop using for password reset once OTP is live; keep only for registration activation.
9. **Audit logging** — log auth events (login failure, OTP request, reset success) without PII/secrets.
10. **Vendor accounts** — decide whether Shop passwords share User OTP recovery or remain separate.

---

## 15. Key File Index

### Backend (`guriraline_server-main`)

| Area | Path |
|------|------|
| User model | `model/user.js` |
| Shop model | `model/shop.js` |
| User controller (auth) | `controller/user.js` |
| App + Google routes | `app.js` |
| Passport | `config/passport.js` |
| Auth middleware | `middleware/auth.js` |
| Vendor auth | `middleware/vendorAuth.js` |
| JWT cookie helper | `utils/jwtToken.js` |
| Email sender | `utils/sendMail.js` |
| SMTP guard | `utils/isSmtpConfigured.js` |
| Env example | `.env.example` |
| Env validation | `config/validateEnv.js` |
| Rate limit | `platform/deployment/productionMiddleware.js` |
| Platform email | `platform/email/EmailBootstrap.js` |
| RBAC | `marketplace/integration/auth/PlatformAuthService.js` |

### Frontend (`guriraline_app-main`)

| Area | Path |
|------|------|
| Login | `src/components/Login/Login.jsx` |
| Forgot password | `src/components/Login/ForgotPassword.js` |
| Reset password | `src/components/Login/ResetPassword.js` |
| Google OAuth | `src/components/Auth/AuthGoogleButton.jsx` |
| OAuth callback | `src/components/Login/LoginSuccessHandler.jsx` |
| Auth service | `src/config/authService.js` |
| Token storage | `src/config/authStorage.js`, `authSessionBackup.js` |
| API client | `src/config/setupApiClient.js` |
| Redux user | `src/redux/actions/user.js`, `reducers/user.js` |
| Routes | `src/App.js` |
| API base URL | `src/config/serverConfig.js` |

### Related prior docs

- `docs/design/PASSWORD_RESET_DIAGNOSIS.md` — link-based reset trace, SMTP 503 root cause
- `docs/design/PASSWORD_ROOT_CAUSE_ANALYSIS.md` — profile change-password 404
- `docs/design/BACKEND_AUTH_DIAGNOSIS.md` — earlier backend auth notes
- `docs/design/BONBREIZY_AUTH_REPORT.md` — prior auth report

---

## 16. Recommended Implementation Order

1. **Fix pre-save password hook** (blocks safe password updates)
2. **Extend sendMail / email templates** (unblocks OTP + welcome emails)
3. **Implement OTP reset backend + frontend** (replaces broken link flow)
4. **Fix Google OAuth linking + token delivery**
5. **Add auth rate limits + enumeration fixes**
6. **Playwright E2E tests**
7. **Implementation report**

---

*Phase 1 complete. No code was modified during this audit.*
