import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";

const budgetKpis = [
  { icon: "account_balance", label: "Budget Total", value: "R$ 4.82M", delta: "2026", tone: "text-secondary", border: "border-primary", progress: 76 },
  { icon: "payments", label: "Realizado", value: "R$ 3.94M", delta: "81.7%", tone: "text-status-success", border: "border-secondary", progress: 82 },
  { icon: "sync_alt", label: "Desvio", value: "+R$ 184k", delta: "+3.8%", tone: "text-status-critical", border: "border-status-critical", progress: 38 },
  { icon: "query_stats", label: "Previs?o", value: "R$ 5.06M", delta: "+5.1%", tone: "text-status-critical", border: "border-outline-variant", progress: 84 },
  { icon: "savings", label: "Savings Gap", value: "R$ 126k", delta: "a capturar", tone: "text-secondary", border: "border-secondary-container", progress: 49 },
  { icon: "warning", label: "Budget Alerts", value: "7", delta: "3 críticos", tone: "text-status-critical", border: "border-status-critical", progress: 31 },
];

const budgetTrend = [48, 52, 57, 61, 66, 64, 71, 76, 79, 83, 86, 88];
const actualTrend = [44, 49, 55, 60, 63, 67, 70, 73, 78, 81, 85, 91];
const varianceTrend = [28, 32, 25, 38, 41, 34];

const budgetByArea = [
  ["Financeiro", "R$ 1.42M", 29, "bg-primary"],
  ["Comercial", "R$ 842k", 17, "bg-secondary"],
  ["Compras", "R$ 769k", 16, "bg-secondary-container"],
  ["Operações", "R$ 1.21M", 25, "bg-outline"],
  ["RH", "R$ 584k", 12, "bg-surface-tint"],
] as const;

const areaPerformance = [
  ["Financeiro", "R$ 1.42M", "+R$ 73k", "Over"],
  ["Comercial", "R$ 842k", "+R$ 24k", "Atenção"],
  ["Compras", "R$ 769k", "-R$ 42k", "Under"],
  ["Operações", "R$ 1.21M", "+R$ 96k", "Over"],
  ["RH", "R$ 584k", "+R$ 33k", "Atenção"],
] as const;

const forecastControls = [
  ["Previs?o Accuracy", "92.4%", 92, "bg-status-success"],
  ["Committed Spend", "81.7%", 82, "bg-secondary"],
  ["Unplanned Expense", "R$ 184k", 38, "bg-status-critical"],
  ["Savings Pipeline", "R$ 126k", 49, "bg-primary"],
] as const;

const insights = [
  { icon: "psychology", label: "AI Budget Recommendation", text: "Consolidar alertas de Operações e Financeiro para reduzir o desvio projetado antes do fechamento mensal.", tone: "text-secondary", bg: "bg-secondary-container/10" },
  { icon: "warning", label: "Variance Alert", text: "Operações e Financeiro concentram 91% do excesso orçamentário projetado para o ciclo atual.", tone: "text-status-critical", bg: "bg-erro-container/40" },
  { icon: "monitoring", label: "Previs?o Anomaly", text: "Compras está abaixo do orçamento, mas pode inverter tendência com reposição de matéria-prima Classe A.", tone: "text-status-critical", bg: "bg-status-critical/10" },
  { icon: "stars", label: "Destaque estratégico", text: "Pipeline de economia em compras cobre 68% do desvio comercial previsto.", tone: "text-status-success", bg: "bg-status-success/10" },
];

const budgetLinhas = [
  ["Investimentos", "Financeiro", "R$ 750k", "+R$ 73k", "Over"],
  ["Portal Saint Gobain", "Comercial", "R$ 73k", "+R$ 24k", "Atenção"],
  ["Matéria-prima", "Compras", "R$ 769k", "-R$ 42k", "Under"],
  ["Manutenção Transporte", "Operações", "R$ 214k", "+R$ 38k", "Over"],
  ["Despesas Judiciais", "RH", "R$ 10k", "On track", "Stable"],
] as const;

