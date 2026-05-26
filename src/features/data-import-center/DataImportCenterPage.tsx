import { importModuleRegistry, importRegistrySummary } from "../../shared/data/importRegistry";
import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";

const importKpis = [
  { icon: "upload_file", label: "Files Ready", value: `${importRegistrySummary.readyModules}`, delta: "CSV/XLSX", tone: "text-secondary", border: "border-secondary", progress: 74 },
  { icon: "table_view", label: "Mapped Columns", value: `${importRegistrySummary.mappedColumns}`, delta: "required", tone: "text-status-success", border: "border-status-success", progress: 86 },
  { icon: "rule", label: "Validation Pass", value: `${importRegistrySummary.averageReadiness}%`, delta: "schema ready", tone: "text-status-success", border: "border-primary", progress: importRegistrySummary.averageReadiness },
  { icon: "error", label: "Data Issues", value: "A definir", delta: "runtime", tone: "text-outline", border: "border-status-critical", progress: 0 },
  { icon: "database", label: "Target Modules", value: `${importRegistrySummary.targetModules}`, delta: "active", tone: "text-secondary", border: "border-secondary-container", progress: 88 },
  { icon: "history", label: "Imports Month", value: "A definir", delta: "no backend", tone: "text-outline", border: "border-outline-variant", progress: 0 },
];

const importTrend = [42, 46, 49, 53, 58, 62, 66, 71, 76, 80, 84, 88];
const validationTrend = [64, 68, 72, 76, 79, 83];
const issueTrend = [42, 38, 35, 31, 28, 24];

const moduleTemplates = importModuleRegistry.map((item) => [item.module, item.formats, item.readiness, item.color] as const);
const mappingRules = importModuleRegistry.map((item) => [item.module, item.requiredColumns.slice(0, 6).join(", "), item.status] as const);
const validationChecks = [
  ["Required Fields", `${importRegistrySummary.averageReadiness}%`, importRegistrySummary.averageReadiness, "bg-status-success"],
  ["Date Format", "Template", 72, "bg-secondary"],
  ["Currency Parsing", "Template", 68, "bg-primary"],
  ["Duplicate Rows", "A definir", 0, "bg-status-critical"],
] as const;

const insights = [
  { icon: "psychology", label: "AI Import Recommendation", text: "Padronizar Compras primeiro: esse Excel sera a ponte entre fornecedores, estoque e orcamento.", tone: "text-secondary", bg: "bg-secondary-container/10" },
  { icon: "warning", label: "Data Quality Alert", text: "Arquivos financeiros usam CSV valido, mas o XLSX original nao abriu como pasta de trabalho padrao.", tone: "text-status-critical", bg: "bg-error-container/40" },
  { icon: "monitoring", label: "Mapping Risk", text: "Campos de valor, data e centro de custo precisam de normalizacao antes de alimentar dashboards consolidados.", tone: "text-status-critical", bg: "bg-status-critical/10" },
  { icon: "stars", label: "Strategic Highlight", text: "RH ja possui estrutura suficiente para importacao inicial: indicadores, atestados e turnover.", tone: "text-status-success", bg: "bg-status-success/10" },
];

const importRows = importModuleRegistry.map((item) => [item.source, item.module, `${item.requiredColumns.length} cols`, item.status, item.formats] as const);

