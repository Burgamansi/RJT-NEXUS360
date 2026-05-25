import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Loader2, Building2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { APP_BRAND, DEFAULT_TENANT_ID } from "../../config/brand";

interface LoginProps {
  onSuccess: (user: any) => void;
  onSwitchToRegister: () => void;
  onBackToLanding: () => void;
}

export function Login({ onSuccess, onSwitchToRegister, onBackToLanding }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Simulação de login local
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: "demo_user",
        name: "Usuário Demonstração",
        email: formData.email,
        companyId: DEFAULT_TENANT_ID,
        companyName: APP_BRAND.defaultTenantName,
        role: "admin_master",
        onboardingCompleted: true
      };

      onSuccess(mockUser);
    } catch (err: any) {
      setError("Ocorreu um erro ao processar o login.");
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
            <label className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-surface-container-highest border border-on-surface-variant/10 rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface outline-none focus:border-primary/50 transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

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
                Entrar no RJT NEXUS360
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-secondary/40 text-[10px] font-bold uppercase tracking-widest">
          Não tem uma conta? <button onClick={onSwitchToRegister} className="text-primary hover:underline">Registrar-se</button>
        </p>
      </motion.div>
    </div>
  );
}
