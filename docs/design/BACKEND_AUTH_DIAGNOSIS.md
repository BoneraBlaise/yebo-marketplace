# Backend Authentication Diagnosis

**Date:** 2026-08-06  
**Scope:** Read-only investigation — no code, database, or password changes  
**Symptom:** `POST /api/v2/user/login-user` → `400` with `{ "success": false, "message": "Invalid password!" }`

---

## Executive Summary

Backend authentication logic is **structurally correct**: user lookup, `bcrypt.compare()` via `comparePassword()`, and JWT issuance are wired as expected. The `Invalid password!` response means the user **was found** and `comparePassword()` returned **false**.

For `[REDACTED-TEST-EMAIL]`, the stored credential is a **valid bcrypt hash** (60 chars, `$2a$10$`, cost factor 10). The account is **local** (not Google-only). Documented E2E/test passwords **do not match** the stored hash.

**Primary diagnosis:** **Credential mismatch** — the password being submitted (including documented `[REDACTED-PASSWORD]`) is not the password that was hashed at registration. The database is **not seeded** with E2E demo credentials; it contains only **2 real user records**.

---

## 1. Login Route — Full Authentication Flow

**File:** `guriraline_server-main/controller/user.js`  
**Route:** `POST /login-user` (mounted at `/api/v2/user/login-user`)

```
HTTP Request
  Body: { email, password }
  ↓
normalizeEmail(req.body.email)     → trim + lowercase
  ↓
Validation: !email || !password   → 400 "Please fill all fields!"
  ↓
User.findOne({ email }).select("+password")
  ↓
User not found                    → 400 "User doesn't exist!"
  ↓
user.authProvider === 'google'    → 400 "Please login with Google"
  ↓
user.comparePassword(password)      → bcrypt.compare(entered, stored)
  ↓
Returns false                     → 400 "Invalid password!"  ← CURRENT FAILURE
  ↓
Returns true                      → sendToken(user, 201, res)
                                      ├─ user.getJwtToken()  (JWT signed with JWT_SECRET_KEY)
                                      ├─ httpOnly cookie "token"
                                      └─ JSON { success: true, user, token }
```

### Observed failure point

The request reaches **`comparePassword()`** and fails there. All earlier checks passed for `[REDACTED-TEST-EMAIL]`.

---

## 2. `comparePassword()` Implementation

**File:** `guriraline_server-main/model/user.js`

```javascript
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

| Check | Result |
|-------|--------|
| Uses `bcrypt.compare()` | ✓ Yes (via `bcryptjs`) |
| Compares plaintext input vs stored hash | ✓ Correct argument order |
| Stored hash loaded at login | ✓ `.select("+password")` on query |
| Library version | `bcryptjs@^2.4.3` (also `bcrypt@^5.1.0` in package.json for shop model) |

**Verdict:** `comparePassword()` is implemented correctly. A `false` result is an honest mismatch, not a comparison bug.

---

## 3. Password Hashing at Registration

**Pre-save hook** (`model/user.js`):

```javascript
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
```

| Check | Result |
|-------|--------|
| Hashing library | `bcryptjs` |
| Salt rounds | **10** (consistent) |
| Trigger | Mongoose `pre("save")` on new users and password updates |
| Registration paths | `User.create()` in `/create-user`, `/activation`, Google OAuth |

Passwords are hashed **once** when `password` is modified and `save()`/`create()` runs.

### Latent hook defect (not modified in this investigation)

When `password` is **not** modified, the hook calls `next()` but **does not `return`**, so execution can fall through and run `bcrypt.hash()` on an **already-hashed** password on subsequent saves (e.g. avatar or profile update via `user.save()`). This **can** corrupt credentials over time. It was **not proven** as the cause for `[REDACTED-TEST-EMAIL]` (see §7).

---

## 4. JWT Generation (Success Path Only)

**File:** `utils/jwtToken.js` + `user.js` → `getJwtToken()`

Only reached when `comparePassword()` returns `true`:

1. `jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES })`
2. Set `token` httpOnly cookie
3. Respond **201** with `{ success: true, user, token }`

This path was **not reached** for the failing login attempts.

---

## 5. Database — `[REDACTED-TEST-EMAIL]` Record

Read-only query against the MongoDB instance configured in backend `.env` (`DB_URL`).

| Field | Value |
|-------|-------|
| **Exists** | ✓ Yes |
| **User ID** | `6a6660d4b7c2b17054691302` |
| **Name** | Derick iradukunda |
| **Email** | `[REDACTED-TEST-EMAIL]` |
| **Role** | `user` |
| **Auth provider** | `local` |
| **Google ID** | `null` |
| **Created** | `2026-07-26T15:51:45.387Z` |

### Password field (hash not disclosed)

| Property | Value |
|----------|-------|
| Present | ✓ Yes |
| Length | 60 characters |
| Format | **Valid bcrypt** (`$2a$10$…`) |
| Cost factor | 10 |
| Plaintext stored | ✗ No (length and prefix rule out plaintext) |

---

## 6. Database Population

| Metric | Value |
|--------|-------|
| **Total users** | **2** |
| Demo/seed users | **0** (no seeded test accounts in this database) |

| Email | Role | Auth provider | Created |
|-------|------|---------------|---------|
| `[REDACTED-OWNER-EMAIL]` | Admin | local | 2026-07-14 |
| `[REDACTED-TEST-EMAIL]` | user | local | 2026-07-26 |

The seed script `scripts/seed-production-test-user.js` creates `prod.test@yebone.app` — **that account does not exist** in this database.

E2E/backend scripts default to:

- Email: `[REDACTED-TEST-EMAIL]`
- Password: `[REDACTED-PASSWORD]`

Those defaults are **documentation/script assumptions**, not reflected in the live data.

---

## 7. Why `comparePassword()` Returns False

### Tests run (read-only, no DB writes)

Against the stored hash for `[REDACTED-TEST-EMAIL]`:

| Candidate password | `comparePassword()` |
|--------------------|---------------------|
| `[REDACTED-PASSWORD]` (E2E default) | **false** |
| `[REDACTED-PASSWORD]` (UI test) | **false** |
| `password` | **false** |
| `123456` | **false** |
| Other common guesses | **false** |
| Double-hash of `[REDACTED-PASSWORD]` | **false** |

Same E2E password also **fails** for `[REDACTED-OWNER-EMAIL]`.

### Ruled out

| Cause | Evidence |
|-------|----------|
| Google-only account | `authProvider: "local"` |
| User does not exist | Would return `User doesn't exist!`, not `Invalid password!` |
| Plaintext password in DB | 60-char `$2a$10$` bcrypt format |
| Invalid/corrupt hash | Valid bcrypt structure; `bcrypt.compare()` runs without error |
| Wrong `comparePassword()` implementation | Standard `bcrypt.compare(plain, hash)` |
| bcrypt version mismatch | Hash is `$2a$10$`; `bcryptjs` compares correctly (sanity-checked) |
| Inconsistent salt rounds at registration | Hook always uses round **10**; stored cost is **10** |

