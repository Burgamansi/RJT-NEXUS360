import { downtimeRecords, productionRecords } from "./operationsSampleData";
import type { OperationsAnalyticsView } from "./operationsTypes";

const formatNumber = (value: number) => new Intl.NumberFormat("pt-BR").format(value);
const totalProduced = productionRecords.reduce((total, record) => total + record.producedUnits, 0);
const totalPlanned = productionRecords.reduce((total, record) => total + record.plannedUnits, 0);
const totalScrap = productionRecords.reduce((total, record) => total + record.scrapUnits, 0);
const totalPlannedMinutes = productionRecords.reduce((total, record) => total + record.plannedMinutes, 0);
const totalDowntimeMinutes = productionRecords.reduce((total, record) => total + record.downtimeMinutes, 0);
const operationalEfficiency = (totalProduced / totalPlanned) * 100;
const availability = ((totalPlannedMinutes - totalDowntimeMinutes) / totalPlannedMinutes) * 100;
const qualityYield = ((totalProduced - totalScrap) / totalProduced) * 100;
const averageCycleEfficiency = productionRecords.reduce((total, record) => total + record.cycleEfficiency, 0) / productionRecords.length;
const oee = (availability / 100) * (averageCycleEfficiency / 100) * (qualityYield / 100) * 100;
const scrapRate = (totalScrap / totalProduced) * 100;
const bottleneckLine = productionRecords.find((record) => record.status === "bottleneck");

const scaleSeries = (values: number[], minHeight = 26, maxHeight = 91) => {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return values.map(() => Math.round((minHeight + maxHeight) / 2));
  }

  return values.map((value) => Math.round(minHeight + ((value - min) / (max - min)) * (maxHeight - minHeight)));
};

const downtimeTotal = downtimeRecords.reduce((total, record) => total + record.minutes, 0);
const downtimeColors = ["bg-primary", "bg-secondary", "bg-status-critical", "bg-secondary-container", "bg-outline"];

export const operationsAnalyticsView: OperationsAnalyticsView = {
  kpis: [
    { icon: "precision_manufacturing", label: "Production Volume", value: formatNumber(totalProduced), delta: `${formatNumber(totalProduced - totalPlanned)} vs plan`, tone: totalProduced >= totalPlanned ? "text-status-success" : "text-status-critical", border: "border-secondary", progress: Math.min(Math.round(operationalEfficiency), 100) },
    { icon: "speed", label: "Operational Efficiency", value: `${operationalEfficiency.toFixed(1)}%`, delta: "-7.4pp", tone: "text-status-critical", border: "border-status-success", progress: Math.round(operationalEfficiency) },
    { icon: "query_stats", label: "OEE", value: `${oee.toFixed(1)}%`, delta: "local", tone: "text-secondary", border: "border-primary", progress: Math.round(oee) },
    { icon: "timer_off", label: "Downtime", value: `${(totalDowntimeMinutes / 60).toFixed(1)}h`, delta: `${formatNumber(totalDowntimeMinutes)} min`, tone: "text-status-critical", border: "border-outline-variant", progress: Math.min(Math.round((totalDowntimeMinutes / totalPlannedMinutes) * 100), 100) },
    { icon: "report_problem", label: "Scrap Rate", value: `${scrapRate.toFixed(1)}%`, delta: `${formatNumber(totalScrap)} units`, tone: "text-status-critical", border: "border-status-critical", progress: Math.round(scrapRate * 10) },
    { icon: "trending_up", label: "Productivity Index", value: `${Math.round(operationalEfficiency * 1.12)}`, delta: "local", tone: "text-status-success", border: "border-secondary-container", progress: Math.min(Math.round(operationalEfficiency), 100) },
  ],
  productionTrend: scaleSeries(productionRecords.map((record) => record.producedUnits)),
  efficiencyTrend: scaleSeries(productionRecords.map((record) => record.cycleEfficiency), 54, 89),
  downtimeTrend: scaleSeries(productionRecords.map((record) => record.downtimeMinutes), 26, 64),
  downtimeAnalysis: downtimeRecords.map((record, index) => [
    record.reason,
    `${(record.minutes / 60).toFixed(1)}h`,
    Math.round((record.minutes / downtimeTotal) * 100),
    downtimeColors[index] ?? "bg-outline",
  ]),
  linePerformance: productionRecords.map((record) => [
    record.line,
    `${record.cycleEfficiency.toFixed(1)}%`,
    `${(((record.plannedMinutes - record.downtimeMinutes) / record.plannedMinutes) * record.cycleEfficiency * ((record.producedUnits - record.scrapUnits) / record.producedUnits) / 100).toFixed(1)}%`,
    record.status === "bottleneck" ? "Bottleneck" : record.status === "watch" ? "Watch" : "Optimal",
  ]),
  productionMonitoring: [
    ["Machine Availability", `${availability.toFixed(1)}%`, Math.round(availability), "bg-status-success"],
    ["Production Capacity", `${operationalEfficiency.toFixed(1)}%`, Math.round(operationalEfficiency), "bg-secondary"],
    ["Process Stability", `${averageCycleEfficiency.toFixed(1)}%`, Math.round(averageCycleEfficiency), "bg-primary"],
    ["Quality Yield", `${qualityYield.toFixed(1)}%`, Math.round(qualityYield), "bg-secondary-container"],
  ],
  insights: [
    { icon: "psychology", label: "AI Operational Recommendation", text: "Priorizar plano de recuperacao para a Line C antes de expandir capacidade nas demais linhas.", tone: "text-secondary", bg: "bg-secondary-container/10" },
    { icon: "timer_off", label: "Downtime Alert", text: `Paradas somam ${(totalDowntimeMinutes / 60).toFixed(1)}h na amostra operacional local.`, tone: "text-status-critical", bg: "bg-error-container/40" },
    { icon: "monitoring", label: "Efficiency Anomaly", text: `${bottleneckLine?.line ?? "Linha critica"} apresenta eficiencia abaixo das demais linhas e deve ser tratada como restricao operacional.`, tone: "text-status-critical", bg: "bg-status-critical/10" },
    { icon: "account_tree", label: "Bottleneck Detection", text: `${bottleneckLine?.machine ?? "Maquina critica"} concentra o principal risco de gargalo na base local.`, tone: "text-status-success", bg: "bg-status-success/10" },
  ],
  tableRows: [
    [productionRecords[0].productionOrder, "Production Orders", `${formatNumber(productionRecords[0].producedUnits)} units`, "On schedule", "Released"],
    [productionRecords[0].machine, "Machine Logs", `${availability.toFixed(1)}%`, "Healthy", "Running"],
    [`${bottleneckLine?.line ?? "Line"} Hold`, "Downtime Records", `${((bottleneckLine?.downtimeMinutes ?? 0) / 60).toFixed(1)}h`, "+18m", "Bottleneck"],
    ["Shift B Output", "Productivity Reports", `${Math.round(operationalEfficiency * 1.12)}`, "+8.7", "Ahead"],
    ["Packaging Cell", "Operational History", `${oee.toFixed(1)}%`, "-2.1pp", "Watch"],
  ],
};
