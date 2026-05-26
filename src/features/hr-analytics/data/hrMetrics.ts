import { hrAbsenceRecords, hrMonthlyConsolidated, hrTerminationRecords } from "./hrSampleData";
import type { HrAnalyticsView, HrMonthlyConsolidated } from "./hrTypes";

const currentMonth = hrMonthlyConsolidated[hrMonthlyConsolidated.length - 1];
const previousMonth = hrMonthlyConsolidated[hrMonthlyConsolidated.length - 2];

const totalAbsenceHours = (month: HrMonthlyConsolidated) => month.justifiedHours + month.unjustifiedHours + month.delayHours;
const absenceRate = (month: HrMonthlyConsolidated) => (totalAbsenceHours(month) / month.workedHours) * 100;
const percentageDelta = (current: number, previous: number) => current - previous;
const formatNumber = (value: number) => new Intl.NumberFormat("pt-BR").format(value);
const formatPercent = (value: number) => `${value.toFixed(1)}%`;
const formatPointDelta = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}pp`;

const scaleSeries = (values: number[], minHeight = 26, maxHeight = 82) => {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return values.map(() => Math.round((minHeight + maxHeight) / 2));
  }

  return values.map((value) => Math.round(minHeight + ((value - min) / (max - min)) * (maxHeight - minHeight)));
};

const turnoverDelta = percentageDelta(currentMonth.turnoverRate, currentMonth.turnoverTarget);
const absenteeismDelta = percentageDelta(absenceRate(currentMonth), absenceRate(previousMonth));
const resignationRiskCount = hrTerminationRecords.filter((record) => record.reason.toLowerCase().includes("salario")).length;
const medicalCategories = new Set(hrAbsenceRecords.map((record) => record.category)).size;

export const hrAnalyticsView: HrAnalyticsView = {
  kpis: [
    {
      icon: "groups",
      label: "Headcount",
      value: formatNumber(currentMonth.headcount),
      delta: `${currentMonth.headcount - previousMonth.headcount}`,
      tone: currentMonth.headcount >= previousMonth.headcount ? "text-status-success" : "text-status-critical",
      border: "border-secondary",
      progress: Math.min(currentMonth.headcount * 2, 100),
    },
    {
      icon: "person_remove",
      label: "Turnover",
      value: formatPercent(currentMonth.turnoverRate),
      delta: formatPointDelta(turnoverDelta),
      tone: turnoverDelta <= 0 ? "text-status-success" : "text-status-critical",
      border: turnoverDelta <= 0 ? "border-status-success" : "border-status-critical",
      progress: Math.min(Math.round(currentMonth.turnoverRate * 4), 100),
    },
    {
      icon: "event_busy",
      label: "Absenteeism",
      value: formatPercent(absenceRate(currentMonth)),
      delta: formatPointDelta(absenteeismDelta),
      tone: absenteeismDelta <= 0 ? "text-status-success" : "text-status-critical",
      border: absenteeismDelta <= 0 ? "border-status-success" : "border-status-critical",
      progress: Math.min(Math.round(absenceRate(currentMonth) * 9), 100),
    },
    {
      icon: "school",
      label: "Training Hours",
      value: "A definir",
      delta: "sem fonte",
      tone: "text-outline",
      border: "border-secondary-container",
      progress: 0,
    },
    {
      icon: "workspace_premium",
      label: "Performance Score",
      value: "A definir",
      delta: "sem fonte",
      tone: "text-outline",
      border: "border-primary",
      progress: 0,
    },
    {
      icon: "schedule",
      label: "Overtime Cost",
      value: "A definir",
      delta: "sem fonte",
      tone: "text-outline",
      border: "border-outline-variant",
      progress: 0,
    },
  ],
  hiringTrend: scaleSeries(hrMonthlyConsolidated.map((month) => month.hires)),
  turnoverTrend: scaleSeries(hrMonthlyConsolidated.map((month) => month.turnoverRate), 32, 78),
  absenteeismTrend: scaleSeries(hrMonthlyConsolidated.map((month) => absenceRate(month)), 30, 74),
  employeeDistribution: [
    ["Costura", "18", 36, "bg-primary"],
    ["Linha de producao", "14", 28, "bg-secondary"],
    ["Corte", "8", 16, "bg-secondary-container"],
    ["Administrativo", "6", 12, "bg-outline"],
    ["Apoio operacional", "4", 8, "bg-surface-tint"],
  ],
  departmentPerformance: [
    ["Costura", "A definir", "36%", "+0.0"],
    ["Linha de producao", "A definir", "28%", "+0.0"],
    ["Corte", "A definir", "16%", "+0.0"],
    ["Administrativo", "A definir", "12%", "+0.0"],
    ["Apoio operacional", "A definir", "8%", "+0.0"],
  ],
  trainingMatrix: [
    ["Certificacoes", "fonte pendente", 0, "bg-primary"],
    ["Treinamentos obrigatorios", "fonte pendente", 0, "bg-status-success"],
    ["Matriz de competencias", "fonte pendente", 0, "bg-secondary"],
    ["Avaliacoes tecnicas", "fonte pendente", 0, "bg-secondary-container"],
  ],
  competencies: [
    ["Produtividade", "A definir", "+0.0"],
    ["Disciplina operacional", "A definir", "+0.0"],
    ["Qualidade de execucao", "A definir", "+0.0"],
    ["Seguranca", "A definir", "+0.0"],
  ],
  insights: [
    {
      icon: "psychology",
      label: "AI Workforce Recommendation",
      text: "Priorizar plano de retencao e entrevistas estruturadas para funcoes operacionais com turnover acima da meta.",
      tone: "text-secondary",
      bg: "bg-secondary-container/10",
    },
    {
      icon: "warning",
      label: "Retention Risk",
      text: `${resignationRiskCount} desligamento ligado a salario ou beneficios ja aparece na amostra de turnover analisada.`,
      tone: "text-status-critical",
      bg: "bg-error-container/40",
    },
    {
      icon: "speed",
      label: "Productivity Alert",
      text: `Absenteismo de ${formatPercent(absenceRate(currentMonth))} em ${currentMonth.month}, com ${formatNumber(totalAbsenceHours(currentMonth))} horas entre justificadas, nao justificadas e atrasos.`,
      tone: "text-status-critical",
      bg: "bg-status-critical/10",
    },
    {
      icon: "data_thresholding",
      label: "Workforce Anomaly",
      text: `${medicalCategories} categorias de atestados foram identificadas; usar esta base para cruzar ausencia, funcao e area.`,
      tone: "text-status-success",
      bg: "bg-status-success/10",
    },
  ],
  tableRows: [
    ["Consolidado RH", "Employees", formatNumber(currentMonth.headcount), formatPercent(currentMonth.turnoverRate), "Active"],
    ["Indicadores RH 2026", "Departments", `${currentMonth.hires} adm / ${currentMonth.terminations} dem`, formatPointDelta(turnoverDelta), "Risk"],
    ["Controle de Atestados", "Attendance", formatPercent(absenceRate(currentMonth)), formatPointDelta(absenteeismDelta), "Monitor"],
    ["Turnover 2026", "Performance", `${hrTerminationRecords.length} registros`, `${resignationRiskCount} risco`, "Watch"],
    ["Training Records", "Training Records", "fonte pendente", "A definir", "Pending"],
  ],
};
