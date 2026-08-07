# YEBONE — SMTP & Google OAuth Verification

**Date:** 2026-08-07  
**Scope:** Production authentication integrations (backend)  
**Secrets policy:** No secrets printed, committed, or hardcoded in this report.

---

## Executive Summary

| Integration | Configuration | Live verification |
|-------------|---------------|-------------------|
| **Gmail SMTP** | **Not configured** in `backend/.env` | **Blocked** — see §2 |
| **Google OAuth** | Client ID + secret **present**; callback derived from `BACKEND_URL` | **Partial** — OAuth start works; full browser flow not completed (frontend down) |

---

## Step 1 — SMTP Configuration Audit

### Code expectations

| Variable | Used in | Purpose |
|----------|---------|---------|
| `EMAIL_FROM` | `utils/sendMail.js` | Sender display: `YEBONE <yeboneapp@gmail.com>` |
| `SMPT_HOST` | `utils/sendMail.js`, `utils/isSmtpConfigured.js` | SMTP host (`smtp.gmail.com`) |
| `SMPT_PORT` | `utils/sendMail.js` | SMTP port (`587`) |
| `SMPT_SERVICE` | `utils/sendMail.js` | When `gmail`, uses Nodemailer Gmail transport |
| `SMPT_MAIL` | `utils/sendMail.js` | Gmail account username (`yeboneapp@gmail.com`) |
| `SMPT_PASSWORD` | `utils/sendMail.js` | Gmail **App Password** (never account password) |

`isSmtpConfigured()` returns `true` only when `SMPT_HOST`, `SMPT_MAIL`, and `SMPT_PASSWORD` are set and not placeholder values.

### Reference values (from `.env.example` — not secrets)

```env
EMAIL_FROM=YEBONE <yeboneapp@gmail.com>
SMPT_HOST=smtp.gmail.com
SMPT_PORT=587
SMPT_SERVICE=gmail
SMPT_MAIL=yeboneapp@gmail.com
SMPT_PASSWORD=          # ← you must set this
```

### Current `backend/.env` status

| Variable | Status |
|----------|--------|
| `EMAIL_FROM` | **MISSING** |
| `SMPT_HOST` | **MISSING** |
| `SMPT_PORT` | **MISSING** |
| `SMPT_SERVICE` | **MISSING** |
| `SMPT_MAIL` | **MISSING** |
| `SMPT_PASSWORD` | **MISSING** |

All six SMTP-related variables must be added to `backend/.env`. Copy the block above from `.env.example` and set `SMPT_PASSWORD`.

---

## Step 2 — Gmail SMTP Preparation

### STOP — credentials required

**Paste your Gmail App Password into `backend/.env` as `SMPT_PASSWORD`**

Also add the other SMTP variables from `.env.example` if they are not already present:

```env
EMAIL_FROM=YEBONE <yeboneapp@gmail.com>
SMPT_HOST=smtp.gmail.com
SMPT_PORT=587
SMPT_SERVICE=gmail
SMPT_MAIL=yeboneapp@gmail.com
SMPT_PASSWORD=<your-16-character-app-password>
```

### How to obtain a Gmail App Password

1. Sign in to the Google account for `yeboneapp@gmail.com`
2. Enable **2-Step Verification** (Google Account → Security)
3. Create an **App password** (Mail / Other → “YEBONE Backend”)
4. Paste the 16-character password into `SMPT_PASSWORD` in `backend/.env`
5. Restart the backend server

**Do not** use your regular Gmail password.

---

## Step 3 — SMTP Live Verification

**Status: NOT RUN** — blocked until Step 2 is complete.

When credentials exist, run (replace `you@example.com` with your inbox):

```bash
cd backend
node -e "
require('dotenv').config();
const sendMail = require('./utils/sendMail');
const { buildWelcomeEmail } = require('./utils/email/welcomeEmail');
const { buildPasswordResetOtpEmail } = require('./utils/email/passwordResetOtpEmail');

(async () => {
  const to = process.env.SMTP_TEST_TO || 'you@example.com';
  const welcome = buildWelcomeEmail({ userName: 'SMTP Test' });
  const otp = buildPasswordResetOtpEmail({ otp: '123456', userName: 'SMTP Test' });

  const w = await sendMail({ email: to, subject: welcome.subject, message: welcome.text, html: welcome.html });
  console.log('Welcome:', w.sent ? 'SENT' : (w.skipped ? 'SKIPPED:'+w.reason : 'FAILED:'+w.error));

  const o = await sendMail({ email: to, subject: otp.subject, message: otp.text, html: otp.html });
  console.log('OTP:', o.sent ? 'SENT' : (o.skipped ? 'SKIPPED:'+o.reason : 'FAILED:'+o.error));
})();
"
```

### Expected checks (after you provide credentials)

| Check | Expected |
|-------|----------|
| Welcome email delivered | Inbox within ~60s |
| OTP email delivered | 6-digit code visible in HTML |
| HTML rendering | YEBONE branding, “Start Shopping” CTA |
| OTP display | Large monospace 6-digit code |
| Backup reset link | Present in OTP email when URL provided |
| SMTP auth errors | None in server logs |

### Common failure reasons

| Error | Cause |
|-------|-------|
| `Invalid login` / `535` | Wrong App Password or 2FA not enabled |
| `SMTP not configured` | Missing or placeholder env vars |
| `Connection refused` | Wrong host/port or firewall |
| Email in spam | Normal for new senders; check spam folder |

---

## Step 4 — Google OAuth Audit

### Environment variables

