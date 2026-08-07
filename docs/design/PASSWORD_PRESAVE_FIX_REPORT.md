# P0 — Password Pre-Save Hook Fix

**Date:** 2026-08-07  
**Sprint:** YEBONE Sprint 4 — Phase 2, Step 1

---

## Root Cause

Both `User` and `Shop` Mongoose models had a pre-save password hook with this pattern:

```javascript
if (!this.isModified("password")) {
  next();  // missing return
}
this.password = await bcrypt.hash(this.password, 10);
```

Calling `next()` without `return` does **not** stop the hook. Execution continued and bcrypt ran on every save — including profile updates, avatar changes, and Google account linking — even when the password field was unchanged.

When the stored password (already a bcrypt hash) was treated as plaintext and hashed again, login would fail permanently for affected accounts.

---

## Fix

1. **`return next()`** when password is not modified — stops the hook immediately.
2. **Shared utility** `utils/hashPasswordIfNeeded.js` — centralizes hashing logic.
3. **Regression guard** — if the value already matches a bcrypt hash pattern (`$2a$`, `$2b$`, `$2y$`), it is returned unchanged (never double-hashed).
4. **Unit tests** — `utils/__tests__/hashPasswordIfNeeded.test.js` verifies plaintext hashing and double-hash prevention.

---

## Files Changed

| File | Change |
|------|--------|
| `model/user.js` | Fixed pre-save hook; uses `hashPasswordIfNeeded` |
| `model/shop.js` | Same fix |
| `utils/hashPasswordIfNeeded.js` | **New** — shared hash + bcrypt detection |
| `utils/__tests__/hashPasswordIfNeeded.test.js` | **New** — regression tests |
| `package.json` | Added `test:auth` script |

---

## Why the Fix Is Safe

- **Existing accounts unchanged** — no migration; stored hashes are not modified unless a user explicitly changes their password.
- **Only hashes on `isModified("password")`** — profile, avatar, and Google linking saves skip the hash path entirely.
- **Double-hash guard** — even if a hash is accidentally passed through the modify path, `hashPasswordIfNeeded` detects bcrypt format and returns it as-is.
- **No API contract changes** — login, registration, and reset flows behave the same; only the save-side bug is corrected.
- **Tests pass** — `npm run test:auth` (6/6 passing).

---

*OTP password reset (Phase 3) was intentionally not started in this step.*
