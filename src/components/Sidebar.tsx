import React, { useEffect, useState } from "react";
import { LayoutDashboard, Users, CreditCard, TrendingUp, ShoppingCart, Settings, FileText, Download, Shield, History, Zap, FileSpreadsheet, Factory } from "lucide-react";
import { cn } from "../lib/utils";
import { APP_BRAND } from "../config/brand";
import { getAllowedModules } from "../config/modulePermissions";
import { DEV_ROLE_CHANGE_EVENT, getCurrentRole } from "../config/mockSession";
import { RoleSwitcher } from "./dev/RoleSwitcher";
import type { SystemModule } from "../types/modules";

const menuItems = [
  { icon: LayoutDashboard, label: "Executivo", domain: "executive", module: "dashboard" },
  { icon: CreditCard, label: "Financeiro", domain: "finance", module: "financeiro" },
  { icon: TrendingUp, label: "Comercial", domain: "commercial", module: "comercial" },
  { icon: Factory, label: "Operações", domain: "operations", module: "operacoes" },
  { icon: Users, label: "RH", domain: "rh", module: "rh" },
] satisfies Array<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  domain: string;
  module: SystemModule;
}>;

interface SidebarProps {
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
  user: any;
  isAdminView?: boolean;
  onAdminToggle?: (isAdmin: boolean) => void;
  isAuditView?: boolean;
  onAuditToggle?: (isAudit: boolean) => void;
  isPlanView?: boolean;
  onPlanToggle?: (isPlan: boolean) => void;
  isDataManagementView?: boolean;
  onDataManagementToggle?: (isDataManagement: boolean) => void;
}

