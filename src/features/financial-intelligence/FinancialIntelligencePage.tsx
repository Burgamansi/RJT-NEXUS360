import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";

const chartBars = [40, 55, 45, 70, 85, 60, 90, 95, 75, 65, 80, 85];
const pipeline = [
  ["QUALIFIED LEADS", "2,480", 100, "bg-primary"],
  ["PROPOSALS SENT", "1,120", 45, "bg-secondary"],
  ["NEGOTIATIONS", "412", 18, "bg-secondary-container"],
  ["CLOSED WON", "184", 8, "bg-electric-blue"],
] as const;

const entities = [
  ["North America Corp.", "$5.82M", "+12.4%", "OPTIMAL", "text-status-success", "bg-status-success/10"],
  ["EuroNexus Gmbh", "$4.15M", "+8.1%", "OPTIMAL", "text-status-success", "bg-status-success/10"],
  ["APAC Strategy Hub", "$3.21M", "-2.4%", "MONITORING", "text-status-critical", "bg-error-container"],
] as const;

export function FinancialIntelligencePage() {
  return (
    <>
      <PageHeader
        eyebrow="QUARTERLY INTELLIGENCE"
        title="Financial & Commercial Overview"
        actions={
          <>
            <button className="flex items-center gap-2 rounded-xl border border-glass-stroke bg-surface-container-lowest px-4 py-2 font-label-caps text-[12px] shadow-sm transition-all hover:backdrop-brightness-110">
              <MaterialIcon name="filter_list" className="text-[18px]" />
              MULTI-CORP FILTER
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2 font-label-caps text-[12px] text-white transition-all hover:bg-secondary-container active:scale-95">
              <MaterialIcon name="download" className="text-[18px]" />
              GENERATE REPORT
            </button>
          </>
        }
      />

      <section className="grid grid-cols-12 gap-gutter">
        <GlassCard className="relative col-span-12 overflow-hidden p-8 lg:col-span-8">
          <div className="mb-10 flex items-start justify-between gap-6">
            <div>
              <h3 className="font-title-md text-primary">Consolidated Revenue</h3>
              <p className="font-body-sm text-outline">Global operations trailing 12 months</p>
            </div>
            <div className="hidden gap-4 sm:flex">
              <Legend color="bg-secondary" label="ACTUAL" />
              <Legend color="bg-outline/30" label="TARGET" muted />
            </div>
          </div>
          <div className="relative flex h-64 items-end justify-between gap-1">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
              <span className="font-display-xl text-[120px] font-black">NEXUS</span>
            </div>
            <div className="flex h-full w-full items-end gap-2 border-b border-outline/10 pb-2">
              {chartBars.map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  className={`w-full rounded-t transition-all hover:bg-secondary/40 ${
                    index === 7 ? "bg-electric-blue shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-electric-blue/80" : index > 4 ? "bg-secondary/20" : "bg-secondary/10"
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-glass-stroke pt-6 sm:grid-cols-3">
            <FinancialStat label="EBITDA MARGIN" value="32.4%" />
            <FinancialStat label="NET REVENUE" value="$14.2M" bordered />
            <FinancialStat label="GROSS MARGIN" value="68.1%" accent />
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 flex flex-col p-8 lg:col-span-4">
          <div className="mb-8">
            <h3 className="font-title-md text-primary">Commercial Pipeline</h3>
            <p className="font-body-sm text-outline">Lead to Deal conversion</p>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            {pipeline.map(([label, value, progress, color]) => (
              <div key={label} className="space-y-2">
                <div className="flex justify-between font-label-caps text-[11px]">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <ProgressBar value={progress} className={color} />
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg bg-primary p-4 text-white">
            <div className="flex items-center gap-3">
              <MaterialIcon name="rocket_launch" className="text-electric-blue" />
              <div>
                <p className="font-label-caps text-[10px] opacity-70">CONVERSION LIFT</p>
                <p className="font-data-mono text-title-md">+14.2% YoY</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 overflow-hidden p-8 lg:col-span-5">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-title-md text-primary">Risk Analytics Heatmap</h3>
            <span className="rounded-full bg-error-container px-3 py-1 font-label-caps text-[10px] text-on-error-container">3 CRITICAL</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, index) => (
              <HeatmapCell key={index} index={index} />
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-lg border border-error/10 bg-error-container/20 p-3">
            <MaterialIcon name="warning" className="text-[20px] text-status-critical" />
            <span className="font-body-sm font-medium text-primary">Supply Chain Volatility (SEA)</span>
            <span className="ml-auto font-data-mono text-[12px] text-status-critical">HIGH</span>
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 p-8 lg:col-span-7">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="font-title-md text-primary">Top Commercial Entities</h3>
              <p className="font-body-sm text-outline">Global entity performance matrix</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-glass-stroke">
              <MaterialIcon name="public" className="text-outline" />
            </div>
          </div>
          <div className="hide-scrollbar overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-glass-stroke">
                  {["ENTITY NAME", "REVENUE", "GROWTH", "STATUS"].map((heading) => (
                    <th key={heading} className="pb-4 font-label-caps text-[10px] text-outline">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm">
                {entities.map(([name, revenue, growth, status, tone, bg]) => (
                  <tr key={name} className="transition-colors hover:bg-surface-container-low">
                    <td className="py-4 font-medium">{name}</td>
                    <td className="py-4 font-data-mono">{revenue}</td>
                    <td className={`py-4 font-data-mono ${tone}`}>{growth}</td>
                    <td className="py-4">
                      <span className={`rounded px-2 py-0.5 font-label-caps text-[9px] ${bg} ${tone}`}>{status}</span>
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

function Legend({ color, label, muted = false }: { color: string; label: string; muted?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${muted ? "text-outline" : ""}`}>
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="font-data-mono text-[12px]">{label}</span>
    </div>
  );
}

function FinancialStat({ label, value, bordered = false, accent = false }: { label: string; value: string; bordered?: boolean; accent?: boolean }) {
  return (
    <div className={`text-center ${bordered ? "border-y border-glass-stroke py-4 sm:border-x sm:border-y-0 sm:py-0" : ""}`}>
      <p className="font-label-caps text-[10px] text-outline">{label}</p>
      <p className={`font-data-mono text-headline-lg ${accent ? "text-secondary" : "text-primary"}`}>{value}</p>
    </div>
  );
}

function HeatmapCell({ index }: { index: number }) {
  const critical = [12, 16, 18];
  const warning = [8, 14];
  const success = [2, 6, 10];
  const label = index === 0 ? "L1" : index === 1 ? "L2" : index === 20 ? "I1" : index === 21 ? "I2" : "";
  const color = critical.includes(index)
    ? "bg-status-critical/80 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
    : warning.includes(index)
      ? "bg-status-critical/30"
      : success.includes(index)
        ? "bg-status-success/60"
        : "bg-surface-container";

  return <div className={`flex aspect-square items-center justify-center rounded-sm font-data-mono text-[10px] ${color} ${label ? "opacity-30" : ""}`}>{label}</div>;
}
