// ─── SINGLE SOURCE OF TRUTH: App Roles ──────────────────────────────────────
// Roles unificadas — substitui AUTH_ROLES e MODULE_ACCESS_ROLES anteriores.
// Mapeamento: gestor → gerente | operador → operacoes | +comercial
// ─────────────────────────────────────────────────────────────────────────────

export const APP_ROLES = [
  "super_admin",
  "tenant_admin",
  "gerente",
  "rh",
  "compras",
  "qualidade",
  "financeiro",
  "operacoes",
  "comercial",
  "visualizador",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

/** @deprecated Use AppRole */
export type AuthRole = AppRole;
/** @deprecated Use APP_ROLES */
export const AUTH_ROLES = APP_ROLES;

// ─── Resources & Actions ─────────────────────────────────────────────────────

export const AUTH_RESOURCES = [
  "tenant",
  "users",
  "memberships",
  "reports",
  "analytics",
  "files",
  "settings",
  "audit",
  "billing",
] as const;

export type AuthResource = (typeof AUTH_RESOURCES)[number];

export const AUTH_ACTIONS = [
  "create",
  "read",
  "update",
  "delete",
  "manage",
  "export",
] as const;

export type AuthAction = (typeof AUTH_ACTIONS)[number];

export type PermissionKey = `${AuthResource}:${AuthAction}`;

export interface Permission {
  key: PermissionKey;
  resource: AuthResource;
  action: AuthAction;
  description: string;
}

// ─── Permission Matrix ────────────────────────────────────────────────────────

export type RolePermissionMap = Record<AppRole, PermissionKey[]>;

export const ROLE_PERMISSIONS: RolePermissionMap = {
  super_admin: [
    "tenant:manage",
    "users:manage",
    "memberships:manage",
    "reports:manage",
    "analytics:manage",
    "files:manage",
    "settings:manage",
    "audit:read",
    "billing:manage",
  ],

  tenant_admin: [
    "tenant:read",
    "tenant:update",
    "users:manage",
    "memberships:manage",
    "reports:manage",
    "analytics:manage",
    "files:manage",
    "settings:manage",
    "audit:read",
    "billing:read",
  ],

  gerente: [
    "tenant:read",
    "users:read",
    "memberships:read",
    "reports:manage",
    "analytics:read",
    "analytics:export",
    "files:manage",
    "audit:read",
    "settings:read",
  ],

  financeiro: [
    "tenant:read",
    "reports:create",
    "reports:read",
    "reports:update",
    "reports:export",
    "analytics:manage",
    "files:create",
    "files:read",
    "files:update",
    "files:export",
    "audit:read",
  ],

  rh: [
    "tenant:read",
    "reports:create",
    "reports:read",
    "reports:update",
    "reports:export",
    "analytics:read",
    "files:create",
    "files:read",
    "files:update",
  ],

  compras: [
    "tenant:read",
    "reports:create",
    "reports:read",
    "reports:update",
    "reports:export",
    "analytics:read",
    "files:create",
    "files:read",
    "files:update",
  ],

  qualidade: [
    "tenant:read",
    "reports:create",
    "reports:read",
    "reports:update",
    "reports:export",
    "analytics:read",
    "files:create",
    "files:read",
    "files:update",
    "audit:read",
    "audit:export",
  ],

  operacoes: [
    "tenant:read",
    "reports:create",
    "reports:read",
    "reports:update",
    "analytics:read",
    "files:create",
    "files:read",
  ],

  comercial: [
    "tenant:read",
    "reports:create",
    "reports:read",
    "reports:update",
    "reports:export",
    "analytics:read",
    "files:create",
    "files:read",
  ],

  visualizador: [
    "tenant:read",
    "reports:read",
    "analytics:read",
    "files:read",
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function hasRolePermission(role: AppRole, permission: PermissionKey): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function getRolePermissions(role: AppRole): PermissionKey[] {
  return ROLE_PERMISSIONS[role];
}

export function isValidRole(role: string): role is AppRole {
  return (APP_ROLES as readonly string[]).includes(role);
}
