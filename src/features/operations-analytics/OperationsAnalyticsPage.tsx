import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";
import { useOperationsAnalyticsView } from "../../shared/data/liveImport/hooks";

export function OperationsAnalyticsPage() {
  const {
    kpis: operationsKpis,
    productionTrend,
    efficiencyTrend,
    downtimeTrend,
    downtimeAnalysis,
    linePerformance,
    productionMonitoring,
    insights,
    tableRows: operationsLinhas,
  } = useOperationsAnalyticsView();

  return (
    <>
      <PageHeader
        eyebrow="An?lise operacional"
        title="Intelig?ncia operacional e produ??o"
        actions={
          <>
            <button className="flex items-center gap-2 rounded-full border border-glass-stroke px-5 py-3 font-label-caps text-label-caps transition-all hover:bg-surface-container-low">
              <MaterialIcon name="factory" className="text-[18px]" />
              Opera??es gerais
            </button>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-caps text-label-caps text-white shadow-xl transition-all hover:shadow-primary/20">
              <MaterialIcon name="download" className="text-[18px]" />
              Relat?rio operacional
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-6">
        {operationsKpis.map((kpi) => (
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
          <SectionTitle title="Análise operacional" subtitle="Production trends, efficiency evolution and downtime analysis" icon="analytics" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ChartHeader title="Production Trends" meta="Local production records by line" />
              <BarChart values={productionTrend} activeIndex={productionTrend.length - 1} />
            </div>
            <div className="lg:col-span-5">
              <ChartHeader title="Downtime Analysis" meta="Downtime grouped by reason" />
              <div className="mt-6 space-y-4">
                {downtimeAnalysis.map(([label, value, percentage, color]) => (
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
            <OperationsMetric label="Efficiency Evolution" value={operationsKpis[1].value} note="Weighted local records" positive={operationsKpis[1].tone.includes("success")} />
            <OperationsMetric label="Productivity Heatmap" value={operationsKpis[5].value} note="Indexed output" bordered />
            <OperationsMetric label="Desempenho operacional" value={operationsKpis[2].value} note="OEE local model" />
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-4">
          <SectionTitle title="Desempenho por linha" subtitle="Efici?ncia, OEE e gargalos" icon="leaderboard" />
          <div className="mt-7 space-y-4">
            {linePerformance.map(([name, efficiency, oee, status]) => (
              <div key={name} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-primary">{name}</span>
                  <span className="font-data-mono text-sm text-primary">{efficiency}</span>
                </div>
                <div className="flex items-center justify-between font-data-mono text-[11px] text-outline">
                  <span>{oee} OEE</span>
                  <span className={status === "Bottleneck" || status === "Atenção" ? "text-status-critical" : "text-status-success"}>{status}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-7">
          <SectionTitle title="Production Monitoring" subtitle="Machine status, capacity, process monitoring and yield" icon="precision_manufacturing" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <ChartHeader title="Efficiency vs Downtime" meta="Operational stability by period" />
              <DualBarChart downtimeTrend={downtimeTrend} efficiencyTrend={efficiencyTrend} />
            </div>
            <div className="space-y-4">
              {productionMonitoring.map(([label, value, progress, color]) => (
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
          <SectionTitle title="Insights executivos" subtitle="Recomenda??es, alertas, anomalias e riscos de produ??o" icon="tips_and_updates" />
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

        <GlassCard className="p-8 xl:col-span-4">
          <SectionTitle title="Productivity Heatmap" subtitle="Process monitoring and bottleneck exposure" icon="grid_view" />
          <div className="mt-7 grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, index) => (
              <HeatmapCell key={index} index={index} />
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-erro/10 bg-erro-container/20 p-4">
            <div className="flex items-center gap-3">
              <MaterialIcon name="report_problem" className="text-status-critical" />
              <span className="font-label-caps text-[10px] text-outline">BOTTLENECK RISK</span>
              <span className="ml-auto font-data-mono text-sm text-status-critical">LINE C</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-8">
          <SectionTitle title="Tabelas operacionais" subtitle="Production orders, machine logs, downtime records, productivity reports and history" icon="table_chart" />
          <div className="hide-scrollbar mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-glass-stroke">
                  {["LINHA OPERACIONAL", "SEÇÃO", "VALOR", "MÉTRICA", "STATUS"].map((heading) => (
                    <th key={heading} className="pb-4 font-label-caps text-[10px] text-outline">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm">
                {operationsLinhas.map(([line, section, value, metric, status]) => (
                  <tr key={line} className="border-b border-glass-stroke/60 transition-colors hover:bg-surface-container-low">
                    <td className="py-4 font-semibold text-primary">{line}</td>
                    <td className="py-4 text-on-surface-variant">{section}</td>
                    <td className="py-4 font-data-mono text-primary">{value}</td>
                    <td className={`py-4 font-data-mono ${metric.startsWith("+") || metric === "Saudável" || metric === "On schedule" ? "text-status-success" : "text-status-critical"}`}>{metric}</td>
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
      <span className="font-data-mono text-[11px] text-outline">MES MODEL</span>
    </div>
  );
}

function BarChart({ values, activeIndex }: { values: number[]; activeIndex: number }) {
  return (
    <div className="mt-6 flex h-64 items-end gap-2 border-b border-outline/10 pb-2">
      {values.map((height, index) => (
        <div
          key={`${height}-${index}`}
          className={`w-full rounded-t transition-colors ${index === activeIndex ? "bg-primary" : "bg-secondary/20 hover:bg-secondary/40"}`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function DualBarChart({ downtimeTrend, efficiencyTrend }: { downtimeTrend: number[]; efficiencyTrend: number[] }) {
  return (
    <div className="mt-6 grid h-64 grid-cols-6 items-end gap-3 border-b border-outline/10 pb-2">
      {efficiencyTrend.slice(0, 6).map((value, index) => (
        <div key={`${value}-${index}`} className="flex h-full items-end gap-1">
          <div className="w-full rounded-t bg-secondary/70" style={{ height: `${value + 8}%` }} />
          <div className="w-full rounded-t bg-status-critical/35" style={{ height: `${downtimeTrend[index]}%` }} />
        </div>
      ))}
    </div>
  );
}

function OperationsMetric({ label, value, note, bordered = false, positive = false }: { label: string; value: string; note: string; bordered?: boolean; positive?: boolean }) {
  return (
    <div className={`text-center ${bordered ? "border-y border-glass-stroke py-4 md:border-x md:border-y-0 md:py-0" : ""}`}>
      <p className="font-label-caps text-[10px] text-outline">{label}</p>
      <p className={`font-data-mono text-headline-lg ${positive ? "text-status-success" : "text-primary"}`}>{value}</p>
      <p className="text-xs text-outline">{note}</p>
    </div>
  );
}

function HeatmapCell({ index }: { index: number }) {
  const bottleneck = [7, 12, 13, 18];
  const watch = [3, 8, 16, 21];
  const optimal = [1, 5, 10, 15, 22];
  const label = index === 0 ? "A" : index === 4 ? "B" : index === 20 ? "C" : index === 24 ? "D" : "";
  const color = bottleneck.includes(index)
    ? "bg-status-critical/70"
    : watch.includes(index)
      ? "bg-status-critical/25"
      : optimal.includes(index)
        ? "bg-status-success/45"
        : "bg-surface-container";

  return <div className={`flex aspect-square items-center justify-center rounded-sm font-data-mono text-[10px] ${color} ${label ? "opacity-40" : ""}`}>{label}</div>;
}


