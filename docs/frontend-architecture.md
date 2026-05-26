# RJT Nexus360 Frontend Architecture

This workspace consolidates the Stitch exports into a React, TypeScript, Vite, and Tailwind frontend foundation.

## Source Masters

- `rjt_nexus360_authentication`: authentication master, exposed at `/auth`.
- `Budget Intelligence`: official budget and forecast module, exposed at `/budget`.
- `Data Import Center`: official Excel and CSV intake module, exposed at `/data-import`.
- `executive_dashboard`: executive dashboard master, exposed at `/dashboard` with `/executive` kept as a temporary compatibility alias.
- `Commercial Intelligence`: official commercial analytics module, exposed at `/commercial`.
- `financial_intelligence`: financial module, exposed at `/financial`.
- `HR Analytics`: official people analytics module, exposed at `/hr`.
- `Inventory Intelligence`: official stock analytics module, exposed at `/inventory`.
- `Operations Analytics`: official operational intelligence module, exposed at `/operations`.
- `Purchasing Intelligence`: official purchasing analytics module, exposed at `/purchasing`.

## Structure

- `src/app`: application composition and route registration.
- `src/shared/layout`: reusable enterprise shell pieces, including top bar, sidebar, and mobile command bar.
- `src/shared/ui`: reusable presentational primitives such as glass cards, icons, progress bars, and page headers.
- `src/shared/config`: navigation and other cross-feature configuration.
- `src/shared/data`: cross-feature frontend registries, including the central import schema registry consumed by Data Import Center.
- `src/features/auth`: authentication screen module.
- `src/features/budget-intelligence`: budget control and forecast analytics screen module.
- `src/features/commercial-intelligence`: commercial analytics and sales intelligence screen module.
- `src/features/commercial-intelligence/data`: local customer, product, revenue and pipeline model prepared for future commercial workbook integration.
- `src/features/data-import-center`: Excel/CSV intake, mapping and validation screen module.
- `src/features/executive-dashboard`: executive dashboard screen module.
- `src/features/financial-intelligence`: financial intelligence screen module.
- `src/features/financial-intelligence/data`: local DRE and cost model with import schema, source-shaped records, and derived executive metrics.
- `src/features/hr-analytics`: HR analytics and workforce intelligence screen module.
- `src/features/hr-analytics/data`: local HR domain schema, sample workbook records, and derived metrics for UI validation before backend/data pipeline integration.
- `src/features/inventory-intelligence`: stock analytics and working-capital inventory screen module.
- `src/features/inventory-intelligence/data`: local inventory, ABC, stock movement and working-capital model prepared for future stock workbook integration.
- `src/features/operations-analytics`: operations intelligence and production analytics screen module.
- `src/features/operations-analytics/data`: local production, downtime, OEE and line-performance model prepared for future operations workbook integration.
- `src/features/purchasing-intelligence`: purchasing analytics and supplier intelligence screen module.
- `src/features/purchasing-intelligence/data`: local purchasing schema prepared for the future `Compras 2026.xlsx` workbook, with pending-safe metrics until real procurement data is supplied.
- `src/styles`: global Tailwind entrypoint and exported Stitch visual utilities.

## Boundaries

The implementation intentionally does not add a backend, persistence layer, real auth, or synthetic product features. Current interactions are limited to UI state required to preserve the exported screen behavior.

Module data should be isolated inside each feature before it reaches shared state or external services. Financial Intelligence follows this pattern with a local schema for `Custo - DRE 2026.csv`, and HR Analytics follows it with schemas for `Indicadores RH 2026.xlsm`, `CONTROLE DE ATESTADOS -2026.xlsx`, and `TURNOVER 2026.xlsx`, plus derived UI metrics used by the current dashboards.

Data Import Center consumes `src/shared/data/importRegistry.ts` as the central frontend contract for module import readiness. The registry aggregates the feature-owned schemas without adding backend processing, database persistence, or real file upload logic.

Frontend normalization lives in `src/shared/data/normalization`. These pure functions receive extracted spreadsheet rows and return typed module records plus validation issues. They do not read files, persist data, call APIs, or perform backend authentication.

Future modules should be added under `src/features/<module-name>` and consume layout and visual primitives from `src/shared`.

## Temporary Development Auth Mode

Authentication is currently bypassed for UI/UX development and visual validation. The root route redirects directly to `/dashboard`, all module routes are public, and `/auth` submits directly to `/dashboard` without validation, session checks, middleware guards, or backend authentication. Do not treat this as production authentication.