### Confirmed cause

| Cause | Confidence |
|-------|------------|
| **Submitted password ≠ password stored at registration** | **High** |
| **Stale E2E/script credentials (`[REDACTED-PASSWORD]`) do not match DB** | **High** |
| **Database not seeded with demo users** (only 2 real accounts) | **High** |

### Possible but unconfirmed

| Cause | Notes |
|-------|-------|
| Pre-save hook double-hashing after profile/avatar update | Code path exists; no candidate password (including double-hash of E2E default) matched stored hash |
| User chose an unknown password at signup | Consistent with all test failures |
| Manual DB import with unknown password | Account created 2026-07-26 via normal registration window |

---

## 8. Cause Matrix

| # | Hypothesis | Status |
|---|------------|--------|
| 1 | Wrong password entered | ✓ **Confirmed** (for tested passwords) |
| 2 | Stale seed / E2E docs | ✓ **Confirmed** (2 users, no seed account, E2E password fails) |
| 3 | User imported incorrectly | ⚠ Unconfirmed (record looks normal) |
| 4 | Plaintext password stored | ✗ Ruled out |
| 5 | Hash format invalid | ✗ Ruled out |
| 6 | bcrypt version mismatch | ✗ Ruled out |
| 7 | Google-only account | ✗ Ruled out |
| 8 | Corrupted user record | ✗ Ruled out (valid bcrypt, local provider) |
| 9 | Pre-save double-hash bug | ⚠ Latent code risk; not proven for this user |

---

## 9. Recommended Next Steps (Diagnosis Only — Not Implemented)

1. Use the **actual password set at registration**, or reset via `/forgot-password` → `/reset-password` (with user consent).
2. Run `node scripts/seed-production-test-user.js` against the target `DB_URL` if a known test account is required — currently **missing** from this database.
3. Align E2E env vars (`E2E_BUYER_EMAIL`, `E2E_BUYER_PASSWORD`) with credentials that exist in the active database.
4. If login breaks after profile updates, investigate the `pre("save")` password hook missing `return` after `next()` (separate fix — out of scope here).

---

## 10. Files Inspected

| File | Purpose |
|------|---------|
| `controller/user.js` | `POST /login-user` handler |
| `model/user.js` | `comparePassword`, pre-save hash, JWT method |
| `utils/jwtToken.js` | Token + cookie response |
| `utils/normalizeEmail.js` | Email normalization |
| `middleware/error.js` | `{ success: false, message }` error shape |
| `config/passport.js` | Google OAuth user creation |
| `scripts/seed-production-test-user.js` | Optional test user seeder |
| `scripts/verify-vendor-auth-pipeline.js` | E2E default credentials reference |

---

## 11. Related Reports

- Frontend request diagnosis: `docs/design/LOGIN_API_DIAGNOSIS.md`
