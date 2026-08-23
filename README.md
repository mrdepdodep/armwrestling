# Arm Helper

Calculators and info reference for Arm Wrestling Simulator, rewritten from a
static HTML site to **Next.js** (App Router, JavaScript).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # run the production build
```

## Features

- **Dark / light theme** — toggled from the sidebar, persisted in `localStorage`,
  applied before first paint (no flash). Driven by `[data-theme]` on `<html>`.
- **i18n (en / uk / ru)** — switched from the sidebar, persisted in `localStorage`.
- **Per-module URLs** — each calculator/info page has its own route.

## Project structure

```
src/
├── app/                        # Routes (App Router) — one folder per page
│   ├── layout.js               # Root layout: providers + app shell
│   ├── page.js                 # / → redirects to /pet-calculator
│   ├── globals.css             # Theme tokens + shared UI primitives
│   ├── <slug>/page.js          # Thin route file per module
│   └── ...
├── components/
│   ├── layout/                 # AppShell, Sidebar, ThemeToggle, LangSwitcher
│   ├── calculators/            # Pet / Arm / Grind / Roulette / Boss calculators
│   ├── info/                   # Boosts, Shiny, Secret, Codes, Aura, Trainer, Charms, Worlds
│   ├── system/                 # Help, Credits
│   └── ui/                     # Small shared building blocks (PageTitle, ...)
├── lib/
│   ├── nav.js                  # Single source of truth for menu + routes
│   ├── theme/ThemeContext.js   # Theme provider/hook
│   └── i18n/LanguageContext.js # Language provider/hook + `useT` helper
└── data/                       # JSON data (codes, secret, aura, charms, worlds, trainers, ...)
```

Adding a page: add an entry in `src/lib/nav.js`, create the component under
`src/components/...`, and add `src/app/<slug>/page.js`.

## Legacy

The original static site is kept under `_legacy/` for reference. It is not part
of the build and can be deleted once the migration is confirmed.
