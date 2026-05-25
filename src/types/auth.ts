import type { AuthRole, PermissionKey } from "./permissions.js";

export type TenantStatus = "active" | "inactive" | "suspended" | "trial";
export type MembershipStatus = "active" | "invited" | "disabled" | "removed";
export type PlanCode = "starter" | "professional" | "enterprise";
export type AuditSessionStatus = "active" | "expired" | "revoked";

export interface TenantPlan {
  code: PlanCode;
  name: string;
  maxUsers: number;
  maxStorageMb?: number;
  features: string[];
}

export interface Tenant {
  id: string;
  name: string;
  legalName?: string;
  documentNumber?: string;
  slug: string;
  status: TenantStatus;
  plan: TenantPlan;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  externalProviderId?: string;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  tenantId: string;
  userId: string;
  role: AuthRole;
  permissions: PermissionKey[];
  status: MembershipStatus;
  invitedByUserId?: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditSession {
  id: string;
  tenantId?: string;
  userId?: string;
  membershipId?: string;
  provider?: string;
  ipAddress?: string;
  userAgent?: string;
  status: AuditSessionStatus;
  startedAt: string;
  endedAt?: string;
  lastSeenAt?: string;
}

export interface AuthContext {
  user?: User;
  tenant?: Tenant;
  membership?: Membership;
  role?: AuthRole;
  permissions: PermissionKey[];
  session?: AuditSession;
}

export interface AuthenticatedRequestContext extends AuthContext {
  user: User;
  tenant: Tenant;
  membership: Membership;
  role: AuthRole;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface JwtPayload {
  userId: string;
  companyId: string;
  role: string;
  email: string;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext & {
        companyId?: string;
      };
    }
  }
}
