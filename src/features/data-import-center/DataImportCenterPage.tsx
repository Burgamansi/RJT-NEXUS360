import { useMemo, useState, type DragEvent } from "react";
import { useLiveImport } from "../../shared/data/liveImport/LiveImportContext";
import type { EnterpriseModule } from "../../shared/data/liveImport/types";
import { importModuleRegistry, importRegistrySummary } from "../../shared/data/importRegistry";
import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";

const importTrend = [42, 46, 49, 53, 58, 62, 66, 71, 76, 80, 84, 88];
const validationTrend = [64, 68, 72, 76, 79, 83];
const issueTrend = [42, 38, 35, 31, 28, 24];

const moduleTemplates = importModuleRegistry.map((item) => [item.module, item.formats, item.readiness, item.color] as const);
const mappingRules = importModuleRegistry.map((item) => [item.module, item.requiredColumns.slice(0, 6).join(", "), item.status] as const);
const validationChecks = [
  ["Campos obrigatórios", `${importRegistrySummary.averageReadiness}%`, importRegistrySummary.averageReadiness, "bg-status-success"],
  ["Formato de data", "Template", 72, "bg-secondary"],
  ["Leitura de moeda", "Template", 68, "bg-primary"],
  ["Duplicate Linhas", "A definir", 0, "bg-status-critical"],
] as const;

const insights = [
  { icon: "psychology", label: "Recomendação de importação por IA", text: "Padronizar Compras primeiro: esse Excel sera a ponte entre fornecedores, estoque e orcamento.", tone: "text-secondary", bg: "bg-secondary-container/10" },
  { icon: "warning", label: "Alerta de qualidade dos dados", text: "Arquivos financeiros usam CSV valido, mas o XLSX original nao abriu como pasta de trabalho padrao.", tone: "text-status-critical", bg: "bg-erro-container/40" },
  { icon: "monitoring", label: "Risco de mapeamento", text: "Campos de valor, data e centro de custo precisam de normalizacao antes de alimentar dashboards consolidados.", tone: "text-status-critical", bg: "bg-status-critical/10" },
  { icon: "stars", label: "Destaque estratégico", text: "RH ja possui estrutura suficiente para importa??o inicial: indicadores, atestados e turnover.", tone: "text-status-success", bg: "bg-status-success/10" },
];

const importLinhas = importModuleRegistry.map((item) => [item.source, item.module, `${item.requiredColumns.length} cols`, item.status, item.formats] as const);
const moduleOptions: { value: EnterpriseModule; label: string }[] = [
  { value: "financial", label: "Inteligência financeira" },
  { value: "hr", label: "Análise de pessoas" },
  { value: "purchasing", label: "Inteligência de compras" },
  { value: "operations", label: "Análise operacional" },
];

