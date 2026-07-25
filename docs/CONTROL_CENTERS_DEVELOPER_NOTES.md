# Control Centers — Developer Notes

## Frontend

- Shared shell: `src/components/AdminControlCenters/shell/ControlCenterShell.jsx`
- Styles: `src/components/AdminControlCenters/adminControlCenters.css`
- Service: `src/services/platformConfigurationService.js`
- Routes: `/admin/commission`, `/admin/referrals`, `/admin/ai`, `/admin/delivery`, `/admin/growth`, `/admin/commission-rules`, `/admin/coupons`, `/admin/banners`, `/admin/platform-configuration`

## Backend

- Defaults: `marketplace/integration/PlatformConfigurationDefaults.js`
- Store: `marketplace/integration/PlatformConfigurationStore.js`
- Bridge: `marketplace/integration/PlatformConfigurationBridge.js`
- Referral admin: `marketplace/growth/GrowthReferralAdminService.js`

## Adding New Business Settings

1. Add default in `PlatformConfigurationDefaults.js`
2. Expose via `GET /integration/platform-configuration`
3. Add UI section in Platform Configuration or dedicated center
4. If order-affecting, sync to commission rules or domain bridge — do not hardcode in controllers

## Category Commission Sync

Saving `categoryCommissions` triggers `syncCategoryCommissionRules()` which upserts `CATEGORY` strategy rules with `scope.categoryId`.

## Reading Config in Features

```js
const { getPlatformConfigurationBridge } = require("./marketplace/integration/PlatformConfigurationBridge");
const bridge = getPlatformConfigurationBridge();
await bridge.initialize();
const aiProducts = bridge.getPublicAiProducts();
const banners = bridge.getPublicBanners("homepage_hero");
```

## Do Not

- Duplicate business logic in admin-ui mock stack (`src/admin-ui/`)
- Modify frozen payment/order/AI runtime modules
- Start Phase 15 from this milestone
