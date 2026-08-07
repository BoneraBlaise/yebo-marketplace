# YEBONE Sprint 4.1 — Authentication Polish Report

**Date:** 2026-08-07  
**Scope:** Production polish only — no redesign, no new auth features, no JWT/OTP/schema changes

---

## Summary

| Task | Status |
|------|--------|
| New Google users → Homepage + Welcome toast | ✅ |
| Google profile photo persistence | ✅ |
| Shared avatar fallback (no broken images) | ✅ |
| Email logo public HTTPS URL | ✅ |
| Password reset session-expired UX | ✅ |
| Auth regression (unit tests) | ✅ 29/29 |

---

## 1. Google redirect fix (new users)

**Backend** (`app.js`, `config/passport.js`):
- Passport verify returns `{ isNewUser }` from `resolveGoogleUser`
- Welcome email sent only for new Google users
- Callback appends `?newUser=1` (or `&newUser=1`) to the frontend redirect for new accounts
- Existing users keep the previous redirect (no query flag)

**Frontend** (`LoginSuccessHandler.jsx`):
- If `newUser=1` → toast **"Welcome to YEBONE"** → navigate **`/`**
- Otherwise → toast **"Login Successful!"** → navigate `redirect` or **`/profile`**

Existing Google login behavior is unchanged.

---

## 2. Avatar persistence (Google photo)

**Backend** (`utils/googleAccountLink.js`):
- Reads `profile.photos[0].value`, then `_json.picture`, then `picture`
- New users store `{ public_id: google_<id>, url: <photo or default> }`
- Existing users refresh avatar when current URL is empty or default `logo512.png`
- Default falls back to public logo URL (never empty)

Returned via existing `GET /user/getuser` — no API shape changes.

---

## 3. Avatar fallback (frontend)

**Shared helper:** `src/utils/userAvatar.js`
- `DEFAULT_USER_AVATAR_URL = "/logo512.png"`
- `getUserAvatarUrl(userOrUrl)`
- `handleAvatarImgError` — one-shot swap to default (no broken-image loop)

**Component:** `src/components/Auth/UserAvatar.jsx`

**Wired into:**
- Home header, Bottom nav, Profile, Dashboard layout, Admin topbar
- Design-system Avatar
- Inbox toast sync
- Product review avatars, shop profile reviews, shop storefront reviews
- Messaging toast (user avatar path)

Broken / empty / 404 images are replaced by the default avatar.

---

## 4. Email logo fix

**File:** `utils/email/emailBrand.js`

- Logo no longer uses `localhost` / relative paths when `FRONTEND_URL` is local
- Public HTTPS base: `https://bonerablaise.github.io/yebo-marketplace/logo512.png`
- Verified reachable (HTTP 200, `image/png`)
- TODO comment retained for future official YEBONE CDN replacement
- Template layout unchanged (welcome + OTP emails)

---

## 5. Password reset UX polish

**File:** `ForgotPassword.js` — `sessionExpired` step

| Element | Copy |
|---------|------|
| Title | Session expired |
| Body | Your password reset session has expired. Request a new verification code to continue. |
| Primary | Request New Code → returns to email step |
| Secondary | Back to Login |

Reuses existing `AuthLayout` / button styles. OTP logic unchanged.

---

## 6. Regression verification

| Area | Result |
|------|--------|
| Backend `npm run test:auth` | **29/29 PASS** |
| Google account create + photo URL | Unit covered |
| Google account linking | Unit covered |
| Password policy / OTP / session invalidation | Unit covered |
| Welcome email template builder | Unit covered |
| Cookie/JWT/rate-limit contracts | Unchanged from Sprint 4 |

Manual browser checks recommended for full Google sign-up/sign-in UX (new user homepage toast).

---

## Files touched

### Frontend
- `LoginSuccessHandler.jsx`, `ForgotPassword.js`
- `userAvatar.js`, `UserAvatar.jsx`, `Auth/index.js`
- Header / BottomNav / Profile / Dashboard / AdminTopbar / design-system Avatar
- Review + messaging avatar call sites

### Backend
- `app.js`, `config/passport.js`
- `utils/googleAccountLink.js`, `utils/email/emailBrand.js`
- `utils/__tests__/googleAccountLink.test.js`

---

## Security note

During polish verification, a Gmail App Password was found accidentally written into `.env.example`. It was **reverted to empty** and **not committed**. Rotate the App Password in Google Account security if that value was ever shared or committed elsewhere.
