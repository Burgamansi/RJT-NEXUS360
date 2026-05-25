import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  CreditCard, 
  Users, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ChevronRight,
  Clock
} from "lucide-react";
import { apiService } from "../../services/api";
import { cn } from "../../lib/utils";
import { Skeleton } from "../Skeleton";

interface PlanInfo {
  planName: string;
  planStatus: string;
  planEndDate: string | null;
  limits: {
    maxUsers: number;
    maxUploads: number;
    features: string[];
  };
  usage: {
    users: number;
    uploads: number;
  };
}

interface PlanDisplayProps {
  companyId: string;
}

export function PlanDisplay({ companyId }: PlanDisplayProps) {
  const [plan, setPlan] = useState<PlanInfo | null>({
    planName: "Enterprise Platinum",
    planStatus: "ativo",
    planEndDate: new Date(Date.now() + 86400000 * 365).toISOString(),
    limits: {
      maxUsers: 100,
      maxUploads: 500,
      features: ["dashboard", "export_pdf", "export_ppt", "audit"]
    },
    usage: {
      users: 12,
      uploads: 45
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await apiService.getPlanInfo(companyId);
        setPlan(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [companyId]);

  if (isLoading && !plan) return (
    <div className="glass-panel p-8 rounded-3xl border border-on-surface-variant/5 space-y-8">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
      <Skeleton className="h-32 rounded-xl" />
    </div>
  );
  if (!plan || !plan.usage || !plan.limits) return null;

  const userProgress = plan.limits.maxUsers > 0 ? (plan.usage.users / plan.limits.maxUsers) * 100 : 0;
  const uploadProgress = plan.limits.maxUploads > 0 ? (plan.usage.uploads / plan.limits.maxUploads) * 100 : 0;

  return (
    <div className="glass-panel p-8 rounded-3xl border border-on-surface-variant/5 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black font-headline text-on-surface tracking-tight">Seu plano atual</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-black text-primary uppercase tracking-tight">{plan.planName}</span>
              <span className={cn(
                "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                plan.planStatus === "ativo" || plan.planStatus === "trial" 
                  ? "bg-primary/10 text-primary border-primary/20" 
                  : "bg-error/10 text-error border-error/20"
              )}>
                {plan.planStatus === "trial" ? "Período de Teste" : plan.planStatus === "ativo" ? "Ativo" : "Vencido"}
              </span>
            </div>
          </div>
        </div>

        {plan.planEndDate && (
          <div className="text-right">
            <div className="flex items-center gap-2 text-secondary/40 mb-1">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Expira em</span>
            </div>
            <p className="text-xs font-black text-on-surface">
              {new Date(plan.planEndDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-secondary/60">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Usuários</span>
            </div>
            <span className="text-xs font-black text-on-surface">
              {plan.usage.users} / {plan.limits.maxUsers}
            </span>
          </div>
          <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(userProgress, 100)}%` }}
              className={cn(
                "h-full transition-all",
                userProgress > 90 ? "bg-error" : "bg-primary"
              )}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-secondary/60">
              <Upload className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Uploads</span>
            </div>
            <span className="text-xs font-black text-on-surface">
              {plan.usage.uploads} / {plan.limits.maxUploads}
            </span>
          </div>
          <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(uploadProgress, 100)}%` }}
              className={cn(
                "h-full transition-all",
                uploadProgress > 90 ? "bg-error" : "bg-primary"
              )}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-on-surface-variant/5 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-secondary/60" />
          <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Data de Vencimento</span>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="date" 
            value={plan.planEndDate ? plan.planEndDate.split('T')[0] : ""}
            onChange={(e) => setPlan({ ...plan, planEndDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
            className="bg-surface-container-highest border border-on-surface-variant/10 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:border-primary/30 transition-all flex-1"
          />
          <p className="text-[10px] text-secondary/40 font-medium max-w-[200px]">
            Defina a data de expiração para controle de renovação automática.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-on-surface-variant/5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-tertiary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Recursos Inclusos</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {plan.limits.features.map(feature => (
            <div key={feature} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-highest rounded-xl border border-on-surface-variant/5">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-on-surface uppercase tracking-tight">
                {feature === "dashboard" ? "Painel de Controle" : 
                 feature === "export_pdf" ? "Exportação PDF" : 
                 feature === "export_ppt" ? "Exportação PPT" : feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 group">
        Fazer Upgrade do Plano
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
