# YEBONE Product Variants / SKU Architecture

**Sprint:** Product Variants — Phase 0 (Audit + Design)  
**Date:** 2026-08-10  
**Status:** Architecture proposal — **no implementation yet**  
**Repos:** Frontend `guriraline_app-main` · Backend `guriraline_server-main`

---

## 1. Goal

Support **one parent product → multiple purchasable SKUs/variants**, each with its own:

- option combination (e.g. Color + Size + Package)
- price and compare-at price
- SKU code
- stock and availability
- images (optional per variant)

**Example**

| Parent product | Magnetic Smartphone Camera Grip Wireless |
|----------------|------------------------------------------|
| Variants | Grip Only · Grip + Ring Light · Grip + Stand · Full Set |
| Option groups | Package (Grip Only / + Ring Light / + Stand / Full Set) |

**Constraints**

- Existing products **must keep working** without migration breakage
- No destructive schema changes
- Practical marketplace scope — not an enterprise PIM

---

## 2. Current Architecture

### 2.1 Backend — flat product model

| Layer | Finding |
|-------|---------|
| **Product schema** | One MongoDB document = one sellable unit |
| **Price** | `discountPrice` (required), `originalPrice` (optional) on product |
| **Stock** | `stock` (required), `sold_out` (counter) on product |
| **SKU** | **Not on Product schema** |
| **Images** | `images[]` with `{ public_id, url }` (Cloudinary) |
| **Variants** | **None** in core catalog |
| **Cart** | **No server-side cart model** — client sends array to order creation |
| **Orders** | `cart[]` embedded array of repriced product snapshots |
| **Inventory** | Atomic `$inc` on `Product.stock` by `productId` only |

**Key files**

| Area | Path |
|------|------|
| Product schema | `backend/model/product.js` |
| Create/update service | `backend/marketplace/services/ProductService.js` |
| Validation | `backend/marketplace/catalog/ProductValidation.js` |
| Pricing at checkout | `backend/marketplace/integration/pricing/OrderPricingService.js` |
| Inventory reservation | `backend/marketplace/orders/OrderInventoryService.js` |
| Order schema | `backend/model/order.js` |
| Order creation | `backend/marketplace/services/OrderService.js` |
| Product routes | `backend/controller/product.js` → `/api/v2/product/*` |
| Search | `backend/marketplace/services/SearchService.js` |
| Seller SKU overlay (parallel, not integrated) | `backend/marketplace/seller-operations/SkuBarcodeService.js` |

**Product API surface today**

| Method | Route | Notes |
|--------|-------|-------|
| POST | `/api/v2/product/create-product` | Creates flat product |
| GET | `/api/v2/product/get-all-products` | List + search delegation |
| GET | `/api/v2/product/get-all-products-shop/:id` | Shop catalog |
| DELETE | `/api/v2/product/delete-shop-product/:id` | Delete |
| — | **No GET by ID route** | Clients filter list/search |
| — | **No PUT update route** | Service exists but not exposed |

**Checkout flow**

```
Client cart[] → POST /api/v2/order/create-order
  → OrderPricingService.repriceCart()     // loads Product by _id, product-level price
  → OrderInventoryService.reserveCart() // decrements Product.stock by productId
  → Order document with embedded cart[]
  → Payment session
```

**Order line item shape (repriced)**

```javascript
{
  _id, productId, name, category, brand, tags,
  shopId, shop, images, qty,
  originalPrice, discountPrice, price, serverPrice,
  lineTotal, commissionBase
}
// No variantId, sku, or selectedOptions
```

### 2.2 Frontend — single-SKU commerce path

| Area | Finding |
|------|---------|
| **Vendor create** | `CreateProductWizard.jsx` — name, price, stock, images only |
| **Vendor edit** | **No production edit API/UI** — list + delete only (`AllProducts.jsx`) |
| **Product detail** | Redux list lookup by `:id`; product-level price/stock |
| **Variant UI** | `ProductVariants.jsx` — size/color chips, **local state only, not wired to cart** |
| **Product cards** | `ProductCard.jsx` — `_id`, `discountPrice`, `stock`, `images[0]` |
| **Cart** | Redux `cart.js` — dedup by `_id` only; persisted to `localStorage.cartItems` |
| **Checkout** | `Checkout.jsx` → `Payment.jsx` → `POST /order/create-order` |
| **Orders** | Display product snapshots; optional `color`/`size` display hooks never populated |

