import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";

const purchasingKpis = [
  { icon: "shopping_cart", label: "Total Purchasing", value: "$18.7M", delta: "-2.8%", tone: "text-status-success", border: "border-secondary", progress: 74 },
  { icon: "gpp_maybe", label: "Supplier Risk", value: "12.4%", delta: "+1.6pp", tone: "text-status-critical", border: "border-status-critical", progress: 42 },
  { icon: "schedule", label: "Lead Time", value: "18.2d", delta: "-2.1d", tone: "text-status-success", border: "border-status-success", progress: 58 },
  { icon: "price_change", label: "Cost Variance", value: "+3.7%", delta: "+0.9pp", tone: "text-status-critical", border: "border-outline-variant", progress: 37 },
  { icon: "hub", label: "Critical Suppliers", value: "24", delta: "6 high risk", tone: "text-status-critical", border: "border-primary", progress: 49 },
  { icon: "savings", label: "Savings Index", value: "$2.4M", delta: "+8.4%", tone: "text-status-success", border: "border-secondary-container", progress: 82 },
];

const purchasingEvolution = [46, 51, 49, 58, 62, 60, 68, 72, 70, 76, 81, 79];
const leadTimeTrend = [70, 68, 66, 63, 61, 59, 58, 55, 53, 51, 49, 47];
const deliveryTrend = [56, 61, 58, 64, 67, 70];

const categorySpend = [
  ["Raw Materials", "$7.6M", 41, "bg-primary"],
  ["Technology", "$3.4M", 18, "bg-secondary"],
  ["Logistics", "$2.8M", 15, "bg-secondary-container"],
  ["Facilities", "$2.1M", 11, "bg-outline"],
  ["Services", "$2.8M", 15, "bg-surface-tint"],
] as const;

const supplierRanking = [
  ["Nippon Materials", "94.8", "98%", "Active"],
  ["EuroPack GmbH", "89.1", "92%", "Active"],
  ["LATAM Logistics", "76.4", "81%", "Watch"],
  ["Orion Components", "72.8", "78%", "Risk"],
  ["CloudWorks Enterprise", "91.7", "99%", "Active"],
] as const;

const supplierRisk = [
  ["Financial Exposure", "$6.8M", 64, "bg-status-critical"],
  ["Delivery Reliability", "91.2%", 91, "bg-status-success"],
  ["Quality Compliance", "96.8%", 96, "bg-secondary"],
  ["Contract Coverage", "84.5%", 84, "bg-primary"],
] as const;

const insights = [
  { icon: "psychology", label: "AI Purchasing Recommendation", text: "Consolidate regional raw-material orders with top-tier suppliers to unlock an estimated 3.1% savings band.", tone: "text-secondary", bg: "bg-secondary-container/10" },
  { icon: "warning", label: "Supplier Risk Alert", text: "Two critical suppliers show late-shipment probability above threshold for the next replenishment cycle.", tone: "text-status-critical", bg: "bg-error-container/40" },
  { icon: "monitoring", label: "Cost Anomaly", text: "Electronics category variance is 4.6pp above contract index despite stable volumes.", tone: "text-status-critical", bg: "bg-status-critical/10" },
  { icon: "account_tree", label: "Critical Dependency", text: "Single-source dependency remains concentrated in precision components across APAC operations.", tone: "text-status-success", bg: "bg-status-success/10" },
];

const purchasingRows = [
  ["Nippon Materials", "Suppliers", "$3.8M", "94.8", "Preferred"],
  ["PO-88421", "Purchase Orders", "$842k", "On time", "Released"],
  ["Global Raw Materials MSA", "Contracts", "$7.6M", "18 months", "Active"],
  ["LATAM Logistics", "Lead Times", "24.6d", "+4.2d", "Watch"],
  ["Technology Components", "Category Analysis", "$3.4M", "+4.6%", "Review"],
] as const;

