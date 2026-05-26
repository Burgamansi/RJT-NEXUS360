export type FinancialEntry = {
  postingDate: string;
  launchType: "receita" | "despesa" | "custo" | "transferencia";
  costCode: string;
  account: string;
  document: string;
  party: string;
  amount: number;
  dueDate: string;
  notes: string;
  realizedAmount: number;
};

export type FinancialKpi = {
  icon: string;
  label: string;
  value: string;
  delta: string;
  tone: string;
  border: string;
  progress: number;
};

export type FinancialDistributionItem = readonly [label: string, value: string, percentage: number, color: string];
export type CostCenterItem = readonly [name: string, amount: string, share: string, variance: string];
export type CashFlowItem = readonly [label: string, value: string, progress: number, color: string];
export type FinancialTableRow = readonly [line: string, section: string, value: string, variance: string, status: string];

export type FinancialInsight = {
  icon: string;
  label: string;
  text: string;
  tone: string;
  bg: string;
};

export type FinancialAnalyticsView = {
  kpis: FinancialKpi[];
  revenueEvolution: number[];
  profitTrend: number[];
  expenseDistribution: FinancialDistributionItem[];
  costCenters: CostCenterItem[];
  cashFlow: CashFlowItem[];
  insights: FinancialInsight[];
  tableRows: FinancialTableRow[];
};