**Key files**

| Area | Path |
|------|------|
| Vendor create wizard | `src/components/seller-experience/CreateProductWizard.jsx` |
| Vendor product list | `src/components/Shop/AllProducts.jsx` |
| Product detail | `src/components/Products/ProductDetails.jsx` |
| Variant UI (cosmetic) | `src/components/Products/ProductVariants.jsx` |
| Purchase panel | `src/components/Products/ProductPurchasePanel.jsx` |
| Product cards | `src/components/Marketplace/ProductCard.jsx` |
| Cart reducer | `src/redux/reducers/cart.js` |
| Checkout | `src/components/Checkout/Checkout.jsx` |
| Payment / order create | `src/components/Payment/Payment.jsx` |
| Order display | `src/components/Orders/OrderItemsList.jsx` |

**Mock/placeholder UI (not production path)**

- `src/vendor-ui/components/products/ProductManagement.jsx` — SKU/variant inputs, no API
- `src/customer-ui/components/product-details/ProductDetailsView.jsx` — mock `variants[]`

### 2.3 Parallel SKU subsystem (not integrated)

Seller Operations exposes vendor SKU assignment via in-memory registry:

- `POST /api/v2/marketplace/seller-operations/vendor/sku`
- SKU stored per `vendorId + productId`, **not** in Product document
- **Not used** in cart, checkout, or order repricing
- Feature flag: `inventoryRedesign: { enabled: false, phase: "future" }` in `MarketplaceFeatureRegistry.js`

---

## 3. Current Product Data Structure

### 3.1 Live database snapshot (read-only, 2026-08-10)

| Metric | Value |
|--------|-------|
| Products in DB | **14** (live API count) |
| Historical audit (2026-08-06) | 23 total, ~14 catalog + 9 E2E/demo candidates |
| Orders in DB | 0 (at last cleanup audit) |
| Variant fields on any product | **None** (`variants`, `sizes`, `colors` all absent) |

**Sample product fields in production**

```
_id, name, description, category, tags, originalPrice, discountPrice,
featured, bestdeal, stock, likes, images, shopId, shop, sold_out,
productType, condition, location, createdAt, reviews
```

### 3.2 Backward compatibility assessment

| Question | Answer |
|----------|--------|
| Can existing products remain valid without variants? | **Yes** — continue using top-level `discountPrice`, `stock`, `images` |
| Must existing products be migrated? | **No** — optional additive fields only |
| Risk to current checkout? | **Low** if variant logic is gated behind `hasVariants` / empty `variants[]` |
| Risk to listing cards? | **Low** if list endpoints keep returning parent-level price/stock for non-variant products |

---

## 4. Proposed Variant Model

### 4.1 Design choice: embedded `optionGroups` + `variants[]` on Product

**Recommended structure**

```javascript
Product {
  // --- existing fields unchanged ---
  name, description, category, tags, brand,
  originalPrice, discountPrice, stock, images, shopId, shop, ...

  // --- new optional fields ---
  hasVariants: Boolean,          // default false
  optionGroups: [OptionGroup],   // empty when hasVariants=false
  variants: [ProductVariant]     // empty when hasVariants=false
}
```

**Why embedded (not a separate collection)**

| Factor | Embedded on Product | Separate `ProductVariant` collection |
|--------|---------------------|-------------------------------------|
| YEBONE scale (~14–100 products) | ✅ Simple reads, one query for PDP | Overkill |
| Variant count per product (typically &lt;50) | ✅ Document size safe | Better at 1000+ variants |
| Atomic inventory update | ✅ `$inc` on nested array element with positional operator | Requires two collections / transactions |
| Backward compatibility | ✅ Additive fields, old docs untouched | Same, but more joins |
| Implementation cost | ✅ Lower | Higher |

Use a **separate collection only if** a single product regularly exceeds ~100 SKUs or needs cross-shop SKU federation. That is not a YEBONE near-term requirement.

