# Database Cleanup Inventory

**Date:** 2026-08-06  
**Mode:** READ-ONLY AUDIT — **no documents deleted**  
**Database:** MongoDB (`DB_URL` from backend `.env`)  
**Database name:** `test`  
**Total collections:** 41  
**Total documents:** 239  

---

## Executive Summary

| Classification | Count | Notes |
|----------------|-------|-------|
| **Production (protected)** | **2** | Owner user + owner shop — **never delete** |
| **Production (likely real catalog)** | **~105** | Products, conversations, messages, configs — **keep unless proven otherwise** |
| **High-confidence demo/E2E** | **25** | Titles contain `E2E`, `Unified Auth`, `Runtime verify`, `Visual Audit Test` |
| **Development test user** | **1** | `derick@gmail.com` — remove only with approval |
| **System audit logs (mock AI)** | **93** | `platformaudits` with `providerId: mock` — safe to purge for production hygiene |
| **E2E-linked messaging artifacts** | **~10** | Messages/notifications/conversations tied to verify scripts |
| **Manual review required** | **3** | Radisson hotel listings — **false-positive risk** (pattern `\bqa\b` matched metadata) |

**Automated scan proposed 132 documents for removal.**  
**Recommended approved deletion (conservative): 25 high-confidence + 1 test user + optional audit/messaging cleanup.**  
**Do NOT auto-delete Radisson listings or unknown catalog/conversations without owner review.**

---

## Protected Accounts (NEVER DELETE)

| Collection | `_id` | Label | Email | Role |
|------------|-------|-------|-------|------|
| `users` | `6a569862a85d5895dc95c1f9` | Bon | `bonbreizy@gmail.com` | Admin |
| `shops` | `6a64e98ddcdc9f592fe0d774` | YEBONE | `bonbreizy@gmail.com` | Vendor shop |

---

## Collection Summary

| Collection | Total | Production | Demo | Test | Seed | Unknown | Proposed removal |
|------------|------:|-------------:|-----:|-----:|-----:|--------:|-----------------:|
| `aianalyticssnapshots` | 8 | 0 | 0 | 0 | 0 | 8 | 0 |
| `airequestidempotencies` | 0 | — | — | — | — | — | 0 |
| `bids` | 0 | — | — | — | — | — | 0 |
| `commissions` | 0 | — | — | — | — | — | 0 |
| `communicationoffers` | 0 | — | — | — | — | — | 0 |
| `configurationhistories` | 2 | 0 | 0 | 0 | 0 | 2 | 0 |
| `conversations` | 7 | 0 | 1 | 0 | 0 | 6 | 1 |
| `coupouncodes` | 0 | — | — | — | — | — | 0 |
| `deliveryconfigurations` | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| `deliveryrecords` | 0 | — | — | — | — | — | 0 |
| `events` | 3 | 0 | 3 | 0 | 0 | 0 | 3 |
| `flashsales` | 0 | — | — | — | — | — | 0 |
| `growthcommerceambassadors` | 0 | — | — | — | — | — | 0 |
| `growthcommercecampaigns` | 0 | — | — | — | — | — | 0 |
| `growthcommerceconfigs` | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| `growthcommercehomepages` | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| `growthconfigurations` | 0 | — | — | — | — | — | 0 |
| `messages` | 34 | 0 | 6 | 0 | 0 | 28 | 6 |
| `notifications` | 34 | 0 | 3 | 0 | 0 | 31 | 3 |
| `orderidempotencyrecords` | 0 | — | — | — | — | — | 0 |
| `orders` | 0 | — | — | — | — | — | 0 |
| `payment_audit_logs` | 0 | — | — | — | — | — | 0 |
| `payment_idempotency_keys` | 0 | — | — | — | — | — | 0 |
| `payment_transactions` | 0 | — | — | — | — | — | 0 |
| `paymentrecords` | 0 | — | — | — | — | — | 0 |
| `platformaudits` | 99 | 0 | 93 | 0 | 0 | 6 | 93 |
| `platformconfigurations` | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| `platformfeatureflags` | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| `previewsessions` | 0 | — | — | — | — | — | 0 |
| `products` | 23 | 0 | 9 | 0 | 0 | 14 | 9 |
| `propertymobilityconfigs` | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| `propertymobilitylistings` | 16 | 0 | 16 | 0 | 0 | 0 | 16 |
| `pushsubscriptions` | 0 | — | — | — | — | — | 0 |
| `selleroperationsconfigs` | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| `shops` | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| `trustbuyerprotectionconfigs` | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| `users` | 2 | 1 | 1 | 0 | 0 | 0 | 1 |
| `vendoraisubscriptions` | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| `vendorcreditswallets` | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| `vendorcredittransactions` | 0 | — | — | — | — | — | 0 |
| `withdraws` | 0 | — | — | — | — | — | 0 |

