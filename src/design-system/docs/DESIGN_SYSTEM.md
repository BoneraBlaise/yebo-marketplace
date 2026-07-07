# YEBO Enterprise Design System — Phase 8G

## Overview

The Enterprise Design System is the single UI foundation for Customer Portal, Vendor Portal, Admin Portal, AI Dashboard, Mobile, Desktop, and future applications.

## Theme Usage

```jsx
import { DesignSystemProvider, useEnterpriseTheme, THEME_MODE } from "../design-system";

<DesignSystemProvider themeMode={THEME_MODE.SYSTEM}>
  <App />
</DesignSystemProvider>
```

Supported modes: `light`, `dark`, `system`. Runtime switching via `useEnterpriseTheme().setMode()`.

## Brand Usage

```jsx
import { useBrand } from "../design-system";

const { brand, setBrand } = useBrand();
setBrand({ primaryColor: "#29625d", logo: "/logo.png" });
```

Organization branding automatically updates CSS variables (`--yebone-primary`, `--yebone-accent`, etc.).

## Design Tokens

Import from `design-system/tokens`: colors, typography, spacing, radius, elevation, borders, opacity, animation, breakpoints, z-index, icon sizes, component sizes.

Use via Tailwind (`yebone-*`) or CSS variables (`var(--yebone-primary)`).

## Layouts

- `CustomerLayout`, `VendorLayout`, `AdminLayout`
- `AuthLayout`, `SettingsLayout`, `DashboardLayout`, `ResponsiveLayout`

## Components

Enterprise components, AI components, charts, notifications, forms, and data presentation modules are exported from `design-system/index.js`.

## Accessibility

- ARIA props via `a11yProps`
- Focus rings via `focusRingClass`
- Focus trap for modals
- Reduced motion support
- Contrast ratio utility

## Responsive

Use `useBreakpoint()` for mobile, tablet, laptop, desktop, wide breakpoints.

## Diagnostics

Development-only logging via `logDesignSystemDiagnostics` — never logs secrets.
