# YEBO Memory Engine — Phase 7D

**Public assistant:** YEBO  
**Internal platform:** YIP Memory Engine  
**Status:** Architecture + presentation only (mock session data)

The YEBO Memory Engine allows YEBO to remember shopping context, preferences, and user journeys across the marketplace — without backend persistence or external AI providers.

---

## Folder Structure

```
src/ai/memory/
├── MemoryStorage.js          # In-memory / optional sessionStorage adapter
├── MemoryEvents.js           # Memory pub/sub events
├── MemoryHelpers.js          # Shared utilities
├── SessionMemory.js          # Visited products, categories, vendors, goals
├── PreferenceMemory.js       # Categories, brands, budget, locale
├── ConversationMemory.js     # Turns, intents, recommendations
├── SearchMemory.js           # Recent searches & contexts
├── ProductMemory.js          # Views, comparisons
├── CartMemory.js             # Cart context mirror
├── WishlistMemory.js         # Wishlist context mirror
├── RecentlyViewedMemory.js   # View trail
├── RecommendationMemory.js   # YEBO recommendation history
├── ShoppingMemory.js         # Active scope, reminders, cross-page messages
├── YEBOMemoryEngine.js       # Composes all modules + mock seeding
├── YEBOShoppingContext.js    # Shared shopping context per surface
├── YEBOMemoryContext.js      # React context + hooks
├── YEBOMemoryProvider.jsx    # Standalone provider (optional)
├── YIPMemory.js              # Legacy facade (backward compatible)
├── yebMemoryMockData.js      # Mock session seed data
└── index.js

src/components/ai/memory/
├── YEBOWelcomeBack.jsx
├── YEBOContinueShopping.jsx
├── YEBOSmartReminders.jsx
├── YEBOCrossPageContinuity.jsx
├── YEBOMemoryTimeline.jsx
├── YEBOMemoryJourney.jsx
├── YEBOPreferenceCards.jsx
├── YEBOShoppingHistory.jsx
├── YEBOMemoryCards.jsx
├── YEBOCustomerMemoryDashboard.jsx
├── YEBOVendorMemoryDashboard.jsx
├── YEBOAdminMemoryDashboard.jsx
└── index.js
```

---

## Architecture

```
YIPProvider
  └── YEBOMemoryContext (single YEBOMemoryEngine instance)
        ├── SessionMemory
        ├── PreferenceMemory
        ├── ConversationMemory
        ├── SearchMemory
        ├── ProductMemory
        ├── CartMemory / WishlistMemory
        ├── RecentlyViewedMemory
        ├── RecommendationMemory
        └── ShoppingMemory
              └── YEBOShoppingContext (scope activation)
```

### Hooks

```jsx
import { useYEBOMemory, useYEBOMemoryOptional } from 'src/ai';
import { useAI } from 'src/components/ai';

// Memory-specific
const { getSnapshot, getWelcomeMessage, setActiveScope } = useYEBOMemory();

// Also on useAI / useYIP
const { memory, memoryEngine, getMemorySnapshot, getWelcomeMessage } = useAI();
```

### Activate shopping context

```jsx
import { SHOPPING_SCOPES } from 'src/ai';

yeboMemory.setActiveScope(SHOPPING_SCOPES.PRODUCT, { productId: '123' });
// or
shoppingContext.forProduct({ productId: '123', category: 'Fashion' });
```

Supported scopes: homepage, search, product, cart, checkout, wishlist, orders, customer-dashboard, vendor-dashboard, admin-dashboard, mobile.

---

## Session Memory

Mock session includes:

- Visited products
- Viewed categories
- Recent searches
- Products compared
- Recently opened vendors
- Current shopping goal
- Conversation state

Seeded on `YIPProvider` mount via `memoryEngine.seedMockSession()`.

---

## Preference System

Architecture supports:

- Favorite categories, brands, colors, sizes
- Budget range (min/max/currency)
- Shopping interests
- Language, country, currency

Access: `getSnapshot().preferences` or `memoryEngine.preferences.getAll()`.

---

## Cross-Page Continuity

UI components surface session-aware messages:

- "Welcome back."
- "You recently viewed..."
- "You compared these..."
- "Continue shopping..."
- "You may also like..."

Components: `YEBOWelcomeBack`, `YEBOCrossPageContinuity`, `YEBOContinueShopping`.

---

## Dashboard Memory

| Surface | Component |
|---------|-----------|
| Customer | `YEBOCustomerMemoryDashboard` |
| Vendor | `YEBOVendorMemoryDashboard` |
| Admin | `YEBOAdminMemoryDashboard` |

Includes timeline, journey, preferences, smart reminders, platform trends.

---

## Events

```js
import { MemoryEvents, MEMORY_EVENT } from 'src/ai';

MemoryEvents.on(MEMORY_EVENT.PRODUCT_VIEW, (product) => { ... });
```

Events: `session_update`, `preference_update`, `product_view`, `search`, `compare`, `cart_sync`, `wishlist_sync`, `conversation`, `context_change`, `reminder`, `clear`.

---

## Future Integration Points

1. **Backend persistence** — Replace `MemoryStorage` with API sync; UI unchanged.
2. **Real product views** — Call `memoryEngine.addVisitedProduct(product)` from product pages (no Redux).
3. **Cart/wishlist sync** — Call `memoryEngine.syncCart(items)` / `syncWishlist(items)` from read-only selectors.
4. **AI providers** — Pass `getSnapshot()` to adapter context; no UI redesign.
5. **sessionStorage** — Enable via `createYEBOMemoryEngine({ persistSession: true })`.

**No Redux, routes, backend, or business logic changes required.**
