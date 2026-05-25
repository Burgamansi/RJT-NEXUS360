import React, { useState } from "react";
import { X, ArrowUpDown } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
  ComposedChart, ReferenceLine,
} from "recharts";
import { cn } from "../../lib/utils";
import { useDashboardData } from "../../hooks/useDashboardData";
import { Skeleton } from "../Skeleton";
import { DEFAULT_TENANT_ID } from "../../config/brand";

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Static placeholders for detailed charts not currently in API
const rankingClientes = [
  { nome: "Elfusa", valor: 854698 },
  { nome: "Mineração Curimbaba", valor: 770948 },
  { nome: "Mineração Jundu", valor: 329543 },
  { nome: "Castrolanda", valor: 123200 },
  { nome: "Comil", valor: 113530 },
];

const margemVenda = [
  { faixa: "0-10%", valor: 150000, pct: 12 },
  { faixa: "10-20%", valor: 450000, pct: 35 },
  { faixa: "20-30%", valor: 380000, pct: 30 },
  { faixa: ">30%", valor: 280000, pct: 23 },
];

const tiposProduto = [
  { tipo: "Big Bag UB", valor: 1200000 },
  { tipo: "Big Bag Terceiros", valor: 450000 },
  { tipo: "Acessórios", valor: 80000 },
];

const periodicidade = [
  { tipo: "Mensal", pct: 65 },
  { tipo: "Eventual", pct: 35 },
];

const faccionistas = [
  { nome: "Facc. A", valor: 125000 },
  { nome: "Facc. B", valor: 98000 },
  { nome: "Facc. C", valor: 45000 },
];

const tooltipStyle = {
  backgroundColor: "#0f1e35",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  fontSize: "11px",
};

const PIE_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899", "#64748b"];

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPIBadge({ label, value, meta, metaLabel }: { label: string; value: string; meta?: string; metaLabel?: string }) {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-on-surface-variant/5 flex flex-col gap-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-secondary/50">{label}</span>
      <p className="text-2xl font-black font-headline text-on-surface">{value}</p>
      {meta && <p className="text-[10px] text-secondary/50">{metaLabel}: <span className="text-amber-400 font-bold">{meta}</span></p>}
    </div>
  );
}

// ─── Drill-down for ranking ───────────────────────────────────────────────────

