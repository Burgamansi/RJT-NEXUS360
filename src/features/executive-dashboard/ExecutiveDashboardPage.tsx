import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";

const kpis = [
  { icon: "payments", label: "GLOBAL REVENUE", value: "$42.8M", trend: "12.4%", color: "bg-electric-blue", border: "border-electric-blue", progress: 75 },
  { icon: "precision_manufacturing", label: "OP-EFFICIENCY", value: "94.8%", trend: "4.2%", color: "bg-secondary", border: "border-secondary", progress: 94 },
  { icon: "shield", label: "SYSTEM RISK", value: "LOW", trend: "CRITICAL", color: "bg-status-critical", border: "border-status-critical", progress: 25 },
  { icon: "groups", label: "TOTAL WORKFORCE", value: "2,410", trend: "+12 New", color: "bg-primary", border: "border-primary", progress: 66 },
];

const activity = [
  { icon: "mail", source: "Board of Directors", time: "14m ago", text: "The Q2 strategy deck has been approved with minor amendments to the sustainability clause.", tone: "text-secondary", bg: "bg-secondary-container/10" },
  { icon: "report_problem", source: "Security Alert", time: "1h ago", text: "Anomalous login detected from Singapore region. Two-factor authentication successfully blocked access.", tone: "text-status-critical", bg: "bg-status-critical/10" },
  { icon: "rocket_launch", source: "System Nexus", time: "2h ago", text: "Nexus v3.2.0-Alpha migration completed across all primary data nodes in North America.", tone: "text-status-success", bg: "bg-status-success/10" },
];

