export type HrMonthlyConsolidated = {
  month: string;
  headcount: number;
  workedHours: number;
  hires: number;
  terminations: number;
  turnoverRate: number;
  turnoverTarget: number;
  justifiedHours: number;
  unjustifiedHours: number;
  delayHours: number;
};

export type HrTerminationRecord = {
  employee: string;
  role: string;
  date: string;
  company: string;
  reason: string;
};

export type HrAbsenceRecord = {
  category: string;
  month: string;
  days: number;
  employee: string;
};

export type HrKpi = {
  icon: string;
  label: string;
  value: string;
  delta: string;
  tone: string;
  border: string;
  progress: number;
};

export type HrDistributionItem = readonly [label: string, value: string, percentage: number, color: string];
export type HrDepartmentPerformance = readonly [name: string, score: string, staffing: string, variance: string];
export type HrTrainingItem = readonly [label: string, value: string, progress: number, color: string];
export type HrCompetencyItem = readonly [name: string, score: string, change: string];
export type HrTableRow = readonly [line: string, section: string, value: string, score: string, status: string];

export type HrInsight = {
  icon: string;
  label: string;
  text: string;
  tone: string;
  bg: string;
};

export type HrAnalyticsView = {
  kpis: HrKpi[];
  hiringTrend: number[];
  turnoverTrend: number[];
  absenteeismTrend: number[];
  employeeDistribution: HrDistributionItem[];
  departmentPerformance: HrDepartmentPerformance[];
  trainingMatrix: HrTrainingItem[];
  competencies: HrCompetencyItem[];
  insights: HrInsight[];
  tableRows: HrTableRow[];
};
