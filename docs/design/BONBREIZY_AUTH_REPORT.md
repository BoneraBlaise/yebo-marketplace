# [REDACTED-OWNER-EMAIL] — Authentication Report

**Date:** 2026-08-06  
**Scope:** Read-only investigation — no code or database changes  
**Database:** MongoDB instance from backend `DB_URL` (local dev backend)

---

## Executive Summary

| Account | Exists | Can log in? | Depends on password |
|---------|--------|-------------|---------------------|
| **[REDACTED-OWNER-EMAIL]** | ✓ Yes | **Yes** — with `[REDACTED-PASSWORD]` | ✗ Fails with `[REDACTED-PASSWORD]` |
| **[REDACTED-TEST-EMAIL]** | ✓ Yes | **Yes** — with `[REDACTED-PASSWORD]` | ✗ Fails with `[REDACTED-PASSWORD]` |

Neither account accepts the buyer E2E default `[REDACTED-PASSWORD]`. Login success is **password-specific**, not account-broken vs account-working. **[REDACTED-OWNER-EMAIL]** is healthy for local auth when the correct vendor password is used.

---

## 1. Does [REDACTED-OWNER-EMAIL] exist?

**Yes.**

| Field | Value |
|-------|-------|
| User ID | `6a569862a85d5895dc95c1f9` |
| Name | Bon |
| Email | `[REDACTED-OWNER-EMAIL]` |
| Role | **Admin** |
| Created | `2026-07-14T20:00:47.679Z` |

---

## 2. authProvider — local or Google?

**Local.**

| Field | Value |
|-------|-------|
| `authProvider` | `local` |
| `googleId` | `null` |

Google OAuth login is not required. Password login is the expected path.

---

## 3. Was the password changed recently?

The User schema has **`createdAt` only** — no `updatedAt` field. MongoDB cannot report a last-modified timestamp for password changes directly.

| Indicator | [REDACTED-OWNER-EMAIL] | [REDACTED-TEST-EMAIL] |
|-----------|---------------------|------------------|
| Account age | Created 2026-07-14 | Created 2026-07-26 |
| Hash fingerprint (safe prefix/suffix) | `$2a$…r83W` (stable across reads) | `$2a$…Iq/S` (changed from `$2a$…WW` earlier today) |
| Recent reset performed? | **No** | **Yes** — during password-reset diagnosis (`POST /reset-password`) |

**Conclusion:**

- **[REDACTED-OWNER-EMAIL]:** No evidence of a recent password change in this investigation.
- **[REDACTED-TEST-EMAIL]:** Password **was changed recently** (hash fingerprint changed; reset flow verified in `PASSWORD_RESET_DIAGNOSIS.md`).

---

## 4. Does `bcrypt.compare()` succeed for login-form passwords?

`comparePassword()` uses `bcrypt.compare(enteredPassword, storedHash)`. Results for passwords commonly used in docs, E2E, or prior login attempts:

### [REDACTED-OWNER-EMAIL]

| Submitted password | `comparePassword()` | Login API status |
|--------------------|---------------------|------------------|
| `[REDACTED-PASSWORD]` (E2E vendor default) | **true** | **201** success |
| `[REDACTED-PASSWORD]` (E2E buyer / backend script default) | false | 400 |
| `[REDACTED-PASSWORD]` | false | 400 |
| `[REDACTED-PASSWORD]` | false | 400 |
| Other common guesses | false | 400 |

### [REDACTED-TEST-EMAIL] (comparison)

| Submitted password | `comparePassword()` | Login API status |
|--------------------|---------------------|------------------|
| `[REDACTED-PASSWORD]` (set via reset diagnosis) | **true** | **201** success |
| `[REDACTED-PASSWORD]` | false | 400 |
| `[REDACTED-PASSWORD]` | false | 400 |

**If the login form submits `[REDACTED-PASSWORD]` for bonbreizy:** `bcrypt.compare()` returns **false**.

**If the login form submits `[REDACTED-PASSWORD]`:** `bcrypt.compare()` returns **true**.

---

## 5. Exact backend message returned

All failed login attempts for wrong passwords return:

```json
{
  "success": false,
  "message": "Invalid password!"
}
```

