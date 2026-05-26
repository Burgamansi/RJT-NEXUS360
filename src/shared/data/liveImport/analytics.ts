import { financialAnalyticsView as financialFallback } from "../../../features/financial-intelligence/data/financialMetrics";
import type { FinancialAnalyticsView } from "../../../features/financial-intelligence/data/financialTypes";
import { hrAnalyticsView as hrFallback } from "../../../features/hr-analytics/data/hrMetrics";
import type { HrAnalyticsView } from "../../../features/hr-analytics/data/hrTypes";
import { operationsAnalyticsView as operationsFallback } from "../../../features/operations-analytics/data/operationsMetrics";
import type { OperationsAnalyticsView } from "../../../features/operations-analytics/data/operationsTypes";
import { purchasingAnalyticsView as purchasingFallback } from "../../../features/purchasing-intelligence/data/purchasingMetrics";
import type { PurchasingAnalyticsView } from "../../../features/purchasing-intelligence/data/purchasingTypes";
import type { SpreadsheetRow } from "../normalization/types";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  maximumFractionDigits: 0,
  style: "currency",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");
const colors = ["bg-primary", "bg-secondary", "bg-secondary-container", "bg-outline", "bg-surface-tint"];

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatNumber = (value: number) => numberFormatter.format(value);

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getColumn = (row: SpreadsheetRow, candidates: string[]) => {
  const entries = Object.entries(row);
  const found = entries.find(([key]) => candidates.some((candidate) => normalize(key).includes(candidate)));
  return found?.[1];
};

const toText = (value: unknown) => (value == null ? "" : String(value).trim());

