# Password Reset — Phase 3 Audit

**Date:** 2026-08-07  
**Sprint:** YEBONE Sprint 4 — Phase 3  
**Mode:** Pre-implementation audit (read-only findings)

---

## 1. Current Forgot Password Flow

| Layer | File | Behavior |
|-------|------|----------|
| Frontend UI | `src/components/Login/ForgotPassword.js` | Single email form → `POST /user/forgot-password` |
| Frontend page | `src/pages/ForgotPasswordPage.js` | Wrapper only |
| Backend route | `controller/user.js:411–456` | JWT link email (not OTP) |
| Email | `utils/sendMail.js` | Plain text only |

**Issues:**
- Returns **404 "User not found"** → email enumeration
- Uses JWT link (`createToken(user)`) embedded in email — not OTP
- Returns **503** when SMTP missing — also leaks configuration state vs success
- No rate limiting per email
- No attempt counter

---

## 2. Current Reset Password Flow

| Layer | File | Behavior |
|-------|------|----------|
| Frontend UI | `src/components/Login/ResetPassword.js` | Token from URL → `POST /user/reset-password` |
| Route | `App.js` `/reset-password/:token` | Link-based only |
| Backend route | `controller/user.js:458–502` | Verifies JWT (`ACTIVATION_SECRET`), sets password |

**Issues:**
- Min password length **6 chars** on frontend — spec requires **8 + complexity**
- No OTP verification step
- JWT reset token embeds full user object (over-disclosure if leaked)
- Reuses `ACTIVATION_SECRET` (same as registration activation)
- No audit logging
- No confirmation email after reset

---

## 3. User Model Reset Fields

**File:** `model/user.js`

| Field | Status |
|-------|--------|
| `resetPasswordToken` | Defined, **never read/written** |
| `resetPasswordTime` | Defined, **never read/written** |

These dead fields will be **replaced** with OTP-specific fields:
- `passwordResetOtpHash` (select: false)
- `passwordResetOtpExpires`
- `passwordResetOtpAttempts`
- `passwordResetRequestWindowStart` / `passwordResetRequestCount` (rate limit)

---

## 4. Email Utilities & SMTP

| Component | File | Reusable? |
|-----------|------|-----------|
| Active sender | `utils/sendMail.js` | **Yes** — extend with `html` option |
| SMTP guard | `utils/isSmtpConfigured.js` | **Yes** — keep |
| Platform mailer | `platform/email/*` | **No** — placeholder, not wired |

**Action:** Extend `sendMail.js` to accept `html` + `text`. Build branded template in `utils/email/passwordResetOtpEmail.js`.

---

## 5. JWT Reset Flow (to Remove)

| Code | Location | Action |
|------|----------|--------|
| `createToken(user)` in forgot-password | `controller/user.js:429` | **Remove** — replace with OTP generation |
| JWT verify in reset-password | `controller/user.js:471` | **Replace** — verify OTP session token instead |
| `createToken()` helper | `controller/user.js:16–20` | **Keep** — still used for registration activation |

Backup reset link in email will use a **new** short-lived JWT (`purpose: password_reset_backup`) — separate from old full-user-object token.

---

## 6. Reuse vs Remove vs Keep

| Item | Decision |
|------|----------|
| `POST /forgot-password` route path | **Keep** — change implementation to OTP |
| `POST /reset-password` route path | **Keep** — change body to `{ resetSessionToken, newPassword }` |
| `ForgotPassword.js` component shell | **Keep** — extend to multi-step |
| `AuthLayout`, `AuthFloatingInput`, `AuthPasswordStrength` | **Keep** — update strength rules |
| `ResetPassword.js` | **Repurpose** — backup link handler only |
| `resetPasswordToken` / `resetPasswordTime` schema fields | **Deprecate** — add new OTP fields |
| Plain-text reset email | **Remove** |
| Email enumeration (404) | **Remove** |
| `normalizeEmail()` | **Keep** |
| `hashPasswordIfNeeded()` pre-save | **Keep** |
| Google OAuth / login routes | **Keep unchanged** |

---

## 7. New Endpoints Required

| Endpoint | Purpose |
|----------|---------|
| `POST /forgot-password` | Generate OTP, hash, store, send email (generic 200 always) |
| `POST /verify-reset-otp` | Verify 6-digit OTP, return `resetSessionToken` |
| `POST /reset-password` | Accept `resetSessionToken` + `newPassword`, clear OTP, audit |

Optional: `POST /resend-reset-otp` — can reuse forgot-password with same rate limits.

---

## 8. Security Gaps to Close in Phase 3

1. Email enumeration → generic response always
2. Plaintext OTP → bcrypt hash before storage
3. No expiry → 10-minute TTL
4. No attempt limit → max 5, then invalidate
5. Weak password policy → 8 chars + upper + lower + number + special
6. No rate limit on requests → 5/hour/email
7. No audit trail → structured auth audit log
8. Plain-text email → branded HTML template

---

## 9. Frontend UX Gaps

| Current | Required |
|---------|----------|
| Single email step | Email → OTP → Password → Success |
| "Send reset link" button | "Send Code" |
| No OTP input | 6-digit verification |
| No countdown | 10:00 expiry timer |
| No resend cooldown | Resend after 60 seconds |
| Toast-only feedback | Dedicated success/error states |

---

## 10. Implementation Order

1. User model OTP fields
2. `passwordResetService.js` + validators + email template
3. Replace backend routes
4. Multi-step frontend
5. Unit tests + Playwright
6. Implementation report

---

*Audit complete. Proceeding to implementation.*
