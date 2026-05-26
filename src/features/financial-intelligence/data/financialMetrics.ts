import { financialEntries } from "./financialSampleData";
import type { FinancialAnalyticsView, FinancialEntry } from "./financialTypes";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  maximumFractionDigits: 0,
  style: "currency",
});

const formatCurrency = (value: number) => currencyFormatter.format(value);
const sum = (entries: FinancialEntry[]) => entries.reduce((total, entry) => total + entry.realizedAmount, 0);
const revenues = financialEntries.filter((entry) => entry.realizedAmount > 0);
const expenses = financialEntries.filter((entry) => entry.realizedAmount < 0);
const totalRevenue = sum(revenues);
const totalExpense = Math.abs(sum(expenses));
const netProfit = totalRevenue - totalExpense;
const grossMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
const ebitda = netProfit;
const cashFlowTotal = sum(financialEntries);

const scaleSeries = (values: number[], minHeight = 28, maxHeight = 92) => {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return values.map(() => Math.round((minHeight + maxHeight) / 2));
  }

  return values.map((value) => Math.round(minHeight + ((value - min) / (max - min)) * (maxHeight - minHeight)));
};

const monthlyRevenue = [820000, 890000, 1012000];
const monthlyProfit = [582000, 563000, 757000];
const expensesByGroup = [
  { label: "Pessoas", value: 238000, color: "bg-primary" },
  { label: "Operacoes", value: 327000, color: "bg-secondary" },
  { label: "Administrativo", value: 151000, color: "bg-secondary-container" },
  { label: "Logistica", value: 104000, color: "bg-outline" },
];

export const financialAnalyticsView: FinancialAnalyticsView = {
  kpis: [
    { icon: "payments", label: "Revenue", value: formatCurrency(totalRevenue), delta: "+23.4%", tone: "text-status-success", border: "border-secondary", progress: 82 },
    { icon: "query_stats", label: "EBITDA", value: formatCurrency(ebitda), delta: `${grossMargin.toFixed(1)}%`, tone: "text-secondary", border: "border-primary", progress: Math.min(Math.round(grossMargin), 100) },
    { icon: "account_balance_wallet", label: "Net Profit", value: formatCurrency(netProfit), delta: "+11.7%", tone: "text-status-success", border: "border-secondary-container", progress: 58 },
    { icon: "sync_alt", label: "Cash Flow", value: formatCurrency(cashFlowTotal), delta: cashFlowTotal >= 0 ? "positivo" : "negativo", tone: cashFlowTotal >= 0 ? "text-status-success" : "text-status-critical", border: cashFlowTotal >= 0 ? "border-status-success" : "border-status-critical", progress: 71 },
    { icon: "stacked_line_chart", label: "Gross Margin", value: `${grossMargin.toFixed(1)}%`, delta: "+2.1pp", tone: "text-status-success", border: "border-outline-variant", progress: Math.min(Math.round(grossMargin), 100) },
    { icon: "receipt_long", label: "Operational Cost", value: formatCurrency(totalExpense), delta: "+6.4%", tone: "text-status-critical", border: "border-status-critical", progress: 44 },
  ],
  revenueEvolution: scaleSeries(monthlyRevenue),
  profitTrend: scaleSeries(monthlyProfit, 38, 74),
  expenseDistribution: expensesByGroup.map((item) => [item.label, formatCurrency(item.value), Math.round((item.value / totalExpense) * 100), item.color]),
  costCenters: [
    ["Operacoes", formatCurrency(327000), "39.9%", "+4.6%"],
    ["Pessoas", formatCurrency(238000), "29.0%", "+0.8%"],
    ["Administrativo", formatCurrency(151000), "18.4%", "+3.3%"],
    ["Logistica", formatCurrency(104000), "12.7%", "+6.1%"],
  ],
  cashFlow: [
    ["Operating Inflow", formatCurrency(totalRevenue), 84, "bg-status-success"],
    ["Operating Outflow", formatCurrency(totalExpense), 58, "bg-status-critical"],
    ["Liquidity Coverage", "A definir", 0, "bg-secondary"],
    ["Projected Balance", "A definir", 0, "bg-primary"],
  ],
  insights: [
    { icon: "psychology", label: "AI Recommendation", text: "Separar custos operacionais por centro de custo antes de automatizar a leitura completa do DRE.", tone: "text-secondary", bg: "bg-secondary-container/10" },
    { icon: "monitoring", label: "Anomaly Detection", text: "Realizado acima do previsto aparece em materia-prima, frete e servicos administrativos na amostra local.", tone: "text-status-critical", bg: "bg-error-container/40" },
    { icon: "shield", label: "Risk Alert", text: "Fluxo de caixa positivo na amostra, mas cobertura de liquidez ainda depende de saldo bancario inicial.", tone: "text-status-critical", bg: "bg-status-critical/10" },
    { icon: "stars", label: "Strategic Highlight", text: `Margem bruta simulada em ${grossMargin.toFixed(1)}% com base no arquivo financeiro local.`, tone: "text-status-success", bg: "bg-status-success/10" },
  ],
  tableRows: [
    ["Receitas Operacionais", "Accounts", formatCurrency(totalRevenue), "+23.4%", "Healthy"],
    ["Lancamentos DRE", "Transactions", `${financialEntries.length} registros`, "+0.0%", "Mapped"],
    ["Custos e Despesas", "Expenses", formatCurrency(totalExpense), "+6.4%", "Watch"],
    ["Centros de Custo", "Cost Centers", "4 centros", "+0.0%", "Active"],
    ["Resultado Mensal", "Monthly Comparisons", formatCurrency(netProfit), "+11.7%", "Ahead"],
  ],
};
