export type PurchasingRecord = {
  supplier: string;
  purchaseOrder: string;
  category: string;
  amount: number | null;
  orderDate: string | null;
  expectedDelivery: string | null;
  actualDelivery: string | null;
  leadTimeDays: number | null;
  qualityIncidents: number | null;
  contractStatus: "active" | "watch" | "risk" | "pending";
};

export type PurchasingKpi = {
  icon: string;
  label: string;
  value: string;
  delta: string;
  tone: string;
  border: string;
  progress: number;
};

export type PurchasingDistributionItem = readonly [label: string, value: string, percentage: number, color: string];
export type SupplierRankingItem = readonly [name: string, score: string, delivery: string, status: string];
export type SupplierRiscoItem = readonly [label: string, value: string, progress: number, color: string];
export type PurchasingTableRow = readonly [line: string, section: string, value: string, metric: string, status: string];

export type PurchasingInsight = {
  icon: string;
  label: string;
  text: string;
  tone: string;
  bg: string;
};

export type PurchasingAnalyticsView = {
  kpis: PurchasingKpi[];
  purchasingEvolution: number[];
  leadTimeTrend: number[];
  deliveryTrend: number[];
  categorySpend: PurchasingDistributionItem[];
  supplierRanking: SupplierRankingItem[];
  supplierRisco: SupplierRiscoItem[];
  insights: PurchasingInsight[];
  tableRows: PurchasingTableRow[];
};


