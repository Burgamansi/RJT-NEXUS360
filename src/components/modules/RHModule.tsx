import React, { useState } from "react";
import { AlertTriangle, BookOpen, Users, Clock, TrendingUp } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ComposedChart, Area,
  ReferenceLine,
} from "recharts";
import { cn } from "../../lib/utils";
import { useDashboardData } from "../../hooks/useDashboardData";
import { Skeleton } from "../Skeleton";
import { DEFAULT_TENANT_ID } from "../../config/brand";

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const tooltipStyle = {
  backgroundColor: "#0f1e35",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  fontSize: "11px",
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({
  label, value, sub, alert, icon
}: {
  label: string; value: string; sub?: string; alert?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className={cn(
      "glass-panel rounded-2xl p-5 border flex flex-col gap-2",
      alert ? "border-red-500/40 bg-red-500/5" : "border-on-surface-variant/5"
    )}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-secondary/40">{icon}</span>}
        <span className="text-[10px] font-black uppercase tracking-widest text-secondary/50">{label}</span>
        {alert && <AlertTriangle className="w-3 h-3 text-red-500 ml-auto" />}
      </div>
      <p className={cn("text-2xl font-black font-headline", alert ? "text-red-400" : "text-on-surface")}>{value}</p>
      {sub && <p className="text-[10px] text-secondary/50">{sub}</p>}
    </div>
  );
}

// ─── Section title ─────────────────────────────────────────────────────────────

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-primary/60">{icon}</span>
      <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-wider">{title}</h3>
    </div>
  );
}

interface RHModuleProps {
  companyId?: string;
  period?: string;
}

