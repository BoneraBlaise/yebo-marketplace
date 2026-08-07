# Database Cleanup Report

**Date:** 2026-08-06  
**Approval:** `APPROVE DATABASE CLEANUP (CUSTOM)`  
**Database:** MongoDB (`test`)  
**Script:** `BACKED/guriraline_server-main/scripts/execute-database-cleanup-custom.js`  
**Result file:** `BACKED/.../scripts/_cleanup-result.json`

---

## Summary

| Metric | Value |
|--------|------:|
| Documents before | **239** |
| Documents deleted | **128** |
| Documents after | **111** |
| Errors | **0** |

All post-cleanup verification checks **passed**.

---

## Verification (after cleanup)

| Check | Result |
|-------|--------|
| `bonbreizy@gmail.com` exists | ✓ |
| `derick@gmail.com` exists | ✓ |
| YEBONE shop exists (`bonbreizy@gmail.com`) | ✓ |
| Real products preserved | ✓ **14** remaining |
| E2E/demo products removed | ✓ **0** remaining |
| E2E/demo events removed | ✓ **0** remaining |
| E2E/demo property listings removed | ✓ **0** remaining (1 Radisson kept) |
| Runtime-verify messages removed | ✓ **0** remaining |
| Primary Radisson Blu listing kept | ✓ `_id: 6a71af9e585c5be8290f6c2d` |

---

## Before / After Counts (changed collections)

| Collection | Before | After | Deleted |
|------------|-------:|------:|--------:|
| `products` | 23 | 14 | 9 |
| `events` | 3 | 0 | 3 |
| `propertymobilitylistings` | 16 | 1 | 15 |
| `conversations` | 7 | 6 | 1 |
| `messages` | 34 | 28 | 6 |
| `notifications` | 34 | 28 | 6 |
| `platformaudits` | 99 | 11 | 88 |
| **All other collections** | unchanged | unchanged | 0 |
| **TOTAL** | **239** | **111** | **128** |

### Unchanged collections (non-zero before)

| Collection | Count (before & after) |
|------------|----------------------:|
| `aianalyticssnapshots` | 8 |
| `configurationhistories` | 2 |
| `deliveryconfigurations` | 1 |
| `growthcommerceconfigs` | 1 |
| `growthcommercehomepages` | 1 |
| `platformconfigurations` | 1 |
| `platformfeatureflags` | 1 |
| `propertymobilityconfigs` | 1 |
| `selleroperationsconfigs` | 1 |
| `shops` | 1 |
| `trustbuyerprotectionconfigs` | 1 |
| `users` | 2 |
| `vendoraisubscriptions` | 1 |
| `vendorcreditswallets` | 1 |

20 collections were empty before and remain empty (`orders`, `payments`, `coupons`, etc.).

---

## Intentionally Preserved

### Users

| `_id` | Email | Name | Role |
|-------|-------|------|------|
| `6a569862a85d5895dc95c1f9` | `bonbreizy@gmail.com` | Bon | Admin |
| `6a6660d4b7c2b17054691302` | `derick@gmail.com` | Derick iradukunda | user |

### Shop

| `_id` | Name | Email |
|-------|------|-------|
| `6a64e98ddcdc9f592fe0d774` | YEBONE | `bonbreizy@gmail.com` |

### Real products (14 — all manually created catalog items)

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

### Property listing kept (primary Radisson Blu)

| `_id` | Title |
|-------|-------|
| `6a71af9e585c5be8290f6c2d` | Radisson blu hotel |

### Real conversations & messaging

- **6 conversations** retained (buyer/seller threads on real products)
- **28 messages** retained
- **28 notifications** retained

### Production configuration

All platform config documents retained (`platformconfigurations`, `platformfeatureflags`, `deliveryconfigurations`, `propertymobilityconfigs`, `selleroperationsconfigs`, `trustbuyerprotectionconfigs`, `growthcommerce*`, `configurationhistories`, `vendoraisubscriptions`, `vendorcreditswallets`).

---

## Deleted Documents (128 total)

### Products — E2E / Unified Auth (9)

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

### Events — E2E (3)

| `_id` | Name |
|-------|------|
| `6a71f34bfa0d619d26683dd4` | E2E API Event |
| `6a720626fa0d619d266848c1` | E2E Unified Auth Event |
| `6a721631fa0d619d26684b31` | E2E Unified Auth Event |

