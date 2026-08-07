# Login API Failure — Diagnosis Report

**Date:** 2026-08-06  
**Scope:** Investigation only — no code changes  
**Reported symptom:** `POST /api/v2/user/login-user` → HTTP **400**, Axios `ERR_BAD_REQUEST`

---

## Executive Summary

The login request **reaches the backend successfully** with a **correct JSON payload**. The HTTP 400 is **not** caused by a frontend field mismatch, malformed body, or proxy/CORS failure.

For the reproduced login attempt, the backend responded with:

```json
{ "success": false, "message": "Invalid password!" }
```

**Verdict:** Backend **credential validation** failed (`comparePassword`). The frontend is sending the expected `{ email, password }` shape. The Axios `ERR_BAD_REQUEST` label is generic for any HTTP 400 and does not indicate a broken request format.

---

## 1. Network Inspection (Browser-Equivalent Capture)

Captured via Playwright driving the real login form against the running dev app (`localhost:3000`), with network listeners on the `login-user` request.

| Field | Value |
|-------|-------|
| **Request URL** | `http://localhost:3000/api/v2/user/login-user` |
| **Proxied target** | `http://localhost:5000/api/v2/user/login-user` (via `src/setupProxy.js`) |
| **Method** | `POST` |
| **Request headers** | `Content-Type: application/json`, `Accept: application/json`, `Referer: http://localhost:3000/login` |
| **Request payload** | `{"email":"[REDACTED-TEST-EMAIL]","password":"[REDACTED-PASSWORD]"}` |
| **Response status** | **400 Bad Request** |
| **Response body** | `{"success":false,"message":"Invalid password!"}` |

### Axios error shape (client-side)

When this response is received, Axios surfaces:

| Property | Value |
|----------|-------|
| `error.message` | `Request failed with status code 400` |
| `error.code` | **`ERR_BAD_REQUEST`** |
| `error.response.status` | `400` |
| `error.response.data.message` | `Invalid password!` |

The UI toast uses `describeAxiosFailure()` which includes `api=Invalid password!` when present.

---

## 2. Frontend vs Backend Payload Comparison

### Frontend sends (`Login.jsx`)

```javascript
axios.post(
  `${server}/user/login-user`,
  { email, password },
  { withCredentials: true }
);
```

| Field | Frontend | Backend reads | Match |
|-------|----------|---------------|-------|
| Email key | `email` | `req.body.email` → `normalizeEmail()` | ✓ |
| Password key | `password` | `req.body.password` | ✓ |
| Content-Type | `application/json` (global default in `setupApiClient.js`) | `express.json()` | ✓ |
| Credentials | `withCredentials: true` | CORS `credentials: true` | ✓ |

### Backend expects (`controller/user.js` → `POST /login-user`)

```javascript
const { password } = req.body;
const email = normalizeEmail(req.body.email);

if (!email || !password) {
  return next(new ErrorHandler("Please fill all fields!", 400));
}
// … lookup user, comparePassword, sendToken on success
```

**No additional fields** (username, login, rememberMe, etc.) are required by the backend.

**Conclusion:** Payload structure is correct. This is **not** a frontend field-name or serialization bug.

---

## 3. Login Flow Trace

```
Login Form (Login.jsx)
  AuthFloatingInput #email  → React state: email
  AuthFloatingInput #password → React state: password
        ↓
Submit Handler (handleSubmit)
  e.preventDefault()
  POST body = { email, password }
        ↓
Resolved API base (serverConfig.js, development)
  server = `${window.location.origin}/api/v2`
  → http://localhost:3000/api/v2
        ↓
Axios Request
  POST http://localhost:3000/api/v2/user/login-user
  Headers: Content-Type: application/json, Accept: application/json
  withCredentials: true
  (setupApiClient may attach Authorization: Bearer <stored token> — not used by login route validation)
        ↓
CRA Dev Proxy (setupProxy.js)
  /api/* → REACT_APP_PROXY_TARGET (http://localhost:5000)
  Final upstream URL: http://localhost:5000/api/v2/user/login-user
        ↓
Express App (app.js)
  app.use("/api/v2/user", userRouter)
        ↓
Backend Route (controller/user.js)
  POST /login-user
  Validations → 400 on failure | sendToken(user, 201, res) on success
        ↓
Error middleware (middleware/error.js)
  res.status(400).json({ success: false, message: err.message })
```

---

## 4. Backend Validation — All HTTP 400 Paths

The login handler returns **400** only from these explicit checks:

| Order | Condition | Response message | Reproduced? |
|-------|-----------|------------------|-------------|
| 1 | `!email \|\| !password` after trim/lowercase | `Please fill all fields!` | Yes (empty body test) |
| 2 | No MongoDB user for email | `User doesn't exist!` | Yes (`test@example.com`) |
| 3 | `user.authProvider === 'google'` | `Please login with Google` | Not triggered in this run |
| 4 | `comparePassword(password)` returns false | **`Invalid password!`** | **Yes (observed failure)** |

