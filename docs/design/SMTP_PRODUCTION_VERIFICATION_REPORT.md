# YEBONE — SMTP Production Verification Report

**Date:** 2026-08-07  
**Sprint:** SMTP Save + Production Verification  
**Secrets policy:** No secrets printed, modified, or committed.

---

## Executive Summary

| Area | Status | Verdict |
|------|--------|---------|
| **`.env` saved to disk** | **BLOCKED** | SMTP keys exist in editor but are **empty on disk** |
| **SMTP configuration loaded** | **NOT READY** | `isSmtpConfigured()` → `false` |
| **Welcome email (live)** | **NOT TESTED** | Blocked — SMTP not loaded |
| **OTP email (live)** | **NOT TESTED** | Blocked — SMTP not loaded |
| **Google OAuth (API)** | **PASS** | Redirect to Google confirmed |
| **Google OAuth (browser)** | **PARTIAL** | Login page loads; full flow requires manual Google login |
| **Auth regression (API)** | **PASS** | 28/28 unit + 8/8 journey + 9/9 Playwright API tests |
| **Production readiness** | **NOT READY** | Save `.env` and restart backend before SMTP can be certified |

---

## Step 0 — Save `.env` (Required Action)

The Gmail App Password appears to be typed in the **unsaved editor buffer** for `backend/.env`. The **saved file on disk** still has empty SMTP values.

**Action required:** Press **Ctrl+S** (or File → Save) on `guriraline_server-main/.env`, then restart the backend.

After saving, these lines must have non-empty values on disk (verified without printing secrets):

| Variable | On-disk status (2026-08-07 audit) |
|----------|-----------------------------------|
| `EMAIL_FROM` | ✗ Missing (not present in `.env`; copy from `.env.example`) |
| `SMPT_HOST` | ✗ Missing (empty) |
| `SMPT_PORT` | ✗ Missing (empty) |
| `SMPT_SERVICE` | ✗ Missing (empty) |
| `SMPT_MAIL` | ✗ Missing (empty) |
| `SMPT_PASSWORD` | ✗ Missing (empty) |

Expected non-secret values from `.env.example`:

```env
EMAIL_FROM=YEBONE <yeboneapp@gmail.com>
SMPT_HOST=smtp.gmail.com
SMPT_PORT=587
SMPT_SERVICE=gmail
SMPT_MAIL=yeboneapp@gmail.com
SMPT_PASSWORD=<your-app-password-already-typed>
```

---

## Step 1 — SMTP Configuration Loaded

**Result: NOT LOADED**

- `require('./utils/isSmtpConfigured')()` → **false**
- Running backend process was **not restarted** with new credentials (port 5000 already in use by prior instance)
- Backend logs confirm:

```text
[sendMail] SMTP not configured — skipping email to ...
[auth-audit] {"event":"welcome_email_sent","success":false,"reason":"SMTP not configured"}
```

No SMTP authentication failures occurred — emails were **skipped**, not attempted.

---

## Step 2 — Welcome Email Test

**Result: NOT RUN (blocked)**

Signup API (`POST /user/create-user`) succeeded (201) during regression, but:

- With SMTP not configured, the backend uses the **skip path**: user created immediately, welcome email **not sent**
- Audit log: `welcome_email_sent` → `success: false`, `reason: "SMTP not configured"`

### Checks (pending after `.env` save + backend restart)

| Check | Status |
|-------|--------|
| SMTP connection | Pending |
| Email delivered | Pending |
| HTML template | Pending (template unit tests pass) |
| Logo | Pending |
| Subject "Welcome to YEBONE" | Pending |
| CTA "Start Shopping" | Pending |
| Sender `YEBONE <yeboneapp@gmail.com>` | Pending (`EMAIL_FROM` must be added) |

---

## Step 3 — Forgot Password OTP Email Test

**Result: NOT RUN (blocked)**

API regression confirmed:

| Check | Status |
|-------|--------|
| `POST /forgot-password` generic success | ✓ PASS |
| Wrong OTP rejected (400) | ✓ PASS |
| Weak password rejected on reset | ✓ PASS |
| OTP email delivered | **Pending** — SMTP not configured |
| HTML / branding / 6-digit OTP | **Pending** |
| No SMTP errors | ✓ N/A (skipped, not failed) |

Backend log during forgot-password: `[sendMail] SMTP not configured — skipping email`

---

## Step 4 — Google Authentication

### API verification — PASS

| Test | Result |
|------|--------|
| `GET /api/v2/auth/google` → 302 | ✓ PASS |
| Redirect to `accounts.google.com` | ✓ PASS |
| `redirect_uri` = `http://localhost:5000/api/v2/auth/google/callback` | ✓ PASS |
| `GOOGLE_CLIENT_ID` loaded | ✓ PASS |
| `GOOGLE_CLIENT_SECRET` loaded | ✓ PASS |

### Browser verification — PARTIAL

| Test | Result |
|------|--------|
| Frontend `/login` loads | ✓ PASS |
| "Sign in with Google" button visible | ✓ PASS |
| Full Google sign-in (manual) | Not run — requires user Google account |
| Sign up with Google | Not run |
| Account linking | Not run (unit tests pass) |
| Cookie session + LoginSuccess | Not run |
| JWT httpOnly cookie | Not run |