const parseNumber = (value: unknown) => {
  const text = toText(value);
  if (!text) {
    return 0;
  }

  const normalized = text
    .replace(/R\$/gi, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  return Number(normalized) || 0;
};

const scaleSeries = (values: number[], minHeight = 28, maxHeight = 92) => {
  if (values.length === 0) {
    return [28, 28, 28];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    return values.map(() => Math.round((minHeight + maxHeight) / 2));
  }

  return values.map((value) => Math.round(minHeight + ((value - min) / (max - min)) * (maxHeight - minHeight)));
};

const topGroups = (rows: SpreadsheetRow[], labelCandidates: string[], valueCandidates: string[], max = 5) => {
  const groups = new Map<string, number>();

  rows.forEach((row) => {
    const label = toText(getColumn(row, labelCandidates)) || "Nao classificado";
    const value = Math.abs(parseNumber(getColumn(row, valueCandidates)));
    groups.set(label, (groups.get(label) ?? 0) + value);
  });

  return Array.from(groups.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, max);
};

export function buildFinancialAnalyticsView(rows: SpreadsheetRow[]): FinancialAnalyticsView {
  if (rows.length === 0) {
    return financialFallback;
  }

  const enriched = rows.map((row) => {
    const rawType = normalize(toText(getColumn(row, ["tipo"])));
    const amount = parseNumber(getColumn(row, ["valor real", "valor"]));
    const isEntry = rawType.includes("entrada") || normalize(toText(getColumn(row, ["dre"]))).includes("receita");
    return { amount, signedAmount: isEntry ? amount : -Math.abs(amount), row };
  });

  const totalReceita = enriched.filter((item) => item.signedAmount > 0).reduce((total, item) => total + item.signedAmount, 0);
  const totalExpense = Math.abs(enriched.filter((item) => item.signedAmount < 0).reduce((total, item) => total + item.signedAmount, 0));
  const netProfit = totalReceita - totalExpense;
  const grossMargin = totalReceita > 0 ? (netProfit / totalReceita) * 100 : 0;
  const monthly = new Map<string, number>();

  enriched.forEach(({ row, signedAmount }) => {
    const month = toText(getColumn(row, ["mes", "mês"])) || "0";
    monthly.set(month, (monthly.get(month) ?? 0) + Math.max(signedAmount, 0));
  });

  const expenses = topGroups(rows, ["centro de custo", "dre", "tipo lancamento", "tipo lançamento"], ["valor real", "valor"]);
  const expenseTotal = expenses.reduce((total, [, value]) => total + value, 0) || 1;

  return {
    kpis: [
      { icon: "payments", label: "Receita", value: formatCurrency(totalReceita), delta: `${rows.length} rows`, tone: "text-status-success", border: "border-secondary", progress: 82 },
      { icon: "query_stats", label: "EBITDA", value: formatCurrency(netProfit), delta: `${grossMargin.toFixed(1)}%`, tone: grossMargin >= 0 ? "text-secondary" : "text-status-critical", border: "border-primary", progress: Math.max(0, Math.min(Math.round(grossMargin), 100)) },
      { icon: "account_balance_wallet", label: "Lucro l?quido", value: formatCurrency(netProfit), delta: "importa??o real", tone: netProfit >= 0 ? "text-status-success" : "text-status-critical", border: netProfit >= 0 ? "border-secondary-container" : "border-status-critical", progress: 58 },
      { icon: "sync_alt", label: "Fluxo de caixa", value: formatCurrency(netProfit), delta: netProfit >= 0 ? "positivo" : "negativo", tone: netProfit >= 0 ? "text-status-success" : "text-status-critical", border: netProfit >= 0 ? "border-status-success" : "border-status-critical", progress: 71 },
      { icon: "stacked_line_chart", label: "Margem bruta", value: `${grossMargin.toFixed(1)}%`, delta: "DRE CSV", tone: grossMargin >= 0 ? "text-status-success" : "text-status-critical", border: "border-outline-variant", progress: Math.max(0, Math.min(Math.round(grossMargin), 100)) },
      { icon: "receipt_long", label: "Custo operacional", value: formatCurrency(totalExpense), delta: "importa??o real", tone: "text-status-critical", border: "border-status-critical", progress: 44 },
    ],
    revenueEvolution: scaleSeries(Array.from(monthly.values())),
    profitTrend: scaleSeries(Array.from(monthly.values()).map((value) => value - totalExpense / Math.max(monthly.size, 1)), 38, 74),
    expenseDistribution: expenses.map(([label, value], index) => [label, formatCurrency(value), Math.round((value / expenseTotal) * 100), colors[index] ?? "bg-outline"]),
    costCenters: expenses.map(([label, value]) => [label, formatCurrency(value), `${Math.round((value / expenseTotal) * 100)}%`, "real"]),
    cashFlow: [
      ["Entradas operacionais", formatCurrency(totalReceita), 84, "bg-status-success"],
      ["Operating Outflow", formatCurrency(totalExpense), 58, "bg-status-critical"],
      ["Linhas importadas", formatNumber(rows.length), 100, "bg-secondary"],
      ["Projected Balance", formatCurrency(netProfit), Math.max(0, Math.min(Math.round(grossMargin), 100)), "bg-primary"],
    ],
    insights: [
      { icon: "data_object", label: "Real Data Loaded", text: `${rows.length} DRE rows are driving the financial KPIs, charts and tables.`, tone: "text-secondary", bg: "bg-secondary-container/10" },
      { icon: "monitoring", label: "Concentra??o de custo", text: `${expenses[0]?.[0] ?? "Principal centro"} is the largest mapped expense group in the imported file.`, tone: "text-status-critical", bg: "bg-erro-container/40" },
      { icon: "shield", label: "Validação Signal", text: "Values were parsed from Brazilian currency format and routed by Entrada/Saida transaction type.", tone: "text-status-critical", bg: "bg-status-critical/10" },
      { icon: "stars", label: "Destaque estratégico", text: `Real imported gross margin is ${grossMargin.toFixed(1)}%.`, tone: "text-status-success", bg: "bg-status-success/10" },
    ],
    tableRows: [
      ["Imported DRE", "Transactions", `${formatNumber(rows.length)} registros`, "real", "Mapeado"],
      ["Receitas Operacionais", "Contas", formatCurrency(totalReceita), "real", "Ativo"],
      ["Custos e Despesas", "Expenses", formatCurrency(totalExpense), "real", "Atenção"],
      ["Centros de Custo", "Centros de custo", `${expenses.length} grupos`, "real", "Ativo"],
      ["Resultado Importado", "Compara??es mensais", formatCurrency(netProfit), "real", netProfit >= 0 ? "Adiantado" : "Risco"],
    ],
  };
}

export function buildHrAnalyticsView(rows: SpreadsheetRow[]): HrAnalyticsView {
  if (rows.length === 0) {
    return hrFallback;
  }

  const departments = topGroups(rows, ["departamento", "setor", "funcao", "função", "cargo"], ["valor", "horas", "dias"], 5);
  const total = rows.length;

  return {
    ...hrFallback,
    kpis: [
      { icon: "groups", label: "Imported People Linhas", value: formatNumber(total), delta: "upload", tone: "text-status-success", border: "border-secondary", progress: 78 },
      { icon: "person_remove", label: "Turnover Signals", value: formatNumber(rows.filter((row) => JSON.stringify(row).toLowerCase().includes("demiss")).length), delta: "mapped", tone: "text-status-critical", border: "border-status-critical", progress: 48 },
      { icon: "event_busy", label: "Absence Signals", value: formatNumber(rows.filter((row) => JSON.stringify(row).toLowerCase().includes("atestado")).length), delta: "mapped", tone: "text-status-critical", border: "border-status-success", progress: 36 },
      ...hrFallback.kpis.slice(3),
    ],
    hiringTrend: scaleSeries(rows.slice(0, 12).map((_, index) => index + 1), 30, 84),
    employeeDistribution: departments.map(([label, value], index) => [label, formatNumber(Math.round(value || total / 5)), Math.max(8, Math.round(((value || 1) / Math.max(departments.reduce((sum, [, groupValue]) => sum + groupValue, 0), 1)) * 100)), colors[index] ?? "bg-outline"]),
    tableRows: [["Imported HR Workbook", "Employees", `${formatNumber(total)} rows`, "real", "Ativo"], ...hrFallback.tableRows.slice(1)],
  };
}

export function buildPurchasingAnalyticsView(rows: SpreadsheetRow[]): PurchasingAnalyticsView {
  if (rows.length === 0) {
    return purchasingFallback;
  }

  const spend = topGroups(rows, ["categoria", "fornecedor", "dre", "centro"], ["valor real", "valor", "amount"]);
  const totalSpend = spend.reduce((total, [, value]) => total + value, 0) || rows.length;

  return {
    ...purchasingFallback,
    kpis: [
      { icon: "shopping_cart", label: "Total Purchasing", value: formatCurrency(totalSpend), delta: `${rows.length} rows`, tone: "text-status-success", border: "border-secondary", progress: 82 },
      { icon: "gpp_maybe", label: "Supplier Risco", value: "Mapeado", delta: "importa??o real", tone: "text-secondary", border: "border-status-critical", progress: 52 },
      ...purchasingFallback.kpis.slice(2),
    ],
    purchasingEvolution: scaleSeries(spend.map(([, value]) => value)),
    categorySpend: spend.map(([label, value], index) => [label, formatCurrency(value), Math.round((value / totalSpend) * 100), colors[index] ?? "bg-outline"]),
    supplierRanking: spend.map(([label, value]) => [label, formatCurrency(value), "real", "Mapeado"]),
    tableRows: [["Imported Purchasing Data", "Fornecedores", `${formatNumber(rows.length)} rows`, "real", "Mapeado"], ...purchasingFallback.tableRows.slice(1)],
  };
}

export function buildOperationsAnalyticsView(rows: SpreadsheetRow[]): OperationsAnalyticsView {
  if (rows.length === 0) {
    return operationsFallback;
  }

  const groups = topGroups(rows, ["linha", "maquina", "máquina", "centro", "tipo"], ["quantidade", "valor", "horas", "minutos"]);

  return {
    ...operationsFallback,
    kpis: [
      { icon: "precision_manufacturing", label: "Imported Ops Linhas", value: formatNumber(rows.length), delta: "upload", tone: "text-status-success", border: "border-secondary", progress: 76 },
      { icon: "speed", label: "Operational Signals", value: formatNumber(groups.length), delta: "mapped", tone: "text-secondary", border: "border-status-success", progress: 68 },
      ...operationsFallback.kpis.slice(2),
    ],
    productionTrend: scaleSeries(groups.map(([, value]) => value || 1)),
    downtimeAnalysis: groups.map(([label, value], index) => [label, formatNumber(Math.round(value || rows.length)), Math.max(8, Math.round(((value || 1) / Math.max(groups.reduce((sum, [, groupValue]) => sum + groupValue, 0), 1)) * 100)), colors[index] ?? "bg-outline"]),
    linePerformance: groups.map(([label, value]) => [label, `${Math.round(value || rows.length)} pts`, "real", "Mapeado"]),
    tableRows: [["Imported Operations Data", "Production Orders", `${formatNumber(rows.length)} rows`, "real", "Mapeado"], ...operationsFallback.tableRows.slice(1)],
  };
}