const clienteDetail: Record<string, { jan?: number; fev?: number; descricao: string }> = {
  "Elfusa": { jan: 410000, fev: 444698, descricao: "Cliente premium — refratários" },
  "Mineração Curimbaba": { jan: 390000, fev: 380948, descricao: "Mineração de feldspato" },
  "Mineração Jundu": { jan: 170000, fev: 159543, descricao: "Areia industrial" },
  "Castrolanda": { jan: 63000, fev: 60200, descricao: "Cooperativa agroindustrial" },
  "Comil": { jan: 58000, fev: 55530, descricao: "Ônibus — embalagens especiais" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface ComercialModuleProps {
  companyId?: string;
  period?: string;
}

export function ComercialModule({ companyId = DEFAULT_TENANT_ID, period = "2026-03" }: ComercialModuleProps) {
  const { data: dbData, loading, error } = useDashboardData("commercial", period, companyId);
  const [drilldownCliente, setDrilldownCliente] = useState<string | null>(null);
  const [sortDesc, setSortDesc] = useState(true);

  if (loading) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-pulse">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="glass-panel h-24 rounded-2xl" />)}
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
      <div className="p-8 max-w-7xl mx-auto w-full text-center">
        <div className="glass-panel p-12 rounded-2xl border border-error/20 inline-block w-full">
          <p className="text-error font-bold">{error}</p>
        </div>
      </div>
    );
  }

  // Map backend history to comercialMensal format
  const periods = [...new Set(dbData.map(m => m.period))].sort();
  const comercialMensal = periods.map(p => {
    const pm = dbData.filter(m => m.period === p);
    const getVal = (n: string) => pm.find(m => m.metric_name === n)?.metric_value || 0;
    
    return {
      mes: p,
      faturamentoTotal: getVal("revenue"),
      faturamentoUB: getVal("revenue") * 0.7,
      volumeTotal: getVal("sales_count"),
      volumeUB: getVal("sales_count") * 0.7,
      volumeTerceiros: getVal("sales_count") * 0.3,
      ticketMedio: getVal("avg_ticket"),
      ticketMeta: 3500
    };
  });

  if (comercialMensal.length === 0) return <div>Nenhum dado comercial encontrado.</div>;

  const fev = comercialMensal[comercialMensal.length - 1];
  const sortedClientes = [...rankingClientes].sort((a, b) => sortDesc ? b.valor - a.valor : a.valor - b.valor);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div>
        <h2 className="text-4xl font-black font-headline text-on-surface tracking-tight">Comercial</h2>
        <p className="text-[10px] text-secondary/50 uppercase tracking-[0.2em] mt-1">
          Vendas, Volume e Clientes — Jan / Fev 2026
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPIBadge label="Faturamento Fev" value={formatBRL(fev.faturamentoTotal)} />
        <KPIBadge label="Volume Total Fev" value={`${fev.volumeTotal.toLocaleString("pt-BR")} Big Bags`} />
        <KPIBadge
          label="Ticket Médio Fev"
          value={`R$ ${fev.ticketMedio.toFixed(2)}`}
          meta={`R$ ${fev.ticketMeta}`}
          metaLabel="Meta"
        />
      </div>

      {/* Volume + Faturamento charts */}
      <div className="grid grid-cols-12 gap-6">
        {/* Volume Line */}
        <div className="col-span-12 lg:col-span-7 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-5 uppercase tracking-wider">
            Volume Big Bags por Mês
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={comercialMensal}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="volumeUB" name="UB" fill="#3b82f6" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
              <Bar dataKey="volumeTerceiros" name="Terceiros" fill="#a855f7" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="volumeTotal" name="Total" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Faturamento R$ Grouped Bar */}
        <div className="col-span-12 lg:col-span-5 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-5 uppercase tracking-wider">
            Faturamento R$
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={comercialMensal}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatBRL(v)} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="faturamentoUB" name="Big Bags UB" fill="#3b82f6" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
              <Bar dataKey="faturamentoTotal" name="Total UB" fill="#22c55e" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking Clientes */}
      <div className="glass-panel rounded-2xl border border-on-surface-variant/5 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-wider">
            Ranking de Clientes (Jan+Fev acumulado)
          </h3>
          <button
            onClick={() => setSortDesc((p) => !p)}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortDesc ? "Maior → Menor" : "Menor → Maior"}
          </button>
        </div>
        <div className="space-y-2">
          {sortedClientes.map((c, i) => {
            const maxVal = sortedClientes[0].valor;
            const barPct = (c.valor / maxVal) * 100;
            const isActive = drilldownCliente === c.nome;
            return (
              <div key={c.nome}>
                <div
                  onClick={() => setDrilldownCliente(isActive ? null : c.nome)}
                  className={cn(
                    "flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-colors",
                    isActive ? "bg-blue-500/10" : "hover:bg-white/5"
                  )}
                >
                  <span className="text-[10px] font-black text-secondary/40 w-5 text-right">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-on-surface/80">{c.nome}</span>
                      <span className="text-xs font-black text-blue-400 tabular-nums">{formatBRL(c.valor)}</span>
                    </div>
                    <div className="h-1.5 bg-on-surface-variant/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                </div>
                {isActive && clienteDetail[c.nome] && (
                  <div className="ml-8 mt-1 mb-2 glass-panel rounded-xl p-4 border border-blue-500/20 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-secondary/70">{clienteDetail[c.nome].descricao}</span>
                      <button onClick={() => setDrilldownCliente(null)}><X className="w-3 h-3 text-secondary/40" /></button>
                    </div>
                    <div className="flex gap-6">
                      {clienteDetail[c.nome].jan && (
                        <div><p className="text-[10px] text-secondary/40 uppercase tracking-wider">Jan</p><p className="font-bold text-on-surface">{formatBRL(clienteDetail[c.nome].jan!)}</p></div>
                      )}
                      {clienteDetail[c.nome].fev && (
                        <div><p className="text-[10px] text-secondary/40 uppercase tracking-wider">Fev</p><p className="font-bold text-on-surface">{formatBRL(clienteDetail[c.nome].fev!)}</p></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Margem de Venda */}
        <div className="glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <h3 className="font-headline font-bold text-xs text-on-surface mb-4 uppercase tracking-wider">
            Margem de Venda (Fev)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={margemVenda} dataKey="valor" nameKey="faixa" cx="50%" cy="50%" outerRadius={70} label={({ faixa, pct }) => `${faixa} ${pct}%`} labelLine={false}>
                {margemVenda.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatBRL(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tipos de Produto */}
        <div className="glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <h3 className="font-headline font-bold text-xs text-on-surface mb-4 uppercase tracking-wider">
            Tipos de Produto (acumulado)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={tiposProduto} dataKey="valor" nameKey="tipo" cx="50%" cy="50%" outerRadius={70} label={({ tipo }) => tipo} labelLine={false}>
                {tiposProduto.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatBRL(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Periodicidade */}
        <div className="glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <h3 className="font-headline font-bold text-xs text-on-surface mb-4 uppercase tracking-wider">
            Periodicidade de Compra
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={periodicidade} dataKey="pct" nameKey="tipo" cx="50%" cy="50%" outerRadius={70} label={({ tipo, pct }) => `${tipo} ${pct}%`} labelLine={false}>
                {periodicidade.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Faccionistas */}
      <div className="glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
        <h3 className="font-headline font-bold text-sm text-on-surface mb-5 uppercase tracking-wider">
          Faccionistas / Terceiros — Faturamento Acumulado
        </h3>
        <div className="space-y-3">
          {faccionistas.map((f) => {
            const maxVal = faccionistas[0].valor;
            const barPct = (f.valor / maxVal) * 100;
            return (
              <div key={f.nome} className="flex items-center gap-3">
                <span className="text-xs font-bold text-secondary/70 w-20 text-right">{f.nome}</span>
                <div className="flex-1 h-2 bg-on-surface-variant/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500 transition-all duration-500" style={{ width: `${barPct}%` }} />
                </div>
                <span className="text-xs font-black text-purple-400 tabular-nums w-28 text-right">{formatBRL(f.valor)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
