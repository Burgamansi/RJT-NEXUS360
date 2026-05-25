import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  History, 
  Search, 
  Filter, 
  User, 
  Activity, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  Tag,
  Info
} from "lucide-react";
import { apiService } from "../../services/api";
import { cn } from "../../lib/utils";
import { Skeleton } from "../Skeleton";

interface AuditLog {
  id: string;
  user_name: string;
  action: string;
  module: string;
  status: string;
  created_at: string;
  metadata: string;
}

interface AuditPanelProps {
  user: any;
}

export function AuditPanel({ user }: AuditPanelProps) {
  const [logs, setLogs] = useState<AuditLog[]>([
    { id: "1", user_name: "Admin Demo", action: "upload", module: "data", status: "success", created_at: new Date().toISOString(), metadata: JSON.stringify({ file: "faturamento_q1.xlsx" }) },
    { id: "2", user_name: "João Silva", action: "login", module: "auth", status: "success", created_at: new Date().toISOString(), metadata: JSON.stringify({ ip: "192.168.1.1" }) }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    action: "",
    status: "",
    module: ""
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAuditLogs(filters, user);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      login: "Login",
      login_failed: "Falha no Login",
      register: "Registro",
      upload: "Upload de Arquivo",
      process: "Processamento",
      export_pdf: "Exportação PDF",
      export_ppt: "Exportação PPT",
      update_company: "Atualização de Empresa",
      update_company_status: "Alteração de Status Empresa",
      update_user: "Atualização de Usuário"
    };
    return labels[action] || action;
  };

  const getModuleLabel = (module: string) => {
    const labels: Record<string, string> = {
      auth: "Autenticação",
      data: "Dados",
      report: "Relatórios",
      settings: "Configurações",
      admin: "Administração"
    };
    return labels[module] || module;
  };

  if (isLoading && !logs.length) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="space-y-2">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-2xl" />
          <Skeleton className="h-12 w-48 rounded-2xl" />
          <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>
        <div className="glass-panel rounded-3xl border border-on-surface-variant/5 overflow-hidden">
          <div className="p-6 space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div>
        <h2 className="text-4xl font-black font-headline text-on-surface tracking-tight">Auditoria do Sistema</h2>
        <p className="text-secondary/50 text-[10px] uppercase tracking-widest mt-2 font-bold">Rastreabilidade completa de ações e eventos</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
          <input 
            type="text" 
            placeholder="Filtrar por ação..."
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="w-full bg-surface-container-high border border-on-surface-variant/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-on-surface outline-none focus:border-primary/30 transition-all"
          />
        </div>

        <select 
          value={filters.module}
          onChange={(e) => setFilters({ ...filters, module: e.target.value })}
          className="bg-surface-container-high border border-on-surface-variant/5 rounded-2xl py-3 px-4 text-sm text-on-surface outline-none focus:border-primary/30 transition-all"
        >
          <option value="">Todos os Módulos</option>
          <option value="auth">Autenticação</option>
          <option value="data">Dados</option>
          <option value="report">Relatórios</option>
          <option value="admin">Administração</option>
        </select>

        <select 
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-surface-container-high border border-on-surface-variant/5 rounded-2xl py-3 px-4 text-sm text-on-surface outline-none focus:border-primary/30 transition-all"
        >
          <option value="">Todos os Status</option>
          <option value="success">Sucesso</option>
          <option value="error">Erro</option>
        </select>

        <button 
          onClick={fetchLogs}
          className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-all"
        >
          <Activity className="w-5 h-5" />
        </button>
      </div>

      <div className="glass-panel rounded-3xl border border-on-surface-variant/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high/50 border-b border-on-surface-variant/5">
              <th className="p-6 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Data / Hora</th>
              <th className="p-6 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Usuário</th>
              <th className="p-6 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Ação</th>
              <th className="p-6 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Módulo</th>
              <th className="p-6 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Carregando logs...</p>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <History className="w-12 h-12 text-secondary/20" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Nenhum log encontrado</p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-on-surface-variant/5 hover:bg-white/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-on-surface">
                      <Calendar className="w-3.5 h-3.5 text-secondary/40" />
                      <span className="text-xs font-bold">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center">
                        <User className="w-3 h-3 text-secondary" />
                      </div>
                      <span className="text-xs font-bold text-on-surface">{log.user_name || "Sistema"}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-xs font-black text-on-surface uppercase tracking-tight">
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3 text-secondary/40" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/60">
                        {getModuleLabel(log.module)}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-lg border w-fit",
                      log.status === "success" 
                        ? "bg-primary/5 text-primary border-primary/10" 
                        : "bg-error/5 text-error border-error/10"
                    )}>
                      {log.status === "success" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {log.status === "success" ? "Sucesso" : "Erro"}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest hover:bg-primary/10 text-secondary/60 hover:text-primary rounded-xl transition-all group border border-on-surface-variant/5"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Detalhes</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalhes */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel w-full max-w-2xl max-h-[80vh] flex flex-col rounded-[32px] border border-on-surface-variant/10 shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-on-surface-variant/5 flex justify-between items-center bg-surface-container-high/50">
              <div>
                <h3 className="text-xl font-black font-headline text-on-surface tracking-tight uppercase">Detalhes do Evento</h3>
                <p className="text-[10px] text-secondary/50 font-bold uppercase tracking-widest mt-1">ID: {selectedLog.id}</p>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-2 hover:bg-error/10 text-secondary/40 hover:text-error rounded-xl transition-colors"
              >
                <AlertCircle className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="p-8 overflow-auto space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest">Ação</p>
                  <p className="text-sm font-bold text-on-surface">{getActionLabel(selectedLog.action)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest">Módulo</p>
                  <p className="text-sm font-bold text-on-surface">{getModuleLabel(selectedLog.module)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest">Usuário</p>
                  <p className="text-sm font-bold text-on-surface">{selectedLog.user_name || "Sistema"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest">Data / Hora</p>
                  <p className="text-sm font-bold text-on-surface">{new Date(selectedLog.created_at).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest">Metadados (JSON)</p>
                <div className="bg-background/50 rounded-2xl p-6 border border-on-surface-variant/5 font-mono text-xs text-primary/80 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(JSON.parse(selectedLog.metadata), null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface-container-high/30 border-t border-on-surface-variant/5 flex justify-end">
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-6 py-3 bg-surface-container-highest hover:bg-white/5 text-on-surface rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
