import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Table, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Settings2, 
  ChevronRight,
  Database,
  FileSpreadsheet
} from "lucide-react";
import { cn } from "../lib/utils";
import { SpreadsheetTemplate, templateService, spreadsheetTemplates } from "../services/template.service";

interface ColumnMapperProps {
  headers: string[];
  detectedDomain: string;
  onConfirm: (mapping: Record<string, string>, domain: string, type: string) => void;
  onCancel: () => void;
}

export function ColumnMapper({ headers, detectedDomain, onConfirm, onCancel }: ColumnMapperProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<SpreadsheetTemplate | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const template = templateService.getTemplateByDomain(detectedDomain) || spreadsheetTemplates[0];
    if (template) {
      setSelectedTemplate(template);
      const initialMapping = templateService.suggestMapping(headers, template);
      setMapping(initialMapping);
    }
  }, [detectedDomain, headers]);

  const handleTemplateChange = (templateId: string) => {
    const template = templateService.getTemplateById(templateId);
    if (template) {
      setSelectedTemplate(template);
      const newMapping = templateService.suggestMapping(headers, template);
      setMapping(newMapping);
    }
  };

  const handleMappingChange = (internalKey: string, fileHeader: string) => {
    setMapping(prev => ({ ...prev, [internalKey]: fileHeader }));
  };

  const isMappingValid = () => {
    if (!selectedTemplate) return false;
    return selectedTemplate.columns
      .filter(c => c.required)
      .every(c => mapping[c.key]);
  };

  if (!selectedTemplate) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-tertiary mx-auto" />
        <h3 className="text-xl font-bold text-on-surface">Domínio Não Reconhecido</h3>
        <p className="text-secondary/60 text-sm">Não conseguimos identificar o modelo de dados automaticamente. Selecione um modelo manualmente.</p>
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={onCancel} className="px-6 py-2 rounded-xl border border-on-surface-variant/10 text-secondary text-xs font-bold uppercase tracking-widest">Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-primary/20 shadow-[0_0_40px_rgba(111,216,200,0.1)]">
      <div className="p-6 border-b border-on-surface-variant/5 bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            <Settings2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black font-headline text-on-surface tracking-tight">Mapeamento de Colunas</h3>
            <p className="text-[10px] text-secondary/60 uppercase tracking-widest font-medium">Confirme a relação entre sua planilha e o sistema</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-highest border border-on-surface-variant/10">
          <FileSpreadsheet className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-on-surface">{selectedTemplate.name}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Seleção de Modelo */}
        <div className="space-y-4">
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Selecionar Modelo de Planilha</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {spreadsheetTemplates.map(t => (
              <button
                key={t.id}
                onClick={() => handleTemplateChange(t.id)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all duration-300",
                  selectedTemplate.id === t.id 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-surface-container-high border-on-surface-variant/5 text-secondary/60 hover:bg-surface-container-highest"
                )}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider">{t.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Campos do Sistema</p>
            <div className="space-y-3">
              {selectedTemplate.columns.map(col => (
                <div key={col.key} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high border border-on-surface-variant/5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">
                      {col.label}
                      {col.required && <span className="text-error ml-1">*</span>}
                    </span>
                    <span className="text-[9px] text-secondary/50 uppercase tracking-tighter">Campo Interno: {col.key}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-secondary/30" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] text-tertiary font-bold uppercase tracking-[0.2em]">Colunas Detectadas</p>
            <div className="space-y-3">
              {selectedTemplate.columns.map(col => (
                <div key={col.key} className="relative">
                  <select
                    value={mapping[col.key] || ""}
                    onChange={(e) => handleMappingChange(col.key, e.target.value)}
                    className={cn(
                      "w-full p-3 rounded-xl bg-surface-container-highest border text-xs font-bold outline-none appearance-none transition-all duration-300",
                      mapping[col.key] 
                        ? "border-primary/30 text-primary" 
                        : col.required 
                          ? "border-error/30 text-error/60" 
                          : "border-on-surface-variant/10 text-secondary/40"
                    )}
                  >
                    <option value="">Selecionar coluna...</option>
                    {headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {mapping[col.key] ? (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-secondary/20" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isMappingValid() && (
          <div className="p-3 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3 text-error text-[10px] font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            Algumas colunas obrigatórias não foram encontradas ou mapeadas.
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4 border-t border-on-surface-variant/5">
          <button 
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-on-surface-variant/10 text-secondary text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(mapping, selectedTemplate.domain, selectedTemplate.type)}
            disabled={!isMappingValid() || isConfirming}
            className="px-8 py-2.5 rounded-xl bg-primary text-background text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(111,216,200,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
          >
            {isConfirming ? "Processando..." : "Confirmar e Processar"}
          </button>
        </div>
      </div>
    </div>
  );
}