### Empty collections (20)

`airequestidempotencies`, `bids`, `commissions`, `communicationoffers`, `coupouncodes`, `deliveryrecords`, `flashsales`, `growthcommerceambassadors`, `growthcommercecampaigns`, `growthconfigurations`, `orderidempotencyrecords`, `orders`, `payment_audit_logs`, `payment_idempotency_keys`, `payment_transactions`, `paymentrecords`, `previewsessions`, `pushsubscriptions`, `vendorcredittransactions`, `withdraws`

**No wishlist, address, category, session, token, or upload collections exist** in this database under separate collection names (wishlists/addresses may be embedded on user documents).

---

## Tier 1 — HIGH CONFIDENCE (recommended for deletion after approval)

Clear E2E / Playwright / API verification titles. **25 documents.**

### Events (3)

| `_id` | Title | Created |
|-------|-------|---------|
| `6a71f34bfa0d619d26683dd4` | E2E API Event | 2026-08-04 |
| `6a720626fa0d619d266848c1` | E2E Unified Auth Event | 2026-08-04 |
| `6a721631fa0d619d26684b31` | E2E Unified Auth Event | 2026-08-04 |

### Products (9)

| `_id` | Name |
|-------|------|
| `6a71f349fa0d619d26683dc3` | E2E API Product |
| `6a72003afa0d619d26684147` | E2E Unified Auth Product |
| `6a7200bbfa0d619d26684255` | E2E Unified Auth Product |
| `6a72019ffa0d619d266843a8` | E2E Unified Auth Product |
| `6a720294fa0d619d26684504` | E2E Unified Auth Product |
| `6a720542fa0d619d26684640` | E2E Unified Auth Product |
| `6a720610fa0d619d266847df` | E2E Unified Auth Product |
| `6a721614fa0d619d26684a4e` | E2E Unified Auth Product |
| `6a743994853efe2c0b53bd5f` | E2E Unified Auth Product |

### Property & Mobility listings (13)

| `_id` | Title | Evidence |
|-------|-------|----------|
| `6a6fbcbfbf73d96ca16bdc03` | Runtime verify 1785707711289 | Messaging runtime script |
| `6a71aaf2585c5be8290f6b3d` | E2E Browser Verify Apartment Kigali | E2E browser test |
| `6a71f349fa0d619d26683dc8` | E2E API House | API verification |
| `6a71f34afa0d619d26683dce` | E2E API Car | API verification |
| `6a7200c3fa0d619d266842b5` | E2E Unified Auth House | Playwright unified auth |
| `6a7201a7fa0d619d26684409` | E2E Unified Auth House | Playwright unified auth |
| `6a72054bfa0d619d266846a7` | E2E Unified Auth House | Playwright unified auth |
| `6a720553fa0d619d266846e3` | E2E Unified Auth Car | Playwright unified auth |
| `6a720618fa0d619d2668484e` | E2E Unified Auth House | Playwright unified auth |
| `6a720620fa0d619d2668488b` | E2E Unified Auth Car | Playwright unified auth |
| `6a72161ffa0d619d26684abc` | E2E Unified Auth House | Playwright unified auth |
| `6a72162afa0d619d26684afb` | E2E Unified Auth Car | Playwright unified auth |
| `6a723d4efa0d619d26684eec` | Visual Audit Test House | PM dashboard visual audit |

