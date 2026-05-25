import React from "react";
import { AlertCircle, CheckCircle2, Info, X, RefreshCcw, FileSearch } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export type AlertType = "error" | "warning" | "success" | "info";

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  onClose?: () => void;
  onRetry?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

export function Alert({
  type,
  title,
  message,
  onClose,
  onRetry,
  onAction,
  actionLabel,
  className
}: AlertProps) {
  const icons = {
    error: <AlertCircle className="w-5 h-5 text-error" />,
    warning: <Info className="w-5 h-5 text-tertiary" />,
    success: <CheckCircle2 className="w-5 h-5 text-primary" />,
    info: <FileSearch className="w-5 h-5 text-secondary" />
  };

  const styles = {
    error: "bg-error/10 border-error/20 text-error",
    warning: "bg-tertiary/10 border-tertiary/20 text-tertiary",
    success: "bg-primary/10 border-primary/20 text-primary",
    info: "bg-secondary/10 border-secondary/20 text-secondary"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "relative p-4 rounded-2xl border flex gap-4 items-start shadow-lg backdrop-blur-md",
        styles[type],
        className
      )}
    >
      <div className="mt-0.5">{icons[type]}</div>
      
      <div className="flex-1 space-y-1">
        <h4 className="font-bold text-sm uppercase tracking-widest font-headline">{title}</h4>
        <p className="text-xs opacity-80 leading-relaxed">{message}</p>
        
        {(onRetry || onAction) && (
          <div className="flex gap-4 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
              >
                <RefreshCcw className="w-3 h-3" />
                Tentar Novamente
              </button>
            )}
            {onAction && actionLabel && (
              <button
                onClick={onAction}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
              >
                {actionLabel}
              </button>
            )}
          </div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 opacity-50" />
        </button>
      )}
    </motion.div>
  );
}