### 4.2 Option group model

```javascript
OptionGroup {
  id: String,           // stable client id, e.g. "opt_color"
  name: String,         // display label: "Color", "Size", "Package"
  position: Number,     // sort order in UI
  values: [OptionValue]
}

OptionValue {
  id: String,           // stable id, e.g. "val_black"
  label: String,        // "Black", "42", "Shoes + Socks"
  position: Number
}
```

**Rules**

- 1–3 option groups per product (practical UI limit)
- Option values are **definitions only** — price/stock live on variants
- Option group order is fixed; variant `optionValueIds` must reference valid ids

### 4.3 SKU / variant model

```javascript
ProductVariant {
  id: String,                    // stable variant id (UUID), used in cart/orders
  sku: String,                   // vendor-facing SKU, unique per shopId
  optionValueIds: [String],      // one value id per option group, defines combination
  title: String,                 // optional display: "Black / 42 / Shoes + Socks"
  discountPrice: Number,         // required when hasVariants=true
  originalPrice: Number,           // compare-at
  stock: Number,
  sold_out: Number,                // optional counter per variant
  isAvailable: Boolean,            // default true; manual disable without deleting
  images: [{ public_id, url }],   // optional; fallback to parent images
  position: Number
}
```

**Combination example**

```
Option groups:
  Color: Black, White, Orange
  Size: S, M, L, XL
  Package: Shoes Only, Shoes + Socks, Full Set

Variant (one concrete SKU):
  id: "var_abc123"
  sku: "SHOE-BLK-42-SOCKS"
  optionValueIds: ["val_black", "val_42", "val_shoes_socks"]
  discountPrice: 45000
  originalPrice: 52000
  stock: 8
  images: [...]
```

### 4.4 Resolved product semantics

| `hasVariants` | Purchasable unit | Price/stock source | PDP behavior |
|---------------|------------------|--------------------|--------------|
| `false` or missing | Product document | `discountPrice`, `stock` on product | Current behavior |
| `true` | Selected variant | Variant fields; parent price/stock become **display defaults only** | Must select valid combination |

**Listing/search aggregation (variant products)**

For cards and search results, expose computed fields on the parent (server-side):

```javascript
{
  hasVariants: true,
  discountPrice: minVariantPrice,      // lowest available variant price
  originalPrice: minVariantOriginal,   // optional
  stock: sumVariantStock,            // total available units
  // keep full variants[] only on detail endpoint
}
```

This avoids breaking `ProductCard` and search filters that read top-level `discountPrice` / `stock`.

---

## 5. Cart Requirements

### 5.1 Cart line identity

**Today:** dedup key = `product._id`

**Proposed:** dedup key = `productId + variantId`

| Field | Required | Notes |
|-------|----------|-------|
| `productId` | Yes | Parent product `_id` |
| `variantId` | When `hasVariants` | Stable variant id |
| `sku` | Optional | Denormalized for display/search |
| `selectedOptions` | Yes (variant products) | `[{ groupName, valueLabel }]` snapshot |
| `qty` | Yes | |
| `discountPrice` | Yes | Client hint; **server reprices** |
| `originalPrice` | Optional | |
| `images` | Yes | Variant images or parent fallback |
| `name` | Yes | Parent name + optional variant title |

**Non-variant products:** omit `variantId`; cart shape unchanged.

### 5.2 Frontend cart reducer changes (future)

```javascript
// Dedup
const key = item.variantId ? `${item._id}:${item.variantId}` : item._id;

// Stock check
const available = item.variantId ? item.variantStock : item.stock;
```

### 5.3 Server repricing changes (future)

`OrderPricingService.repriceCartItem`:

1. Load product by `productId`
2. If `hasVariants`:
   - Require `variantId`
   - Find variant in `product.variants`
   - Validate `isAvailable` and `stock >= qty`
   - Price from variant `discountPrice` / `originalPrice`
   - Images from variant or parent fallback
3. Else: current product-level logic (unchanged)

---

## 6. Order Requirements

### 6.1 Order line snapshot (immutable)

Orders must preserve **exactly what was purchased**, even if the product catalog changes later.

**Extended order line fields**

