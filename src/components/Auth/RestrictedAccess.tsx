import { ShieldAlert } from "lucide-react";

export function RestrictedAccess() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-2xl border border-on-surface-variant/10 bg-surface-container-high p-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="font-headline text-2xl font-black text-on-surface">
          Acesso restrito
        </h2>
        <p className="mt-3 text-sm font-medium leading-6 text-secondary/70">
          Seu perfil nao possui permissao para acessar este modulo.
        </p>
      </div>
    </div>
  );
}
