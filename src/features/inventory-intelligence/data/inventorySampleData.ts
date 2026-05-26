import type { InventoryItem } from "./inventoryTypes";

export const inventoryItems: InventoryItem[] = [
  { sku: "MP-PP-001", category: "Materia-prima", abcClass: "A", previousValue: 965400, finalValue: 886000, stockDays: 42, turnoverIndex: 4.8, criticality: "healthy" },
  { sku: "WIP-BB-014", category: "Produto em Processo", abcClass: "C", previousValue: 66900, finalValue: 85800, stockDays: 18, turnoverIndex: 3.2, criticality: "watch" },
  { sku: "FG-BB-STD", category: "Material Acabado", abcClass: "B", previousValue: 186500, finalValue: 116000, stockDays: 24, turnoverIndex: 5.1, criticality: "healthy" },
  { sku: "SM-OLD-009", category: "Materia-prima", abcClass: "Sem Movimento", previousValue: 49100, finalValue: 42100, stockDays: 120, turnoverIndex: 0.4, criticality: "critical" },
  { sku: "ST-KEY-003", category: "Materia-prima", abcClass: "Estrategico", previousValue: 76700, finalValue: 81500, stockDays: 60, turnoverIndex: 2.1, criticality: "protected" },
];