export function DataImportCenterPage() {
  const { activeDataset, activeDatasetId, datasets, importFile, setActiveDatasetId, updateMapping } = useLiveImport();
  const [selectedModule, setSelectedModule] = useState<EnterpriseModule>("financial");
  const prontoDatasets = datasets.filter((dataset) => dataset.status === "pronto");
  const latestProgresso = activeDataset?.progress ?? 0;
  const issueCount = datasets.reduce((total, dataset) => total + dataset.issues.filter((issue) => issue.severity !== "info").length, 0);
  const dynamicImportKpis = [
    { icon: "upload_file", label: "Arquivos prontos", value: `${prontoDatasets.length}`, delta: "CSV/XLSX", tone: "text-secondary", border: "border-secondary", progress: Math.min(prontoDatasets.length * 24, 100) },
    { icon: "table_view", label: "Colunas mapeadas", value: `${activeDataset ? Object.keys(activeDataset.mappings).length : importRegistrySummary.mappedColumns}`, delta: "mapa ativo", tone: "text-status-success", border: "border-status-success", progress: activeDataset ? Math.min(Object.keys(activeDataset.mappings).length * 18, 100) : 86 },
    { icon: "rule", label: "Validação aprovada", value: activeDataset?.status === "pronto" ? "100%" : `${importRegistrySummary.averageReadiness}%`, delta: "schema pronto", tone: "text-status-success", border: "border-primary", progress: activeDataset?.status === "pronto" ? 100 : importRegistrySummary.averageReadiness },
    { icon: "erro", label: "Pendências de dados", value: `${issueCount}`, delta: "execução", tone: issueCount > 0 ? "text-status-critical" : "text-outline", border: "border-status-critical", progress: Math.min(issueCount * 10, 100) },
    { icon: "database", label: "Linhas importadas", value: `${datasets.reduce((total, dataset) => total + dataset.rows.length, 0)}`, delta: "camada local", tone: "text-secondary", border: "border-secondary-container", progress: latestProgresso },
    { icon: "history", label: "Importações no mês", value: `${datasets.length}`, delta: "navegador", tone: "text-outline", border: "border-outline-variant", progress: Math.min(datasets.length * 20, 100) },
  ];
  const previewLinhas = useMemo(() => activeDataset?.rows.slice(0, 8) ?? [], [activeDataset]);
  const previewColumns = activeDataset?.columns.slice(0, 8) ?? [];
  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      void importFile(file, selectedModule);
    }
  };
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  return (
    <>
      <PageHeader
        eyebrow="Central de importação de dados"
        title="Entrada de Excel e CSV para módulos Nexus360"
        actions={
          <>
            <button className="flex items-center gap-2 rounded-full border border-glass-stroke px-5 py-3 font-label-caps text-label-caps transition-all hover:bg-surface-container-low">
              <MaterialIcon name="upload_file" className="text-[18px]" />
              Importar modelo
            </button>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-caps text-label-caps text-white shadow-xl transition-all hover:shadow-primary/20">
              <MaterialIcon name="rule" className="text-[18px]" />
              Central de validação
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-6">
        {dynamicImportKpis.map((kpi) => (
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
        <GlassCard className="p-8 xl:col-span-5">
          <SectionTitle title="Console de importação" subtitle="Arraste, leia, valide e direcione arquivos corporativos" icon="cloud_upload" />
          <div className="mt-6 space-y-5">
            <label
              className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-outline/40 bg-white/50 px-6 text-center transition-colors hover:bg-surface-container-low"
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <MaterialIcon name="upload_file" className="text-[42px] text-secondary" />
              <span className="mt-4 font-title-md font-bold text-primary">Solte um arquivo Excel ou CSV</span>
              <span className="mt-2 max-w-sm text-sm text-on-surface-variant">CSV files parse in-navegador now. XLSX/XLSM files are accepted and validated through the parser adapter.</span>
              <input className="sr-only" type="file" accept=".csv,.txt,.xlsx,.xls,.xlsm" onChange={(event) => handleFiles(event.target.files)} />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="font-label-caps text-[10px] text-outline">Módulo de destino</span>
                <select
                  className="w-full rounded-lg border border-glass-stroke bg-white px-4 py-3 text-sm text-primary outline-none"
                  value={selectedModule}
                  onChange={(event) => setSelectedModule(event.target.value as EnterpriseModule)}
                >
                  {moduleOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="font-label-caps text-[10px] text-outline">Base ativa</span>
                <select
                  className="w-full rounded-lg border border-glass-stroke bg-white px-4 py-3 text-sm text-primary outline-none"
                  value={activeDatasetId ?? ""}
                  onChange={(event) => setActiveDatasetId(event.target.value)}
                >
                  {datasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.id}>{dataset.fileName}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-7">
          <SectionTitle title="Status da leitura" subtitle="Progresso, mensagens de validação e prévia normalizada" icon="schema" />
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ImportMetric label="Status" value={activeDataset?.status.toUpperCase() ?? "PRONTO"} note={activeDataset?.module ?? "financial"} />
            <ImportMetric label="Linhas" value={`${activeDataset?.rows.length ?? 0}`} note={activeDataset?.fileName ?? "carregando base real"} bordered />
            <ImportMetric label="Progresso" value={`${activeDataset?.progress ?? 0}%`} note={activeDataset?.source ?? "local"} positive={activeDataset?.status === "pronto"} />
          </div>
          <div className="mt-6">
            <ProgressBar value={activeDataset?.progress ?? 0} className={activeDataset?.status === "erro" ? "bg-status-critical" : "bg-secondary"} />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {(activeDataset?.issues ?? []).slice(0, 6).map((issue) => (
              <div key={`${issue.severity}-${issue.message}`} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                <span className={`font-data-mono text-[11px] ${issue.severity === "erro" ? "text-status-critical" : issue.severity === "warning" ? "text-secondary" : "text-outline"}`}>{issue.severity.toUpperCase()}</span>
                <p className="mt-2 text-sm text-on-surface-variant">{issue.message}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-4">
          <SectionTitle title="Mapeamento de colunas" subtitle="Mapeie campos de negócio para colunas importadas" icon="view_column" />
          <div className="mt-6 space-y-4">
            {["valor", "tipo", "fornecedor", "categoria", "data", "centro"].map((field) => (
              <label key={field} className="block space-y-2">
                <span className="font-label-caps text-[10px] text-outline">{field}</span>
                <select
                  className="w-full rounded-lg border border-glass-stroke bg-white px-4 py-3 text-sm text-primary outline-none"
                  value={activeDataset?.mappings[field] ?? ""}
                  onChange={(event) => activeDataset && updateMapping(activeDataset.id, field, event.target.value)}
                >
                  <option value="">Não mapeado</option>
                  {(activeDataset?.columns ?? []).map((column) => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-8">
          <SectionTitle title="Prévia da tabela" subtitle="Primeiras linhas da base ativa normalizada" icon="table_view" />
          <div className="hide-scrollbar mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-glass-stroke">
                  {previewColumns.map((column) => (
                    <th key={column} className="pb-4 font-label-caps text-[10px] text-outline">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm">
                {previewLinhas.map((row, index) => (
                  <tr key={`${activeDataset?.id}-${index}`} className="border-b border-glass-stroke/60">
                    {previewColumns.map((column) => (
                      <td key={column} className="max-w-[220px] truncate py-4 pr-4 text-on-surface-variant">{String(row[column] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      <section className="mt-gutter grid grid-cols-1 gap-gutter xl:grid-cols-12">
        <GlassCard className="p-8 xl:col-span-8">
          <SectionTitle title="Pipeline de importação" subtitle="Upload, mapeamento, validação e roteamento por módulo" icon="account_tree" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ChartHeader title="Volume de importação" meta="Arquivos processados por ciclo" />
              <BarChart values={importTrend} activeIndex={10} />
            </div>
            <div className="lg:col-span-5">
              <ChartHeader title="Modelos por módulo" meta="Cobertura de mapeamento por area" />
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
            <ImportMetric label="Mapeamento" value={`${importRegistrySummary.mappedColumns}`} note="Colunas obrigat?rias" bordered />
            <ImportMetric label="Validação" value={`${importRegistrySummary.averageReadiness}%`} note="Schema pronto" positive />
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-4">
          <SectionTitle title="Mapeamento de colunas" subtitle="Campos obrigat?rios por m?dulo" icon="view_column" />
          <div className="mt-7 space-y-4">
            {mappingRules.map(([module, fields, status]) => (
              <div key={module} className="rounded-lg border border-glass-stroke bg-white/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-primary">{module}</span>
                  <span className={status === "Pronto" ? "font-data-mono text-[11px] text-status-success" : "font-data-mono text-[11px] text-status-critical"}>{status}</span>
                </div>
                <p className="text-xs leading-relaxed text-on-surface-variant">{fields}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 xl:col-span-7">
          <SectionTitle title="Validação Center" subtitle="Campos obrigatórios, formatos, moeda e duplicidades" icon="rule" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <ChartHeader title="Validação vs Issues" meta="Qualidade de dados por importa??o" />
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
          <SectionTitle title="Insights executivos" subtitle="Recomenda??es e riscos de qualidade dos dados" icon="tips_and_updates" />
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
          <SectionTitle title="Histórico de importação" subtitle="Arquivos, m?dulo destino, status, colunas e tipo" icon="table_chart" />
          <div className="hide-scrollbar mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-glass-stroke">
                  {["ARQUIVO", "MÓDULO", "OBRIGATÓRIO", "STATUS", "TIPO"].map((heading) => (
                    <th key={heading} className="pb-4 font-label-caps text-[10px] text-outline">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm">
                {importLinhas.map(([file, module, size, status, type]) => (
                  <tr key={file} className="border-b border-glass-stroke/60 transition-colors hover:bg-surface-container-low">
                    <td className="py-4 font-semibold text-primary">{file}</td>
                    <td className="py-4 text-on-surface-variant">{module}</td>
                    <td className="py-4 font-data-mono text-primary">{size}</td>
                    <td className={`py-4 font-data-mono ${status === "Pronto" ? "text-status-success" : "text-status-critical"}`}>{status}</td>
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
      <span className="font-data-mono text-[11px] text-outline">MODELO DE IMPORTAÇÃO</span>
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