export function PurchasingIntelligencePage() {
  return (
    <>
      <PageHeader
        eyebrow="PURCHASING INTELLIGENCE"
        title="Executive Purchasing Analytics & Supplier Intelligence"
        actions={
          <>
            <button className="flex items-center gap-2 rounded-full border border-glass-stroke px-5 py-3 font-label-caps text-label-caps transition-all hover:bg-surface-container-low">
              <MaterialIcon name="inventory_2" className="text-[18px]" />
              GLOBAL PROCUREMENT
            </button>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-caps text-label-caps text-white shadow-xl transition-all hover:shadow-primary/20">
              <MaterialIcon name="download" className="text-[18px]" />
              SUPPLIER REPORT
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-6">
        {purchasingKpis.map((kpi) => (
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
          <SectionTitle title="Procurement Analytics" subtitle="Purchasing evolution, supplier performance and category spend" icon="analytics" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ChartHeader title="Purchasing Evolution" meta="Trailing 12 month spend pattern" />
              <BarChart values={purchasingEvolution} activeIndex={10} />
            </div>
            <div className="lg:col-span-5">
              <ChartHeader title="Category Spend Analysis" meta="$18.7M purchasing distribution" />
              <div className="mt-6 space-y-4">
                {categorySpend.map(([label, value, percentage, color]) => (
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
            <ProcurementMetric label="Supplier Performance" value="91.4" note="Weighted score" />
            <ProcurementMetric label="Lead Time Trends" value="-2.1d" note="Rolling 90 days" positive bordered />
            <ProcurementMetric label="Purchasing Distribution" value="41%" note="Raw material exposure" />
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-4">
          <SectionTitle title="Supplier Ranking" subtitle="Performance, delivery and contract status" icon="leaderboard" />
          <div className="mt-7 space-y-4">
            {supplierRanking.map(([name, score, delivery, status]) => (
              <div key={name} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-primary">{name}</span>
                  <span className="font-data-mono text-sm text-primary">{score}</span>
                </div>
                <div className="flex items-center justify-between font-data-mono text-[11px] text-outline">
                  <span>{delivery} delivery performance</span>
                  <span className={status === "Risk" || status === "Watch" ? "text-status-critical" : "text-status-success"}>{status}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-7">
          <SectionTitle title="Supplier Management" subtitle="Risk matrix, delivery reliability, incidents and contracts" icon="hub" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <ChartHeader title="Lead Time Trends" meta="Lead time reduction vs delivery performance" />
              <DualBarChart />
            </div>
            <div className="space-y-4">
              {supplierRisk.map(([label, value, progress, color]) => (
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
          <SectionTitle title="Executive Insights" subtitle="Recommendations, supplier risk alerts and cost anomalies" icon="tips_and_updates" />
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
          <SectionTitle title="Supplier Risk Matrix" subtitle="Quality incidents and dependency exposure" icon="grid_view" />
          <div className="mt-7 grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, index) => (
              <RiskCell key={index} index={index} />
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-error/10 bg-error-container/20 p-4">
            <div className="flex items-center gap-3">
              <MaterialIcon name="report_problem" className="text-status-critical" />
              <span className="font-label-caps text-[10px] text-outline">QUALITY INCIDENTS</span>
              <span className="ml-auto font-data-mono text-sm text-status-critical">7 OPEN</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-8">
          <SectionTitle title="Purchasing Tables" subtitle="Suppliers, purchase orders, contracts, lead times and category analysis" icon="table_chart" />
          <div className="hide-scrollbar mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-glass-stroke">
                  {["PROCUREMENT LINE", "SECTION", "VALUE", "METRIC", "STATUS"].map((heading) => (
                    <th key={heading} className="pb-4 font-label-caps text-[10px] text-outline">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm">
                {purchasingRows.map(([line, section, value, metric, status]) => (
                  <tr key={line} className="border-b border-glass-stroke/60 transition-colors hover:bg-surface-container-low">
                    <td className="py-4 font-semibold text-primary">{line}</td>
                    <td className="py-4 text-on-surface-variant">{section}</td>
                    <td className="py-4 font-data-mono text-primary">{value}</td>
                    <td className={`py-4 font-data-mono ${metric.startsWith("+") ? "text-status-critical" : "text-status-success"}`}>{metric}</td>
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
      <span className="font-data-mono text-[11px] text-outline">ARIBA MODEL</span>
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
      {deliveryTrend.map((value, index) => (
        <div key={`${value}-${index}`} className="flex h-full items-end gap-1">
          <div className="w-full rounded-t bg-secondary/70" style={{ height: `${value + 12}%` }} />
          <div className="w-full rounded-t bg-status-success/55" style={{ height: `${leadTimeTrend[index] + 8}%` }} />
        </div>
      ))}
    </div>
  );
}

function ProcurementMetric({ label, value, note, bordered = false, positive = false }: { label: string; value: string; note: string; bordered?: boolean; positive?: boolean }) {
  return (
    <div className={`text-center ${bordered ? "border-y border-glass-stroke py-4 md:border-x md:border-y-0 md:py-0" : ""}`}>
      <p className="font-label-caps text-[10px] text-outline">{label}</p>
      <p className={`font-data-mono text-headline-lg ${positive ? "text-status-success" : "text-primary"}`}>{value}</p>
      <p className="text-xs text-outline">{note}</p>
    </div>
  );
}

function RiskCell({ index }: { index: number }) {
  const critical = [6, 12, 18, 19];
  const watch = [3, 8, 14, 21];
  const stable = [1, 5, 10, 16, 22];
  const label = index === 0 ? "Q" : index === 4 ? "D" : index === 20 ? "C" : index === 24 ? "R" : "";
  const color = critical.includes(index)
    ? "bg-status-critical/70"
    : watch.includes(index)
      ? "bg-status-critical/25"
      : stable.includes(index)
        ? "bg-status-success/45"
        : "bg-surface-container";

  return <div className={`flex aspect-square items-center justify-center rounded-sm font-data-mono text-[10px] ${color} ${label ? "opacity-40" : ""}`}>{label}</div>;
}