```javascript
{
  // existing
  productId, name, qty, images,
  originalPrice, discountPrice, price, serverPrice,
  lineTotal, shopId, shop, category, brand,

  // new
  variantId: String | null,
  sku: String | null,
  selectedOptions: [{ groupName, valueLabel }] | [],
  variantTitle: String | null,
  hasVariants: Boolean
}
```

**Rules**

- `price` / `serverPrice` / `lineTotal` are **snapshots at checkout time**
- Refunds and reviews reference `productId` + optional `variantId`
- Order history UI shows `selectedOptions` or `variantTitle`

### 6.2 Inventory reservation (future)

`OrderInventoryService` must support variant-level decrement:

```javascript
// Pseudo-logic
if (product.hasVariants) {
  Product.updateOne(
    { _id: productId, "variants.id": variantId, "variants.stock": { $gte: qty } },
    { $inc: { "variants.$.stock": -qty, "variants.$.sold_out": qty } }
  )
} else {
  // existing product-level $inc
}
```

Also update aggregated parent `stock` (sum of variants) **or** stop using parent `stock` when `hasVariants=true` — see §8.

---

## 7. Backward Compatibility

### 7.1 Products without variants (all 14 current products)

**No migration required.** Behavior unchanged:

- Create/list/detail/checkout use top-level `discountPrice`, `stock`, `images`
- Cart dedup by `_id`
- Order lines without `variantId`

### 7.2 Default variant strategy (optional, non-destructive)

When a vendor **first enables variants** on an existing product, auto-seed one variant:

```javascript
{
  id: "default",
  sku: null,
  optionValueIds: [],
  title: "Default",
  discountPrice: product.discountPrice,
  originalPrice: product.originalPrice,
  stock: product.stock,
  isAvailable: true,
  images: product.images
}
```

This is **optional** for Phase 2+. Simpler Phase 1: only new multi-SKU products use variants; legacy products stay flat.

### 7.3 API compatibility

| Endpoint | Compatibility approach |
|----------|------------------------|
| `GET /get-all-products` | Return existing fields; add `hasVariants`, computed min price/stock for variant products |
| `POST /create-product` | Accept optional `optionGroups`, `variants`; default `hasVariants=false` |
| `POST /order/create-order` | Accept cart items with or without `variantId` |
| Search filters (`inStock`, price range) | Operate on computed listing fields |

**Never remove** top-level `discountPrice` / `stock` from API responses during transition.

---

## 8. Vendor Add / Edit Product Changes (future)

### 8.1 Create Product wizard

**Phase 1 — simple package variants (no matrix)**

For products like "Grip + Ring Light" bundles:

- Toggle: "This product has variants"
- Add rows: variant name, SKU, price, compare-at, stock, images
- No option groups yet — each row is a standalone SKU

**Phase 2 — option groups + auto matrix**

- Define option groups and values
- Generate variant matrix (with ability to disable invalid combos)
- Bulk edit price/stock per row

**Files to change (future)**

| File | Change |
|------|--------|
| `CreateProductWizard.jsx` | Variant step, matrix editor |
| `wizardValidation.js` | Validate variant rows / option groups |
| `redux/actions/product.js` | Send `optionGroups`, `variants` |
| New: `EditProductWizard.jsx` or extend wizard | **New edit flow required** |
| `AllProducts.jsx` | Link to edit, show variant count |

### 8.2 Backend create/update

| File | Change |
|------|--------|
| `ProductValidation.js` | Validate variant rows when `hasVariants` |
| `ProductService.js` | Persist variants; compute listing aggregates |
| `controller/product.js` | Add `PUT /update-product/:id`, `GET /product/:id` |

---

## 9. Product Detail Changes (future)

| Component | Change |
|-----------|--------|
| `ProductVariants.jsx` | Lift selection state; support dynamic option groups; disable unavailable combos |
| `ProductDetails.jsx` | Pass selected variant to `addTocart`; price/stock/image react to selection |
| `ProductPurchasePanel.jsx` | Show variant price, stock badge, disabled add-to-cart when invalid |
| `ProductGallery.jsx` | Switch images when variant selected |

**Add to cart payload (variant product)**

