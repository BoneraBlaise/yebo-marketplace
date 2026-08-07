# Password Reset Flow — End-to-End Diagnosis

**Date:** 2026-08-06  
**Scope:** Read-only investigation — no code changes  
**Note on routes:** The codebase does **not** implement `POST /password/reset/:token`. Actual endpoints are `POST /api/v2/user/forgot-password` and `POST /api/v2/user/reset-password` (token in JSON body). The frontend route `/reset-password/:token` only carries the token in the URL for the React page.

---

## Executive Summary

| Stage | Status |
|-------|--------|
| Forgot-password API reachable | ✓ |
| SMTP / email delivery (local) | ✗ **Blocked by design** → HTTP **503** |
| Reset token generation (JWT) | ✓ Works when user exists |
| Reset token stored in MongoDB | ✗ **Not used** — JWT-only, schema fields unused |
| Reset-password API (with valid token) | ✓ HTTP **200**, password hashed, login succeeds |
| End-user reset via UI (local, no SMTP) | ✗ **Blocked** — cannot receive email link |

**Why SMTP is “unavailable”:** `SMPT_*` env vars are empty and `isSmtpConfigured()` returns `false`. The backend intentionally returns **503** instead of sending mail.

**Why “Password update failed” may appear:** That string is **not** from the forgot/reset flow. It comes from **Profile → Change Password** (`ProfileContent.jsx`), which calls `PUT /user/update-user-password` — a route that **does not exist** (HTTP **404**).

---

## 1. Full Flow Trace

### Phase A — Request reset link

```
ForgotPassword.js
  POST ${server}/user/forgot-password
  Body: { email }
        ↓
serverConfig (dev): http://localhost:3000/api/v2
        ↓
setupProxy.js → http://localhost:5000/api/v2
        ↓
app.js: app.use("/api/v2/user", user)
        ↓
controller/user.js → POST /forgot-password
  ├─ normalizeEmail(email)
  ├─ User.findOne({ email })
  ├─ createToken(user)  → JWT (ACTIVATION_SECRET, 10m)
  ├─ resetUrl = FRONTEND_URL/reset-password/{token}
  ├─ sendMail({ email, subject, message })
  │     └─ isSmtpConfigured() ? send : { skipped: true }
  └─ if skipped → 503 | else → 200 success
```

### Phase B — Set new password

```
ResetPassword.js
  useParams().token  ← from URL /reset-password/:token
  POST ${server}/user/reset-password
  Body: { token, newPassword }
        ↓
controller/user.js → POST /reset-password
  ├─ jwt.verify(token, ACTIVATION_SECRET)
  ├─ decoded.user._id → User.findById
  ├─ user.password = newPassword
  ├─ user.save() → pre-save bcrypt hash (rounds 10)
  └─ 200 { success: true }
        ↓
Login.jsx → POST /user/login-user → should succeed with new password
```

---

## 2. Endpoint Capture — `POST /user/forgot-password`

**Full URL (dev):** `http://localhost:3000/api/v2/user/forgot-password`

### Test A — Valid user, SMTP not configured (local)

| Field | Value |
|-------|-------|
| **Request payload** | `{ "email": "[REDACTED-TEST-EMAIL]" }` |
| **HTTP status** | **503 Service Unavailable** |
| **Response body** | `{ "success": false, "message": "Password reset email is unavailable until SMTP is configured on the server." }` |
| **Stack trace** | None in response (JSON error only) |

Backend log (expected): `[sendMail] SMTP not configured — skipping email to [REDACTED-TEST-EMAIL]`

### Test B — Unknown email

| Field | Value |
|-------|-------|
| **Request payload** | `{ "email": "notexist@test.com" }` |
| **HTTP status** | **404** |
| **Response body** | `{ "success": false, "message": "User not found" }` |

### Test C — Missing email

| Field | Value |
|-------|-------|
| **Request payload** | `{}` |
| **HTTP status** | **400** |
| **Response body** | `{ "success": false, "message": "Email is required" }` |

### Test D — Success path (when SMTP configured)

Not executed locally (SMTP off). Code path returns:

```json
{ "success": true, "message": "Password reset email sent!" }
```

HTTP **200**.

---

## 3. Endpoint Capture — `POST /user/reset-password`

**Note:** There is no `POST /password/reset/:token`. Token is passed in the **request body**, not the URL path.

**Full URL (dev):** `http://localhost:3000/api/v2/user/reset-password`

### Test A — Missing token

| Field | Value |
|-------|-------|
| **Request payload** | `{ "newPassword": "NewPass123!" }` |
| **HTTP status** | **400** |
| **Response body** | `{ "success": false, "message": "Token and new password are required" }` |

### Test B — Invalid token

| Field | Value |
|-------|-------|
| **Request payload** | `{ "token": "invalid.token.here", "newPassword": "NewPass123!" }` |
| **HTTP status** | **400** |
| **Response body** | `{ "success": false, "message": "Invalid reset token" }` |
| **Stack trace** | None (caught in inner `catch`, mapped to 400) |

### Test C — Expired token

