# SMTP Phase 4 — Email Integration Audit

**Date:** 2026-08-07  
**Scope:** Auth emails only — no platform email layer

---

## Current State (Pre-Phase 4)

| Component | File | Status |
|-----------|------|--------|
| Active mailer | `utils/sendMail.js` | Nodemailer, plain + HTML |
| SMTP guard | `utils/isSmtpConfigured.js` | Rejects empty/placeholder/localhost |
| OTP reset template | `utils/email/passwordResetOtpEmail.js` | Branded HTML ✓ |
| Welcome template | — | **Missing** |
| Platform mailer | `platform/email/*` | Placeholder — **not used** |
| Auth integration | `passwordResetService.js` | Uses sendMail ✓ |
| Registration | `controller/user.js` | Activation plain text only |
| Google signup | `config/passport.js` | No welcome email |

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `SMPT_HOST` | `smtp.gmail.com` for Gmail |
| `SMPT_PORT` | `587` (STARTTLS) |
| `SMPT_SERVICE` | `gmail` (optional shortcut) |
| `SMPT_MAIL` | Sender login (`yeboneapp@gmail.com`) |
| `SMPT_PASSWORD` | Gmail App Password (secret) |
| `EMAIL_FROM` | Display From header |

Note: typo `SMPT_*` is consistent across codebase — do not rename without migration.

## Reuse Decision

| Reuse | Replace / Add |
|-------|---------------|
| `sendMail.js` | Extend Gmail + error handling |
| `isSmtpConfigured.js` | Keep as-is |
| OTP email template | Keep, extract shared brand |
| Platform email layer | **Do not wire** |
| Resend placeholder | **Ignore** |

## Phase 4 Actions

1. Gmail SMTP via env vars
2. Welcome email on activation + Google signup
3. Graceful SMTP error handling (no auth crash)
4. Shared `emailBrand.js` for auth templates only

---

*Audit complete.*