export function ExecutiveDashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Morning Intelligence Summary"
        title="Strategic Overview: RJT Nexus360"
        actions={
          <>
            <button className="rounded-full border border-glass-stroke px-6 py-3 font-label-caps text-label-caps transition-all hover:bg-surface-container-low">EXPORT REPORT</button>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-caps text-label-caps text-white shadow-xl transition-all hover:shadow-primary/20">
              <MaterialIcon name="bolt" className="text-sm" />
              COMMAND CENTER
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <GlassCard key={kpi.label} className={`flex flex-col gap-4 border-l-4 p-6 ${kpi.border}`}>
            <div className="flex items-start justify-between">
              <MaterialIcon name={kpi.icon} className="text-outline" />
              <span className="flex items-center gap-1 font-data-mono text-xs text-status-success">{kpi.trend}</span>
            </div>
            <div>
              <p className="mb-1 font-label-caps text-xs text-outline">{kpi.label}</p>
              <p className="font-headline-lg text-2xl font-black text-primary">{kpi.value}</p>
            </div>
            <ProgressBar value={kpi.progress} className={kpi.color} />
          </GlassCard>
        ))}
      </section>

      <section className="mt-gutter grid grid-cols-1 gap-gutter xl:grid-cols-12">
        <div className="space-y-gutter xl:col-span-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <GlassCard className="ai-glow group relative overflow-hidden p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 bg-electric-blue/10 blur-[80px] transition-all group-hover:bg-electric-blue/20" />
              <div className="mb-6 flex items-center gap-3">
                <div className="pulse-ring flex h-8 w-8 items-center justify-center rounded-full bg-electric-blue/20">
                  <MaterialIcon name="psychology" className="text-sm text-electric-blue" />
                </div>
                <h3 className="font-title-md font-bold text-primary">Predictive Forecast</h3>
              </div>
              <p className="mb-6 leading-relaxed text-on-surface/80">
                Nexus AI predicts a 15% surge in logistics demand for the Q3 EMEA corridor. Recommendation: Accelerate local warehousing expansion by 12 days.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-lg bg-primary px-4 py-2 font-label-caps text-xs text-white">Execute Auto-Strategy</button>
                <button className="rounded-lg border border-glass-stroke px-4 py-2 font-label-caps text-xs">Deep Dive</button>
              </div>
            </GlassCard>

            <GlassCard className="border-l-4 border-status-success p-8">
              <div className="mb-6 flex items-center gap-3">
                <MaterialIcon name="eco" className="text-status-success" />
                <h3 className="font-title-md font-bold text-primary">ESG Compliance</h3>
              </div>
              <div className="space-y-4">
                <MetricRow label="Carbon Offset Index" value="A+ (98.2)" />
                <MetricRow label="Sustainable Sourcing" value="82%" />
                <ProgressBar value={82} className="bg-status-success" />
              </div>
            </GlassCard>
          </div>

          <GlassCard className="flex min-h-[400px] flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-glass-stroke p-6">
              <h3 className="font-title-md font-bold text-primary">Global Industrial Performance</h3>
              <div className="hidden gap-2 sm:flex">
                <div className="rounded-full bg-surface-container px-3 py-1 font-label-caps text-[10px] text-outline">LIVE SYNC</div>
                <div className="rounded-full bg-surface-container px-3 py-1 font-label-caps text-[10px] text-outline">FILTERS: GLOBAL</div>
              </div>
            </div>
            <div className="relative flex-1 overflow-hidden bg-surface-container-low">
              <img
                alt="Global Industrial Logistics Map"
                className="h-full w-full object-cover opacity-30 mix-blend-multiply"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3kzI04ibOSsnzTMBqTBoOPBaRLU4eM8MJYi6iCyPHkhjASd65RDL79JZjqJkFU1UNcOz9Rc0Sr8sv4F72MMUFewEEKpX7l8FL_VwunIyeAOULJgzv1F83_7ddywA-XbMsAX8SKsH0n1nLjrh5676YEyDle5t8PYgZyhTAAyE6IZCcDV3-h8lLvSXTvyq_1iSKMVH048lqtYfEwrKoTrK1YtIYV93O8npVhqXkZs_J_kABDmgJV9H_4NDon2AlOA6LPgGUVMyFjODt"
              />
              <div className="pulse-ring absolute left-1/3 top-1/4 h-4 w-4 rounded-full bg-electric-blue" />
              <div className="pulse-ring absolute bottom-1/2 right-1/4 h-4 w-4 rounded-full bg-status-success" />
              <div className="pulse-ring absolute left-1/2 top-2/3 h-4 w-4 rounded-full bg-secondary" />
              <div className="glass-card absolute bottom-6 left-6 max-w-xs rounded-xl border-electric-blue/30 p-4">
                <p className="mb-2 font-label-caps text-[10px] text-electric-blue">FACTORY NODE 07 (TOKYO)</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">Throughput: 14.2k/hr</span>
                  <MaterialIcon name="check_circle" className="text-sm text-status-success" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="flex min-h-[600px] flex-col xl:col-span-4">
          <div className="border-b border-glass-stroke p-6">
            <h3 className="font-title-md font-bold text-primary">Executive Activity</h3>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {activity.map((item) => (
              <div key={item.source} className="flex gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.bg}`}>
                  <MaterialIcon name={item.icon} className={item.tone} />
                </div>
                <div className="space-y-1">
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-xs font-bold text-primary">{item.source}</span>
                    <span className="font-data-mono text-[10px] text-outline">{item.time}</span>
                  </div>
                  <p className="text-sm leading-snug text-on-surface-variant">{item.text}</p>
                </div>
              </div>
            ))}
            <div className="space-y-3">
              <p className="font-label-caps text-[10px] text-outline">Recent Transactions</p>
              <MiniTransaction label="AWS Enterprise" value="-$12.4k" icon="payments" />
              <MiniTransaction label="HSBC Wire Recv" value="+$2.1M" icon="account_balance" positive />
            </div>
          </div>
          <div className="bg-surface-container-low/50 p-6">
            <button className="w-full rounded-xl border border-glass-stroke py-3 font-label-caps text-xs text-outline transition-all hover:border-primary hover:text-primary">VIEW FULL AUDIT LOG</button>
          </div>
        </GlassCard>
      </section>
    </>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-data-mono text-sm text-outline">{label}</span>
      <span className="text-sm font-bold text-primary">{value}</span>
    </div>
  );
}

function MiniTransaction({ label, value, icon, positive = false }: { label: string; value: string; icon: string; positive?: boolean }) {
  return (
    <div className="glass-card flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-white">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container">
          <MaterialIcon name={icon} className="text-xs" />
        </div>
        <span className="text-xs font-bold">{label}</span>
      </div>
      <span className={`font-data-mono text-xs ${positive ? "text-status-success" : ""}`}>{value}</span>
    </div>
  );
}
