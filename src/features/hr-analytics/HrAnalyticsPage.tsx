import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";

const hrKpis = [
  { icon: "groups", label: "Headcount", value: "2,410", delta: "+4.8%", tone: "text-status-success", border: "border-secondary", progress: 78 },
  { icon: "person_remove", label: "Turnover", value: "8.6%", delta: "-1.2pp", tone: "text-status-success", border: "border-status-success", progress: 36 },
  { icon: "event_busy", label: "Absenteeism", value: "3.1%", delta: "+0.4pp", tone: "text-status-critical", border: "border-status-critical", progress: 31 },
  { icon: "school", label: "Training Hours", value: "18.4k", delta: "+11.6%", tone: "text-status-success", border: "border-secondary-container", progress: 69 },
  { icon: "workspace_premium", label: "Performance Score", value: "86.2", delta: "+3.8", tone: "text-secondary", border: "border-primary", progress: 86 },
  { icon: "schedule", label: "Overtime Cost", value: "$482k", delta: "-6.1%", tone: "text-status-success", border: "border-outline-variant", progress: 42 },
];

const hiringTrend = [42, 48, 46, 53, 57, 61, 58, 66, 71, 68, 75, 79];
const turnoverTrend = [56, 52, 49, 47, 45, 43, 42, 39, 38, 36, 34, 32];
const absenteeismTrend = [30, 34, 31, 36, 33, 38, 35, 39, 37, 42, 40, 41];

const employeeDistribution = [
  ["Operations", "862", 36, "bg-primary"],
  ["Commercial", "514", 21, "bg-secondary"],
  ["Technology", "396", 16, "bg-secondary-container"],
  ["Corporate", "338", 14, "bg-outline"],
  ["Customer Success", "300", 13, "bg-surface-tint"],
] as const;

const departmentPerformance = [
  ["Technology", "91.4", "96%", "+4.2"],
  ["Operations", "84.8", "88%", "+1.1"],
  ["Commercial", "82.1", "79%", "-2.3"],
  ["Corporate", "87.6", "92%", "+2.8"],
  ["Customer Success", "89.2", "94%", "+3.5"],
] as const;

const trainingMatrix = [
  ["Leadership Track", "418 enrolled", 76, "bg-primary"],
  ["Compliance", "97% complete", 97, "bg-status-success"],
  ["Technical Upskilling", "642 enrolled", 68, "bg-secondary"],
  ["Safety & Operations", "91% complete", 91, "bg-secondary-container"],
] as const;

const competencies = [
  ["Leadership", "84.1", "+5.2"],
  ["Technical Depth", "88.6", "+3.8"],
  ["Execution", "86.9", "+2.1"],
  ["Customer Focus", "90.4", "+4.6"],
] as const;

const insights = [
  { icon: "psychology", label: "AI Workforce Recommendation", text: "Prioritize retention plans for senior operations roles in regions with overtime concentration.", tone: "text-secondary", bg: "bg-secondary-container/10" },
  { icon: "warning", label: "Retention Risk", text: "Commercial leadership layer shows elevated resignation probability over the next two cycles.", tone: "text-status-critical", bg: "bg-error-container/40" },
  { icon: "speed", label: "Productivity Alert", text: "Absenteeism and overtime correlation increased in Factory Cluster B for three consecutive weeks.", tone: "text-status-critical", bg: "bg-status-critical/10" },
  { icon: "data_thresholding", label: "Workforce Anomaly", text: "Training completion is high, but certification conversion is lagging in technology squads.", tone: "text-status-success", bg: "bg-status-success/10" },
];

const hrRows = [
  ["Executive Leadership", "Employees", "84", "98.2", "Stable"],
  ["Operations", "Departments", "862", "84.8", "Watch"],
  ["Factory Cluster B", "Attendance", "3.9%", "+0.7pp", "Monitor"],
  ["Commercial Directors", "Performance", "82.1", "-2.3", "Risk"],
  ["Technical Upskilling", "Training Records", "642", "68%", "Active"],
] as const;

