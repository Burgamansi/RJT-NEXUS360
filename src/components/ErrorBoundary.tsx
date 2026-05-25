import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  declare props: Readonly<Props>;

  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-6 animate-in fade-in duration-700">
          <div className="p-4 bg-error/10 rounded-full">
            <AlertCircle className="w-12 h-12 text-error" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Ops! Algo deu errado.</h2>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              Ocorreu um erro ao renderizar este componente. Isso pode ser devido a uma falha na conexão ou dados inconsistentes.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary/80 transition-all uppercase tracking-widest text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            Recarregar Aplicativo
          </button>
          {process.env.NODE_ENV !== "production" && (
            <pre className="mt-8 p-4 bg-surface-container-high rounded-xl text-left text-[10px] text-error overflow-auto max-w-full">
              {this.state.error?.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