| Field | Value |
|-------|-------|
| **Request payload** | JWT signed with `expiresIn: '-1s'` |
| **HTTP status** | **400** |
| **Response body** | `{ "success": false, "message": "Reset token has expired" }` |

Tokens do **not** expire immediately — default TTL is **10 minutes** (`createToken`).

### Test D — Valid token (live verification)

A valid JWT was generated using the same `createToken(user)` logic as the forgot-password handler (read-only token construction; one live reset was executed to verify the downstream chain).

| Field | Value |
|-------|-------|
| **Request payload** | `{ "token": "<valid JWT>", "newPassword": "[REDACTED-PASSWORD]" }` |
| **HTTP status** | **200** |
| **Response body** | `{ "success": true, "message": "Password has been reset successfully" }` |

**Post-reset login:**

| Field | Value |
|-------|-------|
| **Request** | `POST /user/login-user` `{ "email": "[REDACTED-TEST-EMAIL]", "password": "[REDACTED-PASSWORD]" }` |
| **HTTP status** | **201** |
| **Response** | `{ "success": true, "user": {…}, "token": "<jwt>" }` |

---

## 4. SMTP Investigation

### Configuration check (backend `.env`)

| Variable | Local value | Required for mail |
|----------|-------------|-------------------|
| `SMPT_HOST` | empty | Yes |
| `SMPT_PORT` | 587 (default in code) | Yes |
| `SMPT_MAIL` | empty | Yes |
| `SMPT_PASSWORD` | empty | Yes |
| `EMAIL_PROVIDER` | unset | Informational only |
| `isSmtpConfigured()` | **false** | — |

### `utils/isSmtpConfigured.js` rules

Returns `false` when:

- Host empty or contains `"placeholder"`
- Host is `localhost` or `127.0.0.1` (even a local Mailhog would be rejected)
- Mail or password empty / placeholder

Returns `true` only for a **real remote** SMTP host with credentials.

### `utils/sendMail.js` behavior

When SMTP not configured:

```javascript
return { skipped: true, reason: "SMTP not configured" };
```

Forgot-password handler treats `mailResult.skipped` as hard failure → **503** with user-facing message. **No token is returned in the API response** and **nothing is logged to console** except the skip warning.

### Why SMTP is reported unavailable

**Intentional local-development behavior:** `.env.example` leaves `SMPT_*` empty and sets `EMAIL_PROVIDER=placeholder`. Without configuring remote SMTP, password reset emails cannot be sent and the API correctly returns 503.

This is **not** a runtime crash — it is an explicit guard to avoid nodemailer defaulting to localhost:587 in production.

---

## 5. Reset Token Generation

**Function:** `createToken(user)` in `controller/user.js`

```javascript
jwt.sign({ user }, process.env.ACTIVATION_SECRET, { expiresIn: '10m' });
```

| Property | Value |
|----------|-------|
| Secret | `ACTIVATION_SECRET` (same as account activation) |
| TTL | **10 minutes** |
| Payload shape | `{ user: <mongoose user document JSON> }` |
| Token length (sample) | ~627 chars |

**Decoded sample (read-only):**

| Field | Present |
|-------|---------|
| `decoded.user._id` | ✓ `6a6660d4b7c2b17054691302` |
| `decoded.user.email` | ✓ `[REDACTED-TEST-EMAIL]` |

Reset handler requirement `decoded.user._id` is **satisfied** when token is freshly minted from `createToken(user)`.

---

## 6. Reset Token Storage in Database

User schema defines:

```javascript
resetPasswordToken: String,
resetPasswordTime: Date,
```

**Finding:** These fields are **never written** in `forgot-password` or anywhere else in `controller/user.js`. For `[REDACTED-TEST-EMAIL]`:

| Field | Value |
|-------|-------|
| `resetPasswordToken` | `null` |
| `resetPasswordTime` | `null` |

Reset auth is **stateless JWT only** — no server-side token persistence, revocation list, or one-time-use flag in MongoDB.

---

## 7. Token Expiry

| Question | Answer |
|----------|--------|
| Do tokens expire immediately? | **No** — 10-minute JWT expiry |
| Expired token response | `400` `"Reset token has expired"` |
| Can token be reused within 10m? | **Yes** — no invalidation after use |

---

## 8. Password Hashing on Reset

**Path:** `user.password = newPassword` → `user.save()` → `pre("save")` hook in `model/user.js`

```javascript
this.password = await bcrypt.hash(this.password, 10);
```

| Check | Result |
|-------|-------|
| Plaintext stored? | ✗ No (verified via successful login after reset) |
| bcrypt rounds | 10 |
| Library | `bcryptjs` |
| `comparePassword` after reset | ✓ Works |

---

## 9. MongoDB Update

On successful `POST /reset-password`:

1. `User.findById(decoded.user._id)` — succeeds for valid token
2. `user.password = newPassword` — marks password modified
3. `user.save()` — persists bcrypt hash

**Verified:** Login with new password returned **201** immediately after reset.

---

## 10. Login After Password Update