HTTP status: **400**

Successful login (`[REDACTED-PASSWORD]` for bonbreizy):

HTTP status: **201**

```json
{
  "success": true,
  "user": { … },
  "token": "<jwt>"
}
```

No other backend message is returned for password mismatch on this account (not `User doesn't exist!`, not `Please login with Google`).

---

## 6. Side-by-side comparison

| Property | [REDACTED-OWNER-EMAIL] | [REDACTED-TEST-EMAIL] |
|----------|---------------------|------------------|
| Exists | ✓ | ✓ |
| User ID | `6a569862a85d5895dc95c1f9` | `6a6660d4b7c2b17054691302` |
| Role | Admin | user |
| authProvider | local | local |
| googleId | null | null |
| Created | 2026-07-14 | 2026-07-26 |
| Password format | bcrypt `$2a$10$`, 60 chars | bcrypt `$2a$10$`, 60 chars |
| Password changed recently | No evidence | Yes (reset today) |
| Works with `[REDACTED-PASSWORD]` | ✗ | ✗ |
| Works with `[REDACTED-PASSWORD]` | ✓ | ✗ |
| Works with `[REDACTED-PASSWORD]` | ✗ | ✓ |
| E2E script association | Vendor auth (`E2E_VENDOR_EMAIL`) | Buyer/vendor pipeline default email |

---

## 7. Why one account can log in while the other cannot

This is **not** an account-type or authProvider difference. Both are valid local accounts with valid bcrypt hashes.

### Root cause: **wrong password for the account**

| Scenario | bonbreizy | derick |
|----------|-----------|--------|
| User enters **buyer** default `[REDACTED-PASSWORD]` | ✗ Cannot log in | ✗ Cannot log in |
| User enters **account-correct** password | ✓ `[REDACTED-PASSWORD]` | ✓ `[REDACTED-PASSWORD]` |

### Why it looks like “one works, one doesn’t”

1. **Documentation mismatch:** Backend verify scripts default to `[REDACTED-TEST-EMAIL]` + `[REDACTED-PASSWORD]`, but that password matches **neither** account in the live database.

2. **Different E2E credentials per role:**
   - Vendor/seller tests use `[REDACTED-OWNER-EMAIL]` + **`[REDACTED-PASSWORD]`** (`e2e/tests/08-vendor-auth-unified.spec.js`)
   - Buyer tests expect env vars `E2E_BUYER_EMAIL` / `E2E_BUYER_PASSWORD` (not hard-coded to match bonbreizy)

3. **derick’s password was recently reset** to `[REDACTED-PASSWORD]` during password-reset diagnosis — so derick **can** log in only with that new password, not with documented E2E defaults.

4. **bonbreizy was never reset** — its password remains whatever was set at registration (July 14). That password aligns with the **vendor** E2E default, not the buyer default.

### Summary sentence

**[REDACTED-OWNER-EMAIL] cannot log in when the wrong password is submitted (e.g. `[REDACTED-PASSWORD]`); it succeeds with `[REDACTED-PASSWORD]`. [REDACTED-TEST-EMAIL] cannot log in with `[REDACTED-PASSWORD]` but succeeds with `[REDACTED-PASSWORD]` after a recent reset. The backend behaves correctly in both cases — the difference is which password matches each account’s stored hash.**

---

## 8. Password field (hash not disclosed)

| Account | Length | Algorithm | Fingerprint |
|---------|--------|-----------|-------------|
| [REDACTED-OWNER-EMAIL] | 60 | bcrypt `$2a$10$` | `$2a$…r83W` |
| [REDACTED-TEST-EMAIL] | 60 | bcrypt `$2a$10$` | `$2a$…Iq/S` |

Plaintext is not stored. Full hash values are omitted from this report.

---

## 9. Related reports

- `docs/design/LOGIN_API_DIAGNOSIS.md` — frontend request trace
- `docs/design/BACKEND_AUTH_DIAGNOSIS.md` — derick credential analysis
- `docs/design/PASSWORD_RESET_DIAGNOSIS.md` — derick password reset during diagnosis

---

## 10. Investigation constraints

- No code modified  
- No database modified  
- No passwords reset during this report  
- Live login API calls used read-only credential verification only
