export type Domain = "finance" | "rh" | "operations" | "unknown";
export type DataType = "dre" | "absenteeism" | "production" | "unknown";

export interface NormalizedRecord {
  referenceDate: string;
  domain: Domain;
  type: DataType;
  data: any;
}

export interface MetricResult {
  metricName: string;
  period: string;
  value: number;
}

export interface MetricValue {
  [key: string]: number | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
