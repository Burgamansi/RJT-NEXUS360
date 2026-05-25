import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  History, 
  FileText, 
  Calendar, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  Filter,
  Search
} from "lucide-react";
import { apiService } from "../services/api";
import { cn } from "../lib/utils";
import { Skeleton } from "./Skeleton";

interface UploadHistoryItem {
  id: number;
  upload_id: string;
  file_name: string;
  company_id: string;
  detected_domain: string | null;
  detected_type: string | null;
  status: string;
  created_at: string;
  rows_read: number | null;
  raw_rows_saved: number | null;
  normalized_rows_saved: number | null;
}

interface UploadHistoryProps {
  companyId: string;
}

export function UploadHistory({ companyId }: UploadHistoryProps) {
  const [history, setHistory] = useState<UploadHistoryItem[]>([
    {
      id: 1,
      upload_id: "upload_demo_1",
      file_name: "faturamento_mensal_v1.xlsx",
      company_id: companyId,
      detected_domain: "finance",
      detected_type: "revenue",
      status: "processed",
      created_at: new Date().toISOString(),
      rows_read: 1250,
      raw_rows_saved: 1250,
      normalized_rows_saved: 1250
    },
    {
      id: 2,
      upload_id: "upload_demo_2",
      file_name: "folha_pagamento_rh.csv",
      company_id: companyId,
      detected_domain: "rh",
      detected_type: "payroll",
      status: "processed",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      rows_read: 450,
      raw_rows_saved: 450,
      normalized_rows_saved: 450
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getUploadsHistory(companyId);
      setHistory(data);
    } catch (err) {
      setError("Erro ao carregar histórico de uploads");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [companyId]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
      case "processado":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
            <CheckCircle2 className="w-3 h-3" />
            Processado
          </span>
        );
      case "processing":
      case "processando":
      case "em processamento":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-wider border border-tertiary/20">
            <Clock className="w-3 h-3 animate-spin" />
            Processando
          </span>
        );
      case "error":
      case "erro":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider border border-error/20">
            <AlertCircle className="w-3 h-3" />
            Erro
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider border border-secondary/20">
            <Clock className="w-3 h-3" />
            Enviado
          </span>
        );
    }
  };

  const domainLabels: Record<string, string> = {
    finance: "Financeiro",
    rh: "Recursos Humanos",
    operations: "Operações",
    commercial: "Comercial",
    procurement: "Suprimentos"
  };

  const filteredHistory = history.filter(item => {
    const domainMatch = filterDomain === "all" || item.detected_domain === filterDomain;
    const statusMatch = filterStatus === "all" || item.status === filterStatus;
    return domainMatch && statusMatch;
  });

  if (isLoading && history.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black font-headline text-on-surface tracking-tight">Rastreabilidade de Processamentos</h3>
            <p className="text-xs text-secondary/60 uppercase tracking-widest font-medium">Histórico de ingestão de dados</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-surface-container-high px-3 py-2 rounded-xl border border-on-surface-variant/5">
            <Filter className="w-4 h-4 text-secondary/60" />
            <select 
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-secondary/80 outline-none cursor-pointer uppercase tracking-wider"
            >
              <option value="all">Todos os Domínios</option>
              <option value="finance">Financeiro</option>
              <option value="rh">RH</option>
              <option value="operations">Operações</option>
            </select>
          </div>
          
          <button 
            onClick={fetchHistory}
            className="p-2 bg-surface-container-high hover:bg-surface-container-highest rounded-xl border border-on-surface-variant/5 transition-colors group"
            title="Atualizar Histórico"
          >
            <RefreshCw className={cn("w-4 h-4 text-secondary/60 group-hover:text-primary transition-colors", isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-center gap-3 text-error text-sm font-medium">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-on-surface-variant/20">
            <Search className="w-12 h-12 text-secondary/20" />
            <p className="text-secondary/60 font-medium">Nenhum upload encontrado para os filtros selecionados.</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div 
              key={item.id}
              className={cn(
                "glass-panel rounded-2xl border border-on-surface-variant/5 overflow-hidden transition-all duration-300",
                expandedId === item.id ? "ring-1 ring-primary/30 shadow-[0_0_20px_rgba(111,216,200,0.05)]" : "hover:bg-white/5"
              )}
            >
              <div 
                className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2.5 bg-surface-container-highest rounded-xl ghost-border">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-on-surface truncate max-w-[200px] md:max-w-[300px]">{item.file_name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-secondary/50 uppercase tracking-wider font-bold">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleString('pt-BR')}
                      </span>
                      <span className="text-[10px] text-secondary/30">|</span>
                      <span className="text-[10px] text-primary/70 font-bold uppercase tracking-widest">
                        {domainLabels[item.detected_domain || ""] || "Não Identificado"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="hidden lg:flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-secondary/40">
                    <div className="flex flex-col items-end">
                      <span>Lidas</span>
                      <span className="text-on-surface/70">{item.rows_read || 0}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span>Normalizadas</span>
                      <span className="text-on-surface/70">{item.normalized_rows_saved || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {getStatusBadge(item.status)}
                    {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-secondary/40" /> : <ChevronDown className="w-4 h-4 text-secondary/40" />}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-on-surface-variant/5 bg-white/[0.02]"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-4">
                        <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-4">Metadados do Arquivo</p>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-secondary/60">Upload ID</span>
                            <span className="text-on-surface font-mono text-[10px]">{item.upload_id}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-secondary/60">Nome Original</span>
                            <span className="text-on-surface font-medium">{item.file_name}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-secondary/60">Empresa</span>
                            <span className="text-on-surface font-medium">{item.company_id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] text-tertiary font-bold uppercase tracking-[0.2em] mb-4">Análise de Processamento</p>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-secondary/60">Domínio Detectado</span>
                            <span className="text-on-surface font-bold uppercase tracking-wider">{item.detected_domain || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-secondary/60">Tipo de Dado</span>
                            <span className="text-on-surface font-bold uppercase tracking-wider">{item.detected_type || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-secondary/60">Status Final</span>
                            <span className="text-on-surface font-bold uppercase tracking-wider">{item.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em] mb-4">Métricas de Ingestão</p>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-secondary/60">Linhas Lidas (CSV/XLS)</span>
                            <span className="text-on-surface font-bold">{item.rows_read || 0}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-secondary/60">Registros Brutos Salvos</span>
                            <span className="text-on-surface font-bold">{item.raw_rows_saved || 0}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-secondary/60">Registros Normalizados</span>
                            <span className="text-on-surface font-bold text-primary">{item.normalized_rows_saved || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6 flex justify-end gap-3">
                      <button 
                        disabled 
                        className="px-4 py-2 rounded-xl bg-surface-container-highest text-[10px] font-bold uppercase tracking-widest text-secondary/40 cursor-not-allowed border border-on-surface-variant/5"
                      >
                        Reprocessar (Em breve)
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