---

## Tier 2 — Development test user (recommended after approval)

| Collection | `_id` | Name | Email | Evidence |
|------------|-------|------|-------|----------|
| `users` | `6a6660d4b7c2b17054691302` | Derick iradukunda | `derick@gmail.com` | Known dev/buyer test account from E2E sessions |

**Note:** No separate `shops` document for `derick@gmail.com`. Deleting this user may orphan buyer-side conversations if not cleaned in Tier 3.

---

## Tier 3 — E2E-linked messaging (optional after approval)

Messages/notifications created during `verify-messaging-runtime.js` and related QA. **10 documents.**

| Collection | `_id` | Reason |
|------------|-------|--------|
| `conversations` | `6a73a0a1b1cbb895c4b9b70a` | `\bqa\b` pattern in document payload |
| `messages` | `6a6cdf0985db846625202099` | `runtime verify` in body/metadata |
| `messages` | `6a6cf33e1ddeaea0f666ed41` | `runtime verify` |
| `messages` | `6a6f03a9eb55860c457e436b` | `runtime verify` |
| `messages` | `6a73a0a4b1cbb895c4b9b70d` | `\bqa\b` pattern |
| `messages` | `6a73a2eeb1cbb895c4b9b758` | `\bqa\b` pattern |
| `messages` | `6a73acd0b1cbb895c4b9b920` | `\bqa\b` pattern |
| `notifications` | `6a6cdf0985db8466252020b5` | Linked to runtime verify message |
| `notifications` | `6a6cf33e1ddeaea0f666ed45` | Linked to runtime verify message |
| `notifications` | `6a6f03aaeb55860c457e436f` | Linked to runtime verify message |

**28 other messages and 6 conversations are classified UNKNOWN** — appear to be real buyer/seller threads on catalog products. **KEEP.**

---

## Tier 4 — Platform audit logs (optional after approval)

| Collection | Count | Evidence |
|------------|------:|----------|
| `platformaudits` | 93 | AI audit entries with `newValue.providerId: "mock"` or E2E-related correlation payloads |

These are **system telemetry**, not marketplace listings. Safe to purge for production hygiene but **not user-facing data**.

6 remaining `platformaudits` documents did not match demo patterns — **KEEP** unless review shows otherwise.

---

## Tier 5 — MANUAL REVIEW (do NOT delete without owner confirmation)

| Collection | `_id` | Title | Why flagged | Recommendation |
|------------|-------|-------|-------------|----------------|
| `propertymobilitylistings` | `6a6fc026bf73d96ca16bdc8c` | Radisson hotel | False positive: `\bqa\b` matched substrings in metadata/IDs | **KEEP** unless owner confirms test listing |
| `propertymobilitylistings` | `6a71af9e585c5be8290f6c2d` | Radisson blu hotel | Same false positive | **KEEP** pending review |
| `propertymobilitylistings` | `6a7219dcfa0d619d26684b76` | Radisson biu Hotel | Same false positive | **KEEP** pending review |

These look like **real vendor property listings** (detailed descriptions, amenities, Kigali-style content) created during dashboard testing — not E2E-titled artifacts.

---

## Production Data to KEEP

### Products (14 — unknown / likely real catalog)

