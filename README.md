# Executive Dashboard (Angular)

This codebase was fully migrated from the original React/Vite implementation to Angular 18 with standalone components, Tailwind CSS styling, and a headless service layer that mirrors the previous widget/data plumbing.

## Tech stack

- Angular 18 standalone application bootstrapped with Angular CLI
- Tailwind CSS for styling + the existing design tokens/variables brought forward from the React app
- Lucide icons via `lucide-angular`
- Feature-first folder layout: `features/*` for routed pages, `layout/*` for shared chrome, `core/*` for services + models, and `data/*` for mock payloads

## Getting started

```bash
npm install
npm run start     # serves http://localhost:4200 with live reload
npm run build     # production build -> dist/
```

The app automatically falls back to the mock data that shipped with the React version when `environment.apiBaseUrl` is not reachable. Update `src/environments/environment*.ts` with the correct API base URL and default tenant to connect to a live backend.

## Project structure

```
src/
  app/
    core/        # models, shared services, utilities
    data/        # mock periods/alerts/widgets/tenant directory
    features/    # overview, alerts, compare, reports, sections, ops
    layout/      # app bar, sidebar, AI drawer
    shared/      # icons, sparklines, UI helpers
```

The Overview route recreates the previous dashboard experience (tenant/entity filters, AR/AP widgets, sections grid, AI drawer trigger, search palette) using Angular signals and services. Other views (alerts, compare, reports, ops/admin, section details) map to the React page components with equivalent content and behaviour.

## Styling

Tailwind is configured via `tailwind.config.js` and `src/styles.scss` retains the CSS variables + theming rules from the React build, so existing utility classes continue to work. Use standard Tailwind utilities inside Angular templates; no additional component libraries are required.

## Testing

Karma/Jasmine scaffolding from the CLI remains available via `npm test`. The current migration focused on feature parity; add unit tests around services or components as needed before shipping to production.