export function HrAnalyticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="HR ANALYTICS"
        title="Executive People Analytics & Workforce Intelligence"
        actions={
          <>
            <button className="flex items-center gap-2 rounded-full border border-glass-stroke px-5 py-3 font-label-caps text-label-caps transition-all hover:bg-surface-container-low">
              <MaterialIcon name="business_center" className="text-[18px]" />
              GLOBAL WORKFORCE
            </button>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-caps text-label-caps text-white shadow-xl transition-all hover:shadow-primary/20">
              <MaterialIcon name="download" className="text-[18px]" />
              PEOPLE REPORT
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-6">
        {hrKpis.map((kpi) => (
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
          <SectionTitle title="Workforce Analytics" subtitle="Distribution, performance, hiring and workforce movement" icon="groups" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ChartHeader title="Hiring Trends" meta="New hires across trailing 12 months" />
              <BarChart values={hiringTrend} activeIndex={10} />
            </div>
            <div className="lg:col-span-5">
              <ChartHeader title="Employee Distribution" meta="2,410 active employees" />
              <div className="mt-6 space-y-4">
                {employeeDistribution.map(([label, value, percentage, color]) => (
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
            <PeopleMetric label="Turnover Evolution" value="-1.2pp" note="YoY voluntary attrition" positive />
            <PeopleMetric label="Absenteeism Trends" value="3.1%" note="Rolling 90 days" bordered />
            <PeopleMetric label="Department Score" value="86.2" note="Weighted performance" />
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-4">
          <SectionTitle title="Department Performance" subtitle="Score, staffing health and variance" icon="leaderboard" />
          <div className="mt-7 space-y-4">
            {departmentPerformance.map(([name, score, staffing, variance]) => (
              <div key={name} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-primary">{name}</span>
                  <span className="font-data-mono text-sm text-primary">{score}</span>
                </div>
                <div className="flex items-center justify-between font-data-mono text-[11px] text-outline">
                  <span>{staffing} staffing coverage</span>
                  <span className={variance.startsWith("-") ? "text-status-critical" : "text-status-success"}>{variance}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-7">
          <SectionTitle title="Training & Performance" subtitle="Certifications, matrix coverage and competency tracking" icon="workspace_premium" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <ChartHeader title="Evaluation Scores" meta="Training impact vs performance score" />
              <DualLineBars />
            </div>
            <div className="space-y-4">
              {trainingMatrix.map(([label, value, progress, color]) => (
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
          <SectionTitle title="Executive Insights" subtitle="Recommendations, risks, alerts and anomalies" icon="tips_and_updates" />
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
          <SectionTitle title="Competency Tracking" subtitle="Core capability maturity" icon="fact_check" />
          <div className="mt-7 space-y-4">
            {competencies.map(([name, score, change]) => (
              <div key={name} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-label-caps text-[10px] text-outline">{name}</span>
                  <span className="font-data-mono text-sm font-bold text-primary">{score}</span>
                </div>
                <div className="flex items-center justify-between">
                  <ProgressBar value={Number(score)} className="bg-secondary" />
                  <span className="ml-4 font-data-mono text-[11px] text-status-success">{change}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-8">
          <SectionTitle title="HR Tables" subtitle="Employees, departments, attendance, performance and training records" icon="table_chart" />
          <div className="hide-scrollbar mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-glass-stroke">
                  {["WORKFORCE LINE", "SECTION", "VALUE", "SCORE / VARIANCE", "STATUS"].map((heading) => (
                    <th key={heading} className="pb-4 font-label-caps text-[10px] text-outline">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm">
                {hrRows.map(([line, section, value, score, status]) => (
                  <tr key={line} className="border-b border-glass-stroke/60 transition-colors hover:bg-surface-container-low">
                    <td className="py-4 font-semibold text-primary">{line}</td>
                    <td className="py-4 text-on-surface-variant">{section}</td>
                    <td className="py-4 font-data-mono text-primary">{value}</td>
                    <td className={`py-4 font-data-mono ${score.startsWith("-") || score.startsWith("+0") ? "text-status-critical" : "text-status-success"}`}>{score}</td>
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
      <span className="font-data-mono text-[11px] text-outline">HCM MODEL</span>
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

function DualLineBars() {
  return (
    <div className="mt-6 grid h-64 grid-cols-6 items-end gap-3 border-b border-outline/10 pb-2">
      {turnoverTrend.slice(0, 6).map((value, index) => (
        <div key={`${value}-${index}`} className="flex h-full items-end gap-1">
          <div className="w-full rounded-t bg-secondary/70" style={{ height: `${value + 18}%` }} />
          <div className="w-full rounded-t bg-status-critical/35" style={{ height: `${absenteeismTrend[index] + 8}%` }} />
        </div>
      ))}
    </div>
  );
}

function PeopleMetric({ label, value, note, bordered = false, positive = false }: { label: string; value: string; note: string; bordered?: boolean; positive?: boolean }) {
  return (
    <div className={`text-center ${bordered ? "border-y border-glass-stroke py-4 md:border-x md:border-y-0 md:py-0" : ""}`}>
      <p className="font-label-caps text-[10px] text-outline">{label}</p>
      <p className={`font-data-mono text-headline-lg ${positive ? "text-status-success" : "text-primary"}`}>{value}</p>
      <p className="text-xs text-outline">{note}</p>
    </div>
  );
}
