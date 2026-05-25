import { APP_ROLES } from "./permissions.js";
import type { AppRole } from "./permissions.js";

export { APP_ROLES };
export type { AppRole };

// ─── Modules ──────────────────────────────────────────────────────────────────

export const SYSTEM_MODULES = [
  "dashboard",
  "financeiro",
  "rh",
  "qualidade",
  "operacoes",
  "compras",
  "comercial",
  "auditoria",
  "uploads",
  "admin",
] as const;

export type SystemModule = (typeof SYSTEM_MODULES)[number];

export const MODULE_ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
  "export",
  "manage_users",
] as const;

export type ModuleAction = (typeof MODULE_ACTIONS)[number];

// MODULE_ACCESS_ROLES agora é alias de APP_ROLES (sistema unificado)
export const MODULE_ACCESS_ROLES = APP_ROLES;

/** @deprecated Use AppRole */
export type ModuleAccessRole = AppRole;

export type ModulePermissionKey = `${SystemModule}:${ModuleAction}`;

export interface ModuleDefinition {
  id: SystemModule;
  label: string;
  description: string;
  order: number;
  sidebar: boolean;
  routeBase: string;
}

export interface ModulePermissionRule {
  module: SystemModule;
  actions: ModuleAction[];
}

export type ModulePermissionMatrix = Record<AppRole, ModulePermissionRule[]>;

export interface ModuleAccessContext {
  role: AppRole;
  module: SystemModule;
  action?: ModuleAction;
}
