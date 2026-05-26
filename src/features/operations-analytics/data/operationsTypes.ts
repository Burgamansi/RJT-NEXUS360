export type ProductionRecord = {
  productionOrder: string;
  line: string;
  machine: string;
  plannedUnits: number;
  producedUnits: number;
  scrapUnits: number;
  plannedMinutes: number;
  downtimeMinutes: number;
  cycleEfficiency: number;
  status: "released" | "running" | "watch" | "bottleneck";
};

export type DowntimeRecord = {
  reason: string;
  minutes: number;
  line: string;
};

export type OperationsKpi = {
  icon: string;
  label: string;
  value: string;
  delta: string;
  tone: string;
  border: string;
  progress: number;
};

export type OperationsDistributionItem = readonly [label: string, value: string, percentage: number, color: string];
export type LinePerformanceItem = readonly [name: string, efficiency: string, oee: string, status: string];
export type ProductionMonitoringItem = readonly [label: string, value: string, progress: number, color: string];
export type OperationsTableRow = readonly [line: string, section: string, value: string, metric: string, status: string];

export type OperationsInsight = {
  icon: string;
  label: string;
  text: string;
  tone: string;
  bg: string;
};

export type OperationsAnalyticsView = {
  kpis: OperationsKpi[];
  productionTrend: number[];
  efficiencyTrend: number[];
  downtimeTrend: number[];
  downtimeAnalysis: OperationsDistributionItem[];
  linePerformance: LinePerformanceItem[];
  productionMonitoring: ProductionMonitoringItem[];
  insights: OperationsInsight[];
  tableRows: OperationsTableRow[];
};
