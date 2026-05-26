import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";

const operationsKpis = [
  { icon: "precision_manufacturing", label: "Production Volume", value: "148.2k", delta: "+6.4%", tone: "text-status-success", border: "border-secondary", progress: 84 },
  { icon: "speed", label: "Operational Efficiency", value: "94.8%", delta: "+2.1pp", tone: "text-status-success", border: "border-status-success", progress: 94 },
  { icon: "query_stats", label: "OEE", value: "86.7%", delta: "+3.4pp", tone: "text-secondary", border: "border-primary", progress: 86 },
  { icon: "timer_off", label: "Downtime", value: "4.2h", delta: "-1.8h", tone: "text-status-success", border: "border-outline-variant", progress: 28 },
  { icon: "report_problem", label: "Scrap Rate", value: "1.9%", delta: "-0.6pp", tone: "text-status-success", border: "border-status-critical", progress: 19 },
  { icon: "trending_up", label: "Productivity Index", value: "112.4", delta: "+8.7", tone: "text-status-success", border: "border-secondary-container", progress: 78 },
];

const productionTrend = [48, 52, 57, 61, 66, 69, 72, 76, 79, 83, 88, 91];
const efficiencyTrend = [64, 67, 65, 70, 72, 74, 77, 79, 82, 84, 87, 89];
const downtimeTrend = [56, 54, 51, 48, 46, 43, 39, 37, 35, 31, 28, 26];

const downtimeAnalysis = [
  ["Planned Maintenance", "2.1h", 42, "bg-primary"],
  ["Material Waiting", "0.8h", 19, "bg-secondary"],
  ["Machine Fault", "0.7h", 17, "bg-status-critical"],
  ["Quality Hold", "0.4h", 10, "bg-secondary-container"],
  ["Line Changeover", "0.2h", 5, "bg-outline"],
] as const;

const linePerformance = [
  ["Line A", "96.1%", "88.4%", "Optimal"],
  ["Line B", "91.7%", "84.2%", "Stable"],
  ["Line C", "78.4%", "71.8%", "Bottleneck"],
  ["Line D", "88.9%", "82.1%", "Watch"],
  ["Line E", "94.2%", "87.6%", "Optimal"],
] as const;

const productionMonitoring = [
  ["Machine Availability", "97.2%", 97, "bg-status-success"],
  ["Production Capacity", "84.6%", 84, "bg-secondary"],
  ["Process Stability", "91.8%", 91, "bg-primary"],
  ["Quality Yield", "98.1%", 98, "bg-secondary-container"],
] as const;

const insights = [
  { icon: "psychology", label: "AI Operational Recommendation", text: "Shift preventive maintenance for Line C into the low-demand window to recover 1.6 hours of weekly capacity.", tone: "text-secondary", bg: "bg-secondary-container/10" },
  { icon: "timer_off", label: "Downtime Alert", text: "Material waiting time increased for three consecutive shifts in the south production cell.", tone: "text-status-critical", bg: "bg-error-container/40" },
  { icon: "monitoring", label: "Efficiency Anomaly", text: "OEE improved overall, but Line C availability is diverging from comparable assets by 8.4pp.", tone: "text-status-critical", bg: "bg-status-critical/10" },
  { icon: "account_tree", label: "Bottleneck Detection", text: "Packaging inspection remains the primary throughput constraint during peak batch sequences.", tone: "text-status-success", bg: "bg-status-success/10" },
];

const operationsRows = [
  ["PO-77218", "Production Orders", "18.4k units", "On schedule", "Released"],
  ["MX-420 Press", "Machine Logs", "97.2%", "Healthy", "Running"],
  ["Line C Hold", "Downtime Records", "0.7h", "+18m", "Bottleneck"],
  ["Shift B Output", "Productivity Reports", "112.4", "+8.7", "Ahead"],
  ["Packaging Cell", "Operational History", "86.7%", "-2.1pp", "Watch"],
] as const;

export function OperationsAnalyticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="OPERATIONS ANALYTICS"
        title="Executive Operational Intelligence & Production Analytics"
        actions={
          <>
            <button className="flex items-center gap-2 rounded-full border border-glass-stroke px-5 py-3 font-label-caps text-label-caps transition-all hover:bg-surface-container-low">
              <MaterialIcon name="factory" className="text-[18px]" />
              GLOBAL OPERATIONS
            </button>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-caps text-label-caps text-white shadow-xl transition-all hover:shadow-primary/20">
              <MaterialIcon name="download" className="text-[18px]" />
              OPERATIONS REPORT
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
          <SectionTitle title="Operations Analytics" subtitle="Production trends, efficiency evolution and downtime analysis" icon="analytics" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ChartHeader title="Production Trends" meta="Trailing 12 month output pattern" />
              <BarChart values={productionTrend} activeIndex={10} />
            </div>
            <div className="lg:col-span-5">
              <ChartHeader title="Downtime Analysis" meta="4.2 hours weighted downtime" />
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
            <OperationsMetric label="Efficiency Evolution" value="+2.1pp" note="Rolling 90 days" positive />
            <OperationsMetric label="Productivity Heatmap" value="112.4" note="Indexed output" bordered />
            <OperationsMetric label="Operational Performance" value="94.8%" note="Weighted efficiency" />
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-4">
          <SectionTitle title="Line Performance" subtitle="Efficiency, OEE and bottleneck status" icon="leaderboard" />
          <div className="mt-7 space-y-4">
            {linePerformance.map(([name, efficiency, oee, status]) => (
              <div key={name} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-primary">{name}</span>
                  <span className="font-data-mono text-sm text-primary">{efficiency}</span>
                </div>
                <div className="flex items-center justify-between font-data-mono text-[11px] text-outline">
                  <span>{oee} OEE</span>
                  <span className={status === "Bottleneck" || status === "Watch" ? "text-status-critical" : "text-status-success"}>{status}</span>
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
              <DualBarChart />
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
          <SectionTitle title="Executive Insights" subtitle="Recommendations, alerts, anomalies and production risks" icon="tips_and_updates" />
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
          <div className="mt-6 rounded-lg border border-error/10 bg-error-container/20 p-4">
            <div className="flex items-center gap-3">
              <MaterialIcon name="report_problem" className="text-status-critical" />
              <span className="font-label-caps text-[10px] text-outline">BOTTLENECK RISK</span>
              <span className="ml-auto font-data-mono text-sm text-status-critical">LINE C</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-8">
          <SectionTitle title="Operations Tables" subtitle="Production orders, machine logs, downtime records, productivity reports and history" icon="table_chart" />
          <div className="hide-scrollbar mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-glass-stroke">
                  {["OPERATIONS LINE", "SECTION", "VALUE", "METRIC", "STATUS"].map((heading) => (
                    <th key={heading} className="pb-4 font-label-caps text-[10px] text-outline">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm">
                {operationsRows.map(([line, section, value, metric, status]) => (
                  <tr key={line} className="border-b border-glass-stroke/60 transition-colors hover:bg-surface-container-low">
                    <td className="py-4 font-semibold text-primary">{line}</td>
                    <td className="py-4 text-on-surface-variant">{section}</td>
                    <td className="py-4 font-data-mono text-primary">{value}</td>
                    <td className={`py-4 font-data-mono ${metric.startsWith("+") || metric === "Healthy" || metric === "On schedule" ? "text-status-success" : "text-status-critical"}`}>{metric}</td>
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

function DualBarChart() {
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