export function DataImportCenterPage() {
  return (
    <>
      <PageHeader
        eyebrow="DATA IMPORT CENTER"
        title="Excel & CSV Intake for Nexus360 Modules"
        actions={
          <>
            <button className="flex items-center gap-2 rounded-full border border-glass-stroke px-5 py-3 font-label-caps text-label-caps transition-all hover:bg-surface-container-low">
              <MaterialIcon name="upload_file" className="text-[18px]" />
              IMPORT TEMPLATE
            </button>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-caps text-label-caps text-white shadow-xl transition-all hover:shadow-primary/20">
              <MaterialIcon name="rule" className="text-[18px]" />
              VALIDATION CENTER
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-6">
        {importKpis.map((kpi) => (
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
          <SectionTitle title="Import Pipeline" subtitle="Upload, mapping, validation and module routing" icon="account_tree" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ChartHeader title="Import Throughput" meta="Arquivos processados por ciclo" />
              <BarChart values={importTrend} activeIndex={10} />
            </div>
            <div className="lg:col-span-5">
              <ChartHeader title="Module Templates" meta="Cobertura de mapeamento por area" />
              <div className="mt-6 space-y-4">
                {moduleTemplates.map(([label, value, percentage, color]) => (
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
            <ImportMetric label="Upload" value="CSV/XLSX" note="Formatos aceitos" />
            <ImportMetric label="Mapping" value={`${importRegistrySummary.mappedColumns}`} note="Colunas obrigatorias" bordered />
            <ImportMetric label="Validation" value={`${importRegistrySummary.averageReadiness}%`} note="Schema readiness" positive />
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-4">
          <SectionTitle title="Column Mapping" subtitle="Campos obrigatorios por modulo" icon="view_column" />
          <div className="mt-7 space-y-4">
            {mappingRules.map(([module, fields, status]) => (
              <div key={module} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-primary">{module}</span>
                  <span className={status === "Ready" ? "font-data-mono text-[11px] text-status-success" : "font-data-mono text-[11px] text-status-critical"}>{status}</span>
                </div>
                <p className="text-xs leading-relaxed text-on-surface-variant">{fields}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-7">
          <SectionTitle title="Validation Center" subtitle="Required fields, formats, currency parsing and duplicates" icon="rule" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <ChartHeader title="Validation vs Issues" meta="Qualidade de dados por importacao" />
              <DualBarChart />
            </div>
            <div className="space-y-4">
              {validationChecks.map(([label, value, progress, color]) => (
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
          <SectionTitle title="Executive Insights" subtitle="Recomendacoes e riscos de qualidade dos dados" icon="tips_and_updates" />
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
          <SectionTitle title="Import History" subtitle="Arquivos, modulo destino, status, colunas e tipo" icon="table_chart" />
          <div className="hide-scrollbar mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-glass-stroke">
                  {["FILE", "TARGET MODULE", "REQUIRED", "STATUS", "TYPE"].map((heading) => (
                    <th key={heading} className="pb-4 font-label-caps text-[10px] text-outline">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm">
                {importRows.map(([file, module, size, status, type]) => (
                  <tr key={file} className="border-b border-glass-stroke/60 transition-colors hover:bg-surface-container-low">
                    <td className="py-4 font-semibold text-primary">{file}</td>
                    <td className="py-4 text-on-surface-variant">{module}</td>
                    <td className="py-4 font-data-mono text-primary">{size}</td>
                    <td className={`py-4 font-data-mono ${status === "Ready" ? "text-status-success" : "text-status-critical"}`}>{status}</td>
                    <td className="py-4">
                      <span className="rounded bg-surface-container px-2 py-1 font-label-caps text-[9px] text-primary">{type}</span>
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
      <span className="font-data-mono text-[11px] text-outline">IMPORT MODEL</span>
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
      {validationTrend.map((value, index) => (
        <div key={`${value}-${index}`} className="flex h-full items-end gap-1">
          <div className="w-full rounded-t bg-secondary/70" style={{ height: `${value + 4}%` }} />
          <div className="w-full rounded-t bg-status-critical/35" style={{ height: `${issueTrend[index] + 12}%` }} />
        </div>
      ))}
    </div>
  );
}

function ImportMetric({ label, value, note, bordered = false, positive = false }: { label: string; value: string; note: string; bordered?: boolean; positive?: boolean }) {
  return (
    <div className={`text-center ${bordered ? "border-y border-glass-stroke py-4 md:border-x md:border-y-0 md:py-0" : ""}`}>
      <p className="font-label-caps text-[10px] text-outline">{label}</p>
      <p className={`font-data-mono text-headline-lg ${positive ? "text-status-success" : "text-primary"}`}>{value}</p>
      <p className="text-xs text-outline">{note}</p>
    </div>
  );
}
