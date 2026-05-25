import React from "react";
import { TrendingUp, Users, Package, DollarSign, ChevronRight, TrendingDown } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell,
} from "recharts";
import { cn } from "../../lib/utils";
import { useExecutiveData } from "../../hooks/useExecutiveData";
import { Skeleton } from "../Skeleton";
import { APP_BRAND, DEFAULT_TENANT_ID } from "../../config/brand";

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ─── KPI Card ────────────────────────────────────────────────────────────────

interface KPICardProps {
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  deltaLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  alert?: boolean;
}

const colorMap: Record<string, { bg: string; text: string }> = {
  "green-500": { bg: "rgba(34,197,94,0.1)", text: "#22c55e" },
  "blue-400": { bg: "rgba(96,165,250,0.1)", text: "#60a5fa" },
  "pink-500": { bg: "rgba(236,72,153,0.1)", text: "#ec4899" },
  "purple-400": { bg: "rgba(192,132,252,0.1)", text: "#c084fc" },
};

function KPICard({ label, value, sub, delta, deltaLabel, icon: Icon, color, alert }: KPICardProps) {
  const up = delta !== undefined && delta >= 0;
  const c = colorMap[color] || { bg: "rgba(255,255,255,0.05)", text: "#94a3b8" };
  return (
    <div className={cn(
      "glass-panel rounded-2xl p-6 border flex flex-col gap-3",
      alert ? "border-red-500/30 bg-red-500/5" : "border-on-surface-variant/5"
    )}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">{label}</span>
        <div className="p-2 rounded-lg" style={{ backgroundColor: c.bg }}>
          <Icon className="w-4 h-4" style={{ color: c.text }} />
        </div>
      </div>
      <p className="text-2xl font-black font-headline text-on-surface leading-none">{value}</p>
      {sub && <p className="text-[10px] text-secondary/50">{sub}</p>}
      {delta !== undefined && (
        <div className={cn("flex items-center gap-1 text-xs font-bold", up ? "text-green-500" : "text-red-500")}>
          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {up ? "+" : ""}{delta.toFixed(1)}% {deltaLabel || "vs mês anterior"}
        </div>
      )}
    </div>
  );
}

// ─── Module Preview Card ──────────────────────────────────────────────────────

interface ModulePreviewProps {
  title: string;
  metric: string;
  metricLabel: string;
  color: string;
  onClick: () => void;
  status?: "ok" | "alert" | "warn";
}

const moduleColorMap: Record<string, string> = {
  "green-500": "#22c55e",
  "blue-400": "#60a5fa",
  "purple-400": "#c084fc",
  "pink-500": "#ec4899",
};

function ModulePreview({ title, metric, metricLabel, color, onClick, status = "ok" }: ModulePreviewProps) {
  const statusColorMap: Record<string, string> = { ok: "#22c55e", alert: "#ef4444", warn: "#f59e0b" };
  const titleColor = moduleColorMap[color] || "#94a3b8";
  const metricColor = statusColorMap[status];
  return (
    <button
      onClick={onClick}
      className="glass-panel rounded-2xl p-5 border border-on-surface-variant/5 hover:border-primary/20 transition-all text-left group flex flex-col gap-3 w-full"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: titleColor }}>{title}</span>
        <ChevronRight className="w-4 h-4 text-secondary/40 group-hover:text-primary transition-colors" />
      </div>
      <p className="text-xl font-black font-headline" style={{ color: metricColor }}>{metric}</p>
      <p className="text-[10px] text-secondary/50">{metricLabel}</p>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ExecutivoDashboardProps {
  onNavigate?: (domain: string) => void;
  companyId?: string;
}

