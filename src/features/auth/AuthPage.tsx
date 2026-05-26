import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";

export function AuthPage() {
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-tertiary px-margin-mobile font-body-base text-on-background md:px-margin-desktop">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="auth-gradient absolute inset-0 bg-gradient-to-br from-tertiary via-primary-container to-tertiary opacity-80" />
        <div className="absolute -left-20 top-1/4 h-96 w-96 animate-pulse rounded-full bg-electric-blue/10 blur-[120px]" />
        <div className="absolute -right-20 bottom-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-secondary/5 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full">
        <header className="mb-12 text-center">
          <h1 className="font-display-xl text-[40px] font-bold tracking-tight text-white md:text-display-xl">
            Suite <span className="text-electric-blue">Executiva</span> Inteligente
          </h1>
          <p className="mt-2 font-title-md text-title-md text-outline-variant/60">Acesse o nucleo da sua infraestrutura global.</p>
        </header>

        <section className="glass-panel group relative mx-auto w-full max-w-md overflow-hidden rounded-xl p-10">
          <div className="pointer-events-none absolute -left-1/2 -top-1/2 h-full w-full bg-gradient-to-br from-white/10 to-transparent opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-30" />
          <form className="relative z-10 space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <AuthField icon="person" label="Identificador Corporativo" placeholder="ex: diretor.executivo@rjt.global" />
              <AuthField icon="lock" label="Chave de Seguranca" placeholder="••••••••••••" type="password" action="Esqueceu a chave?" />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <MaterialIcon name="hub" className="text-electric-blue" />
                <div>
                  <p className="text-[12px] font-bold leading-none text-white">Núcleo RJT Nexus</p>
                  <p className="mt-1 text-[10px] leading-none text-outline-variant">Ambiente Padrao</p>
                </div>
              </div>
              <button className="rounded border border-electric-blue/30 px-2 py-1 font-label-caps text-[10px] text-electric-blue transition-all hover:bg-electric-blue/10" type="button">
                Alterar
              </button>
            </div>

            <button
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-electric-blue py-5 font-label-caps text-tertiary transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-95"
              type="submit"
            >
              <span>ACESSO AUTORIZADO</span>
              <MaterialIcon name="arrow_forward" />
            </button>
          </form>

          <div className="mt-8 flex justify-center border-t border-white/10 pt-8">
            <button className="flex items-center gap-2 text-outline-variant transition-colors hover:text-white">
              <MaterialIcon name="verified_user" className="text-[18px]" />
              <span className="font-label-caps text-[11px]">Utilizar Hardware Security Key (FIDO2)</span>
            </button>
          </div>
        </section>

        <footer className="mx-auto mt-12 flex w-full max-w-4xl flex-col items-center justify-between gap-8 opacity-60 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="pulse-ring h-2 w-2 rounded-full bg-status-success" />
              <span className="font-data-mono text-[10px] tracking-widest text-white">ENCRYPTED END-TO-END</span>
            </div>
            <div className="flex items-center gap-2">
              <MaterialIcon name="shield" className="text-sm text-white/50" />
              <span className="font-data-mono text-[10px] tracking-widest text-white">ISO 27001 COMPLIANT</span>
            </div>
          </div>
          <span className="font-label-caps text-[10px] text-outline-variant">© 2024 RJT SISTEMAS INDUSTRIAIS</span>
        </footer>
      </div>

      <div className="fixed right-12 top-12 hidden flex-col items-end gap-1 opacity-40 md:flex">
        <span className="font-data-mono text-[10px] uppercase tracking-tight text-white">Latencia do Sistema</span>
        <span className="font-data-mono text-[14px] text-electric-blue">14ms <span className="text-[8px] text-white/50">GLOBAL</span></span>
      </div>
    </main>
  );
}

type AuthFieldProps = {
  icon: string;
  label: string;
  placeholder: string;
  type?: string;
  action?: string;
};

function AuthField({ icon, label, placeholder, type = "text", action }: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <label className="block font-label-caps text-label-caps text-outline-variant">{label}</label>
        {action ? <button className="font-label-caps text-xs text-electric-blue/70 transition-colors hover:text-electric-blue" type="button">{action}</button> : null}
      </div>
      <div className="flex items-center border-b border-white/20 transition-all duration-300 focus-within:border-electric-blue focus-within:shadow-[0_0_20px_rgba(0,240,255,0.15)]">
        <MaterialIcon name={icon} className="mr-3 text-white/40 transition-colors" />
        <input className="w-full border-none bg-transparent px-0 py-4 font-data-mono text-data-mono text-white placeholder:text-white/20 focus:ring-0" placeholder={placeholder} type={type} />
        {type === "password" ? <MaterialIcon name="visibility" className="text-white/40 transition-colors hover:text-white" /> : null}
      </div>
    </div>
  );
}