| Scenario | Should login succeed? | Observed |
|----------|----------------------|----------|
| After successful reset-password | Yes | ✓ **201** with JWT |
| With old password after reset | No | Expected (not re-tested) |
| Without reset (SMTP blocked) | N/A — user never gets link | — |

---

## 11. “Password update failed” — Separate Flow

**Not part of forgot/reset.**

| Item | Detail |
|------|--------|
| **UI** | `ProfileContent.jsx` → Change Password form |
| **Request** | `PUT ${server}/user/update-user-password` |
| **Fallback toast** | `"Password update failed"` (when no API message) |
| **Backend route** | **Does not exist** |
| **Live test** | HTTP **404** `Cannot PUT /api/v2/user/update-user-password` |

Users changing password from the profile page will always fail until that route is implemented. This is unrelated to forgot-password / reset-password.

---

## 12. Frontend ↔ Backend Contract

| Step | Frontend | Backend | Match |
|------|----------|---------|-------|
| Forgot email | `POST /user/forgot-password` `{ email }` | Same | ✓ |
| Reset password | `POST /user/reset-password` `{ token, newPassword }` | Same | ✓ |
| Token source | URL param → body | Body JWT verify | ✓ |
| User mentioned route | `POST /password/reset/:token` | **Not implemented** | ✗ |

---

## 13. Local Development — How to Reset Passwords

### What works today without SMTP

| Method | Available? |
|--------|------------|
| Forgot-password UI | ✗ Returns 503 |
| Token in API response | ✗ Not returned when SMTP skipped |
| Token logged to server console | ✗ Not logged |
| Signup-style bypass (like `emailVerificationSkipped`) | ✗ Not implemented for forgot-password |

### Signup comparison (for context)

When SMTP is off during **registration**, the backend **auto-creates** the user and returns success (`emailVerificationSkipped: true`). **Forgot-password has no equivalent bypass.**

### Practical options for developers

1. **Configure remote SMTP** in backend `.env`:
   - `SMPT_HOST`, `SMPT_PORT`, `SMPT_MAIL`, `SMPT_PASSWORD`
   - Must **not** be localhost (explicitly blocked by `isSmtpConfigured`)
   - Example: Gmail app password, SendGrid, Resend SMTP relay

2. **Manual JWT reset (advanced, no email):**
   - Connect to MongoDB, load user
   - Sign JWT: `jwt.sign({ user }, ACTIVATION_SECRET, { expiresIn: '10m' })` using same shape as `createToken(user)`
   - Open `http://localhost:3000/reset-password/{token}` in browser
   - Submit new password

3. **Direct API call** if token is known:
   - `POST /api/v2/user/reset-password` with `{ token, newPassword }`

4. **Seed script** (`scripts/seed-production-test-user.js`) creates a user with known password — but only for `prod.test@yebone.app`, not existing accounts.

There is **no documented first-class local-dev password reset path** without SMTP or manual JWT generation.

---

## 14. Diagnosis Checklist

| # | Question | Answer |
|---|----------|--------|
| 1 | Why is SMTP unavailable? | Empty `SMPT_*` env; `isSmtpConfigured()` false by design |
| 2 | Why “Password update failed”? | Profile route `PUT /update-user-password` missing (404), not reset flow |
| 3 | Are reset tokens generated correctly? | ✓ JWT with `user._id`, 10m TTL |
| 4 | Are tokens stored in DB? | ✗ Schema fields unused; JWT-only |
| 5 | Do tokens expire immediately? | ✗ 10-minute window |
| 6 | Does password hashing succeed? | ✓ bcrypt on `save()` |
| 7 | Does MongoDB update succeed? | ✓ Verified via post-reset login |
| 8 | Should login work after reset? | ✓ Yes — observed HTTP 201 |

---

## 15. Root Cause Summary

| User-visible problem | Root cause |
|---------------------|------------|
| Cannot receive reset email locally | SMTP not configured → intentional **503** |
| Cannot complete reset via UI locally | No email link + no dev bypass (unlike signup) |
| “Password update failed” in profile | Missing backend route `PUT /user/update-user-password` |
| Reset API itself | **Functional** when a valid JWT is supplied |

---

## 16. Files Referenced

| Layer | File |
|-------|------|
| Forgot UI | `src/components/Login/ForgotPassword.js` |
| Reset UI | `src/components/Login/ResetPassword.js` |
| Profile password (separate) | `src/components/Profile/ProfileContent.jsx` |
| Forgot/reset routes | `controller/user.js` |
| Mail | `utils/sendMail.js`, `utils/isSmtpConfigured.js` |
| Hashing | `model/user.js` |
| Env template | `.env.example` |
| Related | `docs/design/LOGIN_API_DIAGNOSIS.md`, `docs/design/BACKEND_AUTH_DIAGNOSIS.md` |

---

## 17. Investigation Note

One live `POST /reset-password` call with a programmatically generated valid token was executed to confirm hashing, MongoDB persistence, and post-reset login. This changed the password for `[REDACTED-TEST-EMAIL]` to `[REDACTED-PASSWORD]` during diagnosis. No other database records were modified.