export function ExecutivoDashboard({ onNavigate, companyId = DEFAULT_TENANT_ID }: ExecutivoDashboardProps) {
  const { data, loading, error } = useExecutiveData(companyId);

  if (loading) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-pulse">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-panel h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 glass-panel h-64 rounded-2xl" />
          <div className="col-span-5 glass-panel h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full text-center space-y-4">
        <div className="glass-panel p-12 rounded-3xl border border-error/20 inline-block w-full">
          <p className="text-error font-bold text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-background rounded-xl font-bold uppercase tracking-widest text-xs"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Map dynamic data to legacy variables for compatibility with existing charts
  const history = data.finance?.history || [];
  const periods = [...new Set(history.map((m: any) => m.period))].sort();
  
  const dreData = periods.map(p => {
    const pm = history.filter((m: any) => m.period === p);
    const getVal = (n: string) => pm.find((m: any) => m.metric_name === n)?.metric_value || 0;
    const rev = getVal("faturamento") || getVal("revenue") || 0;
    const cmv = getVal("cmv") || 0;
    const mb = getVal("margemBruta") || (rev - cmv);
    
    return {
      mes: p,
      faturamento: rev,
      cmv: cmv,
      margemBrutaPct: rev > 0 ? (mb / rev) * 100 : 0,
      resultadoLiquido: getVal("resultadoLiquido") || getVal("profit") || 0
    };
  });

  const rhHistory = data.rh?.history || [];
  const rhMensal = periods.map(p => {
    const pm = rhHistory.filter((m: any) => m.period === p);
    return {
      mes: p,
      colaboradores: pm.find((m: any) => m.metric_name === "headcount")?.metric_value || 0,
      turnover: pm.find((m: any) => m.metric_name === "turnover")?.metric_value || 0
    };
  });

  const commHistory = data.commercial?.history || [];
  const commercialMensal = periods.map(p => {
    const pm = commHistory.filter((m: any) => m.period === p);
    return {
      mes: p,
      faturamentoTotal: pm.find((m: any) => m.metric_name === "revenue")?.metric_value || 0,
      volumeTotal: pm.find((m: any) => m.metric_name === "volumeTotal")?.metric_value || 0
    };
  });

  const opsHistory = data.operations?.history || [];
  const producaoMensal = periods.map(p => {
    const pm = opsHistory.filter((m: any) => m.period === p);
    return {
      mes: p,
      bagUB: pm.find((m: any) => m.metric_name === "total_production")?.metric_value || 0,
    };
  });

  // Faturamento acumulado
  const faturamentoAcumulado = dreData.reduce((s, d) => s + d.faturamento, 0);
  // Margem bruta média
  const margemMedia = (dreData.reduce((s, d) => s + d.margemBrutaPct, 0) / (dreData.length || 1));
  // Total colaboradores (último mês)
  const colaboradores = rhMensal.length > 0 ? rhMensal[rhMensal.length - 1].colaboradores : 0;
  // Volume total bags
  const volumeTotalBags = commercialMensal.reduce((s, d) => s + d.volumeTotal, 0);

  // KPI deltas
  const faturamentoDelta = dreData.length >= 2 ? ((dreData[dreData.length-1].faturamento - dreData[dreData.length-2].faturamento) / (dreData[dreData.length-2].faturamento || 1)) * 100 : 0;
  const margemDelta = dreData.length >= 2 ? dreData[dreData.length-1].margemBrutaPct - dreData[dreData.length-2].margemBrutaPct : 0;

  // Line chart data — faturamento mensal
  const faturamentoChartData = dreData.map((d) => ({
    mes: d.mes,
    faturamento: d.faturamento,
    meta: 1300000,
  }));

  // Grouped bar — Receita vs CMV vs Resultado
  const composicaoData = dreData.map((d) => ({
    mes: d.mes,
    Receita: d.faturamento,
    CMV: d.cmv,
    Resultado: d.resultadoLiquido,
  }));

  const customTooltipStyle = {
    backgroundColor: "#0f1e35",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    fontSize: "11px",
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black font-headline text-on-surface tracking-tight">
          Painel Executivo
        </h2>
        <p className="text-[10px] text-secondary/50 uppercase tracking-[0.2em] mt-1">
          {APP_BRAND.productName} — workspace {APP_BRAND.defaultTenantName}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Faturamento Acumulado"
          value={formatBRL(faturamentoAcumulado)}
          sub="Jan + Fev + Mar 2026"
          delta={faturamentoDelta}
          icon={DollarSign}
          color="green-500"
        />
        <KPICard
          label="Margem Bruta Média"
          value={`${margemMedia.toFixed(1)}%`}
          sub="Média dos 3 meses"
          delta={margemDelta}
          icon={TrendingUp}
          color="blue-400"
        />
        <KPICard
          label="Total Colaboradores"
          value={String(colaboradores)}
          sub="Headcount Mar/26"
          icon={Users}
          color="pink-500"
        />
        <KPICard
          label="Volume Total Bags"
          value={volumeTotalBags.toLocaleString("pt-BR")}
          sub="Big Bags Jan + Fev"
          icon={Package}
          color="purple-400"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Line chart: Faturamento */}
        <div className="col-span-12 lg:col-span-7 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-6 uppercase tracking-wider">
            Faturamento Mensal vs Meta
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={faturamentoChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => formatBRL(v)} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="faturamento" stroke="#22c55e" strokeWidth={3} dot={{ fill: "#22c55e", r: 5 }} name="Faturamento" />
              <Line type="monotone" dataKey="meta" stroke="#94a3b8" strokeDasharray="6 3" strokeWidth={2} dot={false} name="Meta R$1.3M" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grouped bar: Receita vs CMV vs Resultado */}
        <div className="col-span-12 lg:col-span-5 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-6 uppercase tracking-wider">
            Receita × CMV × Resultado
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={composicaoData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => formatBRL(v)} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Receita" fill="#22c55e" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
              <Bar dataKey="CMV" fill="#ef4444" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
              <Bar dataKey="Resultado" radius={[4, 4, 0, 0]} fillOpacity={0.85}>
                {composicaoData.map((entry, i) => (
                  <Cell key={i} fill={entry.Resultado >= 0 ? "#16a34a" : "#dc2626"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Module previews */}
      <div>
        <h3 className="font-headline font-bold text-sm text-on-surface mb-4 uppercase tracking-wider">
          Módulos do Sistema
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ModulePreview
            title="Financeiro"
            metric={dreData.length > 1 ? formatBRL(dreData[1].resultadoLiquido) : dreData.length > 0 ? formatBRL(dreData[0].resultadoLiquido) : "R$ 0,00"}
            metricLabel={`Resultado Líquido ${dreData.length > 1 ? dreData[1].mes : "N/A"}`}
            color="green-500"
            status="ok"
            onClick={() => onNavigate?.("finance")}
          />
          <ModulePreview
            title="Comercial"
            metric={commercialMensal.length > 1 ? formatBRL(commercialMensal[1].faturamentoTotal) : commercialMensal.length > 0 ? formatBRL(commercialMensal[0].faturamentoTotal) : "R$ 0,00"}
            metricLabel={`Faturamento Total ${commercialMensal.length > 1 ? commercialMensal[1].mes : "N/A"}`}
            color="blue-400"
            status="ok"
            onClick={() => onNavigate?.("commercial")}
          />
          <ModulePreview
            title="Operações"
            metric={`${(producaoMensal.length > 1 ? producaoMensal[1].bagUB : producaoMensal.length > 0 ? producaoMensal[0].bagUB : 0).toLocaleString("pt-BR")} pçs`}
            metricLabel={`Produção Bag UB ${producaoMensal.length > 1 ? producaoMensal[1].mes : "N/A"}`}
            color="purple-400"
            status="ok"
            onClick={() => onNavigate?.("operations")}
          />
          <ModulePreview
            title="RH"
            metric="19.23%"
            metricLabel="Turnover Mar (meta 6%)"
            color="pink-500"
            status="alert"
            onClick={() => onNavigate?.("rh")}
          />
        </div>
      </div>
    </div>
  );
}
