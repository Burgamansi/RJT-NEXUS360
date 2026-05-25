import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Target, 
  Upload, 
  ArrowRight, 
  TrendingUp,
  Users,
  Zap,
  Palette,
  Layout
} from "lucide-react";
import { cn } from "../../lib/utils";

interface OnboardingProps {
  user: any;
  onComplete: () => void;
}

export function Onboarding({ user, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [focus, setFocus] = useState<string | null>(null);
  const [companyConfig, setCompanyConfig] = useState({
    systemName: "",
    primaryColor: "#6FD8C8"
  });

  const nextStep = () => setStep(prev => prev + 1);

  const handleComplete = async () => {
    try {
      // Simulação de conclusão de onboarding local
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete();
    } catch (err) {
      console.error("Erro ao completar onboarding", err);
      onComplete();
    }
  };

  const steps = [
    {
      id: 1,
      title: "Bem-vindo à plataforma",
      description: "Estamos felizes em ter você aqui. Vamos configurar seu ambiente em poucos segundos.",
      icon: <Zap className="w-12 h-12 text-primary" />
    },
    {
      id: 2,
      title: "Configure sua empresa",
      description: "Personalize a plataforma com a identidade da sua organização.",
      icon: <Building2 className="w-12 h-12 text-primary" />
    },
    {
      id: 3,
      title: "Escolha seu foco inicial",
      description: "Qual área você deseja otimizar primeiro?",
      icon: <Target className="w-12 h-12 text-primary" />
    },
    {
      id: 4,
      title: "Pronto para decolar",
      description: "Tudo configurado! Agora é só enviar sua primeira planilha para ver a mágica acontecer.",
      icon: <Upload className="w-12 h-12 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(111,216,200,0.05),transparent)] pointer-events-none" />
      
      <motion.div 
        layout
        className="glass-panel w-full max-w-2xl p-12 rounded-[3rem] border border-on-surface-variant/10 shadow-2xl relative"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-surface-container-high overflow-hidden rounded-t-[3rem]">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            className="h-full bg-primary shadow-[0_10px_24px_rgba(17,119,200,0.22)]"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-6 bg-primary/10 rounded-[2rem] mb-4">
                {steps[step - 1].icon}
              </div>
              <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight">
                {steps[step - 1].title}
              </h2>
              <p className="text-secondary/60 max-w-md">
                {steps[step - 1].description}
              </p>
            </div>

            {step === 2 && (
              <div className="space-y-6 max-w-md mx-auto">
                <div className="space-y-2">
                  <label className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] ml-1">Nome do Sistema</label>
                  <div className="relative">
                    <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                    <input 
                      type="text" 
                      value={companyConfig.systemName}
                      onChange={(e) => setCompanyConfig({ ...companyConfig, systemName: e.target.value })}
                      className="w-full bg-surface-container-highest border border-on-surface-variant/10 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface outline-none focus:border-primary/50 transition-all"
                      placeholder="Ex: RJT NEXUS360"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] ml-1">Cor Principal</label>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                      <input 
                        type="text" 
                        value={companyConfig.primaryColor}
                        onChange={(e) => setCompanyConfig({ ...companyConfig, primaryColor: e.target.value })}
                        className="w-full bg-surface-container-highest border border-on-surface-variant/10 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface outline-none focus:border-primary/50 transition-all font-mono"
                      />
                    </div>
                    <input 
                      type="color" 
                      value={companyConfig.primaryColor}
                      onChange={(e) => setCompanyConfig({ ...companyConfig, primaryColor: e.target.value })}
                      className="w-12 h-12 rounded-xl bg-surface-container-highest border border-on-surface-variant/10 cursor-pointer overflow-hidden p-0"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "finance", label: "Financeiro", icon: <TrendingUp className="w-6 h-6" /> },
                  { id: "rh", label: "RH", icon: <Users className="w-6 h-6" /> },
                  { id: "operations", label: "Operações", icon: <Zap className="w-6 h-6" /> }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setFocus(item.id)}
                    className={cn(
                      "p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 group",
                      focus === item.id 
                        ? "bg-primary-container border-primary text-primary shadow-[0_12px_26px_rgba(17,119,200,0.14)]"
                        : "bg-surface-container-high border-on-surface-variant/5 text-secondary/60 hover:bg-surface-container-highest"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-2xl transition-colors",
                      focus === item.id ? "bg-primary/20" : "bg-surface-container-highest group-hover:bg-primary/10"
                    )}>
                      {item.icon}
                    </div>
                    <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-center pt-8">
              <button 
                onClick={step === 4 ? handleComplete : nextStep}
                disabled={step === 3 && !focus}
                className="bg-primary text-white px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 shadow-[0_14px_28px_rgba(17,119,200,0.22)] hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-50"
              >
                {step === 4 ? "Começar Agora" : "Próximo Passo"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex justify-center gap-2">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === step ? "w-8 bg-primary" : "w-1.5 bg-surface-container-high"
              )}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
