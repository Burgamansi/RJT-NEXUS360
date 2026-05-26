import { inventoryItems } from "./inventorySampleData";
import type { InventoryAnalyticsView, InventoryItem } from "./inventoryTypes";

const currency = new Intl.NumberFormat("pt-BR", { currency: "BRL", maximumFractionDigits: 0, style: "currency" });
const formatCurrency = (value: number) => currency.format(value);
const totalFinal = inventoryItems.reduce((total, item) => total + item.finalValue, 0);
const totalPrevious = inventoryItems.reduce((total, item) => total + item.previousValue, 0);
const totalMovement = totalFinal - totalPrevious;
const movementRate = (totalMovement / totalPrevious) * 100;
const rawMaterial = inventoryItems.filter((item) => item.category === "Materia-prima");
const wip = inventoryItems.filter((item) => item.category === "Produto em Processo");
const finishedGoods = inventoryItems.filter((item) => item.category === "Material Acabado");

const sumFinal = (items: InventoryItem[]) => items.reduce((total, item) => total + item.finalValue, 0);
const sumPrevious = (items: InventoryItem[]) => items.reduce((total, item) => total + item.previousValue, 0);
const variation = (items: InventoryItem[]) => sumFinal(items) - sumPrevious(items);
const variationPercent = (items: InventoryItem[]) => (variation(items) / sumPrevious(items)) * 100;

const scaleSeries = (values: number[], minHeight = 40, maxHeight = 84) => {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return values.map(() => Math.round((minHeight + maxHeight) / 2));
  }

  return values.map((value) => Math.round(minHeight + ((value - min) / (max - min)) * (maxHeight - minHeight)));
};

const groupByAbc = inventoryItems.reduce<Record<string, InventoryItem[]>>((groups, item) => {
  groups[item.abcClass] = [...(groups[item.abcClass] ?? []), item];
  return groups;
}, {});

const abcStatus = (abcClass: string) => {
  if (abcClass === "A") return "Critical";
  if (abcClass === "Sem Movimento") return "Review";
  if (abcClass === "Estrategico") return "Protected";
  return "Stable";
};

const stockComposition = [
  { label: "Materia-prima", items: rawMaterial, color: "bg-primary" },
  { label: "Produto em Processo", items: wip, color: "bg-secondary" },
  { label: "Material Acabado", items: finishedGoods, color: "bg-secondary-container" },
];

export const inventoryAnalyticsView: InventoryAnalyticsView = {
  kpis: [
    { icon: "inventory_2", label: "Total Stock Value", value: formatCurrency(totalFinal), delta: formatCurrency(totalMovement), tone: totalMovement <= 0 ? "text-status-success" : "text-status-critical", border: "border-secondary", progress: 71 },
    { icon: "category", label: "Raw Material", value: formatCurrency(sumFinal(rawMaterial)), delta: `${variationPercent(rawMaterial).toFixed(1)}%`, tone: variation(rawMaterial) <= 0 ? "text-status-success" : "text-status-critical", border: "border-status-success", progress: 82 },
    { icon: "precision_manufacturing", label: "WIP", value: formatCurrency(sumFinal(wip)), delta: `${variationPercent(wip).toFixed(1)}%`, tone: variation(wip) <= 0 ? "text-status-success" : "text-status-critical", border: "border-status-critical", progress: 42 },
    { icon: "inventory", label: "Finished Goods", value: formatCurrency(sumFinal(finishedGoods)), delta: `${variationPercent(finishedGoods).toFixed(1)}%`, tone: variation(finishedGoods) <= 0 ? "text-status-success" : "text-status-critical", border: "border-primary", progress: 38 },
    { icon: "abc", label: "ABC Exposure", value: "Classe A", delta: `${Math.round(((groupByAbc.A?.reduce((total, item) => total + item.finalValue, 0) ?? 0) / totalFinal) * 100)}% value`, tone: "text-secondary", border: "border-secondary-container", progress: 81 },
    { icon: "sync_alt", label: "Stock Movement", value: `${movementRate.toFixed(1)}%`, delta: "vs prior month", tone: movementRate <= 0 ? "text-status-success" : "text-status-critical", border: "border-outline-variant", progress: 56 },
  ],
  stockTrend: scaleSeries(inventoryItems.map((item) => item.finalValue), 66, 82),
  consumptionTrend: scaleSeries(inventoryItems.map((item) => item.turnoverIndex), 48, 84),
  turnoverTrend: scaleSeries(inventoryItems.map((item) => item.stockDays), 40, 53),
  stockComposition: stockComposition.map(({ label, items, color }) => [label, formatCurrency(sumFinal(items)), Math.round((sumFinal(items) / totalFinal) * 100), color]),
  abcCurve: Object.entries(groupByAbc).map(([name, items]) => {
    const move = variation(items);
    return [`Curva ${name}`, formatCurrency(sumFinal(items)), formatCurrency(move), abcStatus(name)];
  }),
  inventoryHealth: [
    ["Stock Coverage", "42 days", 68, "bg-primary"],
    ["Raw Material Availability", "91.4%", 91, "bg-status-success"],
    ["Slow-Moving Items", formatCurrency(sumFinal(groupByAbc["Sem Movimento"] ?? [])), 28, "bg-status-critical"],
    ["Purchase Replenishment", "76.2%", 76, "bg-secondary"],
  ],
  insights: [
    { icon: "psychology", label: "AI Stock Recommendation", text: "Rebalancear itens de baixo giro antes do proximo ciclo de compras para reduzir capital parado.", tone: "text-secondary", bg: "bg-secondary-container/10" },
    { icon: "warning", label: "Inventory Risk", text: "Produto em processo aumentou enquanto material acabado caiu, sinalizando possivel desequilibrio de fluxo produtivo.", tone: "text-status-critical", bg: "bg-error-container/40" },
    { icon: "monitoring", label: "Consumption Anomaly", text: "Consumo de materia-prima deve ser comparado ao volume comercial para validar pressao de estoque.", tone: "text-status-critical", bg: "bg-status-critical/10" },
    { icon: "stars", label: "Strategic Highlight", text: `Estoque total variou ${formatCurrency(totalMovement)} preservando disponibilidade de materia-prima acima de 90%.`, tone: "text-status-success", bg: "bg-status-success/10" },
  ],
  tableRows: [
    ["Materia-prima", "Stock Category", formatCurrency(sumFinal(rawMaterial)), formatCurrency(variation(rawMaterial)), "Healthy"],
    ["Produto em Processo", "WIP", formatCurrency(sumFinal(wip)), formatCurrency(variation(wip)), "Watch"],
    ["Material Acabado", "Finished Goods", formatCurrency(sumFinal(finishedGoods)), formatCurrency(variation(finishedGoods)), "Reduced"],
    ["Curva A", "ABC Analysis", formatCurrency(sumFinal(groupByAbc.A ?? [])), formatCurrency(variation(groupByAbc.A ?? [])), "Critical"],
    ["Itens Sem Movimento", "Stock Aging", formatCurrency(sumFinal(groupByAbc["Sem Movimento"] ?? [])), formatCurrency(variation(groupByAbc["Sem Movimento"] ?? [])), "Review"],
  ],
};
