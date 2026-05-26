# RJT Nexus360 Frontend Architecture

This workspace consolidates the Stitch exports into a React, TypeScript, Vite, and Tailwind frontend foundation.

## Source Masters

- `rjt_nexus360_authentication`: authentication master, exposed at `/auth`.
- `executive_dashboard`: executive dashboard master, exposed at `/dashboard` with `/executive` kept as a temporary compatibility alias.
- `financial_intelligence`: financial module, exposed at `/financial`.
- `HR Analytics`: official people analytics module, exposed at `/hr`.
- `Operations Analytics`: official operational intelligence module, exposed at `/operations`.
- `Purchasing Intelligence`: official purchasing analytics module, exposed at `/purchasing`.

## Structure

- `src/app`: application composition and route registration.
- `src/shared/layout`: reusable enterprise shell pieces, including top bar, sidebar, and mobile command bar.
- `src/shared/ui`: reusable presentational primitives such as glass cards, icons, progress bars, and page headers.
- `src/shared/config`: navigation and other cross-feature configuration.
- `src/features/auth`: authentication screen module.
- `src/features/executive-dashboard`: executive dashboard screen module.
- `src/features/financial-intelligence`: financial intelligence screen module.
- `src/features/hr-analytics`: HR analytics and workforce intelligence screen module.
- `src/features/operations-analytics`: operations intelligence and production analytics screen module.
- `src/features/purchasing-intelligence`: purchasing analytics and supplier intelligence screen module.
- `src/styles`: global Tailwind entrypoint and exported Stitch visual utilities.

## Boundaries

The implementation intentionally does not add a backend, persistence layer, real auth, or synthetic product features. Current interactions are limited to UI state required to preserve the exported screen behavior.

Future modules should be added under `src/features/<module-name>` and consume layout and visual primitives from `src/shared`.

## Temporary Development Auth Mode

Authentication is currently bypassed for UI/UX development and visual validation. The root route redirects directly to `/dashboard`, all module routes are public, and `/auth` submits directly to `/dashboard` without validation, session checks, middleware guards, or backend authentication. Do not treat this as production authentication.