### Google Cloud Console redirect URI

Register this exact URI for local development:

```
http://localhost:5000/api/v2/auth/google/callback
```

---

## Step 5 — Authentication Regression

**Result: PASS (API + unit tests)**

| Area | Result |
|------|--------|
| Backend unit tests (`npm run test:auth`) | **28/28 PASS** |
| API journey script | **8/8 PASS** |
| Playwright API tests | **9/9 PASS** |
| Playwright browser UI tests | **5 failed** — Playwright Chromium not installed in current environment |
| Login | ✓ PASS |
| Register | ✓ PASS |
| Logout | ✓ PASS |
| Forgot password / OTP verify API | ✓ PASS |
| Rate limiting (429) | ✓ PASS |
| Session invalidation / tokenVersion | ✓ PASS (unit tests) |
| Cookie/JWT expiry alignment | ✓ PASS (unit tests) |
| Password policy | ✓ PASS |

No authentication logic was modified during this verification sprint.

---

## Step 6 — Log Inspection

### Backend logs reviewed

| Log pattern | Found? | Meaning |
|-------------|--------|---------|
| `[sendMail] SMTP not configured` | **Yes** | SMTP vars not loaded — emails skipped |
| SMTP authentication failure (535/Invalid login) | **No** | SMTP never attempted |
| Gmail transport connection error | **No** | SMTP never attempted |
| Google OAuth / Passport errors | **No** | OAuth start works |
| Uncaught exceptions (auth) | **No** | Auth routes stable |
| `EADDRINUSE :5000` | Yes (restart attempt) | Prior backend instance still running |

### Auth audit logs

```text
welcome_email_sent → success: false, reason: "SMTP not configured"
password_reset_requested → (OTP flow API works; email skipped)
```

---

## Step 7 — Final Production Readiness

### Cannot conclude production ready yet

| Criterion | Ready? |
|-----------|--------|
| ✅ SMTP Ready | **No** — `.env` not saved; backend not reloaded with credentials |
| ✅ Google OAuth Ready | **Partial** — API verified; full browser OAuth pending manual test |
| ✅ Authentication Ready for Production | **No** — blocked on live SMTP delivery |

### After you save `.env`

1. **Save** `backend/.env` (Ctrl+S)
2. **Stop** the existing backend on port 5000
3. **Restart:** `npm run dev` in `guriraline_server-main`
4. **Confirm** all six SMTP variables show **Loaded** (presence check only)
5. **Re-run** welcome + OTP live delivery tests
6. **Manually test** Google sign-in in browser

### Re-verification command (after save + restart)

Run from backend directory (set `SMTP_TEST_TO` to your inbox):

```bash
node -e "
require('dotenv').config();
const configured = require('./utils/isSmtpConfigured')();
console.log('isSmtpConfigured:', configured);
if (!configured) { process.exit(1); }
const sendMail = require('./utils/sendMail');
const { buildWelcomeEmail } = require('./utils/email/welcomeEmail');
const { buildPasswordResetOtpEmail } = require('./utils/email/passwordResetOtpEmail');
(async () => {
  const to = process.env.SMTP_TEST_TO;
  if (!to) { console.log('Set SMTP_TEST_TO in .env for live test'); process.exit(1); }
  const w = buildWelcomeEmail({ userName: 'Verification' });
  const r1 = await sendMail({ email: to, subject: w.subject, message: w.text, html: w.html });
  console.log('Welcome:', r1.sent ? 'SENT' : 'FAILED');
  const o = buildPasswordResetOtpEmail({ otp: '123456', userName: 'Verification' });
  const r2 = await sendMail({ email: to, subject: o.subject, message: o.text, html: o.html });
  console.log('OTP:', r2.sent ? 'SENT' : 'FAILED');
})();
"
```

---

## Related Documents

- [SMTP_AND_GOOGLE_VERIFICATION.md](./SMTP_AND_GOOGLE_VERIFICATION.md)
- [AUTH_LAUNCH_CHECKLIST.md](./AUTH_LAUNCH_CHECKLIST.md)
- [AUTH_PRODUCTION_CERTIFICATION.md](./AUTH_PRODUCTION_CERTIFICATION.md)

---

## Verification Log

| Time (UTC) | Action | Outcome |
|------------|--------|---------|
| 2026-08-07 14:00 | Disk `.env` SMTP audit | All SMPT_* empty; EMAIL_FROM absent |
| 2026-08-07 14:00 | Backend restart attempt | EADDRINUSE — prior instance retained |
| 2026-08-07 14:03 | API auth journey | 8/8 PASS |
| 2026-08-07 14:03 | Backend unit tests | 28/28 PASS |
| 2026-08-07 14:03 | Playwright API auth tests | 9/9 PASS |
| 2026-08-07 14:03 | Live welcome email | Skipped — SMTP not configured |
| 2026-08-07 14:03 | Live OTP email | Skipped — SMTP not configured |
| 2026-08-07 14:03 | Google OAuth API | PASS |
| 2026-08-07 14:03 | Frontend login page | PASS |
