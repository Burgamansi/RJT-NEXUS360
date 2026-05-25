# RJT NEXUS360 Auth Architecture

Status: preparation only. No real provider, no login integration, no route blocking yet.

## Goals

- Support multi-tenant SaaS operation by company/tenant.
- Separate user identity from tenant membership.
- Prepare role-based and permission-based access.
- Enforce plan limits, mainly max users per tenant.
- Keep audit trail ready for login/session/user actions.
- Allow future provider swap without rewriting app rules.

## Core Model

### Tenant

Represents customer company/workspace.

Fields:
- `id`
- `name`
- `legalName`
- `documentNumber`
- `slug`
- `status`: `active`, `inactive`, `suspended`, `trial`
- `plan`
- `createdAt`
- `updatedAt`

### User

Represents global person identity.

Fields:
- `id`
- `name`
- `email`
- `avatarUrl`
- `externalProviderId`
- `emailVerifiedAt`
- `createdAt`
- `updatedAt`

### Membership

Joins one user to one tenant. Role lives here, not directly on user.

Fields:
- `id`
- `tenantId`
- `userId`
- `role`
- `permissions`
- `status`: `active`, `invited`, `disabled`, `removed`
- `invitedByUserId`
- `joinedAt`
- `createdAt`
- `updatedAt`

### Permission

Action over resource, represented as `resource:action`.

Examples:
- `users:manage`
- `reports:read`
- `analytics:read`
- `audit:read`
- `billing:manage`

### AuditSession

Session audit envelope, independent from provider session.

Fields:
- `id`
- `tenantId`
- `userId`
- `membershipId`
- `provider`
- `ipAddress`
- `userAgent`
- `status`: `active`, `expired`, `revoked`
- `startedAt`
- `endedAt`
- `lastSeenAt`

## Initial Roles

- `super_admin`: RJT/platform owner. Can manage all tenants.
- `tenant_admin`: customer admin. Can manage one tenant.
- `gestor`: manager. Can manage reports/files and read audit.
- `operador`: operational user. Can create/update own work areas.
- `visualizador`: read-only user.

## Plan Strategy

Plans define limits and features.

Initial plans:
- `starter`: max 5 users
- `professional`: max 25 users
- `enterprise`: max 250 users

User creation/invite must check active memberships against `tenant.plan.maxUsers`.

## Multi-Tenant Strategy

Use shared app + shared database, scoped by `tenantId`.

Rules:
- All tenant-owned tables get `tenant_id`.
- Every request resolves tenant before protected business logic.
- User identity alone is not enough; request must have valid `Membership`.
- Cross-tenant access requires `super_admin`.
- API filters must always include tenant scope.
- Audit events must include `tenantId`, `userId`, `membershipId`, action, resource, target id, metadata, IP, user agent.

Tenant resolution order planned:
1. Provider/session claim.
2. `x-tenant-id` header.
3. Route param or query/body fallback for legacy endpoints.

## Middleware Placeholders

Created in `src/config/auth.ts`:
- `requireAuth`
- `requireTenant`
- `requireRole`
- `requirePermission`

Current behavior: pass-through only. This prevents breaking existing flows while code prepares contracts.

Future behavior:
- `requireAuth`: validate provider session/token and attach `req.auth.user`.
- `requireTenant`: resolve tenant and membership, attach `req.auth.tenant`.
- `requireRole`: enforce allowed role list.
- `requirePermission`: enforce permission key.

## Provider-Agnostic Boundary

Keep provider details outside business code.

Future adapter should map provider session to:
- `User`
- `Tenant`
- `Membership`
- `AuditSession`

Supported later without model rewrite:
- Clerk
- Firebase Auth
- Supabase Auth
- custom JWT/session auth

## Migration Path

1. Keep current local auth working.
2. Add tenant-aware schema migrations.
3. Backfill current company/user data into Tenant/User/Membership.
4. Add provider adapter behind `requireAuth`.
5. Turn middleware from pass-through to enforcing mode route by route.
6. Add audit events for auth/session lifecycle.
7. Add UI for tenant admin user management.

## Main Risks

- Legacy `companyId` may drift from future `tenantId`.
- Current user role names differ from planned roles.
- Some routes may trust body/query `companyId`.
- Shared database requires strict tenant filters.
- Provider integration can duplicate users if email/external IDs are not normalized.
- Plan limit enforcement must be transactional to avoid invite race conditions.
