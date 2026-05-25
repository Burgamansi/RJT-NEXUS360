import React, { useState } from "react";
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Target } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ComposedChart, LabelList,
  Cell, ReferenceLine,
} from "recharts";
import { cn } from "../../lib/utils";
import { useFinanceData, FINANCE_TARGETS } from "../../hooks/useFinanceData";
import { Skeleton } from "../Skeleton";
import { DEFAULT_TENANT_ID } from "../../config/brand";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const tooltipStyle = {
  backgroundColor: "#0f1e35",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  fontSize: "11px",
};

function pct(a: number, b: number) {
  if (!b) return null;
  return ((a - b) / Math.abs(b)) * 100;
}

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ─── Alert Banner ─────────────────────────────────────────────────────────────

function AlertBanner({ data }: { data: ReturnType<typeof useFinanceData>["data"] }) {
  const latest = data[data.length - 1];
  if (!latest) return null;
  const alerts = [
    latest.alertCMV && {
      label: "CMV CRÍTICO",
      msg: `${latest.cmv_pct.toFixed(1)}% — meta 55% (Δ +${(latest.cmv_pct - FINANCE_TARGETS.cmv_pct).toFixed(1)} p.p.)`,
      color: "border-red-500/40 bg-red-500/5 text-red-400",
    },
    latest.alertEBITDA && {
      label: "EBITDA NEGATIVO",
      msg: `${latest.ebitda_pct.toFixed(1)}% — meta +14% (Δ ${(latest.ebitda_pct - FINANCE_TARGETS.ebitda_pct).toFixed(1)} p.p.)`,
      color: "border-red-500/40 bg-red-500/5 text-red-400",
    },
    latest.alertADM && {
      label: "ADM ACIMA DA META",
      msg: `${latest.adm_pct.toFixed(1)}% — meta 12,5% (Δ +${(latest.adm_pct - FINANCE_TARGETS.adm_pct).toFixed(1)} p.p.)`,
      color: "border-amber-500/40 bg-amber-500/5 text-amber-400",
    },
    latest.alertFaturamento && {
      label: "FATURAMENTO ABAIXO DA META",
      msg: `${fmt(latest.faturamento)} — meta ${fmt(FINANCE_TARGETS.faturamento)}`,
      color: "border-amber-500/40 bg-amber-500/5 text-amber-400",
    },
  ].filter(Boolean) as { label: string; msg: string; color: string }[];

  if (alerts.length === 0) return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-green-500/20 bg-green-500/5">
      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
      <span className="text-xs text-green-400 font-bold">Todos os indicadores dentro das metas</span>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-3">
      {alerts.map((a) => (
        <div key={a.label} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold", a.color)}>
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span className="font-black uppercase tracking-wider">{a.label}</span>
          <span className="font-normal opacity-80">— {a.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── KPI Meta Card ────────────────────────────────────────────────────────────

function MetaCard({
  label, value, meta, metaLabel, isAlert, format = "pct", higherIsBetter = true,
}: {
  label: string; value: number; meta: number; metaLabel: string;
  isAlert: boolean; format?: "pct" | "brl"; higherIsBetter?: boolean;
}) {
  const delta = value - meta;
  const isGood = higherIsBetter ? delta >= 0 : delta <= 0;
  const displayVal = format === "pct" ? `${value.toFixed(1)}%` : fmt(value);
  const displayMeta = format === "pct" ? `${meta}%` : fmt(meta);
  const barPct = format === "pct"
    ? Math.min(Math.abs(value) / (Math.abs(meta) * 1.5) * 100, 100)
    : Math.min((value / (meta * 1.3)) * 100, 100);

  return (
    <div className={cn(
      "glass-panel rounded-2xl p-5 border flex flex-col gap-3",
      isAlert ? "border-red-500/30 bg-red-500/5" : "border-on-surface-variant/5"
    )}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-secondary/50">{label}</span>
        <div className={cn("flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-lg",
          isGood ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
        )}>
          <Target className="w-2.5 h-2.5" />
          {displayMeta}
        </div>
      </div>
      <p className={cn("text-2xl font-black font-headline tabular-nums",
        isAlert ? "text-red-400" : isGood ? "text-green-400" : "text-amber-400"
      )}>{displayVal}</p>
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-on-surface-variant/10 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700",
              isGood ? "bg-green-500" : isAlert ? "bg-red-500" : "bg-amber-500"
            )}
            style={{ width: `${Math.max(barPct, 4)}%` }}
          />
        </div>
        <p className="text-[9px] text-secondary/40">{metaLabel}</p>
      </div>
    </div>
  );
}

// ─── DRE Table ───────────────────────────────────────────────────────────────

interface DRERow {
  label: string;
  key: string;
  isBold?: boolean;
  indent?: boolean;
  isSection?: boolean;
  format?: "brl" | "pct";
  target?: number;
  targetLabel?: string;
  alertFn?: (v: number) => boolean;
}

const dreRows: DRERow[] = [
  { label: "Faturamento Bruto",      key: "faturamento",       isBold: true },
  { label: "  (–) Impostos / Trib.", key: "impostos",          indent: true },
  { label: "  (–) Desp. Vendas",     key: "comissao",          indent: true },
  { label: "Receita Líquida",        key: "receita_liquida",   isBold: true },
  { label: "  (–) CMV",             key: "cmv",               indent: true,
    target: FINANCE_TARGETS.cmv_pct, targetLabel: "meta CMV 55%",
    alertFn: (_, row?: any) => row?.cmv_pct > FINANCE_TARGETS.cmv_pct },
  { label: "  CMV %",               key: "cmv_pct",           indent: true, format: "pct",
    target: FINANCE_TARGETS.cmv_pct, alertFn: (v) => v > FINANCE_TARGETS.cmv_pct },
  { label: "Lucro Bruto",            key: "lucro_bruto",       isBold: true },
  { label: "  Margem Bruta %",       key: "lucro_bruto_pct",   indent: true, format: "pct" },
  { label: "  (–) ADM Total",        key: "adm_total",         indent: true,
    target: FINANCE_TARGETS.adm_pct, targetLabel: "meta ADM 12,5%" },
  { label: "  ADM %",               key: "adm_pct",           indent: true, format: "pct",
    target: FINANCE_TARGETS.adm_pct, alertFn: (v) => v > FINANCE_TARGETS.adm_pct },
  { label: "EBITDA",                 key: "ebitda",            isBold: true,
    target: FINANCE_TARGETS.ebitda_pct, targetLabel: "meta +14%" },
  { label: "  EBITDA %",            key: "ebitda_pct",        indent: true, format: "pct",
    target: FINANCE_TARGETS.ebitda_pct, alertFn: (v) => v < FINANCE_TARGETS.ebitda_pct },
  { label: "  Resultado Financeiro", key: "result_financeiro", indent: true },
  { label: "Resultado Líquido",      key: "resultado_liquido", isBold: true },
];

function getCellColor(key: string, v: number) {
  if (key === "faturamento" || key === "receita_liquida" || key === "lucro_bruto") return v >= 0 ? "text-green-400" : "text-red-400";
  if (key === "ebitda" || key === "resultado_liquido" || key === "result_financeiro") return v >= 0 ? "text-green-400" : "text-red-400";
  if (key === "ebitda_pct") return v >= FINANCE_TARGETS.ebitda_pct ? "text-green-400" : v >= 0 ? "text-amber-400" : "text-red-400";
  if (key === "cmv_pct") return v <= FINANCE_TARGETS.cmv_pct ? "text-green-400" : v <= 65 ? "text-amber-400" : "text-red-400";
  if (key === "adm_pct") return v <= FINANCE_TARGETS.adm_pct ? "text-green-400" : v <= 15 ? "text-amber-400" : "text-red-400";
  if (key === "lucro_bruto_pct") return v >= 30 ? "text-green-400" : v >= 15 ? "text-amber-400" : "text-red-400";
  return "text-on-surface/80";
}

function DRETable({
  data, formatBRL, onRowClick,
}: { data: any[]; formatBRL: (v: number) => string; onRowClick: (key: string) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-on-surface-variant/10">
            <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-secondary/50 w-52">Categoria</th>
            {data.map((d) => (
              <th key={d.mes} className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest text-secondary/50">{d.mes}</th>
            ))}
            <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest text-secondary/50 w-28">
              Var {data.length >= 2 ? `${data[data.length-2].mes}→${data[data.length-1].mes}` : ""}
            </th>
            <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest text-secondary/50 w-24">Meta</th>
          </tr>
        </thead>
        <tbody>
          {dreRows.map((row) => {
            const vals = data.map((d) => {
              const v = d[row.key];
              return typeof v === "number" ? v : 0;
            });
            const variation = data.length >= 2 ? pct(vals[vals.length - 1], vals[vals.length - 2]) : null;
            const lastVal = vals[vals.length - 1];
            const isRowAlert = row.alertFn ? row.alertFn(lastVal) : false;

            return (
              <tr
                key={row.key}
                onClick={() => onRowClick(row.key)}
                className={cn(
                  "border-b border-on-surface-variant/5 cursor-pointer transition-colors hover:bg-primary/5",
                  row.isBold && "bg-surface-container-high/30",
                  isRowAlert && "bg-red-500/5",
                )}
              >
                <td className={cn(
                  "py-2.5 px-4",
                  row.isBold ? "font-black text-on-surface" : "text-secondary/70",
                  row.indent && "pl-7",
                  isRowAlert && "text-red-400"
                )}>
                  <span className="flex items-center gap-1.5">
                    {isRowAlert && <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />}
                    {row.label}
                  </span>
                </td>
                {vals.map((v, i) => (
                  <td key={i} className={cn(
                    "py-2.5 px-4 text-right tabular-nums",
                    getCellColor(row.key, v),
                    row.isBold && "font-bold"
                  )}>
                    {row.format === "pct" ? `${v.toFixed(1)}%` : formatBRL(v)}
                  </td>
                ))}
                <td className={cn(
                  "py-2.5 px-4 text-right tabular-nums font-bold text-xs",
                  variation !== null && variation >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {variation !== null ? (
                    <span className="flex items-center justify-end gap-1">
                      {variation >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {variation >= 0 ? "+" : ""}{variation.toFixed(1)}%
                    </span>
                  ) : "—"}
                </td>
                <td className="py-2.5 px-4 text-right text-[10px] text-secondary/30">
                  {row.target !== undefined ? (
                    <span className={cn(
                      row.format === "pct"
                        ? (row.alertFn?.(lastVal) ? "text-red-400/60" : "text-green-400/60")
                        : "text-secondary/30"
                    )}>
                      {row.format === "pct" ? `${row.target}%` : fmt(row.target)}
                    </span>
                  ) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Drill-down Panel ─────────────────────────────────────────────────────────

const drilldownDetails: Record<string, { label: string; centros: { nome: string; jan: number; fev: number; mar: number }[] }> = {
  cmv: {
    label: "CMV — Composição",
    centros: [
      { nome: "Matéria-prima",       jan: 840000, fev: 1003200, mar: 1220800 },
      { nome: "Embalagens",          jan:  90000, fev:  125400, mar:  183150 },
      { nome: "Mão de obra direta",  jan:  80000, fev:   85500, mar:   91500 },
      { nome: "Energia industrial",  jan:  40000, fev:   39900, mar:   30800 },
    ],
  },
  impostos: {
    label: "Impostos / Tributos",
    centros: [
      { nome: "ICMS",      jan:  97200, fev: 106920, mar: 119880 },
      { nome: "PIS/COFINS",jan:  48600, fev:  53460, mar:  59940 },
      { nome: "ISS",       jan:  16200, fev:  17820, mar:  19980 },
    ],
  },
  adm_total: {
    label: "ADM — Detalhamento",
    centros: [
      { nome: "Folha Adm + Sócios",  jan: 150000, fev: 170000, mar: 200000 },
      { nome: "Financeiro / Juros",  jan:  25000, fev:  35000, mar:  45000 },
      { nome: "Outras despesas",     jan:  25000, fev:  30000, mar:  30000 },
      { nome: "Restaurante",         jan:   5000, fev:   6000, mar:   5500 },
      { nome: "Consultoria",         jan:   3000, fev:   4000, mar:   4000 },
      { nome: "Contabilidade",       jan:   2000, fev:   2500, mar:   2250 },
    ],
  },
};

function DrilldownPanel({ rowKey, data, formatBRL, onClose }: {
  rowKey: string; data: any[]; formatBRL: (v: number) => string; onClose: () => void;
}) {
  const detail = drilldownDetails[rowKey];
  if (!detail) return null;
  return (
    <div className="glass-panel rounded-2xl border border-primary/20 p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-headline font-bold text-sm text-primary uppercase tracking-wider">{detail.label}</h4>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 text-secondary" />
        </button>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-on-surface-variant/10">
            <th className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-widest text-secondary/50">Centro</th>
            {data.map(d => (
              <th key={d.mes} className="text-right py-2 px-3 text-[10px] font-black uppercase tracking-widest text-secondary/50">{d.mes}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {detail.centros.map((c) => {
            const staticVals = [c.jan, c.fev, c.mar];
            return (
              <tr key={c.nome} className="border-b border-on-surface-variant/5">
                <td className="py-2 px-3 text-secondary/80">{c.nome}</td>
                {data.map((_, i) => (
                  <td key={i} className="py-2 px-3 text-right tabular-nums text-on-surface/80">
                    {formatBRL(staticVals[i] ?? staticVals[staticVals.length - 1])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── EBITDA Waterfall ─────────────────────────────────────────────────────────

function EBITDAWaterfall({ d, formatBRL }: { d: any; formatBRL: (v: number) => string }) {
  const steps = [
    { name: "Faturamento",   value: d.faturamento,        running: d.faturamento,        type: "positive" },
    { name: "(–) Tributos",  value: -d.impostos,          running: d.faturamento - d.impostos, type: "negative" },
    { name: "(–) D.Vendas",  value: -d.comissao,          running: d.receita_liquida,    type: "negative" },
    { name: "(–) CMV",       value: -d.cmv,               running: d.receita_liquida - d.cmv, type: d.cmv_pct > 55 ? "alert" : "negative" },
    { name: "(–) ADM",       value: -d.adm_total,         running: d.ebitda,             type: d.adm_pct > 12.5 ? "alert" : "negative" },
    { name: "EBITDA",        value: d.ebitda,             running: d.ebitda,             type: d.ebitda >= 0 ? "result-pos" : "result-neg" },
  ];

  const scale = d.faturamento;
  const barColor = (t: string) =>
    t === "positive" ? "#22c55e" :
    t === "negative" ? "#64748b" :
    t === "alert"    ? "#ef4444" :
    t === "result-pos" ? "#22c55e" : "#ef4444";

  return (
    <div className="space-y-1.5">
      {steps.map((s) => {
        const barW = Math.abs(s.value) / scale * 100;
        const isResult = s.type.startsWith("result");
        return (
          <div key={s.name} className="flex items-center gap-3">
            <span className="text-[10px] text-secondary/60 w-24 text-right shrink-0">{s.name}</span>
            <div className="flex-1 h-5 relative bg-on-surface-variant/5 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-700"
                style={{
                  width: `${Math.max(barW, 1)}%`,
                  backgroundColor: barColor(s.type),
                  opacity: isResult ? 1 : 0.75,
                }}
              />
            </div>
            <span className={cn(
              "text-[10px] font-black w-28 text-right tabular-nums shrink-0",
              s.type === "alert" || s.type === "result-neg" ? "text-red-400" :
              s.type === "result-pos" || s.type === "positive" ? "text-green-400" : "text-secondary/60"
            )}>
              {formatBRL(s.value)}
            </span>
            <span className="text-[9px] text-secondary/30 w-12 text-right shrink-0">
              {(Math.abs(s.value) / scale * 100).toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface FinanceiroModuleProps {
  companyId?: string;
  period?: string;
}

export function FinanceiroModule({ companyId = DEFAULT_TENANT_ID, period }: FinanceiroModuleProps) {
  const { data, loading, error, formatBRL } = useFinanceData(companyId, period);
  const [drilldown, setDrilldown] = useState<string | null>(null);

  const handleRowClick = (key: string) => setDrilldown(p => p === key ? null : key);

  if (loading) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-pulse">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="glass-panel rounded-2xl p-12 text-center border border-error/20">
          <p className="text-error font-bold">{error}</p>
        </div>
      </div>
    );
  }

  if (!data.length) return null;

  const latest = data[data.length - 1];

  // Chart datasets
  const trendData = data.map(d => ({
    mes: d.mes,
    "CMV %": d.cmv_pct,
    "EBITDA %": d.ebitda_pct,
    "ADM %": d.adm_pct,
    "Meta CMV": FINANCE_TARGETS.cmv_pct,
    "Meta EBITDA": FINANCE_TARGETS.ebitda_pct,
  }));

  const stackedData = data.map(d => ({
    mes: d.mes,
    CMV: d.cmv,
    Tributos: d.impostos,
    ADM: d.adm_total,
    "D.Vendas": d.comissao,
    Receita: d.faturamento,
  }));

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div>
        <h2 className="text-4xl font-black font-headline text-on-surface tracking-tight">Financeiro — DRE 2026</h2>
        <p className="text-[10px] text-secondary/50 uppercase tracking-[0.2em] mt-1">
          Demonstrativo de Resultado — {data.map(d => d.mes).join(" / ")} · Metas: CMV 55% | ADM 12,5% | EBITDA 14%
        </p>
      </div>

      {/* Alert Banner */}
      <AlertBanner data={data} />

      {/* KPI Meta Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetaCard
          label={`Faturamento (${latest.mes})`}
          value={latest.faturamento}
          meta={FINANCE_TARGETS.faturamento}
          metaLabel="Meta R$ 1,7M/mês"
          isAlert={latest.alertFaturamento}
          format="brl"
          higherIsBetter
        />
        <MetaCard
          label={`CMV % (${latest.mes})`}
          value={latest.cmv_pct}
          meta={FINANCE_TARGETS.cmv_pct}
          metaLabel="Meta ≤ 55% do fat."
          isAlert={latest.alertCMV}
          format="pct"
          higherIsBetter={false}
        />
        <MetaCard
          label={`ADM % (${latest.mes})`}
          value={latest.adm_pct}
          meta={FINANCE_TARGETS.adm_pct}
          metaLabel="Meta ≤ 12,5% do fat."
          isAlert={latest.alertADM}
          format="pct"
          higherIsBetter={false}
        />
        <MetaCard
          label={`EBITDA % (${latest.mes})`}
          value={latest.ebitda_pct}
          meta={FINANCE_TARGETS.ebitda_pct}
          metaLabel="Meta ≥ 14% do fat."
          isAlert={latest.alertEBITDA}
          format="pct"
          higherIsBetter
        />
      </div>

      {/* DRE Table */}
      <div className="glass-panel rounded-2xl border border-on-surface-variant/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-on-surface-variant/10 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">DRE Estruturado — clique para drill-down</p>
          <span className="text-[10px] text-secondary/30">Fonte: DRE novo / Indicadores</span>
        </div>
        <DRETable data={data} formatBRL={formatBRL} onRowClick={handleRowClick} />
        {drilldown && (
          <div className="px-6 pb-6">
            <DrilldownPanel rowKey={drilldown} data={data} formatBRL={formatBRL} onClose={() => setDrilldown(null)} />
          </div>
        )}
      </div>

      {/* Waterfall + Trend charts */}
      <div className="grid grid-cols-12 gap-6">

        {/* EBITDA Waterfall — mês mais recente */}
        <div className="col-span-12 lg:col-span-5 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-1 uppercase tracking-wider">
            Ponte DRE — {latest.mes}/26
          </h3>
          <p className="text-[10px] text-secondary/40 mb-5">Do faturamento ao EBITDA</p>
          <EBITDAWaterfall d={latest} formatBRL={formatBRL} />
          <div className="mt-5 pt-4 border-t border-on-surface-variant/10 grid grid-cols-3 gap-3 text-center">
            {[
              { l: "Caixa Final", v: fmt(latest.caixa_final), c: "text-blue-400" },
              { l: "Res. Financ.", v: fmt(latest.result_financeiro), c: latest.result_financeiro >= 0 ? "text-green-400" : "text-red-400" },
              { l: "Res. Líquido", v: fmt(latest.resultado_liquido), c: latest.resultado_liquido >= 0 ? "text-green-400" : "text-red-400" },
            ].map(item => (
              <div key={item.l}>
                <p className={cn("text-sm font-black tabular-nums", item.c)}>{item.v}</p>
                <p className="text-[9px] text-secondary/40 mt-0.5">{item.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CMV% / EBITDA% / ADM% trends */}
        <div className="col-span-12 lg:col-span-7 glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-1 uppercase tracking-wider">
            Tendência de Margens vs Metas
          </h3>
          <p className="text-[10px] text-secondary/40 mb-5">% do faturamento bruto</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v.toFixed(1)}%`} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              <ReferenceLine y={FINANCE_TARGETS.cmv_pct}    stroke="#ef4444" strokeDasharray="6 3" label={{ value: "CMV 55%",    fill: "#ef4444",  fontSize: 9 }} />
              <ReferenceLine y={FINANCE_TARGETS.ebitda_pct} stroke="#22c55e" strokeDasharray="6 3" label={{ value: "EBITDA 14%", fill: "#22c55e",  fontSize: 9 }} />
              <ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" />
              <Line type="monotone" dataKey="CMV %"    stroke="#ef4444" strokeWidth={3} dot={{ fill: "#ef4444", r: 5 }} />
              <Line type="monotone" dataKey="EBITDA %" stroke="#22c55e" strokeWidth={3} dot={{ fill: "#22c55e", r: 5 }} />
              <Line type="monotone" dataKey="ADM %"    stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 4 }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Composição de custos vs receita */}
      <div className="glass-panel rounded-2xl p-6 border border-on-surface-variant/5">
        <h3 className="font-headline font-bold text-sm text-on-surface mb-6 uppercase tracking-wider">
          Composição de Custos vs Faturamento
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={stackedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatBRL(v)} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="CMV"      stackId="a" fill="#ef4444" fillOpacity={0.85} />
            <Bar dataKey="Tributos" stackId="a" fill="#f59e0b" fillOpacity={0.85} />
            <Bar dataKey="ADM"      stackId="a" fill="#3b82f6" fillOpacity={0.85} />
            <Bar dataKey="D.Vendas" stackId="a" fill="#a855f7" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="Receita" stroke="#22c55e" strokeWidth={3} dot={{ fill: "#22c55e", r: 5 }} name="Faturamento" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