| Variable | In `.env.example` | In `backend/.env` | Used by |
|----------|-------------------|-------------------|---------|
| `GOOGLE_CLIENT_ID` | Required | **SET** | `config/passport.js` |
| `GOOGLE_CLIENT_SECRET` | Required | **SET** | `config/passport.js` |
| `GOOGLE_CALLBACK_URL` | **Not used** | N/A | — |
| `BACKEND_URL` | Required | **SET** (`http://localhost:5000`) | Callback URL construction |
| `FRONTEND_URL` | Required | **SET** (`http://localhost:3000`) | Post-auth redirects |

### Callback URL construction (from code)

There is **no** `GOOGLE_CALLBACK_URL` environment variable. The callback is built in `config/passport.js`:

```javascript
callbackURL: `${process.env.BACKEND_URL}/api/v2/auth/google/callback`
```

### Backend routes (`app.js`)

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/v2/auth/google` | Starts OAuth (optional `?redirect=` for frontend return URL) |
| `GET` | `/api/v2/auth/google/callback` | Google redirect target; sets httpOnly cookie; redirects to frontend |

### Frontend entry (`src/config/authService.js`)

```javascript
buildGoogleAuthUrl() → `${server}/auth/google?redirect=${appOrigin}/login-success`
```

In development, the frontend proxies `/api/v2` to the backend, so the browser hits `/api/v2/auth/google`.

---

## Step 5 — Redirect URIs for Google Cloud Console

Read from **current** backend configuration (`BACKEND_URL=http://localhost:5000`):

### Authorized redirect URI (required)

```
http://localhost:5000/api/v2/auth/google/callback
```

This was confirmed by inspecting the live OAuth redirect to Google (`redirect_uri` query parameter).

### Production redirect URI (when deployed)

Use the same path pattern with your production `BACKEND_URL`:

```
{BACKEND_URL}/api/v2/auth/google/callback
```

Example if `BACKEND_URL=https://yebone-backend.onrender.com`:

```
https://yebone-backend.onrender.com/api/v2/auth/google/callback
```

Set `BACKEND_URL` in your deployment environment to match the public API URL **before** registering the production redirect URI.

### Authorized JavaScript origins (recommended)

For local development:

```
http://localhost:3000
```

For production (from `render.yaml` / frontend config):

```
https://bonerablaise.github.io
```

Origins are not embedded in the Passport callback URL but are often required in Google Cloud Console for the OAuth client.

---

## Step 6 — Local Verification Results

| Test | Result | Notes |
|------|--------|-------|
| Backend health | **PASS** | `GET /health/liveness` → 200 |
| Frontend | **DOWN** | `http://localhost:3000` unreachable during audit |
| OAuth start (`GET /api/v2/auth/google`) | **PASS** | 302 → `accounts.google.com` |
| `redirect_uri` in OAuth request | **PASS** | Matches `http://localhost:5000/api/v2/auth/google/callback` |
| `client_id` present in OAuth request | **PASS** | Confirms `GOOGLE_CLIENT_ID` loaded |
| Sign in with Google (browser) | **NOT RUN** | Requires frontend + manual Google login |
| Sign up with Google | **NOT RUN** | Same |
| Existing account linking | **NOT RUN** | Requires test with local account + matching Google email |
| Logout | **NOT RUN** | Requires authenticated session |

### Configuration issues found

1. **All SMTP variables missing** from `backend/.env` — auth emails will be skipped until configured.
2. **Frontend not running** — full Google OAuth UX cannot be verified in browser.
3. **`.env.example` vs runtime `BACKEND_URL`** — example shows `http://localhost:8000`; your `.env` correctly uses `http://localhost:5000` (matches server `PORT=5000`). Ensure Google Console redirect URI uses **5000**, not 8000.

No OAuth credential values were missing from `.env` for client ID/secret.

---

## Step 7 — Remaining Manual Steps

### SMTP (blocking)

1. Add all six SMTP variables to `backend/.env`
2. Paste Gmail App Password as `SMPT_PASSWORD`
3. Restart backend
4. Run Step 3 verification script with your test inbox
5. Confirm welcome + OTP emails in inbox (check spam)

### Google OAuth

1. In [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → your OAuth 2.0 Client:
   - Add redirect URI: `http://localhost:5000/api/v2/auth/google/callback`
   - Add JavaScript origin: `http://localhost:3000`
2. For production, add redirect URI with production `BACKEND_URL`
3. Start frontend: `npm start` in `guriraline_app-main`
4. Test: Login → “Sign in with Google” → complete flow → lands on `/login-success` → profile
5. Test account linking: create local account with email X, then Google sign-in with same email X
6. Test logout from profile

### After both pass

Update this document’s verification tables and re-run `AUTH_LAUNCH_CHECKLIST.md` SMTP + OAuth sections.

---

## Related Documents

- [AUTH_LAUNCH_CHECKLIST.md](./AUTH_LAUNCH_CHECKLIST.md)
- [AUTH_PRODUCTION_CERTIFICATION.md](./AUTH_PRODUCTION_CERTIFICATION.md)
- Backend `.env.example` — SMTP and Google variable reference

---

## Verification Log

| Timestamp | Action | Outcome |
|-----------|--------|---------|
| 2026-08-07 | SMTP env audit | All 6 vars missing |
| 2026-08-07 | SMTP live test | Skipped — no credentials |
| 2026-08-07 | Google env audit | Client ID + secret set |
| 2026-08-07 | OAuth redirect probe | 302 to Google; redirect_uri confirmed |
| 2026-08-07 | Browser OAuth flows | Not run — frontend down |
