# Yebone

**Yebone. Everything in one place.**

Yebone is a full-feature e-commerce platform built with React. This repository contains the customer-facing web application, seller dashboard flows, and admin tooling.

## Brand

- **Name:** Yebone
- **Slogan:** Yebone. Everything in one place.
- **Primary green:** `#29625d`
- **Dark green:** `#1a4c47`
- **Gold accent:** `#fed592`

## Design system

Reusable tokens and components live under:

- `src/design-system/` — colors, typography, spacing tokens
- `src/components/ui/` — Button, Card, Badge, Input, SearchBar, ProductCardShell, CategoryCard, SectionTitle, Container
- `src/components/ai/` — placeholder components for future AI features (no functionality yet)

Tailwind classes use the `yebone-*` prefix (e.g. `bg-yebone-primary`, `text-yebone-gold`).

CSS variables are defined in `src/App.css` as `--yebone-*`.

## Getting started

```bash
npm install
npm start
```

Runs the app at [http://localhost:3000](http://localhost:3000).

```bash
npm run build
```

Creates a production build in the `build` folder.

## Project structure

- `src/components/` — UI and feature components
- `src/pages/` — route-level pages
- `src/routes/` — route definitions and protected routes
- `src/redux/` — state management
- `src/hooks/` — shared hooks (`useProductSearch`, `useSiteSearch`)
- `src/lib/` — pure helpers (search query builders)
- `public/locales/` — i18n translations (en, fr, rw)

**Architecture:** See [docs/FRONTEND_ARCHITECTURE.md](docs/FRONTEND_ARCHITECTURE.md) — the canonical frontend standard (frozen at `search-production-v1`).

## Notes

- The logo image is kept temporarily; text branding displays **Yebone** beside the logo.
- Backend API and socket URLs are unchanged to preserve existing integrations.
- AI components are placeholders only and are not wired into pages yet.

## License

Private — all rights reserved.
