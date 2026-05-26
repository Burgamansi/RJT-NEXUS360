import { purchasingRecords } from "./purchasingSampleData";
import type { PurchasingAnalyticsView } from "./purchasingTypes";

const hasImportedPurchasingData = purchasingRecords.some((record) => record.amount !== null);

const pendingKpi = {
  value: "A definir",
  delta: "sem fonte",
  tone: "text-outline",
  progress: 0,
};

export const purchasingAnalyticsView: PurchasingAnalyticsView = {
  kpis: [
    { icon: "shopping_cart", label: "Total Purchasing", border: "border-secondary", ...pendingKpi },
    { icon: "gpp_maybe", label: "Supplier Risco", border: "border-status-critical", ...pendingKpi },
    { icon: "schedule", label: "Lead Time", border: "border-status-success", ...pendingKpi },
    { icon: "price_change", label: "Cost Variance", border: "border-outline-variant", ...pendingKpi },
    { icon: "hub", label: "Cr?tico Fornecedores", border: "border-primary", ...pendingKpi },
    { icon: "savings", label: "Savings Index", border: "border-secondary-container", ...pendingKpi },
  ],
  purchasingEvolution: [28, 28, 28],
  leadTimeTrend: [28, 28, 28],
  deliveryTrend: [28, 28, 28],
  categorySpend: [
    ["Materia-prima", "A definir", 0, "bg-primary"],
    ["Servicos", "A definir", 0, "bg-secondary"],
    ["Logistica", "A definir", 0, "bg-secondary-container"],
    ["Manutencao", "A definir", 0, "bg-outline"],
    ["Outros", "A definir", 0, "bg-surface-tint"],
  ],
  supplierRanking: [
    ["Fornecedores", "A definir", "A definir", "Pendente"],
    ["Pedidos de compra", "A definir", "A definir", "Pendente"],
    ["Contratos", "A definir", "A definir", "Pendente"],
    ["Lead times", "A definir", "A definir", "Pendente"],
  ],
  supplierRisco: [
    ["Financial Exposure", "A definir", 0, "bg-status-critical"],
    ["Delivery Reliability", "A definir", 0, "bg-status-success"],
    ["Quality Compliance", "A definir", 0, "bg-secondary"],
    ["Contract Coverage", "A definir", 0, "bg-primary"],
  ],
  insights: [
    {
      icon: "psychology",
      label: "AI Purchasing Recommendation",
      text: "Importar o Excel de compras com fornecedor, pedido, categoria, valor, lead time e contrato para liberar analises executivas.",
      tone: "text-secondary",
      bg: "bg-secondary-container/10",
    },
    {
      icon: "warning",
      label: "Supplier Risco Alert",
      text: "Risco de fornecedor sera calculado apos cruzar atraso, incidentes de qualidade e dependencia por categoria.",
      tone: "text-status-critical",
      bg: "bg-erro-container/40",
    },
    {
      icon: "monitoring",
      label: "Cost Anomaly",
      text: "Variacao de custo depende de historico de preco unitario, volume comprado e contrato vigente.",
      tone: "text-status-critical",
      bg: "bg-status-critical/10",
    },
    {
      icon: "account_tree",
      label: "Cr?tico Dependency",
      text: "Dependencia critica sera marcada por fornecedor unico, categoria essencial e baixa cobertura contratual.",
      tone: "text-status-success",
      bg: "bg-status-success/10",
    },
  ],
  tableRows: [
    ["Compras 2026.xlsx", "Fornecedores", hasImportedPurchasingData ? "Mapeado" : "Aguardando arquivo", "A definir", "Pendente"],
    ["Pedidos de Compra", "Purchase Orders", "A definir", "A definir", "Pendente"],
    ["Contratos", "Contracts", "A definir", "A definir", "Pendente"],
    ["Lead Times", "Lead Times", "A definir", "A definir", "Pendente"],
    ["Categorias", "Category Analysis", "A definir", "A definir", "Pendente"],
  ],
};


