import React, { useState, useRef, useEffect } from "react";
import { Upload, Brain, Info, TrendingUp, Activity, Users, Zap, Search, Bell, Grid, ChevronRight, CreditCard, FileText, History, Download, Shield, ShoppingCart } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { apiService, Metric, Report } from "../services/api";
import { MetricSkeleton, ChartSkeleton, Skeleton } from "./Skeleton";
import { cn } from "../lib/utils";
import { UploadHistory } from "./UploadHistory";
import { Alert, AlertType } from "./Alert";
import { FileSpreadsheet } from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import { spreadsheetTemplates, templateService } from "../services/template.service";
import { ColumnMapper } from "./ColumnMapper";
import { ExecutivoDashboard } from "./modules/ExecutivoDashboard";
import { FinanceiroModule } from "./modules/FinanceiroModule";
import { ComercialModule } from "./modules/ComercialModule";
import { OperacoesModule } from "./modules/OperacoesModule";
import { RHModule } from "./modules/RHModule";
import { AccessGuard } from "./Auth/AccessGuard";

interface DashboardProps {
  domain: string;
  period: string;
  companyId: string;
  onNavigate?: (domain: string) => void;
}
export function Dashboard({ domain, period, companyId, onNavigate }: DashboardProps) {
  // ─── Module Router ──────────────────────────────────────────────────────────
  if (domain === "executive") return (
    <AccessGuard module="dashboard" action="view">
      <ExecutivoDashboard onNavigate={onNavigate} companyId={companyId} />
    </AccessGuard>
  );
  if (domain === "finance") return (
    <AccessGuard module="financeiro" action="view">
      <FinanceiroModule companyId={companyId} period={period} />
    </AccessGuard>
  );
  if (domain === "commercial") return (
    <AccessGuard module="comercial" action="view">
      <ComercialModule companyId={companyId} period={period} />
    </AccessGuard>
  );
  if (domain === "operations") return (
    <AccessGuard module="operacoes" action="view">
      <OperacoesModule companyId={companyId} period={period} />
    </AccessGuard>
  );
  if (domain === "rh") return (
    <AccessGuard module="rh" action="view">
      <RHModule companyId={companyId} period={period} />
    </AccessGuard>
  );
  // ───────────────────────────────────────────────────────────────────────────
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<{ uploadId: string; headers: string[]; detectedDomain: string; detectedType: string } | null>(null);
  const [alert, setAlert] = useState<{ type: AlertType; title: string; message: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [reportSummary, setReportSummary] = useState<any>(null);

  const { data: dbData, metrics: dbMetrics, loading, error, formatBRL } = useDashboardData(domain, period, companyId);
  const [dashboardData, setDashboardData] = useState<Metric[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logging data as requested by user for Vercel debugging
  useEffect(() => {
    if (dbData) {
      console.log("[Dashboard] Real data from Turso:", dbData);
    }
  }, [dbData]);

  const domainLabels: Record<string, string> = {
    finance: "Financeiro",
    rh: "Recursos Humanos",
    operations: "Operações",
    commercial: "Comercial",
    procurement: "Suprimentos"
  };

  const mapErrorToPortuguese = (error: any): { title: string; message: string } => {
    const msg = error.message || String(error);
    
    if (msg.includes("format") || msg.includes("extension")) {
      return {
        title: "Formato Não Suportado",
        message: "Por favor, envie um arquivo nos formatos XLS, XLSX ou CSV."
      };
    }
    if (msg.includes("empty") || msg.includes("no data")) {
      return {
        title: "Arquivo Vazio",
        message: "O arquivo enviado não contém dados válidos para processamento."
      };
    }
    if (msg.includes("columns") || msg.includes("required")) {
      return {
        title: "Colunas Ausentes",
        message: "Não encontramos as colunas obrigatórias necessárias para este domínio."
      };
    }
    if (msg.includes("domain") || msg.includes("identify")) {
      return {
        title: "Domínio Não Identificado",
        message: "A estrutura da planilha não corresponde a nenhum padrão conhecido (Financeiro, RH ou Operações)."
      };
    }
    if (msg.includes("upload")) {
      return {
        title: "Falha no Upload",
        message: "Ocorreu um problema ao processar o arquivo localmente."
      };
    }
    if (msg.includes("process")) {
      return {
        title: "Falha no Processamento",
        message: "Houve um erro ao simular o processamento dos dados."
      };
    }

    return {
      title: "Erro Inesperado",
      message: "Ocorreu um erro inesperado no modo de demonstração."
    };
  };

  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad && !metrics) {
      setIsLoading(true);
    }
    
    try {
      const [dashboardResult, periodMetrics, reportData, summaryData] = await Promise.all([
        apiService.getDashboard(domain, companyId),
        apiService.getMetrics(domain, period, companyId),
        apiService.getReport(domain),
        apiService.getReportSummary(domain, period, companyId)
      ]);

      if (periodMetrics && periodMetrics.length > 0) {
        const periodSummary: any = {};
        periodMetrics.forEach(m => {
          periodSummary[m.metric_name] = m.metric_value;
        });
        setMetrics(periodSummary);
      } else if (dashboardResult?.latestSummary) {
        setMetrics(dashboardResult.latestSummary);
      }

      if (dashboardResult?.history) {
        setDashboardData(dashboardResult.history);
      }
      
      if (reportData) setReport(reportData);
      if (summaryData) setReportSummary(summaryData);
      
      setAlert(null); // Clear any previous errors if successful
    } catch (error: any) {
      console.error("Falha ao buscar dados do painel:", error);
      setAlert({
        type: "error",
        title: "Erro de Conexão",
        message: error.message || "Não foi possível carregar os dados reais do banco de dados."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, [domain, period, companyId]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação Frontend
    const allowedExtensions = ["csv", "xlsx", "xls"];
    const extension = file.name.split(".").pop()?.toLowerCase();
    
    if (!extension || !allowedExtensions.includes(extension)) {
      setAlert({
        type: "error",
        title: "Formato Inválido",
        message: "Apenas arquivos CSV, XLSX e XLS são permitidos."
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size === 0) {
      setAlert({
        type: "error",
        title: "Arquivo Vazio",
        message: "O arquivo selecionado está vazio."
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    setSelectedFile(file);
    setUploadProgress(10);
    setUploadStatus("Iniciando upload...");
    setValidationErrors([]);
    setAlert(null);
    
    try {
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const uploadData = await apiService.uploadFile(file, companyId);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (uploadData.uploadId) {
        // Se a confiança for alta e não houver campos obrigatórios faltando, processa automaticamente
        if (uploadData.confidence >= 0.9 && (!uploadData.missingRequired || uploadData.missingRequired.length === 0)) {
          setUploadStatus("Analisando estrutura e processando dados...");
          setUploadProgress(0);
          
          const processInterval = setInterval(() => {
            setUploadProgress(prev => (prev >= 95 ? 95 : prev + 5));
          }, 150);

          await apiService.processFile(uploadData.uploadId, uploadData.mapping, uploadData.detectedDomain, uploadData.detectedType, companyId);
          
          clearInterval(processInterval);
          setUploadProgress(100);
          setUploadStatus("Finalizando processamento...");
          await fetchData();
          
          setAlert({
            type: "success",
            title: "Análise Concluída",
            message: `O arquivo "${file.name}" foi processado e os insights já estão disponíveis.`
          });
          setIsUploading(false);
          setUploadStatus("");
          setSelectedFile(null);
          setUploadProgress(0);
        } else {
          // Caso contrário, entra no modo de mapeamento assistido
          setPendingUpload({
            uploadId: uploadData.uploadId,
            headers: uploadData.headers,
            detectedDomain: uploadData.detectedDomain,
            detectedType: uploadData.detectedType
          });
          setUploadStatus("");
        }
      }
    } catch (error: any) {
      setIsUploading(false);
      setUploadStatus("");
      setSelectedFile(null);
      setUploadProgress(0);
      if (error.errors) {
        setValidationErrors(error.errors);
        setAlert({
          type: "error",
          title: "Erro de Validação",
          message: "O arquivo contém inconsistências que impedem o processamento."
        });
      } else {
        const mapped = mapErrorToPortuguese(error);
        setAlert({
          type: "error",
          title: mapped.title,
          message: mapped.message
        });
      }
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleMappingConfirm = async (mapping: Record<string, string>, overrideDomain: string, overrideType: string) => {
    if (!pendingUpload) return;
    
    setIsUploading(true);
    setUploadStatus("Processando dados...");
    setAlert(null);
    
    try {
      await apiService.processFile(pendingUpload.uploadId, mapping, overrideDomain, overrideType, companyId);
      
      setUploadStatus("Atualizando painel...");
      await fetchData();
      
      if (reportSummary) {
        const summary = await apiService.getReportSummary(domain, period, companyId);
        setReportSummary(summary);
      }

      setAlert({
        type: "success",
        title: "Processamento Concluído",
        message: "Os dados foram mapeados e processados com sucesso."
      });
      setPendingUpload(null);
    } catch (error: any) {
      const mapped = mapErrorToPortuguese(error);
      setAlert({
        type: "error",
        title: mapped.title,
        message: mapped.message
      });
    } finally {
      setIsUploading(false);
      setUploadStatus("");
    }
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const summary = await apiService.getReportSummary(domain, period, companyId);
      setReportSummary(summary);
    } catch (error) {
      alert("Falha ao gerar o resumo do relatório");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await apiService.exportPDF(domain, period, companyId);
    } catch (error) {
      alert("Falha ao exportar PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPPT = async () => {
    setIsExporting(true);
    try {
      await apiService.exportPPT(domain, period, companyId);
    } catch (error) {
      alert("Falha ao exportar PPT");
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return formatBRL(val);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-pulse">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <Skeleton className="col-span-12 lg:col-span-7 h-[200px] rounded-2xl" />
          <Skeleton className="col-span-12 lg:col-span-5 h-[200px] rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <MetricSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-12 gap-6">
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const hasData = metrics !== null || dashboardData.length > 0;

  // Proteção de Estado: Garante que métricas básicas existam para evitar quebras
  const safeMetrics = metrics || {
    revenue: 0,
    expenses: 0,
    profit: 0,
    margin: 0,
    ebitda: 0,
    headcount: 0,
    absence_events: 0,
    absenteeism_rate: 0,
    turnover: 0,
    total_production: 0,
    average_efficiency: 0,
    quality_rate: 0,
    waste_rate: 0,
    leads: 0,
    conversion_rate: 0,
    avg_ticket: 0,
    total_spend: 0,
    savings_rate: 0,
    active_vendors: 0,
    compliance_rate: 0
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Feedback de Upload Premium */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md"
          >
            <div className="glass-panel p-6 rounded-[2rem] border border-primary/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Zap className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Processamento Inteligente</p>
                    <p className="text-sm font-bold text-on-surface truncate max-w-[200px]">{selectedFile?.name}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-primary">{uploadProgress}%</span>
              </div>
              
              <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary shadow-[0_10px_24px_rgba(17,119,200,0.22)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
              
              <p className="text-[10px] text-secondary/60 text-center font-medium uppercase tracking-widest italic">
                {uploadStatus}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alertas do Sistema */}
      <AnimatePresence>
        {alert && (
          <div className="mb-6">
            <Alert 
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onClose={() => setAlert(null)}
              onRetry={alert.type === "error" ? fetchData : undefined}
              onAction={alert.type === "error" ? handleUploadClick : undefined}
              actionLabel={alert.type === "error" ? "Selecionar outro arquivo" : undefined}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Alerta de Erros de Validação Detalhados */}
      {validationErrors.length > 0 && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="bg-error/5 border border-error/10 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center gap-2 text-error font-bold mb-2 text-xs uppercase tracking-widest">
            <Info className="w-3.5 h-3.5" />
            <span>Inconsistências Encontradas</span>
          </div>
          <ul className="list-disc list-inside text-[11px] text-error/70 space-y-1 font-medium">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Interface de Mapeamento Assistido */}
      <AnimatePresence>
        {pendingUpload && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8"
          >
            <ColumnMapper 
              headers={pendingUpload.headers}
              detectedDomain={pendingUpload.detectedDomain}
              onConfirm={handleMappingConfirm}
              onCancel={() => setPendingUpload(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cabeçalho */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black font-headline text-on-surface tracking-tight capitalize">Insights de {domainLabels[domain] || domain}</h2>
          <div className="flex items-center gap-4 mt-2 text-[10px] text-secondary/60 uppercase tracking-[0.1em] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Fluxo de dados em tempo real ativo
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Domínio: {domainLabels[domain] || domain}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <p className="text-[9px] text-secondary/40 font-bold uppercase tracking-widest mr-2">Modelos:</p>
            {spreadsheetTemplates.map(t => (
              <button
                key={t.id}
                onClick={() => templateService.downloadTemplate(t.id)}
                className="p-2 bg-surface-container-high hover:bg-primary/10 hover:text-primary rounded-lg border border-on-surface-variant/5 transition-all group"
                title={`Baixar modelo ${t.name}`}
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 border border-on-surface-variant/10",
              showHistory ? "bg-primary text-background" : "bg-surface-container-high text-secondary hover:bg-surface-container-highest"
            )}
          >
            <History className="w-5 h-5" />
            <span className="font-bold font-headline uppercase tracking-wider text-sm">
              {showHistory ? "Ver Painel" : "Histórico"}
            </span>
          </button>

          {hasData && (
            <div className="bg-gradient-to-br from-primary-container to-cyan-100 p-[1px] rounded-2xl shadow-[0_16px_32px_rgba(17,119,200,0.14)] hover:scale-[1.02] transition-transform duration-300">
              <button 
                onClick={handleUploadClick}
                disabled={isUploading}
                className="bg-white hover:bg-primary-container px-6 py-3 rounded-[15px] flex items-center gap-3 group disabled:opacity-50"
              >
                <Upload className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-primary font-bold font-headline uppercase tracking-wider text-sm">
                  {isUploading ? uploadStatus : "Upload de Dados"}
                </span>
              </button>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".csv,.xlsx,.xls"
          />
        </div>
      </div>

      {/* Bloco de Comando Central: Ação Prioritária Dominante */}
      {reportSummary ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group mb-16"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-primary via-tertiary to-secondary rounded-[3.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient-xy" />
          <div className="relative glass-panel rounded-[3rem] p-12 border-2 border-primary/20 bg-gradient-to-br from-white via-sky-50 to-primary-container shadow-[0_28px_64px_rgba(22,84,132,0.12)] overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.04] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none">
              <Zap className="w-80 h-80 text-primary animate-pulse" />
            </div>
            
            <div className="flex flex-col items-center text-center space-y-10 relative z-10">
              <div className="flex items-center gap-6">
                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-primary/40" />
                <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-primary-container border border-primary/20 shadow-[0_12px_28px_rgba(17,119,200,0.12)]">
                  <Zap className="w-5 h-5 text-primary fill-primary" />
                  <span className="text-[12px] font-black text-primary uppercase tracking-[0.5em]">AÇÃO PRIORITÁRIA</span>
                </div>
                <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-primary/40" />
              </div>

              <div className="space-y-4 max-w-5xl">
                <h3 className="text-5xl md:text-7xl font-black font-headline text-on-surface leading-[1] tracking-tighter">
                  <span className="text-primary block text-sm tracking-[0.6em] mb-4 opacity-80 uppercase">Ação Recomendada</span>
                  {reportSummary?.priorityAction?.action || "Aguardando Análise"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl pt-8 border-t border-on-surface-variant/10">
                <div className="space-y-3">
                  <p className="text-[11px] font-black text-secondary/40 uppercase tracking-[0.3em]">Impacto Esperado</p>
                  <p className="text-xl font-bold text-on-surface/90 leading-snug">{reportSummary?.priorityAction?.impact || "Moderado"}</p>
                </div>
                
                <div className="space-y-3 flex flex-col items-center">
                  <p className="text-[11px] font-black text-secondary/40 uppercase tracking-[0.3em]">Urgência</p>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-3 h-3 rounded-full animate-ping",
                      reportSummary?.priorityAction?.urgency === "Alta" ? "bg-error shadow-[0_10px_22px_rgba(194,65,59,0.20)]" :
                      reportSummary?.priorityAction?.urgency === "Média" ? "bg-amber-400 shadow-[0_10px_22px_rgba(217,119,6,0.18)]" :
                      "bg-primary shadow-[0_10px_22px_rgba(17,119,200,0.20)]"
                    )} />
                    <p className={cn(
                      "text-2xl font-black font-headline uppercase tracking-widest",
                      reportSummary?.priorityAction?.urgency === "Alta" ? "text-error" : 
                      reportSummary?.priorityAction?.urgency === "Média" ? "text-warning" : "text-primary"
                    )}>
                      {reportSummary?.priorityAction?.urgency || "Baixa"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-black text-secondary/40 uppercase tracking-[0.3em]">Nível de Risco</p>
                  <p className={cn(
                    "text-2xl font-black font-headline uppercase tracking-widest",
                    reportSummary?.riskLevel === "Alto" ? "text-error" : 
                    reportSummary?.riskLevel === "Moderado" ? "text-warning" : "text-primary"
                  )}>
                    {reportSummary?.riskLevel || "Controlado"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}

      {showHistory ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <UploadHistory companyId={companyId} />
        </motion.div>
      ) : (
        <>
          {/* Linha Superior: Insights de IA e Métricas Principais */}
          <div className={cn(
            "grid grid-cols-12 gap-6 transition-all duration-700",
            reportSummary && "opacity-60 scale-[0.99] grayscale-[30%]"
          )}>
            <div className="col-span-12 lg:col-span-8 glass-panel rounded-[2rem] p-8 relative overflow-hidden group border border-on-surface-variant/5">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                <Brain className="w-48 h-48 text-primary" />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-4 h-4 text-primary fill-primary" />
                </div>
                <h3 className="font-headline font-black uppercase tracking-[0.2em] text-primary text-[10px]">Inteligência de Negócio</h3>
              </div>
              <div className="space-y-4 relative z-10">
                {report?.insights?.length ? report.insights.map((insight: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-5 items-start bg-white/[0.02] hover:bg-white/[0.05] p-5 rounded-2xl border border-on-surface-variant/5 transition-all duration-300"
                  >
                    <div className={cn(
                      "mt-1 p-1.5 rounded-lg shrink-0",
                      insight.type === "trending_up" ? "bg-primary/10 text-primary" : "bg-tertiary/10 text-tertiary"
                    )}>
                      {insight.type === "trending_up" ? <TrendingUp className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                    </div>
                    <p className="text-on-surface/90 font-medium leading-relaxed text-sm">
                      {insight.text}
                    </p>
                  </motion.div>
                )) : (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-5 items-start p-5 rounded-2xl border border-on-surface-variant/5">
                        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 glass-panel rounded-[2rem] p-8 flex flex-col justify-between border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-black font-headline uppercase tracking-[0.2em] text-primary">
                    Indicador Mestre
                  </span>
                  <h4 className="text-xs font-bold text-secondary/60 uppercase tracking-wider">
                    {domain === "finance" ? "Volume de Receita" : domain === "rh" ? "Total de Colaboradores" : "Produção Acumulada"}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest">Demo Mode</span>
                </div>
              </div>

              <div className="mt-8 relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black font-headline text-on-surface tracking-tighter">
                    {domain === "finance" || domain === "commercial"
                      ? formatCurrency(safeMetrics.revenue || 0)
                      : domain === "rh" 
                        ? safeMetrics.headcount || "0"
                      : domain === "procurement"
                        ? formatCurrency(safeMetrics.total_spend || 0)
                        : safeMetrics.total_production || "0"}
                  </span>
                  <span className="text-primary font-black text-sm uppercase tracking-widest">+4.2%</span>
                </div>
                
                <div className="h-1.5 w-full bg-on-surface-variant/5 rounded-full mt-6 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-tertiary shadow-[0_10px_20px_rgba(17,119,200,0.18)]"
                  />
                </div>
                <div className="flex justify-between mt-3">
                  <p className="text-[9px] text-secondary/40 uppercase tracking-[0.2em] font-bold">Meta: 85% do Target</p>
                  <p className="text-[9px] text-secondary/40 uppercase tracking-[0.2em] font-bold">Ref: {period}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Linha de KPIs */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700",
            reportSummary && "opacity-60 scale-[0.99] grayscale-[30%]"
          )}>
            {domain === "finance" ? (
              <>
                <MetricCard label="Receita Bruta" value={formatCurrency(safeMetrics.revenue || 0)} subValue="Faturamento total" icon={TrendingUp} color="primary" trend="up" />
                <MetricCard label="EBITDA" value={formatCurrency(safeMetrics.ebitda || 0)} subValue="Resultado operacional" icon={Zap} color="secondary" trend="up" />
                <MetricCard label="Lucro Líquido" value={formatCurrency(safeMetrics.profit || 0)} subValue="Após impostos e taxas" icon={TrendingUp} color="primary" trend="neutral" />
                <MetricCard label="Margem Op." value={`${(safeMetrics.margin || 0).toFixed(1)}%`} subValue="Eficiência de lucro" icon={Activity} color="tertiary" trend="up" />
              </>
            ) : domain === "rh" ? (
              <>
                <MetricCard label="Headcount" value={safeMetrics.headcount || "0"} subValue="Quadro ativo total" icon={Users} color="primary" trend="up" />
                <MetricCard label="Turnover" value={`${((safeMetrics.turnover || 0) * 10).toFixed(1)}%`} subValue="Taxa de rotatividade" icon={Activity} color="tertiary" trend="down" />
                <MetricCard label="Absenteísmo" value={`${(safeMetrics.absenteeism_rate || 0).toFixed(1)}%`} subValue="Índice de ausências" icon={TrendingUp} color="secondary" trend="neutral" />
                <MetricCard label="Eventos RH" value={safeMetrics.absence_events || "0"} subValue="Registros no período" icon={FileText} color="primary" trend="up" />
              </>
            ) : domain === "commercial" ? (
              <>
                <MetricCard label="Receita Vendas" value={formatCurrency(safeMetrics.revenue || 0)} subValue="Faturamento bruto" icon={TrendingUp} color="primary" trend="up" />
                <MetricCard label="Leads" value={safeMetrics.leads || "0"} subValue="Novas oportunidades" icon={Users} color="secondary" trend="up" />
                <MetricCard label="Conversão" value={`${(safeMetrics.conversion_rate || 0).toFixed(1)}%`} subValue="Taxa de fechamento" icon={Activity} color="tertiary" trend="neutral" />
                <MetricCard label="Ticket Médio" value={formatCurrency(safeMetrics.avg_ticket || 0)} subValue="Valor médio venda" icon={CreditCard} color="primary" trend="up" />
              </>
            ) : domain === "procurement" ? (
              <>
                <MetricCard label="Gasto Total" value={formatCurrency(safeMetrics.total_spend || 0)} subValue="Volume de compras" icon={ShoppingCart} color="primary" trend="down" />
                <MetricCard label="Savings" value={`${(safeMetrics.savings_rate || 0).toFixed(1)}%`} subValue="Economia gerada" icon={Zap} color="tertiary" trend="up" />
                <MetricCard label="Fornecedores" value={safeMetrics.active_vendors || "0"} subValue="Parceiros ativos" icon={Users} color="secondary" trend="neutral" />
                <MetricCard label="Compliance" value={`${(safeMetrics.compliance_rate || 0).toFixed(1)}%`} subValue="Aderência processos" icon={Shield} color="primary" trend="up" />
              </>
            ) : (
              <>
                <MetricCard label="Produção" value={safeMetrics.total_production || "0"} subValue="Unidades processadas" icon={Activity} color="primary" trend="up" />
                <MetricCard label="OEE Médio" value={`${(safeMetrics.average_efficiency || 0).toFixed(1)}%`} subValue="Eficiência global" icon={Zap} color="tertiary" trend="up" />
                <MetricCard label="Qualidade" value={`${(safeMetrics.quality_rate || 0).toFixed(1)}%`} subValue="Índice de acerto" icon={TrendingUp} color="secondary" trend="up" />
                <MetricCard label="Waste Rate" value={`${(safeMetrics.waste_rate || 0).toFixed(1)}%`} subValue="Perda de material" icon={Activity} color="primary" trend="down" />
              </>
            )}
          </div>

          {/* Linha de Gráficos e Resumo Executivo */}
          <div className={cn(
            "grid grid-cols-12 gap-6 transition-all duration-700",
            reportSummary && "opacity-60 scale-[0.99] grayscale-[30%]"
          )}>
            <div className="col-span-12 lg:col-span-8 glass-panel rounded-2xl p-6 min-h-[350px] flex flex-col border border-on-surface-variant/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline font-bold text-lg text-on-surface">Tendências Históricas de Desempenho</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={handleGenerateReport}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-container transition-colors"
                  >
                    Gerar Relatório
                  </button>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full h-[250px]">
                {dashboardData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.filter(d => d.metric_name === (
                      domain === "finance" ? "revenue" : 
                      domain === "rh" ? "absence_events" : 
                      domain === "commercial" ? "revenue" :
                      domain === "procurement" ? "total_spend" :
                      "total_production"
                    )).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                      <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: "#94ccff60", fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: "#ffffff05" }} contentStyle={{ backgroundColor: "#182a48", border: "none", borderRadius: "8px" }} />
                      <Bar dataKey="metric_value" radius={[4, 4, 0, 0]}>
                        {(dashboardData || []).filter(d => d.metric_name === (domain === "finance" ? "revenue" : domain === "rh" ? "absence_events" : "total_production")).reverse().map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#6fd8c8" : "#58d6f1"} fillOpacity={0.6 + (index * 0.04)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ChartSkeleton />
                )}
              </div>

          {/* Seção de Resumo Executivo Gerado */}
          {reportSummary && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 glass-panel rounded-[2.5rem] p-10 border border-on-surface-variant/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-tertiary to-secondary" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                    <Brain className="w-4 h-4" />
                    <span>Inteligência Executiva</span>
                  </div>
                  <h4 className="text-3xl font-black font-headline text-on-surface tracking-tight">{reportSummary?.title || "Relatório Executivo"}</h4>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-highest text-[10px] font-black uppercase tracking-widest text-on-surface hover:bg-primary hover:text-background transition-all disabled:opacity-50 border border-on-surface-variant/5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isExporting ? "Exportando..." : "Exportar PDF"}
                  </button>
                  <button 
                    onClick={handleExportPPT}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-highest text-[10px] font-black uppercase tracking-widest text-on-surface hover:bg-primary hover:text-background transition-all disabled:opacity-50 border border-on-surface-variant/5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isExporting ? "Exportando..." : "Exportar PPT"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-10">
                  <section className="space-y-6">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-tertiary/60 flex items-center gap-2">
                      <div className="w-4 h-[1px] bg-tertiary/40" />
                      Insights e Ações
                    </h5>
                    <div className="grid grid-cols-1 gap-4">
                      {reportSummary?.insights?.map((insight: any, i: number) => (
                        <div key={i} className="flex gap-4 items-start bg-white/5 p-5 rounded-2xl border border-on-surface-variant/5 hover:border-primary/20 transition-all group">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform shrink-0">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                              <p className="text-sm text-on-surface/80 leading-relaxed font-medium">
                                <span className="text-primary/60 font-black uppercase text-[9px] mr-2 tracking-widest">Insight:</span>
                                {insight.text}
                              </p>
                              <span className={cn(
                                "text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shrink-0 ml-4",
                                insight.urgency === "Crítico" ? "bg-error/10 text-error" : 
                                insight.urgency === "Oportunidade" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                              )}>
                                {insight.urgency}
                              </span>
                            </div>
                            <p className="text-xs text-secondary/70 font-bold flex items-center gap-2">
                              <span className="text-secondary/40 font-black uppercase text-[9px] tracking-widest">Decisão:</span>
                              <ChevronRight className="w-3 h-3 text-secondary/40" />
                              {insight.action}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60 flex items-center gap-2">
                      <div className="w-4 h-[1px] bg-secondary/40" />
                      Recomendações Estratégicas
                    </h5>
                    <div className="grid grid-cols-1 gap-4">
                      {reportSummary?.recommendations?.map((rec: any, i: number) => (
                        <div key={i} className="bg-surface-container-highest/30 p-6 rounded-2xl border border-on-surface-variant/5 space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                <ChevronRight className="w-5 h-5" />
                              </div>
                              <p className="font-black text-on-surface uppercase tracking-wider text-sm">{rec.action}</p>
                            </div>
                            <span className="text-[9px] font-black px-2 py-1 bg-secondary/10 text-secondary rounded-lg uppercase tracking-widest">Ação Sugerida</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest">Próximo Passo</p>
                              <p className="text-xs text-on-surface/80 font-medium">{rec.nextStep}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-error/40 uppercase tracking-widest">Risco Associado</p>
                              <p className="text-xs text-error/70 font-medium">{rec.risk}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-surface-container-high rounded-3xl p-8 border border-on-surface-variant/5 space-y-6">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/40 text-center">Indicadores Chave (KPIs)</h5>
                    <div className="space-y-4">
                      {reportSummary?.kpis?.map((kpi: any, i: number) => (
                        <div key={i} className="flex justify-between items-end pb-3 border-b border-on-surface-variant/5">
                          <span className="text-xs font-bold text-secondary/60 uppercase tracking-wider">{kpi.label}</span>
                          <span className="text-xl font-black text-on-surface font-headline">{kpi.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4">
                      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                        <p className="text-[9px] text-primary font-black uppercase tracking-widest mb-1">Score de Performance</p>
                        <p className="text-3xl font-black text-primary font-headline">8.4</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-gradient-to-br from-surface-container-high to-background border border-on-surface-variant/5">
                    <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-widest mb-4">Próximos Passos</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-[11px] text-on-surface/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Apresentação para o conselho
                      </li>
                      <li className="flex items-center gap-3 text-[11px] text-on-surface/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                        Ajuste de metas Q3
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="flex-1 bg-surface-container-high rounded-2xl p-6 border border-on-surface-variant/5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-secondary" />
                  <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-secondary">Governança de Dados</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface/60">Integridade</span>
                    <span className="text-on-surface font-bold">100%</span>
                  </div>
                  <div className="w-full bg-background h-1.5 rounded-full">
                    <div className="bg-secondary h-full rounded-full" style={{ width: "100%" }}></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface/60">Conformidade</span>
                    <span className="text-on-surface font-bold">Validada</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-surface-container-high rounded-2xl p-6 relative overflow-hidden border border-on-surface-variant/5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-tertiary" />
                  <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-tertiary">Índice de Desempenho</h3>
                </div>
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="text-lg font-black font-headline text-tertiary">
                      {dbMetrics || metrics ? "75%" : "0%"}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-center text-on-surface/40 uppercase tracking-widest">Status: {dbMetrics || metrics ? "Ideal" : "Sem Dados"}</p>
              </div>
            </div>
          </div>
        </>
      )}

      <footer className="py-8 text-center border-t border-on-surface-variant/10">
        <p className="text-[11px] text-secondary/30 uppercase tracking-[0.3em] font-medium">
          © 2026 RJT NEXUS360 by RJT Consultoria — Governança Executiva e Inteligência de Negócio
        </p>
      </footer>
    </div>
  );
}
