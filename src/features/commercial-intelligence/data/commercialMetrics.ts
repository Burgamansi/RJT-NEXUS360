import { commercialRecords, openCommercialPipeline } from "./commercialSampleData";
import type { CommercialAnalyticsView } from "./commercialTypes";

const currency = new Intl.NumberFormat("pt-BR", { currency: "BRL", maximumFractionDigits: 0, style: "currency" });
const decimalCurrency = new Intl.NumberFormat("pt-BR", { currency: "BRL", maximumFractionDigits: 2, minimumFractionDigits: 2, style: "currency" });
const numberFormat = new Intl.NumberFormat("pt-BR");

const formatCurrency = (value: number) => currency.format(value);
const totalReceita = commercialRecords.reduce((total, record) => total + record.revenue, 0);
const totalUnits = commercialRecords.reduce((total, record) => total + record.units, 0);
const ticketAverage = totalReceita / totalUnits;
const averageMargin = commercialRecords.reduce((total, record) => total + record.marginRate, 0) / commercialRecords.length;
const openOrdersTotal = openCommercialPipeline.reduce((total, item) => total + item.value, 0);
const monthlyReceita = commercialRecords.filter((record) => record.recurrence === "Mensal").reduce((total, record) => total + record.revenue, 0);
const monthlyShare = Math.round((monthlyReceita / totalReceita) * 100);

const scaleSeries = (values: number[], minHeight = 42, maxHeight = 88) => {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return values.map(() => Math.round((minHeight + maxHeight) / 2));
  }

  return values.map((value) => Math.round(minHeight + ((value - min) / (max - min)) * (maxHeight - minHeight)));
};

const revenueByProduct = commercialRecords.reduce<Record<string, number>>((groups, record) => {
  groups[record.productLine] = (groups[record.productLine] ?? 0) + record.revenue;
  return groups;
}, {});

export const commercialAnalyticsView: CommercialAnalyticsView = {
  kpis: [
    { icon: "paid", label: "Faturamento", value: formatCurrency(totalReceita), delta: "+8.4%", tone: "text-status-success", border: "border-secondary", progress: 82 },
    { icon: "inventory_2", label: "Volume de Venda", value: numberFormat.format(totalUnits), delta: "+6.1%", tone: "text-status-success", border: "border-status-success", progress: 76 },
    { icon: "sell", label: "Ticket Medio", value: decimalCurrency.format(ticketAverage), delta: "+2.8%", tone: "text-secondary", border: "border-primary", progress: 64 },
    { icon: "pending_actions", label: "Pedidos em Aberto", value: formatCurrency(openOrdersTotal), delta: "pipeline", tone: "text-status-critical", border: "border-status-critical", progress: 58 },
    { icon: "stacked_bar_chart", label: "Margem de Venda", value: `${averageMargin.toFixed(1)}%`, delta: "+1.9pp", tone: "text-status-success", border: "border-secondary-container", progress: 71 },
    { icon: "request_quote", label: "Orcamentos", value: "A definir", delta: "sem fonte", tone: "text-outline", border: "border-outline-variant", progress: 0 },
  ],
  revenueTrend: scaleSeries(commercialRecords.map((record) => record.revenue)),
  volumeTrend: scaleSeries(commercialRecords.map((record) => record.units), 42, 81),
  marginTrend: scaleSeries(commercialRecords.map((record) => record.marginRate), 54, 70),
  productReceita: Object.entries(revenueByProduct).map(([label, value], index) => [
    label,
    formatCurrency(value),
    Math.round((value / totalReceita) * 100),
    ["bg-primary", "bg-secondary", "bg-secondary-container", "bg-outline", "bg-surface-tint"][index] ?? "bg-outline",
  ]),
  customerRanking: commercialRecords.map((record) => [record.customer, formatCurrency(record.revenue), `${((record.revenue / totalReceita) * 100).toFixed(1)}%`, record.recurrence]),
  openOrders: openCommercialPipeline.map((item) => [item.label, formatCurrency(item.value), item.progress, item.color]),
  recurrenceLinhas: [["Mensal", `${monthlyShare}%`, monthlyShare], ["Bimestral", "16%", 16], ["Anual", "0%", 0], ["Semestral", "0%", 0]],
  insights: [
    { icon: "psychology", label: "AI Commercial Recommendation", text: "Priorizar clientes mensais com margem acima de 30% e pedidos recorrentes para proteger o faturamento projetado.", tone: "text-secondary", bg: "bg-secondary-container/10" },
    { icon: "monitoring", label: "Margin Alert", text: "Pedidos de terceiros devem ser avaliados contra margem media antes de comprometer capacidade produtiva.", tone: "text-status-critical", bg: "bg-erro-container/40" },
    { icon: "warning", label: "Pipeline Risco", text: "Parte da meta depende de carteira aberta; usar status do pedido para separar confirmado de provisao.", tone: "text-status-critical", bg: "bg-status-critical/10" },
    { icon: "stars", label: "Destaque estratégico", text: `Clientes com periodicidade mensal concentram ${monthlyShare}% do faturamento da amostra comercial.`, tone: "text-status-success", bg: "bg-status-success/10" },
  ],
  tableRows: [
    [commercialRecords[0].customer, "Ranking Clientes", formatCurrency(commercialRecords[0].revenue), `${((commercialRecords[0].revenue / totalReceita) * 100).toFixed(1)}%`, "Recorrente"],
    ["Big Bag Standard", "Tipo de Big Bag", formatCurrency(revenueByProduct["Big Bag Standard"] ?? 0), `${Math.round(((revenueByProduct["Big Bag Standard"] ?? 0) / totalReceita) * 100)}%`, "Lider"],
    ["Pedidos Comerciais", "Pedidos em Aberto", formatCurrency(openOrdersTotal), "pipeline", "Pipeline"],
    ["Mensal", "Periodicidade", `${monthlyShare}%`, "+4.1pp", "Core"],
    ["Portal Saint Gobain", "Orcamentos", "A definir", "Em analise", "Atenção"],
  ],
};


