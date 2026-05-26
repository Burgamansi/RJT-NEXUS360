import { GlassCard } from "../../shared/ui/GlassCard";
import { MaterialIcon } from "../../shared/ui/MaterialIcon";
import { PageHeader } from "../../shared/ui/PageHeader";
import { ProgressBar } from "../../shared/ui/ProgressBar";

const kpis = [
  { icon: "payments", label: "RECEITA CONSOLIDADA", value: "R$ 42,8 mi", trend: "12,4%", color: "bg-electric-blue", border: "border-electric-blue", progress: 75 },
  { icon: "precision_manufacturing", label: "EFICIÊNCIA OPERACIONAL", value: "94,8%", trend: "4,2%", color: "bg-secondary", border: "border-secondary", progress: 94 },
  { icon: "shield", label: "RISCO DO SISTEMA", value: "Baixo", trend: "Crítico", color: "bg-status-critical", border: "border-status-critical", progress: 25 },
  { icon: "groups", label: "QUADRO TOTAL", value: "2.410", trend: "+12 novos", color: "bg-primary", border: "border-primary", progress: 66 },
];

const activity = [
  { icon: "mail", source: "Diretoria", time: "há 14 min", text: "Resumo de desempenho do trimestre aprovado para acompanhamento da operação industrial.", tone: "text-secondary", bg: "bg-secondary-container/10" },
  { icon: "report_problem", source: "Alerta de segurança", time: "há 1 h", text: "Tentativa anômala de acesso bloqueada pela autenticação em duas etapas.", tone: "text-status-critical", bg: "bg-status-critical/10" },
  { icon: "rocket_launch", source: "RJT Nexus360", time: "há 2 h", text: "Sincronização concluída nos módulos de dados operacionais e financeiros.", tone: "text-status-success", bg: "bg-status-success/10" },
];

export function ExecutiveDashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resumo executivo"
        title="Visão estratégica da RJT Nexus360"
        actions={
          <>
            <button className="rounded-md border border-glass-stroke px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface-container-low">Exportar relatório</button>
            <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90">
              <MaterialIcon name="bolt" className="text-sm" />
              Central de comando
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
                <h3 className="font-title-md font-bold text-primary">Previsão operacional</h3>
              </div>
              <p className="mb-6 leading-relaxed text-on-surface/80">
                A análise da RJT indica aumento de 15% na demanda logística do próximo ciclo. Recomendação: antecipar capacidade de armazenagem em 12 dias.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white">Executar ação</button>
                <button className="rounded-md border border-glass-stroke px-4 py-2 text-xs font-semibold">Detalhar</button>
              </div>
            </GlassCard>

            <GlassCard className="border-l-4 border-status-success p-8">
              <div className="mb-6 flex items-center gap-3">
                <MaterialIcon name="eco" className="text-status-success" />
                <h3 className="font-title-md font-bold text-primary">Conformidade ESG</h3>
              </div>
              <div className="space-y-4">
                <MetricRow label="Índice de compensação" value="A+ (98,2)" />
                <MetricRow label="Fornecimento sustentável" value="82%" />
                <ProgressBar value={82} className="bg-status-success" />
              </div>
            </GlassCard>
          </div>

          <GlassCard className="flex min-h-[400px] flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-glass-stroke p-6">
              <h3 className="font-title-md font-bold text-primary">Desempenho industrial</h3>
              <div className="hidden gap-2 sm:flex">
                <div className="rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold text-outline">SINCRONIZADO</div>
                <div className="rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold text-outline">FILTROS: BRASIL</div>
              </div>
            </div>
            <div className="relative flex-1 overflow-hidden bg-surface-container-low">
              <img
                alt="Mapa logístico industrial"
                className="h-full w-full object-cover opacity-30 mix-blend-multiply"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3kzI04ibOSsnzTMBqTBoOPBaRLU4eM8MJYi6iCyPHkhjASd65RDL79JZjqJkFU1UNcOz9Rc0Sr8sv4F72MMUFewEEKpX7l8FL_VwunIyeAOULJgzv1F83_7ddywA-XbMsAX8SKsH0n1nLjrh5676YEyDle5t8PYgZyhTAAyE6IZCcDV3-h8lLvSXTvyq_1iSKMVH048lqtYfEwrKoTrK1YtIYV93O8npVhqXkZs_J_kABDmgJV9H_4NDon2AlOA6LPgGUVMyFjODt"
              />
              <div className="pulse-ring absolute left-1/3 top-1/4 h-4 w-4 rounded-full bg-electric-blue" />
              <div className="pulse-ring absolute bottom-1/2 right-1/4 h-4 w-4 rounded-full bg-status-success" />
              <div className="pulse-ring absolute left-1/2 top-2/3 h-4 w-4 rounded-full bg-secondary" />
              <div className="glass-card absolute bottom-6 left-6 max-w-xs rounded-xl border-electric-blue/30 p-4">
                <p className="mb-2 text-[10px] font-bold text-electric-blue">UNIDADE INDUSTRIAL 07</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">Vazão: 14,2 mil/h</span>
                  <MaterialIcon name="check_circle" className="text-sm text-status-success" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="flex min-h-[600px] flex-col xl:col-span-4">
          <div className="border-b border-glass-stroke p-6">
            <h3 className="font-title-md font-bold text-primary">Atividade executiva</h3>
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
              <p className="text-[10px] font-bold text-outline">Transações recentes</p>
              <MiniTransaction label="Serviços corporativos" value="-R$ 12,4 mil" icon="payments" />
              <MiniTransaction label="Recebimento bancário" value="+R$ 2,1 mi" icon="account_balance" positive />
            </div>
          </div>
          <div className="bg-surface-container-low/50 p-6">
            <button className="w-full rounded-md border border-glass-stroke py-3 text-xs font-semibold text-outline transition-colors hover:border-primary hover:text-primary">Ver auditoria completa</button>
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