export function BudgetIntelligencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Intelig?ncia or?ament?ria"
        title="Controle orçamentário e previsão"
        actions={
          <>
            <button className="flex items-center gap-2 rounded-full border border-glass-stroke px-5 py-3 font-label-caps text-label-caps transition-all hover:bg-surface-container-low">
              <MaterialIcon name="calendar_month" className="text-[18px]" />
              ORÇAMENTO 2026
            </button>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-caps text-label-caps text-white shadow-xl transition-all hover:shadow-primary/20">
              <MaterialIcon name="download" className="text-[18px]" />
              Relat?rio or?ament?rio
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-6">
        {budgetKpis.map((kpi) => (
          <GlassCard key={kpi.label} className={`flex min-h-[154px] flex-col justify-between border-l-4 p-5 ${kpi.border}`}>
            <div className="flex items-start justify-between gap-4">
              <MaterialIcon name={kpi.icon} className="text-outline" />
              <span className={`font-data-mono text-xs ${kpi.tone}`}>{kpi.delta}</span>
            </div>
            <div>
              <p className="mb-1 font-label-caps text-[10px] uppercase text-outline">{kpi.label}</p>
              <p className="font-headline-lg text-2xl font-black text-primary">{kpi.value}</p>
            </div>
            <ProgressBar value={kpi.progress} className="bg-secondary" />
          </GlassCard>
        ))}
      </section>

      <section className="mt-gutter grid grid-cols-1 gap-gutter xl:grid-cols-12">
        <GlassCard className="p-8 xl:col-span-8">
          <SectionTitle title="Análise orçamentária" subtitle="Orçado, realizado, forecast e desvios por ciclo" icon="analytics" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ChartHeader title="Budget vs Actual" meta="Evolução mensal consolidada" />
              <DualTrendChart />
            </div>
            <div className="lg:col-span-5">
              <ChartHeader title="Budget by Area" meta="Distribuição orçamentária por módulo" />
              <div className="mt-6 space-y-4">
                {budgetByArea.map(([label, value, percentage, color]) => (
                  <div key={label} className="space-y-2">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="font-medium text-on-surface">{label}</span>
                      <span className="font-data-mono text-outline">{value}</span>
                    </div>
                    <ProgressBar value={percentage} className={color} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-glass-stroke pt-6 md:grid-cols-3">
            <BudgetMetric label="Budget Usage" value="81.7%" note="Realizado no ciclo" />
            <BudgetMetric label="Variance" value="+3.8%" note="Acima do planejado" bordered />
            <BudgetMetric label="Previs?o Risco" value="R$ 184k" note="Desvio projetado" />
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-4">
          <SectionTitle title="Desempenho por ?rea" subtitle="Orçamento por área e status executivo" icon="leaderboard" />
          <div className="mt-7 space-y-4">
            {areaPerformance.map(([name, budget, variance, status]) => (
              <div key={name} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-primary">{name}</span>
                  <span className="font-data-mono text-sm text-primary">{budget}</span>
                </div>
                <div className="flex items-center justify-between font-data-mono text-[11px] text-outline">
                  <span className={variance.startsWith("+") ? "text-status-critical" : "text-status-success"}>{variance}</span>
                  <span>{status}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-7">
          <SectionTitle title="Central de previsão" subtitle="Acurácia, despesas não planejadas e pipeline de economia" icon="query_stats" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <ChartHeader title="Variance Trend" meta="Desvio mensal e pressão de forecast" />
              <VarianceChart />
            </div>
            <div className="space-y-4">
              {forecastControls.map(([label, value, progress, color]) => (
                <div key={label} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-label-caps text-[10px] text-outline">{label}</span>
                    <span className="font-data-mono text-sm font-bold text-primary">{value}</span>
                  </div>
                  <ProgressBar value={progress} className={color} />
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-5">
          <SectionTitle title="Insights executivos" subtitle="Recomendações, alertas e anomalias orçamentárias" icon="tips_and_updates" />
          <div className="mt-7 space-y-4">
            {insights.map((insight) => (
              <div key={insight.label} className={`rounded-lg border border-glass-stroke p-4 ${insight.bg}`}>
                <div className="mb-2 flex items-center gap-3">
                  <MaterialIcon name={insight.icon} className={`text-[20px] ${insight.tone}`} />
                  <span className="font-label-caps text-[10px] text-outline">{insight.label}</span>
                </div>
                <p className="text-sm leading-relaxed text-on-surface-variant">{insight.text}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-12">
          <SectionTitle title="Tabelas orçamentárias" subtitle="Linhas orçamentárias, centros de custo, realizado, variação e status" icon="table_chart" />
          <div className="hide-scrollbar mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-glass-stroke">
                  {["LINHA OR?AMENT?RIA", "?REA", "OR?AMENTO", "VARIA??O", "STATUS"].map((heading) => (
                    <th key={heading} className="pb-4 font-label-caps text-[10px] text-outline">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm">
                {budgetLinhas.map(([line, area, budget, variance, status]) => (
                  <tr key={line} className="border-b border-glass-stroke/60 transition-colors hover:bg-surface-container-low">
                    <td className="py-4 font-semibold text-primary">{line}</td>
                    <td className="py-4 text-on-surface-variant">{area}</td>
                    <td className="py-4 font-data-mono text-primary">{budget}</td>
                    <td className={`py-4 font-data-mono ${variance.startsWith("+") ? "text-status-critical" : "text-status-success"}`}>{variance}</td>
                    <td className="py-4">
                      <span className="rounded bg-surface-container px-2 py-1 font-label-caps text-[9px] text-primary">{status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>
    </>
  );
}

function SectionTitle({ title, subtitle, icon }: { title: string; subtitle: string; icon: string }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <h3 className="font-title-md font-bold text-primary">{title}</h3>
        <p className="mt-1 font-body-sm text-outline">{subtitle}</p>
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-glass-stroke bg-surface-container-lowest">
        <MaterialIcon name={icon} className="text-[20px] text-outline" />
      </div>
    </div>
  );
}

function ChartHeader({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="font-label-caps text-[10px] text-outline">{title}</p>
        <p className="mt-1 text-sm text-on-surface-variant">{meta}</p>
      </div>
      <span className="font-data-mono text-[11px] text-outline">OR?AMENTO MODEL</span>
    </div>
  );
}

function DualTrendChart() {
  return (
    <div className="mt-6 flex h-64 items-end gap-2 border-b border-outline/10 pb-2">
      {budgetTrend.map((height, index) => (
        <div key={`${height}-${index}`} className="flex h-full w-full items-end gap-1">
          <div className="w-full rounded-t bg-secondary/25" style={{ height: `${height}%` }} />
          <div className="w-full rounded-t bg-primary" style={{ height: `${actualTrend[index]}%` }} />
        </div>
      ))}
    </div>
  );
}

function VarianceChart() {
  return (
    <div className="mt-6 grid h-64 grid-cols-6 items-end gap-3 border-b border-outline/10 pb-2">
      {varianceTrend.map((value, index) => (
        <div key={`${value}-${index}`} className="flex h-full items-end">
          <div className={`w-full rounded-t ${value > 35 ? "bg-status-critical/60" : "bg-status-success/55"}`} style={{ height: `${value + 20}%` }} />
        </div>
      ))}
    </div>
  );
}

function BudgetMetric({ label, value, note, bordered = false }: { label: string; value: string; note: string; bordered?: boolean }) {
  return (
    <div className={`text-center ${bordered ? "border-y border-glass-stroke py-4 md:border-x md:border-y-0 md:py-0" : ""}`}>
      <p className="font-label-caps text-[10px] text-outline">{label}</p>
      <p className="font-data-mono text-headline-lg text-primary">{value}</p>
      <p className="text-xs text-outline">{note}</p>
    </div>
  );
}


