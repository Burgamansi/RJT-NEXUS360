# RJT NEXUS360 Module Permission Architecture

Status: architecture only. No real login, no provider, no production blocking.

## Goal

Prepare module-level access control for tenant-aware RJT NEXUS360.

This layer answers:
- Which modules appear in sidebar.
- Which actions user can perform inside a module.
- Which routes should be protected later.
- Which dashboard widgets should render later.

## Modules

- `dashboard`
- `financeiro`
- `rh`
- `qualidade`
- `operacoes`
- `compras`
- `comercial`
- `auditoria`
- `uploads`
- `admin`

## Actions

- `view`
- `create`
- `edit`
- `delete`
- `approve`
- `export`
- `manage_users`

## Permission Matrix

### super_admin

Full access to every module and action.

### tenant_admin

Full access inside own tenant.

### gerente

- `dashboard`: `view`
- `financeiro`: `view`, `export`
- `rh`: `view`
- `operacoes`: `view`
- `qualidade`: `view`

### gestor

Alias prepared for existing auth naming. Same permissions as `gerente`.

### rh

- `rh`: `view`, `create`, `edit`, `delete`, `approve`, `export`
- `dashboard`: `view`, `export`

### compras

- `compras`: `view`, `create`, `edit`, `delete`, `approve`, `export`
- `dashboard`: `view`, `export`

### qualidade

- `qualidade`: `view`, `create`, `edit`, `delete`, `approve`, `export`
- `auditoria`: `view`, `export`
- `uploads`: `view`, `create`, `edit`, `delete`

### financeiro

- `financeiro`: `view`, `create`, `edit`, `delete`, `approve`, `export`

### visualizador

View-only access to all modules.

## Helpers

Created in `src/config/modulePermissions.ts`:

- `canAccessModule(role, module)`
- `canPerformAction(role, module, action)`
- `getAllowedModules(role)`
- `getAllowedActions(role, module)`

Current use: none enforced.

Future use:
- Sidebar filters modules by `canAccessModule(role, module)`.
- Buttons/actions render by `canPerformAction(role, module, action)`.
- Route guards check module + action before rendering pages.
- API middleware checks same permission server-side.
- Dashboard widgets map to module/action requirements.

## Sidebar Strategy

`src/config/modules.ts` owns module metadata:
- id
- label
- description
- order
- sidebar flag
- route base

Future sidebar flow:
1. Load current `AuthContext`.
2. Read active `Membership.role`.
3. Filter `sidebarModules` with `canAccessModule(role, module.id)`.
4. Sort by module `order`.
5. Render only allowed menu entries.

This keeps menu structure separate from auth provider and page components.

## Route Protection Strategy

Future middleware:
- `requireAuth`: validates session.
- `requireTenant`: resolves tenant and membership.
- `requireRole`: validates broad role.
- `requireModulePermission(module, action)`: validates module matrix.

Frontend route guard:
- Uses same matrix for UX hiding.
- Server remains source of truth.

Backend route guard:
- Must enforce `tenantId`.
- Must enforce module/action.
- Must record audit events for denied access.

## Dashboard And Widget Strategy

Each widget should declare:
- required module
- required action, usually `view`
- optional feature flag or plan gate

Dashboard renders only allowed widgets. Hidden widgets are not fetched from API.

## Risks

- Existing auth roles use `gestor`; requested module matrix uses `gerente`.
- Frontend hiding is not security; backend must enforce later.
- `companyId` legacy must remain until migration to tenant scope is complete.
- View-only users may still reach API if server guard is not added later.
- Full area permissions include `delete`; business rules may need narrower delete rights.
- `manage_users` only makes sense for admin/user modules, but remains global action for future use.

## Next Steps

1. Map current user roles to module roles.
2. Add `requireModulePermission` placeholder after auth middleware is active.
3. Add sidebar filtering without changing route behavior.
4. Tag routes/pages with module/action requirements.
5. Add backend enforcement endpoint by endpoint.
6. Add audit event for denied module access.
