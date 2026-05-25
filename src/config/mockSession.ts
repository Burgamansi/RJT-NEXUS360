import { APP_ROLES } from "../types/permissions";
import type { AppRole } from "../types/permissions";

export const DEV_ROLE_STORAGE_KEY = "rjt-nexus360-dev-role";
export const DEV_ROLE_CHANGE_EVENT = "rjt-nexus360-dev-role-change";

export const currentTenant = {
  id: "tenant-dev-rjt",
  name: "RJT Dev Tenant",
  slug: "rjt-dev",
};

export const currentUser = {
  id: "user-dev-rjt",
  name: "Usuario Dev",
  email: "dev@rjtnexus360.local",
};

function isProdEnv(): boolean {
  try {
    if (import.meta.env && import.meta.env.PROD) {
      return true;
    }
  } catch (e) {}
  
  try {
    if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
      return true;
    }
  } catch (e) {}
  
  return false;
}

function isAppRole(role: string | null): role is AppRole {
  return role !== null && (APP_ROLES as readonly string[]).includes(role);
}

function readStoredRole(): AppRole | null {
  if (typeof window === "undefined") return null;
  // Em produção, nunca ler do localStorage
  if (isProdEnv()) return null;
  
  const storedRole = window.localStorage.getItem(DEV_ROLE_STORAGE_KEY);
  return isAppRole(storedRole) ? storedRole : null;
}

export const currentRole: AppRole = "tenant_admin";

export function getCurrentRole(): AppRole {
  // Se for produção, a role padrão segura é 'visualizador'
  if (isProdEnv()) {
    return "visualizador";
  }
  const stored = readStoredRole();
  return stored !== null ? stored : currentRole;
}

export function setCurrentRole(role: AppRole): void {
  if (typeof window === "undefined") return;
  // Impedir gravação no localStorage em produção
  if (isProdEnv()) return;
  
  window.localStorage.setItem(DEV_ROLE_STORAGE_KEY, role);
  window.dispatchEvent(new CustomEvent<AppRole>(DEV_ROLE_CHANGE_EVENT, { detail: role }));
}

export const mockSession = {
  get currentRole() {
    return getCurrentRole();
  },
  currentTenant,
  currentUser,
};

