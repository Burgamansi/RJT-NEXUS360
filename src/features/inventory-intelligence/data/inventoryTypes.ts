export type InventoryItem = {
  sku: string;
  category: "Materia-prima" | "Produto em Processo" | "Material Acabado";
  abcClass: "A" | "B" | "C" | "Sem Movimento" | "Estrategico";
  previousValue: number;
  finalValue: number;
  stockDays: number;
  turnoverIndex: number;
  criticality: "healthy" | "watch" | "critical" | "protected";
};

export type InventoryKpi = {
  icon: string;
  label: string;
  value: string;
  delta: string;
  tone: string;
  border: string;
  progress: number;
};

export type InventoryDistributionItem = readonly [label: string, value: string, percentage: number, color: string];
export type AbcCurveItem = readonly [name: string, value: string, movement: string, status: string];
export type InventoryHealthItem = readonly [label: string, value: string, progress: number, color: string];
export type InventoryTableRow = readonly [line: string, section: string, value: string, movement: string, status: string];

export type InventoryInsight = {
  icon: string;
  label: string;
  text: string;
  tone: string;
  bg: string;
};

export type InventoryAnalyticsView = {
  kpis: InventoryKpi[];
  stockTrend: number[];
  consumptionTrend: number[];
  turnoverTrend: number[];
  stockComposition: InventoryDistributionItem[];
  abcCurve: AbcCurveItem[];
  inventoryHealth: InventoryHealthItem[];
  insights: InventoryInsight[];
  tableRows: InventoryTableRow[];
};


