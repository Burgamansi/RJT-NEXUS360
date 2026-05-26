export type CommercialRecord = {
  customer: string;
  productLine: string;
  revenue: number;
  units: number;
  marginRate: number;
  recurrence: "Mensal" | "Bimestral" | "Semestral" | "Anual" | "Projeto";
  channel: string;
  status: "recorrente" | "pipeline" | "watch" | "leader";
};

export type CommercialKpi = {
  icon: string;
  label: string;
  value: string;
  delta: string;
  tone: string;
  border: string;
  progress: number;
};

export type CommercialDistributionItem = readonly [label: string, value: string, percentage: number, color: string];
export type CustomerRankingItem = readonly [name: string, revenue: string, share: string, recurrence: string];
export type OpenOrderItem = readonly [label: string, value: string, progress: number, color: string];
export type CommercialTableRow = readonly [line: string, section: string, value: string, metric: string, status: string];
export type RecurrenceItem = readonly [label: string, value: string, progress: number];

export type CommercialInsight = {
  icon: string;
  label: string;
  text: string;
  tone: string;
  bg: string;
};

export type CommercialAnalyticsView = {
  kpis: CommercialKpi[];
  revenueTrend: number[];
  volumeTrend: number[];
  marginTrend: number[];
  productReceita: CommercialDistributionItem[];
  customerRanking: CustomerRankingItem[];
  openOrders: OpenOrderItem[];
  recurrenceLinhas: RecurrenceItem[];
  insights: CommercialInsight[];
  tableRows: CommercialTableRow[];
};


