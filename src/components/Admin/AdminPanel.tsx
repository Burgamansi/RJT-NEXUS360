import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Users, 
  Upload, 
  Shield, 
  ChevronRight, 
  Activity, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ArrowLeft,
  Calendar,
  Zap,
  FileText
} from "lucide-react";
import { apiService } from "../../services/api";
import { cn } from "../../lib/utils";
import { Skeleton } from "../Skeleton";
import { APP_BRAND, DEFAULT_TENANT_ID } from "../../config/brand";

interface Company {
  id: string;
  name: string;
  status: string;
  created_at: string;
  user_count: number;
  upload_count: number;
}

interface AdminPanelProps {
  user: any;
}

export function AdminPanel({ user }: AdminPanelProps) {
  const [companies, setCompanies] = useState<Company[]>([
    { 
      id: DEFAULT_TENANT_ID, 
      name: APP_BRAND.defaultTenantName, 
      status: "active", 
      created_at: new Date().toISOString(),
      user_count: 12,
      upload_count: 45
    }
  ]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.adminListCompanies(user.role);
      setCompanies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await apiService.adminGetCompanyDetails(id, user.role);
      setCompanyDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCompanyId) {
      fetchCompanyDetails(selectedCompanyId);
    } else {
      fetchCompanies();
    }
  }, [selectedCompanyId]);

  const handleToggleCompanyStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await apiService.adminUpdateCompanyStatus(id, newStatus, user.role);
      if (selectedCompanyId === id) {
        fetchCompanyDetails(id);
      } else {
        fetchCompanies();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUser = async (userId: string, data: any) => {
    try {
      await apiService.adminUpdateUser(userId, data, user.role);
      if (selectedCompanyId) fetchCompanyDetails(selectedCompanyId);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && !companies.length && !companyDetails) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-12 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedCompanyId && companyDetails) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <button 
          onClick={() => setSelectedCompanyId(null)}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Voltar para Empresas</span>
        </button>

        <div className="flex justify-between items-end">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl font-black font-headline text-on-surface tracking-tight">{companyDetails.company.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                  companyDetails.company.status === "active" 
                    ? "bg-primary/10 text-primary border-primary/20" 
                    : "bg-error/10 text-error border-error/20"
                )}>
                  {companyDetails.company.status === "active" ? "Ativa" : "Inativa"}
                </span>
                <span className="text-[10px] text-secondary/40 font-bold uppercase tracking-widest">
                  ID: {companyDetails.company.id}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => handleToggleCompanyStatus(companyDetails.company.id, companyDetails.company.status)}
            className={cn(
              "px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all",
              companyDetails.company.status === "active"
                ? "bg-error/10 text-error hover:bg-error/20"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            {companyDetails.company.status === "active" ? "Desativar Empresa" : "Ativar Empresa"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-on-surface-variant/5">
            <div className="flex items-center gap-2 mb-4 text-secondary/40">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Usuários</span>
            </div>
            <p className="text-3xl font-black text-on-surface">{companyDetails.users?.length || 0}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-on-surface-variant/5">
            <div className="flex items-center gap-2 mb-4 text-secondary/40">
              <Upload className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Uploads</span>
            </div>
            <p className="text-3xl font-black text-on-surface">{companyDetails.stats?.total_uploads || 0}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-on-surface-variant/5">
            <div className="flex items-center gap-2 mb-4 text-secondary/40">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Processamentos</span>
            </div>
            <p className="text-3xl font-black text-on-surface">{companyDetails.stats?.total_processings || 0}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-on-surface-variant/5">
            <div className="flex items-center gap-2 mb-4 text-secondary/40">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Última Atividade</span>
            </div>
            <p className="text-sm font-bold text-on-surface">
              {companyDetails.stats?.last_activity 
                ? new Date(companyDetails.stats.last_activity).toLocaleDateString('pt-BR') 
                : "Sem atividade"}
            </p>
          </div>
        </div>
 
        <div className="space-y-4">
          <h3 className="text-xl font-black font-headline text-on-surface tracking-tight">Gestão de Usuários</h3>
          <div className="glass-panel rounded-3xl border border-on-surface-variant/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 border-b border-on-surface-variant/5">
                  <th className="p-6 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Usuário</th>
                  <th className="p-6 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Perfil</th>
                  <th className="p-6 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Status</th>
                  <th className="p-6 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody>
                {companyDetails.users?.map((u: any) => (
y) => (
                  <tr key={u.id} className="border-b border-on-surface-variant/5 hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface">{u.name}</span>
                        <span className="text-[10px] text-secondary/40">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <select 
                        value={u.role}
                        onChange={(e) => handleUpdateUser(u.id, { role: e.target.value })}
                        className="bg-surface-container-highest border border-on-surface-variant/10 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-on-surface outline-none"
                      >
                        <option value="user">Usuário</option>
                        <option value="admin_empresa">Admin Empresa</option>
                        <option value="admin_master">Admin Master</option>
                      </select>
                    </td>
                    <td className="p-6">
                      <span className={cn(
                        "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        u.status === "active" ? "bg-primary/10 text-primary border-primary/20" : "bg-error/10 text-error border-error/20"
                      )}>
                        {u.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleUpdateUser(u.id, { status: u.status === "active" ? "inactive" : "active" })}
                        className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                      >
                        {u.status === "active" ? "Bloquear" : "Desbloquear"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black font-headline text-on-surface tracking-tight">Painel Administrativo</h2>
          <div className="flex items-center gap-4 mt-2 text-[10px] text-secondary/60 uppercase tracking-[0.1em] font-medium">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary" />
              Controle Master {APP_BRAND.productName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
            <input 
              type="text" 
              placeholder="Buscar empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface-container-high border border-on-surface-variant/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-on-surface outline-none focus:border-primary/30 transition-all w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 rounded-3xl border border-on-surface-variant/5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Total</span>
          </div>
          <div>
            <p className="text-4xl font-black text-on-surface">{companies.length}</p>
            <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-widest mt-1">Empresas Cadastradas</p>
          </div>
        </div>
        <div className="glass-panel p-8 rounded-3xl border border-on-surface-variant/5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-secondary/10 rounded-2xl">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Total</span>
          </div>
          <div>
            <p className="text-4xl font-black text-on-surface">
              {companies.reduce((acc, c) => acc + c.user_count, 0)}
            </p>
            <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-widest mt-1">Usuários na Plataforma</p>
          </div>
        </div>
        <div className="glass-panel p-8 rounded-3xl border border-on-surface-variant/5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-tertiary/10 rounded-2xl">
              <Activity className="w-6 h-6 text-tertiary" />
            </div>
            <span className="text-[10px] font-black text-tertiary uppercase tracking-widest">Total</span>
          </div>
          <div>
            <p className="text-4xl font-black text-on-surface">
              {companies.reduce((acc, c) => acc + c.upload_count, 0)}
            </p>
            <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-widest mt-1">Processamentos Realizados</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black font-headline text-on-surface tracking-tight">Gestão de Empresas</h3>
        <div className="grid grid-cols-1 gap-4">
          {filteredCompanies.map(company => (
            <motion.div 
              key={company.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl border border-on-surface-variant/5 hover:bg-white/5 transition-all group flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Building2 className="w-6 h-6 text-secondary group-hover:text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-on-surface">{company.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] text-secondary/40 font-bold uppercase tracking-widest">
                      Criada em: {new Date(company.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                      company.status === "active" ? "bg-primary/10 text-primary border-primary/20" : "bg-error/10 text-error border-error/20"
                    )}>
                      {company.status === "active" ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-black text-on-surface">{company.user_count}</p>
                    <p className="text-[8px] text-secondary/40 font-bold uppercase tracking-widest">Usuários</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-on-surface">{company.upload_count}</p>
                    <p className="text-[8px] text-secondary/40 font-bold uppercase tracking-widest">Uploads</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedCompanyId(company.id)}
                    className="p-3 bg-surface-container-highest hover:bg-primary/10 text-secondary hover:text-primary rounded-xl transition-all"
                    title="Ver Detalhes"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleToggleCompanyStatus(company.id, company.status)}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      company.status === "active" ? "bg-error/5 text-error/40 hover:bg-error/10 hover:text-error" : "bg-primary/5 text-primary/40 hover:bg-primary/10 hover:text-primary"
                    )}
                    title={company.status === "active" ? "Desativar" : "Ativar"}
                  >
                    {company.status === "active" ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