### Property & mobility listings (15)

| `_id` | Title | Reason |
|-------|-------|--------|
| `6a6fbcbfbf73d96ca16bdc03` | Runtime verify 1785707711289 | Runtime verification |
| `6a71aaf2585c5be8290f6b3d` | E2E Browser Verify Apartment Kigali | E2E browser test |
| `6a71f349fa0d619d26683dc8` | E2E API House | API verification |
| `6a71f34afa0d619d26683dce` | E2E API Car | API verification |
| `6a7200c3fa0d619d266842b5` | E2E Unified Auth House | Playwright |
| `6a7201a7fa0d619d26684409` | E2E Unified Auth House | Playwright |
| `6a72054bfa0d619d266846a7` | E2E Unified Auth House | Playwright |
| `6a720553fa0d619d266846e3` | E2E Unified Auth Car | Playwright |
| `6a720618fa0d619d2668484e` | E2E Unified Auth House | Playwright |
| `6a720620fa0d619d2668488b` | E2E Unified Auth Car | Playwright |
| `6a72161ffa0d619d26684abc` | E2E Unified Auth House | Playwright |
| `6a72162afa0d619d26684afb` | E2E Unified Auth Car | Playwright |
| `6a723d4efa0d619d26684eec` | Visual Audit Test House | Visual audit |
| `6a6fc026bf73d96ca16bdc8c` | Radisson hotel | Duplicate Radisson |
| `6a7219dcfa0d619d26684b76` | Radisson biu Hotel | Duplicate Radisson (typo) |

### Conversations — E2E (1)

| `_id` |
|-------|
| `6a73a0a1b1cbb895c4b9b70a` |

### Messages — runtime verify / E2E (6)

| `_id` |
|-------|
| `6a6cdf0985db846625202099` |
| `6a6cf33e1ddeaea0f666ed41` |
| `6a6f03a9eb55860c457e436b` |
| `6a73a0a4b1cbb895c4b9b70d` |
| `6a73a2eeb1cbb895c4b9b758` |
| `6a73acd0b1cbb895c4b9b920` |

### Notifications — E2E / runtime verify (6)

| `_id` |
|-------|
| `6a6cdf0985db8466252020b5` |
| `6a6cf33e1ddeaea0f666ed45` |
| `6a6f03aaeb55860c457e436f` |
| `6a73a0a6b1cbb895c4b9b711` |
| `6a73a2f0b1cbb895c4b9b75c` |
| `6a73acd2b1cbb895c4b9b924` |

### Platform audits — mock AI / E2E / runtime verify (88)

Removed all audit records where `providerId: mock`, or payload contained `e2e`, `runtime verify`, `unified auth`, or test listing markers.

**88 documents deleted** from `platformaudits`.

Full ID list: see `_cleanup-result.json` → `deleted` array (platformaudits entries).

---

## Manual Review Items

| Item | Count | Recommendation |
|------|------:|----------------|
| Remaining `platformaudits` | **11** | Non-demo operational AI audit entries — **kept intentionally**. Review if you want zero audit history. |
| `aianalyticssnapshots` | **8** | AI usage metrics — not E2E-tagged — **kept**. Optional purge if you want a clean analytics baseline. |
| Database name `test` | — | Confirm this cluster is your intended production/staging target. |

---

## Potential Risks

1. **Low:** Remaining 11 platform audits may include early development AI activity — not user-facing.
2. **None identified** for protected users, shop, or real product catalog.
3. **Radisson duplicates removed** — primary listing `Radisson blu hotel` preserved per custom rules.

---

## Collections Untouched

No documents deleted from: `users`, `shops`, `aianalyticssnapshots`, `configurationhistories`, `deliveryconfigurations`, `growthcommerceconfigs`, `growthcommercehomepages`, `platformconfigurations`, `platformfeatureflags`, `propertymobilityconfigs`, `selleroperationsconfigs`, `trustbuyerprotectionconfigs`, `vendoraisubscriptions`, `vendorcreditswallets`, or any empty collection.

---

## Conclusion

Custom cleanup completed successfully under approved rules:

- **128** demo/E2E/runtime-verify documents removed  
- **111** production documents retained  
- Owner account, test user `derick@gmail.com`, YEBONE shop, 14 real products, 6 real conversations, and primary Radisson Blu listing **confirmed intact**  
- **Zero** E2E/demo catalog items remain in products, events, or property listings