```javascript
{
  ...parentProductFields,
  variantId: selectedVariant.id,
  sku: selectedVariant.sku,
  selectedOptions: [...],
  discountPrice: selectedVariant.discountPrice,
  originalPrice: selectedVariant.originalPrice,
  stock: selectedVariant.stock,
  images: selectedVariant.images?.length ? selectedVariant.images : parent.images,
  qty: count
}
```

---

## 10. Database Migration Strategy

### 10.1 Principles

- **Additive only** — new fields with safe defaults
- **No bulk rewrite** of existing 14 products
- **No downtime** required for schema addition (MongoDB flexible schema)

### 10.2 Schema addition (Phase 0 — when approved)

Add to `productSchema` (all optional / defaulted):

```javascript
hasVariants: { type: Boolean, default: false },
optionGroups: { type: Array, default: [] },
variants: { type: Array, default: [] }
```

Existing documents: fields absent → treated as `hasVariants=false`.

### 10.3 Optional backfill script (later, vendor-triggered)

Only when a vendor opts in to variants on an existing listing:

1. Copy current price/stock/images into a `default` variant
2. Set `hasVariants=true`
3. Keep parent-level fields synced for listing compatibility

**Not run automatically on deploy.**

### 10.4 Seller Operations SKU integration (Phase 3+)

Consolidate in-memory seller-operations SKU registry into `ProductVariant.sku` or deprecate parallel system once variant model is live.

---

## 11. API Changes (proposed)

### 11.1 Product endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/v2/product/:id` | **New** — detail with full `variants[]` |
| PUT | `/api/v2/product/update-product/:id` | **New** — update including variants |
| POST | `/api/v2/product/create-product` | Extend body with optional variants |
| GET | `/api/v2/product/get-all-products` | Add computed listing fields |

**Create/update request body (extended)**

```javascript
{
  // existing fields...
  hasVariants: false,
  optionGroups: [],
  variants: []
}
```

### 11.2 Order endpoint

| Method | Route | Change |
|--------|-------|--------|
| POST | `/api/v2/order/create-order` | Accept `variantId`, `selectedOptions` on cart items; validate + snapshot |

### 11.3 Search

| Change | Detail |
|--------|--------|
| Projection | Include `hasVariants`; use computed `discountPrice` / `stock` for filters |
| SKU search | Optional: index `variants.sku` for vendor lookup |

---

## 12. Indexing & Performance

### 12.1 Recommended indexes

```javascript
// Existing (verify present)
{ shopId: 1, createdAt: -1 }
{ category: 1 }
{ discountPrice: 1 }
{ stock: 1 }

// New (when variants ship)
{ shopId: 1, "variants.sku": 1 }           // unique per shop, sparse
{ "variants.id": 1 }                       // sparse
{ hasVariants: 1, stock: 1 }                 // listing in-stock filter
```

### 12.2 Performance notes

| Operation | Approach |
|-----------|----------|
| Product listing | Return parent doc with computed min price / total stock — **do not** expand all variants in list API |
| Product detail | Single document read — embedded variants are fine at YEBONE scale |
| Cart repricing | One `findById` per line item (current pattern) — acceptable |
| SKU lookup | Index `variants.sku` + `shopId` |
| Inventory update | Positional `$` update on matching variant — single atomic operation |

**Do not** precompute variant matrices in Redis or build event-sourced inventory for v1.

---

## 13. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Breaking existing checkout | High | Gate all variant logic on `hasVariants`; integration tests for flat products |
| Cart dedup collisions | Medium | Change key to `productId:variantId` only when variantId present |
| Stale client cart after variant price change | Medium | Server-side repricing already exists — extend for variants |
| Parent vs variant stock drift | Medium | When `hasVariants=true`, treat parent `stock` as computed read-only |
| Incomplete vendor edit flow today | Medium | Ship edit API + wizard alongside variant create |
| Seller-operations SKU duplication | Low | Document deprecation path; don't build two SKU systems long-term |
| UI complexity for option matrix | Medium | Phase 1: row-based variants; Phase 2: full option groups |
| Order history without variant context | Medium | Snapshot `selectedOptions` on every order line |
| No GET product by ID today | Low | Add detail endpoint as part of variant work |

