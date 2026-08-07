# Authentication Security Audit — Phase 5

**Date:** 2026-08-07  
**Mode:** Pre-hardening audit (read-only findings)

---

## 1. Login Flow

| Check | Status | Gap |
|-------|--------|-----|
| bcrypt password compare | ✓ | — |
| Google-only block | ✓ | — |
| Auth-specific rate limit | ✗ | Global 120/min only |
| Login enumeration | ✗ | Different errors: "User doesn't exist" vs "Invalid password" |
| Failed attempt logging | ✗ | No structured audit on login |
| Account lockout | ✗ | None (rate limit only needed) |

---

## 2. Google Authentication

| Check | Status | Gap |
|-------|--------|-----|
| Account linking by email | ✓ | — |
| Duplicate prevention | ✓ | unique email index |
| Missing email rejected | ✓ | — |
| Missing display name fallback | ✓ | email prefix |
| Missing profile photo | ⚠ | Empty `avatar.url` may fail schema validation |
| Race duplicate create | ⚠ | No duplicate-key catch on concurrent signup |
| OAuth rate limit | ✗ | No auth-specific limit on `/auth/google` |

---

## 3. OTP Password Recovery

| Check | Status | Gap |
|-------|--------|-----|
| OTP hashed (bcrypt) | ✓ | — |
| 10-minute expiry | ✓ | — |
| Max 5 verify attempts | ✓ | — |
| 5 requests/hour per email | ✓ | On user record |
| IP rate limit on forgot/verify | ✗ | Email-only limit bypassable |
| Email enumeration | ✓ | Generic 200 response |
| Replay on reset session | ✓ | sessionId single-use |
| Session invalidation after reset | ✗ | Old JWTs remain valid |

---

## 4. JWT / Cookies / Session

| Check | Status | Gap |
|-------|--------|-----|
| httpOnly cookies | ✓ | — |
| secure/sameSite by env | ✓ | sendToken + setTokenCookie |
| Cookie expiry | ✗ | Hardcoded **90 days** |
| JWT expiry | ✓ | `JWT_EXPIRES` (e.g. 7d) |
| Cookie/JWT mismatch | ✗ | 90d cookie vs 7d JWT |
| Token revocation | ✗ | No `tokenVersion` / denylist |
| Logout cookie flags | ⚠ | Hardcoded `sameSite: none`, `secure: true` |

---

## 5. Rate Limiting

| Endpoint | Current | Required |
|----------|---------|----------|
| Global | 120/min/IP | Keep |
| `/login-user` | None | 10/15min per IP+email |
| `/forgot-password` | 5/hr per user | + IP limit |
| `/verify-reset-otp` | 5 attempts/OTP | + IP limit |
| `/auth/google` | None | Optional light limit |

---

## 6. Password Policy Consistency

| Entry point | Policy enforced |
|-------------|-----------------|
| OTP reset | ✓ 8 char + complexity |
| Registration (`create-user`) | ✗ min 4 (schema only) |
| Activation | ✗ inherits weak password |
| Profile change password | ✗ endpoint missing (404); client min 6 |

---

## 7. Security Headers

| Header | Status |
|--------|--------|
| X-Content-Type-Options | ✓ Global |
| X-Frame-Options | ✓ Global |
| Referrer-Policy | ✓ Global |
| HSTS (prod) | ✓ Global |
| Cache-Control on auth | ✗ Missing on sensitive responses |

---

## 8. Logging

| Check | Status |
|-------|--------|
| authAuditLog structured JSON | ✓ |
| No OTP in logs | ✓ |
| No passwords in logs | ✓ |
| Login events logged | ✗ |
| Sensitive meta sanitization | ⚠ Partial |

---

## 9. Phase 5 Remediation Plan

1. Auth-specific rate limiters (login, forgot, verify OTP)
2. `tokenVersion` on User + JWT validation → invalidate sessions on password reset/change
3. Align cookie expiry with `JWT_EXPIRES`
4. Fix logout cookie flags via shared helper
5. Password policy on registration + new `update-user-password` route
6. Google avatar fallback + duplicate-key handling
7. Generic login error message + login audit events
8. `Cache-Control: no-store` on auth router
9. Safe logging sanitizer

**Out of scope:** UI changes, new auth features, platform email layer, order/vendor emails.

---

*Audit complete. Proceeding to hardening.*
