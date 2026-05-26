import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";
import { financialAnalyticsView } from "./data/financialMetrics";

const {
  kpis: financialKpis,
  revenueEvolution,
  profitTrend,
  expenseDistribution,
  costCenters,
  cashFlow,
  insights,
  tableRows,
} = financialAnalyticsView;

export function FinancialIntelligencePage() {
  return (
    <>
      <PageHeader
        eyebrow="FINANCIAL INTELLIGENCE"
        title="Executive DRE Analytics & Cash Performance"
        actions={
          <>
            <button className="flex items-center gap-2 rounded-full border border-glass-stroke px-5 py-3 font-label-caps text-label-caps transition-all hover:bg-surface-container-low">
              <MaterialIcon name="calendar_month" className="text-[18px]" />
              FY 2026 · Q2
            </button>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-caps text-label-caps text-white shadow-xl transition-all hover:shadow-primary/20">
              <MaterialIcon name="download" className="text-[18px]" />
              BOARD REPORT
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-6">
        {financialKpis.map((kpi) => (
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
        <GlassCard className="xl:col-span-8 p-8">
          <SectionTitle title="DRE Analytics" subtitle="Revenue, profit, margins and cost behavior" icon="analytics" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ChartHeader title="Revenue Evolution" meta="Local DRE sample from 2026 workbook" />
              <BarChart values={revenueEvolution} activeIndex={revenueEvolution.length - 1} />
            </div>
            <div className="lg:col-span-5">
              <ChartHeader title="Expense Distribution" meta="Operating cost mapped from DRE sample" />
              <div className="mt-6 space-y-4">
                {expenseDistribution.map(([label, value, percentage, color]) => (
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
            <FinanceMetric label="Profit Trend" value="+7.4%" note="YoY normalized" />
            <FinanceMetric label="Margin Analysis" value="68.1%" note="Gross margin" bordered />
            <FinanceMetric label="Cost Discipline" value="-3.2%" note="Operational cost variance" positive />
          </div>
        </GlassCard>

        <GlassCard className="xl:col-span-4 p-8">
          <SectionTitle title="Cost Center Breakdown" subtitle="Monthly allocation and variance" icon="account_tree" />
          <div className="mt-7 space-y-4">
            {costCenters.map(([name, amount, share, variance]) => (
              <div key={name} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-primary">{name}</span>
                  <span className="font-data-mono text-sm text-primary">{amount}</span>
                </div>
                <div className="flex items-center justify-between font-data-mono text-[11px] text-outline">
                  <span>{share} of OPEX</span>
                  <span className={variance.startsWith("-") ? "text-status-success" : "text-status-critical"}>{variance}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="xl:col-span-7 p-8">
          <SectionTitle title="Cash Flow Center" subtitle="Inflow, outflow, liquidity and forecast" icon="account_balance" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <ChartHeader title="Inflow vs Outflow" meta="Operating cash movement" />
              <DualBarChart />
            </div>
            <div className="space-y-4">
              {cashFlow.map(([label, value, progress, color]) => (
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

        <GlassCard className="xl:col-span-5 p-8">
          <SectionTitle title="Executive Insights" subtitle="Recommendations, anomalies and strategic highlights" icon="tips_and_updates" />
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

        <GlassCard className="xl:col-span-12 p-8">
          <SectionTitle title="Financial Tables" subtitle="Accounts, transactions, expenses, cost centers and monthly comparisons" icon="table_chart" />
          <div className="hide-scrollbar mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-glass-stroke">
                  {["FINANCIAL LINE", "SECTION", "VALUE", "VARIANCE", "STATUS"].map((heading) => (
                    <th key={heading} className="pb-4 font-label-caps text-[10px] text-outline">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm">
                {tableRows.map(([line, section, value, variance, status]) => (
                  <tr key={line} className="border-b border-glass-stroke/60 transition-colors hover:bg-surface-container-low">
                    <td className="py-4 font-semibold text-primary">{line}</td>
                    <td className="py-4 text-on-surface-variant">{section}</td>
                    <td className="py-4 font-data-mono text-primary">{value}</td>
                    <td className={`py-4 font-data-mono ${variance.startsWith("-") ? "text-status-critical" : "text-status-success"}`}>{variance}</td>
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
      <span className="font-data-mono text-[11px] text-outline">LIVE MODEL</span>
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
      {profitTrend.slice(0, 6).map((value, index) => (
        <div key={`${value}-${index}`} className="flex h-full items-end gap-1">
          <div className="w-full rounded-t bg-status-success/70" style={{ height: `${value + 10}%` }} />
          <div className="w-full rounded-t bg-status-critical/40" style={{ height: `${Math.max(value - 12, 24)}%` }} />
        </div>
      ))}
    </div>
  );
}

function FinanceMetric({ label, value, note, bordered = false, positive = false }: { label: string; value: string; note: string; bordered?: boolean; positive?: boolean }) {
  return (
    <div className={`text-center ${bordered ? "border-y border-glass-stroke py-4 md:border-x md:border-y-0 md:py-0" : ""}`}>
      <p className="font-label-caps text-[10px] text-outline">{label}</p>
      <p className={`font-data-mono text-headline-lg ${positive ? "text-status-success" : "text-primary"}`}>{value}</p>
      <p className="text-xs text-outline">{note}</p>
    </div>
  );
}
