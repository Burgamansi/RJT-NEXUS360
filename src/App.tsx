import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Search, Bell, Grid, LogOut, Zap } from "lucide-react";
import { Register } from "./components/Auth/Register";
import { Login } from "./components/Auth/Login";
import { LandingPage } from "./components/Auth/LandingPage";
import { Onboarding } from "./components/Auth/Onboarding";
import { PlanDisplay } from "./components/Plan/PlanDisplay";
import { DataManagementPanel } from "./components/Data/DataManagementPanel";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AdminPanel } from "./components/Admin/AdminPanel";
import { AuditPanel } from "./components/Admin/AuditPanel";
import { APP_BRAND, DEFAULT_TENANT_ID } from "./config/brand";
import { AccessGuard } from "./components/Auth/AccessGuard";

export default function App() {
  const [user, setUser] = useState<any>({
    id: "demo_user",
    name: "Usuário Demonstração",
    email: "demo@rjtnexus360.com",
    companyId: DEFAULT_TENANT_ID,
    companyName: APP_BRAND.defaultTenantName,
    role: "admin_master",
    onboardingCompleted: true
  });
  const [selectedDomain, setSelectedDomain] = useState("executive");
  const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().substring(0, 7));
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAuditView, setIsAuditView] = useState(false);
  const [isPlanView, setIsPlanView] = useState(false);
  const [isDataManagementView, setIsDataManagementView] = useState(false);

  const handleLogout = () => {
    // Logout desativado temporariamente
    console.log("Logout desativado no modo de demonstração direta");
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-background">
        <Sidebar 
          selectedDomain={selectedDomain} 
          onDomainChange={setSelectedDomain} 
          user={user}
          isAdminView={isAdminView}
          onAdminToggle={setIsAdminView}
          isAuditView={isAuditView}
          onAuditToggle={setIsAuditView}
          isPlanView={isPlanView}
          onPlanToggle={setIsPlanView}
          isDataManagementView={isDataManagementView}
          onDataManagementToggle={setIsDataManagementView}
        />
        
        <main className="ml-64 flex-1 flex flex-col min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(18,166,200,0.12),transparent_30%),linear-gradient(180deg,#f7fbff_0%,#eef7ff_100%)]">
          {/* Top Header */}
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl flex justify-between items-center w-full px-8 h-16 border-b border-sky-100 shadow-[0_10px_30px_rgba(33,103,163,0.06)]">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-primary" />
                <div className="flex items-center gap-4">
                  <div className="hidden xl:block pr-4 border-r border-sky-100">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{APP_BRAND.productName}</p>
                    <p className="text-[9px] font-bold text-secondary/70 uppercase tracking-widest">{APP_BRAND.productSubtitle}</p>
                  </div>
                  {!isAdminView && !isAuditView && !isPlanView && !isDataManagementView && (
                    <>
                      <input 
                        type="month" 
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="bg-white border border-sky-100 rounded-lg text-primary font-bold text-xs uppercase tracking-widest outline-none cursor-pointer px-2 py-1"
                      />
                      <button className="text-secondary font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-300 px-2 py-1 rounded-lg">Ano</button>
                      <button className="text-secondary font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-300 px-2 py-1 rounded-lg">Domínio</button>
                    </>
                  )}
                  {isAdminView && (
                    <span className="text-primary font-black text-xs uppercase tracking-[0.2em]">Administração Master</span>
                  )}
                  {isAuditView && (
                    <span className="text-primary font-black text-xs uppercase tracking-[0.2em]">Auditoria e Rastreabilidade</span>
                  )}
                  {isPlanView && (
                    <span className="text-primary font-black text-xs uppercase tracking-[0.2em]">Gestão de Plano e Assinatura</span>
                  )}
                  {isDataManagementView && (
                    <span className="text-primary font-black text-xs uppercase tracking-[0.2em]">Gestão e Sincronização de Dados</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 mr-4 border-r border-on-surface-variant/10 pr-6">
                <div className="text-right">
                  <p className="text-[10px] font-black text-on-surface uppercase tracking-wider">{user.name}</p>
                  <p className="text-[8px] text-secondary/70 font-bold uppercase tracking-widest">
                    {user.role === "admin_master" ? "Admin Master" : user.role === "admin_empresa" ? "Admin Empresa" : "Usuário"}
                  </p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-error/10 rounded-lg transition-colors group"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4 text-secondary group-hover:text-error" />
                </button>
              </div>

              <div className="relative group">
                <Bell className="w-5 h-5 text-secondary cursor-pointer hover:text-primary transition-colors" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <Grid className="w-5 h-5 text-secondary cursor-pointer hover:text-primary transition-colors" />
              <div className="h-8 w-8 rounded-lg bg-white border border-sky-100 flex items-center justify-center shadow-sm">
                <Search className="w-4 h-4 text-primary" />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <ErrorBoundary>
              {isAdminView ? (
                <AccessGuard module="admin" action="view">
                  <AdminPanel user={user} />
                </AccessGuard>
              ) : isAuditView ? (
                <AccessGuard module="auditoria" action="view">
                  <AuditPanel user={user} />
                </AccessGuard>
              ) : isPlanView ? (
                <AccessGuard module="admin" action="view">
                  <div className="p-8 max-w-4xl mx-auto">
                    <PlanDisplay companyId={user.companyId} />
                  </div>
                </AccessGuard>
              ) : isDataManagementView ? (
                <AccessGuard module="uploads" action="view">
                  <DataManagementPanel />
                </AccessGuard>
              ) : (
                <Dashboard domain={selectedDomain} period={selectedPeriod} companyId={user.companyId} onNavigate={(domain) => { setSelectedDomain(domain); setIsAdminView(false); setIsAuditView(false); setIsPlanView(false); setIsDataManagementView(false); }} />
              )}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
