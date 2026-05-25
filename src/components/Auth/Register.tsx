import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Lock, Building2, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { APP_BRAND, DEFAULT_TENANT_ID } from "../../config/brand";

interface RegisterProps {
  onSuccess: (user: any) => void;
  onSwitchToLogin: () => void;
  onBackToLanding: () => void;
}

export function Register({ onSuccess, onSwitchToLogin, onBackToLanding }: RegisterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    try {
      // Simulação de registro local
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: "demo_user",
        name: formData.name,
        email: formData.email,
        companyId: DEFAULT_TENANT_ID,
        companyName: formData.companyName || APP_BRAND.defaultTenantName,
        role: "admin_master",
        onboardingCompleted: true
      };

      onSuccess(mockUser);
    } catch (err: any) {
      setError("Ocorreu um erro ao processar o registro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-8 rounded-3xl border border-on-surface-variant/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <button 
            onClick={onBackToLanding}
            className="absolute top-8 left-8 text-secondary/40 hover:text-primary transition-colors font-black uppercase tracking-widest text-[8px]"
          >
            ← Voltar
          </button>
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-black font-headline text-on-surface tracking-tight">{APP_BRAND.productName}</h1>
          <p className="text-secondary/60 text-sm mt-2">{APP_BRAND.productSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] ml-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-container-highest border border-on-surface-variant/10 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface outline-none focus:border-primary/50 transition-all"
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] ml-1">Email Profissional</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-surface-container-highest border border-on-surface-variant/10 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface outline-none focus:border-primary/50 transition-all"
                placeholder="exemplo@empresa.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] ml-1">Nome da Empresa</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
              <input 
                type="text" 
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-surface-container-highest border border-on-surface-variant/10 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface outline-none focus:border-primary/50 transition-all"
                placeholder="Nome da sua empresa"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-surface-container-highest border border-on-surface-variant/10 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface outline-none focus:border-primary/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] ml-1">Confirmar</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input 
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-surface-container-highest border border-on-surface-variant/10 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface outline-none focus:border-primary/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-error text-[10px] font-bold uppercase tracking-wider bg-error/10 p-3 rounded-lg border border-error/20"
            >
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 shadow-[0_14px_28px_rgba(17,119,200,0.22)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Criar acesso RJT NEXUS360
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-secondary/40 text-[10px] font-bold uppercase tracking-widest">
          Já possui uma conta? <button onClick={onSwitchToLogin} className="text-primary hover:underline">Entrar</button>
        </p>
      </motion.div>
    </div>
  );
}
