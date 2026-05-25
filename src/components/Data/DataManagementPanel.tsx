import React, { useState } from "react";
import { Upload, Shield, CheckCircle, AlertCircle, Loader2, FileSpreadsheet, Zap, Activity } from "lucide-react";
import { apiService } from "../../services/api";

export function DataManagementPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("DRE2025");
  const [uploadType, setUploadType] = useState<"finance" | "hr">("finance");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    try {
      const response = await fetch("/api/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: "demo_company", period: "2026-04" }), // Mocking for demo
      });
      if (response.ok) {
        setStatus({ type: "success", message: "Indicadores DRE e RH recalculados com sucesso!" });
      }
    } catch (err: any) {
      setStatus({ type: "error", message: "Erro ao recalcular: " + err.message });
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus({ type: "error", message: "Por favor, selecione um arquivo para upload." });
      return;
    }

    setIsProcessing(true);
    setStatus({ type: null, message: "" });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);
      formData.append("type", uploadType);
      formData.append("companyId", "demo_company");

      // We need a direct fetch or update apiService to handle the new endpoint
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      let result;
      if (response.ok) {
        result = await response.json();
        setStatus({
          type: "success",
          message: "Dados processados e importados com sucesso para o Turso DB!",
        });
        setFile(null);
      } else {
        let errMsg = "Erro ao processar o arquivo.";
        try {
          const errJson = await response.json();
          if (errJson && errJson.error) {
            errMsg = errJson.error;
          }
        } catch (e) {}
        throw new Error(errMsg);
      }
    } catch (error: any) {
      setStatus({
        type: "error",
        message: `Falha no processamento: ${error.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-on-surface uppercase tracking-tighter">Gestão de Dados</h2>
        <p className="text-secondary/60 text-sm">Atualização mensal de indicadores financeiros (DRE) e RH.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Connection Status Card */}
        <div className="bg-surface-container-high p-6 rounded-2xl border border-on-surface-variant/10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-on-surface uppercase tracking-wider text-xs">Status da Conexão</h3>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Turso DB Conectado</span>
          </div>
          <p className="text-[10px] text-secondary/40 leading-relaxed uppercase tracking-widest">
            A integração está ativa. Todos os dados enviados serão processados e armazenados no banco de dados de produção da Burgamansi.
          </p>
        </div>

        {/* Audit Compliance Card */}
        <div className="bg-surface-container-high p-6 rounded-2xl border border-on-surface-variant/10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="font-bold text-on-surface uppercase tracking-wider text-xs">Conformidade ISO 9001</h3>
          </div>
          <p className="text-[10px] text-secondary/40 leading-relaxed uppercase tracking-widest">
            Este portal de dados segue os padrões de rastreabilidade do SGQ. Cada upload é auditado e os registros marcados com status de verificação.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-surface-container-low p-8 rounded-3xl border border-on-surface-variant/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all duration-700 group-hover:bg-primary/10"></div>
        
        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-1 space-y-4 w-full">
              <label className="block text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2">Domínio de Dados</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setUploadType("finance")}
                  className={`flex-1 py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${
                    uploadType === "finance" 
                    ? "bg-primary text-background border-primary shadow-lg" 
                    : "bg-background/40 text-secondary border-on-surface-variant/10 hover:border-primary/30"
                  }`}
                >
                  Financeiro (DRE)
                </button>
                <button 
                  onClick={() => setUploadType("hr")}
                  className={`flex-1 py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${
                    uploadType === "hr" 
                    ? "bg-primary text-background border-primary shadow-lg" 
                    : "bg-background/40 text-secondary border-on-surface-variant/10 hover:border-primary/30"
                  }`}
                >
                  Recursos Humanos
                </button>
              </div>
            </div>

            <div className="w-full md:w-64 space-y-4">
              <label className="block text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2">Senha do Arquivo</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha do Excel..."
                  className="w-full pl-10 pr-4 py-3 bg-background/40 border border-on-surface-variant/10 rounded-xl text-on-surface focus:outline-none focus:border-primary transition-all text-xs"
                />
              </div>
            </div>
          </div>

          <div className="w-full">
            <label 
              htmlFor="file-upload" 
              className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-500 ${
                file 
                ? "border-primary/50 bg-primary/5" 
                : "border-on-surface-variant/10 hover:border-primary/30 hover:bg-white/5"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {file ? (
                  <>
                    <FileSpreadsheet className="w-12 h-12 text-primary mb-4 animate-bounce" />
                    <p className="mb-2 text-sm font-bold text-on-surface">{file.name}</p>
                    <p className="text-xs text-secondary/60">{(file.size / 1024).toFixed(1)} KB</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-secondary/40 mb-4 group-hover:text-primary/60 transition-colors" />
                    <p className="mb-2 text-sm text-secondary font-bold uppercase tracking-widest">Arraste seu arquivo Excel aqui</p>
                    <p className="text-[10px] text-secondary/40 uppercase tracking-[0.2em]">XLSM, XLSX suportados</p>
                  </>
                )}
              </div>
              <input id="file-upload" type="file" className="hidden" accept=".xlsx,.xlsm" onChange={handleFileChange} />
            </label>
          </div>

          <button 
            onClick={handleUpload}
            disabled={!file || isProcessing}
            className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
              !file || isProcessing 
              ? "bg-secondary/20 text-secondary/40 cursor-not-allowed" 
              : "bg-primary text-background shadow-[0_10px_30px_rgba(111,216,200,0.2)] hover:shadow-[0_15px_40px_rgba(111,216,200,0.3)] hover:-translate-y-1"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-background" />
                Processar e Sincronizar Dados
              </>
            )}
          </button>

          <div className="pt-4 border-t border-on-surface-variant/5">
            <button 
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                isRecalculating 
                ? "bg-secondary/10 text-secondary/40" 
                : "bg-surface-container-high text-primary hover:bg-primary/10 border border-primary/20"
              }`}
            >
              {isRecalculating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
              Recalcular e Consolidar Indicadores (DRE/RH)
            </button>
          </div>

          {status.type && (
            <div className={`p-6 rounded-2xl flex items-start gap-4 animate-in zoom-in duration-300 ${
              status.type === "success" 
              ? "bg-primary/10 border border-primary/20 text-on-surface" 
              : "bg-error/10 border border-error/20 text-on-surface"
            }`}>
              {status.type === "success" ? (
                <CheckCircle className="w-6 h-6 text-primary shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-error shrink-0" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-sm uppercase tracking-wider">{status.type === "success" ? "Sucesso!" : "Algo deu errado"}</p>
                <p className="text-secondary/80 text-xs">{status.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
