import React from "react";
import { motion } from "motion/react";
import { 
  BarChart3, 
  ShieldCheck, 
  FileText, 
  Zap, 
  ChevronRight, 
  Play,
  Layers,
  Target,
  Users
} from "lucide-react";
import { cn } from "../../lib/utils";
import { APP_BRAND } from "../../config/brand";

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onDemo: () => void;
}

export function LandingPage({ onLogin, onRegister, onDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest uppercase font-headline text-primary">{APP_BRAND.productName}</h1>
            <p className="text-[8px] text-secondary/50 font-bold uppercase tracking-[0.3em]">{APP_BRAND.signature}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="text-xs font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors px-4 py-2"
          >
            Entrar
          </button>
          <button 
            onClick={onRegister}
            className="text-xs font-black uppercase tracking-widest bg-primary text-white px-6 py-3 rounded-xl hover:shadow-[0_14px_28px_rgba(17,119,200,0.22)] transition-all"
          >
            Criar Conta
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            {APP_BRAND.productSubtitle}
          </span>
          <h2 className="text-6xl md:text-7xl font-black font-headline tracking-tighter mb-8 leading-[1.1]">
            {APP_BRAND.productName}: transforme planilhas em <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">dashboards, relatórios e decisões executivas.</span>
          </h2>
          <p className="text-secondary/60 text-lg md:text-xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Centralize dados de RH, Financeiro, Comercial, Compras e Operações em um único ambiente inteligente para gestão e performance empresarial.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onRegister}
              className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-[0_18px_36px_rgba(17,119,200,0.24)] transition-all flex items-center justify-center gap-3 group"
            >
              Começar Agora
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onDemo}
              className="w-full sm:w-auto px-10 py-5 bg-surface-container-high text-on-surface rounded-2xl font-black uppercase tracking-widest text-sm border border-on-surface-variant/10 hover:bg-surface-container-highest transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-4 h-4 fill-current" />
              Ver Demonstração
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-32 px-8 bg-surface-container-low/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Layers}
              title="Centralização de Dados"
              description="Importe planilhas de múltiplos departamentos e visualize tudo em um único lugar."
              color="primary"
            />
            <FeatureCard 
              icon={FileText}
              title="Relatórios Executivos"
              description="Gere apresentações profissionais em PDF e PPT com apenas um clique."
              color="secondary"
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Auditoria Total"
              description="Rastreabilidade completa de todas as ações realizadas na plataforma."
              color="tertiary"
            />
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="relative z-10 py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-8">
              A ferramenta definitiva para <br />
              <span className="text-primary">gestão orientada a dados.</span>
            </h3>
            <div className="space-y-6">
              <BenefitItem 
                icon={BarChart3}
                title="Dashboards Dinâmicos"
                text="Visualize KPIs em tempo real com gráficos interativos e filtros avançados."
              />
              <BenefitItem 
                icon={Target}
                title="Análise Preditiva"
                text="Identifique tendências e antecipe problemas antes que eles aconteçam."
              />
              <BenefitItem 
                icon={Users}
                title="Colaboração em Equipe"
                text="Gerencie usuários e permissões por departamento com controle total."
              />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[40px] bg-gradient-to-br from-primary/20 to-tertiary/20 border border-white/5 overflow-hidden p-8">
              <div className="w-full h-full rounded-3xl bg-surface-container-high border border-white/10 shadow-2xl flex items-center justify-center">
                <BarChart3 className="w-32 h-32 text-primary/40 animate-pulse" />
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-8 border-t border-on-surface-variant/5">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-black uppercase tracking-widest text-sm">{APP_BRAND.productName}</span>
          </div>
          <p className="text-secondary/40 text-[10px] font-bold uppercase tracking-widest">
            © 2026 {APP_BRAND.companyName}. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-secondary/40 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Privacidade</a>
            <a href="#" className="text-secondary/40 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
  const colorClasses: any = {
    primary: "text-primary bg-primary/10 border-primary/20",
    secondary: "text-secondary bg-secondary/10 border-secondary/20",
    tertiary: "text-tertiary bg-tertiary/10 border-tertiary/20"
  };

  return (
    <div className="p-10 rounded-[32px] bg-surface-container-high/50 border border-on-surface-variant/5 hover:border-on-surface-variant/10 transition-all group">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border", colorClasses[color])}>
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-xl font-black mb-4 uppercase tracking-tight">{title}</h4>
      <p className="text-secondary/60 text-sm leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}

function BenefitItem({ icon: Icon, title, text }: any) {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center flex-shrink-0 border border-white/5">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h5 className="text-sm font-black uppercase tracking-widest mb-1">{title}</h5>
        <p className="text-secondary/50 text-sm font-medium leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