---

## 14. Implementation Phases

### Phase 1 — Foundation (backend + compatibility)

1. Add optional schema fields (`hasVariants`, `optionGroups`, `variants`)
2. Extend `ProductValidation` for variant products
3. Add `GET /product/:id` and `PUT /update-product/:id`
4. Extend `OrderPricingService` + `OrderInventoryService` for variants
5. Extend order line snapshot fields
6. Listing API: computed min price / total stock
7. Tests: flat product checkout unchanged; variant checkout happy path

### Phase 2 — Vendor UX (simple variants)

1. Create Product wizard: "Add variant rows" (name, SKU, price, stock, images)
2. Edit Product wizard (new)
3. Wire `assignVendorSku` concept into variant rows (optional)

### Phase 3 — Customer UX

1. Rewire `ProductVariants.jsx` to dynamic option groups
2. Variant-aware add to cart in `ProductDetails.jsx`
3. Cart reducer dedup + stock by variant
4. Checkout/order display of selected options
5. Product cards: "From RWF X" when `hasVariants`

### Phase 4 — Search, seller ops, polish

1. Search/index SKU and variant price ranges
2. Consolidate seller-operations SKU into product variants
3. Bulk CSV import/export with variant rows
4. Admin tools for variant oversight

---

## 15. Files & Components Affected (summary)

### Backend

| File | Impact |
|------|--------|
| `model/product.js` | Schema extension |
| `marketplace/catalog/ProductValidation.js` | Variant validation |
| `marketplace/services/ProductService.js` | Create/update/read variants |
| `marketplace/catalog/ProductCatalog.js` | Detail + listing aggregates |
| `marketplace/catalog/ProductInventory.js` | Variant stock helpers |
| `marketplace/integration/pricing/OrderPricingService.js` | Variant repricing |
| `marketplace/orders/OrderInventoryService.js` | Variant reservation |
| `marketplace/services/OrderService.js` | Line snapshot fields |
| `marketplace/services/SearchService.js` | Listing projection |
| `controller/product.js` | New routes |
| `marketplace/seller-operations/*` | Future consolidation |

### Frontend

| File | Impact |
|------|--------|
| `components/seller-experience/CreateProductWizard.jsx` | Variant creation |
| `components/seller-experience/wizardValidation.js` | Validation |
| `components/Shop/AllProducts.jsx` | Edit entry, variant indicator |
| New edit wizard component | Product + variant updates |
| `components/Products/ProductVariants.jsx` | Functional option selection |
| `components/Products/ProductDetails.jsx` | Variant-aware cart |
| `components/Products/ProductPurchasePanel.jsx` | Dynamic price/stock |
| `components/Marketplace/ProductCard.jsx` | "From" pricing |
| `redux/reducers/cart.js` | Dedup key, variant fields |
| `redux/actions/cart.js` | Payload shape |
| `components/Checkout/CheckoutCartItem.jsx` | Display selected options |
| `components/Payment/Payment.jsx` | Send variant fields |
| `components/Orders/OrderItemsList.jsx` | Show variant snapshot |

---

## 16. Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Variant storage | Embedded in Product | YEBONE scale, simpler reads, atomic updates |
| Legacy products | No forced migration | 14 flat products continue unchanged |
| Listing price | Computed min variant price on parent | Avoid breaking cards/search |
| Phase 1 variant UX | Row-based SKUs | Faster to ship than full option matrix |
| Cart key | `productId:variantId` when present | Prevents merging different SKUs |
| Order lines | Snapshot options + price | Immutable purchase record |
| Separate ProductVariant collection | Deferred | Not needed at current scale |

---

## 17. Open Questions (for review)

1. **Max option groups** — cap at 3 for UI sanity?
2. **SKU uniqueness** — per shop or global marketplace?
3. **Variant images** — required per variant or always fallback to parent?
4. **Reviews** — per parent product or per variant?
5. **Flash sale / bid / negotiated offer** — variant-aware in v1 or v2?
6. **When `hasVariants=true`** — should parent `stock` be read-only computed field?

---

*End of architecture proposal. No code, migrations, or API changes have been made.*