| `_id` | Name |
|-------|------|
| `6a689e90864328edfc4273a5` | Retro England Quarter-Zip Sweatshirt |
| `6a68ad6e864328edfc427548` | Vintage Washed Sherpa Zip Hoodie |
| `6a68b142864328edfc4275d7` | Premium Retro Fleece Zip Jacket |
| `6a68b23a864328edfc427614` | Sport Fleece Zip Hoodie & Jogger Set |
| `6a68b34f864328edfc427667` | Men's Performance Hooded Track Set |
| `6a68b654864328edfc427736` | Modern Oversized Casual T-Shirt |
| `6a68b6d2864328edfc42776d` | Essential Oversized Crew Neck T-Shirt |
| `6a68b757864328edfc4277a4` | Minimalist Colorblock Oversized T-Shirt |
| `6a68b7cc864328edfc4277d9` | Premium Striped Quarter-Zip Polo Shirt |
| `6a68b8fb864328edfc427839` | Performance Gym Compression Set – Black |
| `6a68b9f5864328edfc427876` | Athletic Training Apparel Set – Black |
| `6a746baa853efe2c0b53c71c` | Magnetic Smartphone Camera Grip Wireless |
| `6a746d6e853efe2c0b53c79c` | Ulanzi MA35 Phone Camera Grip Handle |
| `6a746ee3853efe2c0b53c82d` | Multi-Angle 2 in 1 Aluminum Phone Tablet Stand |

### Platform configuration (keep)

Single-document configs: `deliveryconfigurations`, `growthcommerceconfigs`, `growthcommercehomepages`, `platformconfigurations`, `platformfeatureflags`, `propertymobilityconfigs`, `selleroperationsconfigs`, `trustbuyerprotectionconfigs`, `vendoraisubscriptions`, `vendorcreditswallets`, `configurationhistories` (2)

### AI analytics (keep — review optional)

8 `aianalyticssnapshots` — no demo markers; operational metrics from AI gateway usage.

---

## Recommended Deletion Plan (pending your approval)

| Tier | Documents | Action |
|------|----------:|--------|
| 1 — High confidence E2E | 25 | **Delete** |
| 2 — Test user | 1 | **Delete** (optional: keep for future E2E in staging) |
| 3 — E2E messaging | 10 | **Delete** (after verifying no production thread overlap) |
| 4 — Mock audit logs | 93 | **Delete** (optional hygiene) |
| 5 — Radisson listings | 3 | **DO NOT DELETE** without explicit owner OK |

**Conservative minimum deletion:** 26 documents (Tier 1 + Tier 2)  
**Aggressive hygiene deletion:** 129 documents (Tiers 1–4, excluding Radisson)

---

## Audit Methodology

1. Connected read-only to MongoDB via backend `DB_URL`
2. Listed all 41 collections with `listCollections`
3. Loaded every document and scanned flattened string fields against demo/E2E/seed patterns (aligned with `src/utils/catalogQuality.js` plus backend test markers)
4. Protected `bonbreizy@gmail.com` from any removal classification
5. **No writes, updates, or deletes performed**

Audit script (local, not for production): `BACKED/scripts/_readonly-db-audit.js`  
Raw JSON output: `BACKED/scripts/_audit-output.json`

---

## STOP — Awaiting Confirmation

**No database modifications have been made.**

To proceed with deletion, reply exactly:

```text
APPROVE DATABASE CLEANUP
```

Optionally specify scope in the same message:

- `MINIMUM` — Tier 1 + Tier 2 only (26 docs)
- `STANDARD` — Tier 1 + 2 + 3 (36 docs)
- `FULL HYGIENE` — Tier 1 + 2 + 3 + 4 (129 docs, excludes Radisson manual-review items)

After approved cleanup, `docs/design/DATABASE_CLEANUP_REPORT.md` will be generated with before/after counts.

---

## Risks & Notes

1. **Database name is `test`** — confirm this is the intended production/staging cluster before approving deletion.
2. **Pattern false positives** — `\bqa\b` matched Radisson listings and some message payloads; conservative approach keeps them.
3. **Orphan cleanup** — deleting E2E products without deleting related `platformaudits` entries leaves harmless audit noise (Tier 4 addresses this).
4. **No orders, payments, coupons, or wishlists** exist in this database today — nothing to clean in those domains.
5. **Real conversations** exist between buyers and the YEBONE shop on real products — must not be bulk-deleted.