Success path returns **201** with:

```json
{ "success": true, "user": { … }, "token": "<jwt>" }
```

---

## 5. Root Cause (Observed Failure)

### Primary cause

**Backend validation #4 — password mismatch.**

- Email `[REDACTED-TEST-EMAIL]` **exists** in the database (otherwise the message would be `User doesn't exist!`).
- The submitted password did **not** match the stored bcrypt hash.
- Backend correctly rejected the login with HTTP 400 and `Invalid password!`.

### What this is NOT

| Ruled out | Evidence |
|-----------|----------|
| Wrong JSON field names | Payload uses `email` + `password` as backend expects |
| Proxy not working | 400 JSON returned from backend logic, not connection failure |
| CORS block | Would be `ERR_NETWORK` / 403, not 400 with JSON body |
| Missing Content-Type | `application/json` confirmed in captured request |
| Frontend not sending request | Network capture shows POST completed with response body |

---

## 6. Additional API Tests (Same Environment)

Direct `fetch` calls through the dev proxy (`localhost:3000/api/v2/...`):

| Payload | Status | Response message |
|---------|--------|------------------|
| `{ email: "", password: "" }` | 400 | `Please fill all fields!` |
| `{ email: "test@example.com", password: "wrongpass123" }` | 400 | `User doesn't exist!` |
| `{ email: "[REDACTED-TEST-EMAIL]", password: "[REDACTED-PASSWORD]" }` | 400 | **`Invalid password!`** |
| `{ email: "[REDACTED-TEST-EMAIL]", password: "[REDACTED-PASSWORD]" }` | 400 | **`Invalid password!`** |
| `{ email: "prod.test@yebone.app", password: "[REDACTED-PASSWORD]" }` | 400 | `User doesn't exist!` (not seeded in local DB) |

Production API (`https://yebone-backend.onrender.com/api/v2/user/login-user`) with the same `[REDACTED-TEST-EMAIL]` credentials also returns:

```json
{"success":false,"message":"Invalid password!"}
```

---

## 7. Frontend Field Audit

| Form field | `name` attr | State variable | Sent in POST |
|------------|-------------|----------------|--------------|
| Email | `email` | `email` | ✓ `email` |
| Password | `password` | `password` | ✓ `password` |
| Remember me | `remember-me` | *(not wired)* | Not sent (backend ignores) |

No incorrect or missing fields in the login POST body.

---

## 8. Credential / Data Notes (Out of Scope for Fix)

- E2E scripts reference `[REDACTED-TEST-EMAIL]` / `[REDACTED-PASSWORD]` (`e2e/tests/08-vendor-auth-unified.spec.js`, `scripts/verify-vendor-auth-pipeline.js`), but that password **currently fails** against both local and production for that email.
- Local MongoDB does not contain `prod.test@yebone.app` unless `seed-production-test-user.js` has been run against the same `DB_URL` the backend uses.
- **`Invalid password!` vs `User doesn't exist!`** is the key discriminator: the observed error confirms the account exists but the password is wrong (or the hash in DB does not match documented test credentials).

---

## 9. Diagnosis Checklist

| Question | Answer |
|----------|--------|
| Is the request URL correct? | ✓ `/api/v2/user/login-user` |
| Is the payload shape correct? | ✓ `{ email, password }` |
| Does the backend receive JSON? | ✓ |
| What caused HTTP 400? | Backend `comparePassword` failure |
| Is this a frontend bug? | **No** — for the reproduced case |
| Which validation failed? | **`Invalid password!`** (password hash mismatch) |

---

## 10. Recommended Next Steps (Diagnosis Only — Not Implemented)

1. Confirm the password for the account being used, or reset it via the forgot-password flow.
2. If using E2E/test accounts, re-seed or verify credentials against the active `DB_URL` (local vs production).
3. In DevTools → Network, expand the failed `login-user` row and read **`response.data.message`** — it will be one of the four backend strings above, not just `ERR_BAD_REQUEST`.
4. If the message is `Please login with Google`, use Google OAuth instead of password login for that account.

---

## Files Referenced

| Layer | File |
|-------|------|
| Login form | `src/components/Login/Login.jsx` |
| API base URL | `src/config/serverConfig.js` |
| Axios defaults / interceptors | `src/config/setupApiClient.js` |
| Dev proxy | `src/setupProxy.js` |
| Backend route | `BACKED/guriraline_server-main/.../controller/user.js` |
| Error format | `BACKED/guriraline_server-main/.../middleware/error.js` |
| Email normalize | `BACKED/guriraline_server-main/.../utils/normalizeEmail.js` |
