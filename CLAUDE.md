# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint across all files
npm run preview    # Preview production build locally
```

No test framework is configured yet. Purely client-side app with no backend or environment variables.

## Architecture

ESL classroom games SPA built with React 19 + TypeScript + Vite. Teachers select a game, pick a month/week (curriculum unit), then play the game with students using vocabulary words and images.

### Routing

Hash-based routing (`createHashRouter`) in `App.tsx`:
- `/` — Game selection grid (Home)
- `/game/:gameId/month` — Month picker
- `/game/:gameId/week/:m` — Week picker (`:m` = month name)
- `/game/:gameId/play/:uid` — Game play area (wrapped in GameShell)
- `/settings` — Vocabulary/category management (tabbed: Vocabulary Manager, Category Lists, Data Management)

`RootLayout` wraps all routes with `TopBar` + `Outlet` and calls `useVocabStore().loadAll()` on mount.

### Source Organization

- `src/games/<game-id>/` — Each of the 10 games has its own directory. **All are currently placeholder components** awaiting implementation.
- `src/components/` — Shared: `TopBar`, `GameCard`, `GameShell`
- `src/components/ui/` — UI primitives with barrel export from `index.ts`: `Button`, `Card`, `Badge`, `Modal`, `TabBar`, `ImageUpload`, `InlineEdit`, `ConfirmDialog`
- `src/pages/` — Route-level page components
- `src/pages/settings/` — Settings sub-components (`VocabSidebar`, `VocabUnitPanel`, `WordRow`, `AddWordForm`, `CategoryListDetail`, `DataManagement`)
- `src/stores/` — Zustand stores
- `src/types/index.ts` — Core interfaces: `Word`, `Unit`, `CategoryItem`, `CategoryList`, `GameDef`, `ExportData`
- `src/constants/games.ts` — `GAMES` array (10 game definitions)
- `src/constants/months.ts` — 12 months (September–August) with display colors
- `src/db/index.ts` — IndexedDB persistence layer (`idb` library)
- `src/utils/compressImage.ts` — Image compression (max 512px, JPEG 80%)

### Data Model & Flow

Curriculum: **12 months → 5 weeks per month → Units containing Words**. Each `Word` has `id`, `text`, and `image` (data URL). `Unit` also has `oddOneOutLists[]` (IDs linking to `CategoryList`s). Games reference a Unit via route param `uid`.

**Data flow to games:**
1. `GameShell` extracts `uid` from route params, calls `useVocabStore().getUnit(uid)` to load the unit
2. `GameShell` renders game content via `<Outlet />` — the `GamePage` component currently shows a placeholder
3. When implementing a game, access unit data via `useVocabStore` hooks or receive it through the routing context

**Persistence:** IndexedDB database `esl-games-db` with two object stores: `units` (indexed by month, week, month-week) and `categoryLists`. All mutations go through `useVocabStore` → `db` module → update local state.

### Stores

- **useVocabStore** (`src/stores/useVocabStore.ts`) — Primary store. Manages units, words, category lists with CRUD operations, plus `exportData`/`importData`/`resetData` for data management.
- **useSettingsStore** (`src/stores/useSettingsStore.ts`) — `isMuted` toggle for sound.

### Styling

Tailwind CSS 4 with custom theme variables in `src/index.css` (colors, fonts, shadows, radii). Game-specific colors come from `GameDef.color` applied via inline styles. Fonts: "Fredoka One" (headings), "Nunito" (body).

### State & Animation

- **Zustand** for global state
- **Framer Motion** for animations (used in GameCard, Button, MonthSelect, WeekSelect)
- **Howler** for sound effects (installed, not yet integrated)
- **canvas-confetti** for celebrations (installed, not yet integrated)

### TypeScript

Strict mode with `noUnusedLocals` and `noUnusedParameters`. Target ES2023.
