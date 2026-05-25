import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { AuthRole, PermissionKey } from "../types/permissions.js";
import { ROLE_PERMISSIONS, hasRolePermission } from "../types/permissions.js";
import type { AuthContext } from "../types/auth.js";
import { verifyToken } from "../server/security/jwt.js";
import { getCurrentRole, currentUser, currentTenant } from "./mockSession.js";

declare module "express-serve-static-core" {
  interface Request {
    auth?: AuthContext & {
      companyId?: string;
    };
  }
}

export const authConfig = {
  provider: "jwt-native",
  multiTenant: true,
  tenantResolution: {
    header: "x-tenant-id",
    queryParam: "tenantId",
    bodyField: "tenantId",
  },
  plans: {
    starter: {
      maxUsers: 5,
      features: ["core_dashboard", "reports_basic"],
    },
    professional: {
      maxUsers: 25,
      features: ["core_dashboard", "reports_advanced", "audit_read"],
    },
    enterprise: {
      maxUsers: 250,
      features: ["core_dashboard", "reports_advanced", "audit_read", "sso_ready"],
    },
  },
  audit: {
    enabled: true,
    sessionTracking: true,
  },
} as const;

/**
 * Middleware para extrair o token JWT e atachar o contexto de autenticação no Request
 */
export const attachAuthContext: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  let token: string | null = null;
  
  if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }
  
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.auth = {
        user: { 
          id: payload.userId, 
          name: "Usuário Autenticado", 
          email: payload.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        role: payload.role as AuthRole,
        permissions: ROLE_PERMISSIONS[payload.role as AuthRole] || [],
        companyId: payload.companyId
      };
      return next();
    }
  }
  
  // MOCK DEV CONTROLADO: Permite simular sessão em ambiente local/desenvolvimento
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const devRole = getCurrentRole();
    req.auth = {
      user: { 
        id: currentUser.id, 
        name: currentUser.name, 
        email: currentUser.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      role: devRole,
      permissions: ROLE_PERMISSIONS[devRole] || [],
      companyId: currentTenant.id
    };
  }
  
  next();
};

/**
 * Middleware para exigir que o usuário esteja autenticado
 */
export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.auth || !req.auth.user) {
    return res.status(401).json({ error: "Não autorizado. Token de sessão ausente ou inválido." });
  }
  next();
};

/**
 * Middleware para exigir que o escopo do tenant esteja presente
 */
export const requireTenant: RequestHandler = (req, res, next) => {
  if (!req.auth || !req.auth.companyId) {
    return res.status(400).json({ error: "Escopo de tenant não identificado na requisição autenticada." });
  }
  next();
};

/**
 * Middleware para exigir uma role específica
 */
export function requireRole(roles: AuthRole | AuthRole[]): RequestHandler {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !req.auth.role) {
      return res.status(401).json({ error: "Sessão não identificada para autorização de privilégios." });
    }
    
    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({ error: "Acesso negado. Privilégios insuficientes." });
    }
    
    next();
  };
}

/**
 * Middleware para exigir uma permissão granular
 */
export function requirePermission(permission: PermissionKey): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !req.auth.role) {
      return res.status(401).json({ error: "Sessão não identificada para autorização de permissões." });
    }
    
    const hasPermission = req.auth.permissions?.includes(permission) || hasRolePermission(req.auth.role, permission);
    
    if (!hasPermission) {
      return res.status(403).json({ error: `Acesso negado. Ação restrita: exige permissão '${permission}'.` });
    }
    
    next();
  };
}

export function getRolePermissions(role: AuthRole): PermissionKey[] {
  return ROLE_PERMISSIONS[role];
}

export function roleCan(role: AuthRole, permission: PermissionKey): boolean {
  return hasRolePermission(role, permission);
}
