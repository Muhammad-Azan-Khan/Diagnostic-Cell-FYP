# Diagnostic Cell

A Nuxt 4 and TypeScript application for tractor electrical diagnostics. It provides guided circuit scans, simulated ESP32 telemetry, tractor profiles, diagnostic history, printable reports, and configurable tolerances.

## Requirements

- Node.js 22 or later
- npm 10 or later

## Development

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000`.

## Validation and production

```bash
npm run typecheck
npm run build
npm run preview
```

## Project structure

- `pages/` — Nuxt file-based application routes
- `layouts/` — shared application shell
- `components/` — Vue diagnostic and layout components
- `composables/useDiagnostic.ts` — shared state and local persistence
- `app/types/` — framework-independent domain contracts
- `app/data/` — circuit specifications and demonstration records
- `app/utils/` — sensor simulation and diagnostic evaluation engine

## NestJS backend integration

The domain types and diagnostic utilities are intentionally separated from the UI. When the NestJS backend is introduced, replace the persistence operations in `useDiagnostic` with typed API calls and move shared contracts into a package consumed by both applications. The intended service boundaries are tractors, diagnostic sessions, reports, settings, and live hardware telemetry.
