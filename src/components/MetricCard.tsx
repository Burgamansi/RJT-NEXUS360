import React from "react";
import { LucideIcon, ArrowUp } from "lucide-react";
import { cn } from "../lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  subValue: string;
  icon: LucideIcon;
  color: "primary" | "secondary" | "tertiary" | "error";
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({ label, value, subValue, icon: Icon, color, trend }: MetricCardProps) {
  const colorMap = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
    error: "text-error",
  };

  const bgMap = {
    primary: "bg-primary-container",
    secondary: "bg-sky-50",
    tertiary: "bg-cyan-50",
    error: "bg-red-50",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-[0_16px_40px_rgba(22,84,132,0.08)] transition-all duration-300 hover:shadow-[0_22px_48px_rgba(22,84,132,0.12)] hover:-translate-y-0.5 group relative overflow-hidden">
      <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-50 transition-opacity duration-700", bgMap[color])} />
      
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-xl", bgMap[color])}>
          <Icon className={cn("w-5 h-5", colorMap[color])} />
        </div>
        <div className={cn(
          "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-current/10",
          trend === "up" ? "bg-primary/10 text-primary" : trend === "down" ? "bg-error/10 text-error" : "bg-secondary/10 text-secondary"
        )}>
          {trend === "up" ? "Oportunidade" : trend === "down" ? "Crítico" : "Estável"}
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-bold font-headline uppercase tracking-[0.2em] text-secondary/70">{label}</span>
        <div className="text-3xl font-black font-headline text-on-surface tracking-tight">{value}</div>
      </div>

      <div className="mt-4 pt-4 border-t border-sky-100">
        <p className="text-[10px] text-secondary/70 font-medium leading-relaxed">
          {subValue}
        </p>
      </div>
    </div>
  );
}
