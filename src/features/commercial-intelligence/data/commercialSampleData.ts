import type { CommercialRecord } from "./commercialTypes";

export const commercialRecords: CommercialRecord[] = [
  { customer: "Curimbaba", productLine: "Big Bag Standard", revenue: 286800, units: 6800, marginRate: 33.2, recurrence: "Mensal", channel: "Direto", status: "recorrente" },
  { customer: "Mineracao Jundu", productLine: "Big Bag Laminado", revenue: 214500, units: 5100, marginRate: 31.4, recurrence: "Mensal", channel: "Direto", status: "recorrente" },
  { customer: "Saint Gobain", productLine: "Big Bag Ventilado", revenue: 188200, units: 4400, marginRate: 29.8, recurrence: "Mensal", channel: "Portal", status: "watch" },
  { customer: "Elfusa", productLine: "Sling Bag", revenue: 156900, units: 3700, marginRate: 30.6, recurrence: "Bimestral", channel: "Direto", status: "recorrente" },
  { customer: "Grace", productLine: "Projetos Especiais", revenue: 142400, units: 3000, marginRate: 34.1, recurrence: "Projeto", channel: "Projeto", status: "pipeline" },
];

export const openCommercialPipeline = [
  { label: "Carteira Confirmada", value: 684000, progress: 76, color: "bg-primary" },
  { label: "Provisao Comercial", value: 416000, progress: 62, color: "bg-secondary" },
  { label: "Pedidos Terceiros", value: 218000, progress: 38, color: "bg-secondary-container" },
  { label: "Aguardando Aprovacao", value: 146000, progress: 24, color: "bg-status-critical" },
];
