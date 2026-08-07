# YEBONE Authentication — Launch Checklist

**Date:** 2026-08-07  
**Use:** Pre-launch verification for each environment (staging → production)

---

## Environment Variables (Backend)

Copy from `.env.example` and set in deployment:

```bash
# Core auth
JWT_SECRET_KEY=<strong-random-secret>
JWT_EXPIRES=7d
ACTIVATION_SECRET=<strong-random-secret>
FRONTEND_URL=https://your-domain.com

# Google OAuth
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
GOOGLE_CALLBACK_URL=https://api.your-domain.com/api/v2/auth/google/callback

# SMTP (Gmail)
SMPT_HOST=smtp.gmail.com
SMPT_PORT=587
SMPT_MAIL=yeboneapp@gmail.com
SMPT_PASSWORD=<gmail-app-password>
EMAIL_FROM="YEBONE <yeboneapp@gmail.com>"

# Optional rate limit overrides
AUTH_LOGIN_RATE_LIMIT_MAX=10
AUTH_FORGOT_RATE_LIMIT_MAX=10
AUTH_VERIFY_OTP_RATE_LIMIT_MAX=20
```

---

## Pre-Launch Checklist

### SMTP & Email

- [ ] `SMPT_PASSWORD` set (Gmail App Password, not account password)
- [ ] Send test **welcome email** — register + activate OR dev-bypass signup
- [ ] Send test **OTP email** — forgot-password flow to real inbox
- [ ] Verify OTP email renders correctly on mobile mail clients
- [ ] Confirm `EMAIL_FROM` displays as "YEBONE"
- [ ] Verify emails not landing in spam (SPF/DKIM if using custom domain later)

### Google OAuth

- [ ] Google Cloud Console OAuth client created
- [ ] Authorized redirect URI matches `GOOGLE_CALLBACK_URL`
- [ ] Authorized JavaScript origins include frontend domain
- [ ] Test **Sign Up** with new Google account
- [ ] Test **Login** with existing Google account
- [ ] Test **Account linking** — local account email matches Google email
- [ ] Confirm JWT **not** visible in browser URL after callback
- [ ] Confirm session cookie set (`token`, httpOnly)

### Local Auth

- [ ] Register new user → receive activation email → activate → login
- [ ] Login with wrong password → generic "Invalid email or password"
- [ ] Login rate limit → 429 after 10 failures in 15 minutes
- [ ] Logout clears session; protected routes require re-login

### Password Reset (OTP)

- [ ] Forgot password → generic success message (no enumeration)
- [ ] OTP arrives within 60 seconds
- [ ] Wrong OTP → error with attempts remaining
- [ ] 5 wrong OTPs → must request new code
- [ ] Expired OTP (10 min) → must request new code
- [ ] Successful reset → can login with new password
- [ ] Old password rejected after reset
- [ ] Old JWT rejected after reset (401 on `/getuser`)

### Password Change (Profile)

- [ ] Change password in profile → policy enforced
- [ ] All other sessions invalidated after change
- [ ] Must re-login on other devices/browsers

### Security

- [ ] JWT cookie `httpOnly` and `secure` in production (HTTPS)
- [ ] Cookie expiry matches `JWT_EXPIRES`
- [ ] Auth API responses include `Cache-Control: no-store`
- [ ] No passwords or OTPs in server logs
- [ ] CORS allows frontend origin only
- [ ] Deploy **authRateLimit normalizeEmail fix** (commit from Phase 6)

### Frontend

- [ ] `/login`, `/sign-up`, `/forgot-password` load without console errors
- [ ] Signup page shows translated strings (not raw `auth.*` keys)
- [ ] Mobile layouts verified (390, 414, 768)
- [ ] Google button visible and functional

### Monitoring

- [ ] Auth failure rate alerting configured
- [ ] SMTP failure logging monitored (`[sendMail] Delivery failed`)
- [ ] 429 rate-limit spikes visible in logs

---

## Smoke Test Script (Post-Deploy)

Run after each deployment:

```bash
# Backend health
curl -s https://api.your-domain.com/health/liveness

# Login generic error
curl -s -X POST https://api.your-domain.com/api/v2/user/login-user \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke@test.com","password":"Wrong1!pass"}'

# Forgot password generic success
curl -s -X POST https://api.your-domain.com/api/v2/user/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke@test.com"}'

# Google OAuth redirect
curl -sI "https://api.your-domain.com/api/v2/auth/google?redirect=https://your-domain.com/login-success" | grep -i location
```

---

## Rollback Criteria

Rollback auth deployment if any of:

- Backend fails to start (check `authRateLimit` and env vars)
- Login returns 500 for valid credentials
- Google OAuth callback loops or exposes token in URL
- OTP emails not sending for >30 minutes after SMTP config
- Mass 401 for valid sessions (tokenVersion regression)

---

## Post-Private-Beta Requirements (Before Public Beta)

1. Redis-backed rate limiting for multi-instance
2. Fix signup i18n key rendering
3. Branded activation email (currently plain text)
4. Address `update-user-info` IDOR from Phase 1 audit
5. Penetration test on auth endpoints

---

## Related Documents

- [AUTH_PRODUCTION_CERTIFICATION.md](./AUTH_PRODUCTION_CERTIFICATION.md)
- [AUTH_FINAL_SCORECARD.md](./AUTH_FINAL_SCORECARD.md)
- [AUTH_EXECUTIVE_SUMMARY.md](./AUTH_EXECUTIVE_SUMMARY.md)
