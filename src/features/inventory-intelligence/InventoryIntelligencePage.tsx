import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";
import { inventoryAnalyticsView } from "./data/inventoryMetrics";

const {
  kpis: inventoryKpis,
  stockTrend,
  consumptionTrend,
  turnoverTrend,
  stockComposition,
  abcCurve,
  inventoryHealth,
  insights,
  tableRows: inventoryLinhas,
} = inventoryAnalyticsView;

export function InventoryIntelligencePage() {
  return (
    <>
      <PageHeader
        eyebrow="INVENTORY INTELLIGENCE"
        title="Estoque executivo e capital de giro"
        actions={
          <>
            <button className="flex items-center gap-2 rounded-full border border-glass-stroke px-5 py-3 font-label-caps text-label-caps transition-all hover:bg-surface-container-low">
              <MaterialIcon name="warehouse" className="text-[18px]" />
              ESTOQUE FEV 2026
            </button>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-caps text-label-caps text-white shadow-xl transition-all hover:shadow-primary/20">
              <MaterialIcon name="download" className="text-[18px]" />
              Relat?rio de estoque
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-6">
        {inventoryKpis.map((kpi) => (
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
          <SectionTitle title="An?lise de estoque" subtitle="Estoque anterior vs final, composi??o e capital empregado" icon="analytics" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ChartHeader title="Stock Value Trend" meta="Periodo 8-12 meses e variacao mensal" />
              <BarChart values={stockTrend} activeIndex={stockTrend.length - 1} />
            </div>
            <div className="lg:col-span-5">
              <ChartHeader title="Stock Composition" meta="Materia-prima, WIP e acabado" />
              <div className="mt-6 space-y-4">
                {stockComposition.map(([label, value, percentage, color]) => (
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
            <InventoryMetric label="Stock Reduction" value={inventoryKpis[0].delta} note="No geral reduzido" positive />
            <InventoryMetric label="WIP Movement" value={inventoryKpis[2].delta} note="Produto em processo" bordered />
            <InventoryMetric label="Produto acabado" value={inventoryKpis[3].delta} note="Material acabado" positive />
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-4">
          <SectionTitle title="ABC Curve" subtitle="Classificacao, valor e movimento" icon="abc" />
          <div className="mt-7 space-y-4">
            {abcCurve.map(([name, value, movement, status]) => (
              <div key={name} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-primary">{name}</span>
                  <span className="font-data-mono text-sm text-primary">{value}</span>
                </div>
                <div className="flex items-center justify-between font-data-mono text-[11px] text-outline">
                  <span className={movement.startsWith("-") ? "text-status-success" : "text-status-critical"}>{movement}</span>
                  <span>{status}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-7">
          <SectionTitle title="Inventory Control Center" subtitle="Disponibilidade, giro, cobertura e reposicao" icon="warehouse" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <ChartHeader title="Consumption vs Turnover" meta="Consumo de materia-prima e giro" />
              <DualBarChart />
            </div>
            <div className="space-y-4">
              {inventoryHealth.map(([label, value, progress, color]) => (
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
          <SectionTitle title="Insights executivos" subtitle="Recomenda??es, riscos de estoque e anomalias de consumo" icon="tips_and_updates" />
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
          <SectionTitle title="Stock Risco Matrix" subtitle="Giro, criticidade e exposicao de capital" icon="grid_view" />
          <div className="mt-7 grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, index) => (
              <RiscoCell key={index} index={index} />
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-erro/10 bg-erro-container/20 p-4">
            <div className="flex items-center gap-3">
              <MaterialIcon name="report_problem" className="text-status-critical" />
              <span className="font-label-caps text-[10px] text-outline">WIP ATTENTION</span>
              <span className="ml-auto font-data-mono text-sm text-status-critical">{inventoryKpis[2].delta}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-8">
          <SectionTitle title="Tabelas de estoque" subtitle="Categorias, curva ABC, estoque final, variacao e itens criticos" icon="table_chart" />
          <div className="hide-scrollbar mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-glass-stroke">
                  {["LINHA DE ESTOQUE", "SEÇÃO", "VALOR", "MOVIMENTO", "STATUS"].map((heading) => (
                    <th key={heading} className="pb-4 font-label-caps text-[10px] text-outline">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm">
                {inventoryLinhas.map(([line, section, value, movement, status]) => (
                  <tr key={line} className="border-b border-glass-stroke/60 transition-colors hover:bg-surface-container-low">
                    <td className="py-4 font-semibold text-primary">{line}</td>
                    <td className="py-4 text-on-surface-variant">{section}</td>
                    <td className="py-4 font-data-mono text-primary">{value}</td>
                    <td className={`py-4 font-data-mono ${movement.startsWith("-") ? "text-status-success" : "text-status-critical"}`}>{movement}</td>
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
      <span className="font-data-mono text-[11px] text-outline">MODELO DE ESTOQUE</span>
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

function DualBarChart() {
  return (
    <div className="mt-6 grid h-64 grid-cols-6 items-end gap-3 border-b border-outline/10 pb-2">
      {consumptionTrend.slice(0, 6).map((value, index) => (
        <div key={`${value}-${index}`} className="flex h-full items-end gap-1">
          <div className="w-full rounded-t bg-secondary/70" style={{ height: `${value + 8}%` }} />
          <div className="w-full rounded-t bg-status-success/55" style={{ height: `${turnoverTrend[index] + 12}%` }} />
        </div>
      ))}
    </div>
  );
}

function InventoryMetric({ label, value, note, bordered = false, positive = false }: { label: string; value: string; note: string; bordered?: boolean; positive?: boolean }) {
  return (
    <div className={`text-center ${bordered ? "border-y border-glass-stroke py-4 md:border-x md:border-y-0 md:py-0" : ""}`}>
      <p className="font-label-caps text-[10px] text-outline">{label}</p>
      <p className={`font-data-mono text-headline-lg ${positive ? "text-status-success" : "text-primary"}`}>{value}</p>
      <p className="text-xs text-outline">{note}</p>
    </div>
  );
}

function RiscoCell({ index }: { index: number }) {
  const critical = [7, 12, 13, 18];
  const watch = [3, 8, 16, 21];
  const healthy = [1, 5, 10, 15, 22];
  const label = index === 0 ? "A" : index === 4 ? "B" : index === 20 ? "C" : index === 24 ? "S/M" : "";
  const color = critical.includes(index)
    ? "bg-status-critical/70"
    : watch.includes(index)
      ? "bg-status-critical/25"
      : healthy.includes(index)
        ? "bg-status-success/45"
        : "bg-surface-container";

  return <div className={`flex aspect-square items-center justify-center rounded-sm font-data-mono text-[10px] ${color} ${label ? "opacity-40" : ""}`}>{label}</div>;
}