export function Sidebar({ selectedDomain, onDomainChange, user, isAdminView, onAdminToggle, isAuditView, onAuditToggle, isPlanView, onPlanToggle, isDataManagementView, onDataManagementToggle }: SidebarProps) {
  const [currentRole, setCurrentRole] = useState(getCurrentRole);
  const allowedModules = new Set(getAllowedModules(currentRole));
  const canViewAdmin = allowedModules.has("admin");
  const canViewAudit = allowedModules.has("auditoria");
  const canViewUploads = allowedModules.has("uploads");
  const visibleMenuItems = menuItems.filter((item) => allowedModules.has(item.module));

  useEffect(() => {
    const syncRole = () => setCurrentRole(getCurrentRole());
    window.addEventListener(DEV_ROLE_CHANGE_EVENT, syncRole);
    window.addEventListener("storage", syncRole);
    return () => {
      window.removeEventListener(DEV_ROLE_CHANGE_EVENT, syncRole);
      window.removeEventListener("storage", syncRole);
    };
  }, []);

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gradient-to-b from-white via-sky-50 to-blue-50 flex flex-col py-8 border-r border-sky-100 z-50 shadow-[12px_0_36px_rgba(33,103,163,0.08)]">
      <div className="px-8 mb-12">
        <h1 className="text-primary font-black tracking-widest text-xl uppercase font-headline">{APP_BRAND.productName}</h1>
        <p className="text-secondary/70 text-[10px] uppercase tracking-widest mt-1">{APP_BRAND.productSubtitle}</p>
      </div>

      {import.meta.env.DEV && (
        <RoleSwitcher value={currentRole} onChange={setCurrentRole} />
      )}

      <nav className="flex-1 space-y-1">
        {canViewAdmin && (
          <button
            onClick={() => {
              onAdminToggle?.(true);
              onAuditToggle?.(false);
              onPlanToggle?.(false);
            }}
            className={cn(
              "w-full flex items-center px-8 py-3 transition-all duration-300 group text-left mb-1",
              isAdminView 
                ? "text-primary border-l-2 border-primary bg-primary-container shadow-[0_12px_28px_rgba(17,119,200,0.10)]"
                : "text-secondary/80 hover:text-primary hover:bg-white/70"
            )}
          >
            <Shield className={cn("w-5 h-5 mr-4", isAdminView && "fill-primary/20")} />
            <span className="font-bold text-sm tracking-wide uppercase">Painel Admin</span>
          </button>
        )}

        {(canViewAudit || canViewAdmin || canViewUploads) && (
          <>
            {canViewAudit && (
            <button
              onClick={() => {
                onAuditToggle?.(true);
                onAdminToggle?.(false);
                onPlanToggle?.(false);
              }}
              className={cn(
                "w-full flex items-center px-8 py-3 transition-all duration-300 group text-left mb-1",
                isAuditView 
                  ? "text-primary border-l-2 border-primary bg-primary-container shadow-[0_12px_28px_rgba(17,119,200,0.10)]"
                  : "text-secondary/80 hover:text-primary hover:bg-white/70"
              )}
            >
              <History className={cn("w-5 h-5 mr-4", isAuditView && "fill-primary/20")} />
              <span className="font-bold text-sm tracking-wide uppercase">Auditoria</span>
            </button>
            )}

            {canViewAdmin && (
            <button
              onClick={() => {
                onPlanToggle?.(true);
                onAdminToggle?.(false);
                onAuditToggle?.(false);
              }}
              className={cn(
                "w-full flex items-center px-8 py-3 transition-all duration-300 group text-left mb-4",
                isPlanView 
                  ? "text-primary border-l-2 border-primary bg-primary-container shadow-[0_12px_28px_rgba(17,119,200,0.10)]"
                  : "text-secondary/80 hover:text-primary hover:bg-white/70"
              )}
            >
              <Zap className={cn("w-5 h-5 mr-4", isPlanView && "fill-primary/20")} />
              <span className="font-bold text-sm tracking-wide uppercase">Meu Plano</span>
            </button>
            )}
            {canViewUploads && (
            <button
              onClick={() => {
                onDataManagementToggle?.(true);
                onAdminToggle?.(false);
                onAuditToggle?.(false);
                onPlanToggle?.(false);
              }}
              className={cn(
                "w-full flex items-center px-8 py-3 transition-all duration-300 group text-left mb-4",
                isDataManagementView 
                  ? "text-primary border-l-2 border-primary bg-primary-container shadow-[0_12px_28px_rgba(17,119,200,0.10)]"
                  : "text-secondary/80 hover:text-primary hover:bg-white/70"
              )}
            >
              <FileSpreadsheet className={cn("w-5 h-5 mr-4", isDataManagementView && "fill-primary/20")} />
              <span className="font-bold text-sm tracking-wide uppercase">Gestão de Dados</span>
            </button>
            )}
          </>
        )}

        {visibleMenuItems.map((item) => {
          const isActive = !isAdminView && !isAuditView && !isPlanView && !isDataManagementView &&
                          selectedDomain === item.domain;
          return (
            <button
              key={item.label}
              onClick={() => {
                onAuditToggle?.(false);
                onPlanToggle?.(false);
                onDataManagementToggle?.(false);
                onDomainChange(item.domain);
              }}
              className={cn(
                "w-full flex items-center px-8 py-3 transition-all duration-300 group text-left",
                isActive 
                  ? "text-primary border-l-2 border-primary bg-primary-container shadow-[0_12px_28px_rgba(17,119,200,0.10)]"
                  : "text-secondary/80 hover:text-primary hover:bg-white/70"
              )}
            >
              <item.icon className={cn("w-5 h-5 mr-4", isActive && "fill-primary/20")} />
              <span className="font-medium text-sm tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-8 space-y-4">
        <a href="#" className="flex items-center text-secondary/80 hover:text-primary py-2 transition-colors">
          <Download className="w-5 h-5 mr-4" />
          <span className="text-sm">Exportar</span>
        </a>
        <a href="#" className="flex items-center text-secondary/80 hover:text-primary py-2 transition-colors">
          <Settings className="w-5 h-5 mr-4" />
          <span className="text-sm">Configurações</span>
        </a>
        
        <div className="pt-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-surface-container-highest flex items-center justify-center overflow-hidden ghost-border">
            <img 
              src={`https://picsum.photos/seed/${user.id}/100/100`} 
              alt="Perfil" 
              className="object-cover h-full w-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface truncate max-w-[120px]">{user.name}</p>
            <p className="text-[10px] text-secondary/70 uppercase tracking-tighter">
              Cliente: {user.companyName || APP_BRAND.defaultTenantName}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