export function RHModule({ companyId = DEFAULT_TENANT_ID, period = "2026-03" }: RHModuleProps) {
  // RH always loads full history (all periods) for trend charts
  const { data: dbData, loading, error } = useDashboardData("rh", "", companyId);
  const [showTurnoverDrill, setShowTurnoverDrill] = useState(false);
  const [funilMes, setFunilMes] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-pulse">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="glass-panel h-24 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-12 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="col-span-6 glass-panel h-56 rounded-2xl" />)}
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

  // ─── Map db metrics to monthly rows ────────────────────────────────────────
  const periods = [...new Set(dbData.map(m => String(m.period ?? "")))].filter(Boolean).sort();
  const rhMensal = periods.map(p => {
    const pm = dbData.filter(m => m.period === p);
    const g = (n: string) => pm.find(m => m.metric_name === n)?.metric_value ?? 0;
    return {
      mes:                        p,
      colaboradores:              g("headcount"),
      horasTrabalhadas:           g("horas_trabalhadas"),
      contratacoes:               g("contratacoes"),
      demissoes:                  g("demissoes"),
      turnover:                   g("turnover"),
      absenteismo:                g("absenteeism_rate"),
      absenteismoJustif:          g("absenteismo_justificados_pct"),
      absenteismoNaoJustif:       g("absenteismo_nao_justif_pct"),
      absenteismoAtrasos:         g("absenteismo_atrasos_pct"),
      heHoras:                    g("he_horas"),
      hePct:                      g("he_pct"),
      heValor:                    g("he_valor"),
      faturamento:                g("faturamento_rh"),
      costureiras:                g("costureiras"),
      produtividadeGeral:         g("produtividade_geral"),
      produtividadeCostureiras:   g("produtividade_costureiras"),
      treinados:                  g("treinados"),
      horasTreinamento:           g("horas_treinamento"),
      treinamentoPct:             g("treinamento_pct"),
      dispensados:                g("dispensados"),
      solicitaramDesl:            g("solicitaram_desl"),
      acordo:                     g("acordo"),
      funilContatados:            g("funil_contatados"),
      funilSemResposta:           g("funil_sem_resposta"),
      funilAgendados:             g("funil_agendados"),
      funilNaoCompareceu:         g("funil_nao_compareceu"),
      funilDesistiram:            g("funil_desistiram"),
      funilReprovados:            g("funil_reprovados"),
      funilApRestricao:           g("funil_ap_restricao"),
      funilAprovados:             g("funil_aprovados"),
      funilNaoEfetivados:         g("funil_nao_efetivados"),
      funilEfetivados:            g("funil_efetivados"),
      efetivadosPct:              g("efetivados_pct"),
    };
  });

  if (rhMensal.length === 0) return <div className="p-8 text-secondary/50">Nenhum dado de RH encontrado.</div>;

  const lastMes = rhMensal[rhMensal.length - 1];
  const prevMes = rhMensal.length > 1 ? rhMensal[rhMensal.length - 2] : lastMes;

  // ─── Chart datasets ─────────────────────────────────────────────────────────
  const turnoverData = rhMensal.map(d => ({ mes: d.mes, Turnover: d.turnover, Meta: 6 }));

  const headcountData = rhMensal.map(d => ({
    mes: d.mes,
    Colaboradores: d.colaboradores,
    Contratações: d.contratacoes,
    Demissões: d.demissoes,
  }));

  const absenteismoData = rhMensal.map(d => ({
    mes: d.mes,
    Justificados: d.absenteismoJustif,
    "Não Justif.": d.absenteismoNaoJustif,
    Atrasos: d.absenteismoAtrasos,
    Meta: 5,
  }));

  const heData = rhMensal.map(d => ({
    mes: d.mes,
    "HE/HT %": d.hePct,
    "HE (hrs)": d.heHoras,
    Meta: 2.7,
  }));

  const produtividadeData = rhMensal
    .filter(d => d.produtividadeGeral > 0)
    .map(d => ({
      mes: d.mes,
      "R$/Colaborador": d.produtividadeGeral,
      "R$/Costureira": d.produtividadeCostureiras,
    }));

  const treinamentoData = rhMensal.map(d => ({
    mes: d.mes,
    Treinados: d.treinados,
    "Horas Trein.": d.horasTreinamento,
    "% HT": d.treinamentoPct,
    Meta: 2.0,
  }));

  const desligamentosData = rhMensal.map(d => ({
    mes: d.mes,
    Dispensados: d.dispensados,
    "Solic. Desl.": d.solicitaramDesl,
    Acordo: d.acordo,
  }));

  // ─── Funil selecionado ──────────────────────────────────────────────────────
  const funilPeriods = rhMensal.filter(d => d.funilContatados > 0);
  const activeFunilMes = funilMes ?? (funilPeriods.length > 0 ? funilPeriods[funilPeriods.length - 1].mes : null);
  const funilRow = rhMensal.find(d => d.mes === activeFunilMes) ?? lastMes;

  const funilStages = [
    { label: "Contatados",           qtd: funilRow.funilContatados,     tipo: "entrada" },
    { label: "Sem Resposta/Interest.", qtd: funilRow.funilSemResposta,   tipo: "saida" },
    { label: "Entrevistas Agendadas", qtd: funilRow.funilAgendados,      tipo: "avanco" },
    { label: "Não Compareceu",        qtd: funilRow.funilNaoCompareceu,  tipo: "saida" },
    { label: "Desistiram da Vaga",    qtd: funilRow.funilDesistiram,     tipo: "saida" },
    { label: "Reprovados",            qtd: funilRow.funilReprovados,     tipo: "saida" },
    { label: "Aprov. c/ Restrição",   qtd: funilRow.funilApRestricao,    tipo: "avanco" },
    { label: "Aprovados",             qtd: funilRow.funilAprovados,      tipo: "avanco" },
    { label: "Não Efetivados",        qtd: funilRow.funilNaoEfetivados,  tipo: "saida" },
    { label: "Efetivados",            qtd: funilRow.funilEfetivados,     tipo: "meta" },
  ];

  const ytdTreinados = rhMensal.reduce((s, d) => s + d.treinados, 0);
  const ytdHeTreinamento = rhMensal.reduce((s, d) => s + d.horasTreinamento, 0);
  const ytdHE = rhMensal.reduce((s, d) => s + d.heValor, 0);

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto w-full">

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-4xl font-black font-headline text-on-surface tracking-tight">Recursos Humanos</h2>
        <p className="text-[10px] text-secondary/50 uppercase tracking-[0.2em] mt-1">
          Indicadores RH — Jan / Fev / Mar 2026
        </p>
      </div>

      {/* ─── KPIs ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          label="Colaboradores (Mar)"
          value={String(lastMes.colaboradores)}
          sub={`${lastMes.costureiras} costureiras`}
          icon={<Users className="w-3.5 h-3.5" />}
        />
        <KPICard
          label="Turnover Mar"
          value={`${lastMes.turnover}%`}
          sub="Meta: 6%"
          alert={lastMes.turnover > 6}
        />
        <KPICard
          label="Absenteísmo Mar"
          value={`${lastMes.absenteismo}%`}
          sub="Meta: 5%"
          alert={lastMes.absenteismo > 5}
        />
        <KPICard
          label="H. Extras (HE%) Mar"
          value={`${lastMes.hePct}%`}
          sub={`Meta: 2,7% — ${lastMes.heHoras} hrs`}
          alert={lastMes.hePct > 2.7}
          icon={<Clock className="w-3.5 h-3.5" />}
        />
        <KPICard
          label="Treinados (YTD)"
          value={String(ytdTreinados)}
          sub={`${ytdHeTreinamento} horas`}
          icon={<BookOpen className="w-3.5 h-3.5" />}
        />
        <KPICard
          label="Produtividade Fev"
          value={formatBRL(prevMes.produtividadeGeral)}
          sub="R$/colaborador"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
        />
      </div>

      {/* ─── Turnover + Headcount ──────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={<AlertTriangle className="w-4 h-4" />} title="Turnover vs Meta 6%" />
            <button
              onClick={() => setShowTurnoverDrill(p => !p)}
              className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
            >
              {showTurnoverDrill ? "Fechar" : "Desligamentos Mar →"}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={turnoverData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              <ReferenceLine y={6} stroke="#dc2626" strokeDasharray="6 3" label={{ value: "Meta 6%", fill: "#dc2626", fontSize: 9 }} />
              <Line type="monotone" dataKey="Turnover" stroke="#ec4899" strokeWidth={3} dot={{ fill: "#ec4899", r: 5 }} />
              <Line type="monotone" dataKey="Meta" stroke="#94a3b8" strokeDasharray="6 3" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          {showTurnoverDrill && (
            <div className="mt-4 space-y-2 border-t border-on-surface-variant/10 pt-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-3">Desligamentos Mar/26</p>
              {[
                { label: "Dispensados (empresa)", val: lastMes.dispensados, color: "#ef4444" },
                { label: "Solicitaram desligamento", val: lastMes.solicitaramDesl, color: "#f59e0b" },
                { label: "Acordo", val: lastMes.acordo, color: "#8b5cf6" },
              ].map(row => {
                const total = lastMes.dispensados + lastMes.solicitaramDesl + lastMes.acordo || 1;
                return (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="text-xs text-secondary/70 w-40">{row.label}</span>
                    <div className="flex-1 h-2 bg-on-surface-variant/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(row.val / total) * 100}%`, backgroundColor: row.color }} />
                    </div>
                    <span className="text-xs font-black w-5 text-right" style={{ color: row.color }}>{row.val}</span>
                  </div>
                );
              })}
              <p className="text-[10px] text-secondary/40 mt-1">Total: {lastMes.demissoes} desligamentos</p>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-6 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <SectionTitle icon={<Users className="w-4 h-4" />} title="Headcount — Contratações e Demissões" />
          <ResponsiveContainer width="100%" height={190}>
            <ComposedChart data={headcountData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="Colaboradores" fill="#ec4899" fillOpacity={0.1} stroke="#ec4899" strokeWidth={2} />
              <Bar dataKey="Contratações" fill="#22c55e" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Demissões" fill="#ef4444" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Absenteísmo breakdown + HE + Produtividade ────────────────────── */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <SectionTitle icon={<AlertTriangle className="w-4 h-4" />} title="Absenteísmo vs Meta 5%" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={absenteismoData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v.toFixed(2)}%`} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
              <ReferenceLine y={5} stroke="#94a3b8" strokeDasharray="6 3" label={{ value: "Meta 5%", fill: "#94a3b8", fontSize: 9 }} />
              <Bar dataKey="Justificados" stackId="a" fill="#f59e0b" fillOpacity={0.85} />
              <Bar dataKey="Não Justif." stackId="a" fill="#ef4444" fillOpacity={0.85} />
              <Bar dataKey="Atrasos" stackId="a" fill="#8b5cf6" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-12 lg:col-span-4 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <SectionTitle icon={<Clock className="w-4 h-4" />} title="Horas Extras vs Meta 2,7%" />
          <ResponsiveContainer width="100%" height={130}>
            <ComposedChart data={heData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => n === "HE (hrs)" ? `${v} hrs` : `${v}%`} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
              <Bar dataKey="HE/HT %" fill="#3b82f6" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="Meta" stroke="#94a3b8" strokeDasharray="6 3" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-4 border-t border-on-surface-variant/10 pt-3">
            {rhMensal.map(d => (
              <div key={d.mes} className="flex-1 text-center">
                <p className="text-[9px] text-secondary/40 uppercase">{String(d.mes).slice(5)}</p>
                <p className="text-xs font-black text-blue-400">{d.heHoras} hrs</p>
                <p className="text-[9px] text-secondary/40">{formatBRL(d.heValor)}</p>
              </div>
            ))}
            <div className="flex-1 text-center border-l border-on-surface-variant/10">
              <p className="text-[9px] text-secondary/40 uppercase">YTD</p>
              <p className="text-xs font-black text-blue-400">{rhMensal.reduce((s, d) => s + d.heHoras, 0)} hrs</p>
              <p className="text-[9px] text-secondary/40">{formatBRL(ytdHE)}</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <SectionTitle icon={<TrendingUp className="w-4 h-4" />} title="Produtividade (R$/pessoa)" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={produtividadeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatBRL(v)} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
              <Bar dataKey="R$/Colaborador" fill="#ec4899" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
              <Bar dataKey="R$/Costureira" fill="#a855f7" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Treinamento ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <SectionTitle icon={<BookOpen className="w-4 h-4" />} title="Treinamento & Desenvolvimento" />
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={treinamentoData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis yAxisId="left" hide />
              <YAxis yAxisId="right" orientation="right" hide />
              <Tooltip contentStyle={tooltipStyle}
                formatter={(v: number, n: string) =>
                  n === "% HT" || n === "Meta" ? `${v.toFixed(2)}%` : String(v)
                }
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
              <Bar yAxisId="left" dataKey="Treinados" fill="#22c55e" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="Horas Trein." fill="#06b6d4" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="% HT" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="Meta" stroke="#94a3b8" strokeDasharray="6 3" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-12 lg:col-span-5 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <SectionTitle icon={<BookOpen className="w-4 h-4" />} title="Treinamento YTD" />
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { label: "Colaboradores treinados", val: String(ytdTreinados), color: "text-green-400" },
              { label: "Horas de treinamento", val: String(ytdHeTreinamento) + " h", color: "text-cyan-400" },
              {
                label: "% horas treinadas / HT",
                val: `${(rhMensal.reduce((s, d) => s + d.treinamentoPct, 0) / rhMensal.length).toFixed(2)}%`,
                color: "text-yellow-400"
              },
            ].map(item => (
              <div key={item.label} className="glass-panel rounded-xl p-4 border border-on-surface-variant/5 text-center">
                <p className={cn("text-xl font-black font-headline", item.color)}>{item.val}</p>
                <p className="text-[9px] text-secondary/40 uppercase mt-1 leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {rhMensal.map(d => (
              <div key={d.mes} className="flex items-center gap-3">
                <span className="text-[10px] text-secondary/50 w-16">{d.mes}</span>
                <div className="flex-1 h-2 bg-on-surface-variant/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500/70"
                    style={{ width: `${Math.min((d.treinamentoPct / 2.5) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-green-400 w-12 text-right">{d.treinamentoPct.toFixed(2)}%</span>
                <span className="text-[10px] text-secondary/30 w-4 text-right">
                  {d.treinamentoPct >= 2.0 ? "✓" : "↓"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-secondary/30 mt-3">Meta: 2,0% horas treinamento / horas trabalhadas</p>
        </div>
      </div>

      {/* ─── Desligamentos breakdown ─────────────────────────────────────────── */}
      <div className="glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
        <SectionTitle icon={<AlertTriangle className="w-4 h-4" />} title="Desligamentos — Motivos por Mês" />
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={desligamentosData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="Dispensados" stackId="a" fill="#ef4444" fillOpacity={0.85} />
            <Bar dataKey="Solic. Desl." stackId="a" fill="#f59e0b" fillOpacity={0.85} />
            <Bar dataKey="Acordo" stackId="a" fill="#8b5cf6" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-6 mt-4 pt-3 border-t border-on-surface-variant/10">
          {rhMensal.map(d => (
            <div key={d.mes} className="flex-1">
              <p className="text-[9px] text-secondary/40 uppercase mb-1">{d.mes}</p>
              <div className="space-y-1">
                <p className="text-[10px]"><span className="text-red-400 font-black">{d.dispensados}</span> <span className="text-secondary/40">dispensados</span></p>
                <p className="text-[10px]"><span className="text-yellow-400 font-black">{d.solicitaramDesl}</span> <span className="text-secondary/40">solicitaram</span></p>
                <p className="text-[10px]"><span className="text-purple-400 font-black">{d.acordo}</span> <span className="text-secondary/40">acordo</span></p>
              </div>
            </div>
          ))}
          <div className="flex-1 border-l border-on-surface-variant/10 pl-4">
            <p className="text-[9px] text-secondary/40 uppercase mb-1">YTD</p>
            <p className="text-[10px]">
              <span className="text-red-400 font-black">{rhMensal.reduce((s, d) => s + d.dispensados, 0)}</span>
              <span className="text-secondary/40"> dispensados</span>
            </p>
            <p className="text-[10px]">
              <span className="text-yellow-400 font-black">{rhMensal.reduce((s, d) => s + d.solicitaramDesl, 0)}</span>
              <span className="text-secondary/40"> solicitaram</span>
            </p>
            <p className="text-[10px]">
              <span className="text-purple-400 font-black">{rhMensal.reduce((s, d) => s + d.acordo, 0)}</span>
              <span className="text-secondary/40"> acordo</span>
            </p>
          </div>
        </div>
      </div>

      {/* ─── Funil de Recrutamento (10 etapas) ──────────────────────────────── */}
      <div className="glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
        <div className="flex items-center justify-between mb-5">
          <SectionTitle icon={<Users className="w-4 h-4" />} title="Funil de Recrutamento — 10 Etapas" />
          <div className="flex gap-2">
            {funilPeriods.map(d => (
              <button
                key={d.mes}
                onClick={() => setFunilMes(d.mes)}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg transition-colors",
                  activeFunilMes === d.mes
                    ? "bg-primary/20 text-primary"
                    : "text-secondary/40 hover:text-secondary/70"
                )}
              >
                {String(d.mes).slice(5)}/26
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
          {funilStages.map((stage, i) => {
            const base = funilRow.funilContatados || 1;
            const barPct = (stage.qtd / base) * 100;
            const color =
              stage.tipo === "meta" ? "#22c55e" :
              stage.tipo === "saida" ? "#ef4444" :
              stage.tipo === "avanco" ? "#3b82f6" : "#ec4899";
            const prev = i > 0 ? funilStages.find((_, j) => {
              for (let k = i - 1; k >= 0; k--) {
                if (funilStages[k].tipo !== "saida") return k === j;
              }
              return j === 0;
            }) : null;
            return (
              <div key={stage.label} className="flex items-center gap-3">
                <span className={cn(
                  "text-[9px] font-black uppercase w-4 text-center",
                  stage.tipo === "saida" ? "text-red-400" :
                  stage.tipo === "meta" ? "text-green-400" : "text-blue-400"
                )}>{i + 1}</span>
                <span className="text-xs text-secondary/70 w-40 truncate">{stage.label}</span>
                <div className="flex-1 h-2.5 bg-on-surface-variant/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(barPct, 100)}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-xs font-black w-8 text-right" style={{ color }}>{stage.qtd}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-on-surface-variant/10 flex flex-wrap gap-6 text-[10px]">
          <div>
            <span className="text-secondary/40">Contatados: </span>
            <span className="font-black text-on-surface">{funilRow.funilContatados}</span>
          </div>
          <div>
            <span className="text-secondary/40">Efetivados: </span>
            <span className="font-black text-green-400">{funilRow.funilEfetivados}</span>
          </div>
          <div>
            <span className="text-secondary/40">Taxa Efetivação: </span>
            <span className={cn("font-black", funilRow.efetivadosPct >= 90 ? "text-green-400" : "text-red-400")}>
              {funilRow.efetivadosPct.toFixed(1)}%
            </span>
            <span className="text-secondary/30"> (Meta: 90%)</span>
          </div>
          <div>
            <span className="text-secondary/40">YTD Efetivados: </span>
            <span className="font-black text-on-surface">{rhMensal.reduce((s, d) => s + d.funilEfetivados, 0)}</span>
            <span className="text-secondary/30"> / 114 contatos</span>
          </div>
        </div>
      </div>

    </div>
  );
}
