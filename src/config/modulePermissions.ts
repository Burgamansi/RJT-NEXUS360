import { MODULE_ACTIONS, SYSTEM_MODULES } from "../types/modules.js";
import type {
  ModuleAccessRole,
  ModuleAction,
  ModulePermissionMatrix,
  ModulePermissionRule,
  SystemModule,
} from "../types/modules.js";

const ALL_ACTIONS = [...MODULE_ACTIONS];
const VIEW_ONLY: ModuleAction[] = ["view"];
const FULL_AREA: ModuleAction[] = ["view", "create", "edit", "delete", "approve", "export"];
const DASHBOARD_PARTIAL: ModuleAction[] = ["view", "export"];
const AUDIT_PARTIAL: ModuleAction[] = ["view", "export"];

function allModulesWith(actions: ModuleAction[]): ModulePermissionRule[] {
  return SYSTEM_MODULES.map((module) => ({ module, actions }));
}

export const modulePermissionMatrix: ModulePermissionMatrix = {
  super_admin: allModulesWith(ALL_ACTIONS),
  tenant_admin: allModulesWith(ALL_ACTIONS),
  gerente: [
    { module: "dashboard", actions: ["view"] },
    { module: "financeiro", actions: ["view", "export"] },
    { module: "rh", actions: ["view"] },
    { module: "operacoes", actions: ["view"] },
    { module: "qualidade", actions: ["view"] },
  ],
  rh: [
    { module: "rh", actions: FULL_AREA },
    { module: "dashboard", actions: DASHBOARD_PARTIAL },
  ],
  compras: [
    { module: "compras", actions: FULL_AREA },
    { module: "dashboard", actions: DASHBOARD_PARTIAL },
  ],
  qualidade: [
    { module: "qualidade", actions: FULL_AREA },
    { module: "auditoria", actions: AUDIT_PARTIAL },
    { module: "uploads", actions: ["view", "create", "edit", "delete"] },
  ],
  financeiro: [
    { module: "financeiro", actions: FULL_AREA },
  ],
  operacoes: [
    { module: "operacoes", actions: FULL_AREA },
    { module: "dashboard", actions: DASHBOARD_PARTIAL },
  ],
  comercial: [
    { module: "comercial", actions: FULL_AREA },
    { module: "dashboard", actions: DASHBOARD_PARTIAL },
  ],
  visualizador: allModulesWith(VIEW_ONLY),
};

export function canAccessModule(role: ModuleAccessRole, module: SystemModule): boolean {
  return modulePermissionMatrix[role].some((rule) => rule.module === module);
}

export function canPerformAction(
  role: ModuleAccessRole,
  module: SystemModule,
  action: ModuleAction,
): boolean {
  const rule = modulePermissionMatrix[role].find((entry) => entry.module === module);
  return rule?.actions.includes(action) ?? false;
}

export function getAllowedModules(role: ModuleAccessRole): SystemModule[] {
  return modulePermissionMatrix[role].map((rule) => rule.module);
}

export function getAllowedActions(role: ModuleAccessRole, module: SystemModule): ModuleAction[] {
  return modulePermissionMatrix[role].find((rule) => rule.module === module)?.actions ?? [];
}
